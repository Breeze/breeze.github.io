---
layout: doc-js
title: Query examples
---
# Query examples

<p class="note">Every query example on this page is in one of the <a href="https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode/tests/queryTests.js" target="_blank" title="queryTests.js on github"><strong>queryTests</strong> modules</a> of the <a href="/samples/doccode">DocCode</a>. The tests are yours to explore and modify. Please send us your feedback and contributions.</p>

<div class="index">
<p><a href="#Setup">Setup</a></p>

<p><a href="#BasicQueries">Basic queries</a></p>

<p><a href="#Where">Filtering with &quot;where&quot;</a></p>

<p style="margin-left: 40px;"><a href="#SimpleName">Simple conditions</a><br />
<a href="#CompositeWhere">Compound conditions with predicates</a><br />
<a href="#WhereRelated">Conditions on related properties</a><br />
<a href="#WhereAnyAll">Conditions involving any/all with related properties</a><br />
<a href="#WhereODataFunctions">Conditions using OData functions</a></p>

<p><a href="#OrderBy">Sorting with &quot;orderBy&quot;</a></p>

<p style="margin-left: 40px;"><a href="#SinglePropertyOrdering">Single property sorting</a><br />
<a href="#MultiplePropertyOrdering">Multiple property sorting</a><br />
<a href="#RelatedPropertyOrdering">Related property sorting</a></p>

<p><a href="#Paging">Paging with &quot;skip&quot; and &quot;take&quot;</a></p>

<p><a href="#Projection">Projection with &quot;select&quot;</a></p>

<p style="margin-left: 40px;"><a href="#SinglePropertyProjection">Single data property projections</a><br />
<a href="#SingleNavigationProjection">Single navigation property projections</a><br />
<a href="#MultiplePropertyProjection">Multiple property projections</a><br />
<a href="#RelatedPropertyProjection">Related property projections</a></p>

<p><a href="#EagerLoading">Eager loading with &quot;expand&quot;</a></p>

<p style="margin-left: 40px;"><a href="#SingleExpand">Single relation expand</a><br />
<a href="#QueryByKeyWithExpand">Query by key with expand</a><br />
<a href="#MultipleRelationExpand">Multiple relation expand</a><br />
<a href="#PropertyPathExpand">Property path expand</a></p>

<p><a href="#QueryByKey">Query by key</a></p>

<p a="" href="#Lookups"><a href="#Lookups">Query a bag of entities</a></p>
</div>

## <a name="Setup"></a>Setup

    // Set convenience variables with 
    // commonly used Breeze query classes 
    var EntityQuery = breeze.EntityQuery;
    var FilterQueryOp = breeze.FilterQueryOp;
    var Predicate = breeze.Predicate;

    // create a manager to execute queries
    var manager = new breeze.EntityManager(serviceName);

## <a name="BasicQueries"></a>Basic queries</h2>

    // 3 equivalent queries for "all Customers"
    var query1a = EntityQuery.from('Customers');   

    var query1b = new EntityQuery('Customers');   

    var query1c = new EntityQuery().from('Customers');

    // execute one of them
    manager.executeQuery(query1a) // returns a promise
         .then(querySucceeded)  // process results
         .fail(queryFailed);    // handle error

## <a name="Where"></a>Filtering with "where"

### <a name="SimpleName"></a>Simple conditions

    // query for Customers whose names start with "A";
    // using the 'startsWith' operator
    var query1 = EntityQuery.from('Customers')
        .where('CompanyName', 'startsWith', 'A');

    // this time, use the FilterQueryOp enum
    var query = EntityQuery.from('Customers')
        .where('CompanyName', FilterQueryOp.StartsWith, 'A');

    // Orders with freight costs >  $100
    var query = EntityQuery.from('Orders')
        .where('Freight', '>', 100);

    // this time, use the FilterQueryOp enum
    var query = EntityQuery.from('Orders')
        .where('Freight', FilterQueryOp.GreaterThan, 100);

    // Orders ordered after February 1, 1998
    // (n.b.: month numbers start at zero in JavaScript)
    var query = EntityQuery.from('Orders')
        .where('OrderDate', '>', new Date(1998, 1, 1)) 

    // Orders with no (null) OrderDate
    var query = EntityQuery.from('Orders')
        .where('OrderDate', '==', null); 

    // Orders shipped after they were supposed to be delivered
    // Compares two fields of the same record
    var query = EntityQuery.from("Orders")
            .where("ShippedDate", ">", "RequiredDate");

    // Customers whose name contains the word, "market";
    var query = EntityQuery.from('Customers')
         .where('CompanyName', FilterQueryOp.Contains, 'market'); 

