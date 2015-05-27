---
layout: doc-js
redirect_from: "/old/documentation/.html"
---
# Metadata 

Metadata is used heavily by the Breeze JavaScript client to determine the &#39;shape&#39; of the entities that it will manage as well as the relationships between these entities. Data validation rules and mechanisms for translating server-side data onto the client may also be specified as metadata.

This metadata is usually returned from a server as a result of a call to the Breeze *MetadataStore.fetchMetadata* method. This call is made automatically by Breeze just before it attempts to perform it's first query against a remote service (unless it is specifically directed not to). The metadata returned from the server as a result of this call may be in one of the following JSON formats.

1. 	If using the Breeze **WebApi** 'dataService' adapter (the default)
   	- A JSON object that adheres to the Breeze Metadata JSON schema described below.
 	- **OR** a Microsoft EDMX (CSDL) document serialized as JSON. Such a document is available for any Entity Framework DbContext or ObjectContext instance and is also available for a variety of other Microsoft products such as Sharepoint.     
1. 	If using the Breeze **OData** 'dataService' adapter.
	-  An OData Metadata document - per the OData specification. This format requires the use of the Breeze OData 'dataService' adapter.

Breeze metadata can also be described completely on the client via either of two methods: 

1. By making a series of *MetadataStore.addEntityType* and *MetadataStore.addComplexType* method calls. 
1. **OR** by passing a JSON object that adheres to the schema described below into the *MetadataStore.importMetadata* method. This is the same format that is returned by any call to the *MetadataStore.exportMetadata* method.

As a result of this capability, Web services that are not under the developer's control can be consumed and the data returned can be converted into fully capable breeze entities by performing the following two steps: 

1. Define the metadata for the entities returned by the selected web service api. 
1. Define a *JsonResultsAdapter* that describes how the results from the web service can be converted into entities. 

*Note that even if both of these steps are skipped, any web service call will still return data to the breeze client.  It's just that in this case, the results returned will not be treated as entities.* 

## Metadata from the server ##

Ideally, a BreezeJS application can get metadata from a server by calling the Breeze *MetadataStore.fetchMetadata* method.

Breeze fetches metadata automatically just before performing its first remote service query (unless you specifically told it not to). The metadata returned from the server may be in one of the following JSON formats.


 - When using the Breeze **WebApi** *dataService* adapter (the default), the format is either:


    A Microsoft EDMX (CSDL) document serialized as JSON. Such a document is available for any Entity Framework <em>DbContext </em>or <em>ObjectContext </em>instance and is also available for a variety of other Microsoft products such as SharePoint.

    A <em><strong>Breeze Metadata Format </strong></em>object as described below.

	When using the Breeze **OData** *dataService* adapter, the format is an OData Metadata document per the <a href="http://www.odata.org/docs/" target="_blank">OData specification</a>. Remember to <a href="/doc-js/server-odata.html">configure Breeze with the OData *dataService * adapter</a>.
	

## The unhelpful server ##

Many web services don't provide metadata and include little-to-no type information in their JSON payloads. You can't change this if it's not your service.

You can always retrieve data from such services. Breeze won't mind. But remember, Breeze can't turn the incoming data into entities unless
 
+ (a) it has metadata and 
+ (b) the data are self-describing in terms of those metadata.

Breeze won't know what to do with data from a service that arrives looking like this:


> [{Id: 1, Name: &quot;blue&quot;}, {Id: 2, Name: &quot;red&quot;}]

You may know that this is a list of two <code>Color </code>entities. Breeze doesn't.

You may be OK with this. Breeze will forward these data to the caller *"as is"*

They will be simple JavaScript objects, **not entities**. Breeze won't cache them, track their changes, validate them, etc. Breeze is acting only as an HTTP retrieval mechanism and no more.

Alternatively, you can retrieve data **as entities** from such services with two-step client-side configuration:

+ Define the entity metadata for the objects returned by the web service.
+ Write a *JsonResultsAdapter* that tells Breeze how to convert the JSON from the web service into the entities defined in step #1.


For example, in Step #1 we define the <code>Color </code>entity type in metadata. In Step #2, we tell Breeze how to recognize; <code>{Id: 1, Name: &quot;blue&quot;}</code> as an instance of the <code>Color </code>entity type.

In this topic we'll discuss step #1 - define metadata on the client. Step #2 - write the <code>JsonResultsAdapter </code>- is covered elsewhere.

## Metadata defined on the client ##

There are two ways to define metadata on the client:

