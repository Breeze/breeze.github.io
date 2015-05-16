---
layout: doc-js
---
<h1>Inside the Entity</h1>

<p>This topic concentrates on the model object&#39;s entity nature, in particular how the entity is <strong>tracked </strong>during its lifetime on the client. You&#39;ll learn about the <strong><em><span class="codeword">entityAspect</span> </em></strong>property through which the developer can access and control the state of the entity within the Breeze system.</p>

<p class="note">Code snippets on this page are in the <em><strong>basicTodoTests </strong></em>and&nbsp; <em><strong>entityTests</strong> </em>modules of the <a href="/samples/docode">DocCode teaching tests</a>.</p>

<h3>&quot;<em>Entity-ness</em>&quot;</h3>

<p>A domain <strong>model object</strong> represents something significant in the application domain. A &quot;Customer&quot;, for example, has data properties (&quot;<em>Name</em>&quot;), relationships to other entities (&quot;<em>Orders</em>&quot;) and perhaps some business logic (&quot;<em>isGoldCustomer</em>&quot;). We bind these object members to UI controls and reason about them in application code. They are what matters most to users and other application stakeholders. They define &quot;<em>Customer-ness</em>&quot;.</p>

<p>The &quot;Customer&quot; is also an <strong>entity</strong>, a long-lived object with a permanent key. We can fetch it from a database, hold it in cache, check for changes, validate, and save it. When the developer&#39;s attention turns to whether an object has changed or not, what its values used to be, how it is persisted, whether it has validation errors ... the developer is thinking about the object&#39;s <strong>entity nature</strong>. Breeze is responsible for the object&#39;s entity nature, its &quot;<em>entity-ness</em>&quot;.&nbsp; You access an entity&#39;s entity nature through its <strong><em>entityType </em></strong>and <strong><em>entityAspect </em></strong>properties.</p>

<h1>EntityType</h1>

<p>Every Breeze entity instance has an <code>entityType</code> property that returns an <a href="/sites/all/apidocs/classes/EntityType.html" target="_blank" title="EntityType API"><code>EntityType</code></a> object which is the <a href="/documentation/metadata.html" title="Metadata documentation">metadata</a> that describe its properties and other facts about the type.</p>

<pre class="brush:jscript;">
var type = someCustomer.entityType;
</pre>

<h1>EntityAspect</h1>

<p>A Breeze entity is &quot;self-tracking&quot;. It maintains its own entity state, and the means to change that state, in the&nbsp;<strong><em><a href="/sites/all/apidocs/classes/EntityAspect.html" target="_blank" title="EntityAspect API">EntityAspect</a></em></strong> object returned by its <em>entityAspect </em>property.</p>

<p>An object becomes a Breeze entity when it acquires its <em>EntityAspect </em>which it does when it</p>

<ul>
	<li>first enters the cache as a result of a query or import <strong>OR</strong></li>
	<li>is created with the <a href="/documentation/creating-entities" target="_blank"><em>EntityType.createEntity</em></a> factory method <strong>OR</strong></li>
	<li>is explictly added or attached to an EntityManager</li>
</ul>

<p>The first of any of these actions is sufficient to endow an object with its <em>EntityAspect </em>which it retains throughout its client session lifetime.</p>

<p>We&#39;ll tackle <em>EntityAspect</em>&#39;s key features in four groups.</p>

<ul>
	<li><a href="#EntityState">entityState</a> ... and the methods that can reset that state</li>
	<li><a href="#PropertyChanged">propertyChanged </a>event</li>
	<li><a href="#ValidateEntity">validateEntity </a>... and related validation members</li>
	<li><a href="#EntityMiscellany">entity miscellany</a></li>
</ul>

<h2><a name="EntityState"></a>EntityState</h2>

<p>Is the entity attached to an <em>EntityManager </em>and therefore in its cache? Has it changed? If changed, is it a new entity, a modified version of an existing entity from remote storage, or an existing entity that is marked for deletion?</p>

<p>The <em>entityState </em>property answers these questions with a value from the <em><a href="/sites/all/apidocs/classes/EntityState.html">EntityState</a></em> enumeration. Here are the enumeration names and their meanings:</p>

