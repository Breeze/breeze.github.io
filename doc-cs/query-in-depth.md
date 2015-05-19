---
layout: doc-cs
---

# Querying in depth

In this topic we explore Breeze query features and techniques in depth.

> If a query completely misbehaves, take a look at the "<a href="/breeze-sharp-documentation/query-result-debugging" title="Query result debugging">Query result debugging</a>" topic. 

This page is currently a framework for topics and is nowhere near complete. Eventually this page will cover:

- the role of the EntityManager in querying
- the resource name: a Rose is not a rose
- how the client query becomes an URL in OData query syntax
- getting data from an arbitrary HTTP source
- <a href='#QueryOptions'>QueryOptions</a> control how queried entities are found and merged into the cache</li>
- the query result data package
- query the local cache with *ExecuteQueryLocally*
- combining remote and local query for a refreshed cache perspective on the results
- *EntityQuery* immutability
- filtering
    - simple conditions
	- compound condition with predicates
	- conditions on related entities using property paths
    - using <a href='#withParameters'>WithParameter</a> to pass arbitrary parameters to the server
- refresh values for or more entities
- get an entity when you know its key
- load related entities on-demand
- include related entities in the query result payload with *Expand*
- paging with *Skip*, *Take*, *Top* and *InlineCount*
- projection queries to select a subset of properties and flatten object graphs
- using OrderBy to sort results on the data tier
- shape the base query on the server with custom query actions
- events raised during the query process


Please consult the API documentation for the following related classes:

- EntityQuery
- EntityManager
- FetchStrategy
- MergeStrategy
- PredicateBuilder
- QueryOptions

The **QueryTests** module in DocCode sample demonstrates many of the techniques covered in this topic.


> This page is under construction. The following is a grab-bag of details concerning the points just enumerated.

<a name="withParameters" />
## Passing parameters to the server
Often the method on the server does not recognize OData URI query syntax but it does take other parameters passed in the query string of the request.

You can query these endpoints by adding the `.WithParameters(...)` clause to your query.

>This is probably how you will query servers that are not written with .NET technologies.

<p class="note">Brian Noyes has an <a href="http://briannoyes.net/2014/02/13/passing-complex-query-parameters-with-breeze/" target="_blank" title="Passing Complex Query Parameters with Breeze"><strong>excellent blog post</strong></a> describing <code>WithParameters</code> queries in great detail.  His examples are in Javascript but the same API is present in the Breeze.Sharp product.</p>

Web API Example:

**Client** 

    var query = EntityQuery.from("EmployeesByFirstName")
        .WithParameter("firstName", "Fred"); 
	
**Server**

    [HttpGet]
    public IQueryable<Employee> EmployeesByFirstName(string firstName) {
        return ContextProvider.Context.Employees.Where(e => e.firstName == firstName);
    }

Notice that we pass the parameter names and their values. The spelling and capitalization of the parameter name may be important. Breeze constructs the URL with these names as you spell them, expecting the server to correlate the names with parameters of the method at the target endpoint. In our example, "firstName" matches the parameter name of the `EmployeesByFirstName` method on the server.

Obviously you could have written this as a normal Breeze query but we trust you get the idea. 

Web API assumes that data for non-simple parameter types will be in the body of the request. GET requests don't have bodies. The Breeze client serialized the array values into the query string of the request URI. This attribute tells the Web API to bind the parameter to those array values in the URI.


<a id='paging'></a>
## Paging with *Skip*, *Take*, and *InlineCount* ##

A query typically returns all entities that satisfy the filter criteria in your `Where` clause(s). It could return a lot of data ... perhaps more data than you need or want right now.

You can ask for a smaller "page" of data instead by specifying the number of items to keep (`Query.Take(10)`). This is your "page size".

To skip a few pages before getting to the page you want, do this: 

    query.OrderBy(something).Skip(pageSize * pageSkip).Take(pageSize)

>You can append `Take` to any query but your query must have an `OrderBy` clause before you can add `Skip`. You can use `Skip` without `Take` ... but why would you?

You can get a count of the entities that satisfy your filter criteria at the same time you get a page of results by adding the `.InlineCount()` clause to the query. When you add the `InlineCount()` clause to the query you will actually be changing the return type that the query returns when executed.  It is still an IEnumerable<T>, but this can now be cast to the `IHasInlineCount` interface to access the actual count.

Let's put these thoughts together:

    var products, inlineCount, resultCount, query;
    var pageSize = 5;
    var pageSkip = 1;

    query = new EntityQuery<Product>()
        .Where(p => p.ProductName.StartsWith("C"))
        .OrderBy(p => p.ProductName)
        .Skip(pageSize * pageSkip) // skip a page
        .Take(pageSize)            // take a page
        .InlineCount();
    
    var products = await myEntityManager.ExecuteQuery(query);
    // 'products' implements IEnumerable<Product>
    // and contains page of products beginning with 'C'
    // but it also implements IHasInlineCount via an explicit interface.
    // hence the need to cast.
    var inlineCountInfo = (IHasInlineCount) products;
    
    var inlineCount = inlineCountInfo.InlineCount; // count of products beginning with 'C'                
    resultsCount = products.length; // 0 <= resultsCount < pageSize
     


#### Getting just the count ####
Breeze does not yet support aggregate queries (count, sum, average, etc.). But we can get the count of a query without retrieving any actual data using the "*Take(0), InlineCount()*" trick:

    var inlineCount, resultCount, query;

    query = new EntityQuery<Product>()
        .Where(p => p.ProductName.StartsWith("C")) 
        .Take(0).InlineCount();

    var results = await myEntityManager.ExecuteQuery(query);
    resultsCount = results.Count(); // 0 
    inlineCount = ((IHasInlineCount) results).InlineCount;  // count of products beginning with 'C'
            

<a name="QueryOptions"></a>
### Query Options ###
The [**`QueryOptions`**](http://www.breezejs.com/breeze-sharp-api/html/T_Breeze_Sharp_QueryOptions.htm) object defines two strategies that guide the EntityManager's processing of a query.

The [**`FetchStrategy`**](http://www.breezejs.com/breeze-sharp-api/html/T_Breeze_Sharp_FetchStrategy.htm) determines the query target (server or cache). 

The [**`MergeStrategy`**](http://www.breezejs.com/breeze-sharp-api/html/T_Breeze_Sharp_MergeStrategy.htm) tells Breeze how to merge raw entity query data into cache when an entity with that key is already in cache.

