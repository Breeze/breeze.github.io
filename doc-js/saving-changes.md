---
layout: doc-js
---
<h1>Saving changes</h1>

<p>Save changes to entities in cache by calling the <em>EntityManage</em>r&rsquo;s <span class="codeword">saveChanges</span> method. This topic delves more deeply into the save process and how you control it.</p>

<p>This page is not ready for publication. It will cover:</p>

<ul>
	<li>Detecting changes in cache: <span class="codeword">hasChanges</span> and <span class="codeword">getChanges</span></li>
	<li>Canceling pending changes with <span class="codeword">rejectChanges</span></li>
	<li>Validation before save</li>
	<li>The state of entities after save</li>
	<li>What entities are in <span class="codeword">saveResult.entities</span> collection.</li>
	<li>Temporary key resolution (&ldquo;id fix-up&rdquo;) and the <span class="codeword">saveResult.keyMappings</span>.</li>
	<li>Concurrency and the <span class="codeword">DataProperty.concurrencyMode</span></li>
	<li>Saving selected entities</li>
	<li>Default and explicit <span class="codeword">SaveOptions</span></li>
	<li><a href="/doc-cool-breezes/concurrent-saves.html">Guard against accidental double saves</a></li>
	<li>Saving a change-set to a specific server endpoint with a &quot;<a href="#NamedSave">named save</a>&quot;</li>
	<li>Saving data to an arbitrary HTTP service</li>
</ul>

<h2><a name="NamedSave"></a>Custom save operations with &quot;named saves&quot;</h2>

<p>By default the <span class="codeword">EntityManager.saveChanges</span> method sends a save request to a server endpoint called &quot;SaveChanges&quot;.</p>

<p>But you might have a specific business process to perform when you save a certain constellation of entities. Perhaps the actual storing of changes in the database is only a part of a much larger server-side workflow. What you really have is a &quot;command&quot; that includes a database update.</p>

<p>You could route this command through a single &quot;SaveChanges&quot; endpoint and let the corresponding server method dispatch the save request to the appropriate command handler. That could get messy. It can make more sense to POST requests to command-specific endpoints, passing along just the right entity set in the request body.</p>

<p>That&#39;s what the &quot;<strong>Named Save</strong>&quot; is for. WIth a &quot;Named Save&quot;, you can re-target a &quot;save&quot; to a custom server endpoint such as an arbitrarily named <em>action </em>method on a separate, dedicated Web API controller.</p>

<p>You still call <span class="codeword">EntityManager.saveChanges</span>but you pass in a <span class="codeword">SaveOptions</span> object that specifies the <span class="codeword">resourceName</span> to handle the request. The server should route the request to a suitable controller <em>action</em> method. You&#39;d also set the <span class="codeword">SaveOptions.dataService</span> if you need also to target a different controller.</p>

<p>Assuming that you want to save all pending changes to a custom endpoint, you could write:</p>

<pre class="brush:jscript;">
var so = new SaveOptions({ resourceName: &quot;myCustomSave&quot; });
// null = &#39;all-pending-changes&#39;; saveOptions is the 2nd parameter
myEntityManager.SaveChanges(null, so ); 
</pre>

<p>You are more likely to assemble a list of entities to save to that endpoint ... a list consistent with the semantics of &#39;MyCustomSave&#39; in which case you&#39;d probably pass that list in the &quot;saveChanges&quot; call:</p>

<pre class="brush:jscript;">
myEntityManager.SaveChanges(selectedEntities, so ); 
</pre>

<p>The Breeze client still sends a JSON change-set bundle to &#39;MyCustomSave&#39; as it would with a normal <span class="codeword">saveChanges </span> call. The POST method on the server that handles the &#39;MyCustomSave&#39; endpoint should have the same as signature as the &#39;SaveChanges&#39; method.</p>

<p>&nbsp;</p>
