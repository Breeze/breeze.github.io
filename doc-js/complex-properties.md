---
layout: doc-js
redirect_from: "/old/documentation/complextype-properties.html"
---
# Complex Type properties

Breeze supports the concept that any data property of an Entity can be an instance of a ***complex type***. A `complexType` property is a data property that represents a defined collection of other data Properties and possibly nested complex type properties. An example might be a `location` property on a `Customer` class, where the location consists of an address, city, state, and zip code. In this case, the `location` property on the `Customer` type is termed a complex property, and the data type of this property would be a complex type of type `location`. The path to a city in this case would be `aCustomer.location.city`.
Complex types in Breeze are much like entity type's but with some key differences.

- Complex types do not have identities (key properties in breeze) and therefore cannot exist independently. Complex types can only exist as properties on entity types or other complex types.
	
	- This is actually slightly incorrect, you can create an 'unbound' instance of a complexType with the `complexType.createInstance` method but when you assign it, you are simply copying its values onto an existing instance.


- Complex types cannot contain navigation properties or foreign key data properties.

- Complex type properties, `aCustomer.location` in the example above, are not nullable and are automatically created when their parent entity or complex object is created. Note that **any** of the properties of the complex type instance itself ( that are not themselves complex types) **may** be nullable.

- When instances of a complex type are assigned, the contents of the `complexType` instance are copied to the target.&nbsp; Complex types are not assigned by reference.&nbsp;

Every instance of a complex type object has two properties automatically added by Breeze:

- A <a href="/doc-js/api-docs/classes/ComplexType.html" target="_blank">complexType </a>property - This is the type metadata for the specific complex type that describes this object. A `complexType` property is analogous to the `entityType` property on Breeze entities.

- A <a href="/doc-js/api-docs/classes/ComplexAspect.html" target="_blank">complexAspect </a>property - This contains information about the 'parentage' of this instance and any original values for change tracking purposes. The `complexAspect` is analogous to the `entityAspect` property on every Breeze entities.

## Interactions involving Complex types

**Query/Save**

- Queries can return `ComplexTypes` and `ComplexType` properties can be queried, i.e. `EntityQuery.from("Customer").where("location.city", "startsWith", "A")`

- Entities containing complex types may be saved.

**Property paths**

- `EntityAspect.PropertyChanged` and `EntityManager.EntityChanged` events return "property paths" whenever a property of an embedded complex type is modified. i.e. `location.city`.

**MetadataStore changes**

- `getEntityType`, `getEntityTypes`, `addEntityType`, `registerEntityTypeCtor` all either take or return `ComplexType` instances in addition to `EntityType` instances.

- `EntityTypes` may be distinguished from `ComplexTypes` by using `aType instanceof EntityType` or `aType instanceof ComplexType`

**Validation changes**

- Validating an entity validates all of the properties, including complex type properties of an entity

- Validating a complex type property involves validating all of its properties.

- Property level validation errors involving complex type properties include the "property path" to the errant property.