### <a name="CompositeWhere"></a>Compound conditions with predicates

    // Start with a base query for all Orders
    var baseQuery = EntityQuery.from('Orders');

    // A Predicate is a condition that is true or false
    // Combine two predicates with '.and' to
    // query for orders with freight cost over $100
    // that were ordered after April 1, 1998
    var p1 = new Predicate('Freight', '>;', 100);
    var p2 = new Predicate('OrderDate', '>', new Date(1998, 3, 1));
    var query1a = baseQuery.where(p1.and(p2));

    // "AND" them together using an array
    var p1 = Predicate.create('Freight', '>', 100)
    var p2 = Predicate.create('OrderDate', '>', new Date(1998, 3, 1));
    var pred = Predicate.and([p1, p2]);
    var query1b = baseQuery.where(pred);

    // Yet another way to ask the same question
    var pred = Predicate
           .create('Freight', '>;', 100)
           .and('OrderDate', '>;', new Date(1998, 3, 1));
    var query1c = baseQuery.where(pred);

    // Use the "or" operator to query for Orders
    // EITHER with Freight over $100
    // OR that were ordered after April 1, 1998
    var pred = Predicate
           .create('Freight', '>;', 100)
           .or('OrderDate', '>;', new Date(1998, 3, 1));
    var query2 = baseQuery.where(pred);

    // Compose multiple predicates **left-to-right** 
    // Here we OR a date range then AND the Freight-over-100 constraint
    var pred = Predicate
          .create('OrderDate', '>=', new Date(Date.UTC(1996, 0, 1))) // Jan===0 in JavaScript
          .or(    'OrderDate', '<',  new Date(Date.UTC(1997, 0, 1)))
          .and(   'Freight',   '>',  100);
    var query2b = baseQuery.where(pred);

    /*
     The `create` call predicate creates the date-gte predicate
          
     The `or` call returns a predicate which is the OR of the 1st predicate and 
     the 2nd date condition. This is the OR predicate
          
     The third `and` call returns the AND of the OR-predicate and the freight condition.

     also using new Date(Date.UTC(...)) to create unambiguous UTC date value with no time component.
    */

    // Negate a predicate for Orders with Freight over $100
    // using the 'not' operator
    var basePred = Predicate.create('Freight', '>;', 100);
    var pred = basePred.not();

    // Negate it again, using 'Predicate.not' 
    var pred = Predicate.not(basePred)

    // apply the predicate
    var query3 = baseQuery.where(pred);

You can display the OData query clause that such predicates will emit with the following "trick":

    // Get an EntityType. Any EntityType will usually do but we'll use the Order type
    var orderType = manager.metadataStore.getEntityType('Order')); 
    console.log("OData predicate: " + pred.toODataFragment(orderType ));

The composed predicate shown above ...

    var pred = Predicate
          .create('OrderDate', '>=', new Date(Date.UTC(1996, 0, 1))) // Jan===0 in JavaScript
          .or(    'OrderDate', '<',  new Date(Date.UTC(1997, 0, 1)))
          .and(   'Freight',   '>',  100);

prints as follows:

>OData predicate: ((OrderDate ge datetime'1996-01-01T00:00:00.000Z') or (OrderDate lt datetime'1997-01-01T00:00:00.000Z')) and (Freight gt 100)

### <a name="WhereRelated"></a>Conditions on related properties

    // Products in a Category whose name starts with "S"
    var query1 = EntityQuery.from('Products')
        .where('Category.CategoryName', 'startswith', 'S')

    // Orders sold to a Customer located in California
    var query2 = EntityQuery.from('Orders')
        .where('Customer.Region', '==', 'CA');
    
### <a name="WhereAnyAll"></a>Conditions involving any/all with related properties

Breeze supports two filter operators that support the ability to perform 'Any' and 'All' queries. 

The two operators are: 
 
  + **FilterQueryOp.Any** - aliases: "any", "some" 
  + **FilterQueryOp.All** - aliases: "all", "every"  

#### Examples:

The following query attempts to find any "Employees" who have placed any orders with a 'freightCost' of more than $950. 

    var query = EntityQuery.from("Employees")
        .where("orders", "any", "freightCost",  ">", 950);   

The same query can be composed using a FilterQueryOps directly:

    var query = EntityQuery.from("Employees")
        .where("orders", FilterQueryOp.Any, "freightCost",  FilterQueryOp.GreaterThan, 950);   

or by using the 'some' alias.

    var query = EntityQuery.from("Employees")
        .where("orders", "some", "freightCost",  ">", 950);

