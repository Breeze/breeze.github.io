---
layout: doc-node-mongodb
redirect_from: "/old/documentation/mongodb-beta-notes.html"
---

# MongoDB (beta notes)

A collection of notes on the state of Breeze + MongoDB integration. 

## TODO
We're actively working on considering or resolving these issues and incorporating support where possible.

* Expands and navigation props that involve joins.
* Automatic server side validation.
* No OData functions except startsWith, endsWith, substringOf. **Note:** All comparison operators “>, >=, <, <=, ==” are supported. 
* As of 1.4, only Guids stored as ‘strings’ are supported.

## Issues and warnings
* MongoDB doesn't support case insensitive sorts (except by creating a ‘lowercased’ version of a column). We need to set Breeze’s sorting to match (not yet done). **Note:**  We do perform case insensitive searches because of the use of regex.
* MongoDB doesn't support "embedded" functions, so most  OData expressions involving functions get translated to MongoDB where clauses.
* MongoDB doesn't support multipart keys.
* MongoDB doesn't support primary key sharing between collections; so the idea of an Order and an InternationalOrder as different collections with the same key does not make sense.
* SQL data with padded strings behave differently on a query than MongoDB does. The ANSI standard requires padding for the character strings used in comparisons so that their lengths match before comparing them. MongoDB does not do this.
* Semantics for comparison with nulls are different between SQL and MongoDB – date1 > null in MongoDB , but not in SQL.
* MongoDB has no equivalent of timestamp or rowversion columns that are automatically generated on insert or update. (Except MongoDB ’s ObjectID).
* MongoDB has no concept of a computed column.
* MongoDB has no TimeSpan datetype.
