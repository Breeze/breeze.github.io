---
layout: doc-js
redirect_from: "/old/documentation/inside-entity.html"
---
#Inside the Entity

This topic concentrates on the model object's entity nature, in particular how the entity is **tracked **during its lifetime on the client. You'll learn about the ***<span class="codeword">entityAspect</span> ***property through which the developer can access and control the state of the entity within the Breeze system.

> Code snippets on this page are in the ***basicTodoTests ***and  ***entityTests** *modules of the <a href="/samples/docode">DocCode teaching tests</a>.

###"*Entity-ness*"

A domain **model object** represents something significant in the application domain. A "Customer", for example, has data properties ("*Name*"), relationships to other entities ("*Orders*") and perhaps some business logic ("*isGoldCustomer*"). We bind these object members to UI controls and reason about them in application code. They are what matters most to users and other application stakeholders. They define "*Customer-ness*".

The "Customer" is also an **entity**, a long-lived object with a permanent key. We can fetch it from a database, hold it in cache, check for changes, validate, and save it. When the developer's attention turns to whether an object has changed or not, what its values used to be, how it is persisted, whether it has validation errors ... the developer is thinking about the object's **entity nature**. Breeze is responsible for the object's entity nature, its "*entity-ness*".  You access an entity's entity nature through its ***entityType ***and ***entityAspect ***properties.

#EntityType

Every Breeze entity instance has an <code>entityType</code> property that returns an <a href="/doc-js/api-docs/classes/EntityType.html" target="_blank" title="EntityType API"><code>EntityType</code></a> object which is the <a href="/doc-js/metadata.html" title="Metadata documentation">metadata</a> that describe its properties and other facts about the type.

<pre class="brush:jscript;">
var type = someCustomer.entityType;
</pre>

#EntityAspect

A Breeze entity is "self-tracking". It maintains its own entity state, and the means to change that state, in the ***<a href="/doc-js/api-docs/classes/EntityAspect.html" target="_blank" title="EntityAspect API">EntityAspect</a>*** object returned by its *entityAspect *property.

An object becomes a Breeze entity when it acquires its *EntityAspect *which it does when it

<ul>
	<li>first enters the cache as a result of a query or import **OR**
	<li>is created with the <a href="/doc-js/creating-entities" target="_blank">*EntityType.createEntity*</a> factory method **OR**
	<li>is explictly added or attached to an EntityManager
</ul>

The first of any of these actions is sufficient to endow an object with its *EntityAspect *which it retains throughout its client session lifetime.

We'll tackle *EntityAspect*'s key features in four groups.

<ul>
	<li><a href="#EntityState">entityState</a> ... and the methods that can reset that state
	<li><a href="#PropertyChanged">propertyChanged </a>event
	<li><a href="#ValidateEntity">validateEntity </a>... and related validation members
	<li><a href="#EntityMiscellany">entity miscellany</a>
</ul>

##<a name="EntityState"></a>EntityState

Is the entity attached to an *EntityManager *and therefore in its cache? Has it changed? If changed, is it a new entity, a modified version of an existing entity from remote storage, or an existing entity that is marked for deletion?

The *entityState *property answers these questions with a value from the *<a href="/doc-js/api-docs/classes/EntityState.html">EntityState</a>* enumeration. Here are the enumeration names and their meanings:

<table border="0" cellpadding="0" cellspacing="0">
	<tbody>
		<tr>
			<td style="width:121px;vertical-align:top;">
			**"Added"**
			</td>
			<td style="width:498px;vertical-align:top;">
			A new entity in cache that does not exist in the backend database.
			</td>
		</tr>
		<tr>
			<td style="vertical-align:top;">
			**"Unchanged"**
			</td>
			<td style="vertical-align:top;">
			An existing entity in cache that was queried from the database; the entity has no unsaved changes since it was last retrieved or saved.
			</td>
		</tr>
		<tr>
			<td style="vertical-align:top;">
			**"Modified"**
			</td>
			<td style="vertical-align:top;">
			An existing entity in cache with pending changes.
			</td>
		</tr>
		<tr>
			<td style="vertical-align:top;">
			**"Deleted"**
			</td>
			<td style="vertical-align:top;">
			An existing entity in cache that is marked for deletion.
			</td>
		</tr>
		<tr>
			<td style="vertical-align:top;">
			**"Detached"**
			</td>
			<td style="vertical-align:top;">
			An entity that is not in cache; its status in the database is unknown.
			</td>
		</tr>
	</tbody>
