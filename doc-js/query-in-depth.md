---
layout: doc-js
---

<h1>Querying in depth</h1>

<p>In this topic we explore Breeze query features and techniques in depth.</p>

<p class="note">If a query completely misbehaves, take a look at the "<a href="/doc-js/query-debugging.html" title="Query result debugging">Query result debugging</a>" topic.</p> 

<p>This page is currently a framework for topics and is nowhere near complete. Eventually this page will cover:</p>

<div class="index">
<ul>
	<li>the role of the <span class="codeword">EntityManager</span> in querying</li>
	<li>the resource name: a Rose is not a rose</li>
	<li>how the client query becomes an URL in OData query syntax</li>
	<li>getting data from an arbitrary HTTP source</li>
	<li><a href='#QueryOptions'><span class="codeword">queryOptions</span></a> control how queried entities are found and merged into the cache</li>
	<li>the query result data package</li>
	<li>query the local cache with <span class="codeword">executeQueryLocally</span></li>
	<li>combining remote and local query for a refreshed cache perspective on the results</li>
	<li>hiding async ceremony by pouring results into a data bound, observable array</li>
	<li><span class="codeword">EntityQuery</span> immutability</li>
	<li>filtering
	<ul>
		<li>simple conditions</li>
		<li>compound condition with <span class="codeword">Predicates</span></li>
		<li>conditions on related entities using property paths</li>
                <li>using <a href='#withParameters'><span class="codeword">withParameter</span></a> to pass arbitrary parameters to the server</li>
	</ul>
	</li>
	<li><span class="codeword">fromEntities</span> &ndash; refresh values for or more entities</li>
	<li><span class="codeword">fromEntityKey</span> &ndash; get an entity when you know its key</li>
	<li><span class="codeword">fromEntityNavigation</span> &ndash; load related entities on-demand</li>
	<li>include related entities in the query result payload with <em>expand</em></li>
	<li><a href='#paging'>paging with <em>skip</em>, <em>take</em>, <em>top</em>, and <em>inlineCount</em></a></li>
	<li>projection queries to select a subset of properties and flatten object graphs</li>
	<li><span class="codeword">orderBy</span> to sort results on the data tier</li>
	<li>shape the base query on the server with custom query actions</li>
	<li>Events raised during the query process</li>
</ul>

<p>Please consult the API documentation for the following related classes:</p>

<p style="margin-left: 2em;"><span class="codeword">EntityQuery</span><br />
<span class="codeword">EntityManager</span><br />
<span class="codeword">FilterQueryOp</span><br />
<span class="codeword">FetchStrategy</span><br />
<span class="codeword">MergeStrategy</span><br />
<span class="codeword">Predicate</span><br />
<span class="codeword">QueryOptions</span></p>

<p>The <strong><em>queryTests</em></strong> module in DocCode demonstrates many of the techniques covered in this topic.</p>
</div>

<p class="note">This page is under construction. The following is a grab-bag of details concerning the points just enumerated.</p>

<a name="withParameters"></a>
## Passing parameters to the server
Often the method on the server does not recognize OData URI query syntax but it does take other parameters passed in the query string of the request.

You can query these endpoints by adding the `.withParameters(...)` clause to your query.

>This is probably how you will query servers that are not written with .NET technologies.

<p class="note">Brian Noyes has an <a href="http://briannoyes.net/2014/02/13/passing-complex-query-parameters-with-breeze/" target="_blank" title="Passing Complex Query Parameters with Breeze"><strong>excellent blog post</strong></a> describing <code>withParameters</code> queries in great detail.</p>

Web API Example:

**Client** 

	        var query = EntityQuery.from("EmployeesByFirstName")
	            .withParameters({ firstName: "Fred"}); 
	
**Server**

	        [HttpGet]
	        public IQueryable<Employee> EmployeesByFirstName(string firstName) {
	            return ContextProvider.Context.Employees.Where(e => e.firstName == firstName);
	        }

Notice that we pass an object hash of the parameter names and their values. The spelling and capitalization of the parameter name may be important. Breeze constructs the URL with these names as you spell them, expecting the server to correlate the names with parameters of the method at the target endpoint. In our example, "firstName" matches the parameter name of the `EmployeesByFirstName` method on the server.

