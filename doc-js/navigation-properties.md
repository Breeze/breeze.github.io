---
layout: doc-js
redirect_from: "/old/documentation/navigation-properties.html"
---
# Navigation Properties

> All of the examples and principles in this topic are on display in the **navigationTests** module of <a href="/samples/doccode.html">DocCode</a>.

Entities in most models are connected to each other by associations. In the [Northwind model](#_Sample_Code_Persistence), for example, the `Order` entity has a parent `Customer` entity and many child `OrderDetail` entities. An `OrderDetail` has a parent `Order` and a parent `Product` entity. `Product` entities have `Shippers`. It's a web of relationships that in Breeze can be traversed by following *property paths* from one entity to the next: `Customer` to `Order` to `OrderDetail` to `Product` to `Shipper`.

Each leg of the property path is represented by a **navigation** property. The `Customer.Orders` property travels from a customer to its collection of orders The `Customer.Orders()` property returns an array of zero or more orders; we call it a **collection** **navigation** property. We can take one of those orders and call its `Order.Customer()` property to travel back to the parent customer.  The `Order.Customer()` property returns a single object; we call it a **scalar** **navigation** property or a **reference** **navigation** property.

## Accessing navigation properties in Knockout

> We present navigation properties in <strong>knockout</strong> style throughout most of the topic. In Knockout, entity properties are implemented as observable functions.<br/><br/>If you're writing your app in Angular, you should ignore these nuances and simply read and set the navigation property values directly. The larger points about navigation still apply to you.<br/><br/>Other frameworks have their own syntax. The concepts and techniques are the same regardless of the binding framework. Learn more in the <a href="#get-set-property">discussion  below</a>.

Read a navigation property in the same way you would any observable property. Here we get the customer from an order in cache:

    var cust = anOrder.Customer(); // remember the ()

The value of `cust` is either a `Customer` object or `null`.

If `cust` is null, the order's customer is not in cache. 

The order may or may not have a customer in the remote database; Breeze does not "lazy load"  related entities(elaboration below). For certain that related customer - if there is one - is not in cache at this moment.

If we have a customer in cache and want to see its orders, this statement will produce them:

    var orders = aCustomer.Orders(); // remember the ()

The `orders` variable is a **Breeze observable array**, which is a true array supplemented by methods and events that we'll describe later.


It the collection is empty, this customer has no orders in cache at the moment.

You can access the underlying **Knockout `observableArray`** by writing `aCustomer.Orders` ***without the "()"***. This can be very confusing. Do this only when necessary.

>It can become necessary when you *add* or *remove* items as we [explain below](#ko-push)

### Setting Knockout navigation properties

We often create an order entity and set its parent `Customer` at the same time:

    var order = manager.createEntity('Order', {
		Customer: existingCustomer
	});

>The entity initializer object is a simple JavaScript hash and doesn't require any special syntax for Knockout models.

We might not know the customer until later or perhaps we need to re-assign the order to a different customer. We set the navigation property with the KO observable function assignment syntax:

    order.Customer(anotherCustomer); // setting the KO observable

Breeze instantly updates the other end of the "Customer/Order" relationship. After assigning the order's parent customer, the order was added immediately to the customer's collection of orders; the following expression is `true`:

    existingCustomer.Orders().indexOf(newOrder) >= 0; // true

Breeze is always watching both ends of the relationship and fixing up their respective navigation properties. Setting the order's customer is one way to add it to the customer's collection of orders.

We also could have added the order directly to the customer's collection of orders.

    existingCustomer.Orders.push(newOrder); // important: no ()s

Again, because Breeze is watching, the new order instantly acquires a customer; the following expression is `true`:

    newOrder.Customer() === existingCustomer; // true

<a name="ko-push"></a>
### *Orders.push* or *Orders().push*

Notice that we pushed to **`Orders`** (no parentheses) and not **`Orders()`**.

You can push to either but there is an important difference. When you push to `Orders`, you are pushing into the Knockout `observableArray`; that triggers a KO property changed notification leading to a refresh of every HTML control that is bound to this observable. If you push to the Breeze array returned by `Orders()`, then KO doesn't see that happen, doesn't raise its property changed notification and doesn't update the UI. Breeze does detect the change and raises its own `arrayChanged` event. That can be useful; you can subscribe to it as in

    existingCustomer.Orders().arrayChanged.subscribe(
       function (args) { /* do something */;});

But it is unlikely that you are updating the UI when `arrayChanged` is raised. You probably want to go through the KO `observableArray`.

### Don't set the property itself

One thing you cannot do &ndash; and shouldn't be able to do &ndash; is set the collection navigation property itself.

    existingCustomer.Orders([]); // DO NOT ATTEMPT. Throws an exception

<a id="ForeignKeys" name="ForeignKeys"></a>
## Foreign keys

From a domain perspective, a node in a network of relationships could be considered the **root** of an object graph. `Customer` is such a root. You could say that a given customer contains all of the related entities in its graph.

This is rarely (if ever) literally true. In a relational model such as Northwind, a customer doesn't physically contain its orders nor does it contain references to those orders. Some mechanism is required to obtain the orders that belong to a given customer.

In Breeze, the mechanism depends upon foreign keys. Thanks to the metadata that describe the model, Breeze knows which entities have foreign keys and knows how to use those foreign keys to make navigation properties work.

<p class="note">Breeze associations require foreign keys.</p>

<p class="note">This point is frequently neglected and misunderstood. See, for example, <a href="http://stackoverflow.com/questions/20692463/issues-including-navigation-properties-in-query" target="_blank">this StackOverflow question</a> wherein the FK is omitted and the author is surprised by the results. The answer explores the symptoms and the resolution in greater detail.</p>

In every association, one side is the **principal** entity and the other is the **dependent** entity. The dependent entity has a foreign key (FK) property whose value is the primary key of its parent principal entity.  The dependent entity typically has a matching scalar navigation property that returns its parent principal entity.

In a **one-to-many** relationship, the entity on the many side is the dependent entity that holds the FK.  Customers have orders; each order has one parent customer. So `Order` is the dependent entity vis-&agrave;-vis its parent `Customer` and has an `Order.CustomerID` foreign key property.  `Customer` is the principal entity with respect to its child orders and does not have - could not have &ndash; foreign key values for its orders.

An entity that is dependent in one relationship can be the principle of a different relationship. `Order` may be dependent with respect to `Customer` but it is also the principal vis-&agrave;-vis its dependent `OrderDetail` entities. Each child `OrderDetail` has an `OrderID` property leading back to its parent order.

Either side could be the dependent entity in a **one-to-one** relationship.  When you know the domain it's easy to tell which one is the principle and which is dependent. For example, a `Person` is clearly the principal in a relationship with a `PersonPhoto` entity.

<p class="note">Breeze does not support many-to-many associations at this time.</p>

## Setting the Foreign Key directly

Breeze knows from metadata which property is the foreign key for a navigation property. Instead of setting the navigation property, we can set the foreign key itself and achieve the same effect.

    var newOrder = createOrder();
    manager.addEntity(newOrder);
    // Set order's CustomerID, the foreign key
    newOrder.CustomerId(aCustomerKey);

The new order is now keyed to a customer. Is that customer in cache? It is if the following call returns a non-null `cust`.

    var cust = anOrder.Customer();

And if `cust` is not `null`, we know that

    cust.CustomerId === aCustomerKey;

If `cust` is `null` we know that the customer is not in cache. There may or may not be a customer with that key in the database.

## Lazy loading

On several occasions we've alluded to the possibility that a related entity exists in remote storage but is not presently in cache. Breeze navigation properties only return entities that are in cache.

In some systems, a navigation property would automatically fetch the related entities from remote storage if they were not already in cache. This process is often called "lazy loading" or "deferred loading" because related entities are only loaded into cache when requested.

Lazy loading is not a Breeze option. Breeze expects you to load related entities explicitly. You can load them either directly by querying for them or indirectly as a by-product of another query.

## Eager loading with *expand*

The indirect approach is quite common. For example, we might be interested in the orders of a particular customer whose `CustomerID` we know. We could query for those orders alone. But we may know that we're also going to display the line items (`OrderDetails`) that belong to those orders.

We could get the orders and then query for each of their line items separately; that could mean many round-trips to the server. 

Alternatively, we may be able to include those line items in the same payload as the queried orders. If our server support this **expand** feature, we can issue a single request and get back one result with both orders and their line items in a single trip.

We call this "eager loading" of the line items and Breeze can do it ... if your server can do it. 

>Confirm that your data API supports *expand*. A server written with a combination of ASP.NET Web API and Entity Framework supports it by default. So do many OData data sources. 

Here's an example:

    EntityQuery.from('Orders')
        .where('CustomerID', '==', someCustomerID)
        .expand('OrderDetails');

The argument to the `expand` function specifies a property path. All of the related entities along that path are transmitted from the server and included in the query result. In this case, the `OrderDetail` entities that belong to the selected orders are included in the query result.

The query still returns orders as it did before. Breeze first pulls the details out of the payload and merges them into the cache separately. Then it wires them up to their parent orders in cache. 

The happy consequence is that we now can ask one of the orders for its details (e.g., `someOrder.OrderDetails()`) and Breeze will return them. Without `expand`, that expression would have returned an empty array.

> Use the client-side spelling when specifying expand property names. For example, if you use <a href="/doc-js/server-namingconvention.html">camel casing on the client</a> and would get details by writing <code>order.orderDetails()</code>, then write the expand clause as <code>'orderDetails'</code>.

### Multiple expand paths

As our example stands, we're eagerly fetching the details but we don't have the parent customer. Invoke any order's `Customer` property and it returns `null`. We know the parent customer's ID; it's `someCustomerID`. But we don't have the related `Customer` entity itself.

Let's eagerly get the customer too by rewriting the query with an additional expand term:

    EntityQuery.from('Orders')
        .where('CustomerID', '==', someCustomerID)
        .expand('Customer, OrderDetails')

Now the order's `Customer` property returns the cached customer entity retrieved with the order and its details.

### Dotted expand paths

That's cool. What if we also want to display the names of the products for each order's detail. We don't have the products in cache; let's get them in the same query.

    EntityQuery.from('Orders')
        .where('CustomerID', '==', someCustomerID)
        .expand('Customer, OrderDetails.Product');

Notice four things:

1. We specified the entire, multi-part expand ***in a single string***.

1. **`Product` is at the end** of a 3-legged property path, `Order.OrderDetails.Product`.

1. **Every leg of the property path is included in the results**. Writing `OrderDetails.Product` includes both the `OrderDetails` and the `Products` of those details.

1. **The name of each leg is the name of a navigation property**. `Order` has an `OrderDetails` property. `OrderDetail` has a `Product` property. The spelling of the property path must exactly match the spelling of the navigation properties.

### Caution!
The `.expand` is a wonderful feature. **It is easy to abuse**. Too many expansions or the wrong expansions can dump vast amounts of data on the wire and crush performance of both the client and the server. 

Please use the `expand` clause judiciously. Consider [delaying retrieval](#on-demand) of related entities until you need them.

<p class="note">If expand fails to work as expected, take a look at the "<a href="/doc-js/query-debugging.html#expand" title="Query result debugging">Query result debugging</a>" topic.</p>

<a name="on-demand"></a>
## Loading related entities on demand

Suppose we are judicious in our use of *expand*. Imagine that we query for orders and do not eagerly load their details. 

We display a list of these orders. The user selects one of them to examine more closely. We want to switch to a view with the order and show its line items in that view.

Unfortunately, the line items are not in cache. We have no line items to display. How do we get the line items into cache?

We'll discuss three techniques

1. use **`loadNavigationProperty`** to fetch related entities asynchronously
1. query for related entities with a **standard query**
1. use **`EntityQuery.fromEntityNavigation`** to build a query.

### *loadNavigationProperty*

Breeze has an easy way to load the entities of a navigation property:

    selectedOrder
        .entityAspect.loadNavigationProperty('OrderDetails')
        .fail(handleFail);

The `loadNavigationProperty` method builds a navigation query and executes it, returning a promise. 

>While we may not care about the success path, as wise programmers we prepare for the worst with a failure handler.

When  query results arrive, Breeze fills the selected order's  `OrderDetails` collection automatically. If we bound the screen to its `OrderDetails` property, the data binding framework detects the changes in the collection, and the screen updates with line items. 

All we had to do was fire off the navigation query and let async query plus data binding take it from there.

### standard query
Using `loadNavigationProperty` is usually both the easiest and best way to load or refresh a navigation entity. It isn't the only way and sometimes it doesn't meet your needs. 

For example, you might need additional related entities. You could get these related entities with an *expand* clause. Unfortunately, you can't add an expand clause to the query inside `loadNavigationProperty`.

Let's write a query to get the line items and their associated products so we can display the names of the ordered products.

    var navQuery = EntityQuery.from('OrderDetails')
        .where('OrderID', '==', selectedOrder.OrderID())
        .expand('Product');
    manager.executeQuery(navQuery).catch(handleFail);

Again we don't bother to process the query results. We count on Breeze to wire up the entities and notify the binding system so that it displays all of the related information as soon as the query results arrive.

### *EntityQuery.fromEntityNavigation*

The standard query solved our problem. But the approach has two potentially troubling aspects.

1. it assumes we know how the navigation property is implemented
1. it only works for a single order

We'll tackle these issues one at a time.

#### compose a navigation query for one entity

Breeze can compose the query for us and shield us from the bitter details.

Assume we are after the related line items and products for our selected `order`.

    var navQuery = EntityQuery
        .fromEntityNavigation(order, 'OrderDetails')
        .expand('Product');
    manager.executeQuery(navQuery).catch(handleFail);

Notice that we aren't telling Breeze how to find the line item entities related to this particular `order`. Breeze can figure that out.

>Internally, Breeze starts with the `Order` metadata from which it extracts the `NavigationProperty` descriptor for the 'OrderDetails' property.  That descriptor identifies the  `OrderDetail.OrderID` foreign key so Breeze can build the predicate filter to match with the order's key. The metadata also lead Breeze - via the  `OrderDetail` type's  "defaultResourceName" - to the server endpoint for this query: "OrderDetails".
>
>We tack the 'Product' expansion on to the query and run it.

As before, when the results arrive, there are details in cache that fill the `OrderDetails` collections for each of the selected orders. The screen will light up appropriately.

#### fetch related entities for multiple root entities

The technique we just saw covers a common use case: loading related entities on-demand for a single root entity.

What if you want to load (or refresh) the related entities for *several* root entities.

Obviously you could iterate. If you have three root entities, you issue three expand queries. Would it be nice to get related entities for all three in a single query?

You can. You should be wary of how much data you're requesting in a single query. But you can do it. Here's one way to consider:

    // create an array of filter criteria (`wherePredicate`) for each order
    var predicates = orders.map(function (order) {
        return EntityQuery.fromEntityNavigation(order,'OrderDetails')
                          .wherePredicate;
    });

    // OR the predicates together
    var filter = breeze.Predicate.or(predicates);

    EntityQuery.from('OrderDetails')
        .where(filter)
        .expand('Product')
        .using(em).execute().catch(handleFail);

## *EntityState* and *PropertyChanged* events after setting

Let's circle back to earlier in our discussion where we talked about setting a navigation property.

Setting a navigation property raises a property changed event just as setting a data property does. In fact, the navigation property of the dependent entity &ndash; the entity with the foreign key &ndash; triggers the entity's property changed event **twice**: once for the navigation property and once for the update to the supporting foreign key property.

It also transitions an 'Unchanged' entity into the 'Modified' `EntityState` as it should; we'd have to save the new Foreign Key value to remote storage to make the association permanent.

As we noted earlier, the behavior of the principle entity changes when we set the navigation property of one of its dependent entities. Setting the `Customer` property of an order effectively adds the order to the customer's collection of orders.

However, this does not change the state of the customer nor does it trigger the customer's property changed event. To drive that point home, we'll add a new order directly to the customer's `Orders` array.

    existingCustomer.Orders().push(newOrder);
    var isUnchanged = 
        existingCustomer.entityAspect.entityState.IsUnchanged; // true

Technically we're not setting a property of the customer. True, it updates the collection returned by the property. And you can subscribe to changes in that collection if you wish. But it's the collection's contents that changed, not the property itself. Therefore, the customer is not changed and there is no property changed event.

This interpretation is justifiable from a purely relational perspective. Adding or removing orders does not change any physical property of the parent customer.

The "right thing to do" from the domain perspective is murkier. In most ERP applications, adding an order to a customer is not regarded as a change to the customer and so the Breeze interpretation seems correct.

On the other hand, adding or removing line items from an order is widely perceived as a change to the order. Domain rules may say that the order should enter a changed state.

Breeze lacks the ability to distinguish the "Customer/Orders" case from the "Order/OrderDetails" case. All it knows is that we are adding and removing child entities.

It's up to the application developer to transition the parent order to a changed state if that is the appropriate interpretation in the application domain.

<a name="get-set-property"></a>
## *getProperty* and *setProperty*

The navigation property syntax shown in our examples is typical for most Breeze applications and is consistent with the Knockout property syntax. Such properties are implemented as `get` and `set` functions; we write `order.Customer()` and `order.Customer(existingCustomer)`.

Breeze can be adapted to other binding frameworks that may use a different syntax. If we want to write a utility library that works for all possible binding frameworks, we should switch coding styles to the Breeze navigation property abstractions, `getProperty` and `setProperty`:

    var cust = newOrder.getProperty('Customer');
    if (cust !== existingCustomer) {
        newOrder.setProperty('Customer', existingCustomer);
    }
    var orders = existingCustomer.getProperty('Orders');

## Omitting navigation properties

Sometimes you want to omit a navigation property one side of an association. For example,  you may have `Person.Gender` but you don't want `Gender.Persons`; there is no good reason to navigate from the 'Male' gender entity to all male `Person` entities and no reason to incur the overhead of updating an observable array for that navigation. Fortunately, you can omit the navigation property on the principle side of the association. The `Gender` is the principal in this example so you can omit `Gender.Persons`.
