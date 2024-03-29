---
layout: doc-net
redirect_from: "/old/documentation/start-nuget.html"
---
# Breeze NuGet packages
Breeze offers several <a href="http://nuget.org/" target="_blank">NuGet</a> packages for the .NET developer.

Breeze is fundamentally a library for easing development of HTML/JavaScript client applications that fetch and store remote data. BreezeJs doesn't dictate the server technology. It doesn't dictate the remote service API. Although you can write a Breeze application entirely on the client with mock data, ultimately the app will communicate through a web-facing service API to a server and a database.

The package (or packages) you need depend on your development scenario.

* [Learn about Breeze](#learn)

* [Nuget packages](#current)

<a name="learn"></a>

## Are you new to Breeze?

Breeze ships with out-of-the-box support for the ASP.NET Web API and Entity Framework. The easy route to a Breeze application is shown in the following repo: <a href="https://github.com/Breeze/northwind-demo" target="_blank">Getting Started with Breeze</a>

See [Breeze Steps](https://github.com/Breeze/northwind-demo/blob/master/STEPS.md) for a step by step review on how to build a .NET Server. 

The Breeze sample applications are applications with a Web API controller, a C# entity model, and the Entity Framework mediating between the model and a SQL Server database.

We also recommend that you look at Brian Noyes "<a href="http://www.pluralsight.com/courses/building-single-page-applications-breeze" target="_blank">Building Data-Centric Single Page Apps with Breeze</a>" and at John Papa's two courses, "<a href="http://www.pluralsight.com/training/Courses/TableOfContents/build-apps-angular-breeze" target="_blank">Building Apps with AngularJS and Breeze</a>" and "<a href="http://www.pluralsight.com/training/Courses/TableOfContents/build-apps-angular-breeze" target="_blank">Single Page Apps JumpStart with Durandal, Knockout and Breeze</a>". Please note that the .NET versions of the Breeze Server have undergone a great deal of change over the past 3 years as new versions of .NET, the Entity Framework and ASP.NET have been released.  As a result many of the samples above are outdated from the standpoint of the server side code.  However the client side code in these examples is still completely compatible with current Breeze implementations and the server side code while out of date is still very similar to what is required for the newer .NET frameworks.

<a name="current"></a>

## Breeze NuGet Packages

### For .NET Core (versions 2 through 8) and Entity Framework Core (2 through 8)

> Note: Version 7.1+ of each package is for .NET 5, 6, 7, and 8, whereas Version 3.x is for .NET Core 3.1 and Version 1.x is for .NET Core 2.  Please note that only the Version 3 and later packages will be upgraded in the future. No further support for the .NET Core 2 packages will occur.

- [Breeze.AspNetCore.NetCore](https://www.nuget.org/packages/Breeze.AspNetCore.NetCore/)
- [Breeze.Core](https://www.nuget.org/packages/Breeze.Core/)
- [Breeze.Persistence](https://www.nuget.org/packages/Breeze.Persistence/)
- [Breeze.Persistence.EFCore (support for EF Core)](https://www.nuget.org/packages/Breeze.Persistence.EFCore/)
- [Breeze.Persistence.NH (support for NHibernate)](https://www.nuget.org/packages/Breeze.Persistence.NH/)

<br>

### For .NET Framework 4.7.x / 4.8  and Entity Framework 6 

> These packages are no longer being maintained. Please migrate to .NET Core versions.

- [Breeze.WebApi2.EF6  (composite package for EF6 - includes next 3)](https://www.nuget.org/packages/Breeze.WebApi2.EF6)
- [Breeze.Server.WebApi2](https://www.nuget.org/packages/Breeze.Server.WebApi2/)
- [Breeze.Server.ContextProvider](https://www.nuget.org/packages/Breeze.Server.ContextProvider/)
- [Breeze.Server.ContextProvider.EF6  ( support for EF6)](https://www.nuget.org/packages/Breeze.Server.ContextProvider.EF6/)
- [Breeze.Server.ContextProvider.NH ( support for NHibernate)](https://www.nuget.org/packages/Breeze.Server.ContextProvider.NH/)
    
<br>    
  
### For .NET Framework 4.x and Entity Framework 5   

> These packages are no longer being maintained. Please migrate to .NET Core versions.

- Breeze.WebApi
- Breeze.Server.WebApi.Core
- Breeze.Server.WebApi.EF

