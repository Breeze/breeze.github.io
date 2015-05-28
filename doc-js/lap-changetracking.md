---
layout: doc-js
redirect_from: "/old/documentation/change-tracking.html"
---

#Change tracking

Breeze entities are "self-tracking" which means that each entity instance keeps track of its own changed state ... and much more. At the heart of every Breeze entity is a nugget of "entity-ness", its `EntityAspect`. You access it by calling `theEntity.entityAspect.`

A full discussion of `EntityAspect` awaits you in a [later topic](/doc-js/inside-entity). For now, we scratch the surface with an introduction to three prominent `EntityAspect` members that concern change tracking:

1. `entityState` - a property that reveals the entity's change-state
1. `propertyChanged` - an event raised when any entity property changes
1. `validationErrorsChanged` - an event raised after applying validation rules.

> Many of the code snippets on this page are in the <a href="/doc-samples/about-todo">Breeze Todo Sample App</a>.

##EntityState

A Breeze entity is "self-tracking".  Its `entityAspect.entityState` tells you if it is

<table border="0" cellpadding="0" cellspacing="0">
	<tbody>
		<tr>
			<td style="width:121px;">
			**"Added"**
			</td>
			<td style="width:498px;">
			A new entity in cache that does not exist in the backend database
			</td>
		</tr>
		<tr>
			<td style="width:121px;">
			**"Unchanged"**
			</td>
			<td style="width:498px;">
			An existing entity in cache that was queried from the database
			</td>
		</tr>
		<tr>
			<td style="width:121px;">
			**"Modified"**
			</td>
			<td style="width:498px;">
			An existing entity in cache with pending changes
			</td>
		</tr>
		<tr>
			<td style="width:121px;">
			**"Deleted"**
			</td>
			<td style="width:498px;">
			An existing entity in cache that is marked for deletion
			</td>
		</tr>
		<tr>
			<td style="width:121px;">
			**"Detached"**
			</td>
			<td style="width:498px;">
			An entity that is not in cache; its status in the database is unknown
			</td>
		</tr>
	</tbody>
</table>

An `EntityState` instance has accessor methods that make it easy to test these states individually (`isAdded`, `isUnchanged`, `isModified`, `isDeleted`, `isDetached`) or in useful combinations (`isAddedModifiedorDeleted`, `isUnchangedOrModified`).

As things happen to an entity, Breeze updates its `EntityState` automatically. For example,

<table border="1" cellpadding="0" cellspacing="0">
	<tbody>
		<tr>
			<td style="width:319px;">
			**Action**
			</td>
			<td style="width:319px;">
			**new `EntityState`**
			</td>
		</tr>
		<tr>
			<td style="width:319px;">
			Arrives in cache from a query
			</td>
			<td style="width:319px;">
			Unchanged
			</td>
		</tr>
		<tr>
			<td style="width:319px;">
			Set one of its properties
			</td>
			<td style="width:319px;">
			Modified
			</td>
		</tr>
		<tr>
			<td style="width:319px;">
			Save it successful
			</td>
			<td style="width:319px;">
			Unchanged
			</td>
		</tr>
	</tbody>
</table>

You can change any `EntityState` to another state with one of several methods. That's an advanced, potentially risky trick that you can learn about later ... except for one common case, deleting an entity.

###Deleting an entity

You delete an entity by changing its `EntityState` to "Deleted" like this:

    someEntity.entityAspect.setDeleted(); // mark for deletion

`setDeleted` does not destroy the object locally nor does it remove the entity from the database. The entity simply remains in cache in its new "Deleted" state ... as changed and added entities do. A successful save does delete the entity from the database and remove it from cache.