<table border="0" cellpadding="0" cellspacing="0">
	<tbody>
		<tr>
			<td style="width:121px;vertical-align:top;">
			<p><strong>&quot;Added&rdquo;</strong></p>
			</td>
			<td style="width:498px;vertical-align:top;">
			<p>A new entity in cache that does not exist in the backend database.</p>
			</td>
		</tr>
		<tr>
			<td style="vertical-align:top;">
			<p><strong>&ldquo;Unchanged&rdquo;</strong></p>
			</td>
			<td style="vertical-align:top;">
			<p>An existing entity in cache that was queried from the database; the entity has no unsaved changes since it was last retrieved or saved.</p>
			</td>
		</tr>
		<tr>
			<td style="vertical-align:top;">
			<p><strong>&ldquo;Modified&rdquo;</strong></p>
			</td>
			<td style="vertical-align:top;">
			<p>An existing entity in cache with pending changes.</p>
			</td>
		</tr>
		<tr>
			<td style="vertical-align:top;">
			<p><strong>&ldquo;Deleted&rdquo;</strong></p>
			</td>
			<td style="vertical-align:top;">
			<p>An existing entity in cache that is marked for deletion.</p>
			</td>
		</tr>
		<tr>
			<td style="vertical-align:top;">
			<p><strong>&ldquo;Detached&rdquo;</strong></p>
			</td>
			<td style="vertical-align:top;">
			<p>An entity that is not in cache; its status in the database is unknown.</p>
			</td>
		</tr>
	</tbody>
</table>

<p>You can test the value of an EntityState enumeration by comparing its name with a string. Or you may prefer to test with the enumeration&#39;s properties and methods:</p>

<pre class="brush:jscript;">
  var state = anEntity.entityAspect.entityState;
  if (state.name === &quot;Modified&quot;) {/* ... */};             // ok
  if (state === breeze.EntityState.Modified) {/* ... */}; // better
  if (state.IsModified())  {/* ... */};                   // best
  if (state.IsAddedModifiedorDeleted())  {/* ... */};     // often useful</pre>

<h3>EntityState transitions</h3>

<p>As things happen to an entity, Breeze updates its <em>EntityState</em> automatically. Here are before and after <em>EntityStates </em>for some of the most common actions:</p>

<table border="0" cellpadding="0" cellspacing="0" width="480">
	<thead style="background-color: light-blue;">
		<tr>
			<td style="width: 100px; vertical-align: top;background-color:#d3d3d3;"><strong>Before</strong></td>
			<td style="width: 280px; vertical-align: top;background-color:#d3d3d3;"><strong>Action</strong></td>
			<td style="width: 100px; vertical-align: top;background-color:#d3d3d3;"><strong>After</strong></td>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			<p>&nbsp;</p>
			</td>
			<td style="vertical-align: top; width: 280px;">
			<p>Entity materialized in cache by a query</p>
			</td>
			<td style="vertical-align: top; width: 100px;">
			<p>Unchanged</p>
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			<p>Unchanged</p>
			</td>
			<td style="vertical-align: top; width: 280px;">
			<p>Set one of its properties</p>
			</td>
			<td style="vertical-align: top; width: 100px;">
			<p>Modified</p>
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			<p>Modified</p>
			</td>
			<td style="vertical-align: top; width: 280px;">
			<p>Save it successfully</p>
			</td>
			<td style="vertical-align: top; width: 100px;">
			<p>Unchanged</p>
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			<p>Unchanged</p>
			</td>
			<td style="vertical-align: top; width: 280px;">
			<p><a href="#DeleteEntity">Mark it deleted</a></p>
			</td>
			<td style="vertical-align: top; width: 100px;">
			<p>Deleted</p>
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			<p>Deleted</p>
			</td>
			<td style="vertical-align: top; width: 280px;">
			<p>Save it</p>
			</td>
			<td style="vertical-align: top; width: 100px;">
			<p>Detached</p>
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			<p>&nbsp;</p>
			</td>
			<td style="vertical-align: top; width: 280px;">
			<p><a href="/documentation/creating-entities" target="_blank">Create a new entity</a></p>
			</td>
			<td style="vertical-align: top; width: 100px;">
			<p>Detached</p>
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			<p>Detached</p>
			</td>
			<td style="vertical-align: top; width: 280px;">
			<p>Add the new entity to the manager</p>
			</td>
			<td style="vertical-align: top; width: 100px;">
			<p>Added</p>
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			<p>Added</p>
			</td>
			<td style="vertical-align: top; width: 280px;">
			<p>Delete it (or call <em><a href="#RejectChanges">rejectChanges</a></em>)</p>
			</td>
			<td style="vertical-align: top; width: 100px;">
			<p>Detached</p>
			</td>
		</tr>
	</tbody>
