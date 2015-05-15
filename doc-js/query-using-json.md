---
layout: doc-js
---

EntityQueries in json format 
----
As of Breeze 1.5.1 both *EntityQueries* and *Predicates* can be expressed not only via a fluent interface
  
    var query = EntityQuery.from("Customers")
        .where("companyName", "startsWith", "A");

but also via a simple json object hash:

	var query = new EntityQuery({
      from: "Customers",
      where: {
       "companyName", { startsWith: "A" }
      }
    }

These two formats can mixed within a query as well.

    var whereClause = { "companyName", { startsWith: "A" } }); 
    var query = EntityQuery.from("Customers")
        .where( whereClause);
       
**The remainder of this page describes the json format.**

The *EntityQuery* and the *Predicate* constructors along with the *EntityQuery.where* method all accept a json object as a single parameter. 
    
    var query = new EntityQuery(jsonQuery);
    var predicate = new Predicate(jsonWhere);
    var query = existingEntityQuery.where(jsonWhere);
    var query = existingEntityQuery.where(predicate);

(Note: The preexisting fluent api for each of these methods remains and has not changed.).  

In addition, both the *EntityQuery* and the *Predicate* classes have a *toJSON* method that will return their current state in a json format.

     jsonQuery = myEntityQuery.toJSON();
     jsonPredicate = myPredicate.toJSON(); 

The returned object can be stored offline in local storage, and can later be used to create a clone of the original query or predicate.  

In addition, both the *EntityQuery* and the *Predicate* classes have a *toJSON* method that will return their current state in a json format.

     jsonQuery = myEntityQuery.toJSON();
     jsonPredicate = myPredicate.toJSON(); 

The returned object can be stored offline in local storage, and can later be used to create a clone of the original query or predicate.  

     var cloneQuery = new EntityQuery(myEntityQuery.toJSON());

The 'stringified and urlEncoded' version of this format is also used to support an alternative to the OData query format ***that is the default*** for sending a query over the wire to a server. You can switch to sending queries in this fashion by initializing breeze's 'uriBuilder' to use the json format via the *initializeAdapterInstance* method: 

    breeze.core.config.initializeAdapterInstance("uriBuilder", "json");

Of course, this will only work if your server understands this format as opposed to the default OData query format. 

Note that the use of the json uri adapter is independent of the mechanism by which the query was created. i.e. a query created via the breeze fluent interface can still be sent to the server as a urlEncoded json query and vice versa, a query created with using the json format can still be used with the default OData 'uriBuilder'. 

On the client side, the reason for creating this format was to allow queries to be saved offline and recreated based on the serialized offline data.

On the server, the major reason for supporting this alternative format is that it is often easier to consume for those servers that are not already designed to understand OData. Especially insofar as virtually all server technologies have libraries for consuming json.   

An additional reason for this format is that it supports the concept of allowing for expanded query capabilities via the ability to add query operators that are tailored to a specific backend server technology. For example, the breeze node/MySql/MariaDb/Postgres server has support for the 'like' and 'nlike' query operators which cannot be supported via the OData query syntax.  



###EntityQuery JSON syntax:


| Property | Property value type | Description |
| -- | -- | -- |
| **from** | String | The resource name |
| **where** | Predicate json object   | The filter to apply |
| **take/top**|  Number (integer) | The number of items to return |
| **skip** | Number (integer) | The number of items to skip before returning results |
| **orderby** | Array of Strings | Each string must be a valid property path, optionally followed by either 'asc' or 'desc' |
| **select** | Array of Strings | Each string must be a valid property path |
| **expand** | Array of String | Each string must be a valid property path |
| **inlineCount** | Boolean | Whether of not to include the 'inlineCount' |
| **queryOptions** | QueryOptions json object | |

#### Example:

    {
     from: "Orders",
     where: {"orderID": {"lt":10500} },
     orderBy: ["orderDate desc"],
     expand: ["orderDetails","orderDetails.product"],
     skip:20,
     take:10,
     inlineCount:true
    }


### Predicate syntax 
Breeze's basic predicate json syntax is

    < propertyName or propertyPath >: { < operator > : < value > }

For example:

    { age: { gt: 30 }}
   
Many of the operators have multiple aliases (documented below), so for example,

    { age: { '>': 30 }}      

