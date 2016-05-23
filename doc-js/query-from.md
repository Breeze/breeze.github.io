---
layout: doc-js
redirect_from: "/old/documentation/query-from.html"
---

# Query *.from(resource)*

Every Breeze query needs a target **resource** that identifies the destination of the query.

You typically aim a Breeze query at a particular **resource** with a [`.from(resource)` clause](/doc-js/api-docs/classes/EntityQuery.html#method_from "API doc: EntityQuery.from") like this:

    var query = breeze.EntityQuery.from('Orders');

This topic covers how Breeze

- turns that resource string value into a URI for remote queries
- determines the root `EntityType` of the query ... if it has one

## From resource name to URI

"Orders" in that example is a **resource name**. When you execute the query targeting a remote service as we do here ... 

		manager.execute(query);

Breeze turns that name into a URI by prefixing it with the [`dataService.serviceName`](/doc-js/api-docs/classes/DataService.html#property_serviceName "API Doc: DataService.serviceName") for this query. If the `serviceName` is "*breeze/Northwind/*", Breeze would compose this *relative URL*:

    breeze/Northwind/Orders

>The `EntityManager` that executes the query usually supplies the `DataService` but you can specify a different one for a particular query with a [`.using` clause](/doc-js/api-docs/classes/EntityQuery.html#method_using "API doc: EntityQuery.using").

If your web page base address is "*http://localhost:58066/*", the *absolute URL* to which the query will be sent is likely to be this:

    http://localhost:58066/breeze/Northwind/Orders

Alternatively you can specify the absolute URI as the *resource name* and breeze will use that exact URL instead. The following `.from` clause results in the same URL:

    var query = breeze.EntityQuery
        .from('http://localhost:58066/breeze/Northwind/Orders');

The absolute URI option allows you to compose the entire URL (including query string), without Breeze's assistance (or interference).
 
Note that, while the absolute URI may be the same as the one breeze would compose, the *resource name* is different. The resource name is the string in the `.from` clause. The following two resource names are not the same, even if they produce the same query result.

    1) 'Orders'
    2) 'http://localhost:58066/breeze/Northwind/Orders'

To understand why, we must see how Breeze relates a resource name to an `EntityType`.

## From resource name to EntityType

Breeze does not *have* to know the root `EntityType` targeted in a remote query. For example, the server might return `Order` entity JSON in response to all of these queries:

    .from('Orders')           // plural
    .from('http://localhost:58066/breeze/Northwind/Orders')
    .from('Order')           // singular
    .from('OrderAndDetails') // returns Order and their OrderDetails
    .from('Foos')            // who knew?

Breeze will wait for the query results to arrive and let the prevailing [`JsonResultsAdapter`](/doc-js/api-docs/classes/JsonResultsAdapter.html "API Docs: JsonResultsAdapter") translate the JSON payload into `Order` entities. 

>Perhaps some or all of the JSON objects aren't entities at all. That's OK too. Such data objects are returned to the caller in the query response "as is".

Although Breeze doesn't *have* to know the target type, it can be helpful ... or even necessary for certain queries. For example, consider a query that filters by date.

    breeze.EntityQuery.from('Orders')
      .where('OrderDate', '>=', 'January 1, 1998')

The comparison value, 'January 1, 1998', is a string. What is breeze supposed to do with that?

If Breeze can determine that the root type for 'Orders' is `Order`, it can discover that 'OrderDate' is a `DateTime` type and convert the string into a suitable date format for the URL like this:

    ~/Orders?$filter=OrderDate ge datetime'1998-01-01T00:00:00.000Z'

Suppose we query again with a legitimate but different resource name that breeze doesn't know about:

    // return Orders and their related OrderDetails
    breeze.EntityQuery.from('OrdersAndDetails')  
      .where('OrderDate', '>=', 'January 1, 1998')

Breeze doesn't know that the 'OrderDate' property is a `DateTime` type  and simply uses 'January 1, 1998' as is. The URL becomes.

    ~/OrdersAndDetails?$filter=OrderDate ge 'January 1, 1998'

The server is expecting the comparison value to be a date. It could choose to reject the query rather than try to parse the string. The response might be:

	"The query specified in the URI is not valid. 
     A binary operator with incompatible types was detected. 
     Found operand types 'Edm.DateTime' and 'Edm.String' for 
     operator kind 'GreaterThanOrEqual'."

>This *is* the response from a Web API / EF server.

### Cast with *.toType*

The easy solution is to tell Breeze what type to expect with the [`toType` clause](/doc-js/api-docs/classes/EntityQuery.html#method_toType "API Docs: toType") as follows:

    breeze.EntityQuery.from('OrdersAndDetails')
      .where('OrderDate', '>=', 'January 1, 1998')
      .toType('Order')

Now Breeze can determine that the 'OrderDate' property is a `DateTime` type and parse the string date. It composes the proper query URL and the server happily responds with orders and their details.

## Default resource name <a name="defaultResourceName"></a>

Why didn't we need `.toType` for the first query that targets 'Orders'?

    .from('Orders')

Why did Breeze know that an 'Orders' query concerns entities of type `Order`?

The answer lies in the **metadata**. Let's look at a part of the metadata for `Order`.

    var orderType = manager.metadataStore.getEntityType('Order');
    orderType.defaultResourceName; // "Orders"

In this example, the `defaultResourceName` returns "Orders" ... which just happens to be the resource name we used in our query. That's all Breeze needed to correlate the query resource name with the `Order` type.

Who set `defaultResourceName` to "Orders"?  That depends upon how you got your metadata. 

You might have done it yourself, if you coded your [metadata by hand](metadata-by-hand "Metadata By Hand"). If you get your metadata from the server, something *there* must have set it.

>For example, when the metadata are generated from an Entity Framework model, the `defaultResourceName` is set to the `DbContext` collection name. The collection name is typically the plural of the entity type name. Accordingly, "Orders" is the collection name of the `Order` type.
>
>Your server's GET endpoint is also probably called "Orders" because it is conventional for the endpoint name to be the plural of the type name. 
>
>These conventions jointly conspire to yield the happy result that "Orders" is the breeze `defaultResourceName` *and* the endpoint name *and* the EF collection name. It all *just works*.

## The type name is not a resource

**Don't confuse the `EntityType` name with a resource name**. The resource name is just a string, one that should identify an endpoint.

There can be only one `defaultResourceName` and it most likely is *not* the same as the `EntityType` name. It isn't the same in our example: "Orders" (the default resource) is not "Order" (the type name).

Returning to our example, the following query must fail in the same way that it failed when we targeted "OrdersAndDetails":

    breeze.EntityQuery.from('Order')  // the EntityType name
      .where('OrderDate', '>=', 'January 1, 1998');

You can cure the problem with `.toType` as before.

    breeze.EntityQuery.from('Order')  // the EntityType name
      .where('OrderDate', '>=', 'January 1, 1998')
      .toType('Order');

## Resource names and local cache queries

It's easy in Breeze to take the remote service query object and [apply it to the local cache](/doc-js/query-locally.html "querying the local cache"). 

	var query = breeze.EntityQuery.from('Orders') // back to 'Orders'
		.where('OrderDate', '>=', 'January 1, 1998');

You can execute it synchronously ...

    var orders = manager.executeQueryLocally(query);

or asynchronously

    var orders;
	var qLocal = query.using(breeze.FetchStrategy.FromLocalCache);
    manager.executeQuery(qLocal)
        .then(function(data) { orders = data.results; });    

The resource name of a local cache query **must resolve to an `EntityType`**. Breeze isn't going to produce an HTTP URL that targets a remote endpoint. It's going to look for entities in cache where there are no endpoints. The cache is organized by `EntityType`. To resolve a cache query, Breeze must translate the query resource name to an `EntityType` in metadata.

The example query above works just fine because Breeze can translate from the "Orders" resource name to the `Order` type via the `defaultResourceName`.

## Registering alternative resource names

Some folks want to use the `EntityType` name when targeting the local cache. They want to write `.from('Order')` rather than `.from('Orders')` and they don't want to tack on the `.toType` clause. They often forget to add `.toType` and wonder why the query fails.

The error message explains the problem and suggests a resolution.

	Cannot find an entityType for resourceName: 'Order'.  
    Consider adding an 'EntityQuery.toType' call to your query or calling
    the MetadataStore.setEntityTypeForResourceName method to register
    an entityType for this resourceName.

Evidently, we can specify additional mappings between a resource name and an `EntityType` with the [`MetadataStore.setEntityTypeForResourceName` method](/doc-js/api-docs/classes/MetadataStore.html#method_setEntityTypeForResourceName "API Docs: setEntityTypeForResourceName"). Let's do that for the "Order" type name:

	var meta = manager.metadataStore;
    meta.setEntityTypeForResourceName('Order', 'Order');

Now this query works both remotely and locally without assistance from `.toType`:

    var query = breeze.EntityQuery.from('Order') // use the type name
		.where('OrderDate', '>=', 'January 1, 1998')
        .using(manager);   // pin the query to this manager

	query.execute.then(...); // remote async

    query.using(breeze.FetchStrategy.FromLocalCache)
         .execute.then(...)  // local async

    var orders = query.executeLocally(); // local synchronous

Don't stop there. Feel free to register additional resource names:

    meta.setEntityTypeForResourceName('OrderAndDetails', 'Order');
    meta.setEntityTypeForResourceName('Foos', 'Order');

Notice that the **resource name is the first parameter**, the `EntityType` name is the second parameter. Don't let the `setEntityTypeForResourceName` method name fool you.

## Finding the registered resources

[`MetadataStore.getEntityTypeNameForResourceName`](/doc-js/api-docs/classes/MetadataStore.html#method_getEntityTypeNameForResourceName "API Docs: getEntityTypeNameForResourceName") can tell you the `EntityType` for  a resource name. 

After adding resource names as we did above, all of the following return the `Order` type:

	var meta = manager.metadataStore;
    meta.getEntityTypeForResourceName('Orders');
    meta.getEntityTypeForResourceName('Order');
    meta.getEntityTypeForResourceName('OrderAndDetails');
    meta.getEntityTypeForResourceName('Foos');

>There is no public API for listing the registered resource names. We'll bet you can find the private mappings list in the `MetadataStore` object itself. Be careful. Non-public APIs can change without warning in future versions of Breeze.

