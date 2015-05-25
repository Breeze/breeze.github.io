---
layout: doc-cs
---

# Introduction

**Breeze.sharp** is a .NET library that helps you manage data in rich client applications. If you store data in a database, query and save those data as complex object graphs, and share these graphs across multiple screens of your .NET client, Breeze is for you. **BreezeSharp** also has a sister product, **BreezeJS** that is a JavaScript client library with exactly the same capabilities. Both clients are compatible with any 'Breeze' service.

### Headline features

**Business data objects** mirror your server-side model. Breeze creates them dynamically. and via standard .NET property change interfaces the properties of these business data objects can bind to UI controls so the UI updates when your data model changes. Each object knows when it has changed and what has changed.

**Query** your object model via LINQ with where clauses, ordering, and paging and Breeze translates these queries into the Open Data Protocol (OData) query standard so you can “expand” the result with related entities or “project” over the data to cherry pick columns and flatten object graphs. Web API, OData, and many other service providers can implement the OData query spec.

**Save** one entity or a batch of entities as a single transaction. Batch a mix of entity types (customers, orders, line-items) and data operations (inserts, updates, deletes).

**Cache** data on the client to reduce trips to the server and refresh as needed. Query a cache like you query the server. Save the cache locally and run offline; synch changes when you’re reconnected.

**Extend** the model with custom methods, properties, and events. Breeze is also designed with an open API to allow it to plug into other front-end and back-end technologies.

### Core concepts

You create a Breeze *EntityManager* in your .NET client to access and cache model data. Metadata about your data model guides Breeze in reshaping raw data as entities with properties and behavior. You query with the EntityManager to load entities into cache from a remote persistence service. You present entity data to users typically by binding UI controls to entity properties. You add new entities to cache, update existing entities, and schedule other entities to be deleted. Periodically you save these pending changes in a batch back to the persistence service which stores them in a database as a single transaction.

This entity-oriented style of data management is familiar to business application developers who use an Object Relational Mapper (ORM) or such technologies as ActiveRecord, RIA Services, and IdeaBlade’s DevForce.

The italicized terms are clues to the key components and concepts in Breeze.

**EntityManager**

The Breeze EntityManager is both a gateway to the backend persistence service and a cache of the entities that you’re working on locally.

You ask an EntityManager to execute queries and save pending changes. The EntityManager builds the requisite requests and handles the asynchronous communications with the backend service.

The objects queried and saved are entities held in the EntityManager’s cache. Entities enter the EntityManager’s cache in several ways: as a result of a query, by adding entities directly to the cache, or perhaps by importing them from another source (a file, another EntityManager). Entities leave the cache when you remove them manually and after saving entities marked for deletion. You can query the cache in the same way … with the same query command object … that you use to query the remote server.

You’ll learn more about the EntityManager soon. But let’s take a step back. What’s an “entity”?

**Entity**

An entity represents a meaningful “thing” in your application model. That thing consists of simple data (a name), relationships to other entities (the customer of an order), and some rules (the name is required).

A Breeze entity is an object with data properties and navigation properties that return related entities. Data properties typically return simple data values: the strings, numbers, Booleans, and dates that correspond to fields of a record in a database. Navigation properties return related entities from the EntityManager’s cache. For example, an order’s navigation properties can return its parent customer (anOrder.Customer) or its line items (anOrder.OrderDetails).

A Breeze entity also contains a kernel of “entity-ness”, its *EntityAspect*, to help Breeze manage the entity. You can inspect the EntityAspect and make changes to influence how Breeze handles the entity.

Perhaps an entity’s most important aspect is its *EntityState*. The EntityState indicates whether a Breeze entity is new (added) or already exists in the backing store.  If it already exists, the entity might be unchanged, modified, or marked-for-deletion (deleted). You can examine the original values of a pre-existing entity and restore the entity to its original state by calling *EntityAspect.RejectChanges()* .

**Data binding and observability**

Breeze applications rely mostly on data binding to coordinate the flow of values between a Breeze entity and the widgets on screen. See Dan Wahlin’s post to see why data binding is a good tool for this job.

Data binding can push a new value to the UI when it detects that an entity property has changed. Most binding frameworks detect changes by listening to a property changed event, which means the entity properties must be observable.

Breeze entity properties are observable.  All Breeze entities automatically implement and raise .NET PropertyChanged events. 


**Query**

You retrieve entities from a backend database by composing a query object in the Breeze query language and executing that query object with an EntityManager.

