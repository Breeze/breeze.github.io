---
layout: doc-net
---
<h1>Hosting in ASP.NET</h1>

<p>Breeze is fundamentally a library for easing development of HTML/JavaScript client applications that fetch and store remote data. BreezeJs doesn&#39;t dictate the server technology. It doesn&#39;t dictate the remote service API. Although you can write a Breeze application entirely on the client with mock data, utlimately the app will communicate through a web-facing service API to a server and a database.</p>

<p>Breeze ships with out-of-the-box support for the ASP.NET Web API and Entity Framework. The easy route to a Breeze application runs through ASP MVC 4 and the Web API. The Breeze sample applications are MVC 4 applications with a Web API controller, a C# entity model, and the Entity Framework mediating between the model and a SQL Server database. This topic and the ones that follow describe this path in detail.</p>

<h2>Breeze MVC4 Web API NuGet Packages</h2>

<p>You can build a baseline server of this kind in about 2 minutes using the <strong>Breeze for MVC4 Web Api</strong> nuget package; use the <strong>Breeze for MVC4 WebApi Client Sample</strong> if you want a baseline Breeze client to go with it. We highly recommend this approach if you are new to Breeze.</p>

<p><strong>Please read <a href="/documentation/start-nuget">Start with NuGet</a> and watch the accompanying short video</strong> before reading anything more in these &quot;Breeze on the server&quot; section; that video may show you all you need to know.</p>

<p>Continue on if you want to know more of the details behind the server-side artifacts the NuGet packages install.</p>

<h2>Pick an ASP.NET project template</h2>

<p>The Breeze NuGet packages can be added to Web Application projects generated from many of the ASP templates. The NuGet package name may say &quot;MVC&quot; but it actually works well with non-MVC templates such as the comparatively lean <strong>ASP.NET Empty Web Application</strong> template. The &quot;ASP.NET Empty Web Application&quot; is probably the best choice if you won&#39;t be asking your server to build application web pages. Most of our samples were built with this template because the application server did no more than host the Web API controller and ship static HTML, CSS and JavaScript files to the client.</p>

<p>On the other hand, many developers are more comfortable with MVC or they want to leverage other MVC capabilties or they are building a hybrid app with a mix of MVC and SPA. For these folks, we recommend beginning with <strong>File </strong>| <strong>New </strong>| <strong>Project </strong>|&nbsp; <strong>ASP.NET MVC 4 Web Application</strong> and selecting the <strong>Empty</strong> template.</p>

<p class="note">Feel free to pick any of the MVC templates. The Breeze NuGet package should work with all of them and is known to work with the Web API and SPA templates. Realize that these templates add a great deal of material to your project that may not be relevant to you.</p>

<h2>Next step</h2>

<p>Now that we have a basic Web Application project, we&#39;re ready start building our app &hellip; starting with <a href="/documentation/server-side-model-0">the server-side model</a></p>
