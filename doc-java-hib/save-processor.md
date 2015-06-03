---
layout: doc-java-hib
---

## The HibernateSaveProcessor ( implements SaveProcessor)

The `HibernateSaveProcessor` class is responsible for taking a JSON payload from the Breeze client, 
and saving it through Hibernate.  Under the hood several steps occur in this proces.

1. Converting from JSON to Java entities
1. Re-establishing the relationships between entities, based on the foreign keys
1. Calling *SaveWorkState.beforeSaveEntities* to allow pre-save processing
1. Associating the entities to a Hibernate Session
2. Call *SaveWorkState.beforeCommit* to allow additional pre-save processing
1. Saving the entities in the session
1. Keeping track of the mapping between temporary (client-generated) keys and real (server-generated) keys.
1. Removing the relationships between entities, so they can be returned to the Breeze client.
1. Calling *SaveWorkState.afterSaveEntities* to allow post-save processing
1. Converting the entities and key mappings to a *SaveResult*
1. Converting the *SaveResult* to JSON
1. Handling errors

Errors from the database or in other processing are returned as an HTTP 500 response.  Data validation errors or other application-supplied EntityErrors are returned as an HTTP 403 (Forbidden) response.


#### Example
The HibernateSaveProcessor is used to implement any endpoint to a breezejs SaveChanges call. In the example below, we are assuming that the java servlet method has been called as a result of a breezeJs *saveChanges* call.  

    public void saveChanges(HttpServletRequest request, HttpServletResponse response) {
        // extractSaveBundle is a method in the breeze-webservice lib
        // that will be described later.
        Map saveBundle = extractSaveBundle(request);
        SaveWorkState sws = new SaveWorkState(saveBundle);
        SaveProcessor processor = new HibernateSaveProcessor(metadata, sessionFactory);
        SaveResult sr = processor.saveChanges(saveWorkState);

        writeSaveResponse(response, sr);
    }
  

The *SaveWorkState* object mentioned above is a wrapper over the save data that is passed in from the client saveChanges call.  In addition, the *SaveWorkState* may be subclassed to add custom handling to the save process.  The SaveWorkState has a *beforeSaveEntity*, *beforeSaveEntities* and a *beforeCommit* method that will all be called during save processing.
These are discussed in more detail in the `breeze-webserver` library section below. 