+ By configuring a <em>MetadataStore </em>programmatically though a series of *MetadataStore* API calls such as *addEntityType* and *addComplexType*
+ By importing a *Breeze Metadata Format* object into a *MetadataStore* via its *importMetadata* method. This is the same format returned by the *MetadataStore.exportMetadata* method.


We describe programming the MetadataStore elsewhere; you may wish to refer to the <a href="/doc-js/api-docs/classes/MetadataStore.html" target="_blank">MetadataStore API documentation</a> as well. This topic concentrates on the definition of *Breeze Metadata Format*.

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
+ Any registered validations associated with this property.


## Metadata API to support "custom" annotations. ##

   While the metadata that Breeze needs for its own internal processes are well defined, there is often the need for an application to have its own "custom" metadata as well.  Often this metadata will be associated with an existing Metadata structure, such as an EntityType, ComplexType, DataProperty or NavigationProperty.  

   This is such a common requirement that Breeze supports the concept via the ability to attach "custom" properties to each of these structures. In particular:

   + The *MetadataStore.importMetadata* method supports "custom" nodes at the entity and property levels. 
 
      1. Breeze native metadata may contain a single "custom" node for each EntityType, ComplexType, DataProperty or NavigationProperty node. 
      2. A subset of Breeze native metadata format that only includes node "keys" and "custom" elements is also supported with the "allowMerge" parameter. (see example below)
      	+ This capability is ONLY supported if the "allowMerge" parameter to the *importMetadata* method is set to **true**. (The default is false). 
      	+ The "key" for an EntityType or a ComplexType is the combination of the "namespace" and "shortName" nodes.
		+ The "key" for a DataProperty or a NavigationProperty is just the "name" node ( and the fact that the property is embedded within an EntityType or ComplexType node.)
      3. "Custom" metadata may be any serializable javascript object. i.e. roundtripable via *JSON.stringify* and *JSON.parse*.)


> 	  MetadataStore.proto.importMetadata = function (exportedMetadata, [allowMerge = false])

   + The *MetadataStore.exportMetadata* method will automatically include any custom metadata within the store.
    
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

### Calling MetadataStore.addEntityType with custom metadata.

   This example assumes the existence of *makeCustomTypeAnnot* and *makeCustomPropAnnot* methods that each create a serializable javascript object.

>      var store = new MetadataStore();
>      var eto = {}
>      eto.shortName = "type1";
>      eto.namespace = "mod1";
>      eto.dataProperties = new Array();
>      eto.autoGeneratedKeyType = breeze.AutoGeneratedKeyType.Identity;
>      eto.custom = makeCustomTypeAnnot("type1");

>      var dpo = {};
>      dpo.name = "id";
>      dpo.dataType = breeze.DataType.Int32;
>      dpo.isNullable = false;
>      dpo.isPartOfKey = true;
>      dpo.custom = makeCustomPropAnnot("id");

>      var dp = new breeze.DataProperty(dpo);
>      eto.dataProperties.push(dp);           

>      var et = new breeze.EntityType(eto);
>      store.addEntityType(et);

### Using "custom" in the constructor's config arg: 

>      var dp = new DataProperty({
>         "name: "Id",
>         "dataType": breeze.DataType.Int32,
>         "isNullable" false,
>         "isPartOfKey": true
>         "custom" {
>             "foo": "fooValue", 		             
>             "bar": {
>                x: 3,
>                y: 14,
>                canShow: true
>             }  
>         }
>      });

### Accessing custom metadata

>      var customerType = myEntityManager.metadataStore.getEntityType("Customer")
>      var customerCustomMetadata = customerType.custom;
>      var companyNameProp = customerType.getProperty("companyName");
>      var companyNameCustomMetadata = companyNameProp.custom;


### Generate Breeze Metadata Format from an export ###

Remember that <a href="/doc-js/api-docs/classes/MetadataStore.html#method_exportMetadata" target="_blank"><em>MetadataStore.exportMetadata</em></a> exports metadata as a string in the Breeze Metadata Format. You can capture that format to file and, presto, you have metadata in an easily portable form.

Suppose

+ you want to read an existing service that doesn&#39;t produce metadata
+ you don&#39;t want to use the MetadataStore API for defining metadata in code
+ you are willing to &quot;fake the service&quot; by defining an Entity Framework model for it, as if you owned the service and had implemented it as a SQL database fronted by EF.


Put on your cleverness hat. Create that fake service with a fake Web API controller that does nothing more than return Metadata generated by the Breeze.NET <code>EFContextProvider</code>.&nbsp; [TO BE CONTINUED]</p>
