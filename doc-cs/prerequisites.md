---
layout: doc-cs
---

# Prerequisites

This topic covers the *Breeze.sharp* client libraries and .NET  dependencies, along with requirements for developing with Visual Studio.

### Breeze dependencies

The Breeze.sharp client is a .NET 4.5 portable class library that depends upon the following libraries

- Microsoft.AspNet.WebApi.Client ( Note that ASP.NET is NOT required on the server).
- Microsoft.BCL
- Newtonsoft.Json
 
all of which are automatically included if you use the *Breeze.Sharp* nuget package.

Breeze supports a variety of both client and server side extension points. Some of these extension point may have their own dependencies.  You'll find discussion of alternative implementations for each extension point elsewhere in the documentation.


### Visual Studio and the Samples

Many of the current samples demonstrate *Breeze.sharp* clients communicating with an ASP.NET Web API service that delegates data access to the Entity Framework. They were developed with Visual Studio 2012/2013 and run on either .NET 4.0 or .NET 4.5 (both platforms are fine).

Most samples get their data from SQL Server Compact  4.0 databases with filenames ending in ".sdf". SQL Server Compact should have been installed on your machine automatically with VS2012/VS2013. If you do not have it on your machine, you can download and install it yourself. Alternatively, you can use NuGet to install it for an individual sample solution.
 
While many of our samples are implemented in this fashion today, Breeze servers do not require .NET, Visual Studio, Entity Framework, SQL Server, or ASP.NET. Breeze servers are not handcuffed to Microsoft. 

However, the Breeze.sharp client IS a .NET client.  As an alternative, the Breeze.Js product provides the same client side functionality and much the same API for Javascript and HTML5/Browser development.  Any server that *Breeze.sharp* can talk to, *Breeze.Js* can talk to as well, as vice versa. 

We intend to demonstrate other back-ends as well as show IDEs other than Visual Studio. Your feedback on UserVoice will help us prioritize these plans.

### Visual Studio 2012/2013

Everything you need is installed by default.

### Visual Studio 2010

Be sure to add the following Microsoft features to your Visual Studio installation:

- ASP.NET MVC 4
- Web Platform Installer
- IIS Express
- SQL Server Compact Edition 4.0
- Enable NuGet package restore

The Breeze samples retrieve their dependent NuGet packages from official NuGet package sources on the web when you first build them.

Please confirm that Visual Studio has permission to restore NuGet packages from the web:

- Tools > Library Package Manager > Package Manager Settings > General
- Check "Allow Nuget to download missing packages during build"