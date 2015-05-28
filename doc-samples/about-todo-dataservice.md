---
layout: doc-samples
redirect_from: "/old/samples/todo-dataservice.html"
---
<h1>Todo Sample Dataservice</h1>

<p>In all <a href="/doc-samples/about-todo">Todo samples</a>, <em>Dataservice.js</em> handles the creation of new Todo objects and all interactions with <a href="/doc-samples/about-todo-server">the server</a>. It&#39;s written in Breeze and almost all Breeze-related code is in this dataservice.</p>

<p>The dataservice only has five public methods:</p>

<table style="margin-left:1em;max-width=200px">
	<thead style="vertical-align:top; ">
		<tr>
			<th style="width: 7em; text-align:left">Method</th>
			<th>Purpose</th>
		</tr>
	</thead>
	<tbody>
		<tr style="vertical-align:top;">
			<td>getAllTodos</td>
			<td style="padding-bottom:10px;">Query for Todos, either all Todos or just the active (non-archived) Todos.</td>
		</tr>
		<tr style="vertical-align:top;">
			<td>createTodo</td>
			<td style="padding-bottom:10px;">Create a new Todo and add it to the manager.</td>
		</tr>
		<tr style="vertical-align:top;">
			<td>saveChanges</td>
			<td style="padding-bottom:10px;">Save the Todos in cache with pending changes (the Todos to be added, modified, and deleted).</td>
		</tr>
		<tr style="vertical-align:top;">
			<td>purge</td>
			<td style="padding-bottom:10px;">Delete all Todos in the database and clear the cache; purely for the demo.</td>
		</tr>
		<tr style="vertical-align:top;">
			<td>reset</td>
			<td style="padding-bottom:10px;">Reset the database to its initial set of Todos and clear the cache; purely for the demo.</td>
		</tr>
	</tbody>
</table>

<p>These are the five methods called by the application <a href="/doc-samples/about-todo-viewmodel">ViewModel</a> (or Controller) that manages the screen. We&#39;ll drill a little deeper into them in a moment after we&#39;ve covered the setup code at the top of the file.</p>

<h2>Setup</h2>

<p>A Breeze application can be configured to work with a variety of remote services, to use a custom Ajax helper, and to create entities shaped to support a variety of model binding libraries such as <a href="http://knockoutjs.com/" target="_blank">Knockout</a>, <a href="http://backbonejs.org/" target="_blank">Backbone</a>, and <a href="http://angularjs.org/" target="_blank">Angular</a>.</p>

<p>Out of the box, Breeze is ready to talk to an ASP.NET Web API service, using <a href="http://api.jquery.com/jQuery.ajax/" target="_blank">jQuery&#39;s Ajax</a> component, and it will create entities for us with Knockout which means that the entity properties will be Knockout observables.</p>

<p>The most basic Todo sample uses all three defaults; its dataservice needs no special configuration.</p>

<p>The Todo-Angular sample differs only it its choice of model library (AngularJS) so it needs one extra line of configuration:</p>

<pre>
breeze.config.initializeAdapterInstance(&quot;modelLibrary&quot;, &quot;backingStore&quot;, true);</pre>

<p>The &quot;backingStore&quot; library is Breeze&#39;s native model library which happens to be well suited to support Angular applications.</p>

<h2>EntityManager</h2>

<p>Every Breeze application needs an instance of the Breeze EntityManager class to access the remote service and to manage entities in cache. Here we create one called <strong><em>manager</em></strong> targeting the Todo Web API service whose endpoint is &quot;api/todos&quot;.</p>

<p>More precisely, &quot;api/todos&quot; is the portion of the URL that designates the Todo Web API controller running on the same server that hosted this dataservice JavaScript.</p>

<p>You&#39;ll see an alternative endpoint that is commented out:</p>

<pre>
// Cross origin service example
//var serviceName = &#39;http://todo.breezejs.com/api/todos&#39;;
</pre>

<p>That&#39;s the endpoint of a compatible service run by IdeaBlade on its own servers. Leave that be for now; it comes into play in a demonstration of cross-origin resource sharing (CORS).</p>

<p class="note">UPDATE 10 December 2013: This sample uses a primitive CORS implementation that we no longer recommend if you have upgraded to Web API2. Please read this excellent article <a href="http://msdn.microsoft.com/en-us/magazine/dn532203.aspx" target="_blank">&quot;CORS Support in ASP.NET Web API 2&quot;</a> which explains basic CORS and how to engage Web API2 CORS support.</p>

<h2>Dataservice methods</h2>

<p>We&#39;ll examine the five public methods in a bit more detail.</p>

<h3>getAllTodos</h3>

<p>The ViewModel acquires a fresh set of Todos from the database by calling the <em>getAllTodos</em> method. It creates a Breeze query object targeting the Web API controller&#39;s &quot;Todos&quot; action method. The query is embellished with an <em>orderBy</em> clause that sorts the Todos by creation date. Note that the sort takes place on the database, not on the client.</p>

<p>The caller passes in a boolean indicating if the query results should include archived Todos. Usually you don&#39;t want the archived Todos so the value is false. The Todo application binds this value to the &quot;Show archived&quot; checkbox which is unchecked (false).</p>

<p>If <em>includeArchived</em> is false, the <em>getAllTodos</em> method modifies the query object with a &quot;<em>where</em>&quot; clause that filters the Todos - on the database, not the client - so that only active Todos (those whose <em>IsArchived</em> flag is false) will be retrieved.</p>

