---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/query-result-debugging.html"
---

# Debugging query result mysteries

What do you do when your Breeze query doesn't return the results you expected? 

In this topic, we'll assume you *actually got results* from the server but they aren't showing up as Breeze entities, at least not in the way you expected.

You know you got results when your query makes it past the **await** statement in an *ExecuteQuery* call. 

If this is not the case, your first step should be to use a tool like Fiddler to see both the query request and the JSON response. Do you see the data coming from the server? Is it the right data?

If not, stop. Figure out why the server isn't sending the right data before worrying about what Breeze is doing on the client.

## I'm getting the right data from the server

Ok ... you see the data but some or all of the aren't showing up in the entity. One of the first things we do is examine the metadata for a one or more of your `EntityType`s starting with the root type of the query.

> Please <a href="/doc-cs/metadata" title="Breeze Metadata"><b>learn about Breeze metadata</b></a> before continuing with this topic. It won't make much sense otherwise.

Let's look at a query that returns an `Order`, its `OrderDetail`s, and its parent `Customer`.

    var results = await EntityQuery.From<Order>()
      .Take(1)                          // get the first order
      .Expand("Customer, OrderDetails") // include customer and details
      .Execute(manager);

    // modified for exploration
  
    // get the MetadataStore from the query's manager
    var ms = MetadataStore.Instance;
    // get the types of interest
    var orderEntityType = ms.GetEntityType(typeof(Order));
    var orderDetailEntityType = ms.GetEntityType(typeof(OrderDetail));
    var customerEntityType = ms.GetEntityType(typeof(Customer));

    // ... more code ... add breakpoint here.
    
Run the code to the breakpoint. 

## Are the types defined?

Make sure each of the types - `orderEntityType`, `orderDetailEntityType`, and `customerEntityType` - are defined. If any of them is null, you have found a problem.

Do you have any types at all? The following should return an collection of EntityTypes:

    MetadataStore.Instance.EntityTypes

Is your `EntityType` in this collection ... perhaps with a different spelling?

Figure out why your types are missing before continuing. This topic assumes you have types.


## Is the query a projection (does it have a `select` clause)? 

Projections do not return entities, they return instances of either anonymous types or of a specified explicitly defined type.  These projected types may themselves contain references to entities, but if you were expecting the result of a projection query to be a list of entities, this will NOT happen.  

## Is the property defined?

Sometime you expected a property value and it didn't show up. Check if the missing property is among the type's `Properties`, or more specifically among the type's `DataProperties` or `NavigationProperties`.  properties. 

    orderEntityType.Properties
    orderEntityType.DataProperties // subset of Properties
    orderEntityType.NavigationProperties // another subset

>A property is "recognized" if it is registered in metadata in the `Properties` collection. All of the different types of metadata properties - mapped/unmapped, dataProperties/navigation properties - are in this array. 

Is your property listed? Is it spelled the way you expected it to be spelled? With the expected casing? If it's not listed, you've found a place to start digging (see the discussion of `NamingConvention` coming up next). 

Do you still think this property should be in metadata? Was it supposed to be a "navigation property" - a property that returns another entity - or was it supposed to return a simple piece of data such as a string or number?

If it was supposed to return a simple data value, you'll have to work backward from here to the source of your metadata whether it was server-generated or you wrote it by hand. Something upstream either neglected to define the property or suppressed it's representation in metadata.

## Are you applying the expected *NamingConvention*?

In many applications the client-side spelling of a property name should be different than the server-side spelling. You'll see the server-side spelling in the JSON payload and in the `DataProperty.NameOnServer` where as the client-side spelling is reflected in the entity property name you see in the debugger and in the `DataProperty.Name`.

The Breeze [**`NamingConvention`**](/doc-cs/naming-convention) translates between these two spellings. Are you sure that your metadata are governed by the `NamingConvention` you expect? You may *think* you are applying one convention when, in fact, a different convention is controlling the translation. See "[Beware of the baked-in NamingConvention](/doc-cs/naming-convention#NamingConventionInMetadata)".

## Are you missing a navigation property?

You were expecting a "navigation property" - a property that returns another entity - and it wasn't listed among the `NavigationProperties`.

