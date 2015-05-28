---
layout: doc-main
---
#Breeze Release Notes

These are the release notes for the current **1.5.x** and 1.4.x releases.

Prior <a href="http://www.breezejs.com/previous-release-notes" target="_blank">release notes</a> are also available.

##1.5.x
* New json query api and query serialization support.  See: <a href="/doc-js/query-using-json.html">Breeze queries with JSON documentation</a>
* New full stack breeze server using the NodeJS Sequelize package to provide server side javascript support for MySql/MariaDb/Postgres databases. 
See: <a href="/doc-node-sequelize/"> breeze-sequelize package</a>
* Support for ASP.NET WebApi 2.2

##1.4.x#
* Query support for Any/All.
* [Web API OData Sample](#WebApiOData)
* [Ruby on Rails sample](#ruby)
* [Zza! Node/MongoDB sample](#Zza)
* [Todo-Zumo sample](#todoZumo) for Azure Mobile Services
* [MongoDB integration](#140)
* [NHibernate support](/doc-net/nh.html) with an [NHibernate sample](/doc-samples/north-breeze.html)
* Support for OData V3, Visual Studio 2013, ASP.NET Web API 2.1, and Entity Framework 6

###<a name="154"></a>1.5.4 <span class="doc-date">May 5, 2015</span>###

#### Breeze.Js Features
- Additional support for Java and Node backend servers. [https://github.com/Breeze/breeze.server.java](https://github.com/Breeze/breeze.server.java) and [https://github.com/Breeze/breeze.server.node](https://github.com/Breeze/breeze.server.node)
- Support for 'passThru' anon type nodes in the JsonResultsAdapter: See: [http://www.getbreezenow.com/documentation/jsonresultsadapters](http://www.getbreezenow.com/documentation/jsonresultsadapters) (F2317)
- The *EntityQuery.inlineCount* method now works with cache (local) queries as well as remote queries [http://stackoverflow.com/questions/16935885/breezejs-inlinecount-when-using-fetchstrategy-fromlocalcache](http://stackoverflow.com/questions/16935885/breezejs-inlinecount-when-using-fetchstrategy-fromlocalcache) (F2267)
- The breeze integer range validator (*intRangeValidator*) now contains the *min* and *max* values within its provided context object. (F2316)
- Misc. performance optimizations for large local caches.

#### Breeze.Js Bugs
- Breeze will now throw an exception when an attempt is made to export or import detached entities.  (D2669)
- Change notification and change management (*EntityManager.hasChanges* and *EntityManager.hasChangesChanged*) bugs relating to array properties have now been fixed. Previously changes would be reported when querying an entity with array properties for the 2nd time. (D2672)
- *Event.isEnabled* method was broken; now fixed. (D2673)
- *Predicate.and* and *Predicate.or* methods no longer throw exceptions when given array of predicates. (D2675)
- API documentation for *Predicate.and/Predicate.or* has been corrected. (D2674) 

#### Breeze.server.java
- Full Breeze support for Hibernate - same feature set as .NET and Node. [https://github.com/Breeze/breeze.server.java](https://github.com/Breeze/breeze.server.java)
- (Samples in progress)


#### Breeze.server.net Features
- Converted existing CORS samples to use Web API 2 CORS support

###<a name="153"></a>1.5.3 <span class="doc-date">Jan 21, 2015</span>###
<a name="breeze-client-news"></a>
#### Breeze Package Revisions

**There are two new package names: *breeze-client* and *breeze-client-labs***.

<p class="note">This is a breaking change for every app that loaded Breeze (or Breeze Labs) through the <em>breezejs</em> bower or npm packages. You'll want to update your <em>bower.json</em> and <em>package.json</em> files accordingly and update your <em>index.htm.</em> files to load the scripts that you need from their new locations.  The former <em>breezejs</em> packages have been retired and are frozen at BreezeJS version 1.5.2.</p>

We made this change because:

* BreezeJS core and Breeze Labs have different release cadences, authors, audiences and levels of support. 
* *Every* core Breeze adapter is available in *breeze-client* so you can pick exactly the files you need.
* The **"breeze.angular" service was promoted** to Breeze core as a **"bridge" adapter (*breeze.bridge.angular.js*)**. It is no longer in Breeze Labs (*breeze.angular.js* has been removed); note the file name change as well!

The *breeze-client* package has three levels:

    breeze.debug.js
    build
        breeze.debug.js
        breeze.min.js
        breeze.base.debug.js
        breeze.base.min.js
        adapters
            ... all core adapters ...

#### Breeze.JS Features
- *EntityManager.exportEntities* can now export as either a JSON object or a string (F2304)
- *EntityManager.exportEntities* can now optionally export just entities of specified types. (F2305)
- Predicates will now also recognize the *FilterQueryOp* symbol name as well as all other defined aliases. (F2309)
- Predicates will now accept moment.js dates as valid dates. (F2310)
- ***breeze.angular*** service promoted to core. Look for [*breeze.bridge.angular.js*](https://github.com/Breeze/breeze.js/blob/master/build/adapters/breeze.bridge.angular.js) in core adapters (**breaking change: new name, new location**).  The *breeze.angular* **NuGet package** has been updated as well. Deprecated the former *breeze.angular.js* in Breeze Labs.

#### Breeze.Net server features
- *SaveWorkState.BeforeSave* now defers setting the *EntitiesWithAutoGeneratedKeys* property until AFTER calling 'BeforeSaveEntities'. This in turn allows `BeforeSaveEntities` to add and remove *EntityInfos*, involving *AutoGeneratedKey* values. (F2311)

#### Breeze.Server.Node features
- A new 'breeze-sequelize' npm package is now available that supports the use of breeze with 'Sequelize' and offers support for any SQL databases that 'Sequelize' supports. This means that a breeze application can now be written completely in javascript on both the client and <strong>the server.</strong>: See http://www.getbreezenow.com/sequelize-mysqlpostgressql-lite 
 
#### Breeze.JS bugs
-  *EntityQuery.fromEntities* will now throw an explanatory error when trying to refresh an array of entities of more than one type. (D2565)
-  Merge of deleted items will now correctly update related navigation properties. (D2662)
-  *EntityManager.hasChanges*(['type']) no longer bombs when there is no EntityGroup for the specified type. (D2663)
-  Breeze's internal ES5 checking logic can no longer collide with external library implementions. (D2664)
-  Fixed breeze adapters to work properly when loading breeze adapters with requireJs. (D2666)

###<a name="152"></a>1.5.2 <span class="doc-date">Dec 10, 2014</span>###

#### Breeze.JS Features
- Xml files used for Visual Studio intellisense are now included in Breeze zip download. (F2293)
- In order to facilitate debugging, all constructors within breeze are now named. This change allows most browser debuggers to better visualize any breeze objects. (F2295)
- Duplicate entities, i.e multiple entities with the same key, are now permitted as the result of queries. Previously the existence of duplicates would throw an exception during the query if these entities did not already exist within an EntityManager.  This will no longer occur, unless a MergeStrategy of 'Disallowed' is explicit in the query. (F2299)   

#### Breeze.JS bugs
-  Fix for error when adding where clause to query object when fromEntityType is set. (D2643)
-  Fix for error in EntityAspect.rejectChanges involving arrays of ComplexTypes. (D2642)
- Fix for case where a Navigation property should be null after a foreign key change where the newly referenced entity is not in cache. (D2644)
- Fix for case where an unmapped property defined on entityType is not available when model=backingStore. (D2646)
- Fix for EntityManager.saveChanges failing when  
   - a new entity that was part of the pending save is deleted before the server responds. (D2649 )
   - the entityManager is cleared before the server responds. (D2650)
- Fix for bug where entityManager.hasChanges() is wrong after a save if a change was made while the save was still pending. (D2651)
- Fix for bug Event.isEnabled('entityChanged', manager). (D2652)
- Fix for bug where a "(" is encountered on on the right hand side of a predicate expression. (D2653)
- Fix to Breeze.base.js so that it does not to initialize ANY breeze adapters. If you want to compose a breeze package with breeze.base.js, you must provide at least one instance of each adapter explicitly. (D2654)

###<a name="151"></a>1.5.1 <span class="doc-date">Sept 24, 2014</span>###

#### Breeze.JS Features

- New EntityQuery facilities to support the new JSON query definition syntax. (Described on the breeze web site). (Note: these changes involved large scale changes to the 
<strong><em>internal </em></strong>properties and methods on both the EntityQuery and Predicate classes. The external api has been extended as a result, but
there should be no breaking changes). This JSON syntax ***complements*** the "fluent" method-chaining syntax that you already know.
- Support for EntityQuery.toJSON and Predicate.toJSON allows queries and predicates to be saved, possibly offline, for later use. (F2288)
- New predicate operator: 'in'.  This operator can be used to query if a property has a value that is among a list of specified values: Example: 

         var countries = ['Austria', 'Italy', 'Norway']
         var query = EntityQuery.from("Customers")
            .where("country", 'in', countries);

#### Breeze.JS bugs
-  Fixed issues with merging an added entity into a deleted entity. (D2631)
-  The **`resolveProperty`** method is now defined for `NavigationProperties` as well as `DataProperties`. (D2634)
-  Fixed bug where `EntityManager` would only raise the first `EntityStateChange` event for each entity. (D2635)
-  Fixed bug so that a locally 'deleted' entity will not appear in server query results (unless `includeDeleted` flag is set to true). (D2636)
-  Fixed bug where calling **`rejectChanges`** on a entity with collection of complex types would 'double' the complexType collection.(D2639)
-  Fixed bug where the **`entityChanged`** event was not firing reliably when deleting an entity. (D2640).
-  **'expand'** clauses now are validated before being sent to the server in the same manner as 'where' and 'orderBy'. Previously, some invalid or 'partially' valid clauses could go to the server. (F2286). This fix *can break existing queries* with expand clauses that used server property name casing (e.g. "Customer") instead of client property name casing (e.g, "customer") when the `NamingConvention` is in play. 

#### Breeze.Server.NET Features
- Added **`EnableBreezeQuery`** attribute to support WebApi 2.2. This replaces and supersedes the `BreezeQueryable` attribute which is deprecated. 

###<a name="1500"></a>1.5.0 <span class="doc-date">Aug 30, 2014</span>###

#### Breeze.JS Features
-  Support for ASP.NET WebApi 2.2

###<a name="1417"></a>1.4.17 <span class="doc-date">Aug 19, 2014</span>###

#### Breeze.JS Features
-  Added *DataProperty.getAllValidators*, *NavigationProperty.getAllValidators* and *StructuralType.getAllValidators* methods. The methods are useful because they  drill into the type hierarchy to discover all appropriate validations. (F2280)
-  Added *EntityAspect.setAdded* and *EntityAspect.setEntityState* methods. (F2284)
-  Added a 'httpResponse' property to all OData results. (F2228)
-  Added a *EntityType.qualifyTypeName* static method. (F2279)

#### Breeze.JS bugs
- Fixed bug with automatic parent/child fixup in models with inheritance hierarchies.  (D2625)
- Fixed bug with validators defined on base type properties not always appearing on subtypes. (D2626)
- EntityState was not being updated correctly when merging an added entity into a deleted entity with a MergeStrategy of OverwriteChanges. (D2631)
- Validation messages using the 'displayName' of a base class property were not being applied properly to subtype validations. (D2633)
- Fixed bug where devs were unable to customize the intRangeValidator message template. (D2632) 
- The 'webApiOdata' dataService adapter now calculates the url for nested $batch requests based on the entire dataService.serviceName pathname rather than just the last segment of that pathname. This change is harmless for most (anyone with a single segment pathname such as 'odata/') but could break devs who relied on the "last segment" interpretation and had multi-segment pathnames. We don't think anyone fits that description; let us know if you do. (D#2627)
 
#### Breeze.Server.Net Bugs	
- Custom top level save exception messages thrown with an EntityErrorsException were not being propagated to the client. (D2629)
###<a name="1416"></a>1.4.16 <span class="doc-date">July 13, 2014</span>###

#### Breeze.JS Features
- Added new *EntityAspect.isNavigationPropertyLoaded* and *EntityAspect.markNavigationPropertyLoaded* methods.  These methods were added to allow a developer to determine if a navigation property is empty as a result of a fetch or simply because it has not yet been loaded. (F2183)
- Added a new *MetadataStore.metadataFetched* event that is fired immediately after  a *MetadataStore* has fetched and processed the metadata returned by a remote service.  (F2274)
- Added the ability to set the *DataProperty*/*NavigationProperty* 'displayName' property after metadata has already been fetched. This may now be done via the *setProperties* method. This allows for customization of validation error messages after metadata has been fetched. (F2258)
- Added the ability to set the *NavigationProperty* metadata properties 'foreignKeyNames' and 'invForeignKeyNames' after metadata has already been fetched.  This is done via the *NavigationProperty* *setProperties* method. This feature was added to allow for backend metadata providers that do not provide foreign key information. With such providers you can fetch the metadata and then within the the *metadataFetched* event add the missing foreign key metadata.  (F2244) 
- Added a new optional context parameter 'allowEmptyStrings' to the 'required' Validator. ( F2214)
- The undocumented *EntityQuery.entityType* property has been renamed    *EntityQuery.fromEntityType* and has been documented.  This is a breaking change only if you used this previously undocumented feature. (F2277) 
- The *breeze.modelLibrary.backbone* has been moved out of *breeze.debug.js* and *breeze.min.js*. This was to shrink the size of the main breeze libraries.  *Backbone* support is still available by simply adding the *breeze.modelLibrary.backbone.js* file to any project. (This is a potential breaking change - but can be easily remediated by simply downloading the file above as well as either breeze.debug.js or breeze.min.js.)
- Added better argument checking and explanatory messages to the *EntityManager.exportEntities* and *MetadataStore.registerEntityTypeCtor* methods. (F2266, D2589)
  
#### Breeze.Server.Net Features	
- .pdb files are now provided within the breeze-runtime-1.4.16 zip file ( available on the website).  


#### Breeze.JS bugs
- Fixed issue with saves failing when 'key/foreign key' properties were being defined on the base class of an inheritance hierarchy. (D2619)
- Fixed issue with *EntityManager.importEntities* failing for entities with derived navigation properties. (D2623)
- Fixed issue where the *EntityManager.entityChanged* event was fired before the *EntityManager.hasChanges* method could return true. (D2620)
- Breeze now supports validations on nonscalar complex types.  Previously these were just ignored.(D2621)
- Fixed issue with *EntityManager.saveChanges* incorrectly serializing changes to arrays of complex types. (D2596)
- Fixed issues with inheritance and *Backbone*.  The *breeze.modelLibrary.backbone.js* library now correctly handles all inheritance hierarchies that the 'backingStore' and 'knockout' model libraries do. (D2624)
- Removed inadvertent global instance of <em>breeze </em>when using 'requireJs'. (D2618)

###<a name="1414"></a>1.4.14 <span class="doc-date">June 23, 2014</span>###

#### Features
- Additional OData documentation.
- New [**ChangeRequestInterceptor**](/doc-js/server-ajaxadapter.html#changeRequestInterceptor) for customization of the request data that `EntityManager.saveChanges` sends to the server. 
	

#### Breeze.JS bugs
- D2579 - Fixed bug where the EntityQuery.noTracking option would not allow unmapped server props to go to the client from the server.
- D2607 - Fixed bug with EntityManager.SaveChanges nullable types in originalValuesMap not converting in all cases
- D2608 - Fixed Incorrect of validation of ComplexType 'custom' metadata as a boolean.
- D2610 - Handle casing correctly for unmapped properties.  Previously unmapped properties would not go thru the registered namingConvention when registered late. *Note: this could be a breaking change if you were counting on the previous 'errant' behavior*    
- D2611 - Fixed bug where NavigationProperty fixup was not always occurring when parents were created after children. 
- D2612 - Fixed temporary key generation and fixup bug.
- D2613 - Corrected truncation of unmapped numeric properties to Integer when retrieved from server.


- D2614 - bug generating odata urls when using anon entity types before real entity types are avail


#### Breeze.Server.Net bugs

- D2567 - Fixed EFContextProvider exception that would occur during the save of a deleted entity with at least one modified enum property. 
- D2609 - Corrected metadata retrieval to correctly handle Database First defaultValue specifications retrieved from the EntityFramework CSDL.	

###<a name="1413"></a>1.4.13 <span class="doc-date">June 2, 2014</span>###

#### Features

- Breeze samples in breeze.js.samples are now self-contained. (i.e. no other repositories are needed to run these samples.).
- Reduced memory footprint for entities retrieved via OData. 
- Improved Breeze OData/WebApi documentation. see: http://www.breezejs.com/documentation/odata-server
- JavaScript "use strict" now applied globally to all breeze libs.
	
#### Bugs
- D2574 - Fixed multiple bugs related to using Breeze with Microsoft's WebApiOData.
- D2599 - The Breeze EntityQuery.withParameters method when using the Angular dataservice adapter now handles null parameters according to JQuery ajax conventions.  Previously null parameters were handled in an ambiguous manner.
- D2600 - Improved error messages when missing foreign key props in metadata.  
- D2601 - Fixed NHibernate bug involving a nullReference with nested expand.
	
#### Breaking changes
- D2574 - Attention OData JsonResultsAdapter authors.  The `entityAspect.extraMetadata` is now preserved by `exportEntities`. While fixing, we changed the related property of the  `JsonResultsAdapter.visitNode` result from `result.extra` to `result.extraMetadata`. Correct your JsonResultsAdapter accordingly.

- D2602 - "After save the `entityAspect.propertyChanged` event is no longer raised for a property that was changed on the server". Actually propertyChanged **is still raised** in that situation. But Breeze only **raises the event once**. The value of the `propertyChangedArgs.propertyName` is `null` which means "many properties changed". This behavior [**was described in the API documentation**](/doc-js/api-docs/classes/EntityAspect.html#event_propertyChanged).   Previously Breeze raised a separate event for *each changed property individually* for every merged entity ... which may have been convenient but was not correct . If you relied on the (incorrect) behavior, you will experience the proper behavior as a breaking change.

###<a name="1412"></a>1.4.12 <span class="doc-date">May 9, 2014</span>###

#### Features

- Ajax adapter enhancements, specifically the addition of the `requestInterceptor` to enable fine-tuning of a Breeze AJAX request such as timeout and mock response. See the new documentation, ["Controlling AJAX calls"](/doc-js/server-ajaxadapter.html).
- D2257 - Improved data type inference for unmapped properties defined in a constructor. 
- Improved documentation on Breeze web site and in API Docs.
<a name="todoZumo"></a>
- Added ["Todo-Zumo" to Breeze samples](/doc-samples/todo-zumo): Breeze + Angular + Azure Mobile Services
- Additional samples in the Breeze samples zip.
	
#### Bugs
+ D2580 - Breeze *startsWith* predicate behaves differently on server v. cache when empty strings are involved. Fixed.
+ D2581 - Detached entity throws unhelpful exception when call *EntityAspect.setXXX()*  is made.
+ D2582 - Detaching an entity shouldn't clear foreign key values. ( because you may want to reattach it later). Fixed.
+ D2590 - *dataserviceadapter* throws if ajax call throws as opposed to returning a failed promise. Fixed. 
+ D2591 - Validation error formatter has issues with 0 valued parameters. Fixed.
+ D2592 - *EntityAspect.validationErrorsChanged* not firing when removing server - errors before a save. Fixed.
+ D2593 - Error with "use strict" and breeze attempting to set unwritable ES5 props.  Fixed by insuring that Breeze will no longer attempt to write to any 'unsettable' ES5 properties. 
	
#### Breaking changes
+ D2588 - Renamed *Enum.seal* because it conflicts with *Object.seal*. New name is *Enum.resolveSymbols*.


#### Notes
+ We have just released a [*Breeze.sharp*]  (http://www.breezejs.com/breeze-sharp) product that is fully compliant with any server built for Breeze.JS.  This is a .NET client that has an almost identical API to that of the Breeze.JS product. We are also working on a *Breeze.java* client.             

###<a name="1411"></a>1.4.11 <span class="doc-date">Mar 7, 2014</span>###

#### Features
+  Performance improvements with large saves and large queries that overwrite existing modified entities. 
+  <a name="WebApiOData"></a>New [**Web API OData Sample**](http://www.breezejs.com/samples/breeze-web-api-odata), an MVC/SPA hybrid written with Javier Calvarro  Nelson, a member of the Microsoft Web API OData team. This effort prompted numerous small changes to Breeze core that enriched exposed functionality w/o changing underlying behavior.
+  The [Angular Todo Sample](http://www.breezejs.com/samples/todo-angular) has been spruced up. It's been upgraded to Angular v.1.2 and the new ["Breeze Angular Service"](http://www.breezejs.com/documentation/breeze-angular-service) module.
+  Breeze 'ajax' adapters accept headers configuration; useful to authors of Breeze 'dataService' adapters. 
+  `EntityQuery.fromEntityKey` specifically targets the `EntityType` of the `EntityKey` and casts query results into that `EntityType`.

+ New or changed in Breeze Labs

	+ **Breeze Angular Service**, a new [*breeze.angular.js*](http://www.breezejs.com/documentation/breeze-angular-service) module that configures your Breeze/Angular client app for Angular in "Angular-style". Sets the right 'model library', `$q` for promises, and `$http` for ajax calls. It has its own [nuget package](https://www.nuget.org/packages/Breeze.Angular/).

	+ **getEntityGraph** extends `EntityManager` so you can retrieve a root entity *and its related entities* from cache as an array. [Read why and how](http://www.breezejs.com/breeze-labs/getentitygraph) in the breeze labs documentation.
	
	+ **metadata-helper** (updated) library to make  hand-coding Breeze metadata in JavaScript a bit easier. Now a [nuget package](https://www.nuget.org/packages/Breeze.Metadata.Helper/).
	
    + **EdmBuilder**, a tiny C# class that generates Breeze-compatible metadata for a Web API OData backend. See the [Web API OData sample](http://www.breezejs.com/samples/breeze-web-api-odata).

 	+ **SharePoint 2013 + Angular + Breeze** - a composite [nuget package](https://www.nuget.org/packages/Breeze.Angular.SharePoint/) that delivers in one package all the Breeze stuff you need to build the app. We're really close to  announcing a SharePoint/Angular/Breeze sample built by Andrew Connell.     

	+ **SharePoint 2013 OData DataService Adapter**, included in the SharePoint/Angular package, this is independent of Angular and therefore suitable for a Breeze application that doesn't use Angular. Best acquired [from nuget](https://www.nuget.org/packages/Breeze.DataService.SharePoint/).

	+ **breeze.directives.validation** is in the middle of a rewrite to enable richer options for developer configuration. The code has changed, the behavior ... not yet (at least not intentionally).

	+ **Angular.MidwayTester** - a [nuget package](https://www.nuget.org/packages/Angular.MidwayTester/), delivering [Matias Niemelä's Angular test library](https://github.com/yearofmoo/ngMidwayTester) (with his kind permission) for async testing. Great for testing that your Breeze client is talking to your server in the ways you expect.

+ Deprecated in Breeze Labs

	+ *breeze.angular.q* - use the "Breeze Angular Service" instead
	+ *to$q* - de-documented; use "Breeze Angular Service"  
	
#### Bugs
+ ( v 1.4.9 - removed and replaced with this version)
+ Fixed bug involving fixup of unidirectional multipart keys.
+ Fixed regression bug introduced in 1.4.9 involving multipart key fixup after save.
+ Chrome 33/Minification bug - Can't repro this bug but we think this is the fix...
+ Fixed bug where queries with MergeStrategy.OverwriteChanges were not firing EntityStateChange events.
+ Fixed bug with EntityManager.fetchEntityByKey when metadata had not yet been fetched. 
+ Fixed bug with EntityAspect.getValidationErrors and complex property names.
+ Fixed bug with failed promise handling ( edge condition).
+ Misc Api Documentation fixes.
+ NHibernate: Fixed bug with `$expands` on subclasses.
+ NHibernate: Fixed bug with save order when saving related entities.
+ NHibernate: Fixed bug with deletes and one-to-one mappings.
+ NHibernate: Fixed bug with saving when foreign key references identifier of derived class.
+ NHibernate: Added missing `invForeignKeyNamesOnServer` to metadata.
+ NHibernate: Fixed bug with unchanged entites in saveMap. Now they get related but not saved.
+ NHibernate: Changed `NHContext` method signatures from private to protected to ease overriding of `SaveChangesCore` by subclasses.


	
#### Breaking changes
+ None                

###<a name="148"></a>1.4.8<span class="doc-date">Jan 7, 2014</span>###

#### Features
+ Updated Breeze-MongoDB npm package ( version: 0.0.6). 
   + Support for queries using FilterQueryOp.Any and FilterQueryOp.All in MongoDB.
+ NHibernate support for Web API 2
   + Including two new NuGet packages: Breeze.WebApi2.NH and Breeze.Server.ContextProvider.NH
+ Improved JSON serialization performance for NHibernate for both Web API and Web API 2. 
	
#### Bugs

+ Corrected issue where Breeze tries to load Angular with RequireJS when it shouldn't.
+ Metadata resolution fix to remove inadvertent dependence on foreign key naming conventions.   
+ Fixed bug with query filters against Int64 fields.
+ Fixed bugs with query filters using OData numeric and date functions not functioning properly for local queries.
   + For example: var p = Predicate.create("year(OrderDate)", Qop.Equals, 1996);
+ Fixed bugs with query filters involving searches for strings containing single quotes.  
+ NHibernate specific WebApi/WebApi2 fixes:
   + Fixed error performing saves when foreign keys are defined on a base class.
   + Fixed bug that could cause NHibernate Session to be left open if an exception is thrown.
   + Breeze will now throw an exception when trying to save a entity with a key modification in EF, which EF prohibits. ( but may be permitted in other environments). 
  + Fixed support for OData $expand expressions (bug was only present in WebApi2)
+ MongoDB specific fixes:
	+ Fixed bug with EntityQuery 'top(0)' not working properly.
	+ Fixed bug with query filters for strings containing single quotes.
	
#### Breaking changes
+  Breeze previously required that any single quotes within a query string be manually escaped within an EntityQuery.  This is no longer required ( and will in fact cause the query to fail). 

         // Old Code 
         var q = EntityQuery.from("Employees").where("lastName", "contains", "O''Malley");
         // should be converted to 
         var q = EntityQuery.from("Employees").where("lastName", "contains", "O'Malley");
             
###<a name="147"></a>1.4.7<span class="doc-date">Dec 12, 2013</span>###

#### Features
+ New and Updated documentation:
	+ [Entity serialization](/doc-js/entity-serialization.html)
	+ [Export/Import](/doc-js/export-import.html)
	+ [Query Result Debugging](/doc-js/query-debugging.html)
	+ [The ContextProvider](/doc-net/contextprovider.html)
	+ [Todo-Require sample](/doc-samples/todo-knockout-require.html) explains building a Breeze app with RequireJS
	
#### Bugs  

+ Fixed bug where Entity Framework key modification save errors were not being propagated to the Breeze client.
  + Breeze will now throw an exception when trying to save a entity with a key modification in EF, which EF prohibits. ( but may be permitted in other environments).
+ Fixed null reference exception that could occur in *EntityAspect.getValidationErrors*.
+ Fixed *EntityManager.importEntities* bug that would create originalValues changes when it should not.
+ Fixed bug with incorrect inlineCount in any EntityQuery involving the combination of the inlineCount, select, and top/skip methods.
+ Fixed bug where *EntityAspect.setDeleted()* would not clear a related entity relation when no inverse property was defined.
+ Fixed the *EntityQuery.noTracking* method to insure that the method always returns a cloned query. ( like all of the other EntityQuery builder methods). 
+ Fixed IE8/ES5 property descriptor bug.

###<a name="146"></a>1.4.6<span class="doc-date">Nov 23, 2013</span>###

#### Features

+ The ability to perform an EntityQuery involving the "any" or "all" operators ( also aliased as "some" and "every") has been added.
 
>For more info see 
<a href="/doc-js/query-examples.html#Where clauses with any/all conditions on related properties">**Entity Query Any/All conditions**</a>

<a name="notracking"></a>
+ An *EntityQuery.noTracking* method has been added to allow EntityQueries to return simple JavaScript objects instead of Breeze entities. The method accept a single optional boolean parameter that determines whether or not the noTracking capability should be enabled. If this parameter is omitted, true is assumed. 

    With 'noTracking' enabled, the results of the query  will not be coerced into entities but will instead look like raw JavaScript projections. i.e. simple JavaScript objects. However, the following "entity" services will still be performed

		a) graph cycle resolution
		b) property renaming
		c) datatype coercion

    Note that any *EntityQuery.expand* will still work with 'noTracking' queries and will return parent entities with attached children all as simple js objects.
   
    These objects will not be added to the EntityManager and will not be observable. However, as mentioned above, breeze cycle management and data type transformations will still occur.   Because they skip the cache-merging step, such queries *might* materialize significantly faster than a corresponding query without the 'noTracking' option. Your mileage may vary. 

Example:
 
        var query = EntityQuery
            .from("Orders")
            .where("customer.companyName", "startsWith", "C")
            .expand("customer")
            .noTracking();
        
        myEntityManager.executeQuery(query).then(function (data) {
            ...
        });

+ Two new MergeStrategies have been added: **SkipMerge** and **Disallowed**
  + **SkipMerge** is used to ignore incoming values. Adds the incoming entity to the cache only if there is no cached entity with the same key. This is the fastest merge strategy but your existing cached data will remain “stale”.
  + **Disallowed** is used to throw an exception if there is an incoming entity with the same key as an entity already in the cache.  Use this strategy when you want to be sure that the incoming entity is not already in cache. This is the default strategy for *EntityManager.attachEntity*.

+ A **MergeStrategy** may now be passed into the *EntityManager.createEntity* and *EntityManager.attachEntity* methods as the last parameter. 
<a name="entity-graph"></a>
+ Entity graphs are now supported when passing 'initialValues' to the *EntityManager.createEntity*, *EntityManager.attachEntity*, and *EntityType.createEntity* methods.
  
      This facility may be used in conjunction with the new EntityQuery.noTracking method when there is a need to convert a subset of the results of a noTracking query into entities and attach them to an EntityManager. For example:    

        var empType = myEntityManager.metadataStore..getEntityType("Employee");
        var q = EntityQuery.from("Employees")
            .expand("orders")
            .noTracking()
            .using(myEntityManager);
        q.execute().then(data) {
            var rawEmps = data.results;
            emps = rawEmps.map(function (rawEmp) {
               emp = empType.createEntity(rawEmp);
               // emp has an entityAspect at this point but is not yet attached.
               empx = myEntityManager.attachEntity(emp, EntityState.Unchanged,MergeStrategy.SkipMerge);
               // empx may NOT be the same as emp because of the possibility that an emp
               // with the same key already exists within the EntityManager.
               return empx;
            });
        });    

---
<a name="exclude-metadata"></a>

>The export/import features added in this release are documented in <a href="/doc-js/export-import.html"><b>Exports and Imports</b></a>.

+ The *EntityManager.exportEntities* method now allows you to optionally exclude metadata.  This can significantly reduce the size of the exported data, especially when exporting only a small number of entities.  
  +  The EntityManager.exportEntities method now has a second boolean parameter, `includeMetadata`. It is optional and defaults to 'true'. Set this second parameter to `false` if you want to exclude metadata. Example: 
    
            myEntityManager.exportEntities(entitiesToExport, false); // export without metadata
   
    Entities exported without metadata **must be re-imported into an `EntityManager` that already contains the matching metadata** or else an exception will be thrown.
      
    
+ The *EntityManager.importEntities* method has been extended to accept the import of exported entities without metadata.  The 'config' parameter to this method has also been extended with an additional optional *metadataVersionFn* property. The property allows a developer to 'inject' a custom function to be executed as the first step of the import process to determine if the imported data is 'correct'. For example

        myEntityManager.importEntities(exportedEntities, {
            mergeStrategy: breeze.MergeStrategy.PreserveChanges,
            metadataVersionFn: function (cfg) {
                if (myEntityManager.metadataStore.name != cfg.metadataStoreName) {
                    throw new Error("Incorrect store name")
                }
                if (breeze.metadataVersion != cfg.metadataVersion)   {
                    throw new Error("Incorrect metadata version")
                }
            }
        });
<a name="name-property"></a>
+ An additional *name* property has been added to the MetadataStore. This allows a developer to 'name' a collection of metadata.  This name is automatically included as part of the package resulting from any exportEntities method call and can be accessed during the execution of any importEntities call via the *metadataVersionFn* described above. The name property may be set via the MetadataStore.setProperties method.
 
        myEntityManager.metadataStore.setProperties({
            name: "Foo-17"
        });

---

>The serialization features added in this release are documented in <a href="/doc-js/entity-serialization.html">Entity Serialization</a>.

+ When serializing data from the Breeze client to either the server or to an exported string, Breeze automatically ensures that exceptions do not occur during the serialization process. In practice this means ensuring that any 'unmapped' properties serialize 'correctly'.  It does this according to the following rules:

    >    1) If the object being serialized has a property named toJSON whose value is a function, then the toJSON method customizes the JSON serialization behavior: instead of the object being serialized, the value returned by the toJSON method when called will be serialized. (This is the same function and behavior as is used by the JSON.stringify method).
     
    >    2) Functions are never serialized unless they have a toJSON function property.
     
    >    3) Objects that contain cycles have cyclical properties stubbed out at the point where a previously serialized node is encountered. As with functions, this behavior can be mediated with a toJSON implementation.

+ A new "serializerFn" property has been added to both the MetadataStore and the EntityType classes.  This property, if present, mediates the entity serialization process. Note that the serialization rules from the item above are still applied AFTER the serializerFn executes.

	The 'serializerFn' takes two arguments: a DataProperty, and a value.  The return value of the function determines what gets serialized for the specified property.  If an 'undefined' is returned then the serialization of that property is suppressed. 
	
	The *MetadataStore.setProperties* method and the *EntityType.setProperties* methods are used to set this property.
	
	 As as example, the following code suppresses the serialization of all 'unmapped' properties.  

	    myEntityManager.metadataStore.setProperties({
	      serializerFn: function (dataProperty, value) {
	           return dataProperty.isUnmapped ? undefined : value;
	      }
	    }); 

---
+ .NET Exceptions thrown on the server are now available in their original form in the *httpResponse.data* property of any async breeze result. Previously Breeze would rethrow some server exceptions in order to provide a better client side error message. Breeze will still drill down to extract a "good" error message, but will no longer obscure the initial exception.

#### Bug fixes

+ Fix for bug where the *EntityManager.createEntity* method could not handle a config with nested complex types.
+ Fix for bug where Entity Framework metadata for default values was not setting the corresponding client side metadata defaultValues.  
+ Nonscalar complex properties can now be serialized successfully via *EntityManager.exportEntities*

#### Breaking Changes

None

<h3><a name="145"></a>1.4.5<span class="doc-date">Oct 28, 2013</span></h3>

#### Features
+ Support for Microsoft VS 2013, ASP.NET Web API 2, and Entity Framework 6.
    This release primarily involves 3 new dlls and 4 new Nuget packages that together support Web API 2 and Entity Framework 6. All older Breeze packages are also still supported.  

    The Breeze JavaScript client (1.4.5) will work with both the new Web API 2 dlls as well as the old ones.  

    New dlls

    - Breeze.ContextProvider              
    - Breeze.ContextProvider.EF6
    - Breeze.WebApi2

    New Nuget packages

    - *Breeze.Server.ContextProvider*  
        - Provider Breeze support for a backend independent storage model. 
    - *Breeze.Server.ContextProvider.EF6* 
        - Provider Breeze specific Entity Framework 6 support on top of the    Breeze.Server.ContextProvider.
    - *Breeze.Server.WebApi2* 
        - Provides Breeze support for ASP.NET Web API 2 independent of any specific backend storage model. 
    - *Breeze.WebApi2.EF6* 
        - Composite nuget that contains the Breeze client, Microsoft's Web API 2 support and all 3 Breeze assemblies shown above. 

    To convert a (legacy) Breeze project to Breeze ASP.NET Web API 2 and Entity Framework 6 project involves
   
	 1. uninstalling all (legacy) Breeze nuget packages - ( These will now all have the name "Legacy" in them).
     2. reinstalling new Breeze nuget packages - For single project solutions on Entity Framework this will mean just installing the one "Breeze.WebApi2.EF6"  package.
     3. replacing the "Breeze.WebApi" and "Breeze.WebApi.EF" namespaces with "Breeze.WebApi2" , "Breeze.ContextProvider" and "Breeze.ContextProvider.EF6".

<h3><a name="144"></a>1.4.4<span class="doc-date">Oct 14, 2013</span></h3>

#### Features
+ Added OData V3 support. Previously only OData V2 was supported.    
+ Added *EntityManager.acceptChanges* and *EntityManager.rejectChanges* methods. These methods basically call *EntityAspect.acceptChanges/rejectChanges* for every changed entity within an *EntityManager*. 
+ Added support for [custom metadata](http://www.breezejs.com/documentation/metadata-by-hand).
+ Added an **Angular** Ajax adapter.  The new adapter can be initialized by calling

            breeze.config.initializeAdapterInstance("ajax", "angular");  

    The default Breeze Ajax adapter is still jQuery.  The new angular adapter should be used if you do not want to use jQuery at all within an Angular application.

    This adapter makes use of Angular's $http to perform any Ajax calls.  By default, Breeze will create isolated $http and $rootScope instances for these calls in order to avoid Angular side effects.  If you want to provide your own $http instance instead you can use the *setHttp* method on the adapter instance itself. 

             var instance = breeze.config.initializeAdapterInstance("ajax", "angular");
             instance.setHttp($http);
  
    This addition also involved making a "minor" breaking change to the AJAX adapter requirements and base implementation so as to not depend on the jQuery.AJAX API. (see Breaking changes below)
+ Updated metadata documentation.


#### Breaking Change
+ The Ajax  adapter api was changed to allow support for Ajax adapters that are not jQuery "like".  This change should NOT affect any applications unless they subclassed the existing Ajax adapter or called into it directly. Applications that called methods on the *EntityManager* or the *MetadataStore* are NOT affected by this change.   

     The change involved the config parameter of API's "Ajax" method.

            adapter.ajax(config);
     
    The change was to the **success** and **error** callback function properties of the config object.  These used to be defined as follows ( following the jQuery API).

            config.success := function (data, textStatus, XHR);
            config.error := function (XHR, textStatus, errorThrown);  

    These two properties are now defined as 

            config.success := function (httpResponse);
            config.error := function (httpResponse);

    where the *httpResponse* object consists of the following properties and methods.

            httpResponse.data – {string|Object} – The response body
            httpResponse.status – {number} – HTTP status code of the response.   		
            httpResponse.getHeaders(headerName) - Header getter function - a null headerName will return all headers. 
            httpResponse.error - {Error | String} - an optional error object
            httpResponse.config - {Object} The configuration object that was used to generate the request.

    This change has also made it much easier to create a stub or mock Ajax adapter.

#### Bug fixes
+ Fixed a bug with ES5 props in **knockout** not always being wrapped properly.
+ Fixed bug where initializers declared on *ComplexTypes* were not firing.
+ Fixed a bug where asking for an *inlinecount* with the OData provider was returning the count as as a string instead of a number.
+ Fixed a bug with *jsonResultsAdapter* processing where certain nested structures were not being parsed properly.
+ Fixed a bug where an "named query" without an entityType mapping could cause the Breeze web api implementation to return an entire table if any filter referenced an invalid field name.

<h3><a name="142"></a>1.4.2<span class="doc-date">Sept 11, 2013</span></h3>

#### Features

+ Added support for Breeze "initializer" inheritance when constructing instances of Breeze subclassed entities.  Entity initializers are called in sequence starting from the basemost Entity class. 
+ The Breeze WebApi response to any SaveChanges operation that has validation errors now returns a 403 status code, instead of a 200.  This has no effect on any Breeze code but will be noticeable to anyone watching Breeze's network traffic.  
+ Complex objects are now supported in the  EntityQuery.withParameters method.
        
  + **Client code**

            var query = EntityQuery.from("SearchCustomers")
            .withParameters( { CompanyName: "A", ContactNames: ["B", "C"] , City: "Los Angeles"  } );

   + **Server Code**

            public class CustomerQBE {
              public String CompanyName { get; set; }
              public String[] ContactNames { get; set; }
              public String City { get; set; }
            }

  
            [HttpGet]
            public IQueryable<Customer> SearchCustomers([FromUri] CustomerQBE qbe) {
              var ok = qbe != null && qbe.CompanyName != null & qbe.ContactNames.Length > 0 && qbe.City.Length > 1;
              if (!ok) {
                throw new Exception("qbe error");
              }
              // do something interesting with qbe ...
            }


+ [Support for NHibernate](/doc-net/nh.html) - (this is a BETA feature).  A [sample is available now](/doc-samples/north-breeze.html).

+ The *Breeze.WebApi* dll has been broken up into multiple assemblies. 
   + There are now 3 Server side .NET assemblies instead of one.
      + **Breeze.WebApi.Core** - database and persistence framework independent code. 
	  + **Breeze.WebApi.EF**  - Entity Framework specific code. Dependent on Breeze.WebApi.Core.
      + **Breeze.WebApi.NH** - NHibernate specific code. Dependent of Breeze.WebApi.Core.
   + There are four new NuGet packages
      + **Breeze.Client**  - client JavaScript libraries only.
      + **Breeze.Server.WebApi.Core** - Server side only .NET assemblies.
      + **Breeze.Server.WebApi.EF** = Breeze.Server.WebApi.Core + Entity Framework assemblies
      + **Breeze.Server.WebApi.NH** = Breeze.Server.WebApi.Core + NHibernate assemblies.
   + The preexisting Breeze.WebApi package has been recomposed.
      + Breeze.WebApi = Breeze.Client + Breeze.Server.WebApi.EF

#### Breaking Change
+ The breakup of the Breeze.WebApi dll into several assemblies means that for any Entity Framework dependent Breeze server side projects.

    + The new *Breeze.WebApi.EF* assembly will need to be added as a reference. **If you were already using a Breeze NuGet package then the updated version of your package should do this this automatically**.
	+ The *Breeze.WebApi.EF* namespace will need to be added to any 'using' code blocks. 

This means that if you were using Breeze with the Entity Framework

       using Breeze.WebApi;

must be replaced with
 
      using Breeze.WebApi;
      using Breeze.WebApi.EF;

#### Bug fixes
+ Fixed several IE8 related bugs including 'Out of stack space" issue and Breeze incorrectly attempting to call 'Object.defineProperty' when it is not implemented.  
+ Fix bug with OData provider and unmapped properties.

<h3><a name="ruby"></a>Intro to SPA with Ruby<span class="doc-date">Aug 30, 2013</span></h3>
+ We've replaced the Web API and Entity Framework used to power the backend of Code Camper Jumpstart with [Ruby on Rails](http://www.breezejs.com/samples/intro-spa-ruby). 

<h3><a name="141"></a>1.4.1<span class="doc-date">Aug 13, 2013</span></h3>

#### Features

+ The [EntityManager.importEntities](/doc-js/api-docs/classes/EntityManager.html#method_importEntities) instance method now returns an object containing the list of entities imported and any temporary key mappings that occurred as a result of the import. The static version of this method has not changed, it still creates and returns a new EntityManager containing the imported entities. 
+ An additional 'parent' property was added to the arguments passed to the [EntityAspect.propertyChanged](/doc-js/api-docs/classes/EntityAspect.html#event_propertyChanged) event.  The value of this property will be different from that of the 'entity' property when the property in question is part of a nested complex type structure.
+ The [MetadataStore.importMetadata](/doc-js/api-docs/classes/MetadataStore.html#method_importMetadata) method can now process 'Breeze' native metadata imports where base classes may not be defined before their subclasses. i.e. order no longer matters.
+ The 'value' parameter in the [Predicate](/doc-js/api-docs/classes/Predicate.html) constructor is now overloaded to optionally support an object with 'value', 'isLiteral' and 'dataType' properties. This change was made to support queries where Breeze's inference engine does not have sufficient information to correctly infer the 'dataType' of a query clause. 
+ The [Predicate.create](/doc-js/api-docs/classes/Predicate.html#method_create) method and the Predicate constructor have been extended so that both will now also accept a standard 'OData' query clause.  OData clauses may also be combined with any standard query clauses.  However, any EntityQuery containing an explicit OData clause will only be executable remotely, i.e. you cannot execute these queries locally.

        var query = breeze.EntityQuery.from("Employees")
            .where("EmployeeID add ReportsToEmployeeID gt 3");   
+ The [Predicate.and](/doc-js/api-docs/classes/Predicate.html#method_and) and [Predicate.or](/doc-js/api-docs/classes/Predicate.html#method_or) methods have been extended so that any arrays or parameters passed into these methods are automatically filtered to exclude null or undefined 'predicates'.  This allow for simpler composition of complex query expressions.

        // works even if any or all of pred1, pred2 or pred3 is null or undefined. 
        var predicate = Predicate.and([pred1, pred2, pred3]);
        var query = breeze.EntityQuery.from("Employees").where(predicate);

+ EntityQuery with a "take(0)" method call is now supported and will return no entities.  This idiom is useful in conjunction with the *EntityQuery.inlineCount* method.

        // returns just the count of employees
	    var query = breeze.EntityQuery.from("Employees").take(0).inlineCount(true);
+ ES5 properties defined within an inheritance hierarchy via JavaScript's *Object.defineProperty* method are now fully supported in any custom constructors registered with Breeze.  This support is currently limited to Angular (via the backingStore adapter) and Knockout. Backbone support for this feature is coming soon.  

+ Typescript breeze.d.ts file updated for TypeScript 0.9.1

+ Several additional standard validators have been added including:
    + breeze.Validator.regularExpression
    + breeze.Validator.creditCard
    + breeze.Validator.emailAddress
    + breeze.Validator.phone  ( BETA)
    + breeze.Validator.url

Use them as you would the other stock validators. Here's an example:

    // Add Url validator to the blog property of a Person entity
    // Assume em is a preexisting EntityManager.
    var personType = em.metadataStore.getEntityType("Person"); //get the Person type
    var websiteProperty = personType.getProperty("website"); //get the property definition to validate
    websiteProperty.validators.push(Validator.url()); // push a new validator instance onto that property's validators

With the [`breeze.Validator.makeRegExpValidator`](/doc-js/api-docs/classes/Validator.html#method_makeRegExpValidator) static helper, you can quickly mint new validators that encapsulate a regular expression. For example, we can create a U.S. zipcode validator and apply it to one of the `Customer` properties.

    // Make a zipcode validator
    function zipValidator = breeze.Validator.makeRegExpValidator(
        "zipVal",  
        /^\d{5}([\-]\d{4})?$/,  
        "The %displayName% '%value%' is not a valid U.S. zipcode");

    // Register it with the breeze Validator class.
    breeze.Validator.register(zipValidator);

    // Add it to the Customer.PostalCode data property. Assume em is a preexisting EntityManager.
    var custType = em.metadataStore.getEntityType("Customer");  //get the Customer type
    var zipProperty = custType.getProperty("PostalCode");    //get the PostalCode property definition
    zipProperty.validators.push(zipValidator);    // get that property's validators and push on the zipValidator

[See the API docs](/doc-js/api-docs/classes/Validator.html) for more information on how to use these new validators.

>Many of these new validators correlate to <a href="http://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations.aspx" target="_blank">.NET data annotations</a>. In a future release, the Breeze.NET `EFContextProvider`will be able to include these validations in the metadata automatically for you. For now, you'll have to add them to the properties on the client side as shown above.

#### Bug fixes
+ Fixed bug with *EntityQuery.inlineCount* when used in conjunction with a orderBy clause involving a nested property path.  
+ Fixed bug with empty *EntityQuery.orderBy*, *select* and *expand* clauses throwing an exception, instead of simply removing the clause from the resultant EntityQuery.
+ Fixed bug where EntityManager.importEntities did not always fixup relationships completely in complex graphs
+ Fixed bug to insure that EntityManager.exportEntities and importEntities preserves null values.

<h3><a name="Zza"></a>Zza! sample<span class="doc-date">August 05, 2013</span></h3>
* <a href="/doc-samples/zza-mongo.html">100% JS sample</a>, written for Node.js running Express with a MongoDB database.

<h3><a name="140"></a>1.4.0<span class="doc-date">July 23, 2013</span></h3>

#### Features

####Client side

+ [EntityQuery.withParameters](http://www.breezejs.com/documentation/querying-depth#EntityQuery) now supports parameters that are arrays.
+ New [EntityAspect.hasValidationErrors](http://www.breezejs.com/documentation/validation#hasValidationErrors) property. 	
+ New [EntityManager.validationErrorsChanged](http://www.breezejs.com/documentation/validation#validationErrorsChanged) event. 

####Server side (Node.js)

+ [MongoDB integration](http://www.breezejs.com/documentation/mongo-integration).

####Server side (.NET)
 
+ New server-side interception point, [AfterSaveEntities](http://www.breezejs.com/documentation/custom-efcontextprovider#AfterSaveEntities).
	
+ New options for server-side transaction control. `SaveChanges` now has an optional [TransactionSettings](http://www.breezejs.com/documentation/custom-efcontextprovider#TransactionSettings) parameter, which controls the type of transaction that wraps the `BeforeSaveEntites`, `SaveChangesCore`, and `AfterSaveEntities` methods.  

+ New methods on [ContextProvider](http://www.breezejs.com/documentation/custom-efcontextprovider#ContextProvidermethods) for use in `BeforeSaveEntities` and `AfterSaveEntities`.  These methods help allow re-use of database connections, which reduces the need for distributed transactions.

+ [Save validation](http://www.breezejs.com/documentation/server-side-validation) enhancements. (Communicate server side validation errors to the client.)  
	
+ [Server side validation errors](http://www.breezejs.com/documentation/server-side-validation) can be returned in using .NET Validation Attributes or by throwing an *EntityErrorsException* within the server side *BeforeSaveEntities* delegate or virtual method.
	      
### Bugs

+ Fixed: Bug where *inlineCount* was null/undefined when query results were sorted by a nested property path.
+ Fixed: Remaining validators were not being called after the first validator failed.
+ Fixed: Server side implementation using *FirstOrDefault* would causing the query to fail when a null was returned. 
+ Fixed: *EntityManager.getEntityByKey* was failing with some inheritance models.
+ Fixed: Breeze was not applying extended query semantics to Web API methods typed to return an *HttpResponseMessage*.  The fix involves the requirement that to apply the query properly to these methods they must have a  [BreezeQueryable] attribute applied directly to them. This is not required for methods that return an *IQueryable* directly.
+ Fixed: *EntityManager.exportMetadata* would fail with the JSON2.stringify ES5 shim.
+ Fixed: *EntityManager.executeQueryLocally* could incorrectly interpret some queries involving strings starting with the letter "P" as being queries for "duration" properties.   

### Breaking changes

+ *entityAspect.removeValidationErrors* has changed

	**old signature:** *removeValidationErrors(validator, property)*

	**new signature** *removeValidationErros(validationErrorOrKey)*

    If you don’t have a *ValidationError* you can obtain a key via *ValidationError.getKey(validator, property)*;   If you do have a *ValidationError*, it now has a publicly avail ‘key’ property that can be used to remove it manually if necessary.

+ The description of client side validation errors caught during a save before posting to the server has changed. 

	Client side validation errors caught during a save, but before posting to the server, cause the save to fail and be routed to  the fail promise. The fail promise returns an error object that contains a description of the errors. This description has changed.
	
	Previously this error object contained an *entitiesWithErrors* property that contained a list of all of the entities that had failed validation.  This property has now been replaced with the *entityErrors* property.  The *entityErrors* property returns a collection of *entityError* objects as described above.  

	This change was made in order to retain consistency between save failures that occurred on the server and those that failed before posting to the server on the client.   

+ The ContextProvider base class has been changed - 3 new abstract methods were added and one method signature was changed.  This change will ONLY affect developers who directly subclassed the ContextProvider base class.  The EFContextProvider experienced no breaking changes.
    + New methods
    + Changed method