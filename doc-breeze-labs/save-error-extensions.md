---
layout: doc-breeze-labs
---
#saveErrorExtensions.js

A Breeze Labs plugin that extends Breeze with a method that creates useful error messages from the error data passed to the failure callback when `EntityManager.saveChanges` fails.

This helper understands client-side validation failures and server-side failures that are composed by `Breeze.ContextProvider` or a conforming service.

`getErrorMessage(error)` is its primary method (see example below).

[Download breeze.saveErrorExtensions.js from GitHub](https://github.com/Breeze/breeze.js.labs/blob/master/breeze.saveErrorExtensions.js).

The default implementation extracts validation error messages and arranges for server validation errors to be removed from an entity the next time this entity changes in any way.

The service API includes implementation methods that can be overriden (replaced) to change the behavior just described.

This extension is not prescriptive!  It is only one approach to save error message handling. Use it for inspiration.

## Example ##

`getErrorMessage` it typically called within a `saveChanges` failure callback as seen here:

    function save() {
           return manager.saveChanges().then(saveSucceeded, saveFailed);

           function saveSucceeded(result) {
                logSuccess('Saved data', result, true);
           }

           function saveFailed(error) {
                var msg = 'Save failed: ' +
                      breeze.saveErrorMessageService.getErrorMessage(error);
                error.message = msg;
                logError(msg, error);
                throw error;
            }
        }
