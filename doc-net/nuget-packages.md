---
layout: doc-net
redirect_from: "/old/documentation/start-nuget.html"
---
# Breeze NuGet packages
Breeze offers several <a href="http://nuget.org/" target="_blank">NuGet</a> packages for the .NET developer.

The package (or packages) you need depend on your development scenario.

* [Learn about Breeze](#learn)

* [Nuget packages for single and multiple project applications built with VS2013/2015 technologies](#current)

* [Nuget packages for .NET 4.0 or "legacy" VS2012 technologies.](#legacy)

* [Upgrade and convert a legacy breeze application to VS2013/2015 technologies.](#convert)

* [Try the "Todo" demo package.](#demoPkg)

<a name="learn"></a>

## Are you new to Breeze?

We recommend that you look first at Brian Noyes "<a href="http://www.pluralsight.com/courses/building-single-page-applications-breeze" target="_blank">Building Data-Centric Single Page Apps with Breeze</a>" and at John Papa's two courses, "<a href="http://www.pluralsight.com/training/Courses/TableOfContents/build-apps-angular-breeze" target="_blank">Building Apps with AngularJS and Breeze</a>" and "<a href="http://www.pluralsight.com/training/Courses/TableOfContents/build-apps-angular-breeze" target="_blank">Single Page Apps JumpStart with Durandal, Knockout and Breeze</a>"

John's "HotTowel" nuget packages will reflect Visual Studio 2013/2015 and its family of technology updates.

<a name="current"></a>

## Visual Studio 2013/2015 and .NET 4.5

[Go here](#legacy) if you must run on the .NET 4.0 platform. These packages are for .NET 4.5 applications only.

Your first decision: "*will I have a single project or multiple projects?*"

### Single Web Application Project
If you'd like to start with a single ASP.NET Web Application that holds everything: client application (html,JavaScript, css), Web API, model, data access.
These packages are best installed in a new ASP.NET MVC 4 Application generated with the "Empty" template.

**Breeze.WebApi2** is the best choice if you will develop with the Web API2 (aka v.5) and EntityFramework 6.

>This package is a combination of the Breeze.Client, Breeze.Server.WebApi2, and Breeze.Server.ContextProvider.EF6 packages described next.

If you don't want to use the Entity Framework 6, you should install the combination of these packages that is most appropriate for your server technology stack.

**Breeze.Client** - Just the client assets (e.g. JavaScript).

**Breeze.Server.WebApi2** - Base support for Web API 2 (aka v.5)

**Breeze.Server.ContextProvider.EF6** - If you manage data access with Entity Framework 6.

**Breeze.Server.ContextProvider.NH** - If you manage data access with NHibernate.

**Breeze.Server.ContextProvider** - If you manage data access by some means other than Entity Framework or NHibernate. The EF and NH packages depend upon this one.

### Multiple Application Projects

If you have separate projects for web content, data access and model, you'll want to draw upon these packages.

#### Web Application Project

**Breeze.Client** - Just the client assets (e.g. JavaScript). Install in your web application project.

**Breeze.Server.WebApi2** - Support for Web API 2 (aka v.5). If you combine the client content and the Web API in a single Web Application project (as most people do), you'll install this package with the Breeze.Client package

#### Data Access Project

**Breeze.Server.ContextProvider.EF6** - If you manage data access with Entity Framework 6.

**Breeze.Server.ContextProvider.NH** - If you manage data access with NHibernate.

**Breeze.Server.ContextProvider** - If you manage data access by some means other than Entity Framework or NHibernate. The EF and NH packages depend upon this one.

<a name="legacy"></a>

## Visual Studio 2012 and .NET 4

The following packages are for developers who must target the .4.0 framework or who can't migrate from Visual Studio 2012 technologies to the Web API 2 or Entity Framework 6 that were released with Visual Studio 2013.

**Breeze.WebApi** - For development with the Web API (v.1) and EntityFramework 4 or 5. It contains everything - client assets (JavaScript), Web API, and EF support - in one package. Best when installed in ASP.NET MVC 4 Application with the "Empty" template.

If you aren't using Entity Framework, you might want to load the dependent packages separately.

**Breeze.Client** - Just the client assets (e.g. JavaScript). Install in your web application project. This package knows nothing about .NET and is the same one installed by developers targeting .NET 4.5

**Breeze.Server.WebApi.EF** - For Web Api v.1 and Entity Framework 4 or 5.

**Breeze.Server.WebApi.NH** - For Web Api v.1 and NHibernate.

**Breeze.Server.WebApi.Core** - For Web Api v.1 but with ORM support. Pick this package when you have your own data access technology. The EF and NH packages depend on this one.

<a name="convert"></a>

## Convert a "Legacy" Application

To convert a (legacy) Visual Studio 2012 Breeze application to Breeze ASP.NET WebApi 2 and Entity Framework 6 project:

* Uninstall all (legacy) Breeze nuget packages

* Re-install with the new Breeze nuget packages (e.g., for single-project apps, install the "Breeze.WebApi2.EF6" package"

* Replace the "Breeze.WebApi" and "Breeze.WebApi.EF" namespaces with "Breeze.WebApi2", "Breeze.ContextProvider", and "Breeze.ContextProvider.EF6".

* Replace references to EF 4/5 namespaces in all of your project files with references to the EF 6 namespaces. Check out the <a href="http://entityframework.codeplex.com/wikipage?title=specs" target="_blank">pertinent Microsoft documentation</a>.

<a name="demoPkg"></a>

# Get started with the Breeze Demo package

A quick way to discover Breeze is by building a super-simple example using the ToDo demo NuGet package. You can be up and running in about two minutes.

**The current version of this package is built on "legacy" Web API, Entity Framework and Breeze packages. We'll update them soon. They still work and give you a feel for what Breeze development is like. But we caution you that the current package is "old".**


This 10 minute video demonstrates the process and walks you through the material added by the Breeze packages.

> This video refers to the breeze package which has been renamed to "Breeze.WebApi.Sample". It targets Web API (v.1) and EF 5. Please adjust accordingly.


<iframe allowfullscreen="" frameborder="0" height="315" src="http://www.youtube.com/embed/ItvUb0kjEss" width="420"></iframe>

In brief, 

* create a new project, selecting `Visual C# | Web | VisualStudio 2012 | "ASP.NET Empty Web Application"`

* ask the NuGet package manager to install the publicly available "Breeze.WebApi.Sample"

After the package installs, you'll see a "readme" file that explains how to try it and identifies the assets that the package added to your project.

Try it by running without debug (Ctrl F5) ... or with debug (F5) if you prefer.

You'll see an MVC web page which is the shell for the Breeze sample application. You'll be able to edit the sample "todos", mark them done or not-done, save the changes, and toggle the query to show either not-done todos or all todos (done and not-done) as shown here:


<img alt="" src="/images/samples/BreezeNugetSampleRunning01.png" style="height: 400px; width: 362px;" />

All of the pertinent Breeze client code is in one JavaScript file, *Scripts/app/sampleViewModel.js*.

#### Next steps

The sample stops at simple query, edit, and save. The entire client application is in one file of less than 100 lines. You can see at a glance the most fundamental mechanics of Breeze.

This is not a best practice by any means.  At a minimum you probably want to refactor data access into a separate "dataservice class" and separate application startup code from the ViewModel.

The Basic Breeze series guides you toward a more sustainable application structure with greater attention to modularity and separation of concerns while introducing fundamental Breeze concepts and techniques.