</table>

<p>Two state-changes may surprise you. If you mark an <strong><em>existing </em>entity</strong> for deletion and save it successfully, the entity becomes detached. Breeze can&#39;t make the entity disappear; it may still be visible in the UI. But the entity no longer exists on the server so Breeze banishes it from its former <em>EntityManager </em>cache.</p>

<p>Deleting a <strong><em>new </em>entity</strong> detaches it immediately. Breeze doesn&#39;t wait for you to call <em>saveChanges</em> which is pointless if you&#39;re discarding data that have never been saved.</p>

<h3>Detached entities</h3>

<p>A detached entity does not belong to an <em>EntityManager</em>. It&#39;s still an entity; it&#39;s just not an entity in any cache.</p>

<p>A detached entities should not be used. Either attach it to an <em>EntityManager </em>or release all references to it ... and let it be garbage collected.</p>

<p>A detached entity is unreliable. It still has data values and you can still set them. But its <a href="/documentation/navigation-properties" target="_blank">navigation properties</a> are not dependable and other entity features may behave unexpectedly. You can&#39;t tell by inspection whether a detached entity has corresponding data in remote storage.</p>

<p>New entities start as detached entities. You might have to create them where no <em>EntityManager </em>is available. More likely, you have to initialize some of the new entity&#39;s values before you can add it to an <em>EntityManager</em>. For example, because all entities in cache must have unique keys, if the entity key is client-determined (as opposed to store-generated), you must set the key to a unique value before you can attach the entity to an <em>EntityManager</em>.</p>

<p>You should initialize a new entity and then immediately add it to an <em>EntityManager&nbsp; </em>... unless you have a very good reason to do otherwise.</p>

<p>Entities can become detached deliberately or as a side-effect of another action. The following actions detach an entity:</p>

<ul>
	<li>explicitly removing it from its <em>EntityManager</em> (<code>manager.detachEntity(<em>anEntity</em>)</code>)</li>
	<li>clearing its <em>EntityManager</em> (<code>manager.clear()</code>)</li>
	<li>deleting a <em>new </em>entity</li>
	<li>deleting an <em>existing </em>entity and then saving it successfully.</li>
</ul>

<p>Note that removing an entity from cache (detaching it) does not delete it. The data of a pre-existing detached entity remain in remote storage.</p>

<h3>Force an entityState change</h3>

<p>You can change the <em>entityState </em>programmatically through one of the <em>EntityAspect </em>methods dedicated to that purpose.</p>

<ul>
	<li><em>setDeleted</em>()</li>
	<li><em>rejectChanges</em>()</li>
</ul>

<ul>
	<li><em>setModified</em>()</li>
	<li><em>setUnchanged</em>()</li>
	<li>acceptChanges()</li>
</ul>

<p>Call <em>setDeleted</em>() to schedule an entity for deletion as discussed <a href="#DeleteEntity">below</a>.</p>

<p>Call <em>rejectChanges</em>() to cancel pending changes as discussed <a href="#RejectChanges">below</a>.</p>

<p>You rarely <em>see setModified,</em> <em>setUnchanged,</em> or <em>acceptChanges </em>in production code; production entities become &quot;Modified&quot; or &quot;Unchanged&quot; as a side-effect of application activity.</p>

<p>You are most likely to call these methods while setting up <strong><em>fake entities</em></strong> for automated tests because you want to force these fakes into a particular test state. The <em>setUnchanged</em> and <em>acceptChanges </em>methods also clear the <em>originalValues</em> hash map, erasing memory of prior values; you won&#39;t be able to revert these entities to their original values.</p>