Obviously you could have written this as a normal Breeze query but we trust you get the idea. You can send more complex parameters such as arrays as seen in this Web API example:

**Client** 

	        var query = EntityQuery.from("SearchEmployees")
	            .withParameters({ employeeIds: [1, 4] }); 
	
**Server**

	        [HttpGet]
	        public IQueryable<Employee> SearchEmployees([FromUri] int[] employeeIds) {
	          var query = ContextProvider.Context.Employees.AsQueryable();
	          if (employeeIds.Length > 0) {
	            query = query.Where(emp => employeeIds.Contains(emp.EmployeeID));
	            var result = query.ToList();
	          }
	          return query;
	        }

Note the `[FromUri]` attribute on the `employeeIds` parameter of the server-side `SearchEmployees` method. 

Web API assumes that data for non-simple parameter types will be in the body of the request. GET requests don't have bodies. The Breeze client serialized the array values into the query string of the request URI. This attribute tells the Web API to bind the parameter to those array values in the URI.

**Important**: a query can have only one `.withParameters` clause.

<a id='paging'></a>
## Paging with *skip*, *take*, *top*,  and *inlineCount* ##

A query typically returns all entities that satisfy the filter criteria in your `where` clause(s). It could return a lot of data ... perhaps more data than you need or want right now.

You can ask for a smaller "page" of data instead by specifying the number of items to keep (`query.take(10)`). This is your "page size".
> `top` is a synonym for `take` so `.top(10)` is the same as `.take(10)`.

To skip a few pages before getting to the page you want, do this: 

    query.orderBy(something).skip(pageSize * pageSkip).take(pageSize)

>You can append `take` to any query but your query must have an `orderBy` clause before you can add `skip`. You can use `skip` without `take` or `top` ... but why would you?

You can get a count of the entities that satisfy your filter criteria at the same time you get a page of results by adding the `.inlineCount()` clause to the query. The count is available in the `data` object returned from the server.

Let's put these thoughts together:

    var products, inlineCount, resultCount, query;
    var pageSize = 5;
    var pageSkip = 1;

    query = EntityQuery.from("Products")
        .where("ProductName", "startsWith", "C"); 
        .orderBy("ProductName")
        .skip(pageSize * pageSkip) // skip a page
        .take(pageSize)            // take a page
        .inlineCount();

    em.executeQuery(query).then(function(data) {
                 products = data.results;        // a page of products beginning with 'C'
                 resultsCount = products.length; // 0 <= resultsCount < pageSize
                 inlineCount = data.inlineCount; // count of products beginning with 'C'
            });

#### Getting just the count ####
Breeze does not yet support aggregate queries (count, sum, average, etc.). But we can get the count of a query without retrieving any actual data using the "*take(0), inlineCount()*" trick:

    var inlineCount, resultCount, query;

    query = EntityQuery.from("Products")
        .where("ProductName", "startsWith", "C"); 
        .take(0).inlineCount();

    em.executeQuery(query).then(function(data) {
                 resultsCount = data.results.length; // 0 
                 inlineCount = data.inlineCount;     // count of products beginning with 'C'
            });

#### Remove *take* and *skip* clauses ####
A query is an object. You can pass it around and re-use it, making adjustments as needed. Suppose for some reason I have a query that I want to re-use in some kind of a generic function. That function isn't sure if there is a `take` or `skip` clause. It needs to be sure. To be safe, it would like to strip off any `take` or `skip` before executing the query.

You can remove an existing `take` or `skip` from the query by appending `.take()` or`.skip()` (aka `.take(null)` and `.skip(null)`).

    function cleanTheQuery(query) {
        return query.take().skip();
    }

<a name="QueryOptions"></a>
### Query Options ###
The [**`QueryOptions`**](/doc-js/api-docs/classes/QueryOptions.html) object defines two strategies that guide the EntityManager's processing of a query.

The [**`FetchStrategy`**](/doc-js/api-docs/classes/FetchStrategy.html) determines the query target (server or cache). 

