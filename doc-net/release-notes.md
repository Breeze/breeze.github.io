---
layout: doc-net
---
# Breeze.Server.NET Release Notes

## .NET Core Release Notes

### <a name="Core505"></a>5.0.5 <span class="doc-date">May 3, 2021</span>

Release for .NET 5

 - Add async support to PersistenceManager ([#46](https://github.com/Breeze/breeze.server.net/issues/46))
 - Add Metadata support for foreign keys that relate to a property other than a PK
 - NH: Fix "Not an association" error on set of strings ([#48](https://github.com/Breeze/breeze.server.net/issues/48))
 - Update EntityFramework dependencies to version 5.0.5
 - Update NHibernate dependencies to version 5.3.8

### <a name="Core314"></a>3.1.4 <span class="doc-date">April 20, 2021</span>

Release for .NET Core 3.1

 - Add DataAnnotationsValidator to Breeze.Persistence
 - Fix processing of queryable result when returning error
 - Fix duplicate properties in inheritance metadata ([#100](https://github.com/Breeze/breeze.server.net/issues/100))
 - Add `Custom` property to DataProperty metadata, for sending custom metadata to client
 - Add `Custom` property to EntityError, for sending custom error data to client
 - Fix bug in overriding BreezeConfig ([#70](https://github.com/Breeze/breeze.server.net/issues/70))
 - Update NHibernate version to 5.3.8
 - Add EnumTypes to metadata ([#101](https://github.com/Breeze/breeze.server.net/issues/101))

### <a name="Core504"></a>5.0.4 <span class="doc-date">April 19, 2021</span>

Release for .NET 5

 - Add DataAnnotationsValidator to Breeze.Persistence
 - Fix processing of queryable result when returning error
 - Fix duplicate properties in inheritance metadata ([#100](https://github.com/Breeze/breeze.server.net/issues/100))

### <a name="Core503"></a>5.0.3 <span class="doc-date">March 30, 2021</span>

Release for .NET 5

 - Add `Custom` property to DataProperty metadata, for sending custom metadata to client
 - Add `Custom` property to EntityError, for sending custom error data to client
 - Fix bug in overriding BreezeConfig ([#70](https://github.com/Breeze/breeze.server.net/issues/70))
 - Add NHibernate support to .NET 5
 - Add EnumTypes to metadata ([#101](https://github.com/Breeze/breeze.server.net/issues/101))

> Please note that all further Breeze Server development will be on the .NET Core / .NET 5+ platform.  .Net 4.x Breeze Server development has been frozen, except for essential bug fixes.

### <a name="Core102"></a>1.0.3 <span class="doc-date">December 12, 2019</span>
 - Initial release of .NET Core 3 libraries

### <a name="Core101"></a>1.0.1 <span class="doc-date">December 12, 2018</span>
 - Initial release of .NET Core 2 libraries

## .NET 4.x Release Notes 

> **Please update to 1.6.5 or later**.  All previous breeze.server.net releases have a security vulnerability in JSON deserialization.

### <a name="166"></a>1.6.6 <span class="doc-date">February 2, 2018</span>

#### Breeze.Server.NET Fixed Bugs
- EFContextProvider: Fixed bug causing Enum properties to have their EF `OriginalValues` set incorrectly.
- EFContextProvider: Fixed bug causing EF `OriginalValues` to be set incorrectly for some properties when  OriginalValues were null for other properties.
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