It can also be built up in pieces.

    var predicate = Predicate.create("freightCost", ">", 950);
    var query = EntityQuery.from("Employees")
        .where("orders", FilterQueryOp.Any, predicate);

More complicated predicates can also be used.  For example to filter for all customers that do **not** have any orders. 
 
    var p = Predicate.create("orders", "any", "id", "!=", null).not();
    var query = EntityQuery.from("Customers").where(p);


or to query for all Employees that have at least one order with a customer whose name starts with 'Lazy"

    var query = EntityQuery.from("Employees")
           .where("orders", "any", "customer.companyName", "startsWith", "Lazy")
           .expand("orders.customer");

or to query through a "mapping entity" (e.g., `OrderDetail`) when traversing a many-to-many relationship

    // Orders - OrderDetail - Products
    // Note the 'Product.ProductName' navigation in the "where" clause
    var query = EntityQuery.from('Orders')
           .where('OrderDetails', 'any',  'Product.ProductName', 'eq', 'Chai')
           .expand('OrderDetails.Product')

Composite predicates can be used as well. 

    var p = Predicate.create("freight", ">", 950).and("shipCountry", "startsWith", "G");
    var query = EntityQuery.from("Employees")
       .where("orders", "any", p)
       .expand("orders");

and Predicates can even be nested. In this case we are querying for any orders where every orderDetail has a unit price of more than $200.00.  

    var q1 = EntityQuery.from("Customers")
      .where("orders", "any", "orderDetails", "all", "unitPrice", ">", 200);

### <a name="WhereODataFunctions"></a>Conditions using OData functions


    // Customers whose Company names starts with "C" or "c";
    var query1 = EntityQuery.from('Customers')
        .where('toLower(CompanyName)', 'startsWith', 'c');

    // Customers whose 2nd and 3rd letters are 'om'
    var query2 = EntityQuery.from('Customers')
        .where('toUpper(substring(CompanyName, 1, 2))', '==', 'OM');

## <a name="OrderBy"></a>Sorting with 'orderBy'

### <a name="SinglePropertyOrdering"></a>Single property sort

    // Products in ascending name order
    var query1 = EntityQuery.from('Products')
        .orderBy('ProductName');

    // Products in descending name order
    var query2a = EntityQuery.from('Products')
        .orderBy('ProductName desc');

    // Products in descending name order (version 2)
    var query2a = EntityQuery.from('Products')
        .orderByDesc('ProductName');

### <a name="MultiplePropertyOrdering"></a>Multiple property sort

    // Products sorted from highest to lowest price, then by name
    var query1 = EntityQuery.from('Products')
        .orderBy('UnitPrice desc,ProductName');

### <a name="RelatedPropertyOrdering"></a>Related property sorting

    // Products sorted by their Category names (in descending order)
    var query1 = EntityQuery.from('Products')
        .orderBy('Category.CategoryName desc');

    // Products sorted by their Category names, then by Product name (in descending order)
    var query2 = EntityQuery.from('Products')
        .orderBy('Category.CategoryName, ProductName desc');

## <a name="Paging"></a>Paging with 'skip' and 'take'

    // Get the first 5 Products
    var query1 = EntityQuery.from('Products')
        .take(5);

    // Get the first 5 Products beginning with &#39;C&#39;
    // and also get the total of all products beginning with &#39;C&#39;
    var query2 = EntityQuery.from('Products')
        .where('ProductName', 'startsWith', 'C')
        .take(5)
        .inlineCount();

    manager.executeQuery(query2)
        .then(function(data) {
            var pages = Math.ceil(data.inlineCount / 5);
            // do something with data.results
        });

    // Skip the first 10 Products and return the rest
    // Note that the  '.orderBy' clause is necessary to use '.skip'
    // This is required by many server-side data service implementations
    var query3 = EntityQuery.from('Products')
        .orderBy('ProductName')
        .skip(10);

    // Get the 3rd page of 5 Products
    // by skipping 10 Products and taking the next 5
    var query4 = EntityQuery.from('Products')
        .orderBy('ProductName')
        .skip(10)
        .take(5);

    // Take the first 10 Products after
    // sorting them by their Category names in descending order
    var query5 = EntityQuery.from('Products')
        .orderBy('Category.CategoryName desc');
        .take(10);

## <a name="Projection"></a>Projection with 'select'

### <a name="SinglePropertyProjection"></a>Single data property projections

    // just the names of the Customers that begin with &#39;C&#39;
    var query = EntityQuery.from('Customers')
         .where('CompanyName', 'startsWith', 'C')
         .select('CompanyName');

