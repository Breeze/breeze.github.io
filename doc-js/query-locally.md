---
layout: doc-js
redirect_from: "/old/documentation/querying-locally.html"
---

<h1>Querying Locally</h1>

<p>The Breeze <code>EntityManager</code> is both a gateway to server data and a cache of entities. Entities enter the cache as a result of</p>

<ul>
	<li>querying the server with an <code>EntityQuery</code></li>
	<li>adding new entities to cache</li>
	<li>importing entities from another <code>EntityManager</code> or from file</li>
</ul>

<p>Your client app can retrieve entities from cache in a variety of ways as discussed in this topic.</p>

<p class="note">The query examples on this page are in one of the <strong>queryTests</strong> modules of the <a href="/samples/doccode" target="_blank">DocCode</a>. The tests are yours to explore and modify. Please send us your feedback and contributions.</p>

<h1><a id="synchronous-methods" name="synchronous-methods"></a>Synchronous methods</h1>

<p>The <code>EntityManager</code> offers several methods for retrieving entities from cache without visiting the server. All of them are synchronous and return their results immediately.</p>

<p>With <a href="/doc-js/api-docs/classes/EntityManager.html#method_executeQueryLocally" target="_blank"><code>executeQueryLocally</code></a>, you can take a previously defined query that would otherwise target the remote server and apply it to the cache</p>

