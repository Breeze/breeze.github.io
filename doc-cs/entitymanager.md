---
layout: doc-cs
---

<h1>EntityManager</h1>

<p>The <em>EntityManager</em> is the gateway to the persistence service and holds a cache of entities that the application is working with, including entities that have been&nbsp;queried, added, updated, and marked for deletion.&nbsp;The <em>EntityManager</em> is the core class in Breeze, and this page discusses its primary capabilities.</p>

<h2>Overview</h2>

<p>The <em>EntityManager</em> serves three main functions:</p>

<ol>
	<li>It communicates with the persistence service.</li>
	<li>It queries and saves entities.</li>
	<li>It holds entities in a local container called the entity cache.</li>
</ol>

<p>When the client&nbsp;application requires data, it typically calls a method on an instance of an <em>EntityManager</em>.&nbsp;The <em>EntityManager</em>&nbsp;establishes communication channels, sets up the client&#39;s security context, serializes and deserializes data, and regulates the application-level flow of traffic with the persistence service.</p>

<p>In most cases when you query with an <em>EntityManager</em>, you are not just getting the results of the query, but you&nbsp;also place the&nbsp;queried&nbsp;entities into&nbsp;the <em>EntityManager&#39;s</em> cache. When you create new entities, you add them to that cache. When you delete entities, you are actually marking entities in the cache, scheduling them to be deleted.</p>

<p>When you eventually ask the <em>EntityManager</em> to save, it finds the changed entities in cache - the ones you&#39;ve modified, added, and scheduled for deletion - and sends the changes&nbsp;to the <em>persistence service</em>. If all goes well, the service reports success and the <em>EntityManager </em>adjusts the cached entities to reflect the save by discarding deleted entities and re-setting the <em><strong>EntityState</strong></em> of the added and modified entities to <em>Unchanged</em>.</p>

<h2>Key EntityManager capabilities</h2>

<p>The following is a summary of the methods available on the EntityManager arranged by task. For a complete list of methods, please see the <a href="http://www.breezejs.com/sites/all/apidocs/classes/EntityManager.html">EntityManager API documentation</a>.</p>

<h2>Querying for entities</h2>

<p>EntityManager methods relating to querying entities, either from remote services or from its own internal entity cache.</p>

<table border="1" cellpadding="1" cellspacing="1">
	<thead>
		<tr>
			<th scope="col">Method</th>
			<th scope="col">Summary</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><em style="margin: 0px; padding: 0px; outline: 0px; border: 0px currentColor; color: rgb(77, 77, 77); font-size: 13px; vertical-align: baseline;"><span class="wikiexternallink" style="margin: 0px; padding: 0px; outline: 0px; border: 0px currentColor; font-style: inherit; vertical-align: baseline;">executeQuery</span></em></td>
			<td><span style="color: rgb(77, 77, 77); font-size: 13px;">Asynchronously executes its&nbsp;</span><em style="margin: 0px; padding: 0px; outline: 0px; border: 0px currentColor; color: rgb(77, 77, 77); font-size: 13px; vertical-align: baseline;">EntityQuery</em><span style="color: rgb(77, 77, 77); font-size: 13px;">&nbsp;argument, returning an <em>Promise </em>that in turn will return an array of entities.&nbsp;</span></td>
		</tr>
		<tr>
			<td><em style="margin: 0px; padding: 0px; outline: 0px; border: 0px currentColor; color: rgb(77, 77, 77); font-size: 13px; vertical-align: baseline;"><span class="wikiexternallink" style="margin: 0px; padding: 0px; outline: 0px; border: 0px currentColor; font-style: inherit; vertical-align: baseline;">executeQueryLocally &nbsp; &nbsp; &nbsp; &nbsp;</span></em></td>
			<td><span style="color: rgb(77, 77, 77); font-size: 13px;">Synchonously executes its <em>EntityQuery </em>argument against any entities already in the entity cache, returning an array of entities.</span></td>
		</tr>
		<tr>
			<td><em>fetchEntityByKey</em></td>
			<td>Asynchronously queries for an entity by its key; returning a <em>Promise </em>that in turn will return the entity.</td>
		</tr>
	</tbody>
</table>

<div>&nbsp;</div>

<h2>Finding entities in the cache</h2>

<p>EntityManager methods that allow for searching and retrieving entities from the local entity cache.&nbsp;</p>

