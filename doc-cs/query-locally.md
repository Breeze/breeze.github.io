---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/querying-locally.html"
---

# Querying Locally

The Breeze *EntityManager* is both a gateway to server data and a cache of entities. Entities enter the cache as a result of

- querying the server with an *EntityQuery*
- adding new entities to cache
- importing entities from another *EntityManager* or from file
 
Your client app can retrieve entities from cache in a variety of ways as discussed in this topic.

> The query examples on this page are in one of the QueryTests modules of the DocCode. The tests are yours to explore and modify. Please send us your feedback and contributions.

### Synchronous methods

The *EntityManager* offers several methods for retrieving entities from cache without visiting the server. All of them are synchronous and return their results immediately.

With *ExecuteQueryLocally*, you can take a previously defined query that would otherwise target the remote server and apply it to the cache

    // Customers whose names begin with 'c'
    var query = EntityQuery<Customer>()
        .Where(c => c.CompanyName.StartsWith("C");

    var customers1 = await manager.ExecuteQuery(query);   // query remotely (async)
    var customers2 = manager.ExecuteQueryLocally(query);  // query the cache (synchronous)

Notice how you get the customers back immediately.

The *EntityQuery.ExecuteLocally* method does the same thing:

    var customers = query.ExecuteLocally(manager);

The following methods aren't really queries. They just get entities from the cache directly. They all begin with the get... prefix.

- GetChanges([entityTypes])
- GetEntities([entityTypes],[entityState])
- GetEntityByKey(entityKey)
 
#### GetChanges

A *GetChanges()* call returns all entities in cache with unsaved changes. You might want to iterate over them in your pre-save logic. You might want to save the changed entities to local storage periodically so you can restore the user's work if the application crashes or is closed accidentally.

    var changes = manager.GetChanges();
    var exportedEntities = manager.ExportEntities(changes);
    // store them somewhere 
    ...
    
    manager.ImportEntities(exportedEntities);

You might be interested in pending changes to particular type(s);

    var changedCustomers = manager.GetChanges(typeof(Customer));
    var myChangeSet = manager.GetChanges(typeof(Customer), typeof(Order), typeof(OrderDetail));

#### GetEntities

Get entities by *EntityType* and/or *EntityState*.

Here's how to extract all Customer entities in cache:

    var cachedCustomers = manager.GetEntities(typeof(Customer));

It's often useful for extracting entities of a particular type that are in a particular state. For example, regular Breeze queries exclude entities that are marked for delete. You won't seem them in query results. But you can get them this way:

    someCustomer.EntityAspect.Delete(); // mark the Customer for deletion
    ...
    var deletedCustomers = manager.GetEntities(
        typeof(Customer), EntityState.Deleted);

    var i = -1 < deletedCustomers.IndexOf(someCustomer); // true

#### GetEntities and inheritance

Breeze supports type inheritance. Queries for a base type can return entities of that type (if it isn't abstract) and all of its derived sub-types. This is called a "polymorphic query". A navigation property defined for a base type can return a "polymorphic" result too.

`Customer.Orders` is an example of polymorphic navigation property in the "Northwind" model of the DocCode sample. It can return instances of or .

However, returns entities for the specified type(s) only. If you want to get both and from cache, you'd have to write this:

    var allOrders = GetEntities(typeof(Order), typeof(InternationalOrder));

What if you know the base type but not the subtypes? Breeze can tell you with the method which returns an array of the base type and its derived types. Let's put all of these thoughts together.

    var orderEntityType = MetadataStore.Instance.GetEntityType(typeof (Order));
    var selfAndSubtypes = orderEntityType.SelfAndSubEntityTypes.Select(et => et.ClrType);
    var allOrders2 = em.GetEntities(selfAndSubtypes);
        
#### GetEntityByKey

It's easy to find an entity in cache if you know its key

    var key = new EntityKey(typeof(Employee), 1);
    var nancyDavolio = manager.GetEntityByKey(key);
    
    // or alternatively
    var andrewFuller = manager.GetEntityByKey<Employee>(2);

#### Asynchronous cache queries

You may want to query the cache with an asynchronous syntax. External conditions may determine whether a particular query targets the server or the cache. The caller won't know at design time so the developer plays it safe and writes a method to encapsulate the situation:

    // somewhere in a view model
    var customers = await service.GetCustomersStartingWith(searchText);
       

The service makes a decision to go remote or query the cache based on the current connection status:

    public async Task<IEnumerable<Customer>> GetCustomersStartingWith(String searchText) {
        var query = new EntityQuery<Customer>()
                .Where(c => c.CompanyName.StartsWith(searchText));
        if (IsDisconnected()) {
            // can't reach the server; run locally instead
            query = query.With(FetchStrategy.FromLocalCache);
        } 
        return await manager.ExecuteQuery(query);              
    }

The method signature retains its asynchronous form even though the query will run synchronously and return immediately when the application is disconnected. Internally, when the app is disconnected, the developer changes the query's FetchStrategy to target the cache.

We can even toggle the EntityManager itself to run locally when the app loses the connection.

    public void OnDisconnected() {
        manager.DefaultQueryOptions = manager.DefaultQueryOptions.With(FetchStrategy.FromLocalCache);
    }

... somewhere far away ...

    var results = await manager.ExecuteQuery(query); // will it run locally or remotely?


#### EntityType/ResourceName map

The EntityType/ResourceName map is one of the items in the Breeze MetadataStore. Most of the time you don't have to think about it. You become aware of it when you create unconventional resource names such as "Speakers" and (less frequently) when you define custom entity types on the client.

The map of a new MetadataStore starts empty. Breeze populates it from server metadata if those metadata contain EntityType/Resource mappings.

For example, the Breeze EFContextProvider generates metadata with mappings derived from Entity Framework DbSet names. When you define a Person class and exposed it from a DbContext as a DbSet named "Persons", the EFContextProvider metadata generator adds a mapping from the "Persons" resource name to the Person entity type.

Controller developers tend to use DbSet names for method names. The conventional Breeze Web API controller query method for Person entities looks like this:

    [Get]
    public IQueryable<Person> Persons() {...}

Now if you take a query such as this:

    var query = EntityQuery<Person>.Where(...);

and run it 

    var persons = await manager.Execute(query);

It just works. Why? Because

- The DbContext exposes a DbSet<Person> named "Persons"
- The EFContextProvider generated metadata that mapped the "Persons" resource to the Person type
- The Web API Controller exposes an action method that is also called "Persons".
- The Breeze query specifies the "Person" type and looks up in the MetadataStore the fact that the **default resource name** for the "Person" type is "Persons"
- The query is submitted to the server with "Persons" as the resource name.

These end-to-end conventions work silently in your favor.

... until you define an unconventional resource name - such as "Speakers" - that is not in the EntityType/ResourceName map!

In order to query this unconventional resource you need to use the following form of EntityQuery.

    var query = new EntityQuery<Person>("Speakers")

where you specific both the EntityType and the ResourceName. 

#### Register the resource name

But what if you want "Speakers" as the default resource name for querying Persons.

Fortunately, we can add an appropriate resource-to-entity-type mapping with MetadataStore.SetResourceName method as in this example:

    
    MetadataStore.Instance.SetResourceName('Speakers', typeof(Person), true);

The last parameter 'true'  tells Breeze that "Speakers" should be the new **default** resource names for the "Person" type.

#### Fetch an entity by its key

We often want to fetch an entity with a known key. For example, we may be looking at an order and decide that we want to see information about the employee who sold the order.

We could use a regular query:

    var employeeID = someOrder.EmployeeID; // FK of the salesrep who sold the order
    var query = EntityQuery<Employee>()
           .Where(e => e.EmployeeID == employeeID);
    var employees = await manager.Execute(query);
    var employee = employees.FirstOrDefault();           
           
However, Breeze offers a FetchEntityByKey shortcut for this common case.

    var ek = new EntityKey(typeof(Employee), someOrder.EmployeeID);
    var employee = await em1.FetchEntityByKey(ek);

Sometimes we have the key for an entity but don't know if it is in cache. We'll go to the server if we have to but we'd rather not fetch it from the server if we already have it in cache. The optional last parameter, checkLocalCacheFirst, makes that easy.

    var ek = new EntityKey(typeof(Employee), someOrder.EmployeeID);
    var employee = await em1.FetchEntityByKey(ek, true);
    
We'll go to the server the first time because the order's Employee salerep is not in cache. But subsequent queries will spare the round-trip and return the cached salesrep.

#### Combine cache and remote queries

With the exception of FetchEntityByKey, we can run a query either remotely or locally but not both. What if we need both?

What if we want to present a list of employees on screen ... a list that combines unsaved employee changes with the latest employee data from the server?

We can chain a pair of queries as in this example:

    // Assume 'Andrew' and 'Anne' are in the database and the manager is empty
    // Create an 'Alice' employee and add it to cache
    var alice = new Employee() { FirstName = 'Alice' };
    manager.AddEntity(alice);
    
    // query for Employees with names that begin with 'A'
    var query = EntityQuery.From<Employee>()
       .Where(e => e.FirstName.StartsWith("A");
       
    // chain remote and local query execution

    var x = await manager.ExecuteQuery(query);
    // ignore remote query results and chain to local query
    var employees = manager.ExecuteQueryLocally(query)
    // should return Alice, Andrew and Anne      

Observe that we

- started with an empty EntityManager
- added a new person, Alice, to the manager's cache.
- Anne is unsaved and not yet in the database
- ran the query remotely, returning Andrew and Anne
- discarded the query results ... but Andrew and Anne remain in cache
- re-ran the query against the cache, picking up all three: Alice, Andrew, and Anne
- Preserving pending changes during a re-query

In a related example we can demonstrate how an entity in cache with pending changes can effect the results of a combined remote/local query. Here is the scenario:

- start with an empty EntityManager
- fetch Anne from the database.
- change her name to Charlene ... do not save
- query for all persons whose first name begins with 'A'
- that query returns Andrew and Anne
- but the Anne entity's first name remains in the changed 'Charlene' state
- discard the query results
- re-run the 'A' query against the cache
- the query returns only Andrew, not the entity formerly-known-as-Anne

Focus on what happens to the 'Anne' entity. The default MergeStrategy.PreserveChanges prevents the remote query from overwriting the current name value of 'Charlene' with the database value which is still 'Anne'. Then the local query excludes the Anne entity from its results because her local current name is 'Charlene'.

This behavior is exactly what we want most of the time. The user who is changing 'Alice' to 'Charlene' would be surprised, annoyed, or both if the re-query wiped out her changes. She'd be equally surprised if the list of 'A' employees displayed a person named 'Charlene'.

We should be able to query the database repeatedly without having its data overwrite our pending changes. We want the latest information from the database but not at the expense of our unsaved work.

If we really do want the database values to trump unsaved changes ... if we want the query to change 'Charlene' back to 'Alice' ..., we can specify the MergeStrategy.OverwriteChanges.