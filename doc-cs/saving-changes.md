---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/saving-changes.html"
---

# Saving changes

Save changes to entities in cache by calling the ***EntityManager***’s `SaveChanges` method. This topic delves more deeply into the save process and how you control it.

This page is not ready for publication. It will cover:

- Detecting changes in cache: `HasChanges` and `GetChanges`

- Canceling pending changes with `RejectChanges`

- Validation before save

- The state of entities after save

- What entities are in `SaveResult.Entities` collection

- Temporary key resolution (“id fix-up”) and the `SaveResult.KeyMappings`

- Concurrency and the `DataProperty.ConcurrencyMode`

- Saving selected entities

- Default and explicit `SaveOptions`

- [Guard against accidental double saves](/doc-cs/concurrent-saves)

- Saving a change-set to a specific server endpoint with a "[named save](#NamedSave)"

- Saving data to an arbitrary HTTP service

<a Name="NamedSave"></a>
## Custom save operations with "named saves"

By default the `EntityManager.SaveChanges` method sends a save request to a server endpoint called "SaveChanges".

But you might have a specific business process to perform when you save a certain constellation of entities. Perhaps the actual storing of changes in the database is only a part of a much larger server-side workflow. What you really have is a "command" that includes a database update.

You could route this command through a single "SaveChanges" endpoint and let the corresponding server method dispatch the save request to the appropriate command handler. That could get messy. It can make more sense to POST requests to command-specific endpoints, passing along just the right entity set in the request body.

That's what the "**Named Save**" is for. With a "Named Save", you can re-target a "save" to a custom server endpoint such as an arbitrarily named ***action*** method on a separate, dedicated Web API controller.

You still call `EntityManager.SaveChanges` but you pass in a `SaveOptions` object that specifies the `ResourceName` to handle the request. The server should route the request to a suitable controller action method. You'd also set the `SaveOptions.DataService` if you need also to target a different controller.

Assuming that you want to save all pending changes to a custom endpoint, you could write:

    var so = new SaveOptions(resourceName: "myCustomSave");
    // null = 'all-pending-changes'; saveOptions is the 2nd parameter
    await manager.SaveChanges(null, so); 


You are more likely to assemble a list of entities to save to that endpoint ... a list consistent with the semantics of 'MyCustomSave' in which case you'd probably pass that list in the "SaveChanges" call:

	await manager.SaveChanges(selectedEntities, so); 

The Breeze client still sends a JSON change-set bundle to 'MyCustomSave' as it would with a normal `SaveChanges`  call. The POST method on the server that handles the 'MyCustomSave' endpoint should have the same as signature as the 'SaveChanges' method.