##PropertyChanged
A Breeze entity property raises a `propertyChanged` event when it is changed to a different value. You attach an event handler to that event to listen for changes to *a* specific property of *one specific entity instance* as explained in the [API documentation for this event](/doc-js/api-docs/classes/EntityAspect.html#event_propertyChanged).

    // assume order is an order entity attached to an EntityManager.
    order.entityAspect.propertyChanged.subscribe(function (propertyChangedArgs) {
        var entity = propertyChangedArgs.entity; // Note: entity === order
        var propertyNameChanged = propertyChangedArgs.propertyName;
        var oldValue = propertyChangedArgs.oldValue;
        var newValue = propertyChangedArgs.newValue;
        // ... do something ...
    });

###Entity state change not a property change

The properties of an `EntityAspect` do not raise the `propertyChanged` event. The `EntityAspect.entityState` is such a property. It follows that you cannot listen for a change to an entity's `EntityState` - say from "Unchanged" to "Modified" - by subscribing to `propertyChanged`.

Fortunately, there is a different way to listen for an `EntityState` change: [**listen to the `EntityManager.entityChanged` event instead**](#emEntityChanged).

###Memory leak risk 

Now that you've attached a handler, the entity will stay in memory for at least the lifetime of the handler. The handler in this example is an anonymous function that makes no reference to an external object (so far as we know). But if your handler belongs to another object, then the entity lifetime is linked to the lifetime of that object. If that object can't be garbage collected, neither can the entity.

For this reason, `subscribe` returns a token that you can use to `unsubscribe` later as seen here:

    var handle = order.entityAspect.propertyChanged.subscribe(...);
    // ... later, when you know it is the right time to dispose of the listener ...
    order.entityAspect.propertyChanged.unsubcribe(handle);

###Too many listeners?

You just learned how to listen for a change to *a single property of a single entity instance* and unsubscribe to it. You'll face a major bookkeeping nightmare if you do a lot of this.

Fortunately, there is a better way to listen for changes to many properties on many entities and there is no memory leak risk: [**listen to the `EntityManager.entityChanged` event instead**](#emEntityChanged).


###PropertyChanged (Knockout)

When Breeze detects the presence of the Knockout library, it configures itself to use Knockout observables for entity properties. You can <a href="http://knockoutjs.com/documentation/observables.html" target="_blank">subscribe</a> to changes in individual Knockout properties as shown here:

    newTodo.Description.subscribe(
        function (newValue) { /* do something */);});

If you want to listen for changes to another property, you subscribe to that one separately.

    newTodo.IsDone.subscribe(
        function (newValue) { /* do something */);});

You'll probably need a separate handler for each subscription. A handler is called with the new value ... and that's it. You don't know what object or what property called the handler.

Need to know if `any` property has changed? You may have to subscribe to every property of the object [<a href="#note 1">1</a>].

With the Breeze `EntityAspect.propertyChanged` event, you can listen for a change to any property with a single subscription:


    newTodo.entityAspect
        .propertyChanged.subscribe(function (changeArgs) { /* do something */);});
		
The `changeArgs` tell you what property changed, its previous value and its new value [<a href="#note 2">2</a>].

###Too many listeners?

