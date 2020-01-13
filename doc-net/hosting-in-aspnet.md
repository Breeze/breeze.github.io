---
layout: doc-net
redirect_from: "/old/documentation/hosting-aspnet.html"
---
# Hosting in ASP.NET


Breeze is fundamentally a library for easing development of HTML/JavaScript client applications that fetch and store remote data. BreezeJs doesn't dictate the server technology. It doesn't dictate the remote service API. Although you can write a Breeze application entirely on the client with mock data, ultimately the app will communicate through a web-facing service API to a server and a database.


Breeze ships with out-of-the-box support for the ASP.NET Web API and Entity Framework. The easy route to a Breeze application is shown in the following repo: <a href="https://github.com/Breeze/northwind-core-ng-demo" target="_blank">Getting Started with Breeze</a>

See [Breeze Steps](https://github.com/Breeze/northwind-core-ng-demo/blob/master/STEPS.md) for a step by step review on how to build a .NET Server. 

The Breeze sample applications are applications with a Web API controller, a C# entity model, and the Entity Framework mediating between the model and a SQL Server database.

## Breeze NuGet Packages

- For .NET Core ( versions 2 and 3) and Entity Framework Core ( 2 and 3)

         Version 3.x of the packages below is for .NET Core 3, whereas Version 1.x is for .NET Core 2.
         If you are running ASP.NET Core 2/.NET Core 2 or EF Core 2 you will need to use the 1.x version of these packages.
         Please note that only the Version 3.x packages will be upgraded in the future. No further support for the .NET Core 2 packages will occur.
    
    - Breeze.AspNetCore.NetCore
    - Breeze.Core
    - Breeze.Persistence
    - Breeze.Persistence.EFCore ( support for EF Core)
    - Breeze.Persistence.NH   ( support for NHibernate)
    <br><br>

- For .NET Framework 4.7.x  and Entity Framework 6 

      These packages are no longer being maintained. Please migrate to .NET Core 3 versions.

     - Breeze.WebApi2.EF6  ( composite package for EF6 - includes next 3)
     - Breeze.Server.WebApi2
     - Breeze.Server.ContextProvider
     - Breeze.Server.ContextProvider.EF6  ( support for EF6)
     - Breeze.Server.ContextProvider.NH ( support for NHibernate)
     <br><br>

- For .NET Framework 4.x and Entity Framework 5   

      These packages are no longer being maintained. Please migrate to .NET Core 3 versions.

     - Breeze.WebApi
     - Breeze.Server.WebApi.Core
     - Breeze.Server.WebApi.EF

## Pick an ASP.NET project template


## Next step

Now that we have a basic Web Application project, we're ready start building our app...starting with [the server-side model](/doc-net/ef-serverside-model)
