---
layout: doc-net
---
# Server-side validation

> **NOTE: This page is for Breeze running on .NET Core**<br>
> [Go here for .NET 4.x version](/doc-net/ef-serverside-validation-4x)

## Save validation <a name="Savevalidation"></a>

All server side validation errors go to the `catch` promise. Server side validation errors appear as a property called `entityErrors` that contains an array of server errors.  
	
	             em.saveChanges().then(function (sr) {
	                   …
	              }).catch(function (e) {
	                 var entityErrors = e.entityErrors;
	                 var entityErrors = entityErrors.length; // number of errors
	                 // handle the errors...
	              });
	
Each client side entityError consists of the following properties:

* **errorMessage**: The actual error message string - This is always present.
* **errorName**:  A 'name' for the error "type". This will be used in conjunction with the property name to uniquely identify the error with an entity's validation errors collection. 
* **entity**: If the error can be associated with an entity    
* **propertyName**: If the error can be associated with a property    
* **isServerError**: If the error is a server error.

EntityErrors that have an associated entity will also get converted into *validationError* instances and will get automatically added to the appropriate *entityAspect* validationErrors collections.  The appropriate *validationErrorsChanged* events will then fire. 

Server errors are automatically cleared before a save so that they don’t interfere with the save.  Alternatively they can be removed via the *entityAspect.removeValidationError* method. 

## Server-side validation errors<a name="Serversidevalidationerrors"></a>

Server side validation errors can be returned by throwing an *EntityErrorsException* within the server side *BeforeSaveEntities* delegate or virtual method.

### 	EntityErrorsException

By throwing an *EntityErrorsException* within the server side *BeforeSaveEntities* delegate or virtual method.  The *EntityErrorsException* ctor takes a *IEnumerable* of *EntityError*. 
	    
Each *EntityError* within this exception will be sent back to the Breeze client and converted into a client side 'entityError' within the promise.catch branch.  The *EntityError* class consists of the following properties.  

+ **ErrorMessage**: String - The actual error message
+ **ErrorName**: String - A 'name' for the error "type". This will be used in conjunction with the property name to uniquely identify the error with an entity's validation errors collection. 
+ **EntityTypeName**: String - The .NET Type 'Full" name of the entity involved ( if any) 
+ **KeyValues**: Array of Object: The key value or values used to identify this entity.
+ **PropertyName**: String - The property name, if any, involved in the error.
	       	     
*EFEntityError* is an Entity Framework specific subclass of *EntityError* that makes it easier to construct an *EntityError* from an *EFEntityInfo* instance (available within the *BeforeSaveEntity* and *BeforeSaveEntities* methods).  The *EFEntityError* constructor looks like:
			
	        EFEntityError(EFEntityInfo entityInfo, String errorName, String errorMessage, String propertyName);
	
Example:
	
	        [HttpPost]
	        public SaveResult SaveWithEntityErrorsException(JObject saveBundle) {
	          ContextProvider.BeforeSaveEntitiesDelegate = ThrowEntityErrorsException;
	          return ContextProvider.SaveChanges(saveBundle);
	        }
	
	        private Dictionary<Type, List<EntityInfo>> ThrowEntityErrorsException(Dictionary<Type, List<EntityInfo>> saveMap) {
	          List<EntityInfo> orderInfos;
	          if (saveMap.TryGetValue(typeof(Order), out orderInfos)) {
	            var errors = orderInfos.Select(oi => {
	              return new EFEntityError(oi, "WrongMethod", "Cannot save orders with this save method", "OrderID");
	              });
	              throw new EntityErrorsException(errors);
	          }
	          return saveMap;
	        }
	
All other errors thrown on the server, still go to the fail promise but without the “entityErrors” property.