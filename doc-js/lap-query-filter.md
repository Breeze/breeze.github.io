---
layout: doc-js
redirect_from: "/old/documentation/.html"
---
#Query with a filter

> Most of the code snippets on this page are in the <a href="/samples/todo">Breeze Todo App</a>; a few are in the **basicTodoTests **module of the <a href="/samples/doccode">DocCode teaching tests</a>.

Our <a href="/documentation/first-query-0">first query</a> returned every Todo in the database [<a href="#note 1">1</a>].  That's fine for a short list of Todos; not so great if we're querying for orders of a large company. We need a query that selects a more manageable number of results, preferably the ones that interest the user.

In this app, we can archive the Todos that we want to keep but look at rarely. The *<span class="codeword">getAllTodos</span> *method in the *dataservice* has an "IncludeArchived" option. If the flag is false, the code adds a "where" clause to filter exclusively for *Todos *that are active (not archived).


<pre class="brush:jscript;">
function getAllTodos(includeArchived) {
    var query = breeze.EntityQuery
            .from("Todos")
            .orderBy("CreatedAt");

    if (!includeArchived) {
        query = query.where("IsArchived", "==", false);
    }

    return manager.executeQuery(query);
};


Notice the *method chaining* syntax. The where method doesn't modify the original query; it extends a copy of the original and returns the copy.

With this approach you can maintain a library of base queries and mint new ones by extension as you need them. For example, the Todo app looks at the **Show archived** checkbox) to decide if it should add the where clause to the base query (unchecked) or not (checked).

<img alt="" src="/images/BreezeTodoShowArchivedSnapshot.jpg" />

##Predicates

The <span class="codeword">where()</span> method takes three values:


	<li value="NaN">The name of the entity property to evaluate ("IsArchived")
	<li value="NaN">A value comparison operator ("==")
	<li value="NaN">A comparison value (<span class="codeword">false</span>)


The <span class="codeword">where()</span> method converts these three values into a *predicate* for filtering the data ***on the server*** [<a href="#note 2">2</a>].

A ***predicate*** describes a selection function returning either *true* (keep it) or *false* (exclude it). We could write the predicate first and then use it in the where clause:


<pre class="brush:jscript;">
var predicate = new breeze.Predicate("IsArchived", "==", false);

var query = new EntityQuery("Todos").where(predicate).orderBy("CreatedAt");


We prefer the simpler in-line form for a single-condition filter. We need the predicate form when we filter on multiple criteria.

What if we want the active, open Todos? We need to constrain both the "IsArchived" and the "IsDone" properties. We can't create a new predicate that does both. But we can combine two predicates to do both [<a href="#note 3">3</a>]:


<pre class="brush:jscript;">
var p1 = new breeze.Predicate("IsArchived", "==", false);
var p2 = breeze.Predicate("IsDone", "==", false); 
var predicate = p1.and(p2);

var query = new EntityQuery("Todos").where(predicate);


In addition to 'and', there are also 'or' and 'not' operators for predicates. You can learn more about them in the API docs for <a href="/sites/all/apidocs/classes/Predicate.html">Predicates</a>.

##Filter operator enumeration

We wrote "==" to filter for every Todo whose "*IsArchived*" property equals *false.* Breeze supports a variety of other comparison operators, all of which can be expressed as strings. Maybe you feel queesy about magic strings such as "==". Breeze offers an alternative, a <a href="/sites/all/apidocs/classes/FilterQueryOp.html" target="_blank">FilterQueryOp </a>enumeration. Intellisense for that enumeration reveals the available comparison operators and can eliminate the spelling mistakes that lead to runtime JavaScript errors.

We could have written the previous predicates using the *FilterQueryOp *enumeration:

<pre class="brush:jscript;">
var op = breeze.FilterQueryOp;
var p1 = new breeze.Predicate("IsArchived", op.Equals,  false);
var p2 = breeze.Predicate("IsDone", op.NotEquals, true); // using NotEquals for variety
var predicate = p1.and(p2);

##The entity cache

The EntityManager maintains a local cache of entities. A query is one of the ways that entities enter its cache. The manager merges entity results into its cache after every successful query. If we query three times for the "Water" Todo, the manager merges it into its cache three times.

The EntityManager only keeps one copy of the "Water" Todo entity. It knows that the "Id" property is the TodoItem primary key. Therefore it can tell that the "Water" Todo is already in cache, even if someone changed its name to "Wine".

The EntityManager doesn't replace an entity object in cache after a query. That object stays right where it is. Instead, the manager updates the entity's property values in place from the data in the query results [<a href="#note 4">4</a>] and the HTML label on screen immediately changes to "Wine".

The label changes because it is <a href="/documentation/databinding-knockout">bound with Knockout</a> to the entity's "Description". "Description" is a Knockout observable property so any change to its value, whether made by the user or by Breeze, raises a *property changed* notification that updates all of its data bound screen controls.

##Querying the local cache

The Breeze query language is capable of answering many complex questions. Check out the <a href="/documentation/query-examples">query examples</a> for an inventory of possibilities.

So far we've sent every query to the server to fetch data from a far. You can query the cache in the same way using the same query language. In fact, you can use the same query:

<pre class="brush:jscript;">
var query = new EntityQuery("Todos").where(predicate); // from the example above
var results = manager.executeQueryLocally(query);

The manager executes the query synchronously and the results are available immediately (unlike executeQuery which is asynchronous and returns a promise)

##Next up ... creating entities

Another way that entities enter the cache is by **<a href="/documentation/add-new-entity">adding them directly</a>**.

##Notes

<a name="note 1"></a>[1] Technically, the query returns every Todo that the persistence service "Todos" method will supply. That service method might have logic to limit the number of Todos returned in a single request.

<a name="note 2"></a>[2] It bears repeating that the filter and the sort specified in the <span class="codeword">orderBy</span> are processed ***on the server***, not on the client. Breeze converts the query into an OData query string such as this one:


<pre class="brush:jscript;">
?$filter=IsArchived%20eq%20false&amp;$orderby=CreatedAt


... which is easier to understand after replacing '%20' with spaces.


<pre class="brush:jscript;">
?$filter=IsArchived eq false &amp; $orderby=CreatedAt


Logic in an OData-aware persistence service translates that syntax into a query form that the service understands. The Todo app persistence service translates it into a LINQ query; subsequent execution of the LINQ query causes the Entity Framework to compose and issue a SQL query. Thus the filtering and sorting takes place on the *data tier*, not in the service or client layers.

<a name="note 3"></a>[3] Find this example in the "*get only open and active todos*" test in the ***basicTodoTests*** module. All code presented in this topic appears in some form in the <a href="#_Beginning_Breeze:_the_1">sample tests</a>, usually in the *basicTodoTests* module.

<a name="note 4"></a>[4] That's what we meant when we said the manager *merges* entity results into the cache. A missing entity is inserted; an in-cache entity is updated ... unless that entity is in a change state. The manager will not update the current property values of an entity with a pending change; that's the default merge strategy. We're veering into a more advanced topic covered elsewhere.
