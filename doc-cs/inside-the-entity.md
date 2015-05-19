---
layout: doc-cs
---

# Inside the Entity

This topic concentrates on the model object's entity nature, in particular how the entity is **tracked** during its lifetime on the client. You'll learn about the **`EntityAspect`** property through which the developer can access and control the state of the entity within the Breeze system.

>Code snippets on this page are in the <strong>InsideEntityTests.cs</strong> file in the [DocCode teaching tests](/breeze-sharp/samples).

### "*Entity-ness*"

A domain **model object** represents something significant in the application domain. A "Customer", for example, has data properties ("<strong><i>Name</i></strong>"), relationships to other entities ("<strong><i>Orders</i></strong>") and perhaps some business logic ("<strong><i>IsGoldCustomer</i></strong>"). We bind these object members to UI controls and reason about them in application code. They are what matters most to users and other application stakeholders. They define "***Customer-ness***".

The "Customer" is also an **entity**, a long-lived object with a permanent key. We can fetch it from a database, hold it in cache, check for changes, validate, and save it. When the developer's attention turns to whether an object has changed or not, what its values used to be, how it is persisted, whether it has validation errors ... the developer is thinking about the object's entity nature. Breeze is responsible for the object's **entity nature**, its "<strong><i>entity-ness</i></strong>".  You access an entity's entity nature through its ***EntityType*** and ***EntityAspect*** properties.

# EntityType

Every Breeze entity instance has an `EntityAspect` property that in turn has an `EntityType` property that returns an *EntityType* object which is the [metadata](/breeze-sharp-documentation/metadata) that describe its properties and other facts about the type.
	
	var type = someCustomer.EntityAspect.EntityType;

# EntityAspect