<p>Finally, the manager executes the query asynchronously and immediately returns a <strong>promise</strong>. It&#39;s a promise to deliver either the query results or an error when the server eventually replies.</p>

<p>See how the ViewModel (or Controller) which calls this method handles that promise.</p>

<h3>createTodo</h3>

<p>This Todo client can create new instances of JavaScript Todo objects based on information gleaned from metadata describing the Todo model.</p>

<p>The manager quietly retrieved the metadata from the Web API controller just before performing its first query. The manager holds that metadata in its <em>MetadataStore</em>.</p>

<p>The <em>createTodo</em> method relies on the manager&#39;s <em>createEntity </em>method to</p>

<ul>
	<li>instantiate a new <em>TodoItem</em></li>
	<li>extend it with properties defined in metadata</li>
	<li>set some of those data with initial values (if provided),</li>
	<li>add the new <em>TodoItem </em>to the manager.</li>
</ul>

<p>The new <em>TodoItem </em>instance is shaped to suit the application&#39;s model library. If this is a Knockout application, the properties of the Todo are Knockout observables. If it&#39;s an Angular application, it has ECMAScript 5 properties with getters and setters.</p>

<p>The Todo also has a Breeze <em>EntityAspect</em>. This is a doorway to important features of every Breeze entity. The ViewModel calls upon two of these features: the <em>propertyChanged</em> event and the <em>setDeleted</em> method. The <em>propertyChanged</em> event is raised when a data property changes; the ViewModel listens to that event to learn when it should save those changes. If the user clicks the &quot;X&quot; next to the Todo description, the ViewModel will calls the <em>setDeleted</em> method to put the Todo in a &quot;Deleted&quot; state and then saves this change; on the server, entities marked for delete are removed from the database.</p>

<p>You&#39;ll find a few more specifics of this sample&#39;s implementation in the &quot;<a href="/doc-js/lap-add-entity" target="_blank">Add a new entity</a>&quot; step of the Basic Breeze walk through.</p>

<h3>saveChanges</h3>

<p>After user input, the ViewModel could call the dataservice <em>saveChanges</em> method. If there is nothing to save, the method bypasses the manager and logs a &quot;Nothing to save&quot; message (unless told to skip that step).</p>

<p>Usually the manager&#39;s cache holds some kind of change: a new Todo, one or more modified Todos, or a Todo marked for deletion. Ultimately this method will call the EntityManager&#39;s <em>saveChanges</em> method.</p>

<p>But there is a wrinkle. Saving changes is an asynchronous operation. It takes time to complete. While waiting for the server to respond, the use could make another change and call the dataservice&#39;s <em>saveChanges</em> method again.</p>

<p>That could be a problem, especially if the previous save involved a new Todo. Until the first save completes, that new Todo is still sitting in cache. If we allowed the manager to save these changes again, it would save the new Todo a second time. We&#39;d have duplicate Todo items in our database.</p>

<p>Breeze typically guards against this by throwing an exception if you call <em>saveChanges</em> while it is waiting for a response to an earlier save. If you overide that guard (as you can), you expose the application to the risk of a duplicate Todo.</p>

<p>This method tries an alternative gambit. It remembers if a save is in progress (the <em>_isSaving</em> flag). If a second save comes in before the first completes, it postpones that second save for 50 milliseconds (using <em>setTimeout</em>). The postponed saves won&#39;t be processed until there are no saves waiting a server response.</p>

<p>Note that the dataservice <em>saveChanges</em> method does not return a promise to the calling ViewModel. From the ViewModel&#39;s perspective, <em>saveChanges</em> is &quot;call-and-forget&quot;.</p>

<p>Internally the service does wait for the promise.If the save succeeded, it logs the happy news. If the save failed, there&#39;s some tricky processing. Whether the save succeeds or fails, the <em>_isSaving</em> flag is reset so the next save request can be processed.</p>

<h3>saveFailed</h3>

<p>This private method analyzes the save failures. If the save failed validation it calls handleSaveValidationError which composes and displays an error message. The user can fix the problem (e.g., a description that is too long) and re-save.</p>

<p>If the server returned a concurrency exception, there&#39;s a good chance that some other user deleted the Todo or perhaps reset the database. A more sophisticated application would do something more clever. This sample simply rejects all the pending changes (<em>manager.rejectChanges</em>) and leaves it up to the user to decide what to do next.</p>

<p>The application is unable to cope with any other form of error. Maybe the server is down or the network is down. Who knows. It throws up its hands and suggests that the user reboot.</p>

<h3>purge and reset</h3>

<p>These are demo support methods. You wouldn&#39;t purge or reset your database in a real application.</p>

<p>They are interesting in one respect: they use jQuery AJAX to post directly to the corresponding Web API controller methods; they aren&#39;t using Breeze for this communication.</p>

<h2>Why a dedicated dataservice?</h2>

<p>Of course you could merge this data access component into the <a href="/doc-samples/about-todo-viewmodel">ViewModel</a> (or Controller) that binds to the HTML widgets on screen. The ViewModel could create a Breeze <em>EntityManager</em> and call its <em>executeQuery</em> and <em>saveChanges</em> methods directly.</p>

<p>But we highly recommend keeping the data access and the Breeze particulars in a separate module of its own. ViewModels are much easier to maintain when they have less to do. In a multi-screen app, several ViewModels will surely share a common dataservice and its cache of entities.</p>

<p><a href="/doc-samples/about-todo">Back to the main Todo Sample page</a></p>
