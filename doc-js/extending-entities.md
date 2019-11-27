---
layout: doc-js
redirect_from: "/old/documentation/extending-entities.html"
---
# Extending Entities

While Breeze can create an entity based exclusively on its metadata description, you can add additional properties and behaviors as needed to support client-side requirements. For example, you may want to add a method that is useful when presenting data to the user. This topic explains how to extend the entity definition with members that are not defined in metadata.

Most of the topic examples are based on tests in the <a href="https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode/tests/entityExtensionTests.js" target="_blank">**entityExtensionTests**</a> module of <a href="/doc-samples/doccode" target="_blank">DocCode</a>.

# Brute force extension

Breeze entities are created by calling the `EntityManager.createEntity` method or they are materialized as a result of an `EntityQuery` or `EntityManager.importEntities`. Let's stick with `createEntity` for the moment.

    var cust = manager.createEntity('Customer');

Internally that method first acquires an <a href="/doc-js/api-docs/classes/EntityType.html" target="_blank">EntityType</a> information object from a <a href="/doc-js/api-docs/classes/MetadataStore.html" target="_blank">MetadataStore</a> and then calls the type's `createEntity` method [<a href="#Note01">1</a>], e.g.,

    // assume that manager's metadata was previously fetched from the server
    var store = manager.metadataStore;
    var customerType = store.getEntityType('Customer');
    var cust = customerType.createEntity();


Now suppose that, in our client application, we want every `Customer` to have an `isBeingEdited` property. This is a client-side-only property; it is completely unknown on the server and it's not in the metadata we got from the server. 

Because this is JavaScript, we can extend a customer object simply by patching it with the new property:

    // AngularJS or Aurelia:
    cust.isBeingEdited = false;

    // Knockout observable (because we'll bind to it):
    cust.isBeingEdited = ko.observable(false);

That's not so bad. We'll probably do this a few more times so we encapsulate all of this plumbing into a `customerFactory` method.

Unfortunately, that only covers the entity creation use case. Breeze also ***materializes*** entities from query results. Consider this query:

    var query = breeze.EntityQuery.for('Customers')
                      .expand('Orders').where(...);

When executed, the query will return `Customer` entities that may or may not already be in the client cache. We can't use the `customerFactory` - it's only good for creating new entities. So we post-process the materialized `Customer` entities in the query callback:


    manager.executeQuery(query)
      .then(function (data) {
        var customers = data.results;
        customers.forEach(function (c) {
            if (c.isBeingEdited === undefined) { 
                c.isBeingEdited = ko.observable(false); }
        });
      })
      .catch(handleFail);

Notice that I had to check for the presence of the `isBeingEdited` property. A customer in the query-results set may already be in cache in which case it already has the `isBeingEdited` property.

How about the related orders that accompanied the customers in the payload thanks to the "*expand*" clause? We'll have to extend them in the callback logic too.

What if we materialize customers and orders by **importing** them into the manager (see the [Export/Import](/doc-js/export-import) topic). Fortunately, Breeze raises events when entities are imported and we can add event handlers that patch in the `isBeingEdited` property.

All of this entity patching is turning into a mess. Imagine trying to patch every entity after every query and import, wherever it occurs in the application.

It isn't *just* a mess. It feels wrong. The `isBeingEdited` property should be part of the `Customer` definition, not something we tack on as an afterthought. We should be able to make it part of the `Customer` definition ... and we can.

# Extend the Type

We'll extend the `Customer` definition by adding information to the `Customer`'s <a href="/doc-js/api-docs/classes/EntityType.html" target="_blank">*EntityType*</a> in the client-side `MetadataStore`.  We'll do this early in the application, before it makes a single call to the backend service.

We can get a `MetadataStore` from an `EntityManager` instance [<a href="#Note02">2</a>] like so:

    var serviceName = '...'; // route to Web API controller such as 'breeze/todos/'
    var manager = new breeze.EntityManager(serviceName);
    var store = manager.metadataStore;

Now we have a *store* variable that holds the canonical `MetadataStore` for our application. It's empty at the moment. We'll fill it in as we go.

# Custom constructors

A natural place to extend an entity definition is in its constructor. We generally don't need a constructor; Breeze can use its own default constructor to make instances of any entity type. But we can define our own custom constructor if we wish and it's probably a good idea to do so for our `isBeingEdited` property example. Let's write that constructor.

    function Customer() {
        this.isBeingEdited = false;
    }

We defined our new property as a simple field even though we could be using Knockout.  Two-way bindable KO properties must be observable. Don't worry, Breeze will transform it later into the kind of property that is appropriate to the prevailing model library. If we're using Knockout, it will become a KO observable.