represents exactly the same predicate as the one above it because '>' is an alias for 'gt'.

##### Predicates with property paths
Property paths are also supported: So the following would be valid if we are querying orders where each order has a 'customer' property and each customer has a 'zipCode' property.

    // from("Orders").where
    { "customer.zipCode": { "==": 94611 } }

##### Subqueries 

Subqueries on nonscalar navigation properties, i.e. properties that return arrays of entities, are also supported via the 'any' and 'all' operators. The syntax for these operators is:

    < propertyName or propertyPath >: { < 'any'/'all' > : < predicate on the nested type > }

So for example if we were querying customers but only wanted those customers who had at least one 'order' with a 'freightCost' of more than $100, we might use: 
 
    // from("Customers").where
    { orders: { any: { freightCost: { gt: 100 } } } } 
      
Note that depending on the operator, the < value > may be an array. For example:

    { age: { in: [ 26, 28, 30, 32] }}

In general the datatype of the value is determined by the property being queried. For example, assuming that the 'lastName' property is a string or the 'hireDate' is a date. 

    p1 = { lastName: { startsWith: 'A'}}    
    p2 = { hireDate: { 'lt': new Date(2010, 0, 1) }}

##### Ambiguous predicates

Predicates where there are more than one interpretation for the < value > expression are uncommon but can occur. An example would be a predicate where there is ambiguity as to whether the specified value is a literal or a property path. For example the following expression is ambiguous because the string "firstName" could be either a literal or a property expression.  

    { lastName: { startsWith: 'firstName' }

Such expressions can be expressed using a 'value' object instead of a literal value, so the previous expression can be expressed without ambiguity as: 
 
    { lastName: { startsWith: { value: 'firstName', isProperty: true }

All value objects have a 'value' property, along with one or more additonal properties. ( The 'isProperty' property is the example above).

In a similar fashion, if the datatype of a value is ambiguous you can use the 'dataType' property of the value object. 

    { companyID: { eq: { value: '785efa04-cbf2-4dd7-a7de-083ee17b6ad2', dataType: "Guid" }

##### Combining predicates

Predicates can also be combined via the use of the 'and' and 'or' operators. The syntax for these operators is:

    < 'and'/'or' >: [ < array of predicates > ]

For example:

    { and: [
       { lastName: { startsWith: 'A'}},
       { hireDate: { '<': new Date(2010, 0, 1) }}
      ]
    }
 
So more complex queries composite queries can also be constructed:

    { or: [
        age: { ">": 40 }, 
        and: [
          { lastName: { startsWith: 'A'}},
          { hireDate: { '<': new Date(2010, 0, 1) }}
        ]
      ]
    }
 
##### Shortcuts:

There are also two shortcuts for expressing some common query expressions:

- The equality operator does not need to be specified.

        { age: 35 }
      
       is the shortcut for
 
        { age: { "==": 35 }}
    
- Multiple predicates appearing together in a json object are automatically  anded together.

        { 
          age: 35,
          hireDate: { ">", new Date(2010, 0, 1) } }
        }
    
       is the shortcut for 

        { 
          and: [
           age: { eq: 35 }},
           hireDate: { ">", new Date(2010, 0, 1) } }
          ]
        }

#### Valid operators and aliases:

| Operator | Aliases | Description |
| -- | -- | -- |
|gt| '>' | Greater than specified value |
|ge| '>=' | Greater than or equal to specified value |
|lt| '<' | Less than specified value |
|le| '<=' | Less than or equal to specified value |
|eq| '==' | Equal to specified value |
|ne| '!=' | Not equal to specified value |
|startsWith || String starts with specified string |
|endsWith  || String ends with specified string |
|contains || String contains specified string |
|in| | is equal to one of the values in the specified list |
|any|some|the result of applying the specified predicate is true for at least one of the entities resulting from the left hand property expression.|
|all|every|the result of applying the specified predicate is true for all   of the entities resulting from the left hand property expression. |


##### QueryOptions JSON syntax

| Property | Type | Description |
| -- | -- | -- |
| **fetchStrategy** | FetchStrategy name | One of 'FromLocalCache / 'FromServer' |
| **mergeStrategy** | MergeStrategy name | One of  'PreserveChanges' / 'OverwriteChanges' / 'SkipMerge' |