### <a name="SingleNavigationProjection"></a>Single navigation property projections

    // Orders of the Customers that begin with &#39;C&#39;
    var query = EntityQuery.from('Customers')
         .where('CompanyName', 'startsWith', 'C')
         .select('Orders');

### <a name="MultiplePropertyProjection"></a>Multiple property projections

    // Selected properties of customers with names starting with "C"
    var query = EntityQuery.from('Customers')
        .where('CompanyName', FilterQueryOp.StartsWith, 'C')
        .select('CustomerID_OLD, CompanyName, ContactName')
        .orderBy('CompanyName');

### <a name="RelatedPropertyProjection"></a>Related property projections

    // Names of customers with orders that have excessive freight costs
    var query = EntityQuery.from('Orders')
        .where('Freight', FilterQueryOp.GreaterThan, 500)
        .select('Customer.CompanyName')
        .orderBy('Customer.CompanyName');

## <a name="EagerLoading"></a>Eager loading with 'expand'

### <a name="SingleExpand"></a>Single relation expand

    // include the Category in the payload for
    // Products whose Category names start with &#39;S&#39;
    var query = EntityQuery.from('Products')
        .where('Category.CategoryName', 'startswith', 'S')
        .expand('Category');

### <a name="QueryByKeyWithExpand"></a>Query by key with expand

    // Query for Customer with ID 42
    // Like manager.fetchEntityByKey('Customer', 42)
    // (as shown below) except expanded to include related Orders.
    var query = EntityQuery.from('Customers')
        .where('CustomerID', 'eq', 42)
        .expand('Orders');

### <a name="MultipleRelationExpand"></a>Multiple relation expand

    // include both the parent Customers and child OrderDetails
    // in the payload of a query for the first 20 Orders
    var query = EntityQuery.from('Orders')
        .take(20)
        .expand('Customer, OrderDetails');

### <a name="PropertyPathExpand"></a>Property path expand

    // include the OrderDetails and their parent Products
    // in the payload of a query for the first 20 Orders
    // using a property path
    var query = new EntityQuery('Orders')
           .take(20)
           .expand('OrderDetails.Product');

## <a name="QueryByKey"></a>Query by key

<p>Call <em><strong>fetch</strong>EntityByKey </em>directly on the <em>EntityManager</em>. Note the '<strong><em>fetch</em></strong>' prefix.</p>

    // Fetch the customer with CustomerID == 42 from the database
    // returns a promise. 
    manager.fetchEntityByKey('Customer', 42)
       .then(fetchSucceeded).fail(fetchFailed);

<p><a href="#QueryByKeyWithExpand">See example above</a> to expand with related entities.</p>

<p>Add <em><code>checkLocalCacheFirst=true</code></em> parameter to look in the cache first and query the database if not found.</p>

    // Look for the customer in manager&#39;s cache first
    // Fetch from the database if not found in cache
    manager.fetchEntityByKey('Customer', 42, true) 
       .then(fetchSucceeded).fail(fetchFailed);

<p>Call <em><strong>get</strong>EntityByKey </em>directly on the <em>EntityManager</em> to extract the entity from cache. Note the '<em><strong>get</strong></em>' prefix.This isn&#39;t really a query because it can only look in cache and never calls the remote service. It returns immediately with the entity or <em>null</em>.</p>

    // Look for entity only in cache. 
    // Returns value (or null) immediately
    var customer = manager.getEntityByKey('Customer', 42);

<h2><a name="Lookups"></a>Query a bag of entities</h2>

<p>A 'query' can return an object filled with arbitrary collections of entities. Particularly useful when you want to prime your cache with lookup lists. Start on the server with a service query method that returns an object whose properties contain lists of entities. Here&#39;s a Web API controller method example:</p>

<pre class="brush:csharp;">
[HttpGet]
public object Lookups()
{
    var regions = _contextProvider.Context.Regions;
    var territories = _contextProvider.Context.Territories;
    var categories = _contextProvider.Context.Categories;

    var lookups = new {regions, territories, categories};
    return lookups;
}
</pre>

<p>On the JavaScript client:</p>

<pre class="brush:jscript;">
// Fetch the lookups; ignores the results; entities are in cache
// see the DocCode queryTests module for details
EntityQuery.from(&#39;Lookups&#39;)
     .using(em).execute()
     .fail(handleFail);</pre>

<p>The <em>Region</em>, <em>Territory</em>, and <em>Category </em>entities are in cache after the query succeeds. See '<a href="/documentation/lookup-lists" target="_blank">Lookup Lists</a>' for a richer discussion of this example.</p>
