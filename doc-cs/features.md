---
layout: doc-cs
---

# Features

*Breeze.sharp* is a library for rich client applications written in .NET.

It concentrates on the challenge of building and maintaining highly responsive, data-intensive applications in which users search, add, update, and view complex data from different angles as they pursue solutions to real problems in real time.

Features include:

### **Rich queries**

- Write simple and complex queries using standard LINQ query syntax:
	- Simple conditions (id == 42, amount > 100, name starts with “Bob”)
	- Compound conditions (name is “Bob” or “Robert”)
	- Conditions with functions (length(name) > 30)
	- Conditions on related entities (customers with orders shipped to California)
	- Sort, page, take first ‘n’
	- Expand the query result to include related entities in the payload (eager loading)
	- Select a subset of properties; flatten complex object graphs with projections
- Query a remote service with a full OData-compliant URL.
- Merges query results into cache, adding new entities and updating others while preserving unsaved changes.
- Use the same query object and query language to filter entities in the local cache.

### **Client-side caching**

- Caching entities locally on the .NET client.
- Navigation among entities in cache, e.g., Customer to Orders to OrderDetails to Product … and back.

### **Change tracking**

- Entities are self-tracking; they know when they are new, changed, marked-for-delete, or unchanged.
- Refresh an entity to its current state on the server or revert changed entities to their original values with a single command.
- Publishes property-changed and other notifications about the entities that enter, leave, and change in cache.

### **Validation**

- Validates entire entities and individual property values, automatically or on-demand, with a combination of discovered and custom rules.
- Validation error messages can be customized or localized.

### **Pluggable back-end**

- Full integration with the Entity Framework.
- Supports WebAPI and OData back-ends.
- Works with NoSQL, non-.NET, and SOA back-ends. (Samples under development.)

### **Data management**

- Create entities dynamically based on metadata that you control and extend.
- Id generation strategies handle a wide variety of client and store-generated key schemes; use ours or write your own.
- Export and reimport entities to device local storage to meet offline and reliability requirements.
- Create multiple caches to segment and isolate data changes in “sandboxes”.
- Combine entities from multiple remote services in the same cache.
- All service operations return JavaScript promises.
- Entities support Complex Types and Enumerations as properties.
 
### **Batched saves**

- Save pending changes to a remote service in a single request.
- Mix entities of different types in the same change-set (Customers, Orders, OrderDetails).
- Mix operations (add, update, delete) in the same change-set.
- Save the change-set as a single transaction.
- Detect and resolve concurrency conflicts.

### **Library and Tooling support**

- Open API that allows additional front or back-ends to be plugged in.

### **Supported by IdeaBlade**

- Developed and supported by IdeaBlade, since 2001 a leader in rich client application libraries.
- Extensive API documentation with examples and links to source code.
- Quality control through numerous automated test collections.
- Paid support options, training, and consulting services to ensure that you succeed.