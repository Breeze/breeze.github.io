---
layout: doc-net
---
# BreezeJS Release Notes

These are the release notes for the current **1.5.x** releases of breeze.js only.  

Prior [release notes](/doc-main/release-notes) (incorporating the Breeze client packages) are also available.

### <a name="155"></a>1.5.5 <span class="doc-date">Feb. 2, 2016</span>###

#### Breeze.Server.NET Features
- Allow arrays in originalValuesMap (Issue [#2](https://github.com/Breeze/breeze.server.net/issues/2))
- NHibernate: Changed NHExpander to expand IEnumerable (includes collections and sets) (Issue [#28](https://github.com/Breeze/breeze.server.net/issues/28))
- NHibernate: Change support to NH 4
- Change to WebActivatorEx
- Add XML comment information to Nuget packages

#### Breeze.Server.NET Bugs
- NHibernate: Ordering of dependent entities during save
- NHibernate: Error when using formula column (thanks lnu)
- NHibernate: Transaction is rolled back twice, resulting in AdoTransaction error (thanks lnu)
- Inline count executed twice
- EFEntityError.ErrorName never set (thanks tschettler)
- Error when SaveMap contains unknown EntityType

See the prior [release notes](/doc-main/release-notes) for previous changes.