---
layout: doc-js
redirect_from: "/old/documentation/add-new-entity.html"
---
# Add a new entity

> The code snippets on this page are in the <a href="/doc-samples/about-todo.html">Breeze Todo Sample App</a>.
 
When the user enters a description in the big **Todo app** textbox and hits **Enter**, the screen's *ViewModel* calls the dataservice's `createTodo` method, passing along a hash of initial values that are partly derived from user input (the big textbox, the state of the 'Mark all completed' checkbox):

    function addItem() {
        var item = dataservice.createTodo({
            Description: vm.newTodo(),
            CreatedAt: new Date(),
            IsDone: vm.markAllCompleted()
        });
    
       // ... more
    }

The *initialValues* hash might be:

    {
        Description: 'Have fun',
        CreatedAt: new Date(),    
        IsDone: false
    }
    
The dataservice's `createTodo` method is simple:

    function createTodo(initialValues) {
        return manager.createEntity('TodoItem', initialValues);
    };

The `createTodo` delegates to the dataservice manager's `createEntity` method (see also '<a href="/doc-js/creating-entities.html">Creating entities</a>') , setting the name of the Todo `EntityType` and forwarding the initialValues.

> Be sure to use the `EntityType` name ('TodoItem') and not the query resource name ('Todos'). The name is case sensitive as well. The intialValues object is optional.
 
That's it. You're done. You're free to move on. But we suggest you linger a while. For that one small line does a lot of work. Under the hood it translates to something more long winded:

    function createTodo(initialValues) {
        var todoType = manager.metadataStore.getEntityType('TodoItem');
        var newTodo = todoType.createEntity(initialValues);
        return manager.addEntity(newTodo);
    };

This code creates a new Todo with the help of a `createEntity` factory method defined on an instance of **`EntityType`** (same method name; different Breeze component). Having created the new `TodoItem`, we immediately add it to a local cache using the EntityManager's `addEntity`  method; a new entity must be in cache before the manager can save it to remote storage [<a href="#note 1">1</a>].

This is real Breeze code and you could spell it out, step-by-step like this if you prefer. I wouldn't; I'd call `manager.createEntity` and get on with my day.

But there are important Breeze lessons to learn from this long-form of entity creation. There's clearly more involved here than simply *new'ing* up an object. It's worth sticking around for the explanation. Then use the shortcut in your daily code.

##	Entity type

Every entity instance has a type that you can access through its `entityType` property. The type of an entity is itself an object, an instance of the Breeze `EntityType`.

The `EntityType` is a container for metadata that describe a Breeze entity type. It knows about the type's constructor, validation rules, and properties; the detail about properties is wide ranging (check out the <a href="/doc-js/api-docs/classes/DataProperty.html">`DataProperty`</a> metadata object in the Breeze API docs). 

Perhaps most importantly, the `EntityType` knows how to create new instances of an entity type. We used that feature a moment ago when we called its `createEntity` method. We got hold of an EntityType object for TodoItems from the EntityManager's *metadatastore* with this line.

    var todoType = manager.metadataStore.getEntityType('TodoItem');</pre>

We could get metadata from the `EntityManager` for good reason: the `EntityManager` needs type information too. It needs type information to materialize entities out of raw data from the query result payload. You'll search the sample code in vain looking for the `TodoItem` definition in JavaScript. You won't find it. Nor will you find a component to translate between DTOs (data transfer objects) and entities; there is no `TodoItemDtoMapper` in this code base.

The `EntityType` is the mapper. The EntityType both defines and creates new Todos. There's an EntityType object to do the same for every other application entity managed by the Breeze client. All the `EntityType` objects are held in the manager's `MetadataStore`.

## Creating a Breeze entity
What happens when we call ...

    var newTodo = todoType.createEntity(initialValues);</pre>

We'll cover the fundamentals now and leave details and nuances for a later.
The `createEntity` first invokes a Breeze default parameterless constructor to make the new Todo object [<a href="#note 2">2</a>]. The new Todo has the following characteristics:

- a type, accessible from its `entityType` property.
- a key property
- an observable property for every simple data property defined for the type
- 	an observable array for every collection property (typically a navigation property)
- a Breeze entityAspect property for access to the breezy entity-ness inside.

We'll look at the properties first and examine the `entityAspect` later when we take up <a href="/doc-js/lap-changetracking.html">Breeze change tracking</a>.

## Property generation

The `createEntity` call builds a new entity instance based on metadata. The metadata are typically downloaded from the server. That's the easy approach adopted by the Todo Application. But it's not the only approach. You can define your own entity class or take a hybird approach and add properties of your own to the generated entity that the server knows nothing abou (you can learn about that in the <a href="/doc-js/metadata.html">'Metadata' topic</a>) ... but it's important to understand right away that you are always in command of of your entity definitions because you control the metadata that describe them.

