---
layout: doc-net
---
# Breeze.Server.NET Release Notes

### <a name="160"></a>1.6.0 <span class="doc-date">Dec. 1, 2016</span>###

#### Breeze.Server.NET Features
- Server-side deletes sent to client as DeletedKeys property of SaveResult
- Include .PDB files in NuGet packages (PR [#38](https://github.com/Breeze/breeze.server.net/pull/38))
- Updated NuGet dependencies

#### Breeze.Server.NET Fixed Bugs
- Querystring parameters not re-encoded on $expand, $orderby, or $select (PR [#44](https://github.com/Breeze/breeze.server.net/pull/44))

### <a name="155"></a>1.5.5 <span class="doc-date">Feb. 2, 2016</span>###

#### Breeze.Server.NET Features
- Allow arrays in originalValuesMap (Issue [#2](https://github.com/Breeze/breeze.server.net/issues/2))
- NHibernate: Changed NHExpander to expand IEnumerable (includes collections and sets) (Issue [#28](https://github.com/Breeze/breeze.server.net/issues/28))
- NHibernate: Change support to NH 4
- Change to WebActivatorEx
- Add XML comment information to Nuget packages

#### Breeze.Server.NET Fixed Bugs
- NHibernate: Ordering of dependent entities during save
- NHibernate: Error when using formula column (thanks lnu)
- NHibernate: Transaction is rolled back twice, resulting in AdoTransaction error (thanks lnu)
- Inline count executed twice
- EFEntityError.ErrorName never set (thanks tschettler)
- Error when SaveMap contains unknown EntityType

See the prior [release notes](/doc-main/release-notes) for previous changes.