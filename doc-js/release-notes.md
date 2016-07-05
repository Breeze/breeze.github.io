---
layout: doc-js
---
# BreezeJS Release Notes

These are the release notes for the current **1.5.x** releases of breeze.js only.  

Prior [release notes](/doc-main/release-notes) (incorporating the Breeze server packages) are also available.

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