<div>
<table border="1" cellpadding="1" cellspacing="1">
	<thead>
		<tr>
			<th scope="col">Method</th>
			<th scope="col">Summary</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><font color="#4d4d4d" size="2"><i>executeQueryLocally &nbsp; &nbsp; &nbsp;</i></font></td>
			<td><span style="color: rgb(77, 77, 77); font-size: 13px;">(same as above) Synchonously executes its EntityQuery argument against any entities already in the entity cache, returning an array of entities.</span></td>
		</tr>
		<tr>
			<td><em>getEntityByKey</em></td>
			<td>Synchonously returns an entity from the local entity cache.</td>
		</tr>
		<tr>
			<td><em>getEntities</em></td>
			<td>Synchronously returns an array of entities of specified EntityTypes and EntityStates from the local entity cache.</td>
		</tr>
		<tr>
			<td><em>getChanges</em></td>
			<td>Synchronously returns an array of changed (Modified, Added, Deleted) entities of optionally specified EntityTypes and EntityStates from the local entity cache.</td>
		</tr>
	</tbody>
</table>
</div>

<h2>Adding / attaching and removing entities to and from the cache</h2>

<p>EntityManager methods that allow for adding or attaching entities to the local entity cache. &nbsp;</p>

<div>
<table border="1" cellpadding="1" cellspacing="1">
	<thead>
		<tr>
			<th scope="col">Method</th>
			<th scope="col">Summary</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><em>addEntity</em></td>
			<td>Adds a new entity to the local entity cache with an EntityState of &#39;Added&#39;.</td>
		</tr>
		<tr>
			<td><em>attachEntity</em></td>
			<td>Adds an entity to the local entity cache with an arbitrary EntityState.</td>
		</tr>
		<tr>
			<td><em>detachEntity &nbsp; &nbsp;&nbsp;</em></td>
			<td>Removes an entity from the local entity cache.&nbsp;</td>
		</tr>
		<tr>
			<td><em>createEntity</em></td>
			<td>Creates a new entity (based on preexisting metadata) and adds or attaches it to the local entity cache.&nbsp;</td>
		</tr>
		<tr>
			<td><em>clear</em></td>
			<td>Clears all entities from the local entity cache.&nbsp;</td>
		</tr>
	</tbody>
</table>
</div>

<h2>Saving changes</h2>

<p>The EntityManager has exactly one method to save changes to the persistence service.</p>

<div>
<table border="1" cellpadding="1" cellspacing="1">
	<thead>
		<tr>
			<th scope="col">Method</th>
			<th scope="col">Summary</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><font color="#4d4d4d" size="2"><i>saveChanges</i></font></td>
			<td>Can save either all of the changes (Added, Modified, and Deleted entities) in the local entity cache or any selected subset.</td>
		</tr>
	</tbody>
</table>
</div>

<div>
<div>
<h2>Rejecting changes</h2>

<p>You can rollback changes ... either all of them at once with <span class="codeword">EntityManager.rejectChanges()</span> or on an entity basis with <span class="codeword">entity.entityAspect.rejectChanges()</span>.</p>

<p>The <span class="codeword">rejectChanges</span> behaves differently depending upon whether the affected entity was newly created (is in the &quot;Added&quot; state) or existed previously (is in the &quot;Modified&quot; or &quot;Deleted&quot;) state. If the entity existed previously, its property values are restored to their pre-modification (pre-deletion) states. Navigation properties are adjusted accordingly. And the <span class="codeword">EntityState</span> becomes &quot;Unchanged&quot;.</p>

<p>If the entity was new (in &quot;Added&quot; state), the previous state is ... nothing. We can&#39;t turn an object to &quot;nothing&quot;; your application may still hold a reference to it. So we detach it from its <span class="codeword">EntityManager</span> (the <span class="codeword">EntityState</span> becomes &quot;Detached&quot;). JavaScript will garbage collect it eventually, once no one holds a reference to it.</p>

<h2>Simulating save with <span class="codeword">acceptChanges</span></h2>

<p>You can simulate the cached result of a save by &quot;accepting&quot; changes on entities with pending changes. Do that for a specific entity by calling <span class="codeword">entity.entityAspect.acceptChanges()</span>. This action sets the <span class="codeword">EntityState</span> to &quot;Unchanged&quot; and wipes away the memory of previous values (the &quot;original values&quot;).</p>

