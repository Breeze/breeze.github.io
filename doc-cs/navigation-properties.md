---
layout: doc-cs
---

# Navigation Properties

All of the examples and principles in this topic are on display in the NavigationTests module of DocCode.

Entities in most models are connected to each other by associations.  In the Northwind model, for example, the Order entity has a parent Customer entity and many child OrderDetail entities. An OrderDetail has a parent Order and a parent Product entity. Product entities have Shippers. It’s a web of relationships that in Breeze can be traversed by following property paths from one entity to the next: Customer to Order to OrderDetail to Product to Shipper.

Each leg of the property path is represented by a navigation property. The Customer.Orders property travels from a customer to its collection of orders The Customer.Orders property returns a collection of zero or more orders; we call it a collection navigation property. We can take one of those orders and call its Order.Customer property to travel back to the parent customer.  The Order.Customer property returns a single object; we call it a scalar navigation property or a reference navigation property.

### Reading navigation properties

Read a navigation property in the same way you would a data property. Here we get the customer from an order in cache:

    var cust = anOrder.Customer;

The value of cust is either a Customer object or null.

If cust is null, the order’s customer is not in cache. The order may or may not have a customer in the remote database. For certain that customer is not in cache with the order at this moment.

If we have a customer and want to see its orders, this statement will produce them:

    var orders = aCustomer.Orders; 

The orders variable is a breeze NavigationSet<Order>, which represents the collection of orders in cache related to this Customer. 

It the collection is empty, then this customer has no orders in cache at the moment.

### Setting navigation properties

In the following example, we add a new order to an existing customer in cache.

    var newOrder = CreateOrder();
    manager.AddEntity(newOrder);
    // Set the newOrder's Customer
    newOrder.Customer = existingCustomer;

We didn’t have to add the new order to the manager. Breeze pulls it into the customer’s EntityManager automatically as an “Added” entity the moment we set the new order’s Customer property. We could have written:

    var newOrder = CreateOrder();
    // pull order into customer's cache as a side-effect
    newOrder.Customer = existingCustomer;
 
This works … but we prefer adding the order to the manager explicitly as we did in the initial example.

Most importantly, Breeze instantly updated the other end of the relationship. After assigning the order’s parent customer, the order was added immediately to the customer’s collection of orders; the following expression is true:

    existingCustomer.Orders.IndexOf(newOrder) >= 0

Breeze is always watching both ends of the relationship and fixing up their respective navigation properties. Setting the order’s customer is one way to add it to the customer’s collection of orders.

We could have added the order directly to the customer’s collection of orders instead.

    existingCustomer.Orders.Add(newOrder) 

Again, because Breeze is watching, the new order instantly acquires a customer; the following expression is true:

    newOrder.Customer == existingCustomer
    
All Breeze navigation collections implement the INotifyCollectionChanged interface, so Breeze does detect the change and raises an CollectionChanged event. This can be useful; you can subscribe to it as in

    existingCustomer.Orders.CollectionChanged += (sender, collectionChangedArgs) => {
        // do something interesting
    }
   

### Don't set the property itself

One thing you cannot do – and shouldn’t be able to do – is set the collection navigation property itself. There is NO setter for collection navigation properties so you won't be able to do the following:

    existingCustomer.Orders = ???; // DO NOT ATTEMPT. There is no setter

### Foreign keys

From a domain perspective, a node in a network of relationships could be considered the root of an object graph. Customer is such a root. You could say that a given customer contains all of the related entities in its graph.

This is rarely (if ever) literally true. In a relational model such as Northwind, a customer doesn’t physically contain its orders nor does it contain references to those orders. Some mechanism is required to obtain the orders that belong to a given customer.

In Breeze, the mechanism depends upon foreign keys. Thanks to the metadata that describe the model, Breeze knows which entities have foreign keys and knows how to use those foreign keys to make navigation properties work.

### Breeze associations require foreign keys.

This point is frequently neglected and misunderstood. See, for example, this StackOverflow question wherein the FK is omitted and the author is surprised by the results. The answer explores the symptoms and the resolution in greater detail.

In every association, one side is the principal entity and the other is the dependent entity. The dependent entity has a foreign key (FK) property whose value is the primary key of its parent principal entity.  The dependent entity typically has a matching scalar navigation property that returns its parent principal entity.

