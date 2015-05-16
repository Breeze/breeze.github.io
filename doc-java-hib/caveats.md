---
layout: doc-java-hib
---

## Caveats and Limitations
#### Foreign Keys Must Be Mapped

Unlike Hibernate itself, Breeze requires foreign keys that are mapped to object properties so Breeze can maintain the relationships on the client side. Here's an example, mapping a relationship from Order to Customer:

	<many-to-one name="Customer" column="`CustomerID`" class="Customer" />
	<property name="CustomerID" type="System.Guid" insert="false" update="false" />

The "Customer" property is mapped normally, while the "CustomerID" property is mapped with `insert="false"` and `update="false"`. This way, the CustomerID is exposed to Breeze, but Hibernate will perform inserts and updates using the ID of the Customer object itself.

##### Possible Fix?
Foreign keys are required on the client for Breeze to work. They are also required to 
re-connect the entities on the server during the SaveChanges processing.  However, we
should be able to generate the keys automatically, without having to map them in the 
model.  Our plan is to:

1. Create necessary foreign key properties in the metadata where they don't exist in the real model. These would be marked as "synthetic" somehow ('$' prefix, special property, etc).
2. During the JSON serialization process, populate the synthetic foreign keys from the related entities or Hibernate proxies.
3. During the JSON deserialization process (when saving), carry the synthetic foreign key information along with the entity, so it can be used to re-establish relationships or create Hibernate proxies.

Note that this is closely tied to the JSON serialization process.

#### Limitations

Currently, `breeze-hibernate` supports the entire spectrum breeze query and save capabilities with the exception of:

1. breeze server side functions i.e. The 'month' function in the following predicate:  
    > { where: { 'month(birthDate)': { gt: 3}}}

2. projections of collection properties. i.e. the 'orders' property below.
    > { where: { companyName: { startsWith: 'B'  } }, select: 'orders' }
    

