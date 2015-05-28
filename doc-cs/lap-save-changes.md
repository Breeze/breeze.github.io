---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/save-changes.html"
---

# Save changes

The code snippets on this page are drawn from the Breeze Todo Sample App and from the BasicTodoTests module of the DocCode teaching tests.

The Todo sample App doesn’t have a save button. It saves changes as you add new items, update descriptions, check the “done” box, archive the completed Todos, and tick “Mark all as complete”. Create, update, and delete operations are all represented. Clicking “Mark all as complete” saves multiple updates in one transaction bundle.

Here’s one way to save using the EntityManager.SaveChanges method:

    if (manager.HasChanges()) {
        var saveResult = await manager.SaveChanges();
    } else {
        // log or inform user that there is nothing to save.     
    }

Checking for the presence of changes with HasChanges() is optional; Breeze won’t try to save if there is nothing to save. In this case, the author wants the user to see that there were no changes so he logs that fact and only calls manager.SaveChanges() when necessary.

> You can call EntityManager.SaveChanges(save_only_these_entities) if you want to cherry pick entities to save. If the list includes unchanged entities, Breeze won’t bother saving them. We advise against using this option because it’s easy to save one entity while neglecting an important dependent entity. For example, you probably don’t want to save a new OrderDetail without saving its parent new Order. It is your application; use the power wisely.


#### The save process

The *EntityManager* collects every entity with a pending change into a change-set. Then it validates the entities in that change-set, invoking each entity’s property- and entity-level validation rules, adding and removing errors from each entity's *EntityAspect.ValidationErrors* collection. The save fails if any entity in the bundle has errors. If they are all error-free, the manager sends the change-set in the body of a single POST request to the persistence service 

A save is an async operation, like any other service operation.  The Todo app releases the UI immediately, enabling the user to keep working unblocked. When the save result arrives from the service, the app reports success or failure with its logger.

#### After the save

If the save fails, the contents of the cache are unchanged. The entities with pending changes remain in their changed state. The app should analyze the *SaveException* thrown as a result of any failed save to determine the appropriate recovery or shutdown steps.

If the save succeeds, Breeze has some bookkeeping to do. The service sent the saved entities back to Breeze; the list is available from the *SaveResult.Entities* property.  They may contain changes that are news to the client, changes made by something in the backend.  Breeze merges these changes back into the cache.

For deleted entities the *SaveResult.Entities* property will include the deleted entities that are no longer in cache.

An entity that was marked for delete is removed from cache; its *EntityState* becomes “Detached”. The *EntityState* of new and modified entities becomes “Unchanged”.


#### Id Fixup

Updates to store-generated keys are the most common backend changes. A new Todo.Id was assigned a temporary id such as (-1) while it was in cache before save.  During the save, the database assigned it a permanent id, say (42). The Breeze EntityManager detects this and updates its cache key map accordingly. Then it visits every other entity in cache that might have had a reference to (-1) and replaces that value with (42) in a process called “id fix-up”.

The Todo app doesn’t need id fix-up because there are no relationships among entities in this model. But if we were saving a new Order and its OrderDetails, Breeze would replace all of the OrderDetail.OrderID values with the new Order.OrderID; for example, their (-1) values would be updated to (42).

If a fixup is performed the *SaveResult* provides a *KeyMapping* property that is a dictionary (map) of old EntityKeys to their corresponding new EntityKeys.

#### Offline

What if we couldn't save Todo changes right away? What if we couldn't rely on a fast, continuous connection to the server? We'd like to stash the cache contents to local storage. Breeze can smooth that process for you with its EntityManager export/import facilities. 

    // add a new Todo to the cache
    var newTodo = manager.AddEntity(CreateTodo("Export/import safely"));
    
    var changes = manager.GetChanges(); // we'll stash just the changes
    var changesExport = manager.ExportEntities(changes);
    
    // write the changesExport to a file or isolated storage.
    WriteChangesToFile(changesExport);  
    // ... much later ...
    
    var changesImport = ReadChangesFromFile();
    manager.ImportEntities(changesImport);

    // ... the todo is back in cache in its added state  ...

We cover export/import in greater detail in Export and Import Entities.

So ends the tour

You’ve queried, added new entities, changed others, and perhaps deleted one or two. You’ve saved your changes to the server. Those are the basics of data management in any application … and now you’ve run that lap with Breeze.

There are plenty of details to explore in later topics. You’ll likely dig deeper as you encounter more challenging scenarios. But now, you’re properly equipped to get started building a Breeze app. What’s stopping you? Get going! Have fun! And please stay in touch.





