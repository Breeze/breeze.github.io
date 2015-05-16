---
layout: doc-js
---

# Open Data (OData)

Breeze can consume any <a href="http://www.odata.org/" target="_blank">standard OData</a> feed "as is" when you configure the client for OData.

#Configure the client for your OData service

Breeze is not configured for OData services out of the box but it's easy to tell Breeze that you want to talk to an OData source. The first step is to configure your Breeze application's "data service adapter" which handles direct communication with remote data services. 

The catch is that you have to pick the right adapter for your OData source. OData may be a "standard" but not all OData services are the same. They often diverge from the specifications in ways that can be painful for you. 

We discuss the diversity of OData services (and the consequences) in a separate topic devoted to [OData on the Server](http://www.breezejs.com/documentation/odata-server "OData Services"). **Be sure to read it carefully**.

## Industry standard and WCF OData sources

Most industry standard OData services (including Microsoft's WCF OData) *should* work with the "standard" OData data service adapter shipped in Breeze core.  Configure your application to talk to this source before executing any Breeze server call. You might add this to your application bootstrapping:

    // "Standard" Web API OData source (e.g., WCF OData)
    breeze.config.initializeAdapterInstance('dataService', 'odata', true);

## ASP.NET Web API OData

Breeze core ships with THREE OData service adapters. **Be sure to pick the right adapter for your service!**

The "standard" adapter you met earlier; it works with WCF OData.

There are TWO for ASP.NET Web API OData ... because Web API changed the protocol (the URL syntax in particular) at least twice. Pick one of these two configurations as appropriate.

    // ASP.NET Web API OData v.4
    breeze.config.initializeAdapterInstance('dataService', 'webApiOData4', true);

    // ASP.NET Web API OData PRIOR to v.4
    breeze.config.initializeAdapterInstance('dataService', 'webApiOData', true);

Sadly, ***the breaking changes just keep coming***. Folks are reporting that some Web API OData services are rejecting the links inside the `saveChanges` multi-part $batch payload. You may have to adjust the way Breeze constructs those links by tweaking the `getRoutePrefix` method. 

Here is the version currently shipping (December 2014) with both Web API OData adapters.

	function getRoutePrefix (dataService) {
		// Get the routePrefix from a Web API OData service name.
		// The routePrefix is presumed to be the pathname within the dataService.serviceName
		// Examples of servicename -> routePrefix:
		//   'http://localhost:55802/odata/' -> 'odata/'
		//   'http://198.154.121.75/service/odata/' -> 'service/odata/'
		if (typeof document === 'object') { // browser
		  var parser = document.createElement('a');
		  parser.href = dataService.serviceName;
		} else { // node
		  parser = url.parse(dataService.serviceName);
		}

		// YOUR CHANGES GO HERE
		var prefix = parser.pathname;
		if (prefix[0] === '/') {
		  prefix = prefix.substr(1);
		} // drop leading '/'  (all but IE)
		if (prefix.substr(-1) !== '/') {
		  prefix += '/';
		} // ensure trailing '/'
		return prefix;
	};

Feel free to rewrite it to suit your version of the Web API OData service and assign it to the adapter.

    var adapter = breeze.config.initializeAdapterInstance('dataService', 'webApiOData4');
    adapter.getRoutePrefix = myGetRoutePrefix;

This is an example of a more general problem. The Web API OData simply does not comply with the OData specification for metadata and has other peculiarities that you should consider in your design. Please read about this in [OData on the Server](http://www.breezejs.com/documentation/odata-server "OData Services")

We also highly recommend the Pluralsight course &quot;<a href="http://pluralsight.com/training/courses/TableOfContents?courseName=aspnetwebapi-odata" target="_blank"><strong>Building ASP.NET Web API OData Services</strong></a>&quot; by <a href="http://briannoyes.net/default.aspx" target="_blank">Brian Noyes</a>. The module, "Consuming OData Services...", demonstrates consuming a Web API OData service with Breeze.

<h2 id="data-js">DataJS dependency</h2>

This Breeze client can retrieve standard OData metadata, submit standard OData query requests, and interpret the results as Breeze entities using the OData HTTP URI protocol.

Both of the aforementioned Breeze OData adapters <strong>depend upon </strong><a href="http://datajs.codeplex.com/documentation" target="_blank"><strong>datajs</strong></a>&nbsp;to handle lower level communications with OData sources. Be sure to include that script before Breeze.js itself.</p>

## Setting the service address

You must specify an absolute path for your service address (AKA serviceName), e.g, `"http://localhost:1234/odata"</code> instead of just <code>"/odata"`. Relative paths work for queries but apparently not for `saveChanges`.

##Adding headers and other configuration

The Breeze OData DataService adapters, "OData" and "webApiOData", rely on the DataJS `OData` component to handle AJAX calls. If you need to add custom headers or otherwise manipulate the HTTP request, you'll need to configure the `OData.defaultHttpClient` as described in the ["Controlling AJAX calls"](controlling-ajax#odata-ajax "OData AJAX") topic.

When you save entities, the entire change-set becomes a $batch request consisting of multiple nested HTTP requests for each entity. The DataService adapters build these requests for you. You can [adjust the $batch details](controlling-ajax#changeRequestInterceptor "Adjust save request data with a changeRequestInterceptor") via each adapter's `changeRequestInterceptor`.

#Support for other OData sources

We will be adding more <em>dataService</em>adapters for other popular sources. Stay tuned.
