---
layout: doc-js
redirect_from: "/old/documentation/dataserviceadapters.html"
---
# Breeze DataServiceAdapters

A ***DataServiceAdapter*** is the mechanism by which the `EntityManager` interacts with specific external web services. 

A *DataServiceAdapter* translates the three `EntityManager` remote service operations into custom web service calls:    

   1. **fetchMetadata** becomes a web service request for Breeze [metadata](/doc-js/metadata.html).

   1. ***executeQuery*** becomes a web service data request and it materializes the query results into Breeze entities.

   1. **saveChanges** becomes a web service request and updates the cached entities. 

The specifics of web service calls and their responses can differ dramatically depending on server technology and the particulars of the service API. The *DataServiceAdapter* is the primary extension point for coping with the vagaries of real-world service APIs.

You'll need a *DataServiceAdapter* that matches the characteristics of the remote service for your app.

Fortunately, you can create your own if necessary and Breeze ships with several useful adapters for popular service APIs.

## Configuring Breeze to use a *DataServiceAdapter*

When you've found the right adapter for your application - or written a custom adapter - you configure Breeze to use it like this:

    // specify the adapter name ('adapter-name')
    breeze.config.initializeAdapterInstance('dataService', 'adapter-name');

Breeze is pre-configured for one of the most popular built-in adapters (the 'webApi' adapter). If that works for you, you don't have to do a thing. 

<a name="breeze-oob-adapters"></a>

Breeze ships with several other adapters for some of the well-known service technologies and one of them just might fit your needs, either *out-of-the-box* or with a few adjustments. We'll talk about those adjustments too. 

The officially supported breeze client libraries include 

* <a href="https://github.com/Breeze/breeze.js/blob/master/src/b00_breeze.dataService.webApi.js" target="_blank" title="webApi DataServiceAdapter on github"><strong>webApi</strong></a> - for an ASP.NET Web API server written in Breeze style. Also works for Breeze/Node <a href="http://sequelizejs.com/" target="_blank" title="Sequelize"><em>Sequelize</em></a> servers.

* <a href="https://github.com/Breeze/breeze.js/blob/master/src/b00_breeze.dataService.odata.js" target="_blank" title="OData DataServiceAdapter on github"><strong>OData</strong></a> - suitable for many of the flavors of OData providers

* <a href="https://github.com/Breeze/breeze.js/blob/master/src/breeze.dataService.mongo.js" target="_blank" title="mongo DataServiceAdapter on github"><strong>mongo</strong></a> - for an Express/MondoDb server written in Breeze style

[**Breeze Labs**](/doc-breeze-labs/) adds a few more

* <a href="https://github.com/Breeze/breeze.js.labs/blob/master/breeze.labs.dataservice.azuremobileservices.js" target="_blank" title="azure-mobile-services DataServiceAdapter on github"><strong>azure-mobile-services</strong></a> - a simple REST-ish service tailored for a "Azure Mobile Services" server.  

* <a href="https://github.com/Breeze/breeze.js.labs/blob/master/breeze.labs.dataservice.sharepoint.js" target="_blank" title="SharePointOData DataServiceAdapter on github"><strong>SharePointOData</strong></a> - a SharePoint 2013 flavored OData service.

Even if you decide to write your own adapter, you might want to start with one of these as a model.

## The DataService Adapter interface (overview)

*DataServiceAdapters* are JavaScript classes that implement a specific interface.

