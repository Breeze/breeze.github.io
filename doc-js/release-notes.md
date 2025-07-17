---
layout: doc-js
---
# BreezeJS Release Notes

These are the release notes for the current releases of breeze.js (breeze-client) only.  

Prior [release notes](/doc-main/release-notes) (incorporating the Breeze server packages) are also available.

### <a name="2.2.0"></a>2.2.0 <span class="doc-date">July 17, 2025</span>

 - Update version number to 2.2.0 to reflect addtional functionality (query POST feature mentioned below in 2.1.7)
 - Change npm package versioning: 
    - versions tagged `latest` now use the `mjs` package and module structure (fesm2022 modules)
    - versions tagged `cjs` use the older CommonJS module structure and include UMD bundles.
    
    If you need backward compatibility with older JavaScript (ES5 or ES2015) or UMD bundles, you should install `breeze-client@cjs`; otherwise just install `breeze-client`.

### <a name="2.1.7"></a>2.1.7 <span class="doc-date">July 16, 2025</span>

 - Enable sending queries using POST with the query expression as JSON in the request body.  Use `query = query.usePost()` to enable this behavior.  Breeze.AspNetCore 7.4.0 or later supports POST queries.

### <a name="2.1.6"></a>2.1.6 <span class="doc-date">July 1, 2025</span>

 - Fix processing of query results to handle deleted entities correctly
 - Fix guid-matching regex to fix false positives ([#79](https://github.com/Breeze/breeze-client/issues/79))
 - Add `hour` function to Predicate ([#80](https://github.com/Breeze/breeze-client/issues/80))
 - Improve typings with `getProperty` and `setProperty` on entity ([#81](https://github.com/Breeze/breeze-client/issues/81))
 - Add `isDeletedOrDetached()` and `isAddedOrModified()` on EntityState
 - Use `declare` on base class properties to prevent Babel from adding props where they don't belong
 - Add support for `DateOnly` data type

### <a name="2.1.5"></a>2.1.5 <span class="doc-date">May 8, 2023</span>

 - Fix definition of `ComplexObject` interface to make `setProperty` and `getProperty` optional methods
 - Add test for entity modification when changing property on a complex type
 - Add `cjs` npm tag to version with CommonJS bundles

### <a name="2.1.4"></a>2.1.4 <span class="doc-date">Jan 1, 2023</span>

 - Release **2.1.4-mjs** version on npm, with ES 2020 .mjs modules.  Version 2.1.4 with ES5 and legacy bundles is still available.
 - Fix `null === undefined` comparison in property interceptor ([#69](https://github.com/Breeze/breeze-client/pull/69))
 - Fix regex issue in IE 11 ([#56](https://github.com/Breeze/breeze-client/issues/56))

### <a name="2.1.2"></a>2.1.2 <span class="doc-date">May 14, 2021</span>

 - Export `QueuedSaveFailedError` from mixin-save-queuing ([#53](https://github.com/Breeze/breeze-client/issues/53))
 - Fix type information for `ValidationMessageContext`

### <a name="2.1.1"></a>2.1.1 <span class="doc-date">April 29, 2021</span>

 - Fix noisy console logging about null default values ([#50](https://github.com/Breeze/breeze-client/issues/50))
 - Handle relationships to non-PK properties ([#52](https://github.com/Breeze/breeze-client/issues/52))

### <a name="2.1.0"></a>2.1.0 <span class="doc-date">April 23, 2021</span>

 - Fix combining of 'or' clauses under an 'and' predicate ([#46](https://github.com/Breeze/breeze-client/issues/46))
 - Add `extendFuncMap` to Predicate ([#37](https://github.com/Breeze/breeze-client/issues/37))
 - Fix parsing of collections in CSDL metadata ([#36](https://github.com/Breeze/breeze-client/issues/36))
 - Fix type information for AJAX adapters ([#48](https://github.com/Breeze/breeze-client/issues/48))
 - Fix type information for Validators ([#220](https://github.com/Breeze/breeze.js/issues/220))
 - Add console warning (instead of error) when serializing Predicate with unknown entity ([#48](https://github.com/Breeze/breeze-client/issues/48))
 - Add console warning (instead of error) when defaultValue is undefined for non-nullable property in metadata ([#7](https://github.com/Breeze/breeze-client/issues/7)) and ([#218](https://github.com/Breeze/breeze.js/issues/218))

### <a name="2011"></a>2.0.11 <span class="doc-date">April 8, 2021</span>
 
 - Downlevel .d.ts files for compatibility with TypeScript 3.4 / Angular 7 ([#45](https://github.com/Breeze/breeze-client/issues/45))

### <a name="2010"></a>2.0.10 <span class="doc-date">April 7, 2021</span>

 - Update README ([#25](https://github.com/Breeze/breeze-client/issues/25))

### <a name="209"></a>2.0.9 <span class="doc-date">April 4, 2021</span>

 - Updated default property interceptor to handle detached object ([#30](https://github.com/Breeze/breeze-client/issues/30))
 - Fixed issue with extra ampersand being included right after question mark ([#34](https://github.com/Breeze/breeze-client/issues/34))
 - Add `custom` property to EntityError ([#42](https://github.com/Breeze/breeze-client/issues/42))
 - Fix Predicate `combine` function when expr1 is a number ([#43](https://github.com/Breeze/breeze-client/issues/43))

### <a name="208"></a>2.0.8 <span class="doc-date">March 10, 2021</span>

- Add ComplexObject to type exports
- Update devDependencies

### <a name="207"></a>2.0.7 <span class="doc-date">February 10, 2020</span>

- Fix ajax-fetch-adapter to handle parameter passing like jquery
- Fix data type exports

### <a name="201"></a>2.0.1 <span class="doc-date">November 5, 2019</span>

#### Features

 - Add `getEntityGraph` mixin as part of breeze-client package (was a [Breeze Lab](http://breeze.github.io/doc-breeze-labs/get-entity-graph.html))
 - Add `enableSaveQueuing` mixin as part of breeze-client package (was a [Breeze Lab](http://breeze.github.io/doc-breeze-labs/save-queuing.html))

**Mixin: getEntityGraph** allows getting a graph of entities from the EntityManager.  See [Get Entity Graph](http://breeze.github.io/doc-breeze-labs/get-entity-graph.html) for usage.  To use it in TypeScript/ES6, you would: 
```
import { EntityManager } from 'breeze-client';
import { HasEntityGraph, mixinEntityGraph } from 'breeze-client/mixin-get-entity-graph';
...
// Ensures that mixin won't be tree-shaken away. 
// Called with EntityManager class, not an instance.
mixinEntityGraph(EntityManager);  
...
let graph = (manager as HasEntityGraph).getEntityGraph(customer, 'orders.orderDetails');
```

**Mixin: enableSaveQueuing** automatically queues a `saveChanges()` call on an EntityManager if another save is still in process. _Use at your own risk_.
See [the source code comments](https://github.com/Breeze/breeze-client/blob/master/src/mixin-save-queuing.ts) for more information, 
and the [DocCode tests](https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode/tests/saveQueuingTests.js) 
for example usage.

To use it in TypeScript/ES6, you would:
```
import { enableSaveQueuing } from 'breeze-client/mixin-save-queuing';
...
// Enable on an EntityManager instance
enableSaveQueuing(myManager);
...
myManager.saveChanges();
```

### <a name="200"></a>2.0.0 <span class="doc-date">October 26, 2019</span>

Complete rewrite of the Breeze source code in TypeScript.  Moved repo to [https://github.com/Breeze/breeze-client](https://github.com/Breeze/breeze-client).

#### Features

- New package structure compatible with Angular 8 and advanced bundlers
- New `config.noEval` flag allows operation under CSP restrictions
- `AjaxHttpClientAdapter`, `AjaxFetchAdapter`, `AjaxPostWrapper` are now part of breeze-client package

#### Fixed Bugs

- Fix observable arrays to be compatible with Vue.js
- Fix errors in TypeScript definition files

#### Breaking Changes
API is almost identical to the original (breezejs 1.x) but small changes are noted below:

 - Breeze no longer depends upon Q.js.  But it does depend on a ES6 promise implementation. i.e. the existence of a global `Promise` object.  The `setQ` function is now a no-op.
 - The names of the enum values no longer have "Symbol" at the end.  E.g. `EntityStateSymbol` is now `EntityState`.
 - The `DataServiceOptions` interface is now `DataServiceConfig` to be consistent with other naming
 - The `initializeAdapterInstances` method is removed; use the singular `config.initializeAdapterInstance` method.

#### Adapter Changes
 
 The names of the adapter files have changed.  E.g. `breeze.dataService.webApi` is now `adapter-data-service-webapi`, 
 and the locations have changed due to Angular-compatible bundling.

 Also, the aggressive tree-shaking of tsickle/terser/webpack in Angular 8 removes the functions that the Breeze adapters
 use to register themselves!  So you need to register them yourself.

If you have this:

    import 'breeze-client/breeze.dataService.webApi';
    import 'breeze-client/breeze.modelLibrary.backingStore';
    import 'breeze-client/breeze.uriBuilder.odata';
    import { BreezeBridgeHttpClientModule } from 'breeze-bridge2-angular';

Replace it with this:

    import { DataServiceWebApiAdapter } from 'breeze-client/adapter-data-service-webapi';
    import { ModelLibraryBackingStoreAdapter } from 'breeze-client/adapter-model-library-backing-store';
    import { UriBuilderODataAdapter } from 'breeze-client/adapter-uri-builder-odata';
    import { AjaxHttpClientAdapter } from 'breeze-client/adapter-ajax-httpclient';

Note that now you _do not_ need `breeze-bridge2-angular`, because the AjaxHttpClientAdapter is now part of the breeze-client package.

Then, in your constructor function (for your module or Entity Manager Provider):

    constructor(http: HttpClient) {
        // the order is important
        ModelLibraryBackingStoreAdapter.register();
        UriBuilderODataAdapter.register();
        AjaxHttpClientAdapter.register(http);
        DataServiceWebApiAdapter.register();
    }

The above has been tested on Angular 7 and 8, and should work for earlier versions.

> Note that if you are using Breeze .NET Core on the server, you should use `UriBuilderJsonAdapter` instead of `UriBuilderODataAdapter`.

For apps that use global JavaScript libraries, the UMD versions are still available, under the `bundles` directory.  Use these instead of the old `breeze.debug.js`:

    <script src="node_modules/breeze-client/bundles/breeze-client.umd.js"></script>
    <script src="node_modules/breeze-client/bundles/breeze-client-adapter-model-library-backing-store.umd.js"></script>
    <script src="node_modules/breeze-client/bundles/breeze-client-adapter-data-service-webapi.umd.js"></script>
    <script src="node_modules/breeze-client/bundles/breeze-client-adapter-ajax-angularjs.umd.js"></script>




### <a name="171"></a>1.7.1 <span class="doc-date">April 4, 2018</span>

#### Breeze.Js Fixed Bugs
 - Fix traversal of foreign keys during PK update when using inheritance

### <a name="170"></a>1.7.0 <span class="doc-date">February 8, 2018</span>

#### Breeze.Js Features
 - Added new `mergeAdds` flag to EntityManager's `importEntities` method, to force merging of entities in `Added` state that have the same temporary key values

#### Breeze.Js Fixed Bugs
 - Fix several TypeScript type definitions.
 
### <a name="163"></a>1.6.3 <span class="doc-date">March 5, 2017</span>

#### Breeze.Js Fixed Bugs
 - Fix multilevel inheritance hierarchy bug affecting navigation properties that reference base classes with custom constructors.
 - Fix type definition for `breeze.config.initializeAdapterInstance()`.
 - Make coEquals work on arrays of complex types; fix issue [#183](https://github.com/Breeze/breeze.js/issues/183)

#### Breeze.Js Changes
 - Update type definitions to use ES6 `Promise<T>` interface instead of `breeze.promises.IPromise<T>`. This may be a breaking change for some applications due to the lack of a `finally()` method in `Promise<T>`. Use [promise.q.shim.d.ts](https://github.com/Breeze/breeze.js/blob/master/typescript/promise.q.shim.d.ts) to augment `Promise<T>` with the `finally()` method.
 
### <a name="162"></a>1.6.2 <span class="doc-date">January 12, 2017</span>

#### Breeze.Js Fixed Bugs
 - Fix critical bug in getChangesCore
 
### <a name="161"></a>1.6.1 <span class="doc-date">January 7, 2017</span>

#### Breeze.Js Features
 - Support for AngularJS 1.6 $http function, issue [#177](https://github.com/Breeze/breeze.js/issues/177)

#### Breeze.Js Fixed Bugs
 - Fix 'Maximum call stack size exceeded', issue [#182](https://github.com/Breeze/breeze.js/issues/182)
 - Fix '__extend is not defined' in adapters, pull request [#180](https://github.com/Breeze/breeze.js/pull/180)
 - Fix extra '&' added to OData queries, pull request [#179](https://github.com/Breeze/breeze.js/pull/179)
 - Fix getTuples with inheritance, pull request [#165](https://github.com/Breeze/breeze.js/pull/165)

### <a name="160"></a>1.6.0 <span class="doc-date">December 1, 2016</span>

#### Breeze.Js Features
 - Server-side deletes are now handled in the DeletedKeys property of the SaveResult.  Entity Manager automatically detaches the entities that were deleted on the server.  See the [Saving Changes](/doc-js/saving-changes.html#the-save-response) and [DataServiceAdapter](/doc-js/server-dataserviceadapter.html#a-successful-saveresult) pages for (a little) more information.

### <a name="1516"></a>1.5.16 <span class="doc-date">October 26, 2016</span>

#### Breeze.Js Fixed Bugs
 - Fix discovery of inverse navigation properties - fixes (more) issues with relationship hookup on base classes.

### <a name="1515"></a>1.5.15 <span class="doc-date">October 25, 2016</span>

#### Breeze.Js Fixed Bugs
 - Fix attachment logic to hook up navigation properties on base class when importing
 - Fix complex property original values not reset on save, issue [#171](https://github.com/Breeze/breeze.js/issues/171)
 - Fix empty predicate under `any` clause, issue [#172](https://github.com/Breeze/breeze.js/issues/172)

### <a name="1514"></a>1.5.14 <span class="doc-date">October 7, 2016</span>

#### Breeze.Js Fixed Bugs
 - Fix attachment logic to hook up navigation properties on base class when querying 

### <a name="1513"></a>1.5.13 <span class="doc-date">September 30, 2016</span>

#### Reverted Breeze.Js Changes ####
- Change main field in package.json back to breeze.debug.js. This change in 1.5.12 was causing too many headaches and we found a better way to handle rollup.js support without requiring a breaking change to Breeze.

### <a name="1512"></a>1.5.12 <span class="doc-date">September 23, 2016</span>

#### Breeze.Js Fixed Bugs
 - Fix broken call to __isDate() in core.__isPrimitive()
 - Fix recursive call in core.toJSONSafe(), replacer function was not always passed

#### Breeze.Js Breaking Changes ####
- Change main field in package.json to breeze.base.debug for compatibility with rollup.js and other bundlers. This change now requires the explicit importing and initialization of the required adapters when using bundlers such as rollup.js or webpack, as well as Node.js and other systems that read the main field to determine which file to load. These systems will no longer load breeze.debug.js, which contains all adapaters and initilizes some defaults.

### <a name="1511"></a>1.5.11 <span class="doc-date">August 23, 2016</span>

#### Breeze.Js Fixed Bugs
 - OData: fix sticky $batch headers, issue [157](https://github.com/Breeze/breeze.js/issues/157)
 - OData: fix application/json Accept header, issue [148](https://github.com/Breeze/breeze.js/issues/148)
 - OData: fix missing data.retrievedEntities in query results
 - Rename AMD module names from 'breeze' to 'breeze-client', issue [161](https://github.com/Breeze/breeze.js/issues/161)
 - Fix: EntityType.addProperty now adds property to subtypes

### <a name="1510"></a>1.5.10 <span class="doc-date">July 18, 2016</span>

#### Breeze.Js Fixed Bugs
 - Add missing TypeScript definitions
 - Fix errant warning (introduced in 1.5.7) in registerEntityTypeCtor when using a prototype chain

### <a name="159"></a>1.5.9 <span class="doc-date">July 15, 2016</span>

#### Breeze.Js Features
- Now uses JsonResultsAdapter to extract entities and keyValues from save result, for adaptability when working with different servers.  See [API Doc](/doc-js/api-docs/classes/jsonresultsadapter.html).

#### Breeze.Js Fixed Bugs
 - Add missing TypeScript definitions and API docs

### <a name="158"></a>1.5.8 <span class="doc-date">July 5, 2016</span>

#### Breeze.Js Features
- Restructured NPM package.
- Typescript definitions included in NPM package to allow consumption of Breeze as an external Typescript module instead of static script with global namespaces.
- Allow custom headers on OData requests; fixes issue [#154](https://github.com/Breeze/breeze.js/issues/154)

#### Breeze.Js Fixed Bugs
- Fix missing `displayName`, `nameOnServer`, `acceptChanges()` and change `module` to `namespace` in [breeze.d.ts](https://github.com/Breeze/breeze.js/blob/master/typescript/breeze.source.d.ts)

### <a name="157"></a>1.5.7 <span class="doc-date">June 8, 2016</span>

#### Breeze.Js Features
- Add optional `relativeUrl` setting on OData data service adapter for backward compatibility and/or custom URL mapping.  Addresses [issue with proxies](https://github.com/Breeze/breeze.js/commit/e7cb67e44a12262231c92756f5e3f0d7034f9b21#commitcomment-17408956).

#### Breeze.Js Fixed Bugs
- Error in OData data service adapter when using breeze.base (Pull request [#134](https://github.com/Breeze/breeze.js/pull/134))
- Require names don't match bower names for external modules (Issue [#142](https://github.com/Breeze/breeze.js/issues/142))
- Various small fixes for working with Olingo OData (Pull request [#41](https://github.com/Breeze/breeze.js/pull/41))
- Error when attempting to treat string as a date. (Issue [#151](https://github.com/Breeze/breeze.js/issues/151))
- Add warning when attempting to re-use ctor. (Issue [#133](https://github.com/Breeze/breeze.js/issues/133))

### <a name="156"></a>1.5.6 <span class="doc-date">March 31, 2016</span>

#### Breeze.Js Features
- Sync Breeze version number with NPM [breeze-client](https://www.npmjs.com/package/breeze-client) package version

#### Breeze.Js Fixed Bugs
- Error in JSON UriBuilder (Pull request [#136](https://github.com/Breeze/breeze.js/pull/136))

### <a name="155"></a>1.5.5 <span class="doc-date">Feb. 2, 2016</span>

#### Breeze.Js Features
- Perf: executeQueryLocallyCore replaced `result.push.apply` syntax with `result=result.concat(entities)` (Issue [#105](https://github.com/Breeze/breeze.js/issues/101))
- Make it easier to create custom DataTypes; move DataType-specific code into the DataType class
- Module loading: replaced all instances of `require('breeze');` with `require('breeze-client');` to conform to npm and bower package names.  This is a **breaking change** if you use require().

#### Breeze.Js Fixed Bugs
- Problem with MergeStrategy.PreserveChanges with fk change and expand. (D2677)
- All OData DataService adapters use absolute URLs both for direct calls and inside $batch payloads (D2679)
- Fix `exportEntities([])` exports everything (instead of nothing)
- OData metadata with entities in multiple namespaces  (Issue [#96](https://github.com/Breeze/breeze.js/issues/96) and [#101](https://github.com/Breeze/breeze.js/issues/101))

See the prior [release notes](/doc-main/release-notes) for previous changes.