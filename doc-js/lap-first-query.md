---
layout: doc-js
---
<h1>First query</h1>

<p>Many applications begin with a query for some existing data and that&#39;s how we&#39;ll begin. We&#39;re using the <a href="/samples/todo">Breeze Todo Sample App</a> to guide our lap around Breeze. We&#39;ll find the <strong>first query</strong> (and all other data service operations) in the <em>Scripts/services/<strong>dataservice.js</strong></em> folder.</p>

<p>The code snippets on this page are in the <a href="/samples/todo">Breeze Todo App</a>.</p>

<h2>Setup</h2>

<p><strong>Open</strong><em> Scripts/services/<strong>dataservice.js</strong></em>.</p>

<p>This Todo app works with the <a href="http://knockoutjs.com/" target="_blank">Knockout </a>model library and a <a href="http://www.asp.net/web-api" target="_blank">Web API</a> back-end service. You might prefer a different model library (e.g., &quot;backbone&quot;) or a different data service (e.g., &quot;OData&quot;) in which case you&#39;d make those preferences known first, at the top of this file (see the <a href="/samples/todo-angular" target="_top">Todo-Angular</a> version for an example). In Basic Breeze we&#39;re building with Knockout and the Web API; these are the Breeze defaults so we can proceed without further ado.</p>

<h2>Create an EntityManager</h2>

<p>A query can&rsquo;t execute itself. We&rsquo;ll need a Breeze <strong><em>EntityManager</em></strong>. The <em>EntityManager</em> is a gateway to the persistence service which will execute the query on the backend and return query results in its response. The next few lines give us an <em>EntityManager</em>:</p>

<pre class="brush:jscript;">
var serviceName = &#39;breeze/todos&#39;, // route to the Web Api controller
    manager = new breeze.EntityManager(serviceName);
</pre>

<p>The <em>serviceName </em>identifies the service end-point, the route to the Web API controller (&ldquo;breeze/todos&rdquo;) [<a href="#note 1">1</a>]; all <em>manager </em>operations will address that controller.</p>

<h2>Todos query</h2>

<p>We&rsquo;re ready to write the first query. The Todo app query method is called <em>getAllTodos </em>and it looks like this:</p>

<div>
<pre class="brush:jscript;">
function getAllTodos(includeArchived) {
    var query = breeze.EntityQuery // [1]
            .from(&quot;Todos&quot;)         // [2]
            .orderBy(&quot;CreatedAt&quot;); // [3]

    // ... snip ...

    return manager.executeQuery(query);
};</pre>
</div>

<ol>
	<li>creates a new Breeze <em>EntityQuery </em>object</li>
	<li>aims the query at a method on the Web API controller named &ldquo;<em>Todos</em>&rdquo; that returns <em>Todo</em> items.</li>
	<li>adds an <em>orderBy</em> clause that tells the remote service to sort results by the &ldquo;CreatedAt&rdquo; property <em>before</em> sending them to the client.</li>
</ol>

<div>
<p>The string, &ldquo;Todos&rdquo;, is case sensitive and must match the controller method name <em>exactly</em>.</p>
</div>

<h2>The manager makes a promise</h2>

<p>We execute the query with the EntityManager</p>

<div>
<pre class="brush:jscript;">
 return manager.executeQuery(query);</pre>
</div>

<p>The executeQuery method <strong>does not return Todos</strong>. It can&rsquo;t return Todos. A JavaScript client cannot freeze the browser and wait for the server to reply. The executeQuery method does its thing asynchronously.</p>

<p>It must return something and it must do so immediately. The thing it returns is a <strong>promise </strong>[<a href="#note 2">2</a>], a promise to report back when the service response arrives.</p>

<h2>Accepting a promise</h2>

<p>A caller of the <em>dataservice</em>&rsquo;s <strong><em>getAllTodos </em></strong>method typically attaches both a success and failure callback to the returned promise. Here&#39;s how the Todo app&#39;s <em><strong>ViewModel </strong></em>calls <em>getAllTodos</em>:</p>

<div>
<pre class="brush:jscript;">
 function getTodos() {
     dataservice.getAllTodos(includeArchived)
         .then(querySucceeded)
         .fail(queryFailed);
 }</pre>
</div>

<p>Notice the use of method chaining:</p>

<ol>
	<li>the <em>dataservice</em> returned a promise;</li>
	<li>the <em>ViewModel</em> called the promise&#39;s <em>then( &hellip; )</em> method for the success path</li>
	<li>the <em>ViewModel</em> called the promise&rsquo;s <em>fail( &hellip; )</em> method for the failure path.</li>
</ol>

<p>Both the <em>then() </em>and the <em>fail() </em>return a promise which means we can chain a sequence of asynchronous steps. Such syntax makes it easy to flatten what might otherwise be a nasty nest of dependent async calls. We don&rsquo;t have dependent async calls in this application&hellip; but a real application might&hellip; and you&rsquo;ll see plenty of examples among the <a href="/samples/doccode" target="_blank">teaching tests</a> [<a href="#note 3">3</a>].</p>

<h2>Process the query results</h2>

<p>If the query returns from the server without error, the promise calls the <em>ViewModel</em>&rsquo;s <em>querySucceeded </em>method, passing in a data packet from the <em>EntityManager</em>. What&rsquo;s in that packet?</p>

<p>The query results of course! Get them from the <strong><em>data.results</em></strong> property as the <em>ViewModel</em> does. In this example, each <em>Todo </em>item is pushed into a <a href="http://knockoutjs.com/documentation/observableArrays.html">Knockout observable array</a> bound to a list on the screen.</p>

<div>
<pre class="brush:jscript;">
function querySucceeded(data) {
    ...
    data.results.forEach(function (item) {
        ...
        shellVm.items.push(item);
    });
    ...
}</pre>
</div>

<p>And just like that, the screen fills with <em>Todos</em>.&nbsp; We&rsquo;ll discuss how <em>that</em> happens when we peek inside the entity <a href="/documentation/databinding-knockout">later in this tour</a>. Before we do, let&rsquo;s <strong><a href="/documentation/query-filter">try another query</a></strong>.</p>

<h2>Notes</h2>

<p><a name="note 1"></a>[1] Breeze appends the &ldquo;breeze/todos&rdquo; service name string to the &ldquo;site of origin&rdquo;, probably &ldquo;http://localhost:26843/&rdquo; if you&rsquo;re playing along at home. The <em>EntityManager </em>will send requests to &ldquo;http://localhost:26843/breeze/todos&rdquo;; the receiving Web API service routes the request to the TodosController on the server and then the server-side magic happens. You can <a href="/documentation/web-api-controller">read about this controller</a> later.</p>

<p><a name="note 2"></a>[2] Promises are a technique for managing sequences of asynchronous method calls.</p>

<p><a name="note 3"></a>[3] See the &ldquo;get by Id&rdquo; test in <em>basicTodoTest</em> test module.</p>