Notice that we only defined this one extension property. We didn't mention the other `Customer` properties because we know that Breeze will supply them later ... once it learns about them from server-supplied metadata [<a href="#Note03">3</a>].

Next, we must register our custom constructor with the application's `MetadataStore` before the application either queries for customers or creates a new `Customer`. Any customers created or materialized before we register will not benefit from our new constructor.

Ideally, we register immediately after defining the `MetadataStore`, e.g.,

    // we defined the 'store' above
    store.registerEntityTypeCtor('Customer', Customer);

Now we can query for customers:

    var query = breeze.EntityQuery.for('Customers');

    manager.executeQuery(query)
      .then(function (data) {
          var customers = data.results;
          customers.forEach(function (customer) {
              // assume Knockout
              if (customer.isBeingEdited() === false) {/* ... */}
          });
      })
      .catch(handleFail);

Because this is the manager's first service request. Breeze implicitly fetches the metadata from the service and blends it with the type information in the manager's `MetadataStore`. The queried customer data are materialized as `Customer` entities each with the full complement of mapped data properties (e.g, `Name`) and with the custom `isBeingEdited` property.

Now that the manager's `MetadataStore` is fully populated, we are ready to create a `Customer` in the manner typical of a Breeze application [<a href="#Note04">4</a>].

    var customerType = manager.metadataStore.getEntityType('Customer');
    var cust = customerType.createEntity();

    // it's now a KO property with the default value (false) assigned in the constructor
    var isEditing = cust.isBeingEdited();
    var name = cust.CompanyName(); // Also fine.

## *Don't "new" a custom constructor*

> We strongly recommend that you do not call an entity constructor function directly. This section explains why. Use one of the two Breeze factory functions instead, either `EntityManager.CreateEntity()` or `EntityType.CreateEntity()`.

The `Customer` function is a valid JavaScript constructor; it is perfectly legal to write:

    var cust = new Customer();
    var isEditing = cust.isBeingEdited(); // assume Knockout

It's legal ... but `cust` isn't a full-fledged entity yet. This next line will fail.

    var name = cust.CompanyName(); // ERROR! CompanyName is undefined

It's going to fail at runtime because `CompanyName` hasn't been defined yet.

Recall that our constructor only defined the `isBeingEdited` property. The other `Customer` properties are unknown at this time.

The `cust` object won't be usable until we add it to the `EntityManager`.

    manager.addEntity(cust);
    var isEditing = cust.isBeingEdited();
    var name = cust.CompanyName(); // CompanyName is now defined.
    
The act of adding the entity to the manager causes Breeze to

* Add all properties defined in metadata for this entity
* Rewrite fields to suit the prevailing model library [<a href="#Note03">3</a>].
* Add <a href="/doc-js/inside-entity">entityAspect</a> and the change tracking that goes with it.
* Execute the post-construction initializer (if one is defined).

The `EntityType.CreateEntity()` factory function does all of all of this for you too ... without adding the entity instance to the manager. But we like the `EntityManager.CreateEntity()` approach even better. 

We think the `new Customer()` syntax leads to confusion. Avoid it.

## *Whither the unmapped property value?*

The `isBeingEdited` property is only a property on the client-side `Customer` entity. The "Customer" class on the server does not have an `isBeingEdited` property and the backing database does not have an *isBeingEdited* column in the "Customer" table either.

Breeze detects this fact. It adds the `isBeingEdited` property to the `Customer` metadata as an **unmapped** property. When saving entity changes, Breeze may transmit the values of unmapped properties to the server (which might be interested in them) but in a way that the server can easily ignore.

If you look in the network traffic for the entity within the `saveChanges` payload, you may see something like this:

    {"Id": 42, "Name": "Acme Corp","__unmapped":{"isBeingEdited":false},...}

Importantly, unmapped property values are **serialized when you export** entities and they are deserialized when you **import** them later (perhaps into a different `EntityManager`). 

That's important for mobile applications which need to preserve the local state of cached entities when the application is deactivated (AKA, "<a href="http://msdn.microsoft.com/en-us/magazine/hh148153.aspx" target="_blank">tombstoned</a>"). Your deactivation logic may call `manager.exportEntities()` and write the serialized entity data to local storage. 

If it does, you probably want the serialized `Customer` to retain the state of unmapped properties and restore that state when you reactivate the application and re-import the `Customer`. Breeze will do that automatically.

>If you ***do not*** want Breeze to remember the state of this property, you should ***not*** define it in the constructor. You may prefer to define it in a post-construction initializer, a feature described later in this topic.

