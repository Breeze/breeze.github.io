---
layout: doc-js
redirect_from: "/old/documentation/entitymanager-and-caching.html"
---
#EntityManager

The *EntityManager* is the gateway to the persistence service and holds a cache of entities that the application is working with, including entities that have been queried, added, updated, and marked for deletion. The *EntityManager* is the core class in Breeze, and this page discusses its primary capabilities.

##Overview

The *EntityManager* serves three main functions:

1. It communicates with the persistence service.
1. It queries and saves entities.
1. It holds entities in a local container called the entity cache.


When the client application requires data, it typically calls a method on an instance of an *EntityManager*. The *EntityManager* establishes communication channels, sets up the client's security context, serializes and deserializes data, and regulates the application-level flow of traffic with the persistence service.

In most cases when you query with an *EntityManager*, you are not just getting the results of the query, but you also place the queried entities into the *EntityManager's* cache. When you create new entities, you add them to that cache. When you delete entities, you are actually marking entities in the cache, scheduling them to be deleted.

When you eventually ask the *EntityManager* to save, it finds the changed entities in cache - the ones you've modified, added, and scheduled for deletion - and sends the changes to the *persistence service*. If all goes well, the service reports success and the *EntityManager* adjusts the cached entities to reflect the save by discarding deleted entities and re-setting the ***EntityState*** of the added and modified entities to *Unchanged*.

##Key EntityManager capabilities

The following is a summary of the methods available on the EntityManager arranged by task. For a complete list of methods, please see the <a href="/doc-js/api-docs/classes/EntityManager.html">EntityManager API documentation</a>.

##Querying for entities

EntityManager methods relating to querying entities, either from remote services or from its own internal entity cache.

| Method | Summary
| -------| -------
| *executeQuery* | Asynchronously executes its *EntityQuery* argument, returning an *Promise* that in turn will return an array of entities.
|*executeQueryLocally* | Synchonously executes its *EntityQuery* argument against any entities already in the entity cache, returning an array of entities.
|*fetchEntityByKey* | Asynchronously queries for an entity by its key; returning a *Promise* that in turn will return the entity.


##Finding entities in the cache

EntityManager methods that allow for searching and retrieving entities from the local entity cache. 

| Method | Summary
| ------ | ---------
| *executeQueryLocally* |(same as above) Synchonously executes its EntityQuery argument against any entities already in the entity cache, returning an array of entities.
| *getEntityByKey* | Synchonously returns an entity from the local entity cache.
| *getEntities* | Synchronously returns an array of entities of specified EntityTypes and EntityStates from the local entity cache.
| *getChanges* | Synchronously returns an array of changed (Modified, Added, Deleted) entities of optionally specified EntityTypes and EntityStates from the local entity cache.


##Adding / attaching and removing entities to and from the cache

EntityManager methods that allow for adding or attaching entities to the local entity cache.  

| Method | Summary
| ------ | ---------
|*addEntity* |Adds a new entity to the local entity cache with an EntityState of 'Added'.
|*attachEntity* |Adds an entity to the local entity cache with an arbitrary EntityState.
|*detachEntity* | Removes an entity from the local entity cache. 
|*createEntity* | Creates a new entity (based on preexisting metadata) and adds or attaches it to the local entity cache. 
|*clear* |Clears all entities from the local entity cache. 


##Saving changes

The EntityManager has exactly one method to save changes to the persistence service.

| Method | Summary
| ------ | ---------
|*saveChanges* |Can save either all of the changes (Added, Modified, and Deleted entities) in the local entity cache or any selected subset.

##Rejecting changes

You can rollback changes ... either all of them at once with `EntityManager.rejectChanges()` or on an entity basis with `entity.entityAspect.rejectChanges()`.

The `rejectChanges` behaves differently depending upon whether the affected entity was newly created (is in the "Added" state) or existed previously (is in the "Modified" or "Deleted") state. If the entity existed previously, its property values are restored to their pre-modification (pre-deletion) states. Navigation properties are adjusted accordingly. And the `EntityState` becomes "Unchanged".

If the entity was new (in "Added" state), the previous state is ... nothing. We can't turn an object to "nothing"; your application may still hold a reference to it. So we detach it from its `EntityManager` (the `EntityState` becomes "Detached"). JavaScript will garbage collect it eventually, once no one holds a reference to it.

##Simulating save with `acceptChanges`

You can simulate the cached result of a save by "accepting" changes on entities with pending changes. Do that for a specific entity by calling `entity.entityAspect.acceptChanges()`. This action sets the `EntityState` to "Unchanged" and wipes away the memory of previous values (the "original values").

Breeze calls this method after a successful save. Be very careful when you call it. You haven't saved anything. All you are doing is simulating the aftermath of a save by forcing the entity into the "Unchanged" state (or the "Detached" state if the entity is scheduled to be deleted). If the entity has a temporary key or its foreign keys hold temporary key values, these values remain; they are not updated to permanent key values.

You should only call `acceptChanges` when you know exactly what you are doing. It's useful in test scenarios but hardly ever in production code. That's why there is no `EntityManager.acceptChanges()` method; we think it is simply too dangerous to offer such a sweeping method of such dubious merit. Of course you can easily create this method for yourself by looping through the list of pending changes (see `EntityManager.getChanges`).

##Offline support 

The EntityManager is able to serialize its state to a local persistence store and later rematerialize that state. See the <a href="/doc-js/export-import">Export/Import topic</a> for details.

