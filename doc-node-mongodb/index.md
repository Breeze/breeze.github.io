---
layout: doc-node-mongodb
redirect_from: "/old/documentation/mongodb.html"
---

# Breeze-MongoDB integration (*Beta*)#

<a class="logo-inline" href="/doc-node-mongodb" title="Node MongoDB">
  <img src="/images/logos/Breeze-mongodb.png" alt="Node MongoDB" width="100">
</a> 

A Breeze client can communicate to almost any server technology including <a href="http://nodejs.org/" target="_blank">Node.js</a> running <a href="http://expressjs.com/" target="_blank">Express</a> with a <a href="http://www.mongodb.org/" target="_blank">MongoDB</a> database.

This topic explains how.

> See Breeze-MongoDB integration in action in the <a href="/doc-samples/zza-mongo"  target="_blank">Zza! Node/MongoDB sample</a>.

<div style="clear:both"/>

{% include support-frag.html %}

### Client side Requirements: ###

Standard Breeze requirements:

- *Breeze.debug.js* or *Breeze.min.js*     
- *Q.js*
- Ajax library - usually *jQuery*

Additional MongoDB requirement: 

+ *Breeze.dataservice.mongo.js*  - a Breeze dataservice adapter that handles all of the MongoDB -specific client-side work involved in communicating with the MongoDB--backed service. Currently <a href="https://raw.github.com/IdeaBlade/Breeze/master/Breeze.Client/Scripts/IBlade/breeze.dataService.mongo.js" target="_blank">available on github</a> and in the [Zza! Node/MongoDB sample](/doc-samples/zza-mongo).

### Server side requirements ###

+ *breeze-mongodb* from npm - a node package that handles all of the server-side details of communicating between a Breeze client and a MongoDB-backed service. 

	`npm install breeze-mongodb`

### Basics ###

A Breeze client side application talking to a MongoDB backend will, for the most part, be indistinguishable from the same app written to talk to a Entity Framework/SQL database backend.  Most of the differences that do exist will be because of differences in how your data structures are modeled.  This is discussed in more detail later.

You will write Breeze specific code in your Node server application to handle the following types of operations. 

+ Querying
+ Saving
+ Provide metadata.

Breeze requires Metadata to describe each of the entity types that it manages.  This metadata can either be returned from a server as a result of a request for the "Metadata" resource or it can be specified directly on the client via a call to any number of MetadataStore methods.

Breeze provides an npm install that will assist in writing the code for each of these operations. 

### Mapping MongoDB to Breeze ###

Breeze maps MongoDB documents as follows:  ( See the Breeze Metadata page for more information on this topic).

+ Top level MongoDB documents are represented as Breeze Entities.     
+ Embedded sub-documents are represented as Breeze `ComplexTypes`.  

A MongoDB document is a JavaScript object. Many of its properties will be simple scalar properties such as "name" and "quantity". But some properties can return **sub-documents** (objects) or **arrays** of simple data types (e.g., strings and numbers). 

Breeze represents sub-documents as `ComplexType`s. A property could return a single instance of a `ComplexType` (`isScalar=true`) or an array (`isScalar=false`) of such instances. 

A property that returns one or more simple data types is a Breeze `DataProperty`, In MongoDB, that property returns either a scalar (`isScalar=true`) or an array (`isScalar=false`) property.

