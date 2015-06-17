---
layout: doc-js
redirect_from: "/old/documentation/odata.html"
---

# Open Data (OData)

Breeze can consume any <a href="http://www.odata.org/" target="_blank">standard OData</a> feed "as is" when you configure the client for OData.

# Configure the client for your OData service

Breeze is not configured for OData services out of the box but it's easy to tell Breeze that you want to talk to an OData source. The first step is to configure your Breeze application's "data service adapter" which handles direct communication with remote data services. 

The catch is that you have to pick the right adapter for your OData source. OData may be a "standard" but not all OData services are the same. They often diverge from the specifications in ways that can be painful for you. 

We discuss the diversity of OData services (and the consequences) in a separate topic devoted to [OData on the Server](/doc-net/odata.html "OData Services"). **Be sure to read it carefully**.

## Industry standard and WCF OData sources

Most industry standard OData services (including Microsoft's WCF OData) *should* work with the "standard" OData data service adapter shipped in Breeze core.  Configure your application to talk to this source before executing any Breeze server call. You might add this to your application bootstrapping:

    // "Standard" Web API OData source (e.g., WCF OData)
    breeze.config.initializeAdapterInstance('dataService', 'odata', true);

## ASP.NET Web API OData v.3

Breeze core ships with multiple OData service adapters. **Be sure to pick the right adapter for your service!**

The "standard" adapter you met earlier; it works with WCF OData.

There is an adapter for ASP.NET Web API OData v.3

    breeze.config.initializeAdapterInstance('dataService', 'webApiOData', true);

>MS introduced a breaking change in December 2014 with the Microsoft.AspNet.WebApi.OData v.5.3.1 nuget package. The v.1.5.5 version of Breeze will compensate. In the short run you may try [this patched version of *breeze.debug.js*](https://github.com/Breeze/breeze.js/blob/e7cb67e44a12262231c92756f5e3f0d7034f9b21/build/breeze.debug.js) temporarily. Be sure to update to the official version as soon as it is released!

We also highly recommend the Pluralsight course &quot;<a href="http://pluralsight.com/training/courses/TableOfContents?courseName=aspnetwebapi-odata" target="_blank"><strong>Building ASP.NET Web API OData Services</strong></a>&quot; by <a href="http://briannoyes.net/default.aspx" target="_blank">Brian Noyes</a>. The module, "Consuming OData Services ...", demonstrates consuming a Web API OData service with Breeze.

## <a name="data-js"></a>DataJS dependency (v.2-3)

This Breeze client can retrieve standard OData metadata, submit standard OData query requests, and interpret the results as Breeze entities using the OData HTTP URI protocol.

Both of the aforementioned Breeze OData adapters *depend upon* <a href="http://datajs.codeplex.com/documentation" target="_blank"><strong>datajs</strong></a>&nbsp;to handle lower level communications with OData sources. Be sure to include that script before Breeze.js itself.

## ASP.NET Web API OData v.4

We are working on an adapter for ASP.NET Web API OData v.4.

    // ASP.NET Web API OData v.4
    breeze.config.initializeAdapterInstance('dataService', 'webApiOData4', true);

**It isn't ready yet.** Sadly, ***the breaking changes just keep coming*** and there still is no release of the Web API OData that supports the v.4 spec. You can learn more about this in [OData on the .NET Server](/doc-net/odata.html "OData Services")

## <a name="olingo-js"></a>Olingo dependency (v.4)

The datajs client library does not work with OData **v.4** sources; it's only good for OData v.1-3. 

You'll need the [JavaScript client library from Olingo](https://olingo.apache.org/doc/javascript/index.html). Be sure to include that script before Breeze.js itself.

>We'll have more to say about this when we release our adapter for OData v.4

## Setting the service address

Prior to Breeze v.1.5.5, you must specify an absolute path for your service address (AKA `serviceName`).  Relative paths work for queries but not for `saveChanges` (prior to *Microsoft.AspNet.WebApi.OData* v.5.3.1). For example, you'd set the `serviceName` to "http://localhost:1234/odata" instead of just the odata web api fragment, "odata".

Here is a general purpose approach to setting the `serviceName` to an absolute path:

    var serviceName = window.location.protocol + '//' + window.location.host + '/odata/';

As of v.1.5.5, Breeze accepts either a *relative* or *absolute* `serviceName`. You'll be able to write:

      var serviceName = 'odata/';

You may still prefer to specify the absolute URL for your service address ... and that's fine with Breeze. The v.1.5.5 adapter converts all *relative* addresses to *absolute* addresses via `webApiODataCtor.prototype.getAbsoluteUrl`. 

## Adding headers and other configuration

The Breeze OData DataService adapters rely on either the [datajs](#data-js) or [olingo](#olingo-js) `OData` clients to handle AJAX calls. If you need to add custom headers or otherwise manipulate the HTTP request, you'll need to configure them appropriately.

With datajs, for example, you would configure `OData.defaultHttpClient` as described in the ["Controlling AJAX calls"](/doc-js/server-ajaxadapter#odata-ajax "OData AJAX") topic.

When you save entities, the entire change-set becomes a `$batch` request whose body consists of multiple nested HTTP requests, one per entity. The DataService adapters build these inner requests for you.
 
You can [adjust the $batch details](/doc-js/server-ajaxadapter#changeRequestInterceptor "Adjust save request data with a changeRequestInterceptor") via each adapter's `changeRequestInterceptor`.

# Support for other OData sources

We will be adding more *dataService* adapters for other popular sources. Stay tuned.
