---
layout: doc-js
---
# BreezeJS Release Notes

These are the release notes for the current **1.5.x** releases of breeze.js only.  

Prior [release notes](/doc-main/release-notes) (incorporating the Breeze server packages) are also available.

### <a name="1511"></a>1.5.11 <span class="doc-date">TBD</span>###

#### Breeze.Js Fixed Bugs
 - OData: fix sticky $batch headers, issue [157](https://github.com/Breeze/breeze.js/issues/157)
 - OData: fix application/json Accept header, issue [148](https://github.com/Breeze/breeze.js/issues/148)
 - OData: fix missing data.retrievedEntities in query results
 - Rename AMD module names from 'breeze' to 'breeze-client'
 - Fix endless loop when exporting entities with constructor added properties that return entity types

### <a name="1510"></a>1.5.10 <span class="doc-date">July 18, 2016</span>###

#### Breeze.Js Fixed Bugs
 - Add missing TypeScript definitions
 - Fix errant warning (introduced in 1.5.7) in registerEntityTypeCtor when using a prototype chain

### <a name="159"></a>1.5.9 <span class="doc-date">July 15, 2016</span>###

#### Breeze.Js Features
- Now uses JsonResultsAdapter to extract entities and keyValues from save result, for adaptability when working with different servers.  See [API Doc](/doc-js/api-docs/classes/JsonResultsAdapter.html).

#### Breeze.Js Fixed Bugs
 - Add missing TypeScript definitions and API docs

### <a name="158"></a>1.5.8 <span class="doc-date">July 5, 2016</span>###

#### Breeze.Js Features
- Restructured NPM package.
- Typescript definitions included in NPM package to allow consumption of Breeze as an external Typescript module instead of static script with global namespaces.
- Allow custom headers on OData requests; fixes issue [#154](https://github.com/Breeze/breeze.js/issues/154)

#### Breeze.Js Fixed Bugs
- Fix missing `displayName`, `nameOnServer`, `acceptChanges()` and change `module` to `namespace` in [breeze.d.ts](https://github.com/Breeze/breeze.js/blob/master/typescript/typescript/breeze.d.ts)

### <a name="157"></a>1.5.7 <span class="doc-date">June 8, 2016</span>###

#### Breeze.Js Features
- Add optional `relativeUrl` setting on OData data service adapter for backward compatibility and/or custom URL mapping.  Addresses [issue with proxies](https://github.com/Breeze/breeze.js/commit/e7cb67e44a12262231c92756f5e3f0d7034f9b21#commitcomment-17408956).

#### Breeze.Js Fixed Bugs
- Error in OData data service adapter when using breeze.base (Pull request [#134](https://github.com/Breeze/breeze.js/pull/134))
- Require names don't match bower names for external modules (Issue [#142](https://github.com/Breeze/breeze.js/issues/142))
- Various small fixes for working with Olingo OData (Pull request [#41](https://github.com/Breeze/breeze.js/pull/41))
- Error when attempting to treat string as a date. (Issue [#151](https://github.com/Breeze/breeze.js/issues/151))
- Add warning when attempting to re-use ctor. (Issue [#133](https://github.com/Breeze/breeze.js/issues/133))

### <a name="156"></a>1.5.6 <span class="doc-date">March 31, 2016</span>###

#### Breeze.Js Features
- Sync Breeze version number with NPM [breeze-client](https://www.npmjs.com/package/breeze-client) package version

#### Breeze.Js Fixed Bugs
- Error in JSON UriBuilder (Pull request [#136](https://github.com/Breeze/breeze.js/pull/136))

### <a name="155"></a>1.5.5 <span class="doc-date">Feb. 2, 2016</span>###

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