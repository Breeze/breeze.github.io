---
layout: doc-js
redirect_from: "/old/documentation/query-result-debugging.html"
---
# Debugging query result mysteries

What do you do when your Breeze query doesn't return the results you expected? 

In this topic, we'll assume you *actually got results* from the server but they aren't showing up as Breeze entities, at least not in the way you expected.

You know you got results when you set a breakpoint in your "success callback" and the debugger pauses there.

Make sure you open the browser's developer tools [F12] first and look at the network traffic. You should see the query request. Look at the JSON response. Do you see the data coming from the server? Is it the right data?

If not, stop. Figure out why the server isn't sending the right data before worrying about what BreezeJS is doing on the client.

If you're getting data, please keep reading and following the suggested diagnostic steps.

> If and when you become truly stuck, you'll want to submit a question in <a href="http://stackoverflow.com/questions/tagged/breeze?sort=newest" target="_blank" title="Breeze on StackOverflow">StackOverflow</a>. Before you do, please 
prepare a code sample that reproduces the problem as described below in "<a href="#query-debugging-tool">Exploring query results with Plunker</a>".


## I'm getting the right data from the server

Ok ... you see the data but some or all of the aren't showing up in the entity. One of the first things we do is examine the metadata for a one or more of your `EntityType`s starting with the root type of the query.

> Please <a href="/doc-js/metadata.html" title="Breeze Metadata"><b>learn about Breeze metadata</b></a> before continuing with this topic. It won't make much sense otherwise.</p>

Let's look at a query that returns an `Order`, its `OrderDetail`s, and its parent `Customer`.

    new EntityQuery("Orders")
      .take(1)                          // get the first order
      .expand("Customer, OrderDetails") // include customer and details
      .using(manager).execute()  
      .then(successHandler, failHandler);

We'll modify the `successHandler` to make our exploration easy.

    // modified for exploration
    function successHandler(data) {
        // get the MetadataStore from the query's manager
        var store = data.query.entityManager.metadataStore;

        // get the types of interest
        var orderType = store.getType('Order');
        var orderDetailType = store.getType('OrderDetail');
        var customerType = store.getType('Customer');

        // original successHandler code begins
        var order = data.results[0];
        
        // ... more code ... add breakpoint here.
    }

Run the code to the breakpoint. 

> We'll use the browser's debugger for this exercise

## Are the types defined?

Make sure each of the types - `orderType`, `orderDetailType`, and `customerType` - are defined. If any of them is null, you have found a problem.

Do you have any types at all? The following should return an array of types:

    store.getEntityTypes()

If it doesn't, stop and find out why. What types are present? The following expression will tell you:

    store.getEntityTypes().forEach(function(t) {console.log(t.name);})

Is your `EntityType` listed ... perhaps with a different spelling?

Figure out why your types are missing before continuing. This topic assumes you have types.

## Did the query return an entity?
We first want to know if the `order` in the result is an `Entity`. In the console window, try:

    order.entityAspect;   // should be the "Order" type

If the `entityAspect` is `undefined`, Breeze did not recognize the JSON data as an entity. 

Is the query a projection (does it have a `select` clause)? 

Projections generally do not return entities, they return raw data.

>Sometimes you can cast the projected data into an entity with the Breeze `toType()` clause. We didn't do that in this example.

    order.entityType;   // should be the "Order" type

If this returns a type other than `Order`, stop and figure out why you got an unexpected type. This topic assumes you got the expected type.

## Is the property defined?

Sometime you expected a property value and it didn't show up. Check if the missing property is among the type's `DataProperties`, the array of all "recognized" properties. 

    orderType.dataProperties.forEach(function (p) {console.log(p.name);})

>A property is "recognized" if it is registered in metadata in this `DataProperties` array. All of the different types of metadata properties - mapped, unmapped, and navigation properties - are in this array. 

Is your property listed? Is it spelled the way you expected it to be spelled? With the expected casing? If it's not listed, you've found a place to start digging (see the discussion of `NamingConvention` coming up next). 

Did you define this property in a custom "entity initializer"? Such properties are not registered in metadata and will not be recognized. Maybe you should make it an "unmapped" property by defining it in a custom entity constructor.

Do you still think this property should be in metadata? Was it supposed to be a "navigation property" - a property that returns another entity - or was it supposed to return a simple piece of data such as a string or number?

