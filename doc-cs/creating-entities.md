---
layout: doc-cs
---

# Complex Type properties

Breeze supports the concept that any data property of an Entity can be an instance of a complex type. A complexType property is a data property that represents a defined collection of other data Properties and possibly nested complex type properties. An example might be a location property on a Customer class, where the location consists of an address, city, state, and zip code. In this case, the location property on the Customer type is termed a complex property, and the data type of this property would be a complex type of type location. The path to a city in this case would be 

      aCustomer.Location.City.

Complex types in Breeze are much like entity type’s but with some key differences.

- Complex types do not have identities (key properties in breeze) and therefore cannot exist independently. Complex types can only exist as properties on entity types or other complex types.
    - This is actually slightly incorrect, you can create an ‘unbound’ instance of a complexType with the complexType.createInstance method but when you assign it, you are simply copying its values onto an existing instance.
- Complex types cannot contain navigation properties or foreign key data properties.
- Complex type properties, aCustomer.Location in the example above, are **not** nullable and are automatically created when their parent entity or complex object is created. Note that any of the properties of the complex type instance itself ( that are not themselves complex types) may be nullable.
- When instances of a complex type are assigned, the contents of the complexType instance are copied to the target.  Complex types are not assigned by reference. 

Every instance of a complex type object has a ComplexAspect property automatically added by Breeze:

- The ComplexAspect property  – This contains information about the ‘parentage’ of this instance and any original values for change tracking purposes. The ComplexAspect is analogous to the EntityAspect property on every Breeze entity.

### Interactions involving Complex types

#### Query/Save

Queries can return ComplexTypes and ComplexType properties can be queried, i.e.

     EntityQuery.From<Customer>().Where(c => c.Location.City.StartsWith("A");

Entities containing complex types may be saved.

#### Property paths

IEntity.PropertyChanged and EntityManager.EntityChanged events return "property paths" whenever a property of an embedded complex type is modified. i.e. Location.City.

#### MetadataStore methods

Analagous to the *EntityTypes* property and the *GetEntityType* method, the MetadataStore also has a *ComplexTypes* property and a *GetComplexType* method. 

Both *EntityType* and *ComplexType* classes extend the *StructuralType* abstract class.  The *StructuralType* class implements an *IsEntityType* property that will return 'true' for EntityTypes and 'false' for ComplexTypes.

#### Validation 

Validating an entity validates all of the properties, including complex type properties of an entity

Validating a complex type property involves validating all of its properties.
Property level validation errors involving complex type properties include the "property path" to the errant property.