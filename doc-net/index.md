---
layout: doc-net
redirect_from: "/old/documentation/aspnet-web-api.html"
---
# ASP.NET Core Web API / and legacy ASP.NET Web API

<a class="logo-inline" href="/doc-net" title="ASP.NET">
  <img src="/images/logos/Breeze-aspnet.png" alt="ASP.NET" width="100">
</a>

Within the .NET community, ASP.NET and ASP.NET Core web applications are typically written using .NET's Web API technology. This technology provides mechanisms for supporting a range of data services over HTTP. This section describes how specific Web API service implementations influence Breeze client development.

<div style="clear:both"/>

## ASP.NET Web API with Breeze

There are many ways to write your service with the ASP.NET Web API. We group them here in three categories:

1. Breeze Web API
1. Conventional Web API
1. OData Web API - ( not supported on ASP.NET Core)

## Breeze Web API

A "Breeze-flavored" Web API is the quickest, most productive path to an HTTP service that a Breeze client can talk to with minimal configuration. You'll use .NET components written specifically to support Breeze clients and you'll write one (or a few) controllers in a style that minimizes your server-side coding and maintenance without compromising power, flexibility, security or performance.

The following topics cover various aspects of this Breeze-flavored approach

* [Start with Nuget](/doc-net/nuget-packages)
* [Web API Routing](/doc-net/webapi-routing)
* [The Web API controller](/doc-net/webapi-controller)
* [The ContextProvider](/doc-net/ef-efcontextprovider)
* [Using the Entity Framework for data access](/doc-net/ef)
* [Using NHibernate for data access](/doc-net/nh)

## Conventional Web API

Conventional Web API development is a bit different. Instead of one controller governing a feature area, you write a controller for every exposed "root type".  Such controllers typically sport one or more GET methods and a PUT, POST/PATCH, and DELETE method for the create, update, and delete operations. This is sometimes referred to as a "REST API".  On top of this scheme you may choose from a variety of data serialization options. 

With this approach, you can tailor the API precisely to what you believe your client applications' require. You don't need any Breeze-oriented components on the server.  You can ignore Breeze altogether. 

On the other hand, you're API is entirely idiosyncratic and you'll have to explain that API to all client developers (Breeze and non-Breeze client developers) so they know how to call your API, how to interpret response data, and how to compose a request body when a body is needed. 

Breeze clients work well with these APIs too. You have to do a bit more work to configure your Breeze client to communicate with such an API; there are a variety of client-side extension points for this purpose. The effort is small or large depending upon the complexity of your API and in this respect writing a Breeze client is no more challenging than writing a client without Breeze.

> You do have to learn how. Documentation for this path is not yet available but is on the way.

## OData Web API
Prior to the advent of ASP.NET Core, OData was a important part of the .NET ecosystem.  **This is no longer the case.**  As a result Breeze only retains its OData support for legacy ASP.NET Web API applications. 

ASP.NET provides a special set of components and techniques for building an <a href="http://www.asp.net/web-api/overview/odata-support-in-aspnet-web-api" target="_blank" title="OData Support in Web API">OData service in Web API</a>.

Such a service can be consumed by any client that understands the <a href="http://www.odata.org/" target="_blank" title="OData.org">OData protocol</a> ... a set that includes Breeze clients.  If you're writing an OData Web API service, you have implementation choices with consequences for client application developers. To learn how these choices affect Breeze clients, start with the topic "[OData on the Server](/doc-net/odata)".

{% include support-frag.html %}
