---
layout: doc-js
---

<h1>Creating a new entity</h1>

<p>Breeze creates new entity instances on two primary occasions: (1) when it &quot;<strong>materializes</strong>&quot; entities from query results and (2) when you ask it to <strong>create </strong>a brand new entity.</p>

<p>Entity materialization is largely hidden from the developer. You issue a query; you get entities back. Behind the scenes Breeze converts the stream of model object data into entities in cache. The developer only becomes aware of entity creation details when making new model objects.</p>

<h2>Don&#39;t use &quot;new&quot;</h2>

<p>You might expect to make a model object by calling <em>new </em>on a constructor function:</p>

<pre class="brush:jscript;">
  var newCust = new Customer(); // rarely done in Breeze</pre>

<p>You can do it this way ... if you&#39;ve defined a <em>Customer </em>constructor and registered it with Breeze. But most Breeze developers don&#39;t define entity constructors or, if they do, they define only a subset of the entity&#39;s properties and methods (see the &quot;<a href="/documentation/extending-entities" target="_blank">Extending entities</a>&quot; topic).</p>

<p>It&#39;s preferable to let Breeze create the entity based on entity type information gleaned from <a href="/documentation/extending-entities" target="_blank">metadata acquired from the remote data service</a> ... in which case there is no constructor to &quot;<em>new up</em>&quot;.</p>

<h2>EntityManager.createEntity</h2>

<p>The standard approach is to call the Breeze <em><strong>createEntity </strong></em>factory function on an <em>EntityManager</em>:</p>

<pre class="brush:jscript;">
var newCust = manager.createEntity(&#39;Customer&#39;, {name:&#39;Acme&#39;});</pre>

<p>The first parameter is the name of the <span class="codeword">EntityType</span>; don&#39;t confuse the &quot;type name&quot; (&#39;Customer&#39;) with the similar &quot;resource name&quot; (&#39;Customers&#39;) that you use in a query.</p>

<p>In this example, we also passed in an optional property initializer hash that sets the new customer&#39;s name: <span class="codeword">{name: &#39;Acme&#39;}</span>.</p>

<p>You may not need an initializer. But If the entity key is <strong><em>client </em></strong>generated, then you <strong>must </strong>specify the key in the initializer ... or you&#39;ll likely get an exception.</p>

<pre class="brush:jscript;">
// The Northwind OrderDetail has a composite key consisting of 
// its parent order and product ids.
var newOrderDetail = 
    manager.createEntity(&#39;OrderDetail&#39;, {orderId: oid, productId: pid});</pre>

<p>The <span class="codeword">createEntity</span> method adds the entity to the manager because that&#39;s what you usually want to do with a newly created entity. Alternatively, you can provide the optional third parameter specifying the <span class="codeword">EntityState</span> to keep the entity detached or maybe attach it in some other state.</p>

<pre class="brush:jscript;">
var EntityState = breeze.EntityState;

// unattached new customer
// you can keep configuring it and add/attach it later
var newCust = manager.createEntity(&#39;Customer&#39;, {name:&#39;Beta&#39;}, EntityState.Detached);

// attached customer, as if retrieved from the database
// note that the id must be specified when attaching an &#39;existing&#39; entity
var oldCust = manager.createEntity(&#39;Customer&#39;, {id: 42, name:&#39;Gamma&#39;}, EntityState.Unchanged);</pre>

<h2>EntityType.createEntity</h2>

<p>The <span class="codeword">createEntity</span> method of the <em>EntityManager</em> is shorthand for something like:</p>

<pre class="brush:jscript;">
var metadataStore = manager.metadataStore; // model metadata known to this EntityManager instance
var customerType = metadataStore.getEntityType(&#39;Customer&#39;); // metadata about the Customer type 
var newCust = customerType.createEntity({name:&#39;Acme&#39;}); // call the factory function for the Customer type
manager.addEntity(newCust); // attach the entity as a new entity; it&#39;s EntityState is &quot;Added&quot;
</pre>

<p>Why would you ever want to write <strong>that</strong>? Perhaps you are creating hundreds of new customer entities all at once. With the longhand version, you can avoid the cost of finding the <span class="codeword">customerType</span> for each new customer.</p>

<p>Four important facts about this approach:</p>

<ol>
	<li>Breeze creates the data properties and entity navigation properties based on metadata.</li>
	<li>Breeze defines these properties in the manner appropriate for the model library you choose</li>
	<li>The new object is &quot;wired up&quot; as a Breeze entity</li>
	<li>The new object is &quot;detached&quot; and does not belong to any <em>EntityManager </em>cache until you attach it explicitly</li>
</ol>

<p>The first fact means you don&#39;t have to worry about keeping your client-side <em>Customer </em>definition aligned with the server-side <em>Customer </em>definition if you&#39;re getting your metadata from the server. Change the server-side definition and the client-side definition updates automatically.</p>

<p>The second fact means that <em>newCust </em>is shaped to match your model preference. If you configured Breeze for Knockout, <em>newCust </em>has a <em>CompanyName()</em> observable function for getting and setting the name. If you configured Breeze for backbone, <em>newCust </em>understands <em>get(&quot;CompanyName&quot;)</em> and <em>set(&quot;CompanyName&quot;)</em> and the <em>newCust </em>is observable in the backbone manner.</p>

<p>The third fact means <em>newCust </em>has embedded Breeze capabilities you can tap via the <em>newCust.entityAspect</em> property. We&#39;ll talk about <a href="/documentation/inside-entity"><strong><em>entityAspect </em></strong>in the next topic</a>.</p>

<p>The fourth fact means some of <em>newCust</em>&#39;s Breeze capabilities are temporarily disabled until you attach it to the manager. For example, if we stopped at line #3, the <em>newCust</em> couldn&#39;t navigate to related entities in cache because it&#39;s not in a cache. Only after the fourth line ...</p>

<pre class="brush:jscript;">
manager.addEntity(newCust);</pre>

<p>... is the <em>newCust </em>ready to behave both as a <em>Customer </em>and as an <em>entity</em>.</p>