Breeze constructs the new entity instance and extends it with properties defined in that metadata, whatever their source. Then if there's an initialValues object, Breeze sets the properties accordingly. This latter step should be obvious. Let's focus on the extended properties which bear closer inspection.

## The key property 

Every Breeze entity must have a primary key that uniquely identifies the entity across the system. The integer Id property is the TodoItem's key.

All entities of the same type with the same key value are conceptually the same thing. You can have several copies of 'the same entity'; in memory but only one of them can be in an EntityManager's cache; all entities in cache are unique.
A new entity needs a new key. It can't enter the cache without a unique key. It won't be saved without a unique key. The key value has to come from somewhere, either the client or the server.

The `EntityType` knows whether the client or the backend is ultimately responsible for setting the key's permanent value. If the backend is responsible and you add the entity to an `EntityManager`, the manager assigns the new entity a temporary key that is unique within that manager's key-space. For example, a newly added Todo gets a negative Id.
When the Todo is saved, the server updates the Id to a permanent positive integer before sending the saved Todo data back to the client. Upon receipt, the manager updates the local Todo's Id with the permanent value.

The options and mechanisms are more sophisticated than described here; you can read about them in <a href="/doc-js/saving-changes.html">another topic</a>.

##	Data vs Navigation Properties

Most entity properties are 'data' properties, properties providing access to simple data values such as the Todo description, whether the Todo is done, whether it's been archived, etc. Entities may also be related to each other. There's another kind of Breeze property, the 'navigation property' with which you hop&nbsp; from one entity to another related entity.

Navigation properties are a fundamental Breeze feature. We can't show them to you with the Todos App sample because the 'Todos' model only has one entity. There is no other entity to navigate to so it doesn't have foreign keys or navigation properties.
The app might grow up someday and support todos for different members of the family. 

Then each *Todo* would have a parent *Person* and each *Person* would have many child *Todo* entities. The *TodoItem* could have a `Todo.Owner` property that returned a single person. Each *Person* could have a `Person.Todos` property that returned zero-to-many todos.

To learn about navigation properties and foreign keys, see the <a href="/doc-js/navigation-properties.html">Navigation Properties topic</a>.

##	Observable Properties

A native JavaScript property is inherently inert; you can get and set a property but the property can't do anything when you do. It can't have an implementation so it can't have behaviors. We want our Breeze entity properties to have behaviors in support of a responsive user experience. The navigation property is one kind of property that demands an implementation.

Breeze property also needs an implementation to play well with the data binding frameworks that greatly simplify development and maintenance of interactive UIs.
There are two basic approaches to presenting data to users:

- write code to push values into HTML controls and pull changed values back out;
- 	bind controls to data properties and rely on the binding framework to move values back and forth automatically when either control or data values change.

A helpful <a href="http://weblogs.asp.net/dwahlin/archive/2012/07/27/The-JavaScript-Cheese-is-Moving_3A00_-Data_2D00_Oriented-vs.-Control_2D00_Oriented-Programming.aspx">article by Dan Wahlin</a> describes and compares these rival techniques. He makes a pretty good case for data binding ... and we agree
If you still prefer the push/pull, control-oriented style, you can use Breeze entity properties that way. True, plain old JavaScript properties would have been fine; but Breeze properties won't get in your way.

If you prefer data binding, the entity data properties must be implemented in a way that supports that style. They have to raise property-changed events when their data change and the data binding framework you choose must be able to hear those events in order to update the screen. In other words, the properties must be 'observable' by the data binding framework.

Breeze entities are observable properties. They're designed to be observable by a wide range of model libraries. As it happens, the Todo sample was built for UI data binding with <a href="http://knockoutjs.com/">Knockout</a>, a popular data binding library that we'll explore in the **<a href="/doc-js/lap-knockout.html">next topic</a>**.

## Notes

<a name="note 1"></a>[1] A typical application works almost exclusively with entities in an EntityManager cache in order to leverage the manager's capabilities.Entities can exist outside of a cache in a 'detached' state. Learn about that later in this documentation. As a general rule, you want to work with entities that are in an EntityManager cache in order to take advantage of facilities that an EntityManager provides. For example, an entity must be in cache before it can be saved to the persistence service.

<a name="note 2"></a>[2] You can register an alternative parameterless constructor of your own with <a href="/doc-js/metadata.html">MetadataStore.registerEntityTypeCtor</a>.

<a name="note 3"></a>[3] We showed you how the Todo app pours entities into an `items` array when we introduced you to your <a href="/doc-js/lap-first-query.html">first Breeze query</a>. We also noted there that the app is configured (by default) to support Knockout data binding. Accordingly, when the Todo data arrived from the persistence service, Breeze merged those data into Todo objects that it built with Knockout observable properties.
