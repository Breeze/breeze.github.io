---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/.html"
---

# Mapping Web Service Data into Breeze entities

Breeze translates raw data from a Web Service into cached entities - with observable properties, change tracking, validation, and more - using a *JsonResultsAdapter*.  This adapter parses the raw data and maps them into either entity instances or anonymous type instances.

Breeze ships with two *JsonResultsAdapters*, one for interpreting standard OData JSON data and another for interpreting JSON data from a Web API controller that has been configured for Breeze clients.

There are many other formats for web service data. We can't even imagine them all. Fortunately you can write your own *JsonResultsAdapter* as described here. The Edmunds sample includes a simple example of a *JsonResultsAdapter* that deserializes data from the Edmunds Vehicle Information Service.

### JsonResultsAdapter

The shipped Breeze dataServiceAdapters  (the "webApi" and "odata" dataServiceAdapters) include their own *JsonResultsAdapters* designed for their "typical" base scenarios. These are the default *JsonResultsAdapters*. If one of them can't handle the data returned by your web service, you can write an alternative custom adapter and tell Breeze to use your adapter instead.

This is a BETA feature whose API and behavior may change.

You typically specify which *JsonResultsAdapter* to use in the *DataService* for your *EntityManager*.

    var myJsonResultsAdapter = new MyJsonResultsAdapter();
    var dataService = new DataService() { JsonResultsAdapter = myJsonResultsAdapter };
    var manager = new EntityManager(dataService);

You can also specify one for a particular EntityQuery:

    var query = new EntityQuery<Customer>("SpecialCustomers")
        .using(myJsonResultsAdapter);

The JsonResultsAdapter is actually an instance of the IJsonResultsAdapter interface.  This interface only has three methods or properties that need to be implemented. 

- **Name**: (String Property)
    -  The name of the adapter.
- **JToken ExtractData(JToken node)**: 
    - A method that extracts the real data from within the web service JSON payload and returns those data to the adapter for subsequent processing. For example, the default Web API implementation of this function assumes that the real data are in the 'results' property of the payload. The extracted data may take the form of a single object or an array of objects, each potentially an object graph with nested objects.
- **JsonNodeInfo VisitNode(JObject node, MappingContext mappingContext, NodeContext nodeContext)**: 
    - This is the workhorse of the interface.  The object(s) returned by the *ExtractResults* method are "node(s)". Breeze calls *VisitNode* for each node. The VisitNode method returns information to guide Breeze's subsequent processing of this node and its child nodes. This method is the heart of the adapter.
     
### The visitNode method

The *VisitNode* method takes 3 parameters and returns a *JsonNodeInfo* instance. Breeze uses the returned *JsonNodeInfo* object to determine how to process the node, potentially creating an entity from the node data and merging that entity into the *EntityManager*.

 - *VisitNode* Parameters:

    - *node*: the visited node which is either a JSON (JToken) object or primitive value.
    - *mappingContext*: contextual information for the dataset the adapter is processing. The mappingContext has the following properties:
        - *EntityManager*: the EntityManager that executed the query and returned these data. If the data become entities, they will be merged into the cache of this manager.
        - *MergeStrategy*: entities will be merged into the EntityManager using this MergeStrategy. 
        - *LoadingOperation* - An enum value that is used to describe the current operation being performed while this JsonResultsAdapter is executing
        - Other undocumented properties; you should not depend on them.

    - *nodeContext*: information about the current node. Every nodeContext has a nodeType property that defines the type of node being visited. The remaining nodeContext properties vary by nodeType.

        - *Node* - The actual json being processed ( a JToken).
        - *ObjectType* - The CLR type of the object this node is expected to represent.
        - *StructuralType* - The Breeze EntityType or ComplexType that this node represents - may be null
        - *StructuralProperty* - The DataProperty that this node represents. 
         
The *VisitNode* method returns a *JsonNodeInfo* instance contains the following properties: (Most of the props are optional).
 
   - *JsonNodeInfo* properties:
       - *ServerTypeNameInfo*: The Server side TypeNameInfo for the type returned by this node.  
       - *NodeId*: The same object may appear several times in a dataset. Such redundancy can bloat the payload. Some JSON serializers are able to serialize the object just once. The first instance is serialized normally and assigned a unique serialization id. The data for subsequent instances are replaced by references to this serialization id. For example, given an array with the same person listed twice, the serializer might produce:

            [{
              "$id": "1",
              "Name": "James",
              "BirthDate": "1983-03-08T00:00Z",
            },
            {
              "$ref": "1"
            }]
Breeze supports approach by allowing you to return a unique identifier for any object node and later refer to other instances of the same object with this identifier. The nodeId is the unique identifier.
 
       - *NodeRefId*: An identifier that refers to another object with this id. Breeze might encounter a nodeRefId before meeting the object with the corresponding nodeId. Breeze defers resolution of such references until after traversing the entire top level graph.
       - *Ignore*: A boolean that defaults to false. Set this to 'true' to force breeze to ignore the entire node (and all subnodes).  This means that this node and any subnodes of this node will not be processed.
       - *Node*: May used to replace the node currently being processed with another.
  
### Node traversal logic

Here is how Breeze traverses the nodes:

1. The raw output from the web service are passed to the *JsonResultsAdapter.ExtractResults* method which returns a JSON object. 
2. Breeze walks the JSON depth first. 
    - If *ExtractResults* returned a single object ( as opposed to a JSON array), Breeze calls VisitNode with this object. 
    - If *ExtractResults* returns a JSON array, then Breeze calls visitNode for each of the top level objects in the array.
3. Based on the return value of the VisitNode call above.
  - If VisitNode returns a *JsonNodeInfo* with an *ServerTypeNameInfo* property
        - Breeze takes over the processing of the remainder of this node. It creates a new instance of the *EntityType* and populates it with node data in the following manner:
            - iterate over all of the *EntityType.DataProperties* defined for this *EntityType*. The propertyNames of these properties are defined by the *DataProperty.NameOnServer* property for each data property.
            - iterate over all of the *EntityType.NavigationProperties* defined for this *EntityType*. The propertyNames of these properties are defined by the *NavigationProperty.NameOnServer* property for each data property. 
            - Then VisitNode will be called on the entity or on each of collection of entities returned by this property and passed a nodeContext.nodeType of either 'navProp' or 'navPropItem'. This is to identify the specific entityType returned by the navigation. Repeat step 3.
            - merge the resulting new entity into the EntityManager based on its EntityKey and the QueryContext.MergeStrategy.
    - Else if this node is an 'object', it is interpreted as an anonymous object:   
        - VisitNode is called for each property of the anonymous object and step 3 is repeated with the result of this call.
    - Else this is a scalar property which is returned unchanged.
    
Any VisitNode call may set the *Ignore*, *NodeId*, *NodeRefId* and *Node* properties as well.

- A boolean *Ignore* value of true tells Breeze to skip further processing of this node and its descendents.
- The presence of a *NodeId* tells Breeze to register this object under that id so that it can later be referenced elsewhere in the graph.
- A *NodeRefId* specification tells Breeze to replace the current node with the referenced node.
- A *Node* being specified tells Breeze to use the specified node as the current node used it for further processing as Breeze descends that node's object graph. 

While traversing the JSON object graph(s), Breeze creates new entities and new anonymous types based on the results of each VisitNode call. 

