---
layout: doc-js
---
<h1>Query with a filter</h1>

<p class="note">Most of the code snippets on this page are in the <a href="/samples/todo">Breeze Todo App</a>; a few are in the <strong>basicTodoTests </strong>module of the <a href="/samples/doccode">DocCode teaching tests</a>.</p>

<p>Our <a href="/documentation/first-query-0">first query</a> returned every Todo in the database [<a href="#note 1">1</a>]. &nbsp;That&rsquo;s fine for a short list of Todos; not so great if we&rsquo;re querying for orders of a large company. We need a query that selects a more manageable number of results, preferably the ones that interest the user.</p>

<p>In this app, we can archive the Todos that we want to keep but look at rarely. The <em><span class="codeword">getAllTodos</span> </em>method in the <em>dataservice</em> has an &ldquo;IncludeArchived&rdquo; option. If the flag is false, the code adds a &ldquo;where&rdquo; clause to filter exclusively for <em>Todos </em>that are active (not archived).</p>

<div>
<pre class="brush:jscript;">
function getAllTodos(includeArchived) {
    var query = breeze.EntityQuery
            .from(&quot;Todos&quot;)
            .orderBy(&quot;CreatedAt&quot;);

    if (!includeArchived) {
        query = query.where(&quot;IsArchived&quot;, &quot;==&quot;, false);
    }

    return manager.executeQuery(query);
};</pre>
</div>

<p>Notice the <em>method chaining</em> syntax. The where method doesn&rsquo;t modify the original query; it extends a copy of the original and returns the copy.</p>

<p>With this approach you can maintain a library of base queries and mint new ones by extension as you need them. For example, the Todo app looks at the <strong>Show archived</strong> checkbox) to decide if it should add the where clause to the base query (unchecked) or not (checked).</p>

<p><img alt="" src="/sites/default/files/images/documentation/BreezeTodoShowArchivedSnapshot.jpg" /></p>

<h2>Predicates</h2>

<p>The <span class="codeword">where()</span> method takes three values:</p>

<ol>
	<li value="NaN">The name of the entity property to evaluate (&ldquo;IsArchived&rdquo;)</li>
	<li value="NaN">A value comparison operator (&ldquo;==&rdquo;)</li>
	<li value="NaN">A comparison value (<span class="codeword">false</span>)</li>
</ol>

<p>The <span class="codeword">where()</span> method converts these three values into a <em>predicate</em> for filtering the data <strong><em>on the server</em></strong> [<a href="#note 2">2</a>].</p>

<p>A <strong><em>predicate</em></strong> describes a selection function returning either <em>true</em> (keep it) or <em>false</em> (exclude it). We could write the predicate first and then use it in the where clause:</p>

<div>
<pre class="brush:jscript;">
var predicate = new breeze.Predicate(&quot;IsArchived&quot;, &quot;==&quot;, false);

var query = new EntityQuery(&quot;Todos&quot;).where(predicate).orderBy(&quot;CreatedAt&quot;);</pre>
</div>

<p>We prefer the simpler in-line form for a single-condition filter. We need the predicate form when we filter on multiple criteria.</p>

<p>What if we want the active, open Todos? We need to constrain both the &ldquo;IsArchived&rdquo; and the &ldquo;IsDone&rdquo; properties. We can&rsquo;t create a new predicate that does both. But we can combine two predicates to do both [<a href="#note 3">3</a>]:</p>

<div>
<pre class="brush:jscript;">
var p1 = new breeze.Predicate(&quot;IsArchived&quot;, &quot;==&quot;, false);
var p2 = breeze.Predicate(&quot;IsDone&quot;, &quot;==&quot;, false); 
var predicate = p1.and(p2);

var query = new EntityQuery(&quot;Todos&quot;).where(predicate);</pre>
</div>

<p>In addition to &#39;and&#39;, there are also &#39;or&#39; and &#39;not&#39; operators for predicates. You can learn more about them in the API docs for <a href="/sites/all/apidocs/classes/Predicate.html">Predicates</a>.</p>

<h2>Filter operator enumeration</h2>

<p>We wrote &quot;==&quot; to filter for every Todo whose &quot;<em>IsArchived</em>&quot; property equals <em>false.</em> Breeze supports a variety of other comparison operators, all of which can be expressed as strings. Maybe you feel queesy about magic strings such as &quot;==&quot;. Breeze offers an alternative, a <a href="/sites/all/apidocs/classes/FilterQueryOp.html" target="_blank">FilterQueryOp </a>enumeration. Intellisense for that enumeration reveals the available comparison operators and can eliminate the spelling mistakes that lead to runtime JavaScript errors.</p>

