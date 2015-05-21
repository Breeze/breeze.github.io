---
layout: doc-net
redirect_from: "/old/documentation/nhibernate.html"
---
#NHibernate *(Beta)*

We added NHibernate support to Breeze in the 1.4.2 release. Documentation and samples will be coming soon.

##Assemblies
The Breeze.WebApi dll has been broken up into multiple assemblies:

* **Breeze.WebApi.Core** - database and persistence framework independent code.
* **Breeze.WebApi.NH** - NHibernate specific code. Dependent of Breeze.WebApi.Core.

##NuGet
There are three Breeze NuGet packages applicable for developers using NHibernate:

* **Breeze.Client** - client javascript libraries only.
* **Breeze.Server.WebApi.Core** - Server side only .NET assemblies.
* **Breeze.Server.WebApi.NH** = Breeze.Server.WebApi.Core + NHibernate assemblies.

##Samples
Our first [NHibernate sample is available via GitHub](https://github.com/IdeaBlade/Breeze/tree/master/Samples/NorthBreeze). Please have a look and kick the wheels. 
