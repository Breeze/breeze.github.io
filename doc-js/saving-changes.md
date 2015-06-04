---
layout: doc-js
redirect_from: "/old/documentation/saving-changes.html"
---
# Saving changes

Save changes to entities in cache by calling the *EntityManage*r&'s `saveChanges` method. This topic delves more deeply into the save process and how you control it. 

This page is not ready for publication. It will cover: 

- Detecting changes in cache: `hasChanges` and `getChanges`
- Canceling pending changes with `rejectChanges`
- Validation before save
- The state of entities after save
- What entities are in `saveResult.entities` collection.
- Temporary key resolution ('id fix-up') and the `saveResult.keyMappings`.
- Concurrency and the `DataProperty.concurrencyMode`
- Saving selected entities
- Default and explicit `SaveOptions`
- <a href="/doc-cool-breezes/concurrent-saves.html">Guard against accidental double saves</a>
- Saving a change-set to a specific server endpoint with a '<a href="#NamedSave">named save</a>'
- Saving data to an arbitrary HTTP service


## <a name="NamedSave"></a>Custom save operations with 'named saves'

By default the `EntityManager.saveChanges` method sends a save request to a server endpoint called 'SaveChanges'. 

But you might have a specific business process to perform when you save a certain constellation of entities. Perhaps the actual storing of changes in the database is only a part of a much larger server-side workflow. What you really have is a 'command' that includes a database update. 

You could route this command through a single 'SaveChanges' endpoint and let the corresponding server method dispatch the save request to the appropriate command handler. That could get messy. It can make more sense to POST requests to command-specific endpoints, passing along just the right entity set in the request body. 

That's what the '**Named Save**' is for. With a 'Named Save', you can re-target a 'save' to a custom server endpoint such as an arbitrarily named *action* method on a separate, dedicated Web API controller. 

You still call `EntityManager.saveChanges`but you pass in a `SaveOptions` object that specifies the `resourceName` to handle the request. The server should route the request to a suitable controller *action* method. You'd also set the `SaveOptions.dataService` if you need also to target a different controller. 

Assuming that you want to save all pending changes to a custom endpoint, you could write: 

    var so = new SaveOptions({ resourceName: 'myCustomSave' });
    // null = 'all-pending-changes'; saveOptions is the 2nd parameter
    myEntityManager.SaveChanges(null, so ); 

You are more likely to assemble a list of entities to save to that endpoint ... a list consistent with the semantics of 'MyCustomSave' in which case you'd probably pass that list in the 'saveChanges' call: 

    myEntityManager.SaveChanges(selectedEntities, so ); 

The Breeze client still sends a JSON change-set bundle to 'MyCustomSave' as it would with a normal `saveChanges ` call. The POST method on the server that handles the 'MyCustomSave' endpoint should have the same as signature as the 'SaveChanges' method. 

  