<p>We could have written the previous predicates using the <em>FilterQueryOp </em>enumeration:</p>

<pre class="brush:jscript;">
var op = breeze.FilterQueryOp;
var p1 = new breeze.Predicate(&quot;IsArchived&quot;, op.Equals,  false);
var p2 = breeze.Predicate(&quot;IsDone&quot;, op.NotEquals, true); // using NotEquals for variety
var predicate = p1.and(p2);</pre>

<h2>The entity cache</h2>

<p>The EntityManager maintains a local cache of entities. A query is one of the ways that entities enter its cache. The manager merges entity results into its cache after every successful query. If we query three times for the &ldquo;Water&rdquo; Todo, the manager merges it into its cache three times.</p>

<p>The EntityManager only keeps one copy of the &ldquo;Water&rdquo; Todo entity. It knows that the &ldquo;Id&rdquo; property is the TodoItem primary key. Therefore it can tell that the &ldquo;Water&rdquo; Todo is already in cache, even if someone changed its name to &ldquo;Wine&ldquo;.</p>

<p>The EntityManager doesn&rsquo;t replace an entity object in cache after a query. That object stays right where it is. Instead, the manager updates the entity&rsquo;s property values in place from the data in the query results [<a href="#note 4">4</a>] and the HTML label on screen immediately changes to &ldquo;Wine&rdquo;.</p>

<p>The label changes because it is <a href="/documentation/databinding-knockout">bound with Knockout</a> to the entity&rsquo;s &ldquo;Description&rdquo;. &ldquo;Description&rdquo; is a Knockout observable property so any change to its value, whether made by the user or by Breeze, raises a <em>property changed</em> notification that updates all of its data bound screen controls.</p>

<h2>Querying the local cache</h2>

<p>The Breeze query language is capable of answering many complex questions. Check out the <a href="/documentation/query-examples">query examples</a> for an inventory of possibilities.</p>

<p>So far we&#39;ve sent every query to the server to fetch data from a far. You can query the cache in the same way using the same query language. In fact, you can use the same query:</p>

<pre class="brush:jscript;">
var query = new EntityQuery(&quot;Todos&quot;).where(predicate); // from the example above
var results = manager.executeQueryLocally(query);</pre>

<p>The manager executes the query synchronously and the results are available immediately (unlike executeQuery which is asynchronous and returns a promise)</p>

<h2>Next up ... creating entities</h2>

<p>Another way that entities enter the cache is by <strong><a href="/documentation/add-new-entity">adding them directly</a></strong>.</p>

<h2>Notes</h2>

<p><a name="note 1"></a>[1] Technically, the query returns every Todo that the persistence service &ldquo;Todos&rdquo; method will supply. That service method might have logic to limit the number of Todos returned in a single request.</p>

<p><a name="note 2"></a>[2] It bears repeating that the filter and the sort specified in the <span class="codeword">orderBy</span> are processed <strong><em>on the server</em></strong>, not on the client. Breeze converts the query into an OData query string such as this one:</p>

<div>
<pre class="brush:jscript;">
?$filter=IsArchived%20eq%20false&amp;$orderby=CreatedAt</pre>
</div>

<p>&hellip; which is easier to understand after replacing &lsquo;%20&rsquo; with spaces.</p>

<div>
<pre class="brush:jscript;">
?$filter=IsArchived eq false &amp; $orderby=CreatedAt</pre>
</div>

<p>Logic in an OData-aware persistence service translates that syntax into a query form that the service understands. The Todo app persistence service translates it into a LINQ query; subsequent execution of the LINQ query causes the Entity Framework to compose and issue a SQL query. Thus the filtering and sorting takes place on the <em>data tier</em>, not in the service or client layers.</p>

<p><a name="note 3"></a>[3] Find this example in the &ldquo;<em>get only open and active todos</em>&rdquo; test in the <strong><em>basicTodoTests</em></strong> module. All code presented in this topic appears in some form in the <a href="#_Beginning_Breeze:_the_1">sample tests</a>, usually in the <em>basicTodoTests</em> module.</p>

<p><a name="note 4"></a>[4] That&rsquo;s what we meant when we said the manager <em>merges</em> entity results into the cache. A missing entity is inserted; an in-cache entity is updated &hellip; unless that entity is in a change state. The manager will not update the current property values of an entity with a pending change; that&rsquo;s the default merge strategy. We&rsquo;re veering into a more advanced topic covered elsewhere.</p>
