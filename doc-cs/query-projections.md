---
layout: doc-cs
---

# Projection queries

Breeze can make a "projection query" - a query for selected properties - and transmit only the properties we need.

For example, suppose you have a Person entity and Person has 100 columns/properties including an image property that could be 100KB. We want to present a list of Persons, just their first and last names. We can't afford to download every property of every Person in the list. You can do this with a projection query using 'Select' along with the creation of a new anonymous type for the query result.

> Note: In Breeze.sharp all **Select** (projection) queries **must** project into another type that can be either anonymous or some other previously defined type. 

    var query = new EntityQuery<Person>()
         .Select(p => new { p.FirstName, p.LastName });

This projects the results of the query into a custom data structure that contains only the FirstName and LastName properties of the Person.

You can also perform many other type of projections, including properties and entities that span the object graph. Here are a few examples:

### Single data property projections

    // just the names of the Customers that begin with 'C'
    var query = new EntityQuery<Customer>()
         .Where(c => c.CompanyName.StartsWith("C")
         .Select(c => new { c.CompanyName });
    // don't forget the 'new' - the following will NOT work
    //   .Select(c => c.CompanyName );

### Single navigation property projections

    // Orders of the Customers that begin with 'C'
    var query = new EntityQuery<Customer>()
         .Where(c => c.CompanyName.StartsWith("C")
         .Select(c => new { c.Orders });

### Multiple property projections

    // Selected properties of customers with names starting with ‘C’
    var query = new EntityQuery<Customer>()
        .Where(c => c.CompanyName.StartsWith("C")
        .Select(c => new { c.CustomerID, c.CompanyName, c.ContactName })      

### Related property projections

    // Names of customers with orders that have excessive freight costs
    var query = new EntityQuery<Order>()
        .Where(o => o.Freight > 500)
        .Select(o => new { o.Customer.CompanyName });

Note that projections themselves are not entities and will not be cached on the client. However, if the projection contains entities, these entities will be cached on the client.

This is a valuable feature and you can use it to query and cache all your pick-lists in the application in a single shot. For example, you might create a service method called "Lookups" that returns a single object whose properties are arrays of Color, Status, Size, ProductType, ... you get the idea. That object is essentially a bag of lists that you'll use to populate combo boxes.

Then you make a single query to "Lookups", which returns this bag of lists. Now Breeze doesn't recognize the bag as an entity. But each of the bag's properties is a collection of objects that are described as entities in metadata: Color is an entity type, Status is a type, Size is a type, ProductType is a type. Breeze recognizes that these nested objects are entities and puts them in cache. 

So in a single request, in a single payload, you're able to populate the EntityManager cache with all of the little pick-lists.