In a one-to-many relationship, the entity on the many side is the dependent entity that holds the FK.  Customers have orders; each order has one parent customer. So Order is the dependent entity vis-à-vis its parent Customer and has an Order.CustomerID foreign key property.  Customer is the principal entity with respect to its child orders and does not have - could not have – foreign key values for its orders.

An entity that is dependent in one relationship can be the principle of a different relationship. Order may be dependent with respect to Customer but it is also the principal vis-à-vis its dependent OrderDetail entities. Each child OrderDetail has an OrderID property leading back to its parent order.

Either side could be the dependent entity in a one-to-one relationship.  When you know the domain it’s easy to tell which one is the principle and which is dependent. For example, a Person is clearly the principal in a relationship with a PersonPhoto entity.

Breeze does not support many-to-many associations at this time.

### Setting the Foreign Key directly

Breeze knows from metadata which property is the foreign key for a navigation property. Instead of setting the navigation property, we can set the foreign key itself and achieve the same effect.

    var newOrder = CreateOrder();
    manager.AddEntity(newOrder);
    // Set order's CustomerID, the foreign key
    newOrder.CustomerId = aCustomerId;

The new order is now keyed to a customer. Is that customer in cache? It is if the following call returns a non-null cust.

    var cust = anOrder.Customer;

And if cust is not null, we know that

    cust.CustomerId == aCustomerId;

If cust is null we know that the customer is not in cache. There may or may not be a customer with that key in the database.

### Lazy loading

On several occasions we’ve alluded to the possibility that a related entity exists in remote storage but is not presently in cache. Breeze navigation properties only return entities that are in cache.

In some systems, a navigation property would automatically fetch the related entities from remote storage if they were not already in cache. This process is often called “lazy loading” or “deferred loading” because related entities are only loaded into cache when requested.

Lazy loading is not a Breeze option. Breeze expects you to load related entities explicitly. You can load them either directly by querying for them or indirectly as a byproduct of another query.

### Eager loading with “expand”

The indirect approach is quite common. For example, we might be interested in the orders of a particular customer whose CustomerID we know. We could query for those orders alone. But we may know that we’re also going to display the line items (OrderDetails) that belong to those orders.

We could get the orders and then query for each of their line items separately; that could mean many roundtrips to the server. Alternatively, we could include those line items in the same payload as the queried orders. Then we’d make one trip and get back one result with both orders and their line items.

We call this “eager loading” of the line items and Breeze can do it. Here’s an example:

    var query = new EntityQuery<Order>()
        .Where(o => o.CustomerID == someCustomerID)
        .Expand(o => o.OrderDetails);

The argument to the expand function specifies a property path. All of the related entities along that path are included in the query result. In this case, the OrderDetails belonging to the selected orders are included in the query result.

The query still returns orders. Breeze pulls the details out of the payload and merges them into the cache separately.

The happy consequence is that we now can ask one of the orders for its details (e.g., someOrder.OrderDetails) and Breeze will return them. Without “Expand”, that expression would have returned an empty array.

As our example stands, we’re eagerly fetching the details but we don’t have the parent customer. Invoke any order’s Customer property and it returns null. We know the parent customer’s ID; it’s someCustomerID. But we don’t have the Customer entity itself. Let’s eagerly get the customer too by rewriting the query with an additional expand term:

    var query = new EntityQuery<Order>()
        .Where(o => o.CustomerID == someCustomerID)
        .Expand("Customer, OrderDetails");

Now an order’s Customer property and it returns a customer entity.

That’s fine. But now we realize that we want to display the names of the products for each order’s detail. We don’t have the products in cache; let’s get them in the same query.

    var query = new EntityQuery<Order>()
        .Where(o => o.CustomerID == someCustomerID)
        .Expand("Customer, OrderDetails.Product");

Notice four things:

