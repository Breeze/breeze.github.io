---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/.html"
---

# Metadata 

Metadata is used heavily by the Breeze.sharp client to determine the 'shape'; of the entities that it will manage as well as the relationships between these entities. Data validation rules and mechanisms for translating server-side data onto the client may also be specified as metadata.

This metadata represents a combination of information gleaned from reflecting within your assemblies for .NET CLR information on types that implement the *IEntity* or *IComplexObject* interfaces in conjunction with data ( usually) returned from a server as a result of a call to the Breeze *MetadataStore.FetchMetadata* method. This call is made automatically by Breeze just before it attempts to perform it's first query against a remote service (unless it is specifically directed not to). The metadata returned from the server as a result of this call may be in one of the following JSON formats.

1. 	If using the Breeze **WebApi** 'dataService' adapter (the default)
   	- A JSON object that adheres to the Breeze Metadata JSON schema described below.
 	- **OR** a Microsoft EDMX (CSDL) document serialized as JSON. Such a document is available for any Entity Framework DbContext or ObjectContext instance and is also available for a variety of other Microsoft products such as Sharepoint.     
1. 	If using the Breeze **OData** 'dataService' adapter.
	-  An OData Metadata document - per the OData specification. This format requires the use of the Breeze OData 'dataService' adapter.

Breeze metadata can also be described on the client via either of two methods:
> In conjunction with the standard Breeze reflection of .NET assemblies containing implementations of IEntity and IComplexObject types). 

1.  Usage of the Breeze fluent configuration api (calls to the *EntityTypeBuilder* class)  
1. **OR** by passing a JSON object that adheres to the schema described below into the *MetadataStore.ImportMetadata* method. This is the same format that is returned by any call to the *MetadataStore.ExportMetadata* method.

As a result of this capability, Web services that are not under the developer's control can be consumed and the data returned can be converted into fully capable breeze entities by performing the following two steps: 

1. Define the metadata for the entities returned by the selected web service api. 
1. Define a *JsonResultsAdapter* that describes how the results from the web service can be converted into entities. 

*Note that even if both of these steps are skipped, any web service call will still return data to the breeze client.  It's just that in this case, the results returned will not be treated as entities.* 

## Metadata from the server ##

Ideally, a Breeze.sharp application can get metadata from a server by calling the Breeze *MetadataStore.FetchMetadata* method.

Breeze fetches metadata automatically just before performing its first remote service query (unless you specifically told it not to). The metadata returned from the server may be in one of the following JSON formats.

 - When using the Breeze **WebApi** *dataService* adapter (the default), the format is either:

    -  A Microsoft EDMX (CSDL) document serialized as JSON. Such a document is available for any Entity Framework *DbContext* or *ObjectContext* instance and is also available for a variety of other Microsoft products such as SharePoint.

    - A **Breeze Metadata Format** object as described below.

- When using the Breeze **OData** *dataService* adapter, the format is an OData Metadata document per the <a href="http://www.odata.org/docs/" target="_blank">OData specification</a>. Remember to <a href="/documentation/odata">configure Breeze with the OData *dataService * adapter</a>.
	

## The unhelpful server ##

Many web services don't provide metadata and include little-to-no type information in their JSON payloads. You can't change this if it's not your service.

You can always retrieve data from such services. Breeze won't mind. But remember, Breeze can't turn the incoming data into entities unless
 
+ (a) it has metadata and 
+ (b) the data are self-describing in terms of those metadata.

Breeze won't know what to do with data from a service that arrives looking like this:


> [{Id: 1, Name: 'blue' }, {Id: 2, Name: 'red' }]

You may know that this is a list of two <code>Color </code>entities. Breeze doesn't.

You may be OK with this in which case you can tell Breeze to convert this data into an instance of an anonymous type, but... 

The result will NOT be be **entities**. Breeze won't cache them, track their changes, validate them, etc. Breeze is acting only as an HTTP retrieval mechanism and no more.

Alternatively, you can retrieve data **as entities** from such services with two-step client-side configuration:

+ Define the entity metadata for the objects returned by the web service.
+ Write a *JsonResultsAdapter* that tells Breeze how to convert the JSON from the web service into the entities defined in step #1.


For example, in Step #1 we define the `Color` entity type in metadata. In Step #2, we tell Breeze how to recognize; `{Id: 1, Name: 'blue'}` as an instance of the <code>Color </code>entity type.

In this topic we'll discuss step #1 - define metadata on the client. Step #2 - write the *JsonResultsAdapter*- is covered elsewhere.

## Metadata defined on the client ##

There are two ways to define metadata on the client:

+ By configuring a *MetadataStore* programmatically though a series of fluent metadata configuration API calls ( using the *EntityTypeBuilder* class) 
+ By importing a *Breeze Metadata Format* object into a *MetadataStore* via its *ImportMetadata* method. This is the same format returned by the *MetadataStore.ExportMetadata* method.


# Metadata classes #


Breeze uses Metadata to describe the shape of the objects that it manages.  These objects fall into two categories:

+ Top level objects are represented as Breeze *entities*. 
+ Embedded objects are represented as Breeze *complex objects*. 

#### EntityType ###
An *entity*'s metadata is described by an **EntityType**. This metadata includes:

+ A collection of **DataProperties**
+ A collection of **NavigationProperties**.   
+ An EntityKey definition; this is the property or properties that uniquely identify a 'key' for the entity.     
+ Information about whether keys for entities of this type should be generated automatically on the server and if so, how?  