<h3><a name="DeleteEntity"></a> Deleting entities</h3>

<p>Deleting an entity begins with an <em>EntityState</em> change. Call <em><strong>setDeleted()</strong></em> to mark an entity for deletion:</p>

<div>
<pre class="brush:jscript;">
  someEntity.entityAspect.setDeleted(); // mark for deletion</pre>
</div>

<p><em><span class="codeword">setDeleted</span> </em>does not destroy the object locally nor does it remove the entity from the database. The entity simply remains in cache in a &ldquo;Deleted&rdquo; state &hellip; as changed and added entities do ... until you save. A successful save deletes the entity from the database and removes it from cache.</p>

<h3><a name="RejectChanges"></a>Cancel with <em>rejectChanges</em></h3>

<p>Once you&rsquo;ve changed an entity, it stays in a changed state &hellip; even if you manually restore the original values:</p>

<div>
<pre class="brush:jscript;">
  var oldDescription = todo.Description(); // assume existing &quot;Unchanged&quot; entity
  todo.Description(&quot;Something new&quot;);       // entityState becomes &quot;Modified&quot;
  todo.Description(oldDescription);        // entityState is still &quot;Modified&quot;</pre>
</div>

<p>Call <em>rejectChanges </em>to cancel pending changes, revert properties to their prior values, and set the <em>entityState </em>to &quot;Unchanged&quot;.</p>

<div>
<pre class="brush:jscript;">
  var oldDescription = todo.Description();// assume existing &quot;Unchanged&quot; entity
  todo.Description(&quot;Something new&quot;);      // entityState becomes &quot;Modified&quot;
  todo.entityAspect.rejectChanges();      // entityState restored to &quot;Unchanged&rdquo;
                                          // todo.Description() === oldDescription</pre>
</div>

<p>You can also call <em>rejectChanges</em> on the EntityManager to cancel and revert pending changes for every entity in cache.</p>

<pre class="brush:jscript;">
  manager.rejectChanges(); // revert all pending changes in cache</pre>

<h3>Original values</h3>

<p>Breeze remembers the original property values when you change an existing entity. It stores these values in the <em>EntityAspect</em>&#39;s&nbsp;<em><strong>originalValues</strong></em><strong> </strong>hash map. The <em>originalValues </em>hash is an empty object while the entity is in the &quot;Unchanged&quot; state. When you change an entity property for the first time, Breeze adds the pre-change value to the <em>originalValues</em> hash, using the property name as the key. The keys of the hash are the names of the properties that have been changed since the entity was last queried or saved.</p>

<p>Here&#39;s a function to get those keys:</p>

<pre class="brush:jscript;">
  function getOriginalValuesPropertyNames(entity) {
      var names = [];
      for (var name in entity.entityAspect.originalValues) { names.push(name); }
      return names;
  }
</pre>

<p>Breeze replaces <em>entityAspect.originalValues</em> with a new empty hash when any operation restores the entity to the &quot;Unchanged&quot; state. A successful save, <em>rejectChanges</em>, <em>setUnchanged</em>, and <em>acceptChanges </em>all reset the <em>originalValues</em> hash.</p>

<h2><a name="PropertyChanged"></a>PropertyChanged event</h2>

<p>Breeze creates entities in accordance with the model library you selected for your application. If you specified (or accepted) the default Knockout (KO) model library, the entity&#39;s properties are KO observables. You can <a href="http://knockoutjs.com/documentation/observables.html">subscribe</a> to individual KO property changes as in this example:</p>

<div>
<pre class="brush:jscript;">
  entity.Name.subscribe(
      function (newValue) { /* ... */);});</pre>
</div>

<p>Each model library has its own property change subscription mechanism.</p>

<p>Breeze also has a <em>propertyChanged </em>event that supplements the model library offering. You can listen for a change to any Breeze-tracked entity property with a single subscription:</p>

<div>
<pre class="brush:jscript;">
 entity.entityAspect.propertyChanged
       .subscribe(function (changeArgs) { /* ... */);});</pre>
