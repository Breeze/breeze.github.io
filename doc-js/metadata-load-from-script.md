---
layout: doc-js
redirect_from: "/old/documentation/load-metadata-script.html"
---
#Load metadata from script#

A Breeze app typically retrieves metadata from the server asynchronously. But the typical way is not the only way. 

This topic shows you how to **capture the metadata in a JavaScript file and load it synchronously at runtime**.

<p class="note">The code shown in this topic is adapted from the <a href="/samples/doccode" title="DocCode sample">Breeze "DocCode" sample</a>.</p>
<p></p>
<p class="note">Pablo Romeo proposes an interesting approach to solving a related problem. He doesn't mind that the server provides the metadata and he doesn't want to serve a <em>metadata.js</em> file as described here. He does want the server-supplied metadata to be <b>versioned and cached on the server</b>. If that sounds more like your scenario, take a look at <a href="http://stackoverflow.com/questions/20574310/breeze-metadata-request-url-with-cache-bust/20576539 " title="Versioning and caching metadata on the server" target="_blank">his StackOverflow question and answer</a>.</p>

#Why?#

We think a .NET web service *should* support Breeze clients by exposing a "metadata" endpoint. That's what a BreezeJS client application expects out-of-the-box.

There is nothing wrong with this approach and it is all that many applications will ever need.

But retrieving metadata from the web service can be less than ideal for some applications and their developers. Because fetching metadata from the server is an asynchronous operation:

- the app may have to wait for metadata to arrive before it is useful; delay can be really annoying.

- we can't create entities until we have metadata; if we want to create entities first thing, before issuing any queries, we have to fetch metadata explictily.

- making the app wait for metadata adds complexity.

- the app can't function offline until it has metadata.
 
- many unit tests could be both synchronous and fast if only metadata were already available.

We can ameliorate these problems if metadata are readily available on the client when the application begins.

#Other Options#

We could load "launch data" (which includes metadata and lookup data) from browser local storage. That's a fast operation and it is synchronous on most platforms. 

While we heartily endorse this approach, it can't stand on its own because
 
- we have to stash the launch data in browser storage first which means the app must run at least once "the old way"

- browser storage can be cleared any time.

- updating the server metadata invalidates the local metadata.

- local storage access is asynchronous on some platforms (e.g, Windows Store apps). It's still faster than going remote. But the asynchronous protocol complicates production and test code.

*Another option*: we can <a href="/doc-js/metadata-by-hand" title="Metadata By Hand">write the metadata by hand</a> in JavaScript and push it to the client in a script file. In fact, that's exactly what you'll do when your app talks to a non-.NET server or a server you can't touch.

But we'd rather use generated metadata when available. Coding metadata by hand - especially for a large model - is tedious, error prone, and requires on-going maintenance. Generated metadata is almost carefree and automatically in-sync with the evolving service model.

#Embed metadata in a script#

We think the best approach is to capture and store the generated metadata in a variable in a JavaScript file. The client application loads this script file as it does all other scripts. On launch, it initializes a `MetadataStore` from the metadata variable and proceeds without delay.

The metadata script is always current because we regenerate it automatically when the web server starts. We can use standard URL cache-busting to force the browser to replace an out-of-date cached script.

Best of all, it's easy to set up. Let's see how.
<a name="capture"></a>
#Capture the metadata (quick and dirty)#

We want to see benefits right away so we'll quickly assemble a *metadata.js* file by grabbing the metadata off the wire.

>We'll circle back and <a href="#writeMetadataJS">do this properly</a> later in the story.

Here's the procedure:

1. Add a new JavaScript file to your project in some convenient location next to other client assets; we'll call ours *metadata.js*.

2. Launch the app to wake up the server and then set the browser address bar to the URL for the metadata endpoint. The browser tab might look a bit like this (with optional JSON formatting turned off):

    <img alt="Metadata on the wire" src="/images/metadataOnTheWire.png" style="width: 100%; max-width: 612px;" />

3. Copy the contents of the browser window (ctrl-A, ctrl-C) and paste (ctrl-V) them into *metadata.js*. You've just pasted in a huge JSON object on a single line.

