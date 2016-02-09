---
layout: doc-js
---
# BreezeJS Release Notes

These are the release notes for the current **1.5.x** releases of breeze.js only.  

Prior [release notes](/doc-main/release-notes) (incorporating the Breeze server packages) are also available.

###<a name="155"></a>1.5.5 <span class="doc-date">Feb. 2, 2016</span>###

#### Breeze.Js Features
- Perf: executeQueryLocallyCore replaced `result.push.apply` syntax with `result=result.concat(entities)` (Issue [#105](https://github.com/Breeze/breeze.js/issues/101))
- Make it easier to create custom DataTypes; move DataType-specific code into the DataType class
- Module loading: replaced all instances of `require('breeze');` with `require('breeze-client');` to conform to npm and bower package names.  This is a **breaking change** if you use require().

#### Breeze.Js Bugs
- Problem with MergeStrategy.PreserveChanges with fk change and expand. (D2677)
- All OData DataService adapters use absolute URLs both for direct calls and inside $batch payloads (D2679)
- Fix `exportEntities([])` exports everything (instead of nothing)
- OData metadata with entities in multiple namespaces  (Issue [#96](https://github.com/Breeze/breeze.js/issues/96) and [#101](https://github.com/Breeze/breeze.js/issues/101))

See the prior [release notes](/doc-main/release-notes) for previous changes.