</div>

<p>The properties of the <em><span class="codeword">changeArgs</span></em><span class="codeword"> </span>are</p>

<ul>
	<li><em>entity </em>- the entity that changed</li>
	<li><em>propertyName </em>- the name of the property that changed</li>
	<li><em>oldValue </em>- the value before the property changed</li>
	<li><em>newValue </em>- the current property value.</li>
</ul>

<p>Capture the subscription token if you need to unsubscribe later.</p>

<pre class="brush:jscript;">
  var token = entity.entityAspect.propertyChanged
                    .subscribe(function (changeArgs) { /* ... */);});
  // ... time passes ...
  entity.entityAspect.propertyChanged.unsubscribe(token);
</pre>

<h3>Limitations</h3>

<p>Breeze only monitors changes to properties identified in the metadata for this <em>EntityType</em>. These properties - mapped and unmapped - are the &quot;<em>Breeze-tracked entity properties</em>&quot; mentioned earlier. Breeze doesn&#39;t track properties that you add with an entity initialization function (see <a href="/documentation/extending-entities">Extending Entities</a>) or that you patch into the entity later in its lifetime.</p>

<p>Nor does Breeze raise the <em>propertyChanged </em>event when an <em>EntityAspect </em>property changes. For example, the <em>propertyChanged </em>event does not fire when the <a href="#EntityState"><em>entityState</em></a> changes.</p>

<p class="note">You can detect when the <em>entityState </em>changes ... using a technique to be described soon.</p>

<p>Breeze typically raises <em>propertyChanged </em>for each property individually. Some operations - such as queries, imports, saves, and <em><a href="#RejectChanges">rejectChanges</a></em> - update many properties at the same time. Breeze consolidates notification of these changes into a single <em>propertyChanged </em>event with a &ldquo;null&rdquo; property name. A subscriber learns that at least one property changed but can&#39;t know which particular properties changed; if this information is important to you, you&#39;ll have to indentify the affected properties in some out-of-band way (see <em>entityTests</em> module of the <a href="/samples/docode">DocCode teaching tests</a> for a suggestion).</p>

<h2><a name="ValidateEntity"></a>ValidateEntity</h2>

<p>Breeze properties aren&rsquo;t just observable. They can validate changes based on rules registered in metadata. Some of the validations are registered automatically based on information in the metadata. For example, a key property is automatically required. You can add your own custom validations as well. See the <a href="/documentation/validation" target="_blank">Validation topic</a> for details.</p>

<p>In brief, Breeze evaluates validation rules at prescribed times. It can also validate on demand. Call the <em>entityAspect.validateEntity</em> to validate the entire entity which means every property validation rule as well as every entity-level validation rule. You can validate a single property (all of its rules) by calling <em>entityAspect.<a href="/sites/all/apidocs/classes/EntityAspect.html#method_validateProperty" target="_blank">validateProperty</a></em>, passing in the name of the property and an optional context. Again, see the <a href="/documentation/validation" target="_blank">Validation topic</a> for details.</p>

<p>A validation rule either passes or fails. If it passes, it returns null. If it fails, it returns a <em><a href="/sites/all/apidocs/classes/ValidationError.html" target="_blank">ValidationError</a></em> describing the problem.</p>

<p>Every <em>EntityAspect</em> maintains a <em><span class="codeword">validationErrorsCollection</span></em>. The Breeze validation engine adds a new <em>ValidationError </em>instance to that collection when a validation rules fails and removes an old <em>ValidationErrors</em> instance when its associated validation rule passes.</p>

<p>You can&#39;t access the inner <em><span class="codeword">validationErrorsCollection</span></em> directly. You can get a copy of its contents by calling <em>entityAspect</em>.<em><a href="/sites/all/apidocs/classes/EntityAspect.html#method_getValidationErrors" target="_blank">getValidationErrors</a></em>. You can also add to or remove <em>validationError</em>s from the <em><span class="codeword">validationErrorsCollection</span></em> programmatically with the <em>EntityAspect </em>methods, <em><a href="/sites/all/apidocs/classes/EntityAspect.html#method_addValidationError" target="_blank">addValidationError</a></em> and <em><a href="/sites/all/apidocs/classes/EntityAspect.html#method_removeValidationError" target="_blank">removeValidationError</a></em>.</p>

