---
layout: doc-main
---

# Breeze GitHub Repositories
Breeze  products and samples are arranged in a [**family of repositories on github**](https://github.com/Breeze "Breeze on GitHub"). 

An individual repository falls into one of three categories:

1. **Client** code for application client development.
2. **Server** code to assist the development of a server that is Breeze-client-aware.
3. **Samples**.

Within a category the repositories are specific to a technology such as *JavaScript* or *.NET*.

#CLIENT

#[breeze.js](https://github.com/Breeze/breeze.js "BreezeJS client")

The Breeze **JavaScript** client source code and libraries are in the [**breeze.js repository**](https://github.com/Breeze/breeze.js "BreezeJS client"). The "compiled" JavaScript libraries are in the */build* directory.

>**breeze.debug.js** - the standard client library that most of us reference. It contains support for the default third-party libraries including Knockout, Backbone, and jQuery ajax. 
>
>**breeze.min.js** - the minified *breeze.debug.js*.
>
>**breeze.intellisense.js** - Visual Studio intellisense for *breeze.debug.js*. 
>
>**breeze.base.debug.js** - the base client library which excludes adapters for third-party adapters.  For a smaller footprint you might download this base library and just the adapters you need, drawn from the *../src/* directory.
>
>**breeze.base.min.js** - the minified *breeze.base.debug.js*.

#[breeze.js.labs](https://github.com/Breeze/breeze.js.labs "Breeze JavaScript Labs")

A collection of small [helper libraries for developing client apps](/doc-breeze-labs/ "Breeze JS Labs documentation"). These libraries are not part of "Breeze core".

#[breeze.sharp](https://github.com/Breeze/breeze.sharp "Breeze Sharp client") 

"Breeze Sharp" is for C#, F#, and VB.NET developers of **.NET** clients. [**Most developers acquire the assemblies via nuget**](https://www.nuget.org/packages/Breeze.Sharp/ "Breeze Sharp on nuget"). You can build it yourself quite easily (there are few dependencies) if you need the latest committed bits.

#SERVER

The Breeze server repositories hold code that eases the development and maintenance of Breeze application clients.

Breeze clients ***do not require Breeze-aware servers***.  A Breeze client can talk to any HTTP server. You never have to touch the server. 

However, if you are writing an application end-to-end, you may be more productive if you build your server with Breeze server-side components housed in one of the following repositories.

#[**breeze.server.net**](https://github.com/Breeze/breeze.server.net "Breeze .NET Server components on github")

Components for servers built with such .NET technologies as Web API, Entity Framework, and NHibernate.


#[**breeze.server.node**](https://github.com/Breeze/breeze.server.node "Breeze Node Server components on github")

Components for node.js developers of who want server-side support for the Breeze client query URLs (OData query syntax) and batched change-set saves. Note especially the *breeze-mongodb/breeze-mongodb.js* library.

#[**breeze.server.java**](https://github.com/Breeze/breeze.server.java "Breeze Java Server components on github")

Components for Java developers of who want server-side support for the Breeze client query URLs (OData query syntax) and  batched change-set saves.

#SAMPLES

#[breeze.js.samples](https://github.com/Breeze/breeze.js.samples "Breeze JavaScript Samples")

The repository of **Breeze JavaScript Samples** that illustrate JavaScript client application development with Breeze. 

A Breeze client application can work with a wide variety of server technologies, a point illustrated here by the repository folder structure that reflects each sample's relationship to a specific type of server:

>**net** - each Visual Studio solution demonstrates some combination of .NET server technologies such as ASP.NET Web API, WCF OData, Entity Framework, and NHibernate.
>
>**java**.
>
>**no-server** - in these samples, the Breeze client application interacts with a server "as is", a server that the developer cannot touch; accordingly there is "no server" code in the sample.
>
>**node** - a node.js server, typically running express and MongoDb. 
>
>**ruby** - Ruby on Rails. 

#[breeze.sharp.samples](https://github.com/Breeze/breeze.sharp.samples "Breeze Sharp Samples")

The repository of **Breeze Sharp Samples** that illustrate Breeze client applications written in C#, F# or VB.NET.

>Eventually this repository will parallel the structure and content of the *breeze.js.samples* repo. Breeze Sharp clients talk to the same server APIs as Breeze JS clients ... and in the same way. Bear with us as we port the client code to .NET ... without touching the sample service code.
