---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/creating-entities.html"
---

#Creating a new entity

Breeze creates new entity instances on two primary occasions:

1. When it "materializes" entities from query results and 
2. when you ask it to create a brand new entity.

Entity materialization is largely hidden from the developer. You issue a query; you get entities back. Behind the scenes Breeze converts the stream of model object data into entities in cache. The developer only becomes aware of entity creation details when making new model objects.

### *new* vs *CreateEntity*

As you might expect, you can create a new entity by calling its constructor.

	var newCustomer = new Customer();

And once you've created the entity and possibly set some of its properties, you can then add it to the EntityManager.

    manager.AddEntity(newCustomer); // newCustomer is in an Added state.
 
Alternatively you can use the *EntityManager.CreateEntity* method. 
 
###The EntityManager.CreateEntity Method

Breeze provides a **CreateEntity()** factory function on an EntityManager.

	var manager = new EntityManager(_serviceName);
	
	// Metadata should be fetched before CreateEntity() can be called
	await manager.FetchMetadata();

	// Order uses an auto-generated key value
	var order = manager.CreateEntity<Order>();

In this example, the Order entity's key is initialized automatically.  It is also possible to pass an anonymous initializer object to the constructor.  If the entity key is client generated, then you *must* specify the key in the initializer ... or you'll likely get an exception.

	// If the key is not auto generated, it must be initialized by CreateEntity()
	var alpha = manager.CreateEntity<Customer>(new { CustomerID = Guid.NewGuid(), CompanyName = "Alpha" });

The **CreateEntity()** method adds the entity to the manager because that's what you usually want to do with a newly created entity. Alternatively, you can provide the optional third parameter specifying the *EntityState* to keep the entity detached or maybe attach it in some other state.

	// Unattached new customer so you can keep configuring it and add/attach it later
	// Key value initializer not required because new entity is not attached to entity manager
	var beta = manager.CreateEntity<Customer>(new { CompanyName = "Beta" }, EntityState.Detached);
	
	// Attached customer, but "unmodified", as if retrieved from the database
	// Note that the key must be initialized when new entity will be in an attached state
	var gamma = manager.CreateEntity<Customer>(new { CustomerID = Guid.NewGuid(), CompanyName = "Gamma" }, EntityState.Unchanged);

###The EntityType.CreateEntity Method

The **CreateEntity()** method of the EntityManager is shorthand for something like:

	// Only need to do this once
	var metadataStore = manager.MetadataStore;                           // The model metadata known to this EntityManager instance
	var customerType = metadataStore.GetEntityType(typeof(Customer));    // Metadata about the Customer type
	
	// Do this for each customer to be created
	var acme = customerType.CreateEntity() as Customer;  // Returns Customer as IEntity
	acme.CompanyName = "Acme";                                  // CompanyName is a required field
	acme.CustomerID = Guid.NewGuid();                           // Must set the key field before attaching to entity manager
	manager.AddEntity(acme);                                          // Attach the entity as a new entity; it's EntityState is "Added"


Why would you ever want to write that? Perhaps if you are creating many new customer entities all at once. With this longhand version, you can avoid the cost of finding the Customer **EntityType** for each new customer.

Four important facts about this approach:

1. Breeze creates the data properties and entity navigation properties based on metadata,
2. Breeze defines these properties in the manner appropriate for .Net and WPF,
3. The new object is "wired up" as a Breeze entity,
4. The new object is "detached" and does not belong to any EntityManager cache until you attach it explicitly.

The first fact means you don't have to worry about keeping your client-side Customer definition aligned with the server-side Customer definition if you're getting your metadata from the server. Change the server-side definition and the client-side definition updates automatically.

The second fact means that the new entity is shaped to match the needs of WPF binding.  **INotifyPropertyChanged**, **INotifyDataErrorInfo**, and several other interfaces discovered and used by WPF are defined and implemented by all Breeze entities.

The third fact means the new customer has embedded Breeze capabilities you can tap via the **EntityAspect** property present on all entities. We'll talk about **EntityAspect** in the next topic.

The fourth fact means some of the new customer's Breeze capabilities are temporarily disabled until you attach it to the entity manager. For example, if we stopped before the **AddEntity()** call, the new customer couldn't navigate to related entities in cache because it's not in a cache. Only after the fourth line ...

	manager.AddEntity(acme);

... is the new Acme customer ready to behave both as a Customer and as an Entity.