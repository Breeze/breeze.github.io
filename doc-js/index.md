---
layout: doc-js
redirect_from: "/old/documentation/introduction.html"
---

# BreezeJS

<a class="logo-inline" href="/doc-js/" title="BreezeJS">
   <img src="/images/logos/BreezeJsB.png" alt="BreezeJS" width="100">
</a> 

Welcome to **BreezeJS** by [**IdeaBlade**](http://www.ideablade.com "IdeaBlade website"), the data management library 
for developers of rich client applications written in **JavaScript**.

<div style="clear:both"/>

**BreezeJS is a JavaScript library that helps you manage data in rich client applications**. If you store data in a database, query and save those data as complex object graphs, and share these graphs across multiple screens of your JavaScript client, Breeze is for you.

## Headline features

**Business data objects** mirror your server-side model. Breeze creates them dynamically. Their properties bind to UI controls so the UI updates when your data model changes. Each object knows when it has changed and what has changed.

**Query** in a JavaScript query language with filtering, projection, ordering, and paging.

**Save** one entity or a batch of entities as a single transaction. Batch a mix of entity types (customers, orders, line-items) and data operations (inserts, updates, deletes).

**Cache** data on the client to reduce trips to the server and refresh as needed. Query the cache like you query the server. Save the cache locally and run offline; synch changes when you're reconnected.

**Extend** the model with custom methods, properties, and events. Breeze is designed with adapters at the boundaries so you can plug into your favorite front-end and back-end technologies.

# Core client concepts

You create a Breeze **EntityManager** in your JavaScript client to access and *cache* model data. **Metadata** about your data model guides Breeze in reshaping raw data as **entities** with properties and behavior. You **query** with the `EntityManager` to load entities into cache from a **remote persistence service**.

You present entity data to users typically by **binding** UI controls to entity properties. You add new entities to cache, update existing entities, and schedule other entities to be deleted. Periodically you **save** these pending changes in a batch back to the persistence service which stores them in a database as a single transaction.

This entity-oriented style of data management is familiar to business application developers who use an Object Relational Mapper (ORM) or such technologies as ActiveRecord, RIA Services, and IdeaBlade's <a href="http://www.ideablade.com/">DevForce</a>.

The **bold** terms are clues to the key components and concepts in Breeze.

## EntityManager

The Breeze `EntityManager` is both a gateway to the back-end persistence service and a cache of the entities that you're working on locally.

You ask an `EntityManager` to execute queries and save pending changes. The `EntityManager` builds the requisite requests and handles the asynchronous communications with the back-end service.

The objects queried and saved are entities held in the `EntityManager`'s cache. Entities enter the `EntityManager` cache in several ways: as a result of a query, by adding entities directly to the cache, or perhaps by importing them from another source (a file, another `EntityManager`). Entities leave the cache when you remove them manually and after saving entities marked for deletion. You can query the cache in the same way ... with the same query command object ... that you use to query the remote server.

You'll learn more about the `EntityManager` soon. But let's take a step back. What's an "entity"?

## Entity

An entity represents a meaningful "thing" in your application model. That thing consists of simple data (a name), relationships to other entities (the customer of an order), and some rules (the name is required).

A Breeze entity is an object with data properties and navigation properties that return related entities. Data properties typically return simple data values: the strings, numbers, Booleans, and dates that correspond to fields of a record in a database. Navigation properties return related entities from the `EntityManager`'s cache. For example, an order's navigation properties can return its parent customer (`anOrder.Customer`) or its line items (`anOrder.OrderDetails`).

A Breeze entity also contains a kernel of "entity-ness", its `entityAspect`, to help Breeze manage the entity. You can inspect the `entityAspect` and make changes to influence how Breeze handles the entity.

Perhaps an entity's most important aspect is its `entityState`. The `EntityState` indicates whether a Breeze entity is new (`Added`) or already exists in the backing store.  If it already exists, the entity might be unchanged, modified, or marked-for-deletion (`Deleted`). You can examine the original values of a pre-existing entity and restore the entity to its original state by calling `entityAspect.rejectChanges()`.

## Data binding and observability

Breeze applications rely mostly on data binding to coordinate the flow of values between a Breeze entity and the widgets on screen. See <a href="http://weblogs.asp.net/dwahlin/archive/2012/07/27/The-JavaScript-Cheese-is-Moving_3A00_-Data_2D00_Oriented-vs.-Control_2D00_Oriented-Programming.aspx" target="_blank">Dan Wahlin's post</a> to see why data binding is a good tool for this job.

Data binding can push a new value to the UI when it detects that an entity property has changed.

Many binding frameworks detect changes by listening to a property changed event, which means the entity properties must be observable. Breeze entity properties are observable.

There is no standard observability mechanism in JavaScript. Each UI data binding library (Angular, React, Vue, Aurelia ...) has its own observability scheme. Without Breeze, you could write your model object properties to conform to the dictates of the library you picked. That's grunt work. Breeze writes observable properties for you in the style of the library you choose. 

>Breeze currently supports [AngularJS 1.x](https://angularjs.org/), [Angular 2+](https://angular.io/), [React](https://reactjs.org/), [Vue](https://vuejs.org/), [Aurelia](http://aurelia.io/) with adapters for other libraries under consideration, if needed. Note however, that you may not need anything new.  The current adapters already work for many libraries other than those listed above.  The list above is simply those that we have actually tested.

We'd be happy to help you write an adapter for a library we don't yet support.

## Query

You retrieve entities from a back-end database by composing an `EntityQuery` object in the Breeze query language and executing that query object with an `EntityManager`.

In the following example, we compose a query for all customers whose name begins with the letter 'C' and sort the results by company name.

	var query = breeze.EntityQuery()
	    .from('Customers')
	    .where('CompanyName', 'startsWith', 'C') 
	    .orderBy('CompanyName');

Then we create an `EntityManager` and execute the query.

	var manager = new breeze.EntityManager(serviceName);
	manager.executeQuery(query)  // [1]
	       .then(querySucceeded) // [2]
	       .catch(queryFailed);   // [3]

Notice that [1] the `executeQuery` method is asynchronous and returns a <a href="https://github.com/kriskowal/q">promise</a> to call back either [2] the `querySucceeded` method if the query succeeds or [3] the `queryFailed` method if query execution fails with an exception.

Breeze resolves this query into an HTTP GET request to a persistence service endpoint. The request URI's query string holds the query specification. Typically this query string is expressed as URI encoded JSON. However Breeze also provides the mechanisms for substituting you own query encoding in the event you want to use a nonstandard server implementation.

The server returns query results as JSON. The Breeze `EntityManager` reshapes the JSON data into entities and merges them into its cache. Finally it passes these entities to the promise object which forwards them to the caller's success callback (the `querySucceeded` method in the example).

By default the manager preserves pending changes when merging query results into its cache. For example, if the results included the 'Acme'; company entity and the user had made an *as-yet-unsaved* change to Acme's street address, the manager won't touch *any* of Acme's current values. We'll cover merging in greater detail later in the documentation.

## query the cache
The same query object can be used to find 'C' customers in cache.

	var customers = manager.executeQueryLocally(query)

This time the query only applies to entities in cache; the `EntityManager` does not call the back-end. This statement executes synchronously and the results are available immediately.

Notice that we use the same query syntax - the same query object - to search both the local cache and a remote database.

You can write complex queries in the Breeze query language. For example, a query can reference related entities as when we filter for customers who have placed an order in California. It can combine the filtered customers with their orders in the same result payload. It can project a result that flattens the Customer-Orders graph into a three-valued object: *CustomerId*, *CustomerName*, and *OrderCount*. 

> See [the query examples documentation](/doc-js/query-examples.html) for more examples.

## Save

A typical Breeze application doesn't save a changed entity immediately. Instead, Breeze records the pending changes within the entity itself and sets the entity's `entityState` to one of the changed-state values" `Added`, `Modified`, or `Deleted`.

The user could make changes to many different entities before saving them as a batch. The pending changes accumulate in cache until you call the `EntityManager.saveChanges()`as illustrated here:

	manager.saveChanges()       // returns a promise
	       .then(saveSucceeded) // if save succeeds
	       .catch(saveFailed);   // if save throws an exception

The manager bundles every changed entity into a batch, runs validations over those entities and, if they all pass, posts a request to the persistence service to save the batch.

In principle, the persistence service can receive the batch in a single request and save the batch contents to a database as a single transaction. The actual details of the save request and what the service does with the batch depend upon the API and capabilities of the remote service itself.

## Metadata 

For saves (and queries) to work, the client and service must understand the shape and characteristics of the entity data they exchange. Breeze must be able to translate a client-side customer entity into its equivalent object on the server. Breeze relies upon model metadata to make that translation.

Breeze metadata describe entity types and relationships among entities in a data model. Breeze needs this metadata to communicate with the persistence service during query and save, to create new entities on the client, and to navigate among entities in cache.

Because Breeze has metadata, it can generate your JavaScript model objects on the fly.  You may not have to write these objects by hand. For example, to create a new customer object you could write the following:

	// Create new customer named 'Acme' and add to the manager's cache
	var newCust = manager.createEntity('Customer', {CompanyName='Acme';});

You are not boxed in by the metadata entity type. It's easy to extend the Breeze-generated entity type with a custom constructor and add custom properties, methods, events, and validations.

## Persistence Service

A Breeze application makes HTTP requests of a persistence service that typically resides on a remote server. 

The Breeze ***client*** doesn't know ... or care ... how the data are processed and stored by that persistence service. The service could be written in any language and run on any platform. The Breeze client can be adapted to speak to almost any data service supporting an HTTP + JSON API.

The Microsoft server technologies happens to be very popular with business application developers. Breeze ships with adapters for the ASP.NET <a href="http://www.asp.net/web-api">Web API</a> and for <a href="http://www.odata.org">OData</a>. It also ships with .NET components that interface with the Entity Framework and that generate Breeze metadata from an Entity Framework model. 

But it bears repeating: Breeze client is in no way limited to these particular technologies. The samples and documentation describe numerous alternatives.

## What's next?

You now have the big picture. Take a look at Breeze <a href="/doc-js/features.html">Features</a> or run the <a href="http://learn.breezejs.com" target="_blank">Online Tutorial</a>.

{% include support-frag.html %}
 
