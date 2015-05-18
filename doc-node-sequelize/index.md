---
layout: doc-node-sequelize
title: Server - Node w/ Sequelize
---

# Breeze/Node/Sequelize - implementing a server side Breeze DataService. -

Breeze client applications make three basic kinds of HTTP ajax calls:

  - 1) Breeze metadata 'Get' requests
  - 2) Breeze query 'Get' requests
  - 3) Breeze save 'Post' requests
  
The **breeze-sequelize** npm package provides a server side framework for translating the results of the breeze 
*query* and *save* HTTP calls into operations against any backend database supported by the node 'Sequelize' library.  

The [node 'Sequelize' library](https://github.com/sequelize/sequelize "sequelize on github ") is described on github as follows 

> The Sequelize library provides easy access to MySQL, MariaDB, SQLite or PostgreSQL databases by mapping database entries to objects and vice versa. To put it in a nutshell, it's an ORM (Object-Relational-Mapper). The library is written entirely in JavaScript and can be used in the Node.JS environment.    

Note that In order to use the 'breeze-sequelize' library, you do NOT need to interact directly with 'Sequelize', so knowledge of how to query or save with 'Sequelize' is not actually necessary, but might be helpful. 

### Node libraries needed for a Breeze-Sequelize server

  - **breeze-sequelize**: Breeze library that allows client side breeze query and save requests to be translated into Sequelize syntax and executed against a backend SQL database.
  	- Note that internally *breeze-sequelize* uses the *breeze-client* npm library. 

Standard usage:
       
    var breezeSequelize = require("breeze-sequelize");

Additional libraries ( not actually required but useful for certain operations)

    var Sequelize = require('sequelize'); // The actual 'sequelize' library used by 'breeze-sequelize'
    var Promise = require('bluebird');    // The Promise implementation used by 'breeze-sequelize'

### Breeze Sequelize API

Once the 'breeze-sequelize' library has been loaded, there are three entry points, each of which returns a class constructor.

    var SequelizeManager = breezeSequelize.SequelizeManager;
    var SequelizeQuery = breezeSequelize.SequelizeQuery;
    var SequelizeSaveHandler = breezeSequelize.SequelizeSaveHandler;

as well as access to the 'standard' breeze client library via

    var breeze = breezeSequelize.breeze;

**Note**: The version of breeze that is returned is exactly that returned by the 'breeze-client' npm **BUT** with several Node/Sequelize specific methods added to various breeze classes. *In general, you should use this reference instead of 'importing' the 'breeze-client' npm package directly*.

#### **SequelizeManager**: 
You will typically create a single instance of the Breeze *SequelizeManager* for your service. Each query or save operation within the service will then make use of this single instance. The *SequelizeManager* encapsulates a single database connection along with the *breeze* metadata needed to translate *breeze* operations into the corresponding *Sequelize* operations. 


Under the covers the *SequelizeManager* creates an entire collection of *Sequelize* models corresponding one for one with Breeze *EntityTypes*. 

If you are already familiar with *Sequelize* then this might feel a bit strange. Basically, instead of creating a collection of *Sequelize* models to describe your interaction with the database, the Breeze *SequelizeManager*  will create these models for you based on the breeze metadata definition.  You trigger this process with the *SequelizeManager.importMetadata* call 

If you are not familiar with *Sequelize* then don't worry, you don't actually have to know any *Sequelize* in order to use 'breeze-sequelize'.

##### Sequelize manager methods:

- **SequelizeManager**(*dbConfig*, *sequelizeOptions*): (class constructor)
     -  *dbConfig* - the configuration object that consists of the following properties:
      - *dbName*: The name of the database.
      - *user*: The user name to authenticate against the database.
	  - *password*: The password which is used to authenticate against the database.
   - *sequelizeOptions* -  as defined in the sequelize documentation here: [http://sequelize.readthedocs.org/en/latest/api/sequelize/](http://sequelize.readthedocs.org/en/latest/api/sequelize/ "Sequelize API").  The most important of which are:
      - *dialect*: The dialect you of the database you are connecting to. One of 'mysql', 'postgres', 'sqlite', 'mariadb', or 'mssql'
      - *port*: The port of the relational database.
> 

- **importMetadata**(*breezeMetadata*):  Instance method that imports breeze metadata into the manager. This metadata is needed for many of the other operations that the manager performs.
	- *parameter*: breezeMetadata: This can be any metadata that conforms to the breeze metadata specification and may be in either string or json format. For more information, see [http://www.getbreezenow.com/documentation/metadata](http://www.getbreezenow.com/documentation/metadata "Breeze metadata")
>

- **keyGenerator**: An optional instance property that if defined returns an object that implements the 'KeyGenerator' interface. This property only needs to be set if the default Sequelize autoincrement logic is not sufficient for your needs. The keyGenerator allows you to programatically control the generation of new ids on the the Node server after a save request is recieved but before it is seen by Sequelize. 

	- The KeyGenerator interface consists of a single function:
       - *getNextId*(property): returns a Promise that resolves to a new id value.

#### SequelizeQuery  

You will be creating a new SequelizeQuery instance to correspond with each HTTP get call that represents a breeze client side query. This code for this will look something like this: ( req in the code below is the HTTP request object).

	// req = the HTTP request object.
	var resourceName = req.params.slug; // the HTTP endpoint
    var entityQuery = breeze.EntityQuery.fromUrl(req.url, resourceName);
    // _sequelizeManager is a SequelizeManager that would have been
    // created before the first HTTP request.
    var query = new SequelizeQuery(_sequelizeManager, entityQuery);
  
Basically this code converts the url passed in into a 'server side' *EntityQuery* which is then converted into a SequelizeQuery which in turn can be 'executed' to return results.

##### SequelizeQuery methods

- **SequelizeQuery**(*sequelizeManager*, *entityQuery*) - Class constructor. 
   - *sequelizeManager* - A SequelizeManager instance that is typically shared across all query and save operations against a single database.
   - *entityQuery*: The breeze EntityQuery object that will be converted into a SequelizeQuery for execution. 
>

- **execute**():  Executes the query.  
   - **returns**: a promise with the resolved result formatted so that it can be directly returned to the breeze client.

### SequelizeSaveHandler

A *SequelizeSaveHandler* instance is needed for each HTTP POST call that represents a client side breeze *saveChanges* call. You will actually execute the save via the 'save' method.

#### SequelizeSaveHandler methods and properties

- **SequelizeSaveHandler**:(*sequelizeManager*, *req*) - Class constructor.
	- *sequelizeManager* - A SequelizeManager instance that is typically shared across all query and save operations against a single database.  
    - *req*: The HTTP request object that was sent from the client as a result of a saveChanges call.  

- **save**(): An instance method that can be called to perform the save.

- **beforeSaveEntity**: An optional property that may be set to a function with that will then get called multiple times during the save process before each entity is saved with the specific entity that is about to be saved. Returning a falsy value from this function will cause the specific entity to NOT be saved.  
	- **beforeSaveEntity**(*entityInfo*)
	    - *entityInfo* - Information about the entity about to be saved. The EntityInfo structure will have the following properties
	       - *entity*: The entity about to be saved.
	       - *entityType*: The *EntityType* of the entity about to be saved.
	       - *entityAspect*: Additional information about the entity
	       		- *entityState*: The EntityState of the entity about to be saved.
	       		-  *originalValuesMap*: A hash of the original values for each property.  The keys are the **server side names** of each of the properties.
	       		-  *autoGeneratedKey*: Information about how the key for this entity was generated ( if it was autoGenerated on the server).
	       - *unmapped*: A hash of all 'unmapped' values that are part of the entity to be saved. The keys are the **server side names** of each of the properties. 
		  

- **beforeSaveEntities**: An optional property that may be set to a function that will get called once during the save process with a collection of all of the entities that are being saved. You can add/modify  or remove entities to be saved with this function.
	- **beforeSaveEntities**(*saveMap*) 
	  - *saveMap* - a hash of all of the entities to be saved, where the keys are *EntityType* names and the values are each arrays of EntityInfo ( see structure from above) instances corresponding to  all of the entities of that type. By updating the *saveMap* you will be changing the collection of entities to save.   

##### Read only properties 

These properties will all be available from within any implementation of the *beforeSaveEntity* or *beforeSaveEntities* functions that you provide as properties of the local 'this' within the function. i.e. 'this.saveOptions'

- **sequelizeManager**: The *SequelizeManager* that was used to construct this *SequelizeSaveHandler*. 
- **metadataStore**: The *MetadataStore* (see breeze client side documentation) instance associated with this save. 
- **saveOptions**: The *SaveOptions* (see breeze client side documentation) instance associated with this save.