</table>

You can test the value of an EntityState enumeration by comparing its name with a string. Or you may prefer to test with the enumeration's properties and methods:

<pre class="brush:jscript;">
  var state = anEntity.entityAspect.entityState;
  if (state.name === "Modified") {/* ... */};             // ok
  if (state === breeze.EntityState.Modified) {/* ... */}; // better
  if (state.IsModified())  {/* ... */};                   // best
  if (state.IsAddedModifiedorDeleted())  {/* ... */};     // often useful
</pre>

###EntityState transitions

As things happen to an entity, Breeze updates its *EntityState* automatically. Here are before and after *EntityStates *for some of the most common actions:

<table border="0" cellpadding="0" cellspacing="0" width="480">
	<thead style="background-color: light-blue;">
		<tr>
			<td style="width: 100px; vertical-align: top;background-color:#d3d3d3;">**Before**</td>
			<td style="width: 280px; vertical-align: top;background-color:#d3d3d3;">**Action**</td>
			<td style="width: 100px; vertical-align: top;background-color:#d3d3d3;">**After**</td>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			 
			</td>
			<td style="vertical-align: top; width: 280px;">
			Entity materialized in cache by a query
			</td>
			<td style="vertical-align: top; width: 100px;">
			Unchanged
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			Unchanged
			</td>
			<td style="vertical-align: top; width: 280px;">
			Set one of its properties
			</td>
			<td style="vertical-align: top; width: 100px;">
			Modified
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			Modified
			</td>
			<td style="vertical-align: top; width: 280px;">
			Save it successfully
			</td>
			<td style="vertical-align: top; width: 100px;">
			Unchanged
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			Unchanged
			</td>
			<td style="vertical-align: top; width: 280px;">
			<a href="#DeleteEntity">Mark it deleted</a>
			</td>
			<td style="vertical-align: top; width: 100px;">
			Deleted
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			Deleted
			</td>
			<td style="vertical-align: top; width: 280px;">
			Save it
			</td>
			<td style="vertical-align: top; width: 100px;">
			Detached
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			 
			</td>
			<td style="vertical-align: top; width: 280px;">
			<a href="/doc-js/creating-entities" target="_blank">Create a new entity</a>
			</td>
			<td style="vertical-align: top; width: 100px;">
			Detached
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			Detached
			</td>
			<td style="vertical-align: top; width: 280px;">
			Add the new entity to the manager
			</td>
			<td style="vertical-align: top; width: 100px;">
			Added
			</td>
		</tr>
		<tr>
			<td style="vertical-align: top; width: 100px;">
			Added
			</td>
			<td style="vertical-align: top; width: 280px;">
			Delete it (or call *<a href="#RejectChanges">rejectChanges</a>*)
			</td>
			<td style="vertical-align: top; width: 100px;">
			Detached
			</td>
		</tr>
	</tbody>
</table>

Two state-changes may surprise you. If you mark an ***existing *entity** for deletion and save it successfully, the entity becomes detached. Breeze can't make the entity disappear; it may still be visible in the UI. But the entity no longer exists on the server so Breeze banishes it from its former *EntityManager *cache.

Deleting a ***new *entity** detaches it immediately. Breeze doesn't wait for you to call *saveChanges* which is pointless if you're discarding data that have never been saved.

###Detached entities

A detached entity does not belong to an *EntityManager*. It's still an entity; it's just not an entity in any cache.

A detached entities should not be used. Either attach it to an *EntityManager *or release all references to it ... and let it be garbage collected.

