---
layout: doc-js
redirect_from: "/old/documentation/abstractdataservice-adapter.html"
---

# The AbstractDataServiceAdapter

The *breeze.AbstractDataServiceAdapter* is an implementation of the [***DataServiceAdapter*** interface](/doc-js/server-dataserviceadapter.html#api-detail) that satisfies the basic requirements of many *DataServiceAdapters*.

It uses the default [*AjaxAdapter*](/doc-js/server-ajaxadapter.html) to make HTTP AJAX calls to web services and it can perform most of the `EntityManager` web service operations with very little help from you.

Many people feel it is easier to write a custom adapter that derives from `AbstractDataServiceAdapter` and overrides or extends its members than to write a completely original adapter from scratch. 

This adapter is designed for web services that accept batch save requests consisting of entity change-set payloads. OData services and web services that understand the Breeze change-set protocol fall in this category.

>If your web service does not work this way (most "REST" APIs do not), take a look at the [`AbstractRestDataServiceAdapter`](https://github.com/Breeze/breeze.js.labs/blob/master/breeze.labs.dataservice.abstractrest.js) and its derivatives in [**Breeze Labs**](/doc-breeze-labs/) instead. 

A *DataServiceAdapter* derived from `AbstractDataServiceAdapter` could look something like the following:

	var ctor = function CustomDataServiceAdapter() {
	    this.name = 'myCustomAdapter'     
    }
    
    var proto = ctor.prototype; // we'll reference the prototype a lot

    // inherit from the AbstractDataServiceAdapter
    proto = new breeze.AbstractDataServiceAdapter();
  
    // custom implementations of specific adapter members such as ...
 
    proto.fetchMetadata = throwFetchMetadataNotImplemented;
    proto.jsonResultsAdapter = new JsonResultsAdapter( { ... custom config .. } );
    proto._prepareSaveBundle = myPrepareSaveBundle;
    proto._prepareSaveResult = myPrepareSaveResult;

Notice that we override selected members of the abstract adapter to meet the requirements of the targeted web service API.

Your derived adapter **probably will NOT override** the following methods.  

   - **initialize**: initializes and caches the current *AjaxAdapter* for use in other methods.

   - **checkForRecomposition**: re-initializes this *DataServiceAdapter* if you change the current *AjaxAdapter*.

   - **fetchMetadata**: fetches the server-side metadata by placing a GET request to the current `dataService`'s base URL plus a '*/Metadata*' extension. It expects the server to return metadata in 'odata', 'csdl' or 'breeze' format. It automatically merges the these metadata into the specified `metadataStore`. 

   	You *might override* this method to process a custom metadata format or to throw an error if your server doesn't provide metadata. 

   - **executeQuery**: translates the current EntityQuery into a url using the current dataService and the current 'uriBuilder' adapter and then performs an http GET request with this url.

   	You *might override* this method to customize the query url without using a 'uriBuilder' or if you want to pre-process the query results before handing them to the current `jsonResultsAdapter`.

   - **saveChanges**: manages the save pipeline from building the request to processing the response.
   
   	You might override `saveChanges` if your adapter cannot or should not save changes (in which case it should throw a meaningful error).
   
    This implementation delegates some of critical decisions to semi-private [`_prepareSaveBundle`](#_prepareSaveBundle) and [`_prepareSaveResults`](#_prepareSaveResults) helper functions.  
	If your derived adapter can save changes, you **must implement** these two helper functions. 

	Leave the `saveChanges` method alone as it handles the rest of the save workflow for you. That workflow includes sending a POST request to the service with the save data in the body and handling exceptions returned by the server if the save fails. It also adds the `saveContext` to the `saveResult.httpResponse` (both success and failure cases) for debugging purposes.


You **MIGHT override** 

- **jsonResultsAdapter**: the property that returns the `jsonResultsAdapter` to be used for this *DataServiceAdapter*. Both the `executeQuery` and the `saveChanges` methods use this `jsonResultsAdapter`. 

	You'll probably override this property if your web service serializes query and save responses in a way that the native `jsonResultsAdapter` did not anticipate. 
	
	See the "[JsonResultsAdapters](/doc-js/server-jsonresultsadapter)" topic for more details.


You **MUST implement** the following two `saveChanges` helper methods if your adapter can save changes. 
	
<a name="_prepareSaveBundle"></a>

- **\_prepareSaveBundle**(*saveContext*, *saveBundle*)

	Converts the entities-to-save into the data object that you want to send to the server. 
	
	- ***saveContext*** - the `saveContext` passed to `saveChanges` (with additional material).
	- ***saveBundle*** - the `saveBundle` passed to `saveChanges`
	- **returns** the data object you want to send to the server 
	
	The `saveContext` is the same object passed to `saveChanges` plus an `adapter` property that returns the active *DataServiceAdapter* instance.
	
	Your implementation iterates over the entities-to-save (the `saveBundle.entities`), building a data object that is ready to send to the server.
	
	The `AbstractDataServiceAdapter.saveChanges` method passes your data object through `JSON.stringify` and on to the body of an http POST which it sends to an URL composed from the `saveContext.dataService` and `saveContext.resourceName` properties.  

<a name="_prepareSaveResult"></a>

- **\_prepareSaveResult**(*saveContext*, *data*)

	Constructs the [*saveResult*](#successSaveResult) when the server responds after a successful save.
	
	- ***saveContext*** - the `saveContext` passed to `saveChanges` (with additional material).
	- ***data*** - the raw data from the server's http response
	- **returns** the success *saveResult* minus the `httpResponse` 
	
	`AbstractDataServiceAdapter.saveChanges` calls this method after a successful save request.
	
	The `saveContext` is the same object passed to `saveChanges` plus an `adapter` property that returns the active `DataServiceAdapter` instance.
	
	This method does not have access to the full http response and therefore cannot set the `saveResult.httpResponse` property. The `AbstractDataServiceAdapter.saveChanges` method sets that property just before returning the result to the `EntityManager`.