<p>Breeze calls this method after a successful save. Be very careful when you call it. You haven&#39;t saved anything. All you are doing is simulating the aftermath of a save by forcing the entity into the &quot;Unchanged&quot; state (or the &quot;Detached&quot; state if the entity is scheduled to be deleted). If the entity has a temporary key or its foreign keys hold temporary key values, these values remain; they are not updated to permanent key values.</p>

<p>You should only call <span class="codeword">acceptChanges</span> when you know exactly what you are doing. It&#39;s useful in test scenarios but hardly ever in production code. That&#39;s why there is no <span class="codeword">EntityManager.acceptChanges()</span> method; we think it is simply too dangerous to offer such a sweeping method of such dubious merit. Of course you can easily create this method for yourself by looping through the list of pending changes (see <span class="codeword">EntityManager.getChanges</span>).</p>
</div>
</div>

<div>
<h2>Offline support&nbsp;</h2>

<p>The EntityManager is able to serialize its state to a local persistence store and later rematerialize that state. See the <a href="/documentation/exportimport">Export/Import topic</a> for details.</p>

<div>
<table border="1" cellpadding="1" cellspacing="1">
	<thead>
		<tr>
			<th scope="col">Method</th>
			<th scope="col">Summary</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><font color="#4d4d4d" size="2"><i>exportEntities &nbsp; &nbsp;</i></font></td>
			<td>Serializes any selected group of entities to a string for storage to HTML5 local storage or IndexedDb or any other local persistence store.</td>
		</tr>
		<tr>
		</tr>
		<tr>
			<td><em>importEntities</em></td>
			<td>Deserializes any previously &#39;exported&#39; entities into the entity manager.</td>
		</tr>
	</tbody>
</table>
</div>
</div>

<h2>Events&nbsp;</h2>

<p>EntityManager events that may be subscribed to and which occur when changes occur within the local entity cache.&nbsp;</p>

<table border="1" cellpadding="1" cellspacing="1">
	<thead>
		<tr>
			<th scope="col">Event</th>
			<th scope="col">Summary</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><em style="margin: 0px; padding: 0px; outline: 0px; border: 0px currentColor; color: rgb(77, 77, 77); font-size: 13px; vertical-align: baseline;">entityChanged &nbsp; &nbsp;&nbsp;</em></td>
			<td>Fired whenever an entity within the EntityManager has changed.</td>
		</tr>
		<tr>
			<td><em style="margin: 0px; padding: 0px; outline: 0px; border: 0px currentColor; color: rgb(77, 77, 77); font-size: 13px; vertical-align: baseline;">hasChanges &nbsp;&nbsp;</em></td>
			<td>Fired whenever the state of the EntityManager transistions from a state of having changes to not having changes or vice versa.</td>
		</tr>
	</tbody>
</table>

<p><a name="freshCache"></a></p>

<h2>Keeping a fresh cache</h2>

<p>The Breeze <span class="codeword">EntityManager</span> cache provides a ton of benefits. But some folks are so concerned about stale data that they think they should avoid the cache altogether.</p>

<p>Don&#39;t dismiss the cache so quickly. Most of your data is pretty stable. Only some of the resources must always be as fresh as possible. Focus on those resources ... and know this: you can keep a resource minty fresh AND hold it in cache. It&#39;s not &quot;either / or&quot; !</p>

<p>Just do the following:</p>

<ol>
	<li>Always re-query that resource before using it (e.g., when your ViewModel loads the View)</li>
	<li>Clear the cache of all instances of that resource type before you issue that query.</li>
</ol>

<p>I always have my ViewModels delegate to a data access helper &quot;service&quot; that I might call a <span class="codeword">datacontext</span>. You can encapsulate these &quot;always fresh&quot; thoughts within methods of that <span class="codeword">datacontext</span>. Here&#39;s what I mean:</p>