You just learned how to listen for a change to *a single Knockout property of a single entity instance*. There is a better way when you need to listen for changes to many properties on many entities: [**listen to the `EntityManager.entityChanged` event instead**](#emEntityChanged).

<a name="emEntityChanged"></a>
##EntityManager.entityChanged Event

The `EntityManager` is always watching for changes to entities in its cache and when it detects a change to an entity, it raises the [entityChanged event](/doc-js/api-docs/classes/EntityManager.html#event_entityChanged). 

The manager raises the event when it detects many different kinds of changes which it calls "entity actions". The Breeze [`EntityAction` enumeration](/doc-js/api-docs/classes/EntityAction.html) describes them.

Here's how you might subscribe to `eventChanged` to respond to property changes:

    function addPropertyChangeHandler(entityManager, handler) {
        // call handler when an entity property of any entity changes
        // return the subscription token so caller can choose to unsubscribe later
        return entityManager.entityChanged.subscribe(function(changeArgs) {
            var action = changeArgs.entityAction;

            if (action === breeze.EntityAction.PropertyChange) {
                var entity = changeArgs.entity;
                var propertyName = changeArgs.args.propertyName;
                // ... do something ...
            }
        });
    }

A listener for `EntityState` changes could be similar:

    function addEntityStateChangeHandler(entityManager, handler) {
        // call handler when an entity's EntityState changes
        // return the subscription token so caller can choose to unsubscribe later
        return entityManager.entityChanged.subscribe(function(changeArgs) {
            var action = changeArgs.entityAction;

            if (action === breeze.EntityAction.EntityStateChange) {
                var entity = changeArgs.entity;
                var newEntityState = entity.entityAspect.entityState;
                // ... do something ...
            }
        });
    }

##Property validation

Breeze properties aren't just observable. They can [validate changes](/doc-js/validation) based on rules registered in [**metadata**](/doc-js/metadata). Some of the validations are registered automatically based on information in the metadata. For example, a key property is automatically required. You can add your own custom validations as well.

In brief, Breeze evaluates validation rules at prescribed times of your choosing. A validation rule either passes or fails. If it passes, it returns null. If it fails, it returns a `ValidationError` describing the problem. Every `EntityAspect` maintains a `validationErrorsCollection`. The Breeze validation engine adds new `ValidationError` instances to that collection when validation rules fail and removes old `ValidationErrors` instances when validation rules pass [<a href="#note 3">3</a>].

The `EntityAspect` raises a `validationErrorsChanged` event when `ValidationErrors` are added or removed from the entity's `validationErrorsCollection`; you could subscribe to it like this:

    newTodo.entityAspect
        .validationErrorsChanged.subscribe(handleValidationErrorChanged);

Breeze calls the handler with an `errorsChangedArgs` that tells you what property changed, the validation errors that were added, and the validation errors that were removed [<a href="#note 4">4</a>].

By default, Breeze validates the entities before saving them to the server; it won't send any of them if one of the entities fails validation. For example, the Todo application displays this error message if you add a new new Todo with a description that exceeds 30 characters.

<img alt="Snapshot of 'Description too long' error message" src="/images/samples/BreezeTodoDescriptionTooLong.jpg" style="width: 600px; height: 165px;">

[Learn more](/doc-js/validation) about Breeze property-level and entity-level validation.

> **Reminder:** Client-side validation improves the user experience. It is not a substitute for validation on the server.

##Reverting a change

Once you've changed an entity, it's in a changed state ... even if you manually restore the original value:

    var oldDescription = todo.Description(); // assume existing "Unchanged" entity
    todo.Description("Something new"); // entityState becomes "Modified"
    todo.Description(oldDescription); // entityState is still "Modified"

You cancel and roll back changes to an entity by calling rejectChanges.

    var oldDescription = todo.Description(); // assume existing "Unchanged" entity
    todo.Description("Something new");       // entityState becomes "Modified"
    todo.entityAspect.rejectChanges();       // entityState restored to "Unchanged"
                                             // todo.Description() === oldDescription

##Saving Changes

Perhaps we have new, changed, and deleted entities in cache that we want to preserve in permanent storage. Learn about saving these changes in the **[next topic](/doc-js/lap-savechanges)**.

##Notes

<a name="note 1"></a>[1] Check out the "*KO property change notifications raised*" test in the ***basicTodoTests*** module of the <a href="/doc-samples/doccode">Teaching Tests</a> for a sense of what that might be like. Ponder the implications for a line-of-business application whose entities have twenty or more properties.

<a name="note 2"></a>[2] For a study in contrast, see the test named "*Breeze propertyChanged raised when any property changes*" in the ***basicTodoTests*** module of the <a href="/doc-samples/doccode">Teaching Tests</a>.

<a name="note 3"></a>[3] It's up to the developer to determine how to display errors and guide the user experience. Breeze will not save entities that have validation errors.

<a name="note 4"></a>[4] See the test named "*validation error when set Id null*" in the ***basicTodoTests*** module of the [Teaching Tests](/samples/doccode).
