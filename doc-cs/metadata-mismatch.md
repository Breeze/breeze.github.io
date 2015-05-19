---
layout: doc-cs
---

Handling Mismatched Metadata
============================

In some applications, the metadata used on the client may not match exactly that provided by the server.  This might occur for example, if the client uses entities that do not define all of the properties of the corresponding server entities.  By default, Breeze requires that client and server metadata match *exactly* and throws if a mismatch is detected, but it also provides options to selectively allow several types of mismatches.

##The **AllowedMetatdataMismatchTypes** Property##

In Breeze, metadata is managed by the **MetadataStore** instance associated with every **EntityManager**.  The **AllowedMetatdataMismatchTypes** property of **MetadataStore** is a bitwise enumeration (**MetadataMismatchTypes**) that allows certain types of mismatches to be permitted.

###Allowable Mismatches###

The following types of mismatches may be selectively allowed:

**MissingCLREntityType** An entity type defined on the server is not defined on the client.  Instances of the entity type received from the server will be ignored.

**MissingCLRComplexType** A complex type defined on the server is not defined on the client.  Occurrences of this type will be ignored.

**MissingCLRDataProperty** A data property of an entity defined on the server is not present in the client's definition of the entity.  Values received for the property will be ignored.

**MissingCLRNavigationProperty** A navigation property of an entity defined on the server is not present in the client's definition of the entity.  

The above values may be "OR-ed" together to allow multiple types of mismatches.

**AllAllowable** is a convenience definition that allows all of the above four mismatches.

###Unallowable Mismatches###

The following types of mismatches are detected but may *not* be allowed; Breeze will **always** throw when they are encountered.

**InconsistentCLRPropertyDefinition** A property of an entity is defined as different types on the client and server.  This is considered a mismatch even if the two types are compatible or assignable from one another.

**InconsistentCLRTypeDefinition** Some fundamental part of this CLRType does not match between client and server.
 
**MissingCLRNamingConvention** Currently under development.

##The **MetadataMismatch** Event

The **MetadataStore** class also exposes the MetadataMismatch event that is called once for every mismatch detected (whether allowed by setting one or more of the flags described above or not) prior to throwing any exception.  The event argument provides information about the mismatch:

**MetatdataMismatchType** The type of mismatch that was detected.

**StructuralTypeName** The name of the missing entity or complex type or the name of the entity with a missing property.

**StructuralTypeInfo** Supplies facilities for identifying the entity or complex server type that is missing on the client.

**PropertyName** The name of the server property that is missing in the client model.

**Detail Supplies** more detailed information about the mismatch.

In addition the boolean **Allow** property may be set to **true** by the event handler to allow an otherwise disallowed mismatch or **false** to disallow a mismatch that is allowed by the **AllowedMetadataMismatchTypes** property.

##Example##

The server for the Todo sample app defines a **TodoItem** entity in the **Todo.Models** namespace.  We use a client model for the **TodoItem** entity that models only the **Id** and **Description** properties (and is defined in a different namespace):

	namespace Test_NetClient_Misc
	{
	    // Namespace must be unique to prevent TodoItem type from being ambiguous in other test classes
	    // Use local partial version of TodoItem
	    public class TodoItem : Breeze.Sharp.BaseEntity
	    {
	        public int Id {
	            get { return GetValue<int>(); }
	            set { SetValue(value); }
	        }
	
	        public string Description {
	            get { return GetValue<string>(); }
	            set { SetValue(value); }
	        }
	    }
	}

In this code fragment, we set up and query **TodoItem**s from a local Todo service, mapping between namespaces and allowing an incomplete model on the client.  All property and type mismatches are allowed, but an event handler is used to disallow missing navigation properties on the **TodoItem** entity type only.

    Configuration.Instance.ProbeAssemblies(typeof(TodoItem).Assembly);
    var entityManager = new EntityManager(_todosServiceName);

	// Map between client and server namspaces
    entityManager.MetadataStore.NamingConvention = new NamingConvention().WithClientServerNamespaceMapping("Test_NetClient_Misc", "Todo.Models");

    // Allow use of a partial model
    entityManager.MetadataStore.AllowedMetadataMismatchTypes = MetadataMismatchType.AllAllowable;

    // Attach an anonymous handler to the MetadataMismatch event
    entityManager.MetadataStore.MetadataMismatch += (s, e) =>
	        {
	            // Log the mismatch
	            var message = string.Format("{0} : Type = {1}, Property = {2}, Allow = {3}",
			                                e.MetadataMismatchType, e.StructuralTypeName, e.PropertyName, e.Allow);
	            Console.WriteLine(message);
	
	            // Disallow missing navigation properties on the TodoItem entity type
	            if (e.MetadataMismatchType == MetadataMismatchType.MissingCLRNavigationProperty &&
	                e.StructuralTypeName.StartsWith("TodoItem")) {
	                e.Allow = false;
	            }
	        };
	await new EntityQuery<TodoItem>().Execute(entityManager);