- We specified the entire, multi-part expand in a single string.
Product is at the end of a 3-legged property path, Order.OrderDetails.Product.
- Every leg of the property path is included in the results. Writing “OrderDetails.Product” includes both the OrderDetails and the Products of those details.
- The name of each leg is the name of a navigation property. Order has an OrderDetails property. OrderDetail has a Product property. The spelling of the property path must exactly match the spelling of the navigation properties.
- The “Expand” is a wonderful feature that is easy to abuse. Too many expansions or the wrong expansions can dump vast amounts of data on the wire and crush performance of both the client and the server. Please use the “Expand” option judiciously. Consider delaying retrieval of related entities until you need them.

If expand fails to work as expected, take a look at the "Query result debugging" topic.

### Loading related entities on demand

Suppose we queried only for orders and did not eagerly load their details. We displayed a list of these orders. The user selected one of them to examine more closely. We want to switch to a view with the order and its line items.

Perhaps the view displays a list that is data bound to the selected order’s OrderDetails property. Unfortunately, the line items are not in cache and so the list is empty. How do we get the line items into cache?

Breeze has an easy way to load the entities of a navigation property:

    await selectedOrder.EntityAspect.LoadNavigationProperty("OrderDetails");
    
The LoadNavigationProperty method builds a navigation query and executes it, returning a async Task. While we may not care about the success path, as wise programmers we prepare for the worst with a failure handler.

When  query results arrive, the selected order’s  OrderDetails collection is filled, the data binding framework detects the changes in the array, and the screen updates with line items. We just fired off the query and let async query plus data binding take it from there.

This is usually both the easiest and best way to load or refresh a navigation entities. It isn't the only way. We could compose a query for them this way:

    var navQuery = new EntityQuery<OrderDetail>()
        .Where(od => od.OrderID == selectedOrder.OrderID);

One reason you may have to take this approach is to add expansions, something you can't do with LoadNavigationProperty. Let's tweak that last query to get the associated products so we can display the names of the ordered products.

    var navQuery = new EntityQuery<OrderDetail>()
        .Where(od => od.OrderID == selectedOrder.OrderID);
        .Expand("Product");

That works great but the query has two potentially inconvenient aspects.

- it assumes we know how the navigation property is implemented
- it only works for a single order
- 
### EntityState and PropertyChanged events after setting

Let’s circle back to earlier in our discussion where we talked about setting a navigation property.

Setting a navigation property raises a property changed event just as setting a data property does. In fact, the navigation property of the dependent entity – the entity with the foreign key – triggers the entity’s property changed event twice: once for the navigation property and once for the update to the supporting foreign key property.

It also transitions an “Unchanged” entity into the “Modified” EntityState as it should; we’d have to save the new Foreign Key value to remote storage to make the association permanent.

As we noted earlier, the behavior of the principle entity changes when we set the navigation property of one of its dependent entities. Setting the Customer property of an order effectively adds the order to the customer’s collection of orders.

However, this does not change the state of the customer nor does it trigger the customer’s property changed event. To drive that point home, we’ll add a new order directly to the customer’s Orders collection.

    existingCustomer.Orders.Add(newOrder);
    var isUnchanged = existingCustomer.EntityAspect.EntityState.IsUnchanged(); // true

Technically we’re not setting a property of the customer. True, it updates the collection returned by the property. And you can subscribe to changes in that collection if you wish. But it’s the collection’s contents that changed, not the property itself. Therefore, the customer is not changed and there is no property changed event.

This interpretation is justifiable from a purely relational perspective. Adding or removing orders does not change any physical property of the parent customer.

The “right thing to do” from the domain perspective is murkier. In most ERP applications, adding an order to a customer is not regarded as a change to the customer and so the Breeze interpretation seems correct.

On the other hand, adding or removing line items from an order is widely perceived as a change to the order. Domain rules may say that the order should enter a changed state.

Breeze lacks the ability to distinguish the Customer/Orders case from the Order/OrderDetails case. All it knows is that we are adding and removing child entities.

It’s up to the application developer to transition the parent order to a changed state if that is the appropriate interpretation in the application domain.

### Unidirectional navigation

Sometimes you want to omit a navigation property one side of an association. For example,  you may have Person.Gender but you don't want Gender.Persons; there is no good reason to navigate from the "Male" gender entity to all male Persons and no reason to incur the overhead of updating an observable array for that navigation. Fortunately, you can omit the navigation property on the principle side of the association. The Gender is the principal in this example so you can omit Gender.Persons.