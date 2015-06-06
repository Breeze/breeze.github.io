---
layout: doc-js
---
# Model Library
Breeze JS applications typically rely on some 3rd party library to display entity values in HTML and update entity values from user input entered through HTML controls. Breeze refers to these as "**model libraries**".

Popular model libraries include [Angular](https://angular.io/), [Aurelia](http://aurelia.io/), [Backbone](http://backbonejs.org/), [Ember](http://emberjs.com/), [Knockout](http://knockoutjs.com/), and [React](https://facebook.github.io/react/). 

Each library has its own approach to constructing the HTML and wiring that HTML to the model objects that Breeze calls "entities" such that data can flow to and from the HTML without the developer's direct intervention.

Each library expects to get and set model values in its own way. Some libraries (Angular, Aurelia, React) get and set values through the model object's own properties. Other libraries (Backbone, Ember, Knockout) get and set values through special "property accessor and mutator" functions.

These differences mean that there is no universal way for Breeze to create an entity. When Breeze creates an entity, as it does when you call `createEntity` or when materializing query results, it has to adapt each entity instance to the requirements of the model library you've chosen for your application.

Enter the Breeze "Model Library Adapter". 

# Model Library Adapter

The "Model Library Adapter" helps Breeze create an entity that conforms to your chosen model library.

Breeze has three adapters at the moment; their names are:

1. "[backingStore](#backingStore)" - for model libraries that get and set model object properties (Angular, Aurelia, React)
1. "[backbone](#backbone)" - for the Backbone model library
1. "[ko"](#ko)" - for the Knockout model library

>There is no adapter for Ember at this time. It's on the road-map although, as an open source project, we'd welcome an adapter contributed by you.

### All adapters
All Model Library Adapters are different. But some things are true for all of them.

The default Model Library Adapter may be just right for your application. Whether it is or isn't, you can always **specify your choice of Model Library Adapter explicitly** with the following statement that simultaneously chooses and initializes the adapter:

    breeze.config.initializeAdapterInstance('modelLibrary', <adapter-name>, true);

The "adapter-name" is likely to be one of the three names listed above.  If you were choosing the "backingStore", you'd write:

    breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);

If you specify a Model Library Adapter, you must do so ***before* fetching or creating any metadata**. If you create a [`MetadataStore`](/doc-js/metadata) first, it will be configured for the ambient Model Library Adapter which may not be the one you want.

For any given application, there can be **one and only one *active* Model Library Adapter**. The application can't switch Model Library Adapters. You can't have one entity model configured for Knockout and another entity model configured for Angular ... not in the same application. Think of the active Model Library Adapter as a static Breeze service.

>We do switch adapters in our tests; you can see that in the <a href="https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode/tests/entityExtensionTests.js" target="_blank">entityExtensionTests.js</a> of our DocCode sample. But this isn't something you should be doing.

While every Model Library Adapter defines its own way to get and set entity values, Breeze provides a common, **method-based approach for getting and setting values** (`getProperty` and `setProperty`) that is available regardless of the adapter you choose. For example, the following always works

    customer.setProperty('name', 'Acme');        // set the 'name' property
    var custName = customer.getProperty('name'); // get the 'name' property

These methods makes it easy to write tests of Breeze functionality without worrying about which Model Library Adapter is currently in play.

Now let's look at the three adapters shipped with Breeze.

### <a name="backingStore"></a>"backingStore"

Use the "backingStore" adapter when your model library expects to get and set model object properties directly, e.g.

    customer.name = 'Acme';       // set the 'name' property
    var custName = customer.name; // get the 'name' property

This is the right adapter choice for Angular, Aurelia, and React. 

>The [breeze-angular bridge](/doc-js/breeze-angular) selects this adapter for you automatically while also configuring Breeze to use other Angular components.

