---
layout: doc-net
---
#Hosting in ASP.NET

Breeze is fundamentally a library for easing development of HTML/JavaScript client applications that fetch and store remote data. BreezeJs doesn't dictate the server technology. It doesn't dictate the remote service API. Although you can write a Breeze application entirely on the client with mock data, ultimately the app will communicate through a web-facing service API to a server and a database.

Breeze ships with out-of-the-box support for the ASP.NET Web API and Entity Framework. The easy route to a Breeze application runs through ASP MVC 4 and the Web API. The Breeze sample applications are MVC 4 applications with a Web API controller, a C# entity model, and the Entity Framework mediating between the model and a SQL Server database. This topic and the ones that follow describe this path in detail.

##Breeze MVC4 Web API NuGet Packages

You can build a baseline server of this kind in about 2 minutes using the **Breeze for MVC4 Web Api** nuget package; use the **Breeze for MVC4 WebApi Client Sample** if you want a baseline Breeze client to go with it. We highly recommend this approach if you are new to Breeze.

**Please read [Start with NuGet](/doc-net/nuget-packages) and watch the accompanying short video** before reading anything more in these "Breeze on the server" section; that video may show you all you need to know.

Continue on if you want to know more of the details behind the server-side artifacts the NuGet packages install.

##Pick an ASP.NET project template

The Breeze NuGet packages can be added to Web Application projects generated from many of the ASP templates. The NuGet package name may say "MVC" but it actually works well with non-MVC templates such as the comparatively lean **ASP.NET Empty Web Application** template. The "ASP.NET Empty Web Application" is probably the best choice if you won't be asking your server to build application web pages. Most of our samples were built with this template because the application server did no more than host the Web API controller and ship static HTML, CSS and JavaScript files to the client.

On the other hand, many developers are more comfortable with MVC or they want to leverage other MVC capabilties or they are building a hybrid app with a mix of MVC and SPA. For these folks, we recommend beginning with **File **| **New **| **Project **| **ASP.NET MVC 4 Web Application** and selecting the **Empty** template.

> Feel free to pick any of the MVC templates. The Breeze NuGet package should work with all of them and is known to work with the Web API and SPA templates. Realize that these templates add a great deal of material to your project that may not be relevant to you.

##Next step

Now that we have a basic Web Application project, we're ready start building our app...starting with [the server-side model](/doc-net/ef-serverside-model)