4. Open a couple of new lines at the top and assign the `JSON.stringified` object to a variable in the global application namespace (pretend you have one if you don't). In our example the variable is named `window.app.metadata`.

5. Scroll to the end, add a new line, and enter ");" to terminate the `JSON.stringified` expression.

6. Save the file.

7. Check it into source control (optional but well advised).

Here's the resulting *metadata.js*:

    window.app = window.app || {}; // define the "app" global namespace if it doesn't already exist
    window.app.metadata = JSON.stringify( 
    { "schema": { "namespace": "Northwind.Models", "alias": ... } }
    );

# Launch with *metadata.js* #

Make sure the client application loads this script, perhaps by adding it to *index.html* as seen in this example.

    ...
    <script src="app/app.js"></script>
    <script src="app/metadata.js"></script>
    ...

Open the JavaScript application file that creates and initializes your `EntityManager`. Modify it to look something like this annotated example:

    var serviceName = 'breeze/northwind'; // your service root here

    function createEntityManager() {

        // define the Breeze `DataService` for this app
        var dataService = new breeze.DataService({
            serviceName: serviceName,
            hasServerMetadata: false  // don't ask the server for metadata
        });

        // create the metadataStore 
        var metadataStore = new breeze.MetadataStore({
            namingConvention: camelCaseConvention // if you use this convention
        });

        // initialize it from the application's metadata variable
        metadataStore.importMetadata(windows.app.metadata);


        // create a new EntityManager that uses this metadataStore
        return new breeze.EntityManager({
            dataService: dataService,
            metadataStore: metadataStore
        });
    }

**That's all there is to it!** 

Your new `EntityManager` is primed with metadata and no longer requests metadata from the server ... a fact you can confirm by running your application and checking the network traffic. You will not see a call to the "metadata" endpoint.

<a name="writeMetadataJS"></a>
#A sustainable *metadata.js*#
We're a little uncomfortable with the way we created *metadata.js*.

We took a snapshot of the metadata as it is today. As the application evolves, the service model will evolve and the metadata will change. The metadata in our script file will be incorrect triggering a cascade of errors that may be hard to diagnose.

We can always recreate *metadata.js* by hand when we change the service model. That manual step is easily neglected. We'd sleep better if we automated the process, knowing that the client metadata are always in sync with our service model.

It's not hard to do, so let's do it. Our plan:

- Hook into the web server startup pipeline
- Call the server method that generates metadata for the client
- Capture that metadata output and (re)write *metadata.js* 

Notice that we (re)write *metadata.js* from the latest generated metadata ***before*** any client can download that script. Therefore every client will get the latest, greatest metadata.

And now for the details ...

### Create a *metadata.js* file writer ###

Study this example:

    public static class MetadataScriptWriter {
        public static void Write()
        {
            // get the metadata the same way we get it for the controller
            var metadata = new NorthwindRepository().Metadata;

            // construct the filename and runtime file location
            var fileName = HostingEnvironment.MapPath("~/app/metadata.js");

            // the same pre- and post-fix strings we used earlier
            const string prefix = "window.app = window.app || {}; windows.app.metadata = JSON.stringify(";

            const string postfix = ");";

            // write to file
            using (var writer = new StreamWriter(filename))
            {
                writer.WriteLine(prefix + metadata + postfix);
            }
        }
    }

Notice that we generate the metadata the same way that the Web API controller does: by new-ing up an instance of the repository and calling its `Metadata` method ... which is likely implemented like this:

    public string Metadata {
        get {
           return new EFContextProvider<NorthwindContext>().Metadata();
        }
    }

Also remarkable is the voodoo that determines the file location on the server

    var fileName = HostingEnvironment.MapPath("~/app/metadata.js");

###Hook into the server start-up pipeline###

We want to write a new *metadata.js* file when the server launches, before it delivers *any* JavaScript files to clients.

We need to hook into the ASP.NET pipeline early. Almost any of the components in the *App_Start* folder  will do. Let's try *WebApiConfig.cs*.

    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            MetadataScriptWriter.Write();
			...
        }
    }

#Review#

We can get metadata synchronously from a JavaScript file rather than  asynchronously through a service call. That makes the client-side developer's job a little easier and may help the application launch faster and run offline.

We can teach our app to load metadata from script in a few easy steps:

**On the server**

- generate metadata when the server starts
- write the metadata into a *metadata.js* file as a JSON object

**On the client**

- create a new `MetadataStore`
- import the JSON metadata object created by *metadata.js* 
- create a new `EntityManager` that uses this `metadataStore`.

The newly created `EntityManager` is ready to go and won't ever ask the server for metadata.