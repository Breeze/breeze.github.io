---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/query-examples.html"
---

# Query examples

> Every query example on this page is *( or will be)*  in one of the QueryTests modules of the DocCode sample. The tests are yours to explore and modify. Please send us your feedback and contributions.

### Setup

[Basic queries](#queryBasic)

[Filtering with "Where"](#where)

- [Simple conditions](#whereSimple)
- [Compound conditions with predicates](#whereCompound)
- [Conditions on related properties](#whereRelated)
- [Conditions involving any/all with related properties](#whereAnyall)
- [Conditions using OData functions](#whereOdata)

[Sorting with "OrderBy"](#orderby)

- [Single property sorting](#orderbySingle)
- [Multiple property sorting](#orderbyMulti)
- [Related property sorting](#orderbyRelatedprop)

[Paging with "Skip" and "Take"](#paging)

[Projection with "Select"](#select)

- [Single data property projections](#selectDp)
- [Single navigation property projections](#selectNp)
- [Multiple property projections](#selectMulti)
- [Related property projections](#selectRelated)

[Eager loading with "Expand"](#expand)

- [Single relation expand](#expandSingle)
- [Query by key with expand](#expandKey)
- [Multiple relation expand](#expandMulti)
- [Property path expand](#expandProppath)

[Query by key](#queryKey)

[Query a bag of entities](#queryBag)

### Setup

    // Assuming the following 'Using' clause
    using Breeze.Sharp;
 
    // create a manager to execute queries
    var manager = new EntityManager(serviceName);

<a name="queryBasic" ></a>

### Basic queries

    // 3 equivalent queries for "all Customers"
    var query1a = new EntityQuery<Customer>();  
 
    var query1b = new EntityQuery<Customer>("Customers");  
 
    var query1c = EntityQuery.From<Customer>();
 
    // execute one of them
    var results = await manager.ExecuteQuery(query1a); 

<a name="where" />
### Filtering with "where"
<a name="whereSimple" />
#### Simple conditions

    // query for Customers whose names start with "A";
    // using the 'startsWith' operator
    var query1 = EntityQuery.From<Customer>()
        .Where(cust => cust.CompanyName.StartsWith("A");
       
    // Orders with freight costs >  $100
    var query2 = new EntityQuery<Order>()
        .Where(order => order.Freight > 100);
        
    // Orders ordered after February 1, 1998
    var query3 = new EntityQuery<Order>
        .Where(order => order.OrderDate > new DateTime(1998, 1, 1));
     
    // Orders with no (null) OrderDate
    var query4 = new EntityQuery<Order>()
        .Where(order => order.OrderDate == null);
     
    // Customers whose name contains the word, "market"
    var query = new EntityQuery<Customer>()
     .Where(cust => cust.CompanyName.Contains('market'));

<a name="whereCompound"/>
#### Compound conditions with predicates

    // Start with a base query for all Orders
    var baseQuery = new EntityQuery<Order>();
    
    // A Predicate is a condition that is true or false
    // Combine two predicates with '.And' to
    // query for orders with freight cost over $100
    // that were ordered after April 1, 1998
    var p1 = PredicateBuilder.Create<Order>(o => o.Freight > 100);
    var p2 = PredicateBuilder.Create<Order>(o => o.OrderDate > new DateTime(1998, 3, 1));
    var pred = p1.And(p2);
    var query1 = baseQuery.Where(pred);
    var orders = await entityManager.ExecuteQuery(query);
        
    // Yet another way to ask the same question
    pred = PredicateBuilder.Create<Order>(o => o.Freight > 100)
      .And(PredicateBuilder.Create<Order>(o => o.OrderDate > new DateTime(1998, 3, 1)));
    var query2 = baseQuery.Where(pred);
     
    // Use the "or" operator to query for Orders
    // EITHER with Freight over $100
    // OR that were ordered after April 1, 1998
    pred = PredicateBuilder.Create<Order>(o => o.Freight > 100)
      .Or(PredicateBuilder.Create<Order>(o => o.OrderDate > new DateTime(1998, 3, 1)));
    var query3 = baseQuery.Where(pred);

    // Negate a predicate for Orders with Freight over $100
    // using the Not operator
    var p1 = PredicateBuilder.Create<Order>(o => o.Freight > 100);
    var pred = p1.Not();
    var query4 = baseQuery.Where(pred);
     
    // Negate it again, using 'Predicate.not'
    var pred = pred.Not(); // back to the original predicate.
     
    // apply the predicate
    var query5 = baseQuery.where(pred);

<a name="whereRelated" />
#### Conditions on related properties
  
    // Products in a Category whose name starts with "S"
    var query1 = EntityQuery.From<Product>()
        .Where(product => product.Category.CategoryName.StartsWith("S"));
    
    // Orders sold to a Customer located in California
    var query2 = new EntityQuery<Order>()
        .Where(order => order.Customer.Region == "CA");   

<a name="whereAnyall" />
#### Conditions involving any/all with related properties

The following query attempts to find any "Employees" who have placed any orders with a 'freightCost' of more than $950.

    var query1 = new EntityQuery<Employee>()
        .Where(emp => emp.Orders.Any(order => order.Freight > 10));

More complicated predicates can also be used. For example to filter for all customers that do not have any orders.

    var pred = PredicateBuilder.Create<Customer>(
        emp => emp.Orders.Any(order => order.ShipName != null));
    var query1 = new EntityQuery<Customer>().Where(pred);

or to query for all Employees that have at least one order with a customer whose name starts with 'Lazy"

    var query2 = new EntityQuery<Employee>()
        .Where(emp => emp.Orders.Any(
            order => order.Customer.CompanyName.StartsWith("Lazy")))
        .Expand("Orders.Customer");

Composite predicates can be used as well.

     var query1 = new EntityQuery<Customer>()
        .Where(c => c.CompanyName.StartsWith("C") 
            && c.Orders.Any(o => o.Freight > 10));

and Predicates can even be nested. In this case we are querying for any orders where every orderDetail has a unit price of more than $200.00.

    var query1 = new EntityQuery<Customer>()
        .Where(c => c.Orders.Any(o => o.OrderDetails.All(od => od.UnitPrice > 200)));

<a name="whereOdata" />
#### Conditions using OData functions 

Several common .NET operations have OData representations. See OData method filter discussion here: <http://msdn.microsoft.com/en-us/library/hh169248(v=nav.71).aspx>

 Some of these are shown below:

    // Employees hired in 1993
    var query1 = new EntityQuery<Employee>()
        .Where(e => e.HireDate.Value.Year > 1993); 

    // Customers whose Company names starts with "C" or "c";
    var query2 = new EntityQuery<Customer>()
        .Where(c => c.CompanyName.ToLower().StartsWith("c"));
     
    // Customers whose 2nd and 3rd letters are 'om'
    var query3 = EntityQuery.From<Customer>()
        .Where(c => c.CompanyName.Substring(1,2).ToUpper() == "OM");

    // Nonsense query showing "+" operator
    var query4 = new EntityQuery<Employee>()
        .Where(e => e.EmployeeID + e.ReportsToEmployeeID.Value > 3);

<a name="orderby" />
### Sorting with 'orderBy'

<a name="orderbySingle" />
#### Single property sort

    // Products in ascending name order
    var query1 = EntityQuery.From<Product>()
        .OrderBy(p => p.ProductName);
     
    var query2 = EntityQuery.From<Product>()
        .OrderByDescending(p => p.ProductName);
    
    

<a name="orderbyMultiple" />
#### Multiple property sort
     
    // Customers sorted by country and then by company name
    var q0 = new EntityQuery<Customer>()
        .OrderBy(c => c.Country).ThenBy(c => c.CompanyName);

<a name="orderbyRelated" />
#### Related property sorting

    // Products sorted by their Category names (in descending order)
    var query1 = EntityQuery.From<Product>()
        .OrderByDescending(p => p.Category.CategoryName);  
    
    // Products sorted by their Category names, then by Product name (in descending order)
    var query2 = EntityQuery.From<Product>()
        .OrderBy(p => p.Category.CategoryName)
        .ThenByDescending(p => p.ProductName);

<a name="paging" />
#### Paging with 'skip' and 'take'

    // Get the first 5 Products
    var query1 = new EntityQuery<Product>().Take(5);
     
    // Get the first 5 Products beginning with "C"
    // and also get the total of all products beginning with "C"
    var query2 = new EntityQuery<Product>()
        .Where(p => p.ProductName.StartsWith("C")      
        .Take(5)
        .InlineCount();
     
    var results = await manager.ExecuteQuery(query2);
    var inlineCount = ((IHasInlineCount) results).InlineCount;
     
    // Skip the first 10 Products and return the rest
    var query3 = new EntityQuery<Product>()
        .OrderBy(p => p.ProductName)
        .Skip(10);
     
    // Get the 3rd page of 5 Products
    // by skipping 10 Products and taking the next 5
    var query4 = new EntityQuery<Product>()
        .OrderBy(p => p.ProductName)
        .Skip(10)
        .Take(5);
     
    // Take the first 10 Products after
    // sorting them by their Category names in descending order
    var query5 = EntityQuery.From<Product>()
        .OrderByDescending(p => p.Category.CategoryName);
        .Take(10);

<a name="select" />
### Projection with 'select'

> Note: All Breeze.Sharp projections must be into a anonymous type. See the examples below:

<a name="selectDp" />
#### Single data property projections

    // just the names of the Customers that begin with "C"
    var query = new EntityQuery<Customer>()
         .Where(c => c.CompanyName.StartsWith("C")
         .Select(c => new { c.CompanyName });

> Note the "new" in the select clause above; without it the query WILL fail.

<a name="selectNp" />
#### Single navigation property projections

    // Orders of the Customers that begin with "C"
    var query = new EntityQuery<Customer>()
         .Where(c => c.CompanyName.StartsWith("C")
         .Select(c => new { c.Orders });

<a name="selectMultiple" />
#### Multiple property projections
    
    // Selected properties of customers with names starting with "C"
    var query = new EntityQuery<Customer>()
         .Where(c => c.CompanyName.StartsWith("C")
         .Select(c => new { c.CompanyName, c.Orders });

<a name="selectRelated" />
#### Related property projections 

> These are not yet supported due to a bug in MS OData client

    // Names of customers with orders that have excessive freight costs
    var query = new EntityQuery<Order>()
        .Where(o => o.Freight > 500)
        .Select(o => new { o.Customer.CompanyName })
        .OrderBy(o => Customer.CompanyName);

<a name="expand" />
#### Eager loading with 'expand'

<a name="expandSingle" />
#### Single relation expand

    // include the Category in the payload for
    // Products whose Category names start with "S"
    var query = new EntityQuery<Product>()
        .Where(p => p.Category.CategoryName.StartsWith("S")
        .Expand(p => p.Category);

<a name="expandKey" />
#### Query by key with expand

    // Query for Customer with ID 42
    // Like manager.FetchEntityByKey(typeof(Customer), 42)
    // (as shown below) except expanded to include related Orders.
    var query = new EntityQuery<Customer>()
        .Where(c => c.CustomerID == 42)
        .Expand(c => c.Orders);

<a name="expandMulti" />
#### Multiple relation expand
    
    // include both the parent Customers and child OrderDetails
    // in the payload of a query for the first 20 Orders
    var query = new EntityQuery<Order>()
        .Take(20)
        .Expand("Customer, OrderDetails");

<a name="expandProppath" />
#### Property path expand

    // include the OrderDetails and their parent Products
    // in the payload of a query for the first 20 Orders
    // using a property path
    var query = new EntityQuery<Order>()
           .Take(20)
           .Expand("OrderDetails.Product");

<a name="queryKey" />
#### Query by key
Call FetchEntityByKey directly on the EntityManager. Note the 'fetch' prefix.

    // Fetch the customer with CustomerID == 42 from the database
    // returns a promise.
    var entityKey = new EntityKey(typeof(Customer), 42);
    var fetchResult = await manager.FetchEntityByKey(entityKey);
    var customer = fetchResult.Entity;

See example above to expand with related entities.

Add checkLocalCacheFirst=true parameter to look in the cache first and query the database if not found.

    // Look for the customer in manager&#39;s cache first
    // Fetch from the database if not found in cache
    var fetchResult = await manager.fetchEntityByKey(entityKey, true);
    var customer = fetchResult.Entity;
    var wasFoundInCache = fetchResult.InCache;

You can call *GetEntityByKey* directly on the EntityManager to extract the entity from cache. Note the 'get' prefix.This isn't really a query because it can only look in cache and never calls the remote service. It returns immediately with the entity or null.

    // Look for entity only in cache.
    // Returns value (or null) immediately
    var customer = manager.getEntityByKey(entityKey);

<a name="queryBag" />
#### Query a bag of entities
A 'query' can return an object filled with arbitrary collections of entities. Particularly useful when you want to prime your cache with lookup lists. Start on the server with a service query method that returns an object whose properties contain lists of entities. Here's a Web API controller method example:

    [HttpGet]
    public object Lookups()
    {
        var regions = _contextProvider.Context.Regions;
        var territories = _contextProvider.Context.Territories;
        var categories = _contextProvider.Context.Categories;
     
        var lookups = new {regions, territories, categories};
        return lookups;
    }

On the Breeze client:

    // Fetch the lookups; returns an anon type with three properties
    // 'regions', 'territories' and 'categories'.  
    // see the DocCode queryTests module for details
    var query = EntityQuery.From("Lookups", new {
        regions = Enumerable.Empty<Region>(),
        territories = Enumerable.Empty<Territory>(),
        categories = Enumerable.Empty<Category>(),
      });

The Region, Territory, and Category entities are in cache after the query succeeds. 

The 2nd argument to the From method above is an 'anonymous example type' that is used to 'define' the shape of the data to be returned by the "Lookups" query.  
See 'Lookup Lists' for a richer discussion of this example.