<pre class="brush:javascript">
// get fresh invoices, optionally filtered, after clearing the cache of invoices
function getInvoices(optionalPredicate) {
    clearCachedInvoices();
    var query = breeze.EntityQuery.from(&#39;Invoices&#39;);
    if (optionalPredicate) { query = query.where(predicate); }
    return manager.executeQuery(query).then(_logSuccess, _queryFailed);
}

// refresh a specific invoice
function refreshInvoice(invoice) {
    // Todo: add parameter error checking?
    var query = breeze.EntityQuery.fromEntities([invoice]);
    return manager.executeQuery(query).then(success, _queryFailed);

    function success(data) {
        _logSuccess(data);
        return data.results[0]; // queries return arrays; caller wants the first.
    }
}

function clearCachedInvoices() {
    var cachedInvoices = manager.getEntities(&#39;Invoice&#39;); // all invoices in cache
    // Todo: this should be a function of the Breeze EntityManager itself
    cachedInvoices.forEach(function (entity) { manager.detachEntity(entity); });
}
</pre>

<h3>Important Caveats about cache clearing</h3>

<p>The reason I&#39;m clearing the cache first is that another user may have deleted some of the invoices that you previously retrieved. I assume you want them removed from your cache so that the user sees only the living invoices.</p>

<p>You won&#39;t need this cache clearing step (and the attendant concerns) if invoices can&#39;t be deleted (e.g., you did &quot;soft deletes&quot; instead by marking invoices &quot;inactive&quot;). I personally am deeply wary of deletes as they cause all kinds of problems. I prefer soft deletes.</p>

<p>It&#39;s up to you to make sure that the UI is not holding on to previous invoice entities. You&#39;ve asked the manager to start fresh. That means every existing invoice entity reference is referring to a <strong>detached entity</strong>. After the query, every cached invoice is a new instance.</p>

<p>The other danger of clearing the cache is that it <strong>wipes out all pending invoice changes</strong>. You don&#39;t want to run this method if you could have unsaved invoice changes (new, update, or scheduled deletes). You might want to add guard logic to prevent the loss of unsaved changes. Exactly what that logic is will be application specific. It will likely involve a call to <span class="codeword">manager.hasChanges(&#39;Invoice&#39;)</span>.</p>

<p>You don&#39;t have to worry about lost references if you always refresh everything pertaining to invoices.</p>

<p>Ah ... but <strong>what if you don&#39;t want to clear the decks every time you refresh invoices? What if you want to refresh the entity objects <em>in place</em></strong> rather than replace them completely. Maybe you want to refresh while users have unsaved changes ... and preserve those pending changes. And yet you still want to remove entities that have been deleted by another user.</p>

<p>Well there&#39;s a recipe for you too.</p>

<pre class="brush:javascript">
function refreshAllInvoices(removed) {
        // &#39;removed&#39; is the caller&#39;s array that should be filled with the entities 
        // that we remove from cache; it&#39;s populated in the success method below.
    var cached = manager.getEntities(&#39;Invoice&#39;); // get all invoices in cache
    return breeze.EntityQuery.from(&#39;Invoices&#39;)
                 .using(manager).execute(success, _queryFailed);

    function success() {    
        var results = data.results; // results from query
        // remove each result from the &quot;cached&quot; array
        results.forEach(function (entity) {
            var ix = cached.indexof(entity);
            if (ix &gt; -1) { cached[ix] = null; }
        });

        // what&#39;s left must have been deleted on the server
        // or is a new entity we haven&#39;t saved yet
        // Loop through, detaching the ones we think have been deleted.

        removed ? removed.length = 0 : removed = []; // clear the array or define one

        cached.forEach(function (entity) {
            if (entity !== null &amp;&amp;
                !entity.entityAspect.entityState.isAdded()) {
                removed.push(entity); // let caller know about this one
                manager.detachEntity(entity);
            }
        });

        return results;
    }
}
</pre>

<h1>TBD</h1>

<p>This rest of this page is not ready for publication. It will cover:</p>

<ul>
	<li>Reading the original values of changed entities</li>
	<li>Isolate changes with multiple EntityManagers</li>
	<li>EntityManager constructor options</li>
	<li>Cloning an EntityManager with <span class="codeword">createEmptyCopy</span></li>
	<li>Sharing metadata among EntityManager</li>
	<li>Caching entities from multiple persistence services</li>
	<li>Mocking persistence with cached fake entities and local queries</li>
</ul>

<p>Please consult the API documentation for the following related classes:</p>

<p><span class="codeword">EntityManager<br />
EntityAspect<br />
EntityState<br />
EntityType<br />
QueryOptions<br />
SaveOptions</span></p>
