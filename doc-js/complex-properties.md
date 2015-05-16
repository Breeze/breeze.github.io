---
layout: doc-js
---
<h1>
	Complex Type properties</h1>
<p>Breeze supports the concept that any data property of an Entity can be an instance of a <strong><em>complex type</em></strong>. A <span class="codeword">complexType</span> property is a data property that represents a defined collection of other data Properties and possibly nested complex type properties. An example might be a <span class="codeword">location</span> property on a <span class="codeword">Customer</span> class, where the location consists of an address, city, state, and zip code. In this case, the <span class="codeword">location</span> property on the <span class="codeword">Customer</span> type is termed a complex property, and the data type of this property would be a complex type of type <span class="codeword">location</span>. The path to a city in this case would be <span class="codeword">aCustomer.location.city</span>.</p>
<p>Complex types in Breeze are much like entity type&rsquo;s but with some key differences.</p>
<ul>
	<li>
		Complex types do not have identities (key properties in breeze) and therefore cannot exist independently. Complex types can only exist as properties on entity types or other complex types.
		<ul style="list-style-type:circle;">
			<li>
				This is actually slightly incorrect, you can create an &lsquo;unbound&rsquo; instance of a complexType with the <span class="codeword">complexType.createInstance</span> method but when you assign it, you are simply copying its values onto an existing instance.</li>
		</ul>
	</li>
	<li>
		Complex types cannot contain navigation properties or foreign key data properties.</li>
	<li>
		Complex type properties, <span class="codeword">aCustomer.location</span> in the example above, are not nullable and are automatically created when their parent entity or complex object is created. Note that <strong>any</strong> of the properties of the complex type instance itself ( that are not themselves complex types) <strong>may</strong> be nullable.</li>
	<li>
		When instances of a complex type are assigned, the contents of the <span class="codeword">complexType</span> instance are copied to the target.&nbsp; Complex types are not assigned by reference.&nbsp;</li>
</ul>
<p>Every instance of a complex type object has two properties automatically added by Breeze:</p>
<ol>
	<li>
		A <a href="http://www.breezejs.com/sites/all/apidocs/classes/ComplexType.html" target="_blank">complexType </a>property&nbsp; &ndash; This is the type metadata for the specific complex type that describes this object. A <span class="codeword">complexType</span> property is analogous to the <span class="codeword">entityType</span> property on Breeze entities.</li>
	<li>
		A <a href="http://www.breezejs.com/sites/all/apidocs/classes/ComplexAspect.html" target="_blank">complexAspect </a>property&nbsp; &ndash; This contains information about the &lsquo;parentage&rsquo; of this instance and any original values for change tracking purposes. The <span class="codeword">complexAspect</span> is analogous to the <span class="codeword">entityAspect</span> property on every Breeze entities.</li>
</ol>
<h2>
	Interactions involving Complex types</h2>
<p><strong>Query/Save</strong></p>
<ul>
	<li>
		Queries can return <span class="codeword">ComplexTypes</span> and <span class="codeword">ComplexType</span> properties can be queried, i.e. <span class="codeword">EntityQuery.from(&quot;Customer&quot;).where(&quot;location.city&quot;, &quot;startsWith&quot;, &quot;A&quot;)</span></li>
	<li>
		Entities containing complex types may be saved.</li>
</ul>
<p><strong>Property paths</strong></p>
<ul>
	<li>
		<span class="codeword">EntityAspect.PropertyChanged</span> and <span class="codeword">EntityManager.EntityChanged</span> events return &quot;property paths&quot; whenever a property of an embedded complex type is modified. i.e. <span class="codeword">location.city</span>.</li>
</ul>
<p><strong>MetadataStore changes</strong></p>
<ul>
	<li>
		<span class="codeword">getEntityType</span>, <span class="codeword">getEntityTypes</span>, <span class="codeword">addEntityType</span>, <span class="codeword">registerEntityTypeCtor</span> all either take or return <span class="codeword">ComplexType</span> instances in addition to <span class="codeword">EntityType</span> instances.</li>
	<li>
		<span class="codeword">EntityTypes</span> may be distinguished from <span class="codeword">ComplexTypes</span> by using <span class="codeword">aType instanceof EntityType</span> or <span class="codeword">aType instanceof ComplexType</span></li>
</ul>
<p><strong>Validation changes</strong></p>
<ul>
	<li>
		Validating an entity validates all of the properties, including complex type properties of an entity</li>
	<li>
		Validating a complex type property involves validating all of its properties.</li>
	<li>
		Property level validation errors involving complex type properties include the &quot;property path&quot; to the errant property.</li>
</ul>