Metadata describing the MongoDB structure can be defined on either the client or the server using [Breeze's native metadata format](/doc-js/metadata-details).

### Breeze/MongoDB - Server side processing

For the remainder of this document we show examples of custom server-side code that implement querying, saving and retrieving metadata.  All of these examples are shown in the context of a node **express** application. Please <a href="http://expressjs.com/" target="_blank">look here</a> to learn more about **express** . 

The examples assume you'll launch in node a JavaScript file containing standard *node/express* boilerplate that looks something like this:  

**server.js**
  
    var express = require('express');
    var app = express();
    var routes = require('./routes');  //  refs a routes.js file where most of our code will be written.
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(errorHandler);


Almost all of the Breeze/MongoDB code shown in these examples is assumed to be part of a "routes.js" file.  Below is the beginning of such a file that opens a MongoDB database called "MyNorthwindDatabase".

> Assume a MongoDB server is running with access to this database.

**routes.js**
  
    var mongodb = require('mongodb');             // MongoDB support package   
    var breezeMongo = require('breeze-mongodb');  // Breeze MongoDB support package
    var fs = require('fs');                       // Access to the local file system.
    
    // Connect to a database.
    var host = 'localhost';
    var port = 27017;
    var dbName = 'MyNorthwindDatabase';
    var dbServer = new mongodb.Server(host, port, { auto_reconnect: true});
    var db = new mongodb.Db(dbName, dbServer, { strict:true, w: 1});
    db.open(function () { });

// route definitions begin here ...
  
### Querying with MongoDB
Let's start on the breeze client which makes a query request to the server. Then we'll see how *routes.js* redirects that request to the proper method for query processing.

#### Client side 

Tell Breeze that you're using MongoDB and everything else is standard Breeze. Put the following line somewhere in your application bootstrapping logic:

    breeze.config.initializeAdapterInstance("dataService", "mongo", true);

Querying a MongoDB database from a Breeze client involves nothing more than a standard Breeze `EntityQuery` such as this one:
  
    var query = EntityQuery.from("Products").where("ProductName", "startsWith", "C");  

The real point here is that, in general, you cannot tell by looking at the client side code what backend datastore is behind any Breeze query.

> Breeze does not yet support querying a MongoDB sub-document directly although it will return one as part of its parent.  The ability to query sub-documents will be added in a future release.

#### Server side

In order to provide the most basic support for Breeze the minimum necessary requirement is simply that you give Breeze an endpoint and then route Breeze to this endpoint.

The routing could look something like this:
  
    app.get('/breeze/Northwind/Products', routes.getProducts);
   
Thus a Breeze `EntityQuery` with "Products" in the **EntityQuery.from** clause is directed to the **getProducts** method in the *routes.js* file.

**getProducts** illustrates the typical implementation of a query processing method: 

    exports.getProducts = function(req, res, next) {
        // convert a client OData-style query string in the request to a MongoDB query
        var query = new breezeMongo.MongoQuery(req.query);
    
        // add custom server-side filtering to the query object here...
    
        // execute the MongoDB query with a callback
        query.execute(db, "Products", processResults(res, next));
    }  
    
    // Return the query callback function
    // res is the HTTP response object
    // next is the Express HTTP pipeline callback
    function processResults(res, next) {
        // return a function to process the results of the query
        // here we simply compose a response with the query results as content
        return function(err, results) {
            if (err) {
                next(err);
            } else {
                res.setHeader("Content-Type:", "application/json");
                res.send(results);
            }
        }
    }

This is the standard template for most queries. The **processResults** method can be reused by all of the query methods discussed in this document.    

#### Inside the query method

`getProducts` composes a query object by parsing the OData-style parameters that the Breeze client has passed in the URL query string and turning them into an equivalent MongoDB query expression. These implementation details are handled automatically by the Breeze *MongoQuery* class that you imported when you called "*require('breeze-mongodb')*".

The Breeze *MongoQuery.execute* receives three parameters: the database object (`db`), the name of a MongoDB collection in "MyNorthwindDatabase", and a callback to process the results returned by MongoDB.

You can further constrain or augment the client query by modifying the Breeze query object before executing it. Continuing with our Products query, we may wish to ensure that no 'discontinued' products are ever returned. We'd specify that constraint with the *query.filter* property. 
 
    exports.getProducts = function(req, res, next) {
        var query = new breezeMongo.MongoQuery(req.query);
    
        // add the server-side constraint
        query.filter["isDiscontinued"] = false;
    
        query.execute(db, "Products", processResults(res, next));
    } 

The client's query parameters are still applied; our server side filter is AND-ed to the client filter(s).

The client doesn't have to use the Breeze/OData query semantics. You can specify your own parameters on the client by means of the `EntityQuery.withParameters` method as we see here:

On the Breeze client:
 
    var query = new Breeze.EntityQuery.from("getProductsCostingMoreThan").withParameters( {
       minUnitPrice: 50.0
    }}
  
and on the server (after routing)
  
    exports.getProductsCostingMoreThan = function(req, res, next) {
        var query = new breezeMongo.MongoQuery(req.query);
    
        // extract the parameter from the url query string.
        var minUnitPrice = req.query.minUnitPrice;
        if (minUnitPrice === undefined) {
           var err = new Error("Missing the 'minUnitPrice' parameter") 
           next(err);
           return;
        }
    
        // standard mongoDB 'greater than' query syntax
        query.filter["unitPrice"] =  { "$gt": parseFloat(minUnitPrice); };
        query.execute(db, "Products", processResults(res, next));
    };

If the query fails, you can return an exception to the Breeze client as we did above. The response will have a "500-Internal Server Error" status code.

That's not really the correct response in this case. The server didn't fail; the client made a bad request. You should probably say so ... and you can ... by calling `next` with an error-indicating response object as seen in this revision to `getProductsCostingMoreThan`.
 
        ...
        if (minUnitPrice === undefined) {
           var err = { statusCode: 400, message: "Missing the 'minUnitPrice' parameter"};
           next(err);
           return;
        }

You can specify a query projection on the server via the *query.select* property. The following query first applies any client side filters and then strips the results down to the `CompanyName` and `_id` properties. 

    exports.companyNamesAndIds = function(req, res, next) {
        var query = new breezeMongo.MongoQuery(req.query);
        query.select = { "CompanyName": 1, "_id": 1 };
        query.execute(db, "Customers", processResults(res, next));
    };

You can limit the number of records returned with the *query.options* property. This next query returns at most a single record regardless of the number of records that satisfy the query criteria.
  
    exports.customerWithScalarResult = function(req, res, next) {
        var query = new breezeMongo.MongoQuery(req.query);
        query.options.limit = 1;
        query.resultEntityType = "Customer";
        query.execute(db, "Customers", processResults(res, next));
    };

The client may not know that the "customerWithScalarResult" resource name returns a "Customer" entity. The *query.resultEntityType* property above tells the Breeze client to expect "Customer" entities.  Without that advice, the client might have to [map in metadata](/doc-js/api-docs/classes/MetadataStore.html#method_setEntityTypeForResourceName) this "customerWithScalarResult" endpoint - and every other unusually-named endpoint - to its corresponding entity type.

Each of the MongoQuery properties mentioned above 'filter', 'select', 'options' corresponds directly to the parameters of the MongoDB *collection.find* method. 
 
    collection.find( query.filter, query.select, query.options).toArray(...);

That's what Breeze calls inside the *MongoQuery.execute* method. This means you can tune the MongoDB query operation by setting any of these Breeze query properties directly before calling "execute". 

#### Consolidating query endpoints

Handling each endpoint separately as we did with *getProducts* is desirable in many environments. You can imagine adding more routes and methods in this style:
   
    app.get('/breeze/Northwind/Products', routes.getProducts);
    app.get('/breeze/Northwind/TheseThings', routes.getTheseThings);
    app.get('/breeze/Northwind/ThoseThings', routes.getThoseThings);
     ...  

But you may prefer to redirect most (perhaps all) client queries to a single query endpoint as follows:

    ... after other routes ...   
    app.get('/breeze/Northwind/:slug', routes.get);

The ":slug" is a placeholder. An HTTP GET request for an URL such as */breeze/Northwind/Customers* or */breeze/Northwind/Employees* would be routed to the same `routes.get` method which might look like this:
  
    exports.get = function (req, res, next) {
        var query = new breezeMongo.MongoQuery(req.query);
        var slug = req.params.slug;
        query.execute(db, slug, processResults(res, next));
    };
   
The ":slug" in our examples is "Customers" or "Employees". Both are names of collections in the "MyNorthwindDatabase".

The `get` implementation looks and behaves just like `getProducts` in every other respect. 
  
### Saving with MongoDB
We'll start on the client and return quickly to the server.

#### Client side

Saving to a MongoDB database from a Breeze client involves nothing more than a standard Breeze *EntityManager.saveChanges* call such as this one:
 
    return myEntityManager.saveChanges().then(...);

Again, as with queries, in general, you cannot tell by looking at the client side code what backend datastore is behind any Breeze *saveChanges* call. 

#### Server side

As with queries, in order to support Breeze's client side EntityManager.saveChanges call, you will need to provide an endpoint and a route to this endpoint.  Something like this: 
  
    app.post('/breeze/Northwind/SaveChanges', routes.saveChanges);

> Note that we use HTTP 'app.post' for saving as opposed to the 'app.get' for queries.

Here is a simple implementation for `routes.saveChanges`.
   
    exports.saveChanges = function(req, res, next) {
        var saveHandler = new breezeMongo.MongoSaveHandler(db, req.body, processResults(res, next));
        saveHandler.save();
    };

The `processResults` callback-producing method in `saveChanges` is the same one we called for queries. 

#### Validation through save interception

You authorize and validate client save-data with save "interceptors". You can even modify the save data with interceptors.  

Breeze offers two interceptor methods: `MongoSaveHandler.beforeSaveEntity` and `MongoSaveHandler.beforeSaveEntities`. 

These are methods that **you write** and **breeze calls** just before saving the data to the MongoDB database.
     
    exports.saveChanges = function(req, res, next) {
        var saveHandler = new breezeMongo.MongoSaveHandler(db, req.body, processResults(res, next));
        // write one or both of the following
        // saveHandler.beforeSaveEntity = myCustomBeforeSaveEntity;
        // saveHandler.beforeSaveEntities = myCustomBeforeSaveEntities;
        saveHandler.save();
    };

You can define one or both of these methods. Breeze first calls `beforeSaveEntity` for every entity in the save-set and then calls `beforeSaveEntities`.

Each method has a distinct purpose:

 + `beforeSaveEntity` - review and possibly modify or reject *each entity individually*.
 + `beforeSaveEntities` - review and possibly modify *the entire collection* of entities to be saved (the "save-set").  You can modify or remove any of them.  You can add more entities-to-save, potentially of types not included in the original save-set.

Entities in the save-set are each augmented with an `entityAspect` property.  This server-side `entityAspect` has the following properties:

+ **entityTypeName**: The name of the entityType associated with this entity.
+ **entityState**: A string indicating the save operation to be performed on this entity; one of the following strings: "Added", "Modified", "Deleted" 
+ **originalValuesMap**: an object hash whose key/value pairs identify the property that changed (key) and the original value of that property (value). The `originalValuesMap` is only defined for entities with an `entityState` of "Modified".
+ **forceUpdate**: When true, Breeze updates the database object with ***every*** property of a "Modified" entity, not just the properties enumerated in the `originalValuesMap`.

#### beforeSaveEntity ####

Breeze doesn't define this method; you do. Breeze calls your custom implementation of the `beforeSaveEntity` interceptor once for each entity in the save-set. 


***Save Example #1***:

Ensure that every new Product we add to the database has at least a $.50 surcharge.
    
    function myCustomBeforeSaveEntity(entity) {
        var entityAspect = entity.entityAspect;
        if (entityAspect.entityTypeName === "Product" && entityAspect.entityState === "Added") {
            if (entity.surcharge < .5) entity.surcharge = .5;
        }
        return true;
    }
 
***Save Example #2***:

Prevent new products from being added to "revoked suppliers" by removing such products from the save-set.
    
    function myCustomBeforeSaveEntity(entity) {
        var entityAspect = entity.entityAspect;
        if (entityAspect.entityTypeName === "Product" && entityAspect.entityState === "Added") {
            if (revokedSupplierNames.indexOf(entity.supplierName) >= 0) return false;
        }
        return true;
    }

If the method returns false, breeze will not save this entity. Breeze will continue to evaluate the remaining entities and may save them.

You can throw an exception if you want to terminate the save immediately.

Your `beforeSaveEntity` method must execute synchronously. If your validation logic requires asynchronous calls (e.g., you need to query the MongoDB database), you'll have to put such logic in your `beforeSaveEntities` method.

#### beforeSaveEntities ####

Your `beforeSaveEntities` method is granted access to the entire save-set through several public properties on the **`MongoSaveHandler`** instance. The `MongoSaveHandler` instance is the `this` object within your `beforeSaveEntities` function.

Pertinent `MongoSaveHandler` instance properties and methods include:

+ **saveMap**:  an object hash keyed by EntityType name where the value is an array of entities to be saved for the given EntityType. You can add and remove entities from this map. 
+ **qualifyTypeName**(entityTypeName): creates a fully qualified EntityType name based on the default namespace associated with this saveHandler. You may need this function to find entities of a particular type in the saveMap; see the example below.
+ **saveOptions**:  a copy of the Breeze client-side `SaveOptions` instance that can be optionally provided during the `EntityManager.saveChanges` call. You can pass arbitrary data from the Breeze client to the server-side `saveChanges` call in the `SaveOptions.tag` property. 
+ **metadata**: an object hash keyed by EntityType name where the value for each key is the metadata associated with that EntityType. There must be a single entry for each EntityType that is referenced within the `saveMap`.  Breeze automatically populates this metadata object for each EntityType in the client's save-set. A metadata entry has the following properties:
    + `defaultResourceName`:  The default ResourceName for this EntityType, this is often the MongoDB collection name.  
    + `dataProperties`: An array of all of the `DataProperty` specs for this EntityType. 

You will need the following methods if you add a new entity to the saveMap during your *beforeSaveEntities* call. 

+ **addToSaveMap**(newEntity, entityTypeName, entityState).
+ **registerEntityType**(entityTypeName, mongoCollectionName, autoGeneratedKeyType, dataProperties) You must call this method first if  you want to add an entity to the savemap and its EntityType is not already one of the saveMap keys.


`beforeSaveEntities` has an asynchronous signature. Breeze calls your method with a single argument, the callback function to invoke when your `beforeSaveEntities` has completed its evaluations of and changes to the saveMap.

`beforeSaveEntities` must be asynchronous because your method will probably make asynchronous calls of its own. For example, when you cannot trust data from the client (and you usually can't), you should retrieve current data values from the database and compare them with the proposed save-set values from the client. All MongoDB queries are asynchronous.

#### Saving entities that are not in the client "saveMap" ####
You can save changes to entities that the client did not include in the `saveMap`. For example, you might log changes to entities in an Audit table by creating "audit entities" on the server. You'll want to create them and add them to the "saveMap" with `addToSaveMap` so that they are saved as part of the "transaction".

> MongoDB doesn't support real transactions so were using the word loosely, meaning "at the same time as".

You could also add entities to the "saveMap" in "Modified" or "Deleted" state, meaning that these entities exist in the database and are to be updated or deleted. 

If you add a "Modified" entity, you must tell Breeze which properties of the entity to update. If you don't, breeze won't update the entity at all! The easy way is to set the entity's `entityAspect.forceUpdate` to `true`; breeze then will update *every* property. 

If instead you want to update only a few specific properties, set the `originalValuesMap` to an object hash that identifies those properties as shown here:

    thing.entityAspect.originalValuesMap = {
        foo: null, // only the property name ('foo') matters ...
        bar: null  // ... not the value.
    }

Breeze uses the `originalValuesMap` keys to determine which properties to save to the database; it ignores the original values themselves.

***Save Example #3***:

Add 5% to the freight cost on every order saved.

    function myCustomBeforeSaveEntities(callback) {
        var orderTypeName = this.qualifyTypeName("Order");
        var orders = this.saveMap[orderTypeName] || [];
        
        orders.forEach(function(order) {
           order.freightCost = order.freightCost * 1.05;    
        });
        callback();
    }

