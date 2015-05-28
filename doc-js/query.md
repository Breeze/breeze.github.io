---
layout: doc-js
redirect_from: "/old/documentation/querying-depth.html"
---
# The EntityQuery

In this topic we explore Breeze query features and techniques. The following subtopics will be discussed.   

+ the role of the `EntityManager` in querying
+ the resource name: a Rose is not a rose
+ how the client query becomes an URL in OData query syntax
+ getting data from an arbitrary HTTP source
+ <a href='#QueryOptions'>`queryOptions`</a> control how queried entities are found and merged into the cache</li>
+ the query result data package
+ query the local cache with `executeQueryLocally`
+ combining remote and local query for a refreshed cache perspective on the results
+ hiding async ceremony by pouring results into a data bound, observable array
+ `EntityQuery` immutability
+ filtering
	+ simple conditions
	+ compound condition with `Predicates`
	+ conditions on related entities using property paths
  + using `withParameters` to pass arbitrary parameters to the server
+ using `fromEntities` to refresh values for or more entities
+ using `fromEntityKey` to get an entity when you know its key
+ using `fromEntityNavigation` to load related entities on-demand
+ include related entities in the query result payload with `expand`
+ <a href='#paging'>paging with `skip`, `take`, `top`, and `inlineCount`</a>
+ projection queries to select a subset of properties and flatten object graphs
+ `orderBy` to sort results on the data tier
+ shape the base query on the server with custom query actions
+ Events raised during the query process

<p>Please consult the API documentation for the following related classes:</p>

- `EntityManager`
- `FilterQueryOp`
- `FetchStrategy`
- `MergeStrategy`
- `Predicate`
- `QueryOptions`