**The "backingStore" adapter is the default adapter** (but see the ["ko" exception](#ko) below) so you don't have to choose it explicitly. But you can be explicit if you wish by executing the following statement *before* defining a `MetadataStore`.

    breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);

The "backingStore" adapter implements all entity data and navigation properties as <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty" target="_blank">defined properties</a> with getters and setters. That means you can **only use the "backingStore" adapter with modern browsers**.

>The referenced page lists <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty/#Browser_compatibility" target="_blank">compatible browsers and versions</a>. Note that **IE8** does not support defined properties and **is incompatible with the "backingStore"** adapter.

### <a name="ko"></a>"ko" (Knockout / Durandal)

Knockout ("ko") is a popular library for databinding views to observable objects.  The [Durandal](http://durandaljs.com/) framework incorporates Knockout.
 
Knockout can databind one-way to model object properties. But if you want **two-way databinding** with Knockout - and most apps do - the entity must expose **observable properties**.

Knockout observable properties are actually methods (functions) with same names as their corresponding `EntityType` properties.

    customer('name', 'Acme');        // set the 'name' property
    var custName = customer('name'); // get the 'name' property

    var orders = customer('orders'); // get the observable array of customer orders

The "ko" Model Library Adapter creates new Breeze entities with observable property methods for each data and navigation property defined in the `EntityType`.

Breeze automatically chooses the "ko" Model Library Adapter for you **when it detects that you've loaded the "knockout" library**. You may prefer to choose it explicitly by executing the following statement *before* defining a `MetadataStore`.

    breeze.config.initializeAdapterInstance('modelLibrary', 'ko', true);

### <a name="backbone"></a>"backbone"

Backbone is another popular JavaScript application library. It binds views to objects that inherit from `Backbone.Model`. 

Such objects expose **two observable property methods**, `get` and `set` that are used as follows:

    customer.set('name', 'Acme');        // set the 'name' property
    var custName = customer.get('name'); // get the 'name' property

The "backbone" Model Library Adapter creates new Breeze entities that inherit from `Backbone.Model` and expose the backbone `get` and `set` methods. 

The backbone developer must choose this adapter explicitly by executing the following statement *before* defining a `MetadataStore`.

    breeze.config.initializeAdapterInstance('modelLibrary', 'backbone', true);

## <a name="create-entity"></a>Creating an entity 

The Model Library Adapter plays an important part in creating an entity object. Clearly, if a model library requires specialized functions to access and mutate entity values, Breeze must add those functions to the model object. But there is plenty more to do even if the model library gets and sets data properties directly.

A Breeze entity object is more than its data values. It has navigation properties to reach related entities. It has an [`entityAspect`](/doc-js/inside-entity.html/#entityaspect) that encapsulates certain "entity-ness" features of the object related to persistence and validation. 

And a Breeze entity monitors property-level changes. The data and navigation properties identified in [metadata](/doc-js/metadata) are "tracked" which means Breeze detects when you change a property value and takes one or more actions such as:

* raise an `entityAspect.propertyChanged` event for that property
* record the pre-change value in `entityAspect.originalValues`
* flip the `entityAspect.entityState` from "Unchanged" to "Modified"

Change tracking is not something that comes naturally to a JavaScript object. Breeze has to wire change tracking into the mechanism for setting entity values. If the model library sets a value through a mutating function, the Model Library Adapter wraps change tracking functionality around that function. If the model library talks directly to entity properties, the Model Library Adapter (most likely the "backingStore" adapter) re-writes each property as an <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty" target="_blank">ECMAScript 5 defined property</a> with a getter and setter.

## Model Library Adapter Interface

Writing a Model Library Adapter is an advanced task. If you'd like to write your own, you should first review the current adapters in the <a href="https://github.com/Breeze/breeze.js/tree/master/src" target="_blank">github source</a>. The adapter source file names include the phrase "breeze.modelLibrary".

Model Library Adapters implement five public members.

* `name` - the name of the adapter, e.g., "backingStore". Specify this name when choosing this adapter for your app.

* `initialize` - Initializes the adapter itself; called prior to first use.

* `getTrackablePropertyNames` - Gets the names of the properties of an `EntityType` that will be monitored for changes.

* `initializeEntityPrototype` - Configure an entity prototype that Breeze will use to create new instances of an `EntityType` for this model library.

* `startTracking` - Configures a new entity instance with the properties and/or methods that implement tracked access to the data and navigation "properties". Called when creating a new entity - more specifically, when creating the `EntityAspect` for a new entity - either via the `createEntity` method or during materialization of entity data in a query response.
