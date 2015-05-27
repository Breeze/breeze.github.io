---
layout: doc-js
---
# Talking to the server

In this section we discuss how an **EntityManager communicates** with a ***specific* remote data service**.

We'll start with the `EntityManager` itself which is the focal point of the Breeze application developer's server-facing activities. In subsequent topics we'll see how the `EntityManager` relies on supporting components that are hidden from view most of the time:

* [**DataServiceAdapter**](/doc-js/server-dataserviceadapter.html) - handles many of the details involved in preparing requests and processing server responses.

* [**JsonResultsAdapter**](/doc-js/server-jsonresultsadapter.html) - transforms raw JSON from the server into a shape that Breeze can interpret.

* [**NamingConvention**](/doc-js/server-namingconvention.html) - translate between server-side property names and client-side property names.

* [**AjaxAdapter**](/doc-js/ajaxadapter.html) - a concrete implementation of the Breeze interface for making AJAX requests and receiving responses.

We'll also cover [**OData**](/doc-js/server-odata.html) in this section. OData is a widely used, open source protocol for CRUD operations. Breeze supports this protocol with a couple of *DataServiceAdapters*.

## EntityManager

The `EntityManager` handles all communications with a data server that concern querying and saving entity data.

Its server-directed methods boil down to three operations:

1. fetch metadata
2. query for entities
3. save a collection of changed entities

When fetching metadata, the `EntityManager` makes a request and expects a  string response formatted as serialized entity metadata in a form that it understands.

When querying for entities, it converts a Breeze query object (an `EntityQuery`) into a server request, waits for the server's (JSON) response, then materializes the response data into entities and merges them in its cache.

When saving, it bundles one or more changed entities into a single request, waits, and then updates the cache based on the server's successful (JSON) response.

The Breeze `EntityManager` tackles these operations without specific knowledge of how your server works. The essential work flow and many of the details are the same regardless of the server. For example, the process of merging response data into the entity cache is the same for everyone.

But many details are specific to the way your server behaves.

* Can it serve metadata?
* Does it accept filter, order, and paging query requests?
* If so, in what format?
* What is the shape of the query result data in the response?
* Are the client-side entity property names the same as the server-side property names?
* Can the server save a bundle of changed entities or only one entity at a time.
* Does it expect a save in the form of a POST to a single endpoint?
* Or does it expect an HTTP request with one of the PUT / POST / DELETE / PATCH / MERGE verbs?
* What goes into the body of a save request?
* How does the body differ for add, modify, and delete requests?

Breeze can't anticipate every way a data service could answer these questions and even if it could, we wouldn't want to pack all that knowledge into the `EntityManager` itself.

Therefore, the `EntityManager` delegates most of these details to a **DataServiceAdapter** ... of which there are many, each designed to handle the details of communicating with a particular kind of remote data service.

That's probably [where you should go next](/doc-js/server-dataserviceadapter.html).
