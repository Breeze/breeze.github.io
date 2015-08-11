---
layout: doc-net
redirect_from: "/old/documentation/odata-vs-webapi.html"
---
#OData vs Web Api support in Breeze

There are several differences between the capabilities of an OData service and a Web Api service when exposed to Breeze. Most of these differences are simply the result of either the OData specification or the Microsoft 'datajs' JavaScript library for OData (which Breeze uses to provide OData support) not supporting certain capabilities.

These are **NOT** Breeze specific issues.

###Queries

1. OData "selects" involving navigation properties must also include a corresponding "expand". For example:

- Web Api
```
var query = EntityQuery.from("Customers")
.where("companyName", "startsWith", "C")
.select("orders");
```

- OData ( needs the additional ".expand" call.)
```
var query = EntityQuery.from("Customers")
.where("companyName", "startsWith", "C")
.select("orders")
.expand("orders");
```

###Saves

1. OData's HTTP PUT/MERGE semantics **does not** return the entity after an update operation. Breeze Web Api updates **do** return the "updated" entity. This means that Breeze cannot see any server side changes that occur as a result of an update when using OData. As a result:

 - With OData, any change of the value of a server side computed field will not be available in Breeze after an update. If you need these values refreshed, you must requery.

 - With OData, no EntityManager 'EntityChanged' events will occur as a result of an update, because in effect the client side entity is not updated except to note that it's entityState has been changed.

 - **Note:** OData Insert operations, handled by an HTTP POST, return the inserted entity. This is what allows Breeze to correctly reflect the transition from a temporary entity key to a permanent one after a save operation returns.

1. OData optimistic concurrency uses ETags, so you will not see changes to any optimistic concurrency properties if these are exposed on the client. Breeze makes use of the ETags and you will get optimistic concurrency checks, but as noted above, this information is not returned to the client as a change to any of the underlying optimistic concurrency properties.

1. Breeze's WebApi implementation can add or remove an object from the save on the server via the use of the BeforeSave interceptors. These are not available in OData.

1. Breeze's WebApi implementation **does** support a server side KeyGenerator. OData **does not**.

1. Breeze's WebApi implementation **does** support the concept of a "Named Save". OData **does not**.

1. OData **does not** support .NET enum types.