Every entity in Breeze has an 'entityType' property that contains a reference to the **EntityType** that describes it.

### ComplexType ###
The *complex object*'s metadata is described by a **ComplexType**. This metadata includes:
   
+  A collection of Breeze **DataProperties**.
+ ( Breeze does not YET support NavigationProperties within a ComplexType)

Note that a ComplexType does not define a key.  This is the primary distinction between ComplexTypes and EntityTypes. 

Every complex object in Breeze has a 'complexType' property that contains a reference to the ComplexType that describes it. 


#### The NavigationProperty
A Breeze **NavigationProperty** consists of the metadata for a property on the entity that will return instances of other entities. This metadata includes:

+ The EntityType of the related entity or entities.
+ Whether this property returns a single entity or an array of other entities.
+ Whether this property is nullable.
+ Information about any foreign key that is related to this property.
+ Any registered validations associated with this property. 

Breeze uses NavigationProperty metadata to automatically link related entities based on the foreign keys.

#### The DataProperty ####

A Breeze **DataProperty** consists of the metadata for a property that will return either anything that is NOT an entity.  Therefore a DataProperty is used to describe any property that returns any of the following. 
 
- A Primitive type, i.e. a string, a number, a date, a boolean etc. 
- An array of Primitive types.
- A ComplexType 
- An array of ComplexTypes.    

Note: Because most SQL databases do not support the concept of a column containing a collection of data,  DataProperties that return arrays are usually only found in applications working against NoSQL databases.    

The metadata for a DataProperty includes:

- The DataType type of the property. i.e. whether it is a string, number, boolean etc.
- The ComplexType, if applicable, of the objects that this property returns.
- Whether this property returns a single object or an array of objects.
- Whether this property is nullable. (only applicable to primitive types).
- Any registered validations associated with this property.


### Generate Breeze Metadata Format from an export ###

Remember that *MetadataStore.ExportMetadata* can export metadata as a string in the Breeze Metadata Format. You can capture that format to file and, presto, you have metadata in an easily portable form.

Suppose

+ you want to read an existing service that doesn&#39;t produce metadata
+ you don't want to use the MetadataStore API for defining metadata in code
+ you are willing to &quot;fake the service&quot; by defining an Entity Framework model for it, as if you owned the service and had implemented it as a SQL database fronted by EF.


Put on your cleverness hat. Create that fake service with a fake Web API controller that does nothing more than return Metadata generated by the Breeze.NET *EFContextProvider* 

### Metadata API to support "custom" annotations. - Under construction ##

   > ** Not yet fully implemented in Breeze.Sharp - but coming soon. **

   While the metadata that Breeze needs for its own internal processes are well defined, there is often the need for an application to have its own "custom" metadata as well.  Often this metadata will be associated with an existing Metadata structure, such as an EntityType, ComplexType, DataProperty or NavigationProperty.  

   This is such a common requirement that Breeze supports the concept via the ability to attach "custom" properties to each of these structures. In particular:

   + The *MetadataStore.ImportMetadata* method supports "custom" nodes at the entity and property levels. 
 
      1. Breeze native metadata may contain a single "custom" node for each EntityType, ComplexType, DataProperty or NavigationProperty node. 
      2. A subset of Breeze native metadata format that only includes node "keys" and "custom" elements is also supported with the "allowMerge" parameter. (see example below)
      	+ This capability is ONLY supported if the "allowMerge" parameter to the *ImportMetadata* method is set to **true**. (The default is false). 
      	+ The "key" for an EntityType or a ComplexType is the combination of the "namespace" and "shortName" nodes.
		+ The "key" for a DataProperty or a NavigationProperty is just the "name" node ( and the fact that the property is embedded within an EntityType or ComplexType node.)
      3. "Custom" metadata may be any serializable javascript object. i.e. roundtripable via *JSON.stringify* and *JSON.parse*.)


   + The *MetadataStore.ExportMetadata* method will automatically include any custom metadata within the store.
    
   + The *MetadataStore.addEntityType* method supports "custom" nodes on both the entity and property level. 
   
   + For the *EntityType*, *ComplexType*, *DataProperty* and *NavigationProperty* classes:
      1. All constructors accept a "custom" config node. 
      1. The *setProperties* method accepts a "custom" config node.
      1. All custom metadata is accessible via a "custom" property.
            

## Examples

### Importing just custom metadata into an existing store.
       
> 		var customMetadata = {
            "structuralTypes": [{
                "shortName": "Customer",
                "namespace": "myNamespace",
                "dataProperties": [ { 
                    "nameOnServer": "CustomerID",
                    "custom": {                      
                        "description": "This customer's Id", 
                        "nestedDp": { 
                            "displayName": "Customer Id"
                        }
					}
                }, {
                    "name": "companyName",
                    "custom": {
                         "description": "The name of this company",
                         "moreInfo": {
                            hasServerValidation: true,
                            "defaultLocale": "en-gb"
 						 }
                    }
                } ],
                "navigationProperties": [  {
                    "name": "orders",
                    "custom": {
					    "description": "The orders for this customer", navigation property",
                        "nestedNp": {
                            x: 3,
                            y: 4
                            z: 7
                        }						
                    }  
                } ],
                "custom": {               
                   "description": "A customer"
                   "nestedXXX": {
					  jsonInterceptorName: "foo",
                   }
                }
            }]
        };
        myEntityManager.metadataStore.importMetadata(customMetadata, true);
