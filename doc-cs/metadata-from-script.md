---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/load-metadata-script.html"
---

# Load metadata from script #

A Breeze app typically retrieves metadata from the server asynchronously. But the typical way is not the only way. 

This topic shows you how to **capture the metadata in a JSON file and load it synchronously at runtime**.


# Why? #

We think a .NET web service *should* support Breeze clients by exposing a "metadata" endpoint. That's what a Breeze.sharp client application expects out-of-the-box.

There is nothing wrong with this approach and it is all that many applications will ever need.

But retrieving metadata from the web service can be less than ideal for some applications and their developers. Because fetching metadata from the server is an asynchronous operation:

- the app may have to wait for metadata to arrive before it is useful; delay can be really annoying.

- we can't create entities until we have metadata; if we want to create entities first thing, before issuing any queries, we have to fetch metadata explictily.

- making the app wait for metadata adds complexity.

- the app can't function offline until it has metadata.
 
- many unit tests could be both synchronous and fast if only metadata were already available.

We can ameliorate these problems if metadata are readily available on the client when the application begins.

# Other Options #

We could load "launch data" (which includes metadata and lookup data) from local storage. That's a fast operation and it is synchronous on most platforms. 

While we heartily endorse this approach, it can't stand on its own because
 
- we have to stash the launch data in local storage first which means the app must run at least once "the old way"

- local storage might have been cleared. 

- updating the server metadata invalidates the local metadata.

- local storage access is asynchronous on some platforms (e.g, Windows Store apps). It's still faster than going remote. But the asynchronous protocol complicates production and test code.

*Another option*: we can <a href="/doc-cs/metadata-by-hand" title="Metadata By Hand">write the metadata by hand</a> and push it to the client in a script file. In fact, that's exactly what you'll do when your app talks to a non-.NET server or a server you can't touch.

But we'd rather use generated metadata when available. Coding metadata by hand - especially for a large model - is tedious, error prone, and requires on-going maintenance. Generated metadata is almost carefree and automatically in-sync with the evolving service model.

# Embed metadata in a text file #

We think the best approach is to capture and store the generated metadata in a variable in a "json" text file. The client application reads this file as a string or via a TextReader and imports the Metadata directly via 

    myEntityManager.MetadataStore.ImportMetadata(stringFromFile);
or

    myEntityManager.MetadataStore.ImportMetadata(myTextReader);

The metadata json file is always current because we regenerate it automatically when the web server starts. 

Best of all, it's easy to set up. Let's see how.
<a name="capture"></a>

# Capture the metadata (quick and dirty) #

We want to see benefits right away so we'll quickly assemble a *metadata.json* file by grabbing the metadata off the wire.

>We'll circle back and do this properly later in the story.

Here's the procedure:

1. Add a new text file to your project in some convenient location next to other client assets; we'll call ours *metadata.json*.

2. Launch the app to wake up the server and then set the browser address bar to the URL for the metadata endpoint. The browser tab might look a bit like this (with optional JSON formatting turned off):

    <img alt="Metadata on the wire" src="/images/metadataOnTheWire.png" style="width: 100%; max-width: 612px;" />

3. Copy the contents of the browser window (ctrl-A, ctrl-C) and paste (ctrl-V) them into *metadata.json*. You've just pasted in a huge JSON object on a single line.

4. Save the file ( optionally put it in IsolatedStorage)

5. Check it into source control (optional but well advised).

#### Import the *metadata.json* 

    using (var isoStream = new IsolatedStorageFileStream("metadata.json", FileMode.Open, isoStore))             {
        using (var reader = new StreamReader(isoStream)) {
            importData = reader.ReadToEnd();
        }
    }
            
    myEntityManager.MetadataStore.ImportMetadata(importData);


**That's all there is to it!** 

Your new *EntityManager* is primed with metadata and no longer requests metadata from the server ... a fact you can confirm by running your application and checking the network traffic. You will not see a call to the "metadata" endpoint.

<a name="writeMetadataJS"></a>

# A sustainable *metadata.json* #

We're a little uncomfortable with the way we created *metadata.json*.

We took a snapshot of the metadata as it is today. As the application evolves, the service model will evolve and the metadata will change. The metadata in our json file will be incorrect triggering a cascade of errors that may be hard to diagnose.

We can always recreate *metadata.json* by hand when we change the service model. That manual step is easily neglected. We'd sleep better if we automated the process, knowing that the client metadata are always in sync with our service model.

It's not hard to do, so let's do it. Our plan:

- Hook into the web server startup pipeline
- Call the server method that generates metadata for the client
- Capture that metadata output and (re)write *metadata.json* 

Notice that we (re)write *metadata.json* from the latest generated metadata ***before*** any client can download that script. Therefore every client will get the latest, greatest metadata.



# Review #

We can get metadata synchronously from a JSON file rather than  asynchronously through a service call. That makes the client-side developer's job a little easier and may help the application launch faster and run offline.

We can teach our app to load metadata from script in a few easy steps:

**On the server**

- generate metadata when the server starts
- write the metadata into a *metadata.js* file as a JSON object

**On the client**

- create a new `MetadataStore`
- import the JSON metadata object created by *metadata.js* 
- create a new `EntityManager` that uses this `metadataStore`.

The newly created `EntityManager` is ready to go and won't ever ask the server for metadata.