This is probably a metadata creation problem. If you wrote the [metadata by hand](/doc-cs/metadata-by-hand#NavigationProperties), return to the "Navigation Properties" section of that topic and try to discover what you did differently.

Did you define **foreign key (FK) properties**? Developers often neglect to define or identify the FK properties. Breeze requires FK properties to implement navigation properties. 

>In some cases you can define navigation properties without FKs but Breeze will not be able to maintain those properties in cache.

The remainder of this topic assumes you found the expected `Property`.

## Is it the expected kind of property?

What kind of property is it? What kind were you expecting? 

In the list below, find the kind of `DataProperty` that you were expecting and see if it aligns with what the debugger says about your property. 

- [Simple mapped Property](#SimpleMapped)

- [Simple unmapped Property](#SimpleUnapped)

- [Complex mapped property](#ComplexMapped)

- [Navigation properties](#NavigationProperties)

- [Reference navigation property](#ReferenceNavigation)

- [Collection navigation property](#CollectionNavigation)

- [When expand fails](#expand)

- [Foreign Key property](#ForeignKey)

If you still can't figure it out after following these links, <a href="http://stackoverflow.com/questions/tagged/breeze?sort=newest" title="Breeze StackOverflow" target="_blank">ask a question on StackOverflow</a> and please state what you learned from this metadata analysis.

<a name="SimpleMapped"/>
#### Simple mapped property

	orderEntityType.GetProperty("OrderDate");

Inspect the result of this expression in the watch window and notice that: 

- it has a basic data type ("DateTime") 
- it is scalar (i.e., returns a single value)
- it is optional (isNullable)
- this property is not part of the key
- the name (on the client) matches the name on the server


<a name="SimpleUnmapped"></a>
#### Simple unmapped property

An "unmapped property" refers to a value that is not persisted in the remote data store. Because an unmapped property is not persisted, it isn't transmitted to the server and changes to  the property values have no effect on the entity's `EntityState`.

Unmapped properties often don't even exist on the server model object to which this entity corresponds. They are typically *created* on the client to hold values that are *meaningful on the client*. The client application assigns their values and the server knows nothing about them.

The value of an unmapped property *can come from the server* as when the server model calculates a value for the client that the client could not calculate for itself. Breeze copies the value from the JSON payload into the unmapped property when materializing query results. Just remember: changes to that value won't be sent back to the server.

See the ["Extending Entities" topic](/doc-cs/extending-entities "Extending Entities") to learn how to create an unmapped property. If `Order` had an unmapped property called `isBeingEdited`, you could access it like this.

	orderEntityType.GetProperty('IsBeingEdited');

If you inspect the result of this expression in the watch window you will notice that the distinguishing feature of this `DataProperty` is the `IsUnmapped: true` property.

Notice that 

- it has an `isUnmapped` property
- it does **not** have 
	- `isPartOfKey`
	- `nameOnServer`

<a name="ComplexMapped"></a>
#### Complex mapped property

	orderEntityType.GetProperty("ShipTo");

If you inspect the result of this expression in the watch window you will notice that

- it announces itself as a "ComplexType"
- it has an `IsComplexProperty` which is true 
- it is required because all complex properties are required
- it is scalar (i.e., returns a single value)
- the name (on the client) matches the name on the server

<a name="NavigationProperties"></a>
#### Navigation properties

You can navigate from an entity to other related entities via *navigation properties* as in

    customer.Orders; // child order entities
    order.Customer;  // parent customer entity

These properties return entities from cache. If the related entities are not in cache, they'll return an empty collection or null as appropriate for that property. 

>You can eagerly load the related entities into cache during a query with the [`.expand(...)` clause](/doc-cs/query#Eager%20loading%20%20EntityQuery.expand ""expand" documentation"). If this *expand* isn't working for you, see the "[When expand fails](#expand "When expand fails")" section below.

A navigation property corresponds to one side of an *association* between two entity types.

For example, `Customer` and `Order` are related by an association named "Order_Customer". The association spells out a one-to-many relationship between a *parent* `Customer` and a *child* `Order`.  On the "many" side is the `Customer.Orders` navigation property from parent to children. On the "one" side is the navigation from child to parent, `Order.Customer`.

>Breeze does not require both navigation properties. You can omit one or the other. The association becomes invisible if you omit both properties.

Breeze supports several association *cardinalities*:

- one-to-many
- many-to-one
- one-to-one
- one-to-zero

**Breezes does not support a many-to-many association**. You must expose the mapping object as an entity and manage it yourself. 

>We describe one way to manage a many-to-many association in our response to [this StackOverflow question](http://stackoverflow.com/questions/20638851/breeze-many-to-many-issues-when-saving "StackOverflow: many-to-many issues"). 

With this background in mind, let's look at the two types of navigation properties in detail.

<a name="ReferenceNavigation"></a>
#### Reference navigation property

A "reference navigation property" returns a single related entity, typically the "parent" entity (the entity in the "principal" role) of an association. The "Customer" is the parent of an "Order" in this model.

Get the property information as we did before:

	orderEntityType.GetProperty("Customer");


If you inspect the result of this expression in the watch window you will notice that

- the `EntityType` is the definitive sign that this is a navigation property, a property that returns a `Customer`
- it is scalar (i.e., returns a single value) 
- the `ForeignKeyProperties` collection tells us that
	- `Order` has one foreign key property for this association
	- `CustomerID` is the name of that FK property 
	- `Order` is in the "dependent" role because it has the FK
- the existence of an `Inverse` property means that there is an "inverse navigation" property from `Customer` back to `Order`. Drilling in would reveal that the name of that property is `Orders`
- the `AssociationName` links this `Order.Customer` property to the inverse `Customer.Orders` property.

Breeze does not require navigation properties for both sides of an association. The `Inverse` navigation property is optional. The `AssociationName` could be omitted if there were no `Inverse` navigation property.

<a name="CollectionNavigation"></a>
#### Collection navigation property

A "collection navigation property" returns an array of related entities, typically the "children" of this "parent" entity.

The "Order" is the parent of zero-to-many "OrderDetails" in this model.

Get the property information as we did before:

    orderEntityType.GetProperty("OrderDetails")

If you inspect the result of this expression in the watch window you will notice that:

- the `EntityType` is the definitive sign that this is a navigation property, a property that returns `OrderDetail` entities
- it is an array property (`IsScaler` is `false`) 
- the `ForeignKeyProperties` property is null; `Order` is in the "principal" role because it has no FKs
- the `InverseForeignKeyProperties` collection tells us that
	- the child `OrderDetail` type carries one foreign key property for this association
	- `OrderID` is the name of that FK property 
	- `OrderDetail` is in the "dependent" role because it has the FK 
- the existence of a non null `Inverse` property means that there is an "inverse navigation" property from `OrderDetail` back to `Order`. Drilling in would reveal that the name of that property is `Order`
- the `AssociationName` links this `Order.OrderDetails` property to the inverse `OrderDetail.Order` property.

Breeze does not require navigation properties for both sides of an association. The `Inverse` navigation property is optional. 

It makes sense that `Order` has a collection navigation property that returns its child line items.

But it is quite common to omit the collection navigation property of an association when there is no good business reason to navigate in the direction of the children. For example a `Person` could have a `Person.Gender` reference navigation property. But it makes little sense to have a `Gender.Persons` collection navigation property because we don't expect (nor want) to navigate from, say, "Male" to all of the people who are male.

The `AssociationName` could be omitted if there were no `Inverse` navigation property.

<a name="expand"></a>
#### When *.expand(...)* fails

One way to load related entities into cache is to add an [`.expand(...)` clause](/doc-cs/query#Eager%20loading%20%20EntityQuery.expand ""expand" documentation") to your query.

Did you add an `.Expand(...)` clause to your query? Do you see the related entity data in the query result payload as in this example where `Bar` data is nested within the `Foo` data.

	[
	   {
	      "$id":"1",
	      "$type":"Models.Foo, DataAccess",
	      "Id":"10",
	      "Bar":{
	         "$id":"2",
	         "$type":"Models.Bar, DataAccess",
	         "Id":"12",
	         "SomeData":"Hello World"
	      }
	   }
	]

The most likely cause is that you've neglected to define the Foreign Key (FK) property that supports the association.

We see that cause clearly in this payload. Look closely at the nested `Bar` data. It should include a "FooId" with the parent `Foo` Id of "10" because `Bar` is the dependent entity type in the "Foo_Bar" association.  The data should look like this:

    "Bar":{
        ...
        "Id":"12",
        "FooId: "10"
        ...
    }

Go back to the section on "[Reference navigation properties](#ReferenceNavigation)". Bet the metadata for the property is missing the "ForeignKeyProperties" entry.

You'll want to add that `FooId` property to the `Bar` type defined in your server API. Then update the metadata for `Bar` (which is automatic if you've gone down the .NET EF development road).

> Breeze associations require foreign keys.

> This point is frequently neglected and misunderstood. See, for example, <a href="http://stackoverflow.com/questions/20692463/issues-including-navigation-properties-in-query" target="_blank">this StackOverflow question</a> wherein the FK is omitted and the author is surprised by the results. The answer explores the symptoms and the resolution in greater detail.

<a name="ForeignKey"></a>
#### Foreign Key (FK) property

A foreign key (FK) property is a simple mapped property with a little extra information, a `RelatedNavigationProperty`. 

Get the property information as we did before:

    orderEntityType.GetProperty("CustomerID")

If you inspect the result of this expression in the watch window you will notice that:
 
- the `RelatedNavigationProperty` returns the `DataProperty` of the navigation property this FK supports; drill in and you'll see the `Customer` property.
- it has a special Breeze `DataType`, "Guid", which is stored as a JavaScript string; this is the data type of the related `Customer` entity's primary key. 
- it is scalar (i.e., returns a single value)
- it is optional (IsNullable)
- this property is not part of the key
- the name (on the client) matches the name on the server