| Method | Summary
| ------ | ---------
|*exportEntities* |Serializes any selected group of entities to a string for storage to HTML5 local storage or IndexedDb or any other local persistence store.
|*importEntities* |Deserializes any previously 'exported' entities into the entity manager.

##Events 

EntityManager events that may be subscribed to and which occur when changes occur within the local entity cache. 

| Event | Summary
| ------ | ---------
|*entityChanged* | Fired whenever an entity within the EntityManager has changed.
|*hasChanges* | Fired whenever the state of the EntityManager transistions from a state of having changes to not having changes or vice versa.

<a name="freshCache"></a>

##Keeping a fresh cache

The Breeze `EntityManager` cache provides a ton of benefits. But some folks are so concerned about stale data that they think they should avoid the cache altogether.

Don't dismiss the cache so quickly. Most of your data is pretty stable. Only some of the resources must always be as fresh as possible. Focus on those resources ... and know this: you can keep a resource minty fresh AND hold it in cache. It's not "either / or" !

Just do the following:

1. Always re-query that resource before using it (e.g., when your ViewModel loads the View)
1. Clear the cache of all instances of that resource type before you issue that query.

I always have my ViewModels delegate to a data access helper "service" that I might call a `datacontext`. You can encapsulate these "always fresh" thoughts within methods of that `datacontext`. Here's what I mean:

	// get fresh invoices, optionally filtered, after clearing the cache of invoices
	function getInvoices(optionalPredicate) {
	    clearCachedInvoices();
	    var query = breeze.EntityQuery.from('Invoices');
	    if (optionalPredicate) { query = query.where(predicate); }
	    return manager.executeQuery(query).then(_logSuccess, _queryFailed);
	}
	
	// refresh a specific invoice
	function refreshInvoice(invoice) {
	    // Todo: add parameter error checking?
	    var query = breeze.EntityQuery.fromEntities([invoice]);
	    return manager.executeQuery(query).then(success, _queryFailed);
	
	    function success(data) {
	        _logSuccess(data);
	        return data.results[0]; // queries return arrays; caller wants the first.
	    }
	}
	
	function clearCachedInvoices() {
	    var cachedInvoices = manager.getEntities('Invoice'); // all invoices in cache
	    // Todo: this should be a function of the Breeze EntityManager itself
	    cachedInvoices.forEach(function (entity) { manager.detachEntity(entity); });
	}


###Important Caveats about cache clearing

The reason I'm clearing the cache first is that another user may have deleted some of the invoices that you previously retrieved. I assume you want them removed from your cache so that the user sees only the living invoices.

You won't need this cache clearing step (and the attendant concerns) if invoices can't be deleted (e.g., you did "soft deletes" instead by marking invoices "inactive"). I personally am deeply wary of deletes as they cause all kinds of problems. I prefer soft deletes.

It's up to you to make sure that the UI is not holding on to previous invoice entities. You've asked the manager to start fresh. That means every existing invoice entity reference is referring to a **detached entity**. After the query, every cached invoice is a new instance.

The other danger of clearing the cache is that it **wipes out all pending invoice changes**. You don't want to run this method if you could have unsaved invoice changes (new, update, or scheduled deletes). You might want to add guard logic to prevent the loss of unsaved changes. Exactly what that logic is will be application specific. It will likely involve a call to `manager.hasChanges('Invoice')`.

You don't have to worry about lost references if you always refresh everything pertaining to invoices.

Ah ... but **what if you don't want to clear the decks every time you refresh invoices? What if you want to refresh the entity objects *in place*** rather than replace them completely. Maybe you want to refresh while users have unsaved changes ... and preserve those pending changes. And yet you still want to remove entities that have been deleted by another user.

Well there's a recipe for you too.

	function refreshAllInvoices(removed) {
	        // 'removed' is the caller's array that should be filled with the entities 
	        // that we remove from cache; it's populated in the success method below.
	    var cached = manager.getEntities('Invoice'); // get all invoices in cache
	    return breeze.EntityQuery.from('Invoices')
	                 .using(manager).execute(success, _queryFailed);
	
	    function success() {    
	        var results = data.results; // results from query
	        // remove each result from the "cached" array
	        results.forEach(function (entity) {
	            var ix = cached.indexof(entity);
	            if (ix > -1) { cached[ix] = null; }
	        });
	
	        // what's left must have been deleted on the server
	        // or is a new entity we haven't saved yet
	        // Loop through, detaching the ones we think have been deleted.
	
	        removed ? removed.length = 0 : removed = []; // clear the array or define one
	
	        cached.forEach(function (entity) {
	            if (entity !== null &amp;&amp;
	                !entity.entityAspect.entityState.isAdded()) {
	                removed.push(entity); // let caller know about this one
	                manager.detachEntity(entity);
	            }
	        });
	
	        return results;
	    }
	}


#TBD

This rest of this page is not ready for publication. It will cover:

- Reading the original values of changed entities
- Isolate changes with multiple EntityManagers
- EntityManager constructor options
- Cloning an EntityManager with `createEmptyCopy`
- Sharing metadata among EntityManager
- Caching entities from multiple persistence services
- Mocking persistence with cached fake entities and local queries

Please consult the API documentation for the following related classes:

`EntityManager`
`EntityAspect`
`EntityState`
`EntityType`
`QueryOptions`
`SaveOptions`