In the following example, we compose a query for all customers whose name begins with the letter ‘C’ and sort the results by company name.

    var query = new Breeze.Sharp.EntityQuery<Customer>()     
        .Where(c => c.CompanyName.StartsWith("C") 
        .OrderBy(c => c.CompanyName);

Then we create an EntityManager and execute the query.

    var manager = new Breeze.Sharp.EntityManager(serviceName);
    var results = await manager.ExecuteQuery(query)  // [1]
          
Notice that [1] the ExecuteQuery method is asynchronous and returns a Task<IEnumerable<T>> where T is 'Customer' in this case.
 
Breeze resolves this query into an HTTP GET request to a persistence service endpoint formatted as an OData URI. That means the filtering and order criteria appear in the query string of the request, e.g.

http://www.example.com/api/Northwind/Customers?$filter=startswith(CompanyName,'C') eq true&$orderby=CompanyName

The OData query syntax is supported by Web API controllers and non-.NET providers as well as WCF Data Services backends.

The query results arrive in a JSON array. The Breeze EntityManager reshapes the JSON data into entities and merges them into its cache. Finally it returns these entities   as the Task result. 

By default the manager preserves pending changes when merging query results into its cache. For example, if the results included the “Acme” company entity and the user had made an as-yet-unsaved change to Acme’s street address, the manager won’t touch any of Acme’s current values. We’ll explore merging in greater detail later in the documentation.

The same query object can be used to find ‘C’ customers in cache.

    var customers = manager.ExecuteQueryLocally(query)

This time the query only applies to entities in cache; the EntityManager does not call the backend. The query executes synchronously and the results are available immediately.

Notice that we use the same query syntax – the same query object – to search both the local cache and a remote database.

You can also write complex LINQ queries. For example, a query can reference related entities as when we filter for customers who have placed an order in California. It can combine the filtered customers with their orders in the same result payload. It can project a result that flattens the Customer-Orders graph into a three-valued object: CustomerId, CustomerName, and OrderCount. If a query can be expressed in OData syntax, it can be expressed in Breeze.

**Save**

A Breeze application adds, modifies, and deletes entities held in a manager’s cache. Breeze won’t save a changed entity immediately. Instead, Breeze sets its EntityState to one of the changed-state values.

Changed entities accumulate in cache until you call the EntityManager’s SaveChanges()  method as illustrated here:

    var saveResult = await manager.SaveChanges(); // returns a Task<SaveResult>
       
The manager bundles every changed entity into a batch, runs validations over those entities and, if they all pass, posts a request to the persistence service to save the batch.

In principle, the persistence service can receive the batch in a single request and save the batch contents to a database as a single transaction. The actual details of the save request and what the service does with the batch depend upon the API and capabilities of the service itself.

For saves (and queries) to work, the client and service must understand the shape and characteristics of the entity data they exchange. Breeze must be able to translate a client-side customer entity into its equivalent object on the server. Breeze relies upon model metadata to make that translation.

**Metadata**

Breeze metadata describe entity types and relationships among entities in a data model. Breeze needs this metadata to communicate with the persistence service during query and save, to create new entities on the client, and to navigate among entities in cache. Some of this metadata is available simply as a result of Breeze reflecting against your client side types but additional metadata is often also provided by the persistence service.  

    // Create new customer named 'Acme' and add to the manager's cache
    var newCust = new Customer() { CompanyName = 'Acme' };
    manager.AddEntity(newCust);
    
     
You are not boxed in by the metadata entity type. It’s easy to extend the Breeze-generated entity type with a custom constructor and add custom properties, methods, events, validation, and property interceptors.

**Persistence Service**

A Breeze application makes HTTP requests of a persistence service that typically resides on a remote server. The Breeze client doesn’t know … or care … how the data are processed and stored by that persistence service. The service could be written in any language and run on any platform. The Breeze client can be adapted to speak to almost any data service supporting a JSON API.

Today, out of the box, the Breeze product ships with adapters for the ASP.NET Web API for OData and for NodeJs with a MongoDB database.  It also ships with .NET components that interface with the Entity Framework and that generate Breeze metadata from an Entity Framework model; that EF model could be developed code first or database first.  The Breeze client is in no way limited to these technologies; they are merely the first backend components available; we’d be thrilled to help you adapt Breeze to your preferred server stack.

**What's next**

You now have the big picture. Take a look at Breeze Features.
