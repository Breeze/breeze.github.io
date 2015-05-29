---
layout: doc-cool-breezes
redirect_from: "/old/documentation/.html"
---
<h1>
	Multiple EntityManagers</h1>
<p>Many applications need only one <em>EntityManager</em>. Some applications should have more than one <em>EntityManager.</em> This topic explains when multiple managers are advantageous and <a href="#CreateMultipleManagers">how to create multiple managers</a> when you need them.</p>
<h2>
	<a name="SingleManagerApp"></a>The single manager app</h2>
<p>Many applications will never need more than one EntityManager. All application views can share the same EntityManager and its cache of entities. See &quot;<a href="/documentation/share-entitymanager">Share an EntityManager</a>&quot; for guidance on a single manager approach.</p>
<h2>
	The federated app</h2>
<p>Your application may have several &quot;islands of functionality&quot; that operate semi-autonomously. Each island is its own domain with its own domain model and may even have its own remote service and database. Despite their functional independence, the islands &quot;cooperate&quot; under the umbrella of an apparently unified application. The user can hop from island to island via a top level structure such as a toolbar, accompanied by information that smoothes the transition. Seamless transitions are a sign of a successful federated application.</p>
<p>In this architecture, each &quot;island&quot; typically has its own <em>EntityManager </em>with its own cache of domain model entities. You could define a distinct <em>datacontext </em>for each island and <a href="/documentation/share-entitymanager">follow the single manager approach</a> for each <em>datacontext</em>.</p>
<h2>
	The &quot;Sandbox Editor&quot;</h2>
<p>The single manager is fine when every view - whether of the whole app or within an island - should see the same entities in exactly the same state.</p>
<p>Suppose the application displays an alphabetical list of customers in a <em>Customer List View</em>. There are many customers, most of them scrolled off screen.</p>
<p>The user clicks on &quot;Acme&quot; and is shown a <em>Customer Detail View</em>. The user changes the customer name from &quot;Acme&quot; to &quot;Worldwide Acme&quot;. She does not save ... not yet. Instead she switches back to the <em>Customer List View</em>. &quot;Acme&quot; no longer appears on screen. Where did it go? Panic!</p>
<p>The application has only one <em>EntityManager</em>. All views share the same customer instances. The changed customer name was instantly reflected in all views. The name now begins with &quot;W&quot; instead of &quot;A&quot; and has sorted to the bottom of the customer list ... off screen somewhere. Is that OK?</p>
<p>Some people don&#39;t think so. They want to isolate pending changes until they are saved. Well the same customer instance cannot be both &quot;Acme&quot; and &quot;Worldwide Acme&quot;. Breeze forbids two entities in the same cache with the same key.</p>
<p>The most reasonable alternative is to create two <em>EntityManagers</em>.</p>
<p>The <em>Customer List View</em> is always bound to entities in one manager, the main manager, that holds unmodified customer entities.</p>
<p>When the user selects &quot;Acme&quot;, the application creates a <em>Customer Detail View</em> associated with a second <em>EntityManager</em>. That second <em>EntityManager</em> is the &quot;sandbox&quot; manager. The application makes a copy of the &quot;Acme&quot; entity from the main manager (using the <em>exportEntities </em>method) and &quot;pastes&quot; it into the sandbox <em>EntityManager</em> (using the latter&#39;s <em>importEntities </em>method). Then the <em>Customer Detail View </em>binds to the copied &quot;Acme&quot; customer in the sandbox manager.</p>
<p>The two &quot;Acme&quot; customer instances in each manager have the same key but they are distinct instances in separate managers and their values may now diverge. When the customer in <em>Customer Detail View</em> becomes &quot;Worldwide Acme&quot;, the customer in the <em>Customer List View</em> remains &quot;Acme&quot;.</p>
<p>The customer in <em>Customer Detail View</em> has been &quot;sandboxed&quot;; we say that the <em>Customer Detail View</em> is a &quot;sandbox editor&quot;. Every change to the sandboxed entity stays in the sandbox editor.&nbsp; We can make all kinds of changes here without affecting the rest of the application. If we don&#39;t like them, we can cancel them and discard both the <em>Customer Detail View</em> and the sandbox&nbsp;<em>EntityManager</em>. If we like the changes, we&#39;ll save them.</p>
<p><a name="PropagateChanges"></a>It should not surprise you that after saving &quot;Worldwide Acme&quot;, the <em>Customer List View</em> still shows &quot;Acme&quot;. The main <em>EntityManager </em>doesn&#39;t know about the customer name change in the sandbox manager. It would learn about the name change if it re-queried the database. But that may not happen for a long time and the application shouldn&#39;t require a refresh from the database when the updated customer is available locally. Therefore, most applications will propagate the changed entity back to the original <em>EntityManager</em>, typically by sending a message within the application.<em> </em>The main manager might hear that message and import the updated customer from the sandboxed manager. The <em>Customer List View</em> can now display &quot;Worldwide Acme&quot;.</p>
<p>We&#39;ll show you how to create the second <em>EntityManager </em>after we consider one more scenario.</p>
<h2>
	<a name="MultiWorkflowApp"></a>The multi-workflow app</h2>
<p>In many apps - whole or island - there is a single workflow. The user reviews a list of Customers, picks one, reviews that Customer&#39;s orders, perhaps adds a new order or edits an existing order. The user moves linerarly through the domain, drilling in, stepping back out ... but always moving along one path at a time. A single <em>EntityManager </em>works well for such apps; some will prefer two managers: a master permanent manager and a second, transient manager for sandbox editing. That&#39;s all they&#39;ll need ... one or two managers.</p>
<p>But some businesses can&#39;t operate that way. The application user must be able to juggle several workflows at once, each moving at its own pace on an independent course. For example, the user may be building Customer Acme&#39;s new order for widgets when a call comes in for a high priority change to Customer Beta&#39;s order for gizmos. Acme&#39;s order-in-progress is not ready to be saved (it won&#39;t even pass validation). Fortunately the user can set Acme&#39;s order aside and switch to Customer Beta. Beta&#39;s gizmos order is revised and the user is about to save it when the supervisor interrupts with an urgent (immediate) demand to issue a refund to Customer Gamma for defective doodads shipped last week. It&#39;s that kind of day. The user issues Gamma&#39;s refund, then saves the updated to Beta&#39;s gizmos, and finally resumes building Acme&#39;s widget order.</p>
<p>We have multiple workflows in flight. The Beta and Gamma requests came out of nowhere and who knows how many more interruptions will delay the completion of Acme&#39;s order. A single <em>EntityManager </em>is probably not a good idea for this application. We had to save updates for the Beta and Gamma customers. But these two updates should be separate saves in separate transactions. If the app naively called <em>saveChanges()</em> on a single <em>EntityManager</em>, it would try to save Acme&#39;s, Beta&#39;s and Gamma&#39;s changes in a single transaction ... wrong ... which would fail anyway because Acme&#39;s order can&#39;t pass validation.</p>
<p>You could be clever and cherry-pick three separate baskets of entities (Acme&#39;s, Beta&#39;s, Gamma&#39;s) for three separate <em>saveChanges()</em> calls; in Breeze you can pass a list of entities to <em>saveChanges()</em>. We advise against this approach. The complexity of it always overwhelms the best intentions.</p>
<p>We recommend instead that you use a separate <em>EntityManager </em>instance for each mini-workflow.</p>
<h2>
	<a name="CreateMultipleManagers"></a>Creating multiple managers</h2>
<p>When you need multiple managers you generally want to create them the same way. Most of the time (but not always!) they should be configured to communicate with the same remote service and to rely on the same domain model definitions.</p>
<p>We think an <em>EntityManager factory </em>is a good way to achieve this goal. We favor creating a singleton application service called the &quot;<em><strong>EntityManagerProvider</strong></em>&quot;. This component offers a <em><strong>createManager </strong></em>method which the application calls whenever it needs a new <em>EntityManager </em>instance. Here is a &quot;simple&quot; example of this approach</p>
<pre class="brush:jscript;">
app.entityManagerProvider = (function (model) {

   // ... configure the application for Breeze ...
   var masterManager = new breeze.EntityManager(applicationServiceName);

   // configure the metadataStore with entity type extensions
   model.configureMetadata(masterManager.metadataStore);

   var entityManagerProvider {
       masterManager: masterManager, // you may prefer to hide this
       createManager: createManager,
       initialize: initialize,
       refresh: refresh,

       // ... specialized manager factories, imports, exports, events, ...
  }
  return entityManagerProvider;

  function createManager() {
      var manager = masterManager.createEmptyCopy(); // same configuration; no entities in cache.
      // ... copy in some entities (e.g.,picklists) from masterManager
      return manager;
  }

  function initialize() {
      // load the masterManager with lookup entities and any other startup data
      // incidentally loads the metadataStore with metadata from the service
      // return a promise
  }

  function refresh() {
      // refresh masterManager cached entities
      // typically a subset of the initialize function
  }
})(app.model);</pre>
<h3>
	Some observations</h3>
<p>We like to create a master <em>EntityManager</em><em>, </em>the <strong><em>masterManager</em></strong><em>, </em>as a template for minting the &quot;derived&quot; managers that we&#39;ll need throughout the user session. We create the <em>masterManager </em>with the route to the application&#39;s remote service (the &quot;<em>applicationServiceName</em>&quot;). Review the <a href="/sites/all/apidocs/classes/EntityManager.html" target="_blank">EntityManager API</a> for other configuration options.</p>
<p>Most applications at this level of sophistication also <a href="/documentation/extending-entities" target="_blank">extend the entity model</a> with special client-side properties and behavior. This sample code assumes you&#39;ve written a module dedicated to this purpose called <em>model</em> and it has a <em>configureMetadata </em>method. We&#39;re telling it to extend the <em>masterManager&#39;s</em> <a href="/sites/all/apidocs/classes/MetadataStore.html" target="_blank">MetadataStore</a> which will be shared by all of the<em> dervived EntityManagers</em>.</p>
<p>The <strong><em>createManager </em></strong>method returns a copy of the <em>masterManager </em>minus the entities. That copy may be all you need or want from the <em>masterManager</em>. But remember, each manager is its own microcosm. Entity navigation (e.g., <em>Order.Status, Order.Customer</em>, <em>Customer.Orders</em>) is possible only among entities within the same <em>EntityManager</em>. You won&#39;t be able to navigate from an <em>Order </em>in a derived manager back to a <em>Status </em>in the <em>masterManager</em>. Therefore, it&#39;s often convenient to populate the new manager with some of the picklist data from the <em>masterManager.</em></p>
<p>You&#39;ll know which supporting entities to copy based on the needs of the &quot;sandbox&quot; or subsidiary workflow.&nbsp; In time you may add custom &quot;<em>createManager</em>&quot; methods, tailored to suit the different types of sandboxes and workflows in your application.</p>
<p>The <strong><em>initialize </em></strong>function is optional but highly recommended. Most applications acquire some data from the server, such as picklist data for comboboxes, before they open up the UI to user input. The <em>masterManager </em>is a good place to hold this data. The application bootstrapper - the component that jumpstarts the application upon launch - is the likely caller of this <em>initiialize</em> function.</p>
<p>You may choose to keep the <em>masterManager </em>private, hiding it from all other application modules. We tend to expose the <em>masterManager</em> but treat it as a read-only repository of master data.&nbsp; We forbid direct changes to entities in its cache by other application modules. Master entity data may only be touched by</p>
<ul>
	<li>
		sanctioned queries (e.g., during initialization or refresh)</li>
	<li>
		updates propagated from derived managers (see <a href="#PropagateChanges">above</a>)</li>
</ul>
<p>This code sample is intended to inspire you. You may be able to use it &quot;as is&quot;. You&#39;ll probably have to add features we omitted for brevity such as the importing and exporting of entities.</p>
<h2>
	Multiple datacontexts</h2>
<p>We always recommend encapsulating an <em>EntityManager </em>within a <em>datacontext</em>. Every new sandbox and workflow should have its own <em>datacontext</em> instance. Each <em>datacontext</em> wraps its own private <em>EntityManager</em>.</p>
<p>You might define a <em>DataContextService </em>to manage the creation, coordination, and destruction of the many <em>DataContext </em>instances. That service might hold the only reference to the <em>entityManagerProvider</em>, calling upon it to create new managers for its new <em>DataContext </em>instances.</p>
<h2>
	Where are we?</h2>
<p>We&#39;ve got <em>sandboxes </em>and <em>mini-workflows</em>. We&#39;ve got a <em>DataContextService </em>using an <em>EntityManagerProvider </em>to create multiple <em>EntityManagers </em>to stuff inside the multiple <em>DataContexts </em>that provide isolated entity caches for these sandboxes and mini-workflows. After a save, a <em>datacontext </em>sends a message announcing which entities it saved. Other <em>datacontexts </em>hear the message and <em>import </em>the saved entities into their caches.</p>
<p>Can we make this any more complicated?</p>
<p>Seriously, <em><strong>you do not need this machinery on the first day</strong></em>. Or the second. You may not need it ever. We suggest that you re-read &quot;<a href="/documentation/share-entitymanager">Share an EntityManager</a>&quot;. Start there ... and stay there ... until the business requirements demand more sophistication. Then ... and only then .. should you introduce the advanced techniques described here.</p>
<p>These techniques are sound. They&#39;ve proven themselves in many applications over many years. They&#39;ll be waiting for you when you need them.</p>
<p>&nbsp;</p>
