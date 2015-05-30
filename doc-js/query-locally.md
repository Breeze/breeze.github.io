---
layout: doc-js
redirect_from: "/old/documentation/querying-locally.html"
---

# Querying Locally

The Breeze `EntityManager` is both a gateway to server data and a cache of entities. Entities enter the cache as a result of

-	querying the server with an `EntityQuery`
- adding new entities to cache
- importing entities from another `EntityManager` or from file

Your client app can retrieve entities from cache in a variety of ways as discussed in this topic.

> The query examples on this page are in one of the <strong>queryTests</strong> modules of the <a href="/doc-samples/doccode" target="_blank">DocCode</a>. The tests are yours to explore and modify. Please send us your feedback and contributions.

## <a id="synchronous-methods" name="synchronous-methods"></a>Synchronous methods

The `EntityManager` offers several methods for retrieving entities from cache without visiting the server. All of them are synchronous and return their results immediately.

With <a href="/doc-js/api-docs/classes/EntityManager.html#method_executeQueryLocally" target="_blank">`executeQueryLocally`</a>, you can take a previously defined query that would otherwise target the remote server and apply it to the cache


    // Customers whose names begin with 'c'
    var query = breeze.EntityQuery
                      .from('Customers')
                      .where('CompanyName', 'startsWith', 'c');

    var promise = manager.executeQuery(query);          // query remotely (async)
    var customers = manager.executeQueryLocally(query); // query the cache (synchronous)


Notice how you get the customers back immediately.

The <a href="/doc-js/api-docs/classes/EntityQuery.html#method_executeLocally" target="_blank">`EntityQuery.executeLocally`</a> method does the same thing:

    var customers = query.using(manager).executeLocally();

The following methods aren't really queries. They just get entities from the cache directly. They all begin with the *get...* prefix.

- <a href="/doc-js/api-docs/classes/EntityManager.html#method_getChanges" target="_blank">`getChanges([entityTypes])`</a>
- <a href="/doc-js/api-docs/classes/ntityManager.html#method_getEntities" target="_blank">`getEntities([entityTypes],[entityState])`</a>
- <a href="/doc-js/api-docs/classes/EntityManager.html#method_getEntityByKey" target="_blank">`getEntityByKey(entityKey)`</a>

### getChanges

A `getChanges()` call returns all entities in cache with unsaved changes. You might want to iterate over them in your pre-save logic. You might want to save the changed entities to local storage periodically so you can restore the user's work if the application crashes or is closed accidentally.
    
    var changes = manager.getChanges();
    window.localStorage.setItem('backup', changes);
    ...
    restored = window.localStorage.getItem('backup');
    manager.importEntities(restored);