<p>Breeze raises the <em>EntityAspect</em>&#39;s <strong><em><span class="codeword">validationErrorsChanged</span> </em></strong>event when <em>ValidationErrors</em> are added or removed from the entity&rsquo;s <em><span class="codeword">validationErrorsCollection</span></em>; you can subscribe to that event:</p>

<div>
<pre class="brush:jscript;">
  entity.entityAspect
       .validationErrorsChanged.subscribe(handleValidationErrorChanged);</pre>
</div>

<p>Breeze calls the handler with an <em><span class="codeword">errorsChangedArgs</span> </em>that tells you what property changed, the <em>ValidationErrors </em>that were added, and the <em>ValidationErrors </em> that were removed.</p>

<h2><a name="EntityMiscellany"></a>Entity miscellany</h2>

<p>This last category is a small menagerie of miscellaneous <em>EntityAspect </em>members</p>

<ul>
	<li><strong><em>entity</em> </strong>- a backward reference to the entity that holds this <em>EntityAspect</em></li>
	<li><strong><em>entityManager </em></strong>- the <em>EntityManager </em>to which this entity is attached ... or was attached. It&#39;s null if the entity is new and not yet added to a manager.</li>
	<li><strong><em>getKey</em> </strong>- a function returning the entity&#39;s <em><a href="/sites/all/apidocs/classes/EntityKey.html" target="_blank">EntityKey</a></em>. A key is an object that uniquely identifies the entity in cache and in remote storage. The key is not a simple JavaScript value. It&#39;s an object the identifies the type of the entity and the value ... or values ... of the key; Breeze supports entities with composite keys.</li>
	<li><strong><em>isBeingSaved</em> </strong>- a property that returns <em>true </em>if this entity is one in a batch of entities being saved and the save operation is still in progress. Your application may need to prevent further changes to the entity until the save operation completes, successfully or not.</li>
	<li><strong><em>loadNavigationProperty</em> </strong>- you can download related entities, on demand, by calling <em>loadNavigationProperty </em>as described in the <a href="/documentation/navigation-properties" target="_blank">Navigation Properties</a> topic.</li>
</ul>

<h1>Breeze properties on the entity itself</h1>

<p>You typically access the breeze entity infrastructure through the <em>entityAspect</em> property. Breeze also injects a few more entity-oriented members into the model object&#39;s prototype. These members are visible on the entity&#39;s surface API.</p>

<p><em><strong>entityType </strong></em>- a property that returns the Breeze <a href="/sites/all/apidocs/classes/EntityType.html" target="_blank">type information object</a>, metadata describing this type of entity.</p>

<pre class="brush:jscript;">
  var customerType = manager.metadataStore.getEntityType(&quot;Customer&quot;);
  var customer = customerType.createEntity();
  // customer.entityType === customerType </pre>

<p><em><strong>getProperty </strong></em>- a function that returns the value of a property<br />
<em><strong>setProperty </strong></em>- a function that sets a property value</p>

<pre class="brush:jscript;">
  var setName = &quot;Ima Something Corp&quot;;
  customer.setProperty(&quot;CompanyName&quot;, setName);
  var getName = customer.getProperty(&quot;CompanyName&quot;);
  // getName === setName</pre>

<p>With <em>getProperty </em>and <em>setProperty</em>, you can write utilities to access the properties of any Breeze entity. The model library won&#39;t matter. An entity could be implemented with the Knockout model library, the backbone model library, the angular model library, or a custom model library. Each library has its own distinctive property accessor methodology. You can ignore these differences.</p>

<p>The <em>setProperty </em>function follows the same code path as the model library property accessor and will raise property change events, change the entity state, and trigger validation accordingly. Note that calling setProperty with an &#39;invalid&#39; propertyName, i.e. one that does NOT have an associated DataProperty or NavigationProperty,&nbsp;will result in model library specific behavior.&nbsp;</p>

<p><em><strong>_$interceptor</strong></em> - a Breeze internal function; please leave it alone.</p>
