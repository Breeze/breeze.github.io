---
layout: doc-js
redirect_from: "/old/documentation/.html"
---
<h1>
	Add a new entity</h1>
<p class="note">The code snippets on this page are in the <a href="/samples/todo">Breeze Todo Sample App</a>.</p>
<p>When the user enters a description in the big &ldquo;Todo app&rdquo; textbox and hits <strong>Enter</strong>, the screen&rsquo;s <em>ViewModel</em> calls the dataservice&rsquo;s <span class="codeword">createTodo</span> method, passing along a hash of initial values that are partly derived from user input (the big textbox, the state of the &quot;Mark all completed&quot; checkbox):</p>
<pre class="brush:jscript;">
function addItem() {
    var item = dataservice.createTodo({
        Description: vm.newTodo(),
        CreatedAt: new Date(),
        IsDone: vm.markAllCompleted()
    });

   // ... more
}
</pre>
<p>The <em>initialValues </em>hash might be:</p>
<pre class="brush:jscript;">
{
    Description: &quot;Have fun&quot;,
    CreatedAt: new Date(),    
    IsDone: false
}</pre>
<p>The dataservice&rsquo;s <span class="codeword">createTodo</span> method is simple:</p>
<pre class="brush:jscript;">
function createTodo(initialValues) {
    return manager.createEntity(&#39;TodoItem&#39;, initialValues);
};</pre>
<p>The <span class="codeword">createTodo</span> delegates to the dataservice manager&#39;s <span class="codeword">createEntity</span> method (see also &quot;<a href="/documentation/creating-entities">Creating entities</a>&quot;) , setting the name of the Todo <span class="codeword">EntityType</span> and forwarding the&nbsp; initialValues.</p>
<p class="note">Be sure to use the <span class="codeword">EntityType</span> name (&quot;TodoItem&quot;) and not the query resource name (&quot;Todos&quot;). The name is case sensitive as well. The intialValues object is optional.</p>
<p>That&#39;s it. You&#39;re done. You&#39;re free to move on. But we suggest you linger a while. For that one small line does a lot of work. Under the hood it translates to something&nbsp; more long winded:</p>
<div>
	<pre class="brush:jscript;">
 function createTodo(initialValues) {
     var todoType = manager.metadataStore.getEntityType(&quot;TodoItem&quot;);
     var newTodo = todoType.createEntity(initialValues);
     return manager.addEntity(newTodo);
 };</pre>
</div>
<p>This code creates a new Todo with the help of a <span class="codeword">createEntity</span> factory method defined on an instance of <strong><span class="codeword">EntityType</span> </strong>(same method name; different Breeze component). Having created the new <span class="codeword">TodoItem</span>, we immediately add it to a local cache using the EntityManager&rsquo;s <em><span class="codeword">addEntity</span> </em>method; a new entity must be in cache before the manager can save it to remote storage [<a href="#note 1">1</a>].</p>
<p>This is real Breeze code and you could spell it out, step-by-step like this if you prefer. I wouldn&#39;t; I&#39;d call <span class="codeword">manager.createEntity</span> and get on with my day.</p>
<p>But there are important Breeze lessons to learn from this long-form of entity creation. There&#39;s clearly more involved here than simply <em>new&#39;ing</em> up an object. It&#39;s worth sticking around for the explanation. Then use the shortcut in your daily code.</p>
<h2>
	Entity type</h2>
<p>Every entity instance has a type that you can access through its <span class="codeword">entityType</span> property. The type of an entity is itself an object, an instance of the Breeze <em><span class="codeword">EntityType</span></em>.</p>
<p>The <em>EntityType</em> is a container for metadata that describe a Breeze entity type. It knows about the type&rsquo;s constructor, validation rules, and properties; the detail about properties is wide ranging (check out the <a href="/doc-js/api-docs/classes/DataProperty.html"><em>DataProperty</em> </a>metadata object in the Breeze API docs). Perhaps most importantly, the <em>EntityType</em> knows how to create new instances of an entity type.</p>
<p>We used that feature a moment a go when we called its <em><span class="codeword">createEntity</span> </em>method. We got hold of an <span class="codeword">EntityType</span> object for TodoItems from the EntityManager&rsquo;s <em>metadatastore</em> with this line.</p>
<div>
	<pre class="brush:jscript;">
var todoType = manager.metadataStore.getEntityType(&quot;TodoItem&quot;);</pre>
</div>
<p>We could get metadata from the <em>EntityManager </em>for good reason: the <em>EntityManager</em> needs type information too. It needs type information to materialize entities out of raw data from the query result payload. You&rsquo;ll search the sample code in vain looking for the <em>TodoItem</em> definition in JavaScript. You won&#39;t find it. Nor will you find a component to translate between DTOs (data transfer objects) and entities; there is no <em>TodoItemDtoMapper</em> in this code base.</p>
<p>The <em>EntityType</em> is the mapper. The <em>EntityType</em> both defines and creates new Todos. There&#39;s an <em>EntityType </em>object to do the same for every other application entity managed by the Breeze client. All the <em>EntityType </em>objects are held in the manager&#39;s <em>MetadataStore</em>.</p>
<h2>
	Creating a Breeze entity</h2>
<p>What happens when we call &hellip;</p>
<div>
	<pre class="brush:jscript;">
 var newTodo = todoType.createEntity(initialValues);</pre>
</div>
<p>We&rsquo;ll cover the fundamentals now and leave details and nuances for a later.</p>
<p>The <span class="codeword">createEntity</span> first invokes a Breeze default parameterless constructor to make the new Todo object [<a href="#note 2">2</a>]. The new Todo has the following characteristics:</p>
<ul>
	<li>
		a type, accessible from its <span class="codeword">entityType</span> property.</li>
	<li>
		a key property</li>
	<li>
		an observable property for every simple data property defined for the type</li>
	<li>
		an observable array for every collection property (typically a navigation property)</li>
	<li>
		a Breeze entityAspect property for access to the breezy entity-ness inside.</li>
</ul>
<p>We&rsquo;ll look at the properties first and examine the <span class="codeword">entityAspect</span> later when we take up <a href="/documentation/change-tracking">Breeze change tracking</a>.</p>
<h2>
	Property generation</h2>
<p>The <span class="codeword">createEntity</span> call builds a new entity instance based on metadata. The metadata are typically downloaded from the server. That&#39;s the easy approach adopted by the Todo Application. But it&#39;s not the only approach. You can define your own entity class or take a hybird approach and add properties of your own to the generated entity that the server knows nothing abou (you can learn about that in the <a href="/documentation/metadata">&quot;Metadata&quot; topic</a>) &hellip; but it&rsquo;s important to understand right away that you are always in command of of your entity definitions because you control the metadata that describe them.</p>
<p>Breeze constructs the new entity instance and extends it with properties defined in that metadata, whatever their source. Then if there&#39;s an initialValues object, Breeze sets the properties accordingly. This latter step should be obvious. Let&#39;s focus on the extended properties which bear closer inspection.</p>
<h2>
	The key property</h2>
<p>Every Breeze entity must have a primary key that uniquely identifies the entity across the system. &nbsp;The integer Id property is the TodoItem&rsquo;s key.</p>
<p>All entities of the same type with the same key value are conceptually the same thing. You can have several copies of &ldquo;the same entity&rdquo; in memory but only one of them can be in an EntityManager&rsquo;s cache; all entities in cache are unique.</p>
<p>A new entity needs a new key. It can&rsquo;t enter the cache without a unique key. It won&rsquo;t be saved without a unique key. The key value has to come from somewhere, either the client or the server.</p>
<p>The <em>EntityType</em> knows whether the client or the backend is ultimately responsible for setting the key&rsquo;s permanent value. If the backend is responsible and you add the entity to an EntityManager, the manager assigns the new entity a temporary key that is unique within that manager&rsquo;s key-space. For example, a newly added Todo gets a negative Id.</p>
<p>When the Todo is saved, the server updates the Id to a permanent positive integer before sending the saved Todo data back to the client. Upon receipt, the manager updates the local Todo&rsquo;s Id with the permanent value.</p>
<p>The options and mechanisms are more sophisticated than described here; you can read about them in <a href="/documentation/save-changes">another topic</a>.</p>
<h2>
	Data vs Navigation Properties</h2>
<p>Most entity properties are &quot;data&quot; properties, properties providing access to simple data values such as the Todo description, whether the Todo is done, whether it&#39;s been archived, etc. Entities may also be related to each other. There&#39;s another kind of Breeze property, the &quot;navigation property&quot; with which you hop&nbsp; from one entity to another related entity.</p>
<p>Navigation properties are a fundamental Breeze feature. We can&rsquo;t show them to you with the Todos App sample because the &ldquo;Todos&rdquo; model only has one entity. There is no other entity to navigate to so it doesn&rsquo;t have foreign keys or navigation properties.</p>
<p>The app might grow up someday and support todos for different members of the family. Then each <em>Todo</em> would have a parent <em>Person</em> and each <em>Person</em> would have many child <em>Todo</em> entities. The <em>TodoItem</em> could have a <span class="codeword">Todo.Owner</span> property that returned a single person. Each <em>Person</em> could have a <span class="codeword">Person.Todos</span> property that returned zero-to-many todos.</p>
<p>To learn about navigation properties and foreign keys, see the <a href="/documentation/navigation-properties">Navigation Properties topic</a>.</p>
<h2>
	Observable Properties</h2>
<p>A native JavaScript property is inherently inert; you can get and set a property but the property can&#39;t do anything when you do. It can&#39;t have an implementation so it can&#39;t have behaviors. We want our Breeze entity properties to have behaviors in support of a responsive user experience. The navigation property is one kind of property that demands an implementation.</p>
<p>Breeze property also needs an implementation to play well with the data binding frameworks that greatly simplify development and maintenance of interactive UIs.</p>
<p>There are two basic approaches to presenting data to users:</p>
<ol>
	<li>
		write code to push values into HTML controls and pull changed values back out;</li>
	<li>
		bind controls to data properties and rely on the binding framework to move values back and forth automatically when either control or data values change.</li>
</ol>
<p>A helpful <a href="http://weblogs.asp.net/dwahlin/archive/2012/07/27/The-JavaScript-Cheese-is-Moving_3A00_-Data_2D00_Oriented-vs.-Control_2D00_Oriented-Programming.aspx">article by Dan Wahlin</a> describes and compares these rival techniques. He makes a pretty good case for data binding ... and we agree</p>
<p>If you still prefer the push/pull, control-oriented style, you can use Breeze entity properties that way. True, plain old JavaScript properties would have been fine; but Breeze properties won&#39;t get in your way.</p>
<p>If you prefer data binding, the entity data properties must be implemented in a way that supports that style. They have to raise property-changed events when their data change and the data binding framework you choose must be able to hear those events in order to update the screen. In other words, the properties must be &ldquo;observable&rdquo; by the data binding framework.</p>
<p>Breeze entities are observable properties. They&#39;re designed to be observable by a wide range of model libraries. As it happens, the Todo sample was built for UI data binding with <a href="http://knockoutjs.com/">Knockout</a>, a popular data binding library that we&#39;ll explore in the <strong><a href="/documentation/databinding-knockout">next topic</a></strong>.</p>
<h2>
	Notes</h2>
<p><a name="note 1"></a>[1] A typical application works almost exclusively with entities in an EntityManager cache in order to leverage the manager&rsquo;s capabilities.Entities can exist outside of a cache in a &ldquo;detached&rdquo; state. Learn about that later in this documentation. As a general rule, you want to work with entities that are in an EntityManager cache in order to take advantage of facilities that an EntityManager provides. For example, an entity must be in cache before it can be saved to the persistence service.</p>
<p><a name="note 2"></a>[2] You can register an alternative parameterless constructor of your own with <a href="/documentation/metadata">MetadataStore.registerEntityTypeCtor</a>.</p>
<p><a name="note 3"></a>[3] We showed you how the Todo app pours entities into an <span class="codeword">items</span> array when we introduced you to your <a href="/documentation/first-query-0">first Breeze query</a>. We also noted there that the app is configured (by default) to support Knockout data binding. Accordingly, when the Todo data arrived from the persistence service, Breeze merged those data into Todo objects that it built with Knockout observable properties.</p>
