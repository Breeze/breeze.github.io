---
layout: doc-js
---
# BreezeJS Release Notes

These are the release notes for the current releases of breeze.js only.  

Prior [release notes](/doc-main/release-notes) (incorporating the Breeze server packages) are also available.

### <a name="163"></a>1.6.3 <span class="doc-date">TBD</span>

#### Breeze.Js Fixed Bugs
 - Fix type definition for `breeze.config.initializeAdpaterInstance()`.

#### Breeze.Js Changes
 - Update type definitions to use ES6 `Promise<T>` interface instead of `breeze.promises.IPromise<T>`. This may be a breaking change for some applications due to the lack of a `finally()` method in `Promise<T>`. Use [promise.q.shim.d.ts](https://github.com/Breeze/breeze.js/blob/master/typescript/promise.q.shim.d.ts) to augment `Promise<T>` with the `finally()` method.
 
### <a name="162"></a>1.6.2 <span class="doc-date">January 12, 2017</span>

#### Breeze.Js Fixed Bugs
 - Fix critical bug in getChangesCore
 
### <a name="161"></a>1.6.1 <span class="doc-date">January 7, 2017</span>

#### Breeze.Js Features
 - Support for Angular 1.6 $http function, issue [#177](https://github.com/Breeze/breeze.js/issues/177)

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
- Now uses JsonResultsAdapter to extract entities and keyValues from save result, for adaptability when working with different servers.  See [API Doc](/doc-js/api-docs/classes/JsonResultsAdapter.html).

#### Breeze.Js Fixed Bugs
 - Add missing TypeScript definitions and API docs

### <a name="158"></a>1.5.8 <span class="doc-date">July 5, 2016</span>

#### Breeze.Js Features
- Restructured NPM package.
- Typescript definitions included in NPM package to allow consumption of Breeze as an external Typescript module instead of static script with global namespaces.
- Allow custom headers on OData requests; fixes issue [#154](https://github.com/Breeze/breeze.js/issues/154)

#### Breeze.Js Fixed Bugs
- Fix missing `displayName`, `nameOnServer`, `acceptChanges()` and change `module` to `namespace` in [breeze.d.ts](https://github.com/Breeze/breeze.js/blob/master/typescript/typescript/breeze.d.ts)

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