The [**`MergeStrategy`**](/doc-js/api-docs/classes/MergeStrategy.html) tells Breeze how to merge raw entity query data into cache when an entity with that key is already in cache.

The "no tracking" feature is logically another "query option" but is implemented as its own option on the `EntityQuery` itself. [`EntityQuery.noTracking`](/doc-js/api-docs/classes/EntityQuery.html#method_noTracking) determines if Breeze should attempt (`false`) or should not attempt (`true`) to merge the raw query data into cache, as discussed in the next section.

<a name="no-tracking"></a>
### "NoTracking" Queries

The [**`EntityQuery.noTracking`**](/doc-js/api-docs/classes/EntityQuery.html#method_noTracking) method accepts a single optional boolean parameter (defaults to`true` when omitted) that determines whether or not Breeze should transform query results into entities and merged their data into cache.

"NoTracking" queries execute much faster than a corresponding query without the "noTracking" option. Example:
 
        var query = EntityQuery
            .from("Orders")
            .where("customer.companyName", "startsWith", "C")
            .expand("customer")
            .noTracking();
        
        myEntityManager.executeQuery(query).then(function (data) {
            ...
        });

A "noTracking" `EntityQuery` returns simple JavaScript objects instead of Breeze entities. These query results are not entities and Breeze won't update any corresponding entities in cache with the data received from the server; such entities remain as they were.

However, the following "entity" services are still performed

1. graph cycle resolution
1. property renaming
1. datatype coercion

Note that `EntityQuery.expand` still works with 'noTracking' queries and returns *parent* entities with attached children all as simple JavaScript objects.
   
These objects are not added to the `EntityManager` and will not be observable (e.g., if you're using Knockout). However, as mentioned above, Breeze graphs cycle management and data type transformations still occur.   

#### Merging untracked entities into the EntityManager at some later date 
  
There will be times when you to take some subset of the results from an noTracking EntityQuery and convert these objects into entities and then attach them to an EntityManager. For example:    

        var empType = myEntityManager.metadataStore..getEntityType("Employee");
        var q = EntityQuery.from("Employees")
            .expand("orders")
            .noTracking()
            .using(myEntityManager);
        q.execute().then(data) {
            var rawEmps = data.results;
            emps = rawEmps.map(function (rawEmp) {
               emp = empType.createEntity(rawEmp);
               // emp has an entityAspect at this point but is not yet attached.
               empx = myEntityManager.attachEntity(emp, EntityState.Unchanged,MergeStrategy.SkipMerge);
               // empx may NOT be the same as emp because of the possibility that an emp
               // with the same key already exists within the EntityManager.
               return empx;
            });
        });    

## Compare two fields of the same record

In the following example, Breeze compares two properties of the same entity (two fields of the same record).

    // Orders shipped after they were supposed to be delivered
    var query = EntityQuery.from("Orders")
            .where("ShippedDate", ">", "RequiredDate");

When Breeze executes this query, it checks the string on the right hand side of the predicate to determine if it is a property name instead of a string value. By default if a property of the same name exists on the type being queried, Breeze treats that value as a property name rather than a literal string value. In this case, 'ShippedDate' and 'RequiredDate' are both properties of the `Order` type so Breeze treats the predicate as a property-to-property value comparison.

>Note that case matters. Breeze looks for a property name using the prevailing `NamingConvention`.

If you're worried about the potential ambiguity in the right-hand string (e.g., that someone might enter a comparison string that happens to be a property name), you can tell Breeze to treat the value literally by supplying a comparison object for comparison. 

Here's an example from [DocCode:queryTests](https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode/tests/queryTests.js#L251) that illustrates the use of a comparison object to disambiguate the query:

    // Find the employee whose FirstName === 'LastName' (contrived)
    var query = EntityQuery.from("Employees")
            .where("FirstName", "==",
                   // Search value is potentially the name of a property (as in this example)
                   // eliminate chance of breeze treating it as a property name
                   // by explicitly declaring the true nature of the comparison value
                   { value: "LastName", isLiteral: true, dataType: breeze.DataType.String });
