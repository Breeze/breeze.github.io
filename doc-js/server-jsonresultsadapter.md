---
layout: doc-js
---

# JsonResultsAdapters

After a successful query or save (`EntityManager.executeQuery` or `EntityManager.saveChanges`), Breeze transforms the JSON data from the server into entities. We call this process "materialization".

The **JsonResultsAdapter** is a key player in this transformation.

## From JSON to Entity (dreamland)

In an ideal world, the JSON data for a "Person" would so perfectly align with the shape of the `Person` entity on the client that Breeze could blindly copy the JSON property values into the correspondingly named `Person` entity properties.

    // pseudo-code
    var personEntity = new Person({
		firstName: personJson.firstName,
        lastName:  personJson.lastName,
        ...
	});

Sadly, the real world isn't always that simple.

## Transforming property names

Sometimes it's *almost* that simple. Maybe the property names differ in some predictable way ... as when the property names are **CamelCase on the server** and **pascalCase on the client**. Such property name transforms are so common that Breeze offers the [**NamingConvention**](naming-convention) for just that purpose.  

You can create your own convention and make it the default:

    // create a convention and make it the default
    myNamingConvention.setAsDefault();

There is even a for the Pascal-camel case scenario: `NamingConvention.camelCase`.

    breeze.NamingConvention.camelCase.setAsDefault();

Unfortunately, it isn't quite this simple either.

## JsonResultsAdapter

The real world can get messy. Here's the kind of JSON that you might see returned from a query for salereps and their orders.

	[
	  {
		$id: "1",
		$type: "Models.Person, Models",
		PersonID: 42,
		FirstName: "Nancy",
		LastName: "Davolio",
		Title: "Sales Representative",
		HireDate: "1992-05-01T00:00:00.000",
		Orders: [
		  {
			$id: "2",
			$type: "Models.Order, Models",
			OrderID: 10258,
			CustomerID: "a3246674-7989-415b-93ec-59c1c8dbe320",
			PersonID: 42,
			OrderDate: "1996-07-17T00:00:00.000",
			Freight: 142.51,
			Person: {
				$ref: "1"
			}
		  },
		  ... more Orders ...
		]
	  },
	  ... more Persons ...
	]

This is sort-of, kind-of aligned with the shape of client-side entities but not exactly.

We humans can figure it out. We see this to be an array of data for `Person` entities. Each one has an "Orders" property returning a nested array of data for `Order` entities. 

