---
layout: doc-js
redirect_from: "/old/documentation/.html"
---
#
	Complex Type properties
Breeze supports the concept that any data property of an Entity can be an instance of a ***complex type***. A <span class="codeword">complexType</span> property is a data property that represents a defined collection of other data Properties and possibly nested complex type properties. An example might be a <span class="codeword">location</span> property on a <span class="codeword">Customer</span> class, where the location consists of an address, city, state, and zip code. In this case, the <span class="codeword">location</span> property on the <span class="codeword">Customer</span> type is termed a complex property, and the data type of this property would be a complex type of type <span class="codeword">location</span>. The path to a city in this case would be <span class="codeword">aCustomer.location.city</span>.
Complex types in Breeze are much like entity type's but with some key differences.
<ul>
	<li>
		Complex types do not have identities (key properties in breeze) and therefore cannot exist independently. Complex types can only exist as properties on entity types or other complex types.
		<ul style="list-style-type:circle;">
			<li>
				This is actually slightly incorrect, you can create an 'unbound' instance of a complexType with the <span class="codeword">complexType.createInstance</span> method but when you assign it, you are simply copying its values onto an existing instance.
		</ul>
	
	<li>
		Complex types cannot contain navigation properties or foreign key data properties.
	<li>
		Complex type properties, <span class="codeword">aCustomer.location</span> in the example above, are not nullable and are automatically created when their parent entity or complex object is created. Note that **any** of the properties of the complex type instance itself ( that are not themselves complex types) **may** be nullable.
	<li>
		When instances of a complex type are assigned, the contents of the <span class="codeword">complexType</span> instance are copied to the target.&nbsp; Complex types are not assigned by reference.&nbsp;
</ul>
Every instance of a complex type object has two properties automatically added by Breeze:

	<li>
		A <a href="/doc-js/api-docs/classes/ComplexType.html" target="_blank">complexType </a>property&nbsp; &ndash; This is the type metadata for the specific complex type that describes this object. A <span class="codeword">complexType</span> property is analogous to the <span class="codeword">entityType</span> property on Breeze entities.
	<li>
		A <a href="/doc-js/api-docs/classes/ComplexAspect.html" target="_blank">complexAspect </a>property&nbsp; &ndash; This contains information about the 'parentage' of this instance and any original values for change tracking purposes. The <span class="codeword">complexAspect</span> is analogous to the <span class="codeword">entityAspect</span> property on every Breeze entities.

##
	Interactions involving Complex types
**Query/Save**
<ul>
	<li>
		Queries can return <span class="codeword">ComplexTypes</span> and <span class="codeword">ComplexType</span> properties can be queried, i.e. <span class="codeword">EntityQuery.from("Customer").where("location.city", "startsWith", "A")</span>
	<li>
		Entities containing complex types may be saved.
</ul>
**Property paths**
<ul>
	<li>
		<span class="codeword">EntityAspect.PropertyChanged</span> and <span class="codeword">EntityManager.EntityChanged</span> events return "property paths" whenever a property of an embedded complex type is modified. i.e. <span class="codeword">location.city</span>.
</ul>
**MetadataStore changes**
<ul>
	<li>
		<span class="codeword">getEntityType</span>, <span class="codeword">getEntityTypes</span>, <span class="codeword">addEntityType</span>, <span class="codeword">registerEntityTypeCtor</span> all either take or return <span class="codeword">ComplexType</span> instances in addition to <span class="codeword">EntityType</span> instances.
	<li>
		<span class="codeword">EntityTypes</span> may be distinguished from <span class="codeword">ComplexTypes</span> by using <span class="codeword">aType instanceof EntityType</span> or <span class="codeword">aType instanceof ComplexType</span>
</ul>
**Validation changes**
<ul>
	<li>
		Validating an entity validates all of the properties, including complex type properties of an entity
	<li>
		Validating a complex type property involves validating all of its properties.
	<li>
		Property level validation errors involving complex type properties include the "property path" to the errant property.
</ul>