You might be interested in pending changes to particular type(s);


    var changedCustomers = manager.getChanges('Customer');
    var myChangeSet = manager.getChanges(['Customer', 'Order', 'OrderDetail');

### getEntities

Get entities by <a href="/doc-js/api-docs/classes/EntityType.html" target="_blank">`EntityType`</a> and/or <a href="/doc-js/api-docs/classes/EntityState.html" target="_blank">`EntityState`</a>.

Here's how to extract all `Customer` entities in cache:

    var cachedCustomers = getEntities('Customer');

It's often useful for extracting entities of a particular type that are in a particular state. For example, regular Breeze queries exclude entities that are marked for delete. You won't seem them in query results. But you can get them this way:


    someCustomer.entityAspect.setDeleted(); // mark the Customer for deletion
    ...
    var deletedCustomers = manager.getEntities(
                             'Customer', breeze.EntityState.Deleted);   
    var i = -1 &lt; deletedCustomers.indexOf(someCustomer); // true

#### getEntities and inheritance

Breeze supports type inheritance. Queries for a base type can return entities of that type (if it isn't abstract) and all of its derived sub-types. This is called a 'polymorphic query'. A navigation property defined for a base type can return a 'polymorphic' result too.

`Customer.Orders` is an example of polymorphic navigation property in the 'Northwind' model of <a href="/doc-samples/doccode.html">the DocCode sample</a>. It can return instances of `Order` or `InternationalOrder`.

However, `getEntities()`returns entities for the <em>specified type(s) only</em>. If you want to get both `Order` and `InternationalOrder` from cache, you'd have to write this:

    var allOrders = getEntities(['Order', 'InternationalOrder']);

What if you know the base type but not the subtypes? Breeze can tell you with the `EntityType.getSelfAndSubtypes` method which returns an array of the base type and its derived types. Let's put all of these thoughts together.


    var orderType = manager.metadataStore.getType('Order');
    var allOrders = manager.getEntities(orderType.getSelfAndSubtypes());


### getEntityByKey

It's easy to find an entity in cache if you know its key

    var key = new breeze.EntityKey('Employee', 1);
    var nancyDavolio = manager.getEntityByKey(key);
    var andrewFuller = manager.getEntityByKey('Employee', 2);


## <a id="asynchronous-methods" name="asynchronous-methods"></a>Asynchronous cache queries

You may want to query the cache with an asynchronous syntax. External conditions may determine whether a particular query targets the server or the cache. The caller won't know at design time so the developer plays it safe and writes a method to encapsulate the situation:

    // somewhere in a view model
    service.getCustomersStartingWith(searchText)
           .then(success).fail(handleFailure);
    ...

The service makes a decision to go remote or query the cache based on the current connection status:


    service.getCustomersStartingWith function(searchText){
        var query = breeze.EntityQuery.from('Customers')
                    .where('CompanyName', 'startsWith', searchText);
        if (isDisconnected()) {
           // can't reach the server; run locally instead
           var query = query.using(breeze.FetchStrategy.FromLocalCache);
        }
    
        var promise = manager.executeQuery(query);        
        return promise;
    }

The method signature retains its asynchronous form even though the query will run synchronously and return immediately when the application is disconnected. Internally, when the app is disconnected, the developer <a href="/doc-js/api-docs/classes/EntityQuery.html#method_using" target="_blank">changes the query's `QueryOption`</a> to target the cache.

We can even toggle the `EntityManager` itself to run locally when the app loses the connection.

    function OnDisconnected() {
        options = new QueryOptions( { 
            fetchStrategy: FetchStrategy.FromLocalCache} );
        manager.setProperties({queryOptions: options});
    }
    
    ... somewhere far away ...
    
    manager.executeQuery(query); // will it run locally or remotely?


## When local queries fail

Suppose we've written an application to manage a technical conference. `Person` is one of the entity types. 'Speakers' - the people giving talks at the conference - are one subset of the `Person` types tracked in our app. The app server exposes a resource called 'Speakers' that returns the entities of type `Person` who are speaking at the conference. The following remote query works just fine.

    var query = EntityQuery.from('Speakers');
    return manager.executeQuery(query);

Shockingly, we get an error when we try to run this query against the cache

    return manager.executeQueryLocally(query); // CRASH!

The exception says something like:

> Can not find EntityType for either entityTypeName: 'undefined' or resourceName:'Speakers'

Evidently Breeze didn't know how to interpret the query.

### Resources names are not EntityType names

Let's look at the query definition again and think about how Breeze interprets it.

    var query = EntityQuery.from('Speakers');

We began, as we usually do, by naming the **resource** that will supply the data. This resource is typically a segment of a URL pointing to a remote service endpoint, perhaps the name of a Web API controller method ... a method named 'Speakers'.

It's critical to understand that **the query resource name is not the same as the `EntityType` name!** That's easy to see here. The resource name is 'Speakers'; the type name is 'Person'.

Breeze needs a way to correlate the **resource** name with the `EntityType`. Breeze doesn't know the correlation on its own.

A quick, easy solution is to tell Breeze to map 'Speakers' to `Person` by appending the **`toType()`** method to the end of the query:

    var query = EntityQuery.from('Speakers')toType('Person');
    return manager.executeQueryLocally(query); // OK

#### Learn more about resource names

You may wonder why generally don't add `toType()` to our queries. What's different about this case?
How can you teach Breeze to recognize "Speakers" as a resource returning `Person` entities?

Learn the answers to these questions in the <a href="/doc-js/query-from.html">"Query from" topic</a>.

### Fetch an entity by its key

We often want to fetch an entity with a known key. For example, we may be looking at an order and decide that we want to see information about the employee who sold the order.

We could use a regular query:

    var employeeID = someOrder.EmployeeID(); // FK of the salesrep who sold the order
    
    EntityQuery.from('Employee')
               .where('EmployeeID', 'eq', employeeID)
               .using(manager).execute()
               .then(function(data) {
                    // 'employee' is a Knockout observable
                    employee(data.results[0]); // KO binding updates the screen
                });

Breeze offers a <a href="/doc-js/api-docs/classes/EntityManager.html#method_fetchEntityByKey" target="_blank">`fetchEntityByKey`</a> shortcut for this common case.

    
    manager.fetchEntityByKey('Employee', employeeID)
           .then(function(data) {
                employee(data.entity); // KO binding updates the screen
           });


Sometimes we have the key for an entity but don't know if it is in cache. We'll go to the server if we have to but we'd rather not fetch it from the server if we already have it in cache. The optional last parameter, `checkLocalCacheFirst`, makes that easy.

    manager.fetchEntityByKey('Employee', employeeID, true)
           .then(function(data) {
                employee(data.entity); // KO binding updates the screen
           });

We'll go to the server the first time because the order's `Employee` salerep is not in cache. But subsequent queries will spare the round-trip and return the cached salesrep.

### Combine cache and remote queries

With the exception of `fetchEntityByKey`, we can run a query either remotely or locally but not both. What if we need both?

What if we want to present a list of employees on screen ... a list that combines unsaved employee changes with the latest employee data from the server?

We can chain a pair of queries as in this example from <em>queryTests.js</em> in the <a href="/doc-samples/doccode.html" target="_blank">DocCode</a> teaching tests:

    // Assume 'Andrew' and 'Anne' are in the database and the manager is empty
    // Create an 'Alice' employee and add it to cache
    var alice = manager.createEntity('Employee', { FirstName: 'Alice' });
    
    // query for Employees with names that begin with 'A'
    var query = EntityQuery.from('Employees')
                           .where('FirstName', 'startsWith', 'A')
                           .using(em);
    
    // chain remote and local query execution
    var promise = query.execute()
        .then(function () { // ignore remote query results and chain to local query
            return query.using(breeze.FetchStrategy.FromLocalCache).execute();
        });
    
    promise.then(function (data) {
        var firstNames = data.results.map(function (emp) { return emp.FirstName(); });
        console.log(firstNames.join(', ')); // 'Alice, Andrew, Anne',
    })


Observe that we

- started with an empty `EntityManager`
- added a new person, Alice, to the manager's cache.
- Anne is unsaved and not yet in the database
- ran the query remotely, returning Andrew and Anne
- discarded the query results ... but Andrew and Anne remain in cache
- re-ran the query against the cache, picking up all three: Alice, Andrew, and Anne


#### Preserving pending changes during a re-query

In a related DocCode sample we demonstrate how an entity in cache with pending changes can effect the results of a combined remote/local query. Here is the scenario:

- start with an empty `EntityManager`
- fetch Anne from the database.
- change her name to Charlene ... do not save
- query for all persons whose first name begins with 'A'
- that query returns Andrew and Anne
- but the Anne entity's first name remains in the changed 'Charlene' state
- discard the query results
- re-run the 'A' query against the cache
- the query returns only Andrew, not the entity formerly-known-as-Anne

Focus on what happens to the 'Anne' entity. The default <a href="/doc-js/api-docs/classes/MergeStrategy.html" target="_blank">`MergeStrategy.PreserveChanges`</a> prevents the remote query from overwriting the current name value of 'Charlene' with the database value which is still 'Anne'. Then the local query excludes the Anne entity from its results because her local current name is 'Charlene'.

This behavior is exactly what we want most of the time. The user who is changing 'Alice' to 'Charlene' would be surprised, annoyed, or both if the re-query wiped out her changes. She'd be equally surprised if the list of 'A' employees displayed a person named 'Charlene'.

We should be able to query the database repeatedly without having its data overwrite our pending changes. We want the latest information from the database but not at the expense of our unsaved work.

If we really do want the database values to trump unsaved changes ... if we want the query to change 'Charlene' back to 'Alice' ..., we can specify the <a href="/doc-js/api-docs/classes/MergeStrategy.html" target="_blank">`MergeStrategy.OverwriteChanges`</a>.