A detached entity is unreliable. It still has data values and you can still set them. But its <a href="/doc-js/navigation-properties" target="_blank">navigation properties</a> are not dependable and other entity features may behave unexpectedly. You can't tell by inspection whether a detached entity has corresponding data in remote storage.

New entities start as detached entities. You might have to create them where no *EntityManager *is available. More likely, you have to initialize some of the new entity's values before you can add it to an *EntityManager*. For example, because all entities in cache must have unique keys, if the entity key is client-determined (as opposed to store-generated), you must set the key to a unique value before you can attach the entity to an *EntityManager*.

You should initialize a new entity and then immediately add it to an *EntityManager  *... unless you have a very good reason to do otherwise.

Entities can become detached deliberately or as a side-effect of another action. The following actions detach an entity:

<ul>
	<li>explicitly removing it from its *EntityManager* (<code>manager.detachEntity(*anEntity*)</code>)
	<li>clearing its *EntityManager* (<code>manager.clear()</code>)
	<li>deleting a *new *entity
	<li>deleting an *existing *entity and then saving it successfully.
</ul>

Note that removing an entity from cache (detaching it) does not delete it. The data of a pre-existing detached entity remain in remote storage.

###Force an entityState change

You can change the *entityState *programmatically through one of the *EntityAspect *methods dedicated to that purpose.

<ul>
	<li>*setDeleted*()
	<li>*rejectChanges*()
</ul>

<ul>
	<li>*setModified*()
	<li>*setUnchanged*()
	<li>acceptChanges()
</ul>

Call *setDeleted*() to schedule an entity for deletion as discussed <a href="#DeleteEntity">below</a>.

Call *rejectChanges*() to cancel pending changes as discussed <a href="#RejectChanges">below</a>.

You rarely *see setModified,* *setUnchanged,* or *acceptChanges *in production code; production entities become "Modified" or "Unchanged" as a side-effect of application activity.

You are most likely to call these methods while setting up ***fake entities*** for automated tests because you want to force these fakes into a particular test state. The *setUnchanged* and *acceptChanges *methods also clear the *originalValues* hash map, erasing memory of prior values; you won't be able to revert these entities to their original values.

###<a name="DeleteEntity"></a> Deleting entities

Deleting an entity begins with an *EntityState* change. Call ***setDeleted()*** to mark an entity for deletion:


<pre class="brush:jscript;">
  someEntity.entityAspect.setDeleted(); // mark for deletion
</pre>

*<span class="codeword">setDeleted</span> *does not destroy the object locally nor does it remove the entity from the database. The entity simply remains in cache in a "Deleted" state ... as changed and added entities do ... until you save. A successful save deletes the entity from the database and removes it from cache.

###<a name="RejectChanges"></a>Cancel with *rejectChanges*

Once you've changed an entity, it stays in a changed state ... even if you manually restore the original values:


<pre class="brush:jscript;">
  var oldDescription = todo.Description(); // assume existing "Unchanged" entity
  todo.Description("Something new");       // entityState becomes "Modified"
  todo.Description(oldDescription);        // entityState is still "Modified"
</pre>

Call *rejectChanges *to cancel pending changes, revert properties to their prior values, and set the *entityState *to "Unchanged".


<pre class="brush:jscript;">
  var oldDescription = todo.Description();// assume existing "Unchanged" entity
  todo.Description("Something new");      // entityState becomes "Modified"
  todo.entityAspect.rejectChanges();      // entityState restored to "Unchanged"
                                          // todo.Description() === oldDescription
</pre>

You can also call *rejectChanges* on the EntityManager to cancel and revert pending changes for every entity in cache.

<pre class="brush:jscript;">
  manager.rejectChanges(); // revert all pending changes in cache
</pre>

###Original values

Breeze remembers the original property values when you change an existing entity. It stores these values in the *EntityAspect*'s ***originalValues***** **hash map. The *originalValues *hash is an empty object while the entity is in the "Unchanged" state. When you change an entity property for the first time, Breeze adds the pre-change value to the *originalValues* hash, using the property name as the key. The keys of the hash are the names of the properties that have been changed since the entity was last queried or saved.

Here's a function to get those keys:

<pre class="brush:jscript;">
  function getOriginalValuesPropertyNames(entity) {
      var names = [];
      for (var name in entity.entityAspect.originalValues) { names.push(name); }
      return names;
  }
</pre>

Breeze replaces *entityAspect.originalValues* with a new empty hash when any operation restores the entity to the "Unchanged" state. A successful save, *rejectChanges*, *setUnchanged*, and *acceptChanges *all reset the *originalValues* hash.

##<a name="PropertyChanged"></a>PropertyChanged event

Breeze creates entities in accordance with the model library you selected for your application. If you specified (or accepted) the default Knockout (KO) model library, the entity's properties are KO observables. You can <a href="http://knockoutjs.com/documentation/observables.html">subscribe</a> to individual KO property changes as in this example:


<pre class="brush:jscript;">
  entity.Name.subscribe(
      function (newValue) { /* ... */);});
</pre>

Each model library has its own property change subscription mechanism.

Breeze also has a *propertyChanged *event that supplements the model library offering. You can listen for a change to any Breeze-tracked entity property with a single subscription:


<pre class="brush:jscript;">
 entity.entityAspect.propertyChanged
       .subscribe(function (changeArgs) { /* ... */);});
</pre>

The properties of the *<span class="codeword">changeArgs</span>*<span class="codeword"> </span>are

<ul>
	<li>*entity *- the entity that changed
	<li>*propertyName *- the name of the property that changed
	<li>*oldValue *- the value before the property changed
	<li>*newValue *- the current property value.
</ul>

Capture the subscription token if you need to unsubscribe later.

<pre class="brush:jscript;">
  var token = entity.entityAspect.propertyChanged
                    .subscribe(function (changeArgs) { /* ... */);});
  // ... time passes ...
  entity.entityAspect.propertyChanged.unsubscribe(token);
</pre>

###Limitations

Breeze only monitors changes to properties identified in the metadata for this *EntityType*. These properties - mapped and unmapped - are the "*Breeze-tracked entity properties*" mentioned earlier. Breeze doesn't track properties that you add with an entity initialization function (see <a href="/doc-js/extending-entities">Extending Entities</a>) or that you patch into the entity later in its lifetime.

Nor does Breeze raise the *propertyChanged *event when an *EntityAspect *property changes. For example, the *propertyChanged *event does not fire when the <a href="#EntityState">*entityState*</a> changes.

> You can detect when the *entityState *changes ... using a technique to be described soon.

Breeze typically raises *propertyChanged *for each property individually. Some operations - such as queries, imports, saves, and *<a href="#RejectChanges">rejectChanges</a>* - update many properties at the same time. Breeze consolidates notification of these changes into a single *propertyChanged *event with a "null" property name. A subscriber learns that at least one property changed but can't know which particular properties changed; if this information is important to you, you'll have to indentify the affected properties in some out-of-band way (see *entityTests* module of the <a href="/samples/docode">DocCode teaching tests</a> for a suggestion).

##<a name="ValidateEntity"></a>ValidateEntity

Breeze properties aren't just observable. They can validate changes based on rules registered in metadata. Some of the validations are registered automatically based on information in the metadata. For example, a key property is automatically required. You can add your own custom validations as well. See the <a href="/doc-js/validation" target="_blank">Validation topic</a> for details.

In brief, Breeze evaluates validation rules at prescribed times. It can also validate on demand. Call the *entityAspect.validateEntity* to validate the entire entity which means every property validation rule as well as every entity-level validation rule. You can validate a single property (all of its rules) by calling *entityAspect.<a href="/doc-js/api-docs/classes/EntityAspect.html#method_validateProperty" target="_blank">validateProperty</a>*, passing in the name of the property and an optional context. Again, see the <a href="/doc-js/validation" target="_blank">Validation topic</a> for details.

A validation rule either passes or fails. If it passes, it returns null. If it fails, it returns a *<a href="/doc-js/api-docs/classes/ValidationError.html" target="_blank">ValidationError</a>* describing the problem.

