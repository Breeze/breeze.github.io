---
layout: doc-net
redirect_from: "/old/documentation/aspnet-web-api.html"
---
# ASP.NET Web API 

<a class="logo-inline" href="/doc-net" title="ASP.NET">
  <img src="/images/logos/Breeze-aspnet.png" alt="ASP.NET" width="100">
</a>

Within the .NET community, ASP.NET and ASP.NET Core web applications are typically written using .NET's Web API technology. This technology provides mechanisms for supporting a range of data services over HTTP. This section describes how specific Web API service implementations influence Breeze client development.

Breeze offers support for both legacy .NET 4.x ASP.NET applications as well as the new ASP.NET Core applications.

[ASP.NET Core and ASP.NET info](https://docs.microsoft.com/en-us/aspnet/?view=aspnetcore-3.1#pivot=core)

The following sections also describe how to build these applications with a variety of ORM technologies such as Entity Framework, Entity Framework Core and NHibernate.

<div style="clear:both"/>

## Building a Breeze-flavored ASP.NET Web API

A "Breeze-flavored" Web API is the quickest, most productive path to an HTTP service that a Breeze client can talk to with minimal configuration. You'll use .NET components written specifically to support Breeze clients and you'll write one (or a few) controllers in a style that minimizes your server-side coding and maintenance without compromising power, flexibility, security or performance.

The remaining topics in this section various aspects of this Breeze-flavored approach.


{% include support-frag.html %}
