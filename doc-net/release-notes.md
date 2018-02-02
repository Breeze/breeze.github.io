---
layout: doc-net
---
# Breeze.Server.NET Release Notes

> **Please update to 1.6.5 or later**.  All previous breeze.server.net releases have a security vulnerability in JSON deserialization.

### <a name="166"></a>1.6.6 <span class="doc-date">February 2, 2018</span>

#### Breeze.Server.NET Fixed Bugs
- EFContextProvider: Fixed bug causing Enum properties to have their EF `OriginalValues` set incorrectly.
- EFContextProvider: Fixed bug causing EF `OriginalValues` to be set incorrectly for other properties when one OriginalValue was null.
- Removed unneeded dependency on WebActivatorEx.

### <a name="165"></a>1.6.5 <span class="doc-date">June 1, 2017</span>

#### Breeze.Server.NET Fixed Bugs
- **Security Issue** in JSON deserialization.  Changed TypeNameHandling to `TypeNameHandling.None` for JSON deserialization, to prevent a possible remote code execution vulnerability.  **Thanks** to [Alvaro Muñoz](https://www.blackhat.com/us-17/speakers/Alvaro-Mu%C3%B1oz.html) and [Alexandr Mirosh](https://www.blackhat.com/us-17/speakers/Oleksandr-Mirosh.html) from Hewlett-Packard Enterprise Security for pointing out this flaw.  See their [Black Hat Briefing](https://www.blackhat.com/us-17/briefings.html#friday-the-13th-json-attacks) regarding JSON vulnerabilities.

### <a name="160"></a>1.6.0 <span class="doc-date">Dec. 1, 2016</span>

#### Breeze.Server.NET Features
- Server-side deletes sent to client as DeletedKeys property of SaveResult
- Include .PDB files in NuGet packages (PR [#38](https://github.com/Breeze/breeze.server.net/pull/38))
- Updated NuGet dependencies

#### Breeze.Server.NET Fixed Bugs
- Querystring parameters not re-encoded on $expand, $orderby, or $select (PR [#44](https://github.com/Breeze/breeze.server.net/pull/44))

### <a name="155"></a>1.5.5 <span class="doc-date">Feb. 2, 2016</span>

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