A Breeze entity is "self-tracking". It maintains its own entity state, and the means to change that state, in the ***[EntityAspect](http://www.breezejs.com/breeze-sharp-api/html/T_Breeze_Sharp_EntityAspect.htm)*** object returned by its ***EntityAspect*** property.

An object becomes a Breeze entity when it acquires its ***EntityAspect*** which it does when it

- first enters the cache as a result of a query or import **OR**

- is created with the ***EntityType.CreateEntity*** factory method **OR**

- is explicitly added or attached to an EntityManager

The first of any of these actions is sufficient to endow an object with its ***EntityAspect*** which it retains throughout its client session lifetime.

We'll tackle ***EntityAspect***'s key features in four groups.

- [EntityState](#EntityState) ... and the methods that can reset that state

- [PropertyChanged](#PropertyChanged) event

- [ValidateEntity](#ValidateEntity) ... and related validation members

- [entity miscellany](#EntityMiscellany)

<a name="EntityState"></a>
## EntityState

Is the entity attached to an ***EntityManager*** and therefore in its cache? Has it changed? If changed, is it a new entity, a modified version of an existing entity from remote storage, or an existing entity that is marked for deletion?

The ***EntityState*** property answers these questions with a value from the ***[EntityState](http://www.breezejs.com/breeze-sharp-api/html/T_Breeze_Sharp_EntityState.htm)*** enumeration. Here are the enumeration names and their meanings:

| EntityState |  Meaning |
| -- | --
| **Added** | A new entity in cache that does not exist in the backend database.
| **Unchanged** | An existing entity in cache that was queried from the database; the entity has no unsaved changes since it was last retrieved or saved.
| **Modified** | An existing entity in cache with pending changes.
| **Deleted** | An existing entity in cache that is marked for deletion.
| **Detached** | An entity that is not in cache; its status in the database is unknown.

You can test the value of an EntityState enumeration by comparing its name with a string. Or you may prefer to test with the enumeration's properties and methods:

    var state = anEntity.EntityAspect.EntityState;
    if (state.ToString() == "Modified") {/* ... */};        // ok
    if (state == EntityState.Modified) {/* ... */};         // better
    if (state.IsModified()) {/* ... */};                    // best
    if (state.IsAddedOrModifiedOrDeleted()) {/* ... */};    // often useful

### EntityState transitions

As things happen to an entity, Breeze updates its ***EntityState*** automatically. Here are before and after ***EntityStates*** for some of the most common actions:

| Before | Action | After | 
| ----- | ------ | ------
|     | Entity materialized in cache by a query | Unchanged
| Unchanged | Set one of its properties | Modified
| Modified | Save it successfully | Unchanged 
| Unchanged | Mark it deleted | Deleted
| Deleted | Save it | Detached 
|     | Create a new entity | Detached
| Detached | Add the new entity to the manager | Added
| Added | Delete it (or call *RejectChanges* | Detached

Two state-changes may surprise you. If you mark an ***existing entity*** for deletion and save it successfully, the entity becomes detached. Breeze can't make the entity disappear; it may still be visible in the UI. But the entity no longer exists on the server so Breeze banishes it from its former ***EntityManager*** cache.

Deleting a ***new entity*** detaches it immediately. Breeze doesn't wait for you to call ***SaveChanges*** which is pointless if you're discarding data that have never been saved.

### Detached entities

A detached entity does not belong to an ***EntityManager***. It's still an entity; it's just not an entity in any cache.

A detached entity should not be used. Either attach it to an ***EntityManager*** or release all references to it ... and let it be garbage collected.

A detached entity is unreliable. It still has data values and you can still set them. But its [navigation properties](/breeze-sharp-documentation/navigation-properties) are not dependable and other entity features may behave unexpectedly. You can't tell by inspection whether a detached entity has corresponding data in remote storage.

New entities start as detached entities. You might have to create them where no ***EntityManager*** is available. More likely, you have to initialize some of the new entity's values before you can add it to an ***EntityManager***. For example, because all entities in cache must have unique keys, if the entity key is client-determined (as opposed to store-generated), you must set the key to a unique value before you can attach the entity to an ***EntityManager***.

You should initialize a new entity and then immediately add it to an ***EntityManager***  ... unless you have a very good reason to do otherwise.

Entities can become detached deliberately or as a side-effect of another action. The following actions detach an entity:

- explicitly removing it from its ***EntityManager*** (`manager.DetachEntity(anEntity)`)

- clearing its ***EntityManager*** (`manager.Clear()`)

- deleting a ***new*** entity

- deleting an ***existing*** entity and then saving it successfully.

Note that removing an entity from cache (detaching it) does not delete it. The data of a pre-existing detached entity remain in remote storage.

### Force an EntityState change

You can change the ***EntityState*** programmatically through one of the ***EntityAspect*** methods dedicated to that purpose.

- ***Delete***()

- ***RejectChanges***()

- ***AcceptChanges***()

Call ***Delete***() to schedule an entity for deletion as discussed [below](#DeleteEntity).

Call ***RejectChanges***() to cancel pending changes as discussed [below](#RejectChanges).

Call ***AcceptChanges***() to set an entity's state to "Unchanged".

You rarely call ***AcceptChanges*** in production code; production entities become "Unchanged" as a side-effect of application activity.

You are most likely to call this method while setting up fake entities for automated tests because you want to force these fakes into a particular test state. The ***AcceptChanges*** method also clears the ***OriginalValuesMap***, erasing memory of prior values; you won't be able to revert these entities to their original values.

<a name="DeleteEntity"></a>
### Deleting entities

Deleting an entity begins with an ***EntityState*** change. Call ***Delete***() to mark an entity for deletion:

	someEntity.EntityAspect.Delete(); // mark for deletion

`Delete` does not destroy the object locally nor does it remove the entity from the database. The entity simply remains in cache in a “Deleted” state … as changed and added entities do ... until you save. A successful save deletes the entity from the database and removes it from cache.

<a name="RejectChanges"></a>
### Cancel with ***RejectChanges***

Once you’ve changed an entity, it stays in a changed state … even if you manually restore the original values:

    var oldCompanyName = customer.CompanyName;  // assume existing "Unchanged" entity
    customer.CompanyName = "Something new";     // EntityState becomes "Modified"
    customer.CompanyName = oldCompanyName;      // EntityState is still "Modified


Call ***RejectChanges*** to cancel pending changes, revert properties to their prior values, and set the EntityState to "Unchanged".

    var oldCompanyName = customer.CompanyName;  // assume existing "Unchanged" entity
    customer.CompanyName = "Something new";     // EntityState becomes "Modified"
    customer.EntityAspect.RejectChanges();      // EntityState restored to "Unchanged”
                                                // customer.CompanyName == oldCompanyName

You can also call ***RejectChanges*** on the EntityManager to cancel and revert pending changes for every entity in cache.

    manager.RejectChanges(); // revert all pending changes in cache

### Original values

Breeze remembers the original property values when you change an existing entity. It stores these values in the ***EntityAspect***'s ***OriginalValuesMap***. The ***OriginalValuesMap*** is an empty object while the entity is in the "Unchanged" state. When you change an entity property for the first time, Breeze adds the pre-change value to the ***OriginalValuesMap***, using the property name as the key. The keys are the names of the properties that have been changed since the entity was last queried or saved.

Here's a method to get those keys:

    public IEnumerable<string> GetOriginalValuesPropertyNames(IEntity entity)
    {
        var names = new List<string>();
        foreach (var name in entity.EntityAspect.OriginalValuesMap)
        {
            names.Add(name.Key);
        }
        return names;
    }


Breeze replaces ***EntityAspect.OriginalValuesMap*** with a new empty hash when any operation restores the entity to the "Unchanged" state. A successful save, ***RejectChanges*** and ***AcceptChanges*** all reset the ***OriginalValuesMap***.

<a name="PropertyChanged"></a>
## PropertyChanged and ErrorsChanged events on the Entity

Breeze creates entities in in the manner appropriate for .Net and WPF. This means that the entity is shaped to match the needs of WPF binding. *INotifyPropertyChanged*, *INotifyDataErrorInfo*, and several other interfaces discovered and used by WPF are defined and implemented by all Breeze entities. To use these methods outside of standard data binding you will need to cast your entity to the appropriate interface. i.e.

    ((INotifyPropertyChanged) aCustomer).PropertyChanged += ...
    ((INotifyDataErrorInfo) aCustomer).ErrorsChanged += ... 

## EntityPropertyChanged and PropertyChanged on the EntityAspect

Breeze also has  **PropertyChanged** and a *EntityPropertyChanged* events on the *EntityAspect*.   The *EntityPropertyChanged* event is exactly the same as that raised by casting the entity itself to *INotifyPropertyChanged* as shown above.  The *PropertyChanged* on the *EntityAspect*, the other hand, is intended for use in watching for changes to EntityAspect specific properties, like *EntityState*, *EntityKey* and *IsChanged*.  

    aCustomer.EntityAspect.EntityPropertyChanged += /* same as above */

vs
    aCustomer.EntityAspect.PropertyChanged += /* sees changes to EntityState, EntityKey etc. */

You can listen for a change to any Breeze-tracked entity property with the following:

### Limitations

Breeze only monitors changes to properties identified in the metadata for this ***EntityType***. These properties - mapped and unmapped - are the "Breeze-tracked entity properties" mentioned earlier. Breeze doesn't track properties that you add with an entity initialization method (see [Extending Entities](/breeze-sharp-documentation/extending-entities)) or that you patch into the entity later in its lifetime.

<a name="ValidateEntity"></a>
## ValidateEntity

Breeze properties aren’t just observable. They can validate changes based on rules registered in metadata. Some of the validations are registered automatically based on information in the metadata. For example, a key property is automatically required. You can add your own custom validations as well. See the [Validation](/breeze-sharp-documentation/validation) topic for details.

In brief, Breeze evaluates validation rules at prescribed times. It can also validate on demand. Call the ***EntityAspect.Validate*** to validate the entire entity which means every property validation rule as well as every entity-level validation rule. You can validate a single property (all of its rules) by calling ***EntityAspect.ValidateProperty***. Again, see the [Validation](/breeze-sharp-documentation/validation) topic for details.

A validation rule either passes or fails. If it passes, it returns null. If it fails, it returns a ***[ValidationError](http://www.breezejs.com/breeze-sharp-api/html/T_Breeze_Sharp_ValidationError.htm)*** describing the problem.
    
Every ***EntityAspect*** maintains a `ValidationErrors` collection. The Breeze validation engine adds a new ***ValidationError*** instance to that collection when a validation rules fails and removes an old ***ValidationError*** instance when its associated validation rule passes.

<a name="EntityMiscellany"></a>
## Entity miscellany

This last category is a small menagerie of miscellaneous EntityAspect members

- ***Entity*** - a backward reference to the entity that holds this ***EntityAspect***.

- ***EntityManager*** - the ***EntityManager*** to which this entity is attached ... or was attached. It's null if the entity is new and not yet added to a manager.

- ***EntityKey*** - the entity's [***EntityKey***](http://www.breezejs.com/breeze-sharp-api/html/T_Breeze_Sharp_EntityKey.htm). A key is an object that uniquely identifies the entity in cache and in remote storage. The key is not a simple value. It's an object that identifies the type of the entity and the value ... or values ... of the key; Breeze supports entities with composite keys.

- ***LoadNavigationProperty*** you can download related entities, on demand, by calling ***LoadNavigationProperty*** as described in the [Navigation Properties](/breeze-sharp-documentation/navigation-properties) topic.

# Breeze properties on the entity itself

You typically access the breeze entity infrastructure through the ***EntityAspect*** property. Breeze also has a few *protected* methods that are available from within your entity. Two of the more useful of these are: 

***GetValue<T>*** - a method that returns the value of a property as type T.

***SetValue*** - a method that sets a property value

With ***GetValue*** and ***SetValue***, you can write utilities to access the properties of any Breeze entity as strings. These methods are also available with the same signatures on the **EntityAspect**.

The ***SetValue*** method follows the same code path as a property accessor and will raise property change events, change the entity state, and trigger validation accordingly.