Here is the public API summary (revisited in [detail below](#api-detail)):

* [**name**](#name) - the name of your adapter (a string).
* [**initialize**](#initialize) - setup for a new adapter instance prior to use.
* [**checkForRecomposition**](#checkForRecomposition) (optional) - what do do when a dependent Breeze adapter is initialized.
* [**fetchMetadata**](#fetchMetadata) - retrieve the metadata and populate a `MetadataStore`.
* [**executeQuery**](#executeQuery) - request data from the server (usually with constraints) and materialize the results as entities.
* [**saveChanges**](#saveChanges) - save the pending changes for one or more entities.
* [**jsonResultsAdapter**](#jsonResultsAdapter) - returns a [`JsonResultsAdapter`](/doc-js/server-jsonresultsadapter.html) which manipulates query and save result data from the server into a shape that Breeze understands.

Your service may not support one or more of the Breeze operations. Many remote services don't provide metadata or won't accept client changes. That's OK. 

>You should still implement the corresponding methods  (`fetchMetadata` and `saveChanges` respectively) so that the developer receives reasonable feedback when executing an `EntityManager` method. Throwing an appropriately worded exception is perfectly reasonable implementation.

Adapters often offer hooks so that developers can change the adapter's behavior. Breeze neither knows nor cares about such hooks but they can help you broaden the applicability of your adapter to a wider array of web service APIs.

The `changeRequestInterceptor` is a good example, one we'll [discuss below](#changeRequestInterceptor).

<a name="custom-adapter"></a>

### Writing a custom adapter
 
Define your custom adapter as a constructor function with a name, perhaps like this:

	var ctor = function CustomDataServiceAdapter() {
	    this.name = 'myCustomAdapter'     
    }
    
    var proto = ctor.prototype; // because you'll reference the prototype a lot

While you *can* write your adapter entirely from scratch, many Breeze adapters (such as the 'webApi' and 'mongoDb' *DataServiceAdapters*) derive from the [`AbstractDataServiceAdapter`](/doc-js/server-abstractdataserviceadapter.html) and you might choose to do likewise.

`proto = new breeze.AbstractDataServiceAdapter();`

Then override selected members of that adapter [as described here](/doc-js/server-abstractdataserviceadapter.html).

`proto.someMember = myVersionOfSomeMember;`

The last step of any adapter definition is to register itself with Breeze

`breeze.config.registerAdapter('dataService', ctor);`
 
Finally, you often make this adapter the default *DataServiceAdapter* for your application

`breeze.config.initializeAdapterInstance('dataService', 'myAdapter');`

### Don't write; overwrite!

Writing your own adapter can seem a bit daunting even when you base it on the `AbstractDataServiceAdapter`. Sometimes a pre-built adapter almost works; you just need to change a few things.

Try creating a new adapter that derives from the one that was *almost right* ... and make your changes there. Here's an example (for illustration only):

    /**  
     * myWebApiOData4.js 
     * My custom Web API OData 4 adapter
     */

    var ctor = function () {
        this.name = 'myWebApiOData4';
    }

    var proto = ctor.prototype; // we'll use this prototype a lot

    // inherit from the regular Breeze Web API OData adapter
    var baseCtor = breeze.config.getAdapter('dataService', 'webApiOData');
    breeze.core.extend(proto, baseCtor.prototype);

    // overwrite the  `initialize`  method
    proto.initialize = function () {
        // Communicate w/ OData source using the 'v4' flavor of the 'datajs' library
        var datajs = core.requireLib('datajs', 'required for remote OData v4 services');
        OData = datajs.V4.oData;
        OData.json.jsonHandler.recognizeDates = true;
    };

    // change the adapter's  `headers`  extension point
    proto.headers = { "OData-Version": "4.0" };

    // register it
    breeze.config.registerAdapter('dataService', ctor);

Make it the default for this application in your application's start-up logic

`breeze.config.initializeAdapterInstance('dataService', 'myWebApiOData4');`

### Study other adapters

We strongly recommend that you study [some of the Breeze adapters](#breeze-oob-adapters) before you try to write your own.

<a name="api-detail"></a>

## The DataService Adapter interface (detail)

Time to drill in on each member of the API.

<a name="name"></a>

### name

The name of this adapter. Most custom adapters begin as constructor (`ctor`) functions that simply define the adapter name:

    var ctor = function MyAdapter() {
        this.name = 'myAdapter';
    }

Refer to the adapter by this name when configuring Breeze:

    breeze.config.getAdapter('dataService', 'myAdapter')
    breeze.config.getAdapterInstance('dataService', 'myAdapter') 
    breeze.config.initializeAdapterInstance('dataService', 'myAdapter', true)
    breeze.config.initializeAdapterInstances({dataService: 'myAdapter'})

<a name="initialize"></a>
           
### initialize()

Called when Breeze creates a new instance of the adapter. This is the best place to initialize values and acquire other services that your adapter requires such as the *AjaxAdapter* with which you'll make web service calls. For example:

    var proto = ctor.prototype; // because we'll be extending the prototype a lot

    proto.initialize = function () {
        ajaxAdapter = breeze.config.getAdapterInstance('ajax');

        if (!ajaxAdapter || !ajaxAdapter.ajax) {
           throw new Error('No ajax adapter for dataservice adapter '" +
                           this.name + '".');
        }  
    }; 

<a name="fetchMetadata"></a>
           
### fetchMetadata (*metadataStore*, *dataService*) -> promise

Retrieves the metadata for the specified `dataService` into the specified `metadataStore`.

  - ***metadataStore*** - the `MetadataStore` instance that should be populated with metadata as a result of this call.  
  - ***dataService*** - the `DataService` instance through which this call should be performed.
  - **returns** a promise for raw JSON metadata
 
This method should update the `metadataStore` with metadata received from the server and return that same raw metadata to the caller in the fulfilled promise.

>Breeze doesn't do anything with the raw metadata. It simply passes the metadata along to the caller who might find it useful for debugging. 

If the *dataService* is configured such that metadata fetches are not supported (i.e., `dataService.hasServerMetadata === false`), the `fetchMetadata` method should return immediately with a synchronously-fulfilled promise rather than issue a request to the server.

<a name="executeQuery"></a>

### executeQuery (*mappingContext*) -> promise

Submits a query request to the server and returns a promise for the query results. 
  
  - ***mappingContext*** - An instance of `MappingContext` that describes the query to be performed along with other query-environment data.                      
  - **returns** a *promise* for *raw JSON query results* (not entities), results that Breeze filters through a `JsonResultsAdapter` and turns into entities.

This method typically does little more than tell the AJAX component to issue the query. The `EntityManager` handles entity materialization and merging into cache, informed by the applicable [`JsonResultsAdapter`](/doc-js/server-jsonresultsadapter).

Much of the [**`MappingContext`**](https://github.com/Breeze/breeze.js/blob/master/src/a55_mappingContext.js) is private to Breeze but some of it is relevant to your implementation of `executeQuery`
              
- **query**: The `EntityQuery` being processed.
- **entityManager**: The `EntityManager` processing this query.
- **dataService**: The `DataService` instance that identifies the web service target for this query.
- **getUrl**: a function that computes the URL for this query request based on the `query` data.
- **mergeOptions**:
  - **noTracking**: If `true`, Breeze won't materialize query results into entities in cache. The remaining options are irrelevant. `false` by default.
  - **mergeStrategy**: A [`MergeStrategy`](/doc-js/api-docs/classes/MergeStrategy.html "API Docs: MergeStrategy") telling Breeze what to do when a queried entity is already in cache.
 - **includeDeleted**: If `true`, Breeze includes 'deleted' entities among the results returned to the caller. Assumed to be `false` if omitted.
 
Most `executeQuery` implementations get the query URL by calling `mappingContext.getUrl()` which uses a *UriBuilder* to compute the URL from `EntityQuery`  data. The *UriBuilder* comes from the `dataService.uriBuilder` property if available or the default `uriBuilder` otherwise. Breeze currently supports two *UriBuilderAdapters*: an 'odata' adapter and a 'json' adapter.
  
The *queryResults* returned in a fulfilled promise should be an object with following schema:
     
 - **results**: the data returned in the server's response. Breeze filters this raw data through the applicable [`jsonResultsAdapter`](/doc-js/server-jsonresultsadapter.html) and turns that filtered data into entities where it can.
 - **httpResponse**: The full http response returned from the server.  Breeze  mostly ignores this property but passes it along to the caller which may be able to extract additional useful information (e.g., from headers) or present it for debugging.  
 - **inlineCount**: An *integer* count of entities that would have been returned had the query not contained any skip or take conditions. This property should only be set if the query specified the *inlineCount* option.      
                  
<a name="saveChanges"></a>
         
### saveChanges (*saveContext*, *saveBundle*) -> promise

Performs the actual save and returns a promise for a *saveResult*. 

- ***saveContext***:
  - **entityManager**: The `EntityManager` processing this save.
  - **dataService**: The `DataService` associated with this save. 
  - **resourceName**: The name of the "resource" (the server endpoint) that will receive the request.
  - **processSavedEntities**(**saveResult**): The function that the `EntityManager` calls after this `saveChanges` method returns a successful *saveResult*. 
- ***saveBundle***:
  - **entities**: An array of entities to be saved, either the entities specified in the `EntityManager.saveChanges` call or all cached entities with pending changes.
  - **saveOptions**: an instance of [`SaveOptions`](/doc-js/api-docs/classes/SaveOptions.html "API Docs: SaveOptions"), either the one passed to the `EntityManager.saveChanges` or the ambient default instance.  
- **returns** a promise for a *saveResult*
  
A typical implementation of `saveChanges` composes a payload from the contents of a `saveBundle` and POSTs it to the server.  This payload must be shaped such that the server can interpret it.

When the server responds,  `saveChanges` interprets the response and resolves the deferred promise with either a success or failure *saveResult* object.

#### Heterogeneous Saves

The "saveChanges" feature is designed for batched saves of multiple entities in a single transaction. The entities in the `saveBundle.entities` array may be of different types and have different change-states (Added, Modified, Deleted). The order of entities in the batch is indeterminate; a `saveChanges` implementation is free to re-order the bundle before placing the request to the server.

#### "REST" Saves
Many web service save APIs can only process a single entity at a time. For example, a typical "REST" service accepts a PUT, POST, or DELETE request for a single added, modified, or deleted entity. 

You can write a *DataServiceAdapter* that follows this pattern although the power of Breeze transactional batch saves is largely wasted on such services. For examples see the [`AbstractRestDataServiceAdapter`](https://github.com/Breeze/breeze.js.labs/blob/master/breeze.labs.dataservice.abstractrest.js) and its derivatives in [**Breeze Labs**](/doc-breeze-labs/).

Some services accept a multi-part http POST request consisting of a batch of several individual save requests. That's how the Breeze OData *DataServerAdapters* implement `saveChanges()`.

<a name="successfulSaveResult"></a>

#### A Successful *saveResult*

When the server reports success, the `saveChanges` method should fulfill the deferred promise with a success *saveResult* object that describes the collection of saved entities. The schema for a *saveResult*  is:

- **entities**: an array of JSON data for the entities that were saved in a form that can be interpreted by this adapter's  `jsonResultsAdapter`. These data will be materialized as entities and merged into the `saveContext.entityManager`.  
- **keyMappings**: An array of *keyMapping* instances, one for each new entity that was saved with a temporary key. A *keyMapping* has the following properties:
    - **entityTypeName**: the full name of the `EntityType`
    - **tempValue**: the temporary value assigned on the client before the save.
    - **realValue**: the real value assigned on the server (typically by the database).
- **deletedKeys**: An array of *entityKey* instances, one for each entity that was deleted on the server (but were not deleted in the save bundle).  Each *entityKey* has the following properties:
    - **entityTypeName**: the full name of the `EntityType`
    - **keyValue**: the value of the key for a deleted entity
- **httpResponse**: The full http response object returned from the server.

As with the `executeQuery` method, the `EntityManager` uses the `JsonResultsAdapter` associated with this *DataServiceAdapter* to materialize entities from the *saveResult*'s `entities` array and merge them into cache. 

By "merge" we mean that previously added and modified entities are completely overwritten with server response data and entities that had been marked for deletion are removed from the cache.

Only entities in the `entities` array are merged. It's the responsibility of the *DataServerAdapter* `saveChanges` method to fully populate the `entities` array. 

<p class="note">If a saved entity is not mentioned in the <code>entities</code> array, Breeze won't update the status of the corresponding entity in cache and won't remove deleted entities.</p> 

Some service APIs do not return information about every saved entity. If your server doesn't return such information, you should add the pre-save, cached entity to `saveResult.entities` yourself. If your server returns partial information about a saved entity, your implementation should patch the corresponding pre-save entity as appropriate and add it to `saveResult.entities`.

>You know what entities you saved; they're in the `saveBundle.entities` collection.

Why does Breeze bother with the server's response? Why doesn't is simply reference the  original `saveBundle.entities`? There's a very good reason: the server may have updated some entity properties during the save. For example, the server could have incremented the optimistic concurrency properties or re-calculated certain total and sub-total properties.

You want to incorporate such changes in the cached entities as part of the "Save Changes" process rather than risk missing them or having to re-query the saved entities (a potentially expensive operation).  

If the web service can return entity updates in the save response body (as do OData services and services built with Breeze server-side components), the *DataServiceAdapter*'s `saveChanges` method can and should incorporate these updates in the entities of the `saveResult.entities` array.

##### a failed *saveResult* 

If the save request fails, the `saveChanges` method should reject the deferred promise with a failed *saveResult*. 

A failed *saveResult* is an error object that may contain specific information about which entities were rejected and why.

- **status**: The HTTP status of this failure
- **message**: A high level error message. 
- **httpResponse**: The full HttpResponse object returned from the server
- **entityErrors**: An (optional) array of *EntityError* instances. The errors in this collection are associated with and added to the *validationErrors* collection of the corresponding entities in the cache.  An *EntityError* has the following properties:
    - **errorName**: The name for this type of error. This name uniquely identifies the error within the `validationErrors` collection for the corresponding entity. 
    - **entityTypeName**: The name of the `EntityType` for the rejected entity. 
    - **keyValues**: The `EntityKey` values for the rejected entity. You can find that entity (if it is in cache) by combining these values with the `entityTypeName`.
    - **propertyName**: The property name, if available, that triggered the error
    - **errorMessage**: A detailed error message specific to this entity and property.

<a name="jsonResultsAdapter"></a>

#### jsonResultsAdapter

A property that returns the  [`JsonResultsAdapter`](/doc-js/server-jsonresultsadapter.html) that Breeze should apply when processing query and save results returned by this adapter. 
 
>The *jsonResultsAdapter* that Breeze actually uses can be overridden temporarily; see the [`JsonResultsAdapter` topic](/doc-js/server-jsonresultsadapter.html) for details.

<a name="checkForRecomposition"></a>

#### checkForRecomposition(*interfaceInitializedArgs*)

This method is optional. If defined, Breeze calls it after initializing any adapter of any type.  Your *DataServiceAdapter* should define a `checkForRecomposition` method only if it is dependent on another Breeze adapter and should do something when the dependent adapter changes.
  
- ***interfaceInitializedArgs*** Information about which adapter was initialized.

Most initializations are uninteresting so its important to confirm that the adapter in question is one that matters. Your code might look something like this:
    
    proto.checkForRecomposition = function (interfaceInitializedArgs) {
        // re-initialize if the default AjaxAdapter is re-initialized
        if (interfaceInitializedArgs.interfaceName === "ajax" && interfaceInitializedArgs.isDefault) {
            this.initialize();
        }
    };  

<a name="changeRequestInterceptor"></a>

### Adjust save request data with a *changeRequestInterceptor*

Often the `saveChanges` method of an existing Breeze *DataServiceAdapter* is *almost right* for you. Maybe it's off by just a small change to the data in the body of the save request. If only you could:

- remove data for an unmapped property.
 
- not send the original values for a particular property because (a) it is huge and (b) it's not needed or useful on the server.
 
- add a special authentication header to each individual request within an OData adapter's $batch payload.

You don't have to write a custom *DataServiceAdapter* to make these small adjustments. You could configure an existing adapter and setup the adjustment you need inside your application. 

All stock Breeze adapters have a `changeRequestInterceptor` option with which you can manipulate the change requests just before they're handed off to the AJAX adapter. 

Here's the basic plan:

    // get the current DataServiceAdapter
    var adapter = breeze.config.getAdapterInstance('dataService');

    adapter.changeRequestInterceptor = function (saveContext, saveBundle) {
        this.getRequest = function (request, entity, index) {
            // alter the request that the adapter prepared for this entity
            // based on the cached entity, saveContext, and saveBundle
            // e.g., add a custom header or prune the entityAspect.originalValuesMap
            return request;
        };
        this.done = function (requests) {
            // alter the array of requests representing the entire change-set 
            // based on the saveContext and saveBundle
        };
    }

You're setting the adapter's `changeRequestInterceptor` to a constructor function that creates an object with two functions: `getRequest` and `done`.

The *DataServiceAdapter* calls your constructor function just as it begins to build the change-set requests array. It calls `getRequest` for each entity in the change-set and calls `done` after adding the last request to the array of requests.

The adapter gives you a lot of contextual information in the constructor via the `saveContext` and the `saveBundle`. The details of the `saveContext` are mostly the same across adapters although there may be small differences from adapter to adapter. You can dip into these objects in your `getRequest` and `done` functions as necessary.

You'll have to know something about the *DataServiceAdapter* in order to manipulate its save request data. A "request" in a Web API adapter will be a JSON representation of the raw entity data. The "request" in an OData API adapter will be an HTTP request. Know what you're doing and be careful. The server will complain if you send what it regards as a bad request.


#### Example

You'll find examples in the [changeRequestInterceptorTests](https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode/tests/changeRequestInterceptorTests.js "changeRequestInterceptorTests in DocCode") of the DocCode sample.  Here's an example similar to one of those tests:

    
	// Get the current Web API adapter
	var dsAdapter = breeze.config.getAdapterInstance('dataService', 'webApi');

    // Add the interceptor
    dsAdapter.changeRequestInterceptor = function (saveContext, saveBundle) {

        // clear the original value for any "Notes" property as it could be very large ;-)
        this.getRequest = function (request, entity, index) {
            var map = request.entityAspect.originalValuesMap;
            if (map.Notes) { 
               // Null the original value but KEEP the property name.
               // The existence of this property name tells the server you want to update it
               // with the current value in the request body.              
               map.Notes = null; 
            }
            return request;
        };

        this.done = function (requests) {}; // do nothing when done
    }

    // ... later

    employee.setProperty('Notes', someNotes);
    em.saveChanges().then(inspect).finally(start);

    function inspect(saveResult) {
        var empData = saveResult.entities[0];
        equal(empData.entityAspect.originalValuesMap.Notes, null, "should send null for 'Notes' in orig values");
    }

<a name="changeRequestInterceptor-when-to-use"></a>

#### When to use the *changeRequestInterceptor*
The [*AJAX adapter*](/doc-js/server-ajaxadapter.html) has a `requestInterceptor` and the *DataServicAdapter* has a `changeRequestInterceptor`. Why both?

You might get by with the AJAX adapter's `requestInterceptor` alone. It has the last look at the *entire* AJAX request just before the AJAX component turns it into an HTTP request. You can change *anything* about that request including the data element in the request body.

However, it is far more convenient to manipulate the change-set request data with the `changeRequestInterceptor`. 

* it is only called during a save so you can focus on that problem specifically

* its methods receive detailed information about that save via the parameters passed to the constructor (`saveContext` and `saveBundle`) and to the interceptor's two methods

* its methods are called for each entity separately and at the end when the request data are fully composed.

In contrast, the AJAX adaptor's *requestInterceptor* is called for *every* `EntityManager` server-directed method (`fetchMetadata`, `executeQuery`, as well as `saveChanges`) and has *no context* to help it reason over the request. It would be much more complicated to adjust the details of a save with this interceptor alone.

You may find yourself using both interceptors: the *AJAX adapter*'s `requestInterceptor` for the big picture and the *DataServiceAdapter*'s `changeRequestInterceptor` for fine-grained details of a save. 