<pre class="brush:jscript;">
// Customers whose names begin with &#39;c&#39;
var query = breeze.EntityQuery
                  .from(&#39;Customers&#39;)
                  .where(&#39;CompanyName&#39;, &#39;startsWith&#39;, &#39;c&#39;);

var promise = manager.executeQuery(query);          // query remotely (async)
var customers = manager.executeQueryLocally(query); // query the cache (synchronous)
</pre>

<p>Notice how you get the customers back immediately.</p>

<blockquote>
<p>The <a href="/doc-js/api-docs/classes/EntityQuery.html#method_executeLocally" target="_blank"><code>EntityQuery.executeLocally</code></a> method does the same thing:</p>

<pre class="brush:jscript;">
var customers = query.using(manager).executeLocally();</pre>
</blockquote>

<p>The following methods aren&#39;t really queries. They just get entities from the cache directly. They all begin with the <em>get...</em> prefix.</p>

<ul>
	<li><a href="/doc-js/api-docs/classes/EntityManager.html#method_getChanges" target="_blank"><code>getChanges([entityTypes])</code></a></li>
	<li><a href="/doc-js/api-docs/classes/EntityManager.html#method_getEntities" target="_blank"><code>getEntities([entityTypes],[entityState])</code></a></li>
	<li><a href="/doc-js/api-docs/classes/EntityManager.html#method_getEntityByKey" target="_blank"><code>getEntityByKey(entityKey)</code></a></li>
</ul>

<h2>getChanges</h2>

<p>A <code>getChanges()</code> call returns all entities in cache with unsaved changes. You might want to iterate over them in your pre-save logic. You might want to save the changed entities to local storage periodically so you can restore the user&#39;s work if the application crashes or is closed accidentally.</p>

<pre class="brush:jscript;">
var changes = manager.getChanges();
window.localStorage.setItem(&#39;backup&#39;, changes);
...
restored = window.localStorage.getItem(&#39;backup&#39;);
manager.importEntities(restored);
</pre>

<p>You might be interested in pending changes to particular type(s);</p>

<pre class="brush:jscript;">
var changedCustomers = manager.getChanges(&#39;Customer&#39;);
var myChangeSet = manager.getChanges([&#39;Customer&#39;, &#39;Order&#39;, &#39;OrderDetail&#39;);
</pre>

<h2>getEntities</h2>

<p>Get entities by <a href="/doc-js/api-docs/classes/EntityType.html" target="_blank"><code>EntityType</code></a> and/or <a href="/doc-js/api-docs/classes/EntityState.html" target="_blank"><code>EntityState</code></a>.</p>

<p>Here&#39;s how to extract all <code>Customer</code> entities in cache:</p>

<pre class="brush:jscript;">
var cachedCustomers = getEntities(&#39;Customer&#39;);
</pre>

<p>It&#39;s often useful for extracting entities of a particular type that are in a particular state. For example, regular Breeze queries exclude entities that are marked for delete. You won&#39;t seem them in query results. But you can get them this way:</p>

<pre class="brush:jscript;">
someCustomer.entityAspect.setDeleted(); // mark the Customer for deletion
...
var deletedCustomers = manager.getEntities(
                         &#39;Customer&#39;, breeze.EntityState.Deleted);

var i = -1 &lt; deletedCustomers.indexOf(someCustomer); // true
</pre>

<h3>getEntities and inheritance</h3>

<p>Breeze supports type inheritance. Queries for a base type can return entities of that type (if it isn&#39;t abstract) and all of its derived sub-types. This is called a &quot;polymorphic query&quot;. A navigation property defined for a base type can return a &quot;polymorphic&quot; result too.</p>

<p><code>Customer.Orders</code>is an example of polymorphic navigation property in the &quot;Northwind&quot; model of <a href="/samples/doccode.html">the DocCode sample</a>. It can return instances of <code>Order</code> or <code>InternationalOrder</code>.</p>

<p>However, <code>getEntities()</code>returns entities for the <em>specified type(s) only</em>. If you want to get both <code>Order</code> and <code>InternationalOrder</code> from cache, you&#39;d have to write this:</p>

<pre class="brush:jscript;">
var allOrders = getEntities([&#39;Order&#39;, &#39;InternationalOrder&#39;]);
</pre>

<p>What if you know the base type but not the subtypes? Breeze can tell you with the <code>EntityType.getSelfAndSubtypes</code> method which returns an array of the base type and its derived types. Let&#39;s put all of these thoughts together.</p>

<pre class="brush:jscript;">
var orderType = manager.metadataStore.getType(&#39;Order&#39;);
var allOrders = manager.getEntities(orderType.getSelfAndSubtypes());
</pre>

<h2>getEntityByKey</h2>

<p>It&#39;s easy to find an entity in cache if you know its key</p>

<pre class="brush:jscript;">
var key = new breeze.EntityKey(&#39;Employee&#39;, 1);
var nancyDavolio = manager.getEntityByKey(key);

var andrewFuller = manager.getEntityByKey(&#39;Employee&#39;, 2);
</pre>

<h1><a id="asynchronous-methods" name="asynchronous-methods"></a>Asynchronous cache queries</h1>

<p>You may want to query the cache with an asynchronous syntax. External conditions may determine whether a particular query targets the server or the cache. The caller won&#39;t know at design time so the developer plays it safe and writes a method to encapsulate the situation:</p>

<pre class="brush:jscript;">
// somewhere in a view model
service.getCustomersStartingWith(searchText)
       .then(success).fail(handleFailure);
...
</pre>

<p>The service makes a decision to go remote or query the cache based on the current connection status:</p>

<pre class="brush:jscript;">
service.getCustomersStartingWith function(searchText){
    var query = breeze.EntityQuery.from(&#39;Customers&#39;)
                .where(&#39;CompanyName&#39;, &#39;startsWith&#39;, searchText);
    if (isDisconnected()) {
       // can&#39;t reach the server; run locally instead
       var query = query.using(breeze.FetchStrategy.FromLocalCache);
    }

    var promise = manager.executeQuery(query);        
    return promise;
}
</pre>

<p>The method signature retains its asynchronous form even though the query will run synchronously and return immediately when the application is disconnected. Internally, when the app is disconnected, the developer <a href="/doc-js/api-docs/classes/EntityQuery.html#method_using" target="_blank">changes the query&#39;s <code>QueryOption</code></a> to target the cache.</p>

<p>We can even toggle the <code>EntityManager</code> itself to run locally when the app loses the connection.</p>

<pre class="brush:jscript;">
function OnDisconnected() {
    options = new QueryOptions( { 
        fetchStrategy: FetchStrategy.FromLocalCache} );
    manager.setProperties({queryOptions: options});
}

... somewhere far away ...

manager.executeQuery(query); // will it run locally or remotely?
</pre>

<h1>When local queries fail</h1>

<p>Suppose we&#39;ve written an application to manage a technical conference. <code>Person</code> is one of the entity types. &quot;Speakers&quot; - the people giving talks at the conference - are one subset of the <code>Person</code> types tracked in our app. The app server exposes a resource called &quot;Speakers&quot; that returns the entities of type <code>Person</code> who are speaking at the conference. The following remote query works just fine.</p>

<pre class="brush:jscript;">
var query = EntityQuery.from(&#39;Speakers&#39;);
return manager.executeQuery(query);
</pre>

<p>Shockingly, we get an error when we try to run this query against the cache</p>

<pre class="brush:jscript;">
return manager.executeQueryLocally(query); // CRASH!
</pre>

<p>The exception says something like:</p>

<p style="margin-left: 2em;">&quot;<em>Can not find EntityType for either entityTypeName: &#39;undefined&#39; or resourceName:&#39;Speakers&#39;</em>&quot;</p>

<p>Evidently Breeze didn&#39;t know how to interpret the query.</p>

<h2>Resources names are not EntityType names</h2>

<p>Let&#39;s look at the query definition again and think about how Breeze interprets it.</p>

<pre class="brush:jscript;">
var query = EntityQuery.from(&#39;Speakers&#39;);
</pre>

<p>We began, as we usually do, by naming the <strong>resource</strong> that will supply the data. This resource is typically a segment of a URL pointing to a remote service endpoint, perhaps the name of a Web API controller method ... a method named &quot;Speakers&quot;.</p>

<p>It&#39;s critical to understand that <strong>the query resource name is not the same as the <code>EntityType</code> name!</strong> That&#39;s easy to see here. The resource name is &quot;Speakers&quot;; the type name is &quot;Person&quot;.</p>

<p>Breeze needs a way to correlate the <strong>resource</strong> name with the&nbsp;<code>EntityType</code>. Breeze doesn&#39;t know the correlation on its own.</p>

<p>A quick, easy solution is to tell Breeze to map &quot;Speakers&quot; to <code>Person</code> by appending the <strong><code>toType()</code></strong> method to the end of the query:</p>

<pre class="brush:jscript;">
var query = EntityQuery.from(&#39;Speakers&#39;)toType(&#39;Person&#39;);
return manager.executeQueryLocally(query); // OK
</pre>

<h4>Learn more about resource names</h4>

<p>You may wonder why generally don&#39;t add <code>toType()</code> to our queries. What's different about this case?
How can you teach Breeze to recognize "Speakers" as a resource returning <code>Person</code> entities?</p>

<p>Learn the answers to these questions in the <a href="/doc-js/query-from.html">"Query from" topic</a>.</p>

<h2>Fetch an entity by its key</h2>

<p>We often want to fetch an entity with a known key. For example, we may be looking at an order and decide that we want to see information about the employee who sold the order.</p>

<p>We could use a regular query:</p>

<pre class="brush:jscript;">
var employeeID = someOrder.EmployeeID(); // FK of the salesrep who sold the order

EntityQuery.from(&#39;Employee&#39;)
           .where(&#39;EmployeeID&#39;, &#39;eq&#39;, employeeID)
           .using(manager).execute()
           .then(function(data) {
                // &#39;employee&#39; is a Knockout observable
                employee(data.results[0]); // KO binding updates the screen
            });
</pre>

<p>Breeze offers a <a href="/doc-js/api-docs/classes/EntityManager.html#method_fetchEntityByKey" target="_blank"><code>fetchEntityByKey</code></a> shortcut for this common case.</p>

<pre class="brush:jscript;">
manager.fetchEntityByKey(&#39;Employee&#39;, employeeID)
       .then(function(data) {
            employee(data.entity); // KO binding updates the screen
       });
</pre>

<p>Sometimes we have the key for an entity but don&#39;t know if it is in cache. We&#39;ll go to the server if we have to but we&#39;d rather not fetch it from the server if we already have it in cache. The optional last parameter, <code>checkLocalCacheFirst</code>, makes that easy.</p>

<pre class="brush:jscript;">
manager.fetchEntityByKey(&#39;Employee&#39;, employeeID, true)
       .then(function(data) {
            employee(data.entity); // KO binding updates the screen
       });
</pre>

<p>We&#39;ll go to the server the first time because the order&#39;s <code>Employee</code> salerep is not in cache. But subsequent queries will spare the round-trip and return the cached salesrep.</p>

<h2>Combine cache and remote queries</h3>

<p>With the exception of <code>fetchEntityByKey</code>, we can run a query either remotely or locally but not both. What if we need both?</p>

<p>What if we want to present a list of employees on screen ... a list that combines unsaved employee changes with the latest employee data from the server?</p>

<p>We can chain a pair of queries as in this example from <em>queryTests.js</em> in the <a href="/samples/doccode.html" target="_blank">DocCode</a> teaching tests:</p>

<pre class="brush:jscript;">
// Assume &#39;Andrew&#39; and &#39;Anne&#39; are in the database and the manager is empty
// Create an &#39;Alice&#39; employee and add it to cache
var alice = manager.createEntity(&#39;Employee&#39;, { FirstName: &#39;Alice&#39; });

// query for Employees with names that begin with &#39;A&#39;
var query = EntityQuery.from(&#39;Employees&#39;)
                       .where(&#39;FirstName&#39;, &#39;startsWith&#39;, &#39;A&#39;)
                       .using(em);

// chain remote and local query execution
var promise = query.execute()
    .then(function () { // ignore remote query results and chain to local query
        return query.using(breeze.FetchStrategy.FromLocalCache).execute();
    });

promise.then(function (data) {
    var firstNames = data.results.map(function (emp) { return emp.FirstName(); });
    console.log(firstNames.join(&#39;, &#39;)); // &quot;Alice, Andrew, Anne&quot;,
})

</pre>

<p>Observe that we</p>

<ul>
	<li>started with an empty <code>EntityManager</code></li>
	<li>added a new person, Alice, to the manager&#39;s cache.</li>
	<li>Anne is unsaved and not yet in the database</li>
	<li>ran the query remotely, returning Andrew and Anne</li>
	<li>discarded the query results ... but Andrew and Anne remain in cache</li>
	<li>re-ran the query against the cache, picking up all three: Alice, Andrew, and Anne</li>
</ul>

<h3>Preserving pending changes during a re-query</h4>

<p>In a related DocCode sample we demonstrate how an entity in cache with pending changes can effect the results of a combined remote/local query. Here is the scenario:</p>

<ul>
	<li>start with an empty <code>EntityManager</code></li>
	<li>fetch Anne from the database.</li>
	<li>change her name to Charlene ... do not save</li>
	<li>query for all persons whose first name begins with &#39;A&#39;</li>
	<li>that query returns Andrew and Anne</li>
	<li>but the Anne entity&#39;s first name remains in the changed &#39;Charlene&#39; state</li>
	<li>discard the query results</li>
	<li>re-run the &#39;A&#39; query against the cache</li>
	<li>the query returns only Andrew, not the entity formerly-known-as-Anne</li>
</ul>

<p>Focus on what happens to the &#39;Anne&#39; entity. The default <a href="/doc-js/api-docs/classes/MergeStrategy.html" target="_blank"><code>MergeStrategy.PreserveChanges</code></a> prevents the remote query from overwriting the current name value of &#39;Charlene&#39; with the database value which is still &#39;Anne&#39;. Then the local query excludes the Anne entity from its results because her local current name is &#39;Charlene&#39;.</p>

<p>This behavior is exactly what we want most of the time. The user who is changing &#39;Alice&#39; to &#39;Charlene&#39; would be surprised, annoyed, or both if the re-query wiped out her changes. She&#39;d be equally surprised if the list of &#39;A&#39; employees displayed a person named &#39;Charlene&#39;.</p>

<p>We should be able to query the database repeatedly without having its data overwrite our pending changes. We want the latest information from the database but not at the expense of our unsaved work.</p>

<p>If we really do want the database values to trump unsaved changes ... if we want the query to change &#39;Charlene&#39; back to &#39;Alice&#39; ..., we can specify the <a href="/doc-js/api-docs/classes/MergeStrategy.html" target="_blank"><code>MergeStrategy.OverwriteChanges</code></a>.</p>
