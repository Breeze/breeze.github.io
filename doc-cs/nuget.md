---
layout: doc-cs
---
#Breeze NuGet packages
Breeze offers several <a href="http://nuget.org/" target="_blank">NuGet</a> packages for the .NET developer. 

## Visual Studio 2013 and .NET 4.5

### *Client side*
- *Breeze.Sharp* - The Breeze.Sharp portable class library and its immediate dependencies. 

### *Server side* 
- *Breeze.Server.WebApi2* - Base support for Web API 2 (aka v.5)

- *Breeze.Server.ContextProvider.EF6* - If you manage data access with Entity Framework 6.

- *Breeze.Server.ContextProvider.NH* - If you manage data access with NHibernate.

- *Breeze.Server.ContextProvider* - If you manage data access by some means other than Entity Framework or NHibernate. The EF and NH packages depend upon this one.

>Note that these server side nugets are actually EXACTLY the same nugets used by the Breeze.Js (javascript) client.  Any Breeze client (.NET or Javascript) should be able to talk to any Breeze server, regardless of technology.  

### Which projects use which Nugets? 


A Breeze.sharp application will often have separate projects for separate concerns within your application. One possible organization is shown below:

#### Client side - Application project(s) will need the following nugets

- *Breeze.Sharp* - There may be multiple projects that support the client side application, the Breeze.sharp nuget should be the only Breeze dependency required. 
#### Server side - Your Web Application Project will need the following nugets

- *Breeze.Server.WebApi2* -  This will contain all of your WebApi Controller logic. 

#### Server side - Any Data Access Project(s) will need the following nugets

- *Breeze.Server.ContextProvider.EF6* - If you manage data access with Entity Framework 6.

- *Breeze.Server.ContextProvider.NH* - If you manage data access with NHibernate.

- *Breeze.Server.ContextProvider* - If you manage data access by some means other than Entity Framework or NHibernate. The EF and NH packages depend upon this one.


####Next steps

The Basic Breeze series guides you toward a more sustainable application structure with greater attention to modularity and separation of concerns while introducing fundamental Breeze concepts and techniques.