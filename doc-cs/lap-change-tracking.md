---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/change-tracking.html"
---

# Change tracking

At the heart of every Breeze entity is a nugget of “entity-ness”, its EntityAspect. Get it by calling theEntity.EntityAspect.

A full discussion of EntityAspect awaits you in a later topic. For now, we scratch the surface with an introduction to one two specific EntityAspect members:

EntityState – a property that reveals the entity’s change-state
ValidationErrors: a collection of any errors that are the result of applying validation rules:

### EntityState

A Breeze entity is “self-tracking”.  Its EntityAspect.EntityState tells you if it is

| Entity State | Description
| ------------ | -----------
| “Added” | A new entity in cache that does not exist in the backend database
| “Unchanged” | An existing entity in cache that was queried from the database
| “Modified” | An existing entity in cache with pending changes
| “Deleted” |  An existing entity in cache that is marked for deletion
| “Detached” |  An entity that is not in cache; its status in the database is unknown

An EntityState instance has accessor methods that make it easy to test these states individually (IsAdded(), IsUnchanged(), IsModified(), IsDeleted(), IsDetached()) or in useful combinations (IsAddedOrModifiedOrDeleted(), IsAddedOrModified() IsDeletedOrDetached(),  etc).

As things happen to an entity, Breeze updates its EntityState automatically. For example,

| Action | new EntityState
| ------ | ---------------
| Create entity and call AddEntity | Added
| Create entity and call AttachEntity | Unchanged
| Arrives in cache from a query | Unchanged
| Set one of its properties | Modified
| Save it successfully | Unchanged

You can change any EntityState to another state with one of several methods. That’s an advanced, potentially risky trick that you can learn about later … except for one common case.

#### Deleting an entity

You delete an entity by changing its EntityState to “Deleted” like this:

    someEntity.EntityAspect.Delete(); // mark for deletion

Delete does not destroy the object locally nor does it remove the entity from the database. The entity simply remains in cache in its new “Deleted” state … as changed and added entities do. A successful save does delete the entity from the database and remove it from cache.

#### PropertyChanged

Every Breeze entity implements INotifyPropertyChanged explicitly. We configured Breeze to produce Knockout observable properties. You can subscribe to changes as shown here:

With the Breeze EntityAspect.propertyChanged event, you can listen for a change to any property with a single subscription:

    ((INotifyPropertyChanged) newTodo).PropertyChanged += (sender, eventArgs) => {
        var propertyName = eventArgs.PropertyName;
    }
        

#### Property validation

Breeze properties aren’t just observable. They can validate changes based on rules registered in metadata. Some of the validations are registered automatically based on information in the metadata. For example, a key property is automatically required. You can add your own custom validations as well.

In brief, Breeze evaluates validation rules at prescribed times of your choosing. A validation rule either passes or fails. If it passes, it returns null. If it fails, it returns a ValidationError describing the problem. Every EntityAspect maintains a ValidationErrors collection. The Breeze validation engine adds new ValidationError instances to that collection when validation rules fail and removes old ValidationErrors instances when validation rules pass [3].

Every Breeze entity also implement the .NET INotifyDataErrorInfo interface. This allows you to subscribe to any changes in the ValidationErrors associated with any specific entity. 

    var inde = (INotifyDataErrorInfo)emp;
    var hasErrors = inde.HasErrors; // check if there are any errors on this entity
    // subscribe to the ErrorsChanged event.  
    inde.ErrorsChanged += (s, e) => {
        var propertyName = e.PropertyName;  
        var validationErrors = inde.GetErrors(propertyName).Cast<ValidationError>();    
    };


By default, Breeze validates the entities before saving them to the server; it won't send any of them if one of the entities fails validation. 

> Reminder: Client-side validation improves the user experience. It is not a substitute for validation on the server.

### Reverting a change

Once you’ve changed an entity, it’s in a changed state … even if you manually restore the original value:

    var oldDescription = todo.Description; // assume existing "Unchanged" entity
    todo.Description = "Something new"; // EntityState becomes "Modified"
    todo.Description =  OldDescription; // entityState is still "Modified"

You cancel and roll back changes to an entity by calling EntityAspect.RejectChanges.

    var oldDescription = todo.Description; // assume existing "Unchanged" entity
    todo.Description = "Something new"; // EntityState becomes "Modified"
    todo.EntityAspect.RejectChanges() //  entityState restored to "Unchanged”
                                   
#### Saving Changes

Perhaps we have new, changed, and deleted entities in cache that we want to preserve in permanent storage. Learn about saving these changes in the next topic.

