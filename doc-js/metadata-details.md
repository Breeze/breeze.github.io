---
layout: doc-js
redirect_from: "/old/documentation/details.html"
---
# Metadata 

The Breeze client needs metadata to determine the shape of the entities that it will manage as well as the relationships among these entities. Data validation rules and mechanisms for translating server-side data onto the client may also be specified as metadata.

Metadata is typically returned from a server as a result of a call to the Breeze `MetadataStore.fetchMetadata` method. Breeze calls this method automatically just before it attempts its first query to a remote service.

>You can call it yourself or tell Breeze not to call it. 

The metadata returned from the server as a result of a `fetchMetadata` call may be in one of the following JSON formats.

1. 	If using the Breeze **WebApi** DataService adapter (the default)
   	
    - a JSON object that adheres to the Breeze Metadata JSON schema described below **OR** 
 	
	- a Microsoft EDMX (CSDL) document serialized as JSON. Such a document is available for any Entity Framework DbContext or ObjectContext instance and is also available for a variety of other Microsoft products such as Sharepoint. 
 	    
1. 	If using the Breeze **OData** DataService adapter, an OData Metadata document per the OData specification. This format requires the use of the Breeze OData DataService adapter.

When the remote data service is not under the developer's control, we can define the metadata on the client via either of two methods: 

1. Make a series of `MetadataStore.addEntityType` and `MetadataStore.addComplexType` method calls. <br/><br/>
1. Pass a JSON object that adheres to the schema described below into the `MetadataStore.importMetadata` method. This is the same format that is returned by any call to the `MetadataStore.exportMetadata` method.

With the metadata defined, Breeze can convert data returned from the server into fully capable Breeze entities.

