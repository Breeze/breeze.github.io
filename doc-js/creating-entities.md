---
layout: doc-js
redirect_from: "/old/documentation/creating-entities.html"
---

# Creating a new entity

Breeze creates new entity instances on two primary occasions: (1) when it "**materializes**" entities from query results and (2) when you ask it to **create** a brand new entity.

Entity materialization is largely hidden from the developer. You issue a query; you get entities back. Behind the scenes Breeze converts the stream of model object data into entities in cache. The developer only becomes aware of entity creation details when making new model objects.

## Don't use "new"

You might expect to make a model object by calling *new* on a constructor function:

	var newCust = new Customer(); // rarely done in Breeze

You can do it this way ... if you've defined a `Customer` constructor and registered it with Breeze. But most Breeze developers don't define entity constructors or, if they do, they define only a subset of the entity's properties and methods (see the [Extending entities](/doc-js/extending-entities.html) topic).

It's preferable to let Breeze create the entity based on entity type information gleaned from [metadata acquired from the remote data service](/doc-js/extending-entities.html) ... in which case there is no constructor to "*new up*".

## EntityManager.createEntity

The standard approach is to call the Breeze **`createEntity`** factory function on an `EntityManager`:

	var newCust = manager.createEntity('Customer', {name:'Acme'});

The first parameter, 'Customer', is the name of the `EntityType`

>Don't confuse the *type* name ('Customer') with the similar *resource* name ('Customers') that identifies the server endpoint in a query.

In this example, we also passed in an optional property *initializer*, a hash that sets the new customer's name: `{name: 'Acme'}`. You may not need an *initializer* but it is often the easiest way to simultaneously create and initialize a new entity. 

>If the entity key is *client-generated*, then you **must** specify the key in the initializer ... or you'll likely get an exception. For example, the Northwind `OrderDetail` has a composite key consisting of its parent order id and product id. You must set both values *before* adding the new entity to the cache.
>
	var newOrderDetail = 
	    manager.createEntity('OrderDetail', {orderId: oid, productId: pid});

The `createEntity` method adds the entity to the manager because that's what you usually want to do with a newly created entity. Alternatively, you can provide the optional third parameter specifying the `EntityState` to keep the entity detached or maybe attach it in some other state.

	var EntityState = breeze.EntityState;
	
	// unattached new customer
	// you can keep configuring it and add/attach it later
	var newCust = manager.createEntity('Customer', {name:'Beta'}, EntityState.Detached);
	
	// attached customer, as if retrieved from the database
	// note that the id must be specified when attaching an 'existing' entity
	var oldCust = manager.createEntity('Customer', {id: 42, name:'Gamma'}, EntityState.Unchanged);

## EntityType.createEntity

The `createEntity` method of the *EntityManager* is shorthand for something like:
	
	var metadataStore = manager.metadataStore; // model metadata known to this EntityManager instance
	var customerType = metadataStore.getEntityType('Customer'); // metadata about the Customer type 
	var newCust = customerType.createEntity({name:'Acme'}); // call the factory function for the Customer type
	manager.addEntity(newCust); // attach the entity as a new entity; it's EntityState is "Added"

Why would you ever want to write **that**? Perhaps you are creating hundreds of new customer entities all at once. With the longhand version, you can avoid the cost of finding the `customerType` for each new customer.

Four important facts about this approach:

1. Breeze creates the data properties and entity navigation properties based on metadata.
1. Breeze defines these properties in the manner appropriate for the model library you choose
1. The new object is "wired up" as a Breeze entity
1. The new object is "detached" and does not belong to any *EntityManager* cache until you attach it explicitly


The first fact means you don't have to worry about keeping your client-side `Customer` definition aligned with the server-side "Customer" class definition if you're getting your metadata from the server. Change the server-side definition and the client-side definition updates automatically.

The second fact means that `newCust` is shaped to match your model preference. If you configured Breeze for Angular or Aurelia, `newCust` has a `name` property. If you configured Breeze for Knockout, `newCust` has a `name()` observable function for getting and setting the name. If you configured Breeze for backbone, `newCust` becomes observable in the backbone manner, e.g. via `get('name')` and `set('name', newValue)` function calls.

The third fact means `newCust` has embedded Breeze capabilities you can tap into via the `newCust.entityAspect` property. We'll talk about [**`entityAspect`**](/doc-js/inside-entity) in the next topic.

The fourth fact means some of `newCust`'s Breeze capabilities are temporarily disabled until you attach it to the manager. For example, if we stopped at line #3, the `newCust` couldn't navigate to related entities in cache because it's not in a cache. Only after the fourth line ...

	manager.addEntity(newCust);
	
... is the `newCust` object ready to behave both as a `Customer` and as an *entity*.