Every *EntityAspect* maintains a *<span class="codeword">validationErrorsCollection</span>*. The Breeze validation engine adds a new *ValidationError *instance to that collection when a validation rules fails and removes an old *ValidationErrors* instance when its associated validation rule passes.

You can't access the inner *<span class="codeword">validationErrorsCollection</span>* directly. You can get a copy of its contents by calling *entityAspect*.*<a href="/doc-js/api-docs/classes/EntityAspect.html#method_getValidationErrors" target="_blank">getValidationErrors</a>*. You can also add to or remove *validationError*s from the *<span class="codeword">validationErrorsCollection</span>* programmatically with the *EntityAspect *methods, *<a href="/doc-js/api-docs/classes/EntityAspect.html#method_addValidationError" target="_blank">addValidationError</a>* and *<a href="/doc-js/api-docs/classes/EntityAspect.html#method_removeValidationError" target="_blank">removeValidationError</a>*.

Breeze raises the *EntityAspect*'s ***<span class="codeword">validationErrorsChanged</span> ***event when *ValidationErrors* are added or removed from the entity's *<span class="codeword">validationErrorsCollection</span>*; you can subscribe to that event:


<pre class="brush:jscript;">
  entity.entityAspect
       .validationErrorsChanged.subscribe(handleValidationErrorChanged);
</pre>

Breeze calls the handler with an *<span class="codeword">errorsChangedArgs</span> *that tells you what property changed, the *ValidationErrors *that were added, and the *ValidationErrors * that were removed.

##<a name="EntityMiscellany"></a>Entity miscellany

This last category is a small menagerie of miscellaneous *EntityAspect *members

<ul>
	<li>***entity* **- a backward reference to the entity that holds this *EntityAspect*
	<li>***entityManager ***- the *EntityManager *to which this entity is attached ... or was attached. It's null if the entity is new and not yet added to a manager.
	<li>***getKey* **- a function returning the entity's *<a href="/doc-js/api-docs/classes/EntityKey.html" target="_blank">EntityKey</a>*. A key is an object that uniquely identifies the entity in cache and in remote storage. The key is not a simple JavaScript value. It's an object the identifies the type of the entity and the value ... or values ... of the key; Breeze supports entities with composite keys.
	<li>***isBeingSaved* **- a property that returns *true *if this entity is one in a batch of entities being saved and the save operation is still in progress. Your application may need to prevent further changes to the entity until the save operation completes, successfully or not.
	<li>***loadNavigationProperty* **- you can download related entities, on demand, by calling *loadNavigationProperty *as described in the <a href="/doc-js/navigation-properties" target="_blank">Navigation Properties</a> topic.
</ul>

#Breeze properties on the entity itself

You typically access the breeze entity infrastructure through the *entityAspect* property. Breeze also injects a few more entity-oriented members into the model object's prototype. These members are visible on the entity's surface API.

***entityType ***- a property that returns the Breeze <a href="/doc-js/api-docs/classes/EntityType.html" target="_blank">type information object</a>, metadata describing this type of entity.

<pre class="brush:jscript;">
  var customerType = manager.metadataStore.getEntityType("Customer");
  var customer = customerType.createEntity();
  // customer.entityType === customerType 
</pre>

***getProperty ***- a function that returns the value of a property
***setProperty ***- a function that sets a property value

<pre class="brush:jscript;">
  var setName = "Ima Something Corp";
  customer.setProperty("CompanyName", setName);
  var getName = customer.getProperty("CompanyName");
  // getName === setName
</pre>

With *getProperty *and *setProperty*, you can write utilities to access the properties of any Breeze entity. The model library won't matter. An entity could be implemented with the Knockout model library, the backbone model library, the angular model library, or a custom model library. Each library has its own distinctive property accessor methodology. You can ignore these differences.

The *setProperty *function follows the same code path as the model library property accessor and will raise property change events, change the entity state, and trigger validation accordingly. Note that calling setProperty with an 'invalid' propertyName, i.e. one that does NOT have an associated DataProperty or NavigationProperty, will result in model library specific behavior. 

***_$interceptor*** - a Breeze internal function; please leave it alone.