>This assumes Breeze can match the server data to the metadata. You may have to define a `JsonResultsAdapter` that correlates server data with the types defined in your metadata, a subject [covered elsewhere](http://breeze.github.io/doc-js/server-jsonresultsadapter.html).

## Metadata from the server

Ideally, a BreezeJS application can get metadata from a server by calling the Breeze `MetadataStore.fetchMetadata` method.

Breeze fetches metadata automatically just before performing its first remote service query (unless you specifically told it not to). The metadata returned from the server may be in one of the following JSON formats.


- A Microsoft **EDMX (CSDL) document** serialized as XML returned by a Breeze WebApi 2 DataService adapter (the default). Such a document is available for any Entity Framework `DbContext` or `ObjectContext` instance and is also available for a variety of other Microsoft products such as SharePoint.

- A **Breeze Metadata Format** object as described below.

- An **OData Metadata document** per the <a href="http://www.odata.org/docs/" target="_blank">OData specification</a> returned by a Breeze **OData** DataService adapter. Remember to [configure Breeze with the OData *DataService* adapter](/doc-js/server-odata.html) before calling the OData service.
	

## The unhelpful server

Many web services don't provide metadata and include little-to-no type information in their JSON payloads. You can't change this if it's not your service.

You can always retrieve data from such services. Breeze won't mind. But remember, Breeze can't turn the incoming data into entities unless it has metadata for them and can recognize the raw data as entity types defined by that metadata.

Breeze won't know what to do with data from a service that arrives looking like this:

    [{"Id": 1, "Name": "blue"}, {"Id": 2, "Name": "red"}]

You may know that this is a list of two `Color` entities. Breeze doesn't. Breeze will simply forward these data to the caller *"as is"* without turning them into `Color` entities. 

They will be simple JavaScript objects, **not entities**. Breeze won't cache them, track their changes, validate them, etc. Breeze is acting only as an HTTP retrieval mechanism and no more.

Alternatively, you can retrieve data **as entities** from such services with two-step client-side configuration:

1. Define the entity metadata for the objects returned by the web service.
1. Write a `JsonResultsAdapter` that tells Breeze how to convert the JSON from the web service into the entities defined in step #1.


For example, in Step #1 we define the `Color` entity type in metadata. In Step #2, we tell Breeze how to recognize JSON data in the form `{"Id": 1, "Name": "blue"}` as an instance of the `Color` entity type.

In this topic we'll discuss step #1 - define metadata on the client. Step #2 - write the `JsonResultsAdapter` - is [covered elsewhere](http://breeze.github.io/doc-js/server-jsonresultsadapter.html).

## Metadata defined on the client

There are two ways to define metadata on the client:

1. Configure a *MetadataStore* programmatically though a series of `MetadataStore` API calls such as `addEntityType` and `addComplexType`
1. Import a *Breeze Metadata Format* object into a `MetadataStore` via its `importMetadata` method. This is the same format returned by the `MetadataStore.exportMetadata` method.


We describe programming the `MetadataStore` elsewhere; you may wish to refer to the <a href="/doc-js/api-docs/classes/MetadataStore.html" target="_blank">MetadataStore API documentation</a> as well. This topic concentrates on the definition of *Breeze Metadata Format*.

# Metadata classes


Breeze uses Metadata to describe the shape of the objects that it manages.  These objects fall into two categories:

1. Top level objects are represented as Breeze *entities*. 
2. Embedded objects are represented as Breeze *complex objects*. 

#### EntityType
An *entity*'s metadata is described by an **`EntityType`**. This metadata includes:

+ A collection of `DataProperties`
+ A collection of `NavigationProperties`.   
+ An `EntityKey` definition; this is the property or properties that uniquely identify a 'key' for the entity.     
+ Information about whether keys for entities of this type should be generated automatically on the server and if so, how?  

Every entity in Breeze has an `entityType` property that contains a reference to the **`EntityType`** that describes it.

### ComplexType ###
The *complex object*'s metadata is described by a **`ComplexType`**. This metadata includes:
   
+  A collection of Breeze `DataProperties`.
+ ( Breeze does not YET support `NavigationProperties` within a ComplexType)

>Note that a `ComplexType` does not define a key.  This is the primary distinction between a `ComplexType` and an `EntityType`. 

Every complex object in Breeze has a `complexType` property that contains a reference to the `ComplexType` definition that describes it. 

#### The DataProperty

A Breeze **`DataProperty`** consists of the metadata for a property that returns a simple value.  A `DataProperty` can return any of the following. 
 
- A Primitive type, i.e. a string, a number, a date, a boolean etc. 
- An array of Primitive types.
- A `ComplexType` 
- An array of `ComplexType` instances.    

>Note: Because most SQL databases do not support the concept of a column containing a collection of data,  DataProperties that return arrays are usually only found in applications that persist to NoSQL databases.    

The metadata for a `DataProperty` includes:

- The `DataType` type of the property. i.e. whether it is a string, number, boolean etc.
- The `ComplexType`, if applicable, of the objects that this property returns.
- Whether this property returns a single object or an array of objects.
- Whether this property is nullable. (only applicable to primitive types).
+ Any registered validations associated with this property.

#### The NavigationProperty

A Breeze **`NavigationProperty`** consists of the metadata for a property on the entity that can return instances of one or more related entities. This metadata includes:

+ The `EntityType` of the related entity or entities.
+ Whether this property returns a single entity or an array of other entities.
+ Whether this property is nullable.
+ Information about any foreign key that is related to this property.
+ Any registered validations associated with this property. 

Breeze uses `NavigationProperty` metadata to automatically link related entities based on the foreign keys.

## Metadata API to support custom annotations

While the metadata that Breeze needs for its own internal processes are well defined, an application may have its own "custom" metadata as well.  Often this metadata will be associated with an existing Metadata structure, such as an `EntityType`, `ComplexType`, `DataProperty` or `NavigationProperty`.  

This is such a common requirement that Breeze allows you to attach "custom" metadata properties to each of these structures. 

The `MetadataStore.importMetadata` method supports custom nodes at both the entity and property levels. 
 
- Breeze native metadata may contain a single "custom" node for each `EntityType`, `ComplexType`, `DataProperty` or `NavigationProperty` node.<br/><br/> 
- A subset of Breeze native metadata format that only includes node "keys" and "custom" elements is also supported with the `allowMerge` parameter: `metadataStore.importMetadata(customMetadata, true);`. See [example below](#importCustomMetadata).
  
	+ This capability is ONLY supported if the second, `allowMerge` parameter to the `importMetadata` method is set to `true` (The default is `false`). 
	
	+ The "key" for an `EntityType` or a `ComplexType` is the combination of the "namespace" and "shortName" nodes.
	
	+ The "key" for a `DataProperty` or a `NavigationProperty` is just the "name" node (and the fact that the property is embedded within an `EntityType` or `ComplexType` node.)
	
- "Custom" metadata may be any serializable javascript object (i.e, an object that is roundtripable via `JSON.stringify` and `JSON.parse`.)

The `MetadataStore.exportMetadata` method automatically includes any custom metadata within the store.

The `MetadataStore.addEntityType` method supports "custom" nodes on both the entity and property level. 
   
For the `EntityType`, `ComplexType`, `DataProperty` and `NavigationProperty` classes:

  - all constructors accept a "custom" config node. 
  - the *setProperties* method accepts a "custom" config node.
  - all custom metadata is accessible via a "custom" property.
            

## Examples

<a name="importCustomMetadata"></a>

### Importing custom metadata into an existing store.
       
	var customMetadata = {
		structuralTypes: [{
			shortName: 'Customer',
			namespace: 'Model',
			dataProperties: [ { 
				nameOnServer: 'CustomerID',
				custom: {                      
					description: 'This customer\'s Id', 
					nestedDp: { 
						displayName: 'Customer Id'
					}
				}
			}, {
				name: 'companyName',
				custom: {
					 description: 'The name of this company',
					 moreInfo: {
						hasServerValidation: true,
						defaultLocale: 'en-gb'
					 }
				}
			} ],
			navigationProperties: [{
				name: 'orders',
				custom: {
					description: 'The orders for this customer navigation property',
					nestedNp: {
						x: 3,
						y: 4
						z: 7
					}						
				}  
			}],
			custom: {               
			   description: 'A customer'
			   nestedProperty: {
				  jsonInterceptorName: 'foo',
			   }
			}
		}]
	};

    // import with `allowMerge` parameter set `true`
	myEntityManager.metadataStore.importMetadata(customMetadata, true);

### Defining a *DataProperty* with a custom extension 

	var idProp = new breeze.DataProperty({
		name: 'id',
		dataType: breeze.DataType.Int32,
		isNullable: false,
		isPartOfKey: true
	    custom: {
		   foo: 'fooValue', 		             
		   bar: {
		        x: 3,
			    y: 14,
			    canShow: true
		    }  
		}
	});

### Calling *MetadataStore.addEntityType* with custom metadata.

This example assumes you wrote `makeCustomTypeAnnotation` and `makeCustomPropAnnotation` methods that each create a serializable JavaScript object.

	var store = new breeze.MetadataStore();
	
	// 'id' DataProperty w/ custom property annotation
	var idProp = new breeze.DataProperty({
	    name: 'id',
	    dataType: breeze.DataType.Int32,
	    isNullable: false,
	    isPartOfKey: true,
	    custom: makeCustomPropAnnotation('id')
	});
	
	// entity type w/ one property ('id') and
	// a custom entity-level annotation
	var et = new breeze.EntityType({
	    shortName: 'MyType',
	    namespace:  'Model',
	    dataProperties: [idProp],
	    autoGeneratedKeyType: breeze.AutoGeneratedKeyType.Identity,
	    custom: makeCustomTypeAnnotation('MyType')
    });      

	store.addEntityType(et);


### Accessing custom metadata

	var customerType = entityManager.metadataStore.getEntityType('Customer')
	var customerCustomMetadata = customerType.custom;
	var companyNameProp = customerType.getProperty('companyName');
	var companyNameCustomMetadata = companyNameProp.custom;

### Generate Breeze Metadata Format from an export

Remember that <a href="/doc-js/api-docs/classes/MetadataStore.html#method_exportMetadata" target="_blank">`MetadataStore.exportMetadata`</a> exports metadata as a string in the Breeze Metadata Format. You can capture that format to file and, presto, you have metadata in an easily portable form.

Suppose

+ you want to read an existing service that doesn't produce metadata
+ you don't want to use the MetadataStore API for defining metadata in code
+ you are willing to *fake the service* by defining an Entity Framework model for it, as if you owned the service and had implemented it as a SQL database fronted by EF.


Put on your cleverness hat. Create that fake service with a fake Web API controller that does nothing more than return Metadata generated by the Breeze.NET `EFContextProvider`.

[TO BE CONTINUED]