If it was supposed to return a simple data value, you'll have to work backward from here to the source of your metadata whether it was server-generated or you wrote it by hand. Something upstream either neglected to define the property or suppressed it's representation in metadata.

## Are you applying the expected *NamingConvention*?

In many applications the client-side spelling of a property name should be different than the server-side spelling. You'll see the server-side spelling in the JSON payload and in the `dataproperty.nameOnServer` where as the client-side spelling is reflected in the entity property name you see in the debugger and in the `dataproperty.name`.

The Breeze [**`NamingConvention`**](/doc-js/server-namingconvention.html "NamingConvention") translates between these two spellings. Are you sure that your metadata are governed by the `NamingConvention` you expect? You may *think* you are applying one convention when, in fact, a different convention is controlling the translation. See "[Beware of the baked-in NamingConvention](/doc-js/server-namingconvention.html#NamingConventionInMetadata)".

## Are you missing a navigation property?

You were expecting a "navigation property" - a property that returns another entity - and it wasn't listed among the `DataProperties`.

This is probably a metadata creation problem. If you wrote the [metadata by hand](/doc-js/metadata-by-hand.html#NavigationProperties), return to the "Navigation Properties" section of that topic and try to discover what you did differently.

Did you define **foreign key (FK) properties**? Developers often neglect to define or identify the FK properties. Breeze requires FK properties to implement navigation properties. 

>In some cases you can define navigation properties without FKs but Breeze will not be able to maintain those properties in cache.

The remainder of this topic assumes you found the expected `DataProperty`.

## Is it the expected kind of property?

What kind of property is it? What kind were you expecting? 

In the list below, find the kind of `DataProperty` that you were expecting and see if it aligns with what the debugger says about your property. 

<a href="#SimpleMapped">Simple mapped Property</a>

<a href="#SimpleUnapped">Simple unmapped Property</a>

<a href="#ComplexMapped">Complex mapped property</a>

<a href="#NavigationProperties">Navigation properties</a>

<a href="#ReferenceNavigation">Reference navigation property</a>

<a href="#CollectionNavigation">Collection navigation property</a>

<a href="#expand">When expand fails</a>

<a href="#ForeignKey">Foreign Key property</a>

If you still can't figure it out after following these links, <a href="http://stackoverflow.com/questions/tagged/breeze?sort=newest" title="Breeze StackOverflow" target="_blank">ask a question on StackOverflow</a> and please state what you learned from this metadata analysis.

<a name="SimpleMapped"></a>

#### Simple mapped property

	orderType.getProperty('OrderDate');

Here's what the browser says about the mapped property `Order.OrderDate` property (elided):

	dataType: EnumSymbol
		defaultValue: Mon Jan 01 1900 00:00:00 GMT-0800 ...
		isDate: true
		name: "DateTime"
	defaultValue: null
	isNullable: true
	isPartOfKey: false
	isScalar: true
	maxLength: null
	name: "OrderDate"
	nameOnServer: "OrderDate"
	validators: Array[1]

Notice that 

- it has a basic JavaScript data type ("DateTime") 
- it is scalar (i.e., returns a single value)
- it is optional (isNullable)
- this property is not part of the key
- the name (on the client) matches the name on the server
- it has a validator; drill in and you'll find a "DateTime" `DataType` validator.

<a name="SimpleUnmapped"></a>

#### Simple unmapped property

An "unmapped property" refers to a value that is not persisted in the remote data store. Because an unmapped property is not persisted, it isn't transmitted to the server and changes to  the property values have no effect on the entity's `EntityState`.

Unmapped properties often don't even exist on the server model object to which this entity corresponds. They are typically *created* on the client to hold values that are *meaningful on the client*. The client application assigns their values and the server knows nothing about them.

The value of an unmapped property *can come from the server* as when the server model calculates a value for the client that the client could not calculate for itself. Breeze copies the value from the JSON payload into the unmapped property when materializing query results. Just remember: changes to that value won't be sent back to the server.

See the ["Extending Entities" topic](/doc-js/extending-entities.html "Extending Entities") to learn how to create an unmapped property. If `Order` had an unmapped property called `isBeingEdited`, you could access it like this.

	orderType.getProperty('isBeingEdited');

The browser debugger might report something like this (elided):

	dataType: EnumSymbol
		defaultValue: false
		name: "Boolean"
	defaultValue: false
	isNullable: false
	isScalar: true
	isUnmapped: true
	name: "isBeingEdited"
	parentType: ctor
	validators: Array[1]

The distinguishing feature of this `DataProperty` is the `isUnmapped: true` property.

Notice that 

- it has an `isUnmapped` property
- it does **not** have 
	- `isPartOfKey`
	- `nameOnServer`

<a name="ComplexMapped"></a>

#### Complex mapped property

	orderType.getProperty('ShipTo');

Here's what the browser says about the complex mapped property `Order.ShipTo` property (elided):

	complexTypeName: "Location:#Northwind.Models"
	dataType: ctor
	defaultValue: null
	isComplexProperty: true
	isNullable: false
	isScalar: true
	name: "ShipTo"
	nameOnServer: "ShipTo"
	validators: Array[1]

Notice that 

- it announces itself as a "complexType"
- it has an `isComplexProperty` which is true 
- it is required because all complex properties are required
- it is scalar (i.e., returns a single value)
- the name (on the client) matches the name on the server
- it has a validator; drill in and you'll find a `required` validator.

<a name="NavigationProperties"></a>

#### Navigation properties

You can navigate from an entity to other related entities via *navigation properties* as in

    // these examples assume Knockout; omit "()" for angular
    Customer.Orders(); // child order entities
    Order.Customer();  // parent customer entity

These properties return entities from cache. If the related entities are not in cache, they'll return an empty array or null as appropriate for that property. 

>You can eagerly load the related entities into cache during a query with the [`.expand(...)` clause](/doc-js/query-examples.html#Eager%20loading%20%20EntityQuery.expand ""expand" documentation"). If this *expand*&nbsp; isn't working for you, see the "[When expand fails](#expand "When expand fails")" section below.

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

	orderType.getProperty('Customer');

The browser debugger reports (elided):

	associationName: "Order_Customer"
	entityType: ctor
	entityTypeName: "Customer:#Northwind.Models"
	foreignKeyNames: Array[1]
		0: "CustomerID"
		length: 1
	foreignKeyNamesOnServer: Array[1]
		0: "CustomerID"
		length: 1
	invForeignKeyNames: Array[0]
	invForeignKeyNamesOnServer: Array[0]
	inverse: ctor 
	isScalar: true
	name: "Customer"
	nameOnServer: "Customer"
    validators: Array[0]

Notice that 

- the `entityTypeName` is the definitive sign that this is a navigation property, a property that returns a `Customer`
- it is scalar (i.e., returns a single value) 
- the `foreignKeyNames` array tells us that
	- `Order` has one foreign key property for this association
	- `CustomerID` is the name of that FK property 
	- `Order` is in the "dependent" role because it has the FK
- the existence of an `inverse` constructor function means that there is an "inverse navigation" property from `Customer` back to `Order`. Drilling in would reveal that the name of that property is `Orders`
- the `associationName` links this `Order.Customer` property to the inverse `Customer.Orders` property.

Breeze does not require navigation properties for both sides of an association. The `inverse` navigation property is optional. The `associationName` could be omitted if there were no `inverse` navigation property.

<a name="CollectionNavigation"></a>

#### Collection navigation property

A "collection navigation property" returns an array of related entities, typically the "children" of this "parent" entity.

The "Order" is the parent of zero-to-many "OrderDetails" in this model.

Get the property information as we did before:

    orderType.getProperty('OrderDetails')

The browser debugger reports (elided):

	associationName: "OrderDetail_Order"
	entityType: ctor
	entityTypeName: "OrderDetail:#Northwind.Models"
	foreignKeyNames: Array[0]
	foreignKeyNamesOnServer: Array[0]
	invForeignKeyNames: Array[1]
	0: "OrderID"
	length: 1
	invForeignKeyNamesOnServer: Array[1]
	inverse: ctor
	isScalar: false
	name: "OrderDetails"
	nameOnServer: "OrderDetails"
	parentType: ctor
	validators: Array[0]

Notice that 

- the `entityTypeName` is the definitive sign that this is a navigation property, a property that returns `OrderDetail` entities
- it is an array property (`isScaler` is `false`) 
- the `foreignKeyNames` array length is zero; `Order` is in the "principal" role because it has no FKs
- the `invForeignKeyNames` array tells us that
	- the child `OrderDetail` type carries one foreign key property for this association
	- `OrderID` is the name of that FK property 
	- `OrderDetail` is in the "dependent" role because it has the FK 
- the existence of an `inverse` constructor function means that there is an "inverse navigation" property from `OrderDetail` back to `Order`. Drilling in would reveal that the name of that property is `Order`
- the `associationName` links this `Order.OrderDetails` property to the inverse `OrderDetail.Order` property.

Breeze does not require navigation properties for both sides of an association. The `inverse` navigation property is optional. 

It makes sense that `Order` has a collection navigation property that returns its child line items.

But it is quite common to omit the collection navigation property of an association when there is no good business reason to navigate in the direction of the children. For example a `Person` could have a `Person.Gender` reference navigation property. But it makes little sense to have a `Gender.Persons` collection navigation property because we don't expect (nor want) to navigate from, say, "Male" to all of the people who are male.

The `associationName` could be omitted if there were no `inverse` navigation property.

<a name="expand"></a>

#### When *.expand(...)*&nbsp; fails

One way to load related entities into cache is to add an [`.expand(...)` clause](query-examples#Eager%20loading%20%20EntityQuery.expand ""expand" documentation") to your query.

Did you add an `.expand(...)` clause to your query? Do you see the related entity data in the query result payload as in this example where `Bar` data is nested within the `Foo` data.

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

Go back to the section on "[Reference navigation properties](#ReferenceNavigation)". Bet the metadata for the property is missing the "foreignKeyNames" entry.

You'll want to add that `FooId` property to the `Bar` type defined in your server API. Then update the metadata for `Bar` (which is automatic if you've gone down the .NET EF development road).

<p class="note">Breeze associations require foreign keys.</p>

<p class="note">This point is frequently neglected and misunderstood. See, for example, <a href="http://stackoverflow.com/questions/20692463/issues-including-navigation-properties-in-query" target="_blank">this StackOverflow question</a> wherein the FK is omitted and the author is surprised by the results. The answer explores the symptoms and the resolution in greater detail.</p>

<a name="ForeignKey"></a>

#### Foreign Key (FK) property

A foreign key (FK) property is a simple mapped property with a little extra information, a `relatedNavigationProperty`. 

Get the property information as we did before:

    orderType.getProperty('CustomerID')

The browser debugger reports (elided):

	dataType: EnumSymbol
		defaultValue: "00000000-0000-0000-0000-000000000000"
		name: "Guid"
	defaultValue: null
	isNullable: true
	isPartOfKey: false
	isScalar: true
	maxLength: null
	name: "CustomerID"
	nameOnServer: "CustomerID"
	parentType: ctor
	relatedNavigationProperty: ctor
	validators: Array[1] 

Notice that 

- the `relatedNavigationProperty` returns the `DataProperty` of the navigation property this FK supports; drill in and you'll see the `Customer` property.
- it has a special Breeze `DataType`, "Guid", which is stored as a JavaScript string; this is the data type of the related `Customer` entity's primary key. 
- it is scalar (i.e., returns a single value)
- it is optional (isNullable)
- this property is not part of the key
- the name (on the client) matches the name on the server
- it has a validator; drill in and you'll find a "Guid" `DataType` validator.


<a name="query-debugging-tool"></a>

## Exploring query results with Plunker

If you still can't figure this out you'll want to <a href="http://stackoverflow.com/questions/tagged/breeze?sort=newest" target="_blank" title="Breeze on StackOverflow">submit a question in StackOverflow</a>.

You'll get a better answer if you can reproduce the problem in code we can all share. A good way to do that is with a **diagnostic** tool we've prepared as a *plunker*. 

**You won't have to give anyone access to your server or your real data**. 

Open a modern browser (*Chrome works well*) and <a href="http://plnkr.co/edit/6ADl0427WQ3fn5kbrZGN?p=info" target="_blank" title="Breeze query debugging on plunker"><strong>go to this plunker</strong></a>. Modify it by following the instructions provided to you there. Here's a summary of those instructions:

* capture the metadata sent to the browser and paste it in the tool

* capture the query results JSON response sent to the browser and paste that in the tool

* remove/obscure all sensitive values from the data.

* run the code ... and see what it does

When you've taken your sample as far as you can, **fork your modified version** of the plunker and **link to it in your StackOverflow question**.
