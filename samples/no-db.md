---
layout: samples
redirect_from: "/old/samples/nodb.html"
---
<h1>&quot;NoDb&quot; - Breeze without a database</h1>

<p>The NoDb sample demonstrates a BreezeJS client working with an ASP.NET Web API service backed by an in-memory &quot;database&quot;. <strong>No Entity Framework, No SQL Server</strong>.</p>
<p>BreezeJS is a pure JavaScript library. If your dataservice talks JSON over HTTP, it can work with BreezeJS.</p>
<p>You&rsquo;ll find &ldquo;NoDb&rdquo; among the samples in the <a href="/documentation/download">full download</a>.</p>
<p>Most Breeze samples take the easy path on the server with ASP.NET Web API, Breeze.NET helpers, and Entity Framework and SQL Server. You write significantly less code that way and your client benefits from the metadata generated on the server.</p>
<p>This sample does away with EntityFramework and has no database at all. The data reside in memory for the lifetime of the server. The service does not generate metadata about the model. The BreezeJS client gets its metadata from a MetadataStore constructed by hand in JavaScript. Aside from this wrinkle, the NoDb client application is almost identical to a hypothetical version that talked to a more typical Breeze server backed by EF and SQL server.</p>
<p>If you can&#39;t use Entity Framework or you need to work with a non-relational data store, this NoDb sample is for you.</p>
<h2>
	Running the app</h2>
