---
layout: doc-js
---
<h1>
	A lap around Breeze</h1>
<p>This is a quick spin around Breeze. It sticks to the basics that a JavaScript client developer must know to work with Breeze. You won&rsquo;t learn everything but you will acquire a foundation in breeze sufficient to build a simple application. You&#39;ll know<br />
	&nbsp;</p>
<ul>
	<li>
		how to query the persistence service for entities<br />
		&nbsp;</li>
	<li>
		how to write a query filter on the client and sort the results on the data tier<br />
		&nbsp;</li>
	<li>
		to hold a <em>promise </em>from Breeze while you wait for the service to respond; the promise will tell you when the service is ready with results<br />
		&nbsp;</li>
	<li>
		the EntityManager maintains a local cache of entities that you&#39;ve queried, added to, modified, and marked for deletion<br />
		&nbsp;</li>
	<li>
		the EntityType describes the details of an entity class, how it&#39;s structured and how it behaves<br />
		&nbsp;</li>
	<li>
		how to use the EntityType to create new instances of entities<br />
		&nbsp;</li>
	<li>
		that a Breeze entity tracks changes, validates changes, and raises property changed events<br />
		&nbsp;</li>
	<li>
		how a Breeze entity can be bound to UI controls with Knockout (or another data binding library)<br />
		&nbsp;</li>
	<li>
		how to save changes permanently to remote storage or temporarily to local storage on the device.</li>
</ul>
<p>We&#39;ve organized the &quot;lap...&quot; as a tour of the Todo sample application. We&#39;ll detour occasionally into the automated teaching tests to clarify a point or find a more apt illustration.</p>
<p>You could just dive in. We think you&#39;ll get more from the tour if you take these three preliminary steps:</p>
<ol>
	<li>
		Review &quot;<a href="/documentation/start-nuget">Start with NuGet</a>&quot;.&nbsp; It takes about 10 minutes. You might follow along and build the sample.</li>
	<li>
		Try the <a href="/samples/todo">Todo sample application</a> and at least skim its documentation..</li>
	<li>
		Try the <a href="/samples/doccode">DocCode teaching tests</a>.</li>
</ol>
<p>We&rsquo;ll wait.</p>
<h2>
	Welcome back</h2>
<p>You&rsquo;ve downloaded the code and experienced the Todo sample as a user would. It&#39;s time to <a href="/documentation/first-query-0">write a query</a>.</p>
