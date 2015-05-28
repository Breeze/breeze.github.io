---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/query-filter.html"
---

#Query with a filter

Our first query returned every Todo in the database (Note 1):

    var query1 = new EntityQuery<TodoItem>();
    var allTodos = await manager.ExecuteQuery(query1);

That’s fine for a short list of Todos; not so great if we’re querying for orders of a large company. We need a query that selects a more manageable number of results, preferably the ones that interest the user.

In the Todo app, we can archive the Todos that we want to keep but look at rarely.  We can request only those Todos that have not been archived by adding a *Where clause* to our query

	var query2 = query1.Where(td => !td.IsArchived);
	var unarchivedTodos = await manager.ExecuteQuery(query2);
	
Notice the method chaining syntax. The **Where()** method doesn’t modify the original query; it extends a copy of the original and returns the copy.

Remember that the filter criteria are applied *on the server side*.  Only those item meeting the criteria are returned across the wire.  (Note 2)

With this approach you can maintain a library of base queries and mint new ones by extension as you need them. For example, the Todo app looks at the Show archived checkbox) to decide if it should add the where clause to the base query (unchecked) or not (checked).


###Predicates

The **Where()** method accepts a delegate (expressed as as lambda expression) called a *predicate*.

A predicate is any function accepting the type of the query (TodoItem in this case) and returning a boolean value. The boolean value determines if each item is included (true) or excluded (false). 

Breeze uses a large subset of the Linq (Language Integrated Query) facility of .Net to express queries making the full power of the C# language is available to express filter conditions.

If we wanted the active, open Todos, we would need to constrain both the “IsArchived” and the “IsDone” properties:

	var query3 = query1.Where(td => !td.IsArchived && !td.IsDone);
	var activeTodos = awaitManager.ExecuteQuery(query3);
                   
Filter constraints can take other forms:

    var query4 = query1.Where(td => td.Description.Contains("Wine"));
    var wineTodos = await manager.ExecuteQuery(query4);

The Breeze query language is capable of answering many complex questions. Check out the query examples for an inventory of possibilities.

##The entity cache

The EntityManager maintains a local cache of entities. A query is one of the ways that entities enter its cache. The manager merges entity results into its cache after every successful query. If we query three times for the “Water” Todo, the manager merges it into its cache three times, but only keeps one copy of the “Water” Todo entity. It knows that the “Id” property is the TodoItem primary key. Therefore it can tell that the “Water” Todo is already in cache, even if someone changed its name to “Wine“.

The EntityManager doesn’t replace an entity object in cache after a query. That object stays right where it is. Instead, the manager updates the entity’s property values in place from the data in the query results (Note 3).

###Querying the local cache

So far we've sent every query to the server to fetch data from afar. You can query the cache in the same way using the same query language. In fact, you can use the same query:

	// Execute above query locally
	var localWineTodos = manager.ExecuteQueryLocally(query4);

The entity manager executes the query synchronously and the results are available immediately (unlike **ExecuteQuery()** which is asynchronous and must be awaited)


####Notes

1.	Technically, the query returns every Todo that the persistence service “Todos” method will supply. That service method might have logic to limit the number of Todos returned in a single request.

2.	Breeze converts the query into an OData query string such as this one:

	?$filter=IsArchived%20eq%20false … which is easier to understand after replacing ‘%20’ with spaces.

	Logic in an OData-aware persistence service translates that syntax into a query form that the service understands. The Todo app persistence service translates it into a LINQ query; subsequent execution of the LINQ query causes the Entity Framework to compose and issue a SQL query. Thus the filtering takes place on the data tier, not in the service or client layers.

3.	That’s what we meant when we said the manager merges entity results into the cache. A missing entity is inserted; an in-cache entity is updated … unless that entity is in a change state. The manager will not update the current property values of an entity with a pending change; that’s the default merge strategy. We’re veering into a more advanced topic covered elsewhere.