<p>The NoDb sample is based on the <a href="http://www.asp.net/single-page-application">ASP MVC SPA Template application</a>. It presents one or more &quot;<strong>Todo Lists</strong>&quot;, each with &quot;<strong>Todo Items</strong>&quot;. Here&#39;s a snapshot of the app when it is first launched, pre-filled with sample Todo data.</p>
<p><img alt="" height="286" src="/images/samples/NoDbRunning-01.png" width="336" /></p>
<p>The Todo <strong>list</strong> title at the top is editable; click in it to change it. The &quot;x&quot; symbol in the upper right deletes the Todo list and all of its items.</p>
<p>Each Todo <strong>item</strong> is editable. The checkbox marks the item as &quot;done&quot;. Click in the text to edit the title. The &quot;x&quot; to the right of the title deletes the item.</p>
<p>Create a new item by entering title text at the bottom of the list where it says &quot;<em>Type here to add</em>&quot;.</p>
<p>The app saves after every change. It saves when you add a new Todo list or item, check a box, or click an &quot;x&#39; symbol to delete.</p>
<p>There is some validation (we&#39;ll talk about that). If you create a validation error by typing an item title that is too long, you&#39;ll see an error message like this.</p>
<p><img alt="" src="/images/samples/NoDb-ItemTitleTooLong.png" style="width: 331px; height: 166px;" /></p>
<p>The errant value stays on screen for a second and then reverts.</p>
<h2>
	Inside NoDb</h2>
<p>Now we&#39;ll take a tour of the NoDb code. We will focus almost exclusively on what makes this application different from a Breeze app that uses Entity Framework (EF), a database, and the Breeze.NET helper components.</p>
<p>Review the other samples and the documentation to learn about mainstream Breeze features such as query and save. We&#39;ll begin with the server.</p>
<h2>
	Server</h2>
<p>If you&#39;re familiar with the <a href="http://www.asp.net/single-page-application">ASP MVC SPA Template application</a>, you&#39;ll notice some things are missing.</p>
<ul>
	<li>
		<p><strong>No Entity Framework</strong>. Although the Breeze NuGet package installs EF, we deleted the reference to it from the project.</p>
	</li>
	<li>
		<p><strong>No database</strong>. Open the &quot;<em>Web.config</em>&quot;. No connection strings, no providers. Nada. The &quot;database&quot; is simulated by an in-memory data structure defined in the <em>Models/<strong>TodoContext</strong></em> class.</p>
	</li>
	<li>
		<p><strong>No authentication</strong>. Authentication is essential in a real application; it&#39;s a distraction from our present purpose. We removed the user registration, login, and authentication enforcement. The server no longer filters Todo Lists by user; the <span class="codeword">TodoList</span> class no longer has a <span class="codeword">UserId</span> property.</p>
	</li>
	<li>
		<p><strong>No MVC</strong>. This sample was built from the ASP.NET Empty Web Application template. We have nothing against MVC. We just don&#39;t need it for a pure SPA application because we&#39;re only serving a single, simple page.</p>
	</li>
	<li>
		<p><strong>No Razor engine and no Bundling</strong>. These are cool capabilities. But we&#39;re trying to get closer to the metal in this sample. So we server &quot;index.<strong>html</strong>&quot;, not &quot;index.<strong>cshtml</strong>&quot;. CSS and JavaScript files are loaded with script tags rather than ASP.NET bundles. Feel free to restore Razor and bundling ... which you can do without restoring MVC.</p>
	</li>
</ul>
<h3>
	Server stack</h3>
<p>The sample author wrote five classes in support of TodoNoDb clients.</p>
<p><img alt="" src="/images/samples/NoDbServerStack.png" /></p>
<p>Front to back they are.</p>
<table style="border:none; max-width:50em;">
	<tbody>
		<tr>
			<td style="vertical-align:top; width:10em;">
				<strong>TodoController</strong></td>
			<td style="vertical-align:top;">
				ASP.NET Web API controller handling client requests</td>
		</tr>
		<tr>
			<td style="vertical-align:top;">
				<strong>TodoRepository</strong></td>
			<td style="vertical-align:top;">
				Helper mediating between the controller and the data access layer</td>
		</tr>
		<tr>
			<td style="vertical-align:top;">
				<strong>TodoContext</strong></td>
			<td style="vertical-align:top;">
				TodoContext is the data access and in-memory database combined. It inherits from the Breeze.NET <span class="codeword">ContextProvider</span> which helps with parsing request data and preparing response data for BreezeJS clients.</td>
		</tr>
		<tr>
			<td style="vertical-align:top;">
				<strong>TodoList</strong></td>
			<td style="vertical-align:top;">
				The root entity representing a collection of <span class="codeword">TodoItems</span></td>
		</tr>
		<tr>
			<td style="vertical-align:top;">
				<strong>TodoItem</strong></td>
			<td style="vertical-align:top;">
				Something to do.</td>
		</tr>
	</tbody>
</table>
<p>Let&#39;s learn a bit more about each class.</p>
<p class="note">Please keep in mind at all times that this is a sample employing an in-memory data structure <em>in lieu</em> of a database. The code is not production quality. It takes advantage of Breeze.NET classes such as EntityInfo and the saved change-set paradigm. It is intended to be suggestive. Nothing about BreezeJS prevents you from taking a completely different approach with no dependence on Breeze.NET components.</p>
<h3>
	TodoController</h3>
<p>Client requests arrive and depart through the <strong><span class="codeword">TodoController</span></strong>, a simple ASP.NET Web API controller.</p>
<p>The class is adorned with the <a href="/documentation/web-api-controller/#BreezeControllerAttribute"><span class="codeword">BreezeController</span></a> attribute which conveniently purges all formatters, adds a JSON formatter configured for Breeze clients, and adds&nbsp; Breeze.NET <em>IQueryable</em> support. The NoDb app doesn&#39;t issue queries - it just retrieves all TodoLists in a single request - but it could and you can experiment with OData query URLs in a tool like <a href="http://www.fiddler2.com/fiddler2/" target="_blank">Fiddler</a>.</p>
<p><span class="codeword">TodoController</span> is similar to other Breeze controllers in that it responds to actions specified in the request URL. But it only offers two actions: (1) <span class="codeword">TodoLists</span> which returns an <span class="codeword">IQueryable</span> of the only type the client asks about and (1) <span class="codeword">SaveChanges</span> which receives a standard BreezeJS JSON change-set bundle and forwards them to an instance of the <span class="codeword">TodoRepository</span>. Clearly missing is the <em>Metadata </em>action typical of other Breeze controllers. This service does not generate metadata for the client and respond with a &quot;404 Not Found&quot; if asked for metadata.</p>
<p>The simplicity of this controller is in keeping with recommendations for Web API controllers in general and Breeze controllers in particular: it dispatches all serious work to helper classes such as the <span class="codeword">TodoRepository</span>.</p>
<h3>
	TodoRepository</h3>
<p style="font-size:0.8em; font-style:italic;">Note: this class was called TodoContextProvider in earlier releases of the NoDb sample.</p>
<p>The <span class="codeword">TodoRepository</span> mediates between the controller and the data access layer, simplifying interactions with that layer by following a routine common to many other apps.</p>
<p>This repository deliberately parallels the <span class="codeword">ContextProviders</span> you&#39;ll find in our other samples. Unlike them, it does <em><strong>not </strong></em>inherit from <span class="codeword">EFContextProvider</span> and it knows nothing about Entity Framework. It inherits instead from the Breeze.NET <span class="codeword">ContextProvider</span>, an abstract base class that offers a basic harness and pipeline for processing BreezeJS client requests.</p>
<p>This repository has three responsibilities:</p>
<ol>
	<li style="margin-bottom: 4px;">
		Surface query methods to the Controller,</li>
	<li style="margin-bottom: 4px;">
		Generate JSON metadata for the client,</li>
	<li>
		Save a change-set of data from the client.</li>
</ol>
<p>The first two are trivial. The <span class="codeword">TodoLists</span> query - the only query - presents the entire, in-memory <em>TodoList</em> collection as an <span class="codeword">IQueryable</span>; the controller exposes that queryable as an HTTP GET action. This service doesn&#39;t generate metadata. The abstract base class demands an implementation; we give one that returns null.</p>
<p>We don&#39;t need a base class to accomplish so little. But the more complex save cycle justifies our implementation choice.</p>
<p>The NoDb client app saves one or more entities in the customary BreezeJS manner: by calling <span class="codeword">EntityManager.saveChanges</span>. Breeze bundles the pending changes into a JSON data structure (called a &quot;change-set&quot;) and POSTs that structure to the controller.</p>
<p>The controller receives it as a JSON.NET <span class="codeword">JObject</span> which we <em>could</em> parse and process ourselves. Instead, we assign that chore to the Breeze.NET <span class="codeword">ContextProvider</span>.</p>
<p>The provider transforms the change-set into a dictionary of <span class="codeword">EntityInfos</span>, keyed by entity type. Each dictionary entry is a list of <span class="codeword">EntityInfos</span>. An <span class="codeword">EntityInfo </span>is a Breeze.NET type describing one entity to save. Here&#39;s its public API:</p>
<pre class="brush:csharp;">
public class EntityInfo {
  public object Entity { get; internal set; }
  public EntityState EntityState { get; internal set; }
  public Dictionary&lt;string, object&gt; OriginalValuesMap { get; internal set; }
}
</pre>
<p>The <span class="codeword">Entity</span> is the object to save (e.g., a <span class="codeword">TodoList</span>) with all properties set to their current and proposed values.</p>
<p>The <span class="codeword">EntityState</span> is an enum indicating the save operation to perform: insert (&quot;Added&quot;), update (&quot;Modified&quot;), or delete (&quot;Deleted&quot;).</p>
<p>The <span class="codeword">OriginalValuesMap</span> contains property-name/original-value pairs for each of the properties that have changed; only &quot;Modified&quot; entities have mapped values.</p>
<p class="note"><strong>Caution</strong>: remember that this map comes from&nbsp; the client which can never be fully trusted. Use the map for guidance. Ignore it and re-fetch the original from the database for comparison with the proposed values if this entity type carries any sensitive information.</p>
<p><a href="/documentation/custom-efcontextprovider/#SaveInterception">Pre-save validation</a> is the next step in the save process. This provider overrides the <span class="codeword">BeforeSaveEntity</span> method where it confirms that every <span class="codeword">TodoItem</span> has a parent <span class="codeword">TodoList</span>. This single check suffices for now; there are other validations performed downstream.</p>
<p>Next comes the save itself. The base <span class="codeword">ContextProvider</span> knows when to save but not how to save so we override the abstract <span class="codeword">SaveChangesCore</span> and delegate to the <a href="#TodoContextSaveChanges"><span class="codeword">TodoContext.SaveChanges</span></a> method. That method should save the entities, update their values, and return a key map of temporary-to-permanent keys. The base provider repackages that key map and the updated entity map into a <span class="codeword">SaveResult</span>. We return the <span class="codeword">SaveResult</span> to the calling controller which bakes it into the HTTP response. The save process is complete. Failures along the way (e.g., a failed validation) should be thrown as exceptions for the controller (or the Web API) to catch and forward to the client.</p>
<p class="note">It bears repeating that the reliance of this <span class="codeword">TodoRepository</span> on the Breeze <span class="codeword">ContextProvider</span> is a matter of convenience. We could have replaced all Breeze.NET components with custom code. In our judgment doing so would only cloud with complexity what should be a simple point: a Breeze client can work with a server that does not use Entity Framework and does not suppy metadata.</p>
<h3>
	TodoContext</h3>
<p>The <span class="codeword">TodoContext</span> class defines the in-memory data structure that serves as the &quot;database&quot; for this sample. That data structure is simply a dictionary of <span class="codeword">TodoList</span> objects.</p>
<p><span class="codeword">TodoContext</span> is a <a href="http://en.wikipedia.org/wiki/Singleton_pattern">Singleton</a> whose <span class="codeword">Instance</span> property returns a &quot;data access&quot; object that both contains and manipulates that dictionary. Its API is thread safe, thanks to locking code in the implementation.</p>
<p>The API is two methods: (1) a <span class="codeword">TodoLists</span> readonly property that returns the <em>TodoLists</em> dictionary and (b) a <span class="codeword">SaveChanges</span> method for updating that dictionary. Only <span class="codeword">SaveChanges</span> merits further comment.</p>
<p><span class="codeword"><a name="TodoContextSaveChanges"></a>SaveChanges</span> receives a dictionary of <span class="codeword">EntityInfos</span>, keyed by entity type. There could be at most two entries in this particular dictionary because NoDb has only the <em>TodoList</em> and <em>TodoItem</em> types.</p>
<p>As detailed above, an <span class="codeword">EntityInfo</span> holds both an instance of an entity type and the name of the operation to perform. That seems sufficient to update the in-memory <em>TodoList </em>dictionary, but first we take two other preparatory steps: (1) key generation and (2) validation.</p>
<h4>
	Key generation</h4>
<p>If we&#39;re adding a new entity and its key is store generated, its current key is a temporary negative integer that was set by the client. A real database would give us a permanent key when we inserted the entity data. This being a fake database, we generate the postitive intenger, permanent key with the <span class="codeword">IdGenerator</span> class defined at the bottom of the file.&nbsp;We replace the key in this entity and also update every other entity in the change-set which had the temporary key value in its foreign key property. The <span class="codeword">AddTodoItem</span> method illustrates both procedures. We prepare a list of <span class="codeword">KeyMappings</span> that correlate the temporary keys with their replacement permanant keys. We&#39;ll send this back to the client where BreezeJS will perform similar substitutions (AKA, &quot;id fix-up&quot;).</p>
<h4>
	Validation</h4>
<p>We shouldn&#39;t assume that the client sent us valid data. The add and update methods call each entity&#39;s <span class="codeword">Validate</span> function; a more sophisticated application might validate the delete operation as well.</p>
<p>If the validate method returns an empty string, the entity passed validation and we can continue. If not, the string contains one or more validation error messages which become a <span class="codeword">larger ValidationError</span> exception&nbsp; message. This exception is then thrown and the upstream calling components pass the exception back to the client. You can see this in action by entering a <em>TodoList </em>title greater than 20 characters. The 20 character limit is enforced on the server,&nbsp; not the client, so a bad <em>TodoList </em>title update will be communicated to the server and trigger this exception. The following screen shot shows the consequences; notice that the server exception message is phrased differently than the client-side validation error shown above.</p>
<p><img alt="" height="242" src="/images/samples/NoDb-TodoListTitleTooLong.png" width="233" /></p>
<p>The rest of the <em>TodoContext </em>class is mundane implementation which you can read at your leisure.</p>
<h3>
	TodoItem and TodoList entity classes</h3>
<p>NoDb is a two entity model application. Both entities are defined as POCO (&quot;Plain old C# classes&quot;) in the <em>Models</em> folder.</p>
<p>Each has a few auto-properties followed by a <span class="codeword">Validate</span> method to ensure data integrity. Notice the lack of <span class="codeword">System.ComponentModel.DataAnnotations</span>; there is no Entity Framework to interpret the attributes and apply the corresponding validation rules. We&#39;ll do that ourselves, by hand, with these <span class="codeword">Validate</span> methods.</p>
<p>Each has a &quot;navigation property&quot; to access the other. <span class="codeword">TodoList.Todos</span> returns a Todo list&#39;s child items; <span class="codeword">TodoItem.Todo</span> returns the item&#39;s parent Todo list. Note that the <span class="codeword">TodoItem</span> has a foreign key, <span class="codeword">TodoListId</span>. That&#39;s how the association is implemented in this particular sample; it&#39;s not a Breeze requirement <em>per se</em> although Breeze life is a big more complicated and less fun without them FKs.</p>
<p><span class="codeword">TodoList</span> is a self-contained object graph. It actually contains its own Todo items, something you might expect from a NoSQL data store but not from a relational database.</p>
<p>The <span class="codeword">TodoList</span> class also sports methods for adding, updating, and replacing its nested Todo items.</p>
<p>That&#39;s all we have to say about the server. What are the implications for the client.</p>
<h2>
	The Client</h2>
<p>The NoDb client looks like a typical Breeze client. We&#39;d see no outward signs of difference were we to switch to a more conventional Breeze server backed by Entity Framework and SQL Server. The <em>View</em> and <em>ViewModel</em> would be identical. The <em>DataContext</em> would be identical ... save for four lines of configuration.</p>
<h3>
	<strong>datacontext.js</strong></h3>
<p>The NoDb server doesn&#39;t supply entity metadata to the client. The client is on its own in that department.</p>
<p>The first essential step is to prevent the client from asking for metadata. We can&#39;t simply create an <span class="codeword">EntityManager</span> and start querying with it as we usually do:</p>
<pre class="brush:jscript;">
var manager = new breeze.EntityManager(&quot;api/todos&quot;); // Uh oh ... trouble ahead!
var query = EntityQuery.for(&quot;TodoList&quot;);

// first query implicitly asks for metadata
manager.executeQuery(query)
       .then(querySucceeded)
       .fail(queryFailed); // 404 - Resource not found</pre>
<p>It&#39;s going to bomb with a 404 on the first query. Instead, we prepare a BreezeJS <span class="codeword">DataService</span> object whose <span class="codeword">hasServerMetadata</span> flag is set false. Then we create a new <span class="codeword">EntityManager</span> with this configuration and we are good to go:</p>
<pre class="brush:jscript;">
var dataService = new breeze.DataService({
    serviceName: &quot;api/Todo&quot;,
    hasServerMetadata: false // don&#39;t ask the server for metadata
});

var manager = new breeze.EntityManager({ dataService: dataService });

// ... proceed with queries and saves</pre>
<p>Of course Breeze can&#39;t do its job without the metadata that describe the model entities and their relationships. This metadata we must build by hand.</p>
<h3>
	<strong>model.js</strong></h3>
<p>Look at the bottom of the web page, <em>Index.html</em></p>
<pre class="brush:xml;">
&lt;!-- App libraries --&gt;
&lt;script src=&quot;Scripts/app/todo.bindings.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;Scripts/app/todo.datacontext.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;Scripts/app/todo.model.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;Scripts/app/todo.viewmodel.js&quot;&gt;&lt;/script&gt;
</pre>
<p>There&#39;s a <em>model.js</em> script sitting between the <em>datacontext.js</em>, which creates the application&#39;s <span class="codeword">EntityManager</span>, and the <em>viewmodel.js</em> that launches the user experience.</p>
<p>In that small window of time, <em>model.js</em> can define the application metadata. Many Breeze applications have a <em>model.js</em> script, positioned just like this one, to supplement the server-supplied metadata with client-side logic. Such a script typically <a href="/documentation/extending-entities">extends the <span class="codeword">EntityTypes</span></a> with constructors, initializing functions, properties, validations, and behaviors in support of application workflow and presentation.</p>
<p>The <em>model.js</em> in NoDb creates the <span class="codeword">EntityTypes</span> <em>first</em> and then extends them. The following few lines explain the approach:</p>
<pre class="brush:jscript;">
// The empty metadataStore to which we add types
var store = datacontext.metadataStore;
addTodoItemType();
addTodoListType();
</pre>
<p>An <span class="codeword">EntityManager</span> get its metadata from an instance of the <span class="codeword">MetadataStore</span> class. The <em>datacontext</em> exposed the application manager&#39;s <em>metadataStore</em> for <em>model.js</em> to grab. And it starts adding types to the store.</p>
<p>Let&#39;s inspect the <span class="codeword">addTodoItemType</span> method to see how we define types in metadata.</p>
<h4>
	EntityType</h4>
<p>The first step is to create an <span class="codeword">EntityType</span> object for the &quot;TodoItem&quot;:</p>
<pre class="brush:jscript;">
var et = new breeze.EntityType({
    shortName: &quot;TodoItem&quot;,
    namespace: &quot;NoDb.Models&quot;,
    autoGeneratedKeyType: AutoGeneratedKeyType.Identity
});
</pre>
<p>The <em>shortName</em> and <em>namespace</em> combine to <strong>exactly match the full name of the type on the server</strong>, &quot;<em>NoDb.Models.TodoItem</em>&quot;. In BreezeJS, the client and server know the type by the same full name although you can usually refer to the client-side type by its short name, &quot;<em>TodoItem</em>&quot;.</p>
<p>Every entity requires a unique key. Does the client or the server define the key for a newly created <span class="codeword">TodoItem</span>? The <span class="codeword">AutoGeneratedKeyType.Identity</span> enum tells Breeze that the server will create the permanent key. Breeze generates temporary keys for new entities until they are saved. After saving those entities successfully, Breeze replaces the temporary keys (both primary and foreign keys) with their permanent values.</p>
<h4>
	DataProperty</h4>
<p>Now that we know the <em>key management strategy</em>, we add a <em>key property</em> to the type object:</p>
<pre class="brush:jscript;">
et.addProperty(new breeze.DataProperty({
    name: &quot;todoItemId&quot;,
    dataType: breeze.DataType.Int32,
    isNullable: false,
    isPartOfKey: true
}));
</pre>
<p>A <span class="codeword">DataProperty</span> describes a property of the entity type that returns a simple value. The constructor takes a hashmap of key/value settings. You must specify your settings in this constructor hashmap; you can read the properties of a <span class="codeword">DataProperty</span> later but you can&#39;t change them. Omitted settings receive default values. See the <a href="/doc-js/api-docs/classes/DataProperty.html#property_dataType" onclick="window.open(this.href, '', 'resizable=no,status=no,location=no,toolbar=no,menubar=no,fullscreen=no,scrollbars=no,dependent=no'); return false;">API documentation</a> for details.</p>
<p>An entity typically has only one key property so the default is false and we had to set it true for this property. As the setting name implies (<span class="codeword">isPartOfKey</span>), Breeze supports composite keys.</p>
<h4>
	NamingConvention</h4>
<p>The client-side property <strong>name</strong> must <em>correspond</em> to the server-side property name. Unlike the entity type name, it need not match exactly. As we see here, the key property is named &quot;todoItemId&quot; (camelCase) on the client and &quot;TodoItemId&quot; (PascalCase) on the server.</p>
<p>The two names are strictly related by a <a href="/documentation/metadata/#NamingConvention">NamingConvention</a>. By default the client and server property names match exactly. The author of NoDb preferred camel case on the client and set the default convention accordingly in the <em>datacontext.js</em> just <em><strong>before</strong></em> creating the <span class="codeword">EntityManager</span>; later would have been too late.</p>
<pre class="brush:jscript;">
breeze.NamingConvention.camelCase.setAsDefault();
</pre>
<h4>
	Validated properties</h4>
<p>Let&#39;s add the <em>title</em> property:</p>
<pre class="brush:jscript;">
 et.addProperty(prop = new breeze.DataProperty({
    name: &quot;title&quot;,
    dataType: breeze.DataType.String,
    isNullable: false
 }));
     
 // Add client-side validation to &#39;title&#39; 
 et.addValidator(
    breeze.Validator.required(), prop);
 et.addValidator(
    breeze.Validator.maxLength({ maxLength: 30 }),prop);
</pre>
<p>The property definition holds no surprises. But we followed that definition by adding a couple of validation rules called &quot;<a href="/documentation/validation">Validators</a>&quot;. We could have added them later (validators are among the few aspects of a property that can be changed later). We added them here as a matter of style.</p>
<h4>
	Navigation properties</h4>
<p>A <span class="codeword">TodoItem</span> has a parent <span class="codeword">TodoList</span>. A <span class="codeword">TodoList</span> has zero or more child <span class="codeword">TodoItems</span>. They are bound by an <strong><em>association</em></strong>. Breeze supports associations with <a href="/documentation/navigation-properties">navigation properties</a> defined in metadata.</p>
<p>Let&#39;s add a property to &quot;navigate&quot; from a <span class="codeword">TodoItem</span> to its parent <span class="codeword">TodoList</span>.</p>
<pre class="brush:jscript;">
et.addProperty(new breeze.NavigationProperty({
    name: &quot;todoList&quot;,
    entityTypeName: &quot;TodoList&quot;,
    isScalar: true,  // returns a single parent TodoList
    foreignKeyNames: [&quot;todoListId&quot;],
    associationName: &quot;TodoList_Items&quot;
}));
</pre>
<p>It is conventional, on both client and server, to name a navigation property after the type it returns. This property returns a single value (<span class="codeword">isScalar: true</span>) so we call it &quot;todoList&quot;.</p>
<p>Breeze relies on foreign keys for navigating among entities in cache. This navigation property&#39;s supporting foreign key is &quot;todoListId&quot; (we skipped it here but you&#39;ll find it defined in the code sample).</p>
<p>The <span class="codeword">associationName</span> is semi-optional. It&#39;s required only if the entity on the other side has an &quot;inverse&quot; navigation property back to the <span class="codeword">TodoItem</span>. The parent <span class="codeword">TodoList</span> has such a property:</p>
<pre class="brush:jscript;">
et.addProperty(new NavigationProperty({
    name: &quot;todos&quot;,
    entityTypeName: &quot;TodoItem&quot;,
    isScalar: false, // returns a collection of TodoItems
    associationName: &quot;TodoList_Items&quot; 
}));
</pre>
<p>Notice that the <span class="codeword">associationName</span> is the same.</p>
<h4>
	Add the type to the store</h4>
<p>Once we&#39;ve finished adding properties to the <span class="codeword">TodoItem</span> type - really finished - we add it to the <span class="codeword">MetadataStore</span>:</p>
<pre class="brush:jscript;">
store.addEntityType(et);
</pre>
<p>Once we do this we won&#39;t be able to add, change, or remove properties from this type. We will be able to add and remove validators later. We can add a custom constructor and initializer function too ... as we do next.</p>
<h4>
	Add an initializer function</h4>
<p>We can add business logic, define default values, and create <em>unmapped</em> properties for any <span class="codeword">EntityType</span> by register a <strong>custom constructor</strong> function.</p>
<p>All of the properties we&#39;ve added were mapped, meaning they correspond to locations in permanent storage on the server and Breeze moves values between these properties and those locations when it queries and saves. Yet sometimes we want an entity to carry information that is not saved permanently and does not correspond to a location in the database.</p>
<p><strong><em>Unmapped</em></strong> properties can be a good choice for this purpose. Breeze still recognizes them. Breeze will serialize them, send them to the server, and listen for their changes. But it won&#39;t try to save them and changes to unmapped properties do not affect the <a href="/documentation/inside-entity/#EntityState"><span class="codeword">EntityState</span></a>.</p>
<p>The <span class="codeword">TodoItem</span> in this app doesn&#39;t have custom business logic and doesn&#39;t have unmapped properties so it doesn&#39;t need a custom constructor. But there is another property that every <span class="codeword">TodoItem</span> must have, the <span class="codeword">errorMessage</span> Knockout observable. That&#39;s where the application puts validation messages and system error messages when something is wrong with a Todo. Knockout binds the Todo&#39;s <span class="codeword">errorMessage</span> is to the view and updates the view as error messages are added and cleared.</p>
<p>Breeze shouldn&#39;t know about this property. It&#39;s clearly not a mapped property. It&#39;s not unmapped either. Breeze shouldn&#39;t serialize it or send it to the server. But we&#39;d like Breeze to add this property to every new <span class="codeword">TodoItem</span> it makes, whether that Todo is created explicitly or implicitly as a result of a query. We can make that happen when we register an <strong>initializer function</strong><!--. </p-->.</p>
<pre class="brush:jscript;">
store.registerEntityTypeCtor(&quot;TodoItem&quot;, null, todoItemInitializer);

function todoItemInitializer(todoItem) {
   todoItem.errorMessage = ko.observable();
}
</pre>
<p>Learn more about custom constructors and initializers in the &quot;<a href="/documentation/extending-entities">Extending entities</a>&quot; topic.</p>
<h2>
	We&#39;re Done!</h2>
<p>In this sample we did away with the database, with EntityFramework, and with server-supplied metadata.&nbsp;</p>
<p>&nbsp;</p>