Most of the data properties match up pretty well (except that they're in PascalCase and the entity properties are spelled in camelCase).

A few of them ($id, $type, $ref) aren't entity properties at all. We might guess (correctly) that they are serialization artifacts to help us reconstruct entities on the client. The "$type" property, for example, tells us what kind of entity we're dealing with (`Person` or `Order`). The "$id" is an object counter (not an entity's ID). The "$ref" property in the `Order.Person` data is a reference to the counter of a previously seen object in the result set. In this example, the nested `Order.Person` property with "$ref:1" points back to its parent earlier in the set, the "Nancy Davolio" person object with "$id:1".

*We* get it. But Breeze is just a machine. It can't guess what "$id", "$type", and "$ref" mean. It couldn't deduce that the "FirstName" property from the server is known as "firstName" here on the client. *Breeze needs a little help*.

That help comes in the form of a **JsonResultsAdapter**, a component that converts such ***inbound*** JSON entity data into a form that guides Breeze when it maps these data into entities.

The *JsonResultsAdapter* provides fine grained, programmatic control over the raw data arriving from the server ... before those data become entity property values. It is a powerful interception tool and it is often used *in conjunction with the* `NamingConvention` to translate raw query and save result data into the entities.

>The *JsonResultsAdapter* does **not** handle the ***outbound*** conversion of entity data into to the JSON save request body. That's the responsibility of [*DataServiceAdapter*'s `saveChanges`](dataserviceadapters#saveChanges), specifically the **\_prepareSaveBundle** method.

While you can always write your own adapter [as explained below](#jra-interface), Breeze ships with several adapters, any of which may be sufficient for your needs.

### Native breeze JsonResultsAdapters

Some data service APIs send JSON in a predictable format. 

OData services send predictable JSON. So do many services that are configured for easy consumption by Breeze clients, such as

* ASP.Net Web API Controllers (whose Json.Net serialization options are configured "just right")
* Breeze Web API Controllers
* Breeze MongoDb servers
* Breeze Node/Sqlize servers
* Ruby-on-Rails servers (that serialize "just right")
* SharePoint 2013 OData services

Where are these *JsonResultsAdapters*?  **They're tucked away inside the *dataServiceAdapters*** that [correspond to these service technologies](talking-server#breeze-dataserviceadapters)!

### JsonResultsAdapters and DataServiceAdapters

A [**DataServiceAdapter**](dataserviceadapters) handles the details of communication between the Breeze client and the remote data server.

The *DataServiceAdapter* is responsible for the two Breeze operations, query and save, that receive JSON data and materialize the data as entities. So the *DataServiceAdapter* is the obvious home for a *JsonResultsAdapter* that prepares the JSON data for materialization.

Accordingly every *DataServiceAdapter*, including each native Breeze adapter, implements `DataServiceAdapter.jsonResultsAdapter` and this is the adapter Breeze will use by default to muscle JSON into entities during query and save.

    // get the jsonResultsAdapter from the current default dataServiceAdapter instance
    var dsa = breeze.config.getAdapterInstance('dataService');
    var jra = dsa.jsonResultsAdapter;

What if you if you like a particular *DataServiceAdapter* but its  native *JsonResultsAdapter* doesn't quite meet your needs? 

Write a new *JsonResultsAdapter* ([as explained below](#jra-interface)), and use that one instead.

There are at least four ways to substitute your *jsonResultsAdapter* (jra) for the default implementation in a *dataServiceAdapter*. Here they are in increasing order of difficulty and utility:


1. "Monkey patch" the *dataServiceAdapter* itself.

        // get the current default dataServiceAdapter instance
        var dsa = breeze.config.getAdapterInstance('dataService');

        // replace the jsonResultsAdapter for this and every future instance
        dsa.prototype.jsonResultsAdapter = myJsonResultsAdapter; 

    >You've changed the jra for every use of this *dataServiceAdapter* in your app.

1. Specify your adapter in the `DataService` object that you use to initialize your `EntityManager`

        var dataService = new DataService( {
           serviceName: 'api/foo';,
           jsonResultsAdapter: myJsonResultsAdapter
        });
        var manager = new EntityManager({dataService: dataService})

    >When you need to change the jra for one particular remote service while your other remote services retain the original jra.
    
1. Tell a query to use your adapter.

        var query = new EntityQuery('Customers').using(myJsonResultsAdapter);

    >When you need a specialized jra for a particular query. Useful when every query endpoint has a unique JSON response, making it too difficult to write a single jra for all possible queries.

1. Create your own derived *dataServiceAdapter* and override its *jsonResultsAdapter*

    This is a bit involved. We recommend that you put the such code in its own script.

        // Suppose we like the 'webApi' dataServiceAdapter so we'll derive from it
        // get its constructor function
        var dsaBase = breeze.config.getAdapter('dataService', 'webApi');

        // create the derived dataServiceAdapter constructor
        function myDsa() {
            breeze.core.extend(this, new dsaBase()); // only copies instance stuff
            this.name = 'myDsa';                     // new dataServiceAdapter name
        }
        // inherit from dsaBase
        breeze.core.extend(myDsa.prototype, dsaBase.prototype);
        myDsa.prototype.constructor = myDsa;

        // override the base jsonResultsAdapter
        myDsa.prototype.jsonResultsAdapter = myJsonResultsAdapter;

        // register the new dsa with Breeze and make it the default instance
        breeze.config.registerAdapter('dataService', myDsa);
        breeze.config.initializeAdapterInstance('dataService', 'myDsa');

   >When you'll re-use this *dataServiceAdapter* version in multiple apps.

<a name='jra-interface'></a>
## Before you write your own ...
We strongly recommend that you review a few examples before trying to write your own *JsonResultsAdapter*.

The <a href="/samples/edmunds">Edmunds sample</a> includes [a  simple *JsonResultsAdapter*](https://github.com/Breeze/breeze.js.samples/blob/master/no-server/edmunds/app/jsonResultsAdapter.js "github: Edmunds jsonResultsAdapter") that converts JSON results for just two queries of the *Edmunds Vehicle Information Service*.

The *DataServiceAdapters* in the [breeze core](https://github.com/Breeze/breeze.js/tree/master/src "github: breeze core") and [breeze-labs](https://github.com/Breeze/breeze.js.labs "github:breeze labs") github repositories contain good examples of complete *JsonResultsAdapters*; &nbsp;look for any JavaScript file with "*.dataservice*" in its name.

## JsonResultsAdapter interface

Every *JsonResultsAdapter* is an instance of the [**breeze.JsonResultsAdapter**](http://www.breezejs.com/sites/all/apidocs/classes/JsonResultsAdapter.html#method_%3Cctor%3E%20JsonResultsAdapter "API Doc: JsonResultsAdapter").

    var myJsonResultsAdapter = new breeze.JsonResultsAdapter(config);

This `JsonResultsAdapter` constructor function takes a configuration object with the following properties:

   - **name** [required]: The name of the adapter, e.g., `'myJsonResultsAdapter'`.

   - **extractResults**(*data*) [optional]: A function that extracts the entity data from the JSON web service response payload and returns this data to the adapter for subsequent processing.
 
     In the default implementation, the entity data are presumed to be in the `results` property of the payload. 

        function extractResultsDefault(data) {
            return data.results;
        }
   
    The returned value may be a single object (called a "node") or an array of objects ("nodes"). Each node is potentially an object graph with nested nodes.

   - **visitNode**(*node*, *mappingContext*, *nodeContext*)  [required]: A function that operates on the node(s) returned by the `extractResults` method. Breeze calls `visitNode` for each node. Then `visitNode` returns information to guide Breeze's subsequent recursive processing of that node and its child nodes. 
   
    The `visitNode` method is the heart of the adapter.


### The `visitNode` method

The `visitNode` method takes 3 parameters and returns a single object hash. Breeze uses the hash to determine how to process the node, potentially creating an entity from the node data and merging that entity into the `EntityManager`.

#### Method parameters:

- **node** - the visited node which is a JavaScript object.

- **mappingContext** - A `MappingContext` instance that describes the top-level operation to be performed along with other data. 
 
    >This `MappingContext` has the same structure as the mapping context parameter of the [`dataServiceAdapter.executeQuery`](dataserviceadapters#executeQuery) method. 
                   
   - **query**: The `EntityQuery` that produced this data or *null* if they come from a `saveChanges` response. 
   - **entityManager**: The `EntityManager` processing this query/save.
   - **dataService**: The `DataService` instance at the time of request.
   - **mergeOptions**: Options to control how the result of this query/save should be merged into the current EntityManager. It has the following properties:
         - **mergeStrategy**: A `MergeStrategy` (e.g, `PreserveChanges`).
         - **noTracking**: A `boolean` indicating whether 'noTracking' was specified. Default must be `false`.
         - **includeDeleted**: An optional `boolean` indicating whether 'deleted' entities should be returned. Default must be `false`.

- **nodeContext** - Information about the current node.
 
    Every `nodeContext` has a `nodeType` property that reports where the node came from. 

    The remaining `nodeContext` properties vary by `nodeType`.

    <style>
      td { vertical-align:top; 
           padding: 12px 4px !important;}
      th { background-color:#99CCFF;
           padding: 8px 4px !important;}
    </style>
	<table>
		<tbody>
			<tr>
				<th><em>nodeType</em></th>
				<th>Description</th>
				<th>Other Properties</th>
			</tr>
			<tr>
				<td>&quot;root&quot;</td>
				<td>top-level, root node</td>
				<td><em>no properties</em></td>
			</tr>
			<tr>
				<td>&quot;anonProp&quot;</td>
				<td>node returned by an anonymous node's scalar property.</td>
				<td><strong>propertyName</strong>: The name of the scalar property.</td>
			</tr>
			<tr>
				<td>&quot;anonPropItem&quot;</td>
				<td>node in the array returned by an anonymous node's array property.</td>
				<td><strong>propertyName</strong>: The name of the array property.</td>
			</tr>
			<tr>
				<td>&quot;navProp&quot;</td>
				<td>node returned by an entity node's scalar navigation property.</td>
				<td><strong>navigationProperty</strong>: The <code><a href="http://www.breezejs.com/sites/all/apidocs/classes/NavigationProperty.html" target="_blank" title="API: NavigationProperty">NavigationProperty</code></a>.</td>
			</tr>
			<tr>
				<td>&quot;navPropItem&quot;</td>
				<td>node in the array returned by an entity node's navigation array property.</td>
				<td><strong>navigationProperty</strong>: The <code><a href="http://www.breezejs.com/sites/all/apidocs/classes/NavigationProperty.html" target="_blank" title="API: NavigationProperty">NavigationProperty</code></a>.</td>
			</tr>
		</tbody>
	</table>
	</li>

    A node is a **top-level node** if it is *the* object returned by `extractResults` or an object in *the array* returned by `extractResults`.

    A node is either an **entity node** (a node associated with a known `EntityType`) or an **anonymous node** as determined by the `visitNode` method.

    Breeze walks each node property. 

    - If that property returns a **single object**, that object becomes a node and is passed to `visitNode`. It's a **navProp** node if the parent object is an entity node; it's an **anonProp** if the parent object is an anonymous node.

    - If the property returns an **array**, Breeze inspects each item in that array. If the item is an object, that object becomes a node and is passed to `visitNode`. It's a **navPropItem** node if the parent object is an entity node; it's an **anonPropItem** if the parent object is an anonymous node.

    This node-tree walk continues until Breeze has visited every property of every node.

#### Return value:

The `visitNode` method returns a hash that provides additional information about the current node. The hash may contain any of the following properties:

  - **`entityType`** (optional): the metadata `EntityType` for this node. When set, the node becomes an **entity node**. If this property is missing, null, or undefined, the node is an **anonymous** node. 
 
    Setting the `entityType` is perhaps the most important task of the `visitNode` method. Here's how you might do it:

        var meta = mappingContext.entityManager.metadataStore;
        var type = typeName && meta.getEntityType(typeName, true);
        var result = {};
        if (type) { result.entityType = type; }
        ... other stuff ...
        return result;

     How do we determine the `typeName`? That can be easy or difficult. It's easy when the type name was sent by the server as a property of the node (e.g., `node.$type`):

        var typeName = meta.normalizeTypeName(node.$type);

     If your server isn't that helpful, you'll have to write code to derive or infer the `EntityType` from the node and/or the `mappingContext`.

  - **nodeId** (optional): The node's serialization id.

    The same object may be represented several times in the payload. The full object data could be repeated in the JSON data each time and that redundancy can bloat the payload significantly. 
  
    Some JSON serializers can reduce the bloat by serializing the object just once, assigning a unique serialization id, and subsequently referring to that first instance by its serialization id.

    For example, given an array with the same person listed twice, a server's serializer might have produced:

	
        [{
          '$id': '1',
          'Name': 'James',
          'BirthDate': '1983-03-08T00:00Z',
         },
         {
          '$ref': '1'
        }]

    >This is the format produced by the Json.NET serializer.
    
    The *JsonResultsAdapter* supports this approach with its own `nodeId` and `nodeRefId` properties.

    Given the above JSON, our `visitNode` method should set the `nodeId` for the first node like so:

        result.nodeId = node.$id;
	
  - **nodeRefId** (optional): a reference to the serialization id of another node. 

    Continuing with the previous example, for the second "Person" node we'd write:

        result.nodeRefId = node.$ref;
    
    Nodes can arrive in any order. Breeze might encounter a *nodeRefId* before the object with the corresponding *nodeId*. Breeze defers resolution of such references until after traversing the entire top level graph.

  - **ignore** (boolean optional, default false): the entire node (and all of its subnodes) will not be processed.

        // ignore a node returned by any property that begins with '$'
        var propertyName = nodeContext.propertyName;
        var ignore = propertyName && propertyName.substr(0, 1) === "$";
 
  - **node**: (optional) you can replace the entire node with another by setting this property.

  - **passThru** (boolean optional, default false):  return an anonymous node intact without ANY further processing.  (avail in breeze versions > v 1.5.4)

    By default Breeze processes and copies each node's properties recursively. Set to `true` if you want to skip processing of an **anonymous node** and simply return it in the results *as is*. This flag is ignored for *entity nodes*.

<a name="nodeChange"></a>
#### Changing the node itself

When the `visitNode` method returns, Breeze takes action based on

* the method result (the hash properties we just discussed ... most importantly the `entityType` )
* the node property values 
* contextual info (the `mappingContext` and `nodeContext`).

When visiting an **anonymous** node, Breeze processes each node property recursively and copies the results to a like-named property of a *new* object. This new object is returned to the caller. However, if `passThru ===  true`, Breeze skips this step and simply returns the node itself *as is*. What (if anything) you do to the node within the `visitNode` method is entirely up to you.
  
When visiting an **entity node**, Breeze copies "known" properties (properties registered in metadata) from the node to the corresponding properties of an **entity** object. Unrecognized properties are ignored. 

In general, you don't do anything to an entity node as its properties tend to align with the metadata property definitions for that `EntityType`. But you might change node property names or values if Breeze couldn't simply copy them to the entity object. For example, you might rename one node property and set another property value based on local information:

    node.Foo = node.Bar; // the node 'Bar' property should actually be the entity 'Foo' property
    delete node.Bar;
    node.LastRetrieved = Date.now();

Three important considerations for **entity nodes**:

1. Use the **server-side property name spelling**, *not* the client-side spelling.  Breeze applies the active `NamingConvention` when translating node property values to entity property values. If the server sends PascalCase and  the active `NamingConvention` converts property names to camelCase on the client, be sure to specify a PascalCase  name (e.g.,  `node.Foo`, not `node.foo`). Do this for both *mapped* and *unmapped* properties.

    It follows that you should not re-name node properties if the `NamingConvention` can do it for you. In the `node.Foo = node.Bar` example, we must be trying to fix something that the `NamingConvention` couldn't handle.

1. Breeze **ignores an entity node property that it can't find** in metadata *either* as a *mapped* or *unmapped* property.
 
    We presumably re-mapped the `Bar` property to `Foo` because the client-side entity has a `Foo` property, not a `Bar` property. Such property name translation is rare ... the active `NamingConvention` can usually do the job ... but it happens.

1. A *JsonResultsAdapter* converts in **one direction only**, from the server JSON to the entity. Converting from `Bar` to `Foo` is fine if you'll only read the data. But if you ever have to save a change to `Foo` and need that value to persist to `Bar` on the server ... you'll have to handle *that* property name conversion elsewhere (see **\_prepareSaveBundle** in the [DataServiceAdapters topic](dataserviceadapters)).

### Node traversal logic 

Breeze traverses the nodes, calling `visitNode` for each node, according to the following algorithm:

  - **Step 1**: The raw output from the web service is passed to the `JsonResultsAdapter.extractResults` method which returns the data required for the following steps.
 
  - **Step 2**: Breeze walks the data returned from the `extractResults` call depth first. 
    - If `extractResults` returns a single object, Breeze calls `visitNode` with this object and a `nodeContext.nodeType` of 'root'. 

    - If `extractResults` returns a JavaScript array, then Breeze calls `visitNode` for each of the top level objects in the array, each with a `nodeType` of 'root'.

  - **Step 3** (`visitNode` recursion): 
    - If `visitNode` returns a hash with an assigned `entityType` property, Breeze takes over the processing of the remainder of this node by creating a new instance of this `EntityType` and populating it with node data in the following manner:
 
	   - For each `DataProperty` (identified in the `EntityType.dataProperties` collection), values are copied from the node into the new entity instance.
	   
	            // pseudo-code 
                entity[dataProperty.name] = node[dataProperty.nameOnServer];
 
       - For each `NavigationProperty` (identified in the `EntityType.navigationProperties` collection), property values are copied from the node into the new entity instance. Remember that Breeze looks for a node property that matches the `navigationProperty.nameOnServer`. 
         - If the navigation property value is a scalar, Breeze calls `visitNode` with the property value and a `nodeContext.nodeType` of 'navProp'.

         - If the navigation property value is an array, the Breeze calls `visitNode` iteratively for each array value and a `nodeContext.nodeType` of 'navPropItem'. 

         - Breeze knows that these are *entity nodes* (and their `EntityType`) from the navigation property descriptor. The `visitNode` method shouldn't have to assign the `entityType` property of its result.

       - After `visitNode` returns, Breeze creates an entity based on the node data, the `visitNode` result, and the contextual information.  

       - Breeze merges that entity into the `EntityManager` cache based on its `EntityKey` and the prevailing `MergeStrategy`.

       - If this is a query, the `EntityManager` query method returns the 'merged' entity or entities.

	- Else if the `visitNode` result lacks an `entityType` property (or the `entityType` is null), the node is **anonymous**:

		- `visitNode` is called for each 'object' value returned by an anonymous node property. The value of the accompanying `nodeContext.nodeType` is 'anonProp' or 'anonPropItem' as appropriate.

        - Breeze copies *every* property of an **anonymous** node to the object returned by the `EntityManager` method (almost invariably a query method).

        - After `visitNode` reviews a node-object returned by an  **anonymous** node property, that node may itself be classified as either an *anonymous* node or an *entity* node; it's the `visitNode`'s job to make that determination.

**Important:** Breeze creates new entities and new anonymous type objects by *copying* the node data.  The nodes themselves are then discarded and (eventually) garbage collected. They are never the same as the JavaScript objects ultimately returned from the `EntityManager` query and save methods.