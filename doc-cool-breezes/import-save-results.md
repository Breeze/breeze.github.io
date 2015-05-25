---
layout: doc-cool-breezes
---
# Import save results from a "sandbox editor"

"Sandbox editing" is a common Breeze pattern for isolating user changes from the "mainstream" entities.

In this pattern, you create two `EntityManagers`. You maintain a `masterEm` which has only the pristine, last-saved state of your application entities.  You create a second `editEm` where you allow users to make changes.

You only make and save changes in that separate  `editEm`. You import the *entities-to-edit* from `masterEm`  into the `editEm`, make changes there, save them, and (if the save is successful), you export the saved entities from `editEm` and import them back into `masterEm`.

It sounds more complicated than it is. It works out to a small amount of Breeze code (as we will see) and you get nice isolation of change activity.

Trouble arises when you ***delete*** an entity in `editEm`. After save, that entity is "Detached" in the `editEm` but it's still in an "Unchanged" state back in the `masterEm`. How do you communicate the fact that the entity is deleted and remove it from `masterEm`?

You cannot simple import the saved entities into `masterEm`. **This will not work properly**

    if(saveResult.entities)
        // DON'T DO THIS
        masterEm.importEntities(editEm.exportEntities(entities, false));
    }
If you try, you'll discover that things went very wrong for any of the `saveResult` entities that were deleted. Such entities are in a "Detached" state ... they don't belong to *any* `EntityManager`. The `exportEntities` method should throw an error.

>It will throw an error as of v.1.5.4. There was a bug prior to that version and it seemed that Breeze supported export/import of "Detached" entities. That was a bug.

Fortunately, you can write a utility function that "does the right thing": it imports changed entities and detaches deleted entities.

Here is an example that you will also find [in DocCode:exportImportTests.js](https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode/tests/exportImportTests.js#L411) with a corresponding unit test.

    function updateMasterWithSaveResult(masterEm, sourceEm, saveResult) {
      var imports = [];
      var deletes = [];
      saveResult.entities.forEach(function(entity) {
        if (entity.entityAspect.entityState.isDetached()) {
          deletes.push(entity);
        } else {
          imports.push(entity);
        }
      });
      var exported = sourceEm.exportEntities(imports, {
        includeMetadata: false,
        asString: false // as JSON
      });
      masterEm.importEntities(exported);

      deletes.forEach(function(detached) {
        var entity = masterEm.getEntityByKey(detached.entityAspect.getKey());
        entity && entity.entityAspect.setDetached();
      });
    }

You could call it in the save success promise callback like this:

    return editEm.saveChanges()
               .then(function(saveResult) {
                   updateMasterWithSaveResult(masterEm, editEm, saveResult);
               })
              .catch(handleSaveFailed);