## *Add methods to the constructor*

You can extend an entity with methods as well as properties. The methods could be instance methods or methods defined on the prototype. Here's a frivolous example of the more typical prototype method:

    function Customer() {/* ... */}

    Customer.prototype.sayHi = function () {
        return 'Hi, my name is ' + this.CompanyName();
    };

    store.registerEntityTypeCtor('Customer', Customer);

    var customerType = store.getEntityType('Customer');
    var cust = customerType.createEntity({CompanyName: 'Acme');
    var hi = cust.sayHi() // 'Hi, my name is Acme'


# The post-construction initializer

If you need to perform some action after an entity has been created or materialized, you can register that action as **post-construction initializer**.

Suppose we want the `isBeingEdited` property but we don't want Breeze to serialize it locally. If we have to restore a deactivated `Customer`, we want this property to be false regardless of its prior state.

Instead of defining it in the constructor, we define it in an **initializer**.

    var customerInitializer = function(customer) {
        customer.isBeingEdited = ko.observable(false);
    };

    store.registerEntityTypeCtor('Customer', null, customerInitializer);

Now we can create a `Customer` as we did before.

    var customerType = store.getEntityType('Customer');
    var cust = customerType.createEntity();

    // KO data property with value (false) assigned in the constructor
    var isEditing = cust.isBeingEdited(); // still works
    var name = cust.CompanyName(); // Also fine.

The customer object appears to be the same as it was when we used the constructor. But there is an important difference: **the `isBeingEdited` property is no longer recorded in the metadata as an *unmapped property***. 

In fact, **the `Customer` metadata have no record of this property**. Breeze won't track it, won't notify you when the property value changes, won't validate it, and won't serialize it. 

Notice that we coded `isBeingEdited` as a KO observable. Had we coded it as a field, it would still be a field. Breeze does not re-write properties that you add to an instance with an initializer. A KO bound control would not be updated when its value changed. 

>We are using Knockout in this example and we want two-way binding for this property. Therefore, we must define it as an observable. It can stay a field if we're using AngularJS for model binding.

The post-construction initializer is particularly useful when you must respond to materialized values after a query or import. Here's an example:

    function creatureInitializer(creature) {
        if (creature.Name() === 'Godzilla') {
            app.MessageBus.publish('Alarm',
             'Run! Godzilla is here!');
        };
    }

## *Register both constructor and initializer*

You can register both a custom constructor and an initializer at the same time:

    function Customer() { ... }
    function customerInitializer(customer) { ... }

    store.registerEntityTypeCtor('Customer', Customer, customerInitializer);

# Entity creation sequence

Suppose you've got a custom constructor and a custom initializer function and you create a new entity with an initial values hash object like so:

    new customer = manager.createEntity('Customer', { Name: 'Acme' });

What is the order of events? The answer is illustrated in the *'createEntity sequence ...*' test in the <a href="https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode/tests/entityExtensionTests.js" target="_blank">**entityExtensionTests**</a> module of <a href="/doc-samples/doccode" target="_blank">DocCode</a>.

1. custom constructor
1. initial values ('Acme')
1. initializer function
1. add to manager

When Breeze materialize an object through query or entity import, the sequence is

1. constructor
1. initializer function
1. merge into cache

# Camel Case properties

The entity property names on the client exactly match the spelling of the corresponding property names on the server. That's the default Breeze behavior.

You can change it. For example, you can switch to camel casing ("FirstName" on the server becomes "firstName" on the client) in a single line of configuration:

    NamingConvention.camelCase.setAsDefault();

You can create your own conventions as well. Learn more in the [NamingConvention](/doc-js/server-namingconvention) topic.

# Temporary key generation

When the entity key (typically an ID) is determined on the server we say that it is "store generated." We won't know the permanent key value of a new entity until it is saved successfully. Until then, new entity keys must have temporary values.

Not just any values either. All entities in cache must have unique keys. That means the temporary values must be unique within a cache and they cannot collide with "real" key values coming from the server.

Breeze ships with a default temporary key generator, `breeze.KeyGenerator`. This is perfectly adequate for most models. But occasionally a legacy model comes along with unique key generation requirements.

Fortunately, you can create a custom key generator and register it with an `EntityManager` before adding entities to that manager. Make sure your generator can create unique keys for any entity type that needs a temporary key value. The basic structure of a key generator is as follows:

    manager.setProperties({ keyGeneratorCtor: myKeyGenerator });

    function myKeyGenerator() {
        this.generateTempKeyValue = function (entityType) {
            /* logic here */
            return nextId;
      };

The **entityExtensionTests** module in the DocCode <a href="/doc-samples/doccode">Teaching Tests</a> has a simple example. The Breeze `breeze.KeyGenerator` is the best source of inspiration.

<a name="es5-property"></a>

# ECMAScript 5 Defined Properties

Modern browsers - those whose JavaScript engines support ECMAScript 5 (ES5) or later -
can define Object properties with getters and setters. These properties look like the "properties" of earlier JavaScript versions.

    var bob = new Person();
    foo.age = 42;               // an ES5 property
    bob.firstName = 'Bob';      // not an ES5 property 
    console.log(bob.age);       // 42
    console.log(bob.firstName); // 'Bob'


But they have different implementations and different consequences. Here's the how we might have defined `Person`.

    function Person() {
        this.backingFields = {
            _age: 0   // default
        };
    	this.firstName = ''; 
   	    this.lastName  = ''; 
    }

    // Define the ES5 property on the prototype
    // it stores the value inside the instance's backingFields
    Object.defineProperty(Person.prototype, 'age', {
        enumerable:   true,
        configurable: true,
        get: function() {return this.backingFields._age;},
        set: function(value) {
            if (value !== this.backingFields._age) {
                alert("Foo age changed to "+ value);
                this.backingFields._age = value;
            }
		}
    });

Now when you set `bob.age == 42` in a browser, you'll see a message about the change in an alert box.

Defined properties are particularly convenient when you want to build behavior into setters ... behavior such as change tracking, change notification, and property validation.

>Breeze relies on ES5 defined properties when you choose to build your application with AngularJS or Aurelia and select the "backingStore" model library ... for precisely these reasons.

They are also good for calculated properties in AngularJS apps. Here's a `fullName` read-only property that AngularJS can watch.

    Object.defineProperty(Person.prototype, 'fullName', {
        enumerable:   true,
        configurable: true,
        get: function() {return this.firstName + ' ' +  this.lastName;}
        // no setter
    });

    var sally = new Person();
    sally.firstName = 'Sally';
    sally.lastName = 'Jones';

    sally.fullName; // Sally Jones

    // user changes 'Sally' to 'Betsy' via textbox
    // angular binding reinvokes sally.fullname
    sally.fullName; // Betsy Jones


## *"enumerable" and "configurable"*

If you're writing an AngularJS application and you are extending a Breeze entity constructor with an unmapped ES5 defined property **you must set `enumerable: true` and `configurable: true`**.

You want Breeze to watch these properties. You want Breeze to validate and serialize these properties. To do that, Breeze must *discover and wrap* them with behavior to perform these tasks. It can't find them without `enumerable: true`. It can't wrap them without `configurable: true`.

## *More about defined properties*

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty" target="_blank" title="Defined properties">Learn more about ES5 properties</a> on the web. 

> These techniques only work in ES5+ browsers. The <code>Object.DefineProperty</code> feature cannot be shimmed (aka, "polyfilled") into older browsers. Some browsers, such as IE8, appear to support ES5 defined properties but actually don't.

<a name="ko-computeds"></a>

# Knockout computed properties

<a href="http://knockoutjs.com/documentation/computedObservables.html" target="_blank">Knockout computeds</a> are observable functions that return new values when one (or more) of their dependent observable properties change.

<a name="add-computed-to-initializer"></a>

## *Add Knockout computeds to the initializer*

The initializer is an ideal place to define them. 

Suppose we want to add a `fullName` computed property to the Northwind **<code>Employee</code>** type that combines the `FirstName` and the `LastName`. The `fullName` should be recomputed and re-displayed when either the first or last name changes.

Here is a computed `fullName` property in an initializer:

    function employeeInitializer(employee) {
        employee.fullName = ko.computed(function () {
            return employee.FirstName() + ' ' + employee.LastName();
        });
    }

    store.registerEntityTypeCtor('Employee', null, employeeInitializer);

## *Adding Knockout computeds to the constructor*

You might have thought to define the `fullName` in the custom constructor.

We recommend that you don't. You'll almost always prefer to add KO computed properties to an initializer instead of the constructor. 

Nonetheless, it can be done and we'll show you how in case you have a good reason to do so.

Your first attempt might be something like this:

    function Employee () {
        this.fullName = ko.computed(
            function () {
                return this.FirstName() + ' ' + this.LastName();
            }, this);
    }

    store.registerEntityTypeCtor('Employee', Employee);

    var employeeType = store.getEntityType('Employee');
    var emp= employeeType.createEntity({
        FirstName: 'John',
        LastName: 'Doe'
    });
    var name = emp.fullName(); // 'John Doe'

This will not turn out well. The moment you create an `Employee` you'll get an error complaining that "*the object doesn't support property or method 'FirstName'*."

This `FirstName` property is defined for the `Employee` **EntityType**. But the property doesn't exist yet on the instance returned by the constructor. Check again to confirm that the only "property" defined in the constructor is "fullName". The new instance has no `FirstName` property. 

The `FirstName` property won't exist until the Breeze `createEntity` method adds it (and `LastName` and all of the other properties defined in metadata) to the instance. 

Sadly, Knockout doesn't give Breeze time to add these properties. KO executes the `fullName` function immediately, within the `Employee` constructor function. Of course it fails.

There is an alternative syntax for defining a computed property that delays Knockout's invocation of the `fullName` observable function:

    function Employee () {
        this.fullName = ko.computed({
            read: function () {
                return this.FirstName() + ' ' + this.LastName();
            },
            // required because FirstName and LastName not yet defined
            deferEvaluation: true

        }, this);
    }

The `deferEvaluation: true` tells Knockout to wait.

## *Defining Knockout mapped properties in the constructor*

In our constructor examples we have only defined extended properties and methods. There is rarely reason to define properties that are already described in metadata. 

But you can if you want to and maybe we *want to* do so to simplify the `fullName` computed and avoid the `deferEvaluation: true` syntax:

    function Employee() {
        this.FirstName = ko.observable(''); // default FirstName
        this.LastName  = ko.observable('');  // default LastName
        this.fullName  = ko.computed(
                function () {
                    return this.FirstName() + ' ' + this.LastName();
                }, this);
    }

    store.registerEntityTypeCtor('Employee', Employee);

>We didn't define *all* of the `Employee` properties, just the two involved in the `fullName` computed property.

Now Knockout can execute the `fullName` computed property immediately upon construction because the `FirstName` and the `LastName` properties on which it depends are defined in the constructor. 

By the way, There is no harm in defining the `FirstName` and the `LastName` properties within the constructor. Breeze recognizes that they are actually mapped to data properties on the server. Their values will be sent with service data during materialization and changed values will be sent to the server during a save. 

# Notes:

<a name="Note01"></a>[1] In this topic we assume that we're getting most of our metadata from the server via a Breeze Web API controller and that the application should create entities suitable for data binding with <a href="http://knockoutjs.com/documentation/observables.html" target="_blank">**Knockout**</a> (KO). These are the Breeze *dataService* and *modelLibrary* configuration defaults. Learn about alternative Breeze configuration elsewhere in this documentation.

<a name="Note02"></a>[2] Here we acquire the canonical application `MetadataStore` from a single `EntityManager` instance. What if our application needs multiple *EntityManagers*? We'd want them all to share the same `MetadataStore`. No problem. First we create the common store

    var serviceName = '...'; // the service endpoint e.g., 'breeze/todos/'
    var store = new breeze.MetadataStore(); // define metadataStore for all managers

The we create an `EntityManager` factory method to create new instances that share the common *store* ... and our extensions to it.

    function createManager() {
        return new breeze.EntityManager({
            serviceName:   serviceName, 
            metadataStore: store
    })

    var em1 = createManager();

    // ... later in the application ...
    // a new, empty manager with the same metadataStore
    var em2 = createManager();

There's another way too. Suppose you've created and configured a manager and you want to create another one *just like it* with the same store and other configuration settings. Use the `EntityManager.createEmptyCopy` method.

    var em1 = new breeze.EntityManager({
                serviceName:   serviceName, 
                metadataStore: store
    });

    // ... later in the application ...
    // a new, empty manager with the same configuration including the store
    var em2 = em1.createEmptyCopy();

<a name="Note03"></a>[3] You don't *have* to mention properties that are already defined in metadata coming from the service. But it's harmless if you do.

    function Customer() {
        this.isBeingEdited = ko.observable(false);
        this.CompanyName = ko.observable('your-default-name');
    }

Here we define the `CompanyName` which is a data property mapped to the [CompanyName] column of the [Customer] table in the database on the server. We also specified a value for the `CompanyName` property. This is the default value that Breeze assigns to `CompanyName` when you create a new `Customer` instance.

<a name="Note04"></a>[4] In this example we are taking advantage of the fact that Breeze fetched metadata from the server ***implicitly*** when we queried for customers. Most applications query the server for *something* before they do much of anything else ... and any query will trigger metadata retrieval. 

However, if your application might consume metadata before the first query - for example if it might create a new `Customer` - , you should first fetch the metadata explicitly yourself. Here's an example:

    manager.fetchMetadata()
           .then(startTheApp)
           .catch(terminateImmediately);
