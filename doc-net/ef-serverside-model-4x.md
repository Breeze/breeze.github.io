---
layout: doc-net
redirect_from: "/old/documentation/server-side-model.html"
---
# The server-side model

In the sample code we implement the persistence service as an ASP.NET Web API that queries and saves entities with the help of the Entity Framework. You can write the service a different way but this is a convenient approach for .NET developers and the one we'll discuss on this page and the ones that follow.

## Entity Framework

<a href="http://msdn.microsoft.com/en-us/data/ef.aspx">Entity Framework</a> (EF) is a .NET data access technology with an Object Relational Mapper (ORM). The ORM maps a domain-specific object model to the schema of a relational database. It uses that map to move data between entity model objects (instances of .NET classes) and the tables and columns of a relational database.

A Breeze client model maps easily to (almost) every structure supported by Entity Framework 4.x, including:

	- All simple data types
	- Complex types
	- Inheritance (TPH, TPT, TPC)
	- Associations: 1-1, 1-M

The Breeze.js client does not support "many to many" relationships *without a join entity* at this time. You will have to expose the junction/mapping table as an entity.

The Breeze.net server components support EF 6, EF 5.x, and EF 4.x (but no versions prior to v.4.2).  See the [NuGet Packages page](/doc-net/nuget-packages) for more info.

## Build your model

You can build your EF model in two ways:


	- Start from an existing database, derive a conceptual model from the database schema, and generate entity classes from that conceptual model.
	- Write your .NET entity classes first, then tell EF to derive the conceptual model and database mapping from your classes.


The first approach is called "**database first**". You point EF's model design tool at a database and it produces an XML description of the mapping called an EDMX file. You'll see this artifact in the .NET model project.

The second approach is called "**code first**". You write your entity classes to suit your application needs with comparatively little regard for the database, the EF, or its mapping. There is no EDMX file.

The "code first" approach rarely works in the pristine way I described. You usually have to take EF by the hand and walk it in the right direction, perhaps by decorating your classes with helpful attributes or perhaps more explicitly through EF's "fluent" mapping API.

Both approaches have merit. We can use either to build the model for our Breeze application.

> See the [Web Api Configuration](/doc-net/webapi-routing) topic to resolve Entity Framework version issues.

## A simplistic code first model

This isn't a lesson in Entity Framework so we'll just pick one &hellip; and we'll pick "code first".

Here's the one entity class in model for the "Breeze Todo" sample application:

		
		public class TodoItem    {
			public int Id { get; set; }                     // 42

			[Required, StringLength(maximumLength: 30)]     // Validation rules
			public string Description { get; set; }         // "Get milk"

			public System.DateTime CreatedAt { get; set; }  // 25 August 2012, 9am PST
			public bool IsDone { get; set; }                // false
			public bool IsArchived { get; set; }            // false
		}


All properties are data properties whose values belong in the database. There are no navigation properties to related entities (because this is the only entity in the model). The class is public and all properties are fully public so it will serialize to a wire format cleanly on its own. The property names match the table and column names we'd like to see in our database. The primary key can be inferred from the property named "Id" and, being integer, EF will assume that the database is responsible for generating new Ids when inserting new TodoItem rows.

The Description is adorned with two validation attributes, one making the Description required, the other limiting its maximum length to 30 characters. Validation aside, the class could hardly be simpler...or less realistic.

## A more realistic code first model

Let's try something more ambitious. We'll look at excerpts from three related entity classes in the Northwind model, starting with the Customer class.

	public class Customer {

	  public Guid CustomerID { get; internal set; }

	  [Required, MaxLength(40)]
	  public string CompanyName { get; set; }

	  [MaxLength(30)]
	  public string ContactName { get; set;}

	  // ... more properties ...

	  public ICollection<Order> Orders { get; set; }
	}


Some of the properties are decorated with validation attributes (*Required*, *MaxLength*). Entity Framework can use this information to validate changed entities before saving them. [So can Breeze](/doc-net/ef-serverside-validation).

Notice the *Orders* navigation property returns a collection of type Order. Customer has a one-to-many relationship with Order and this property implements that relationship in the server-side class model. Expect to see that same relationship implemented in the Order property of Customer entity in the Breeze JavaScript client-side model.

One more thing before we look at other entity classes. The *CustomerID* is the customer primary key. Entity Framework recognizes that fact but it doesn't know who is responsible for setting the key when adding new customers. By convention, EF assumes the client will set it. That not true in our sample where the Northwind database sets the key. We'll have to tell EF about that...which we could do with another attribute...or we could do with EF's "fluent API" for configuring the model mapping. We used the fluent API in our sample code; look for the *CustomerConfiguration* class when you have a moment.

We're not going to teach you the intricacies of Entity Framework. Plenty of other books, articles, videos and blog posts cover that ground. And EF is really tangential to the Breeze story. We trust it is sufficient to show you that Breeze can accommodate an EF model of this kind.

## The Order entity

The Order entity is on the other end of the *Customer.Orders property. Let's look at it.


	public class Order {
	
	  public int OrderID {get; set;}
	  public Guid? CustomerID {get; set;}
	  public DateTime? OrderDate {get; set;}
	  public decimal? Freight {get; set;}
	
	  // ... more properties ...
	
	  [ForeignKey("CustomerID")]
	  [InverseProperty("Orders")]
	  public Customer Customer {get; set;}
	
	  [InverseProperty("Order")]
	  public ICollection<OrderDetail> OrderDetails {get; set;}
	}

Near the bottom is the *Customer* navigation property. This is the inverse of the customer's *Orders* property and gives us a way to navigate back to the parent Customer.

*CustomerID* is the foreign key that helps us relate the order to its parent customers. Order is the dependent entity in the relationship so it must hold a foreign key value to match the primary key of its parent entity, the customer.

A dependent entity in Breeze must also have a foreign key to its parent.

Did you notice that the *CustomerID* is nullable? That means an order doesn't have to have a parent customer. Probably not a good design but it's the truth in Northwind. Our application will need to know that "Customer" is optional.

Finally, we come to the *OrderDetails* navigation property. This returns an order's line items just as *Customer.Orders* returned a customer's orders. The customer object graph is now three legs long: customer to orders to orderdetails.

## The OrderDetails entity

Here it is:

	public class OrderDetail {
	
	  public int OrderID {get; set;}
	  public int ProductID {get; set;}
	  public decimal UnitPrice {get; set;}
	
	  // ... more properties ...
	
	  [ForeignKey("OrderID")]
	  [InverseProperty("OrderDetails")]
	  public Order Order {get; set;}
	
	  [ForeignKey("ProductID")]
	  public Product Product {get;set;}
	}
This seems familiar. At the bottom are two navigation properties, one to the parent *Order* and another to a *Product*. That makes sense: a real world line item belongs to an order and is associated with a product of some kind, probably in the catalog of products that Northwind sells.

Where is the primary key? There is no obvious candidate such as *OrderDetailID*. The *OrderID* can't be the key because it isn't unique; neither is the *ProductID*. The combination {*OrderID*, *ProductID*} can be unique...and this combination is, in fact, the primary key for OrderDetail. Yes OrderDetail has a **composite key**.

We could use attributes to tell EF about this composite key but we'll use EF's fluent mapping API instead; see the *OrderDetailConfiguration* class in the sample code.

Can Breeze handle entities with composite keys? It sure can.

## Model Metadata

We could continue by tracing the path from OrderDetail to Product to Supplier, then work our way around to the rest of the model. But you get the idea and you can study the model in the sample code at your leisure.

I'd like for you to pause for a moment and reflect on what we've discovered in these three classes along. Although each is simple in its own right, there's rather a lot to know about the entities in a model. For each entity property we have questions that go beyond "*what's the property name?*"...questions such as:


	- What's its datatype?
	- Is it nullable?
	- Is it a navigation property? If so, how does it relate to another entity?
	- Is it a primary key or a foreign key?
	- Is it part of a compound key? If so which part?
	- Is the client or the server responsible for assigning keys to new entities?
	- Is a value required? Is there a minimum or maximum length?


These questions are just as important on the client. A client customer entity has a required CompanyName property and a Guid primary key that it shouldn't touch. The application ought to limit the length of the CompanyName to 40 characters; it would be pointless to try to save a customer with a 50 character name.

A customer on the JavaScript client will have orders and those orders will have order details and they'll all be wired together in the same manner as their server-side companions.

Imagine a model with 30, 50, 100, or 200 entities, each with an average of 10 properties. No one wants to re-code this kind of metadata in JavaScript for all of those entities and properties.

You don't have to with Breeze. There's a .NET Breeze component that scoops up this information and packages it as a metadata document. Your persistence service can send this document to the Breeze client. The Breeze client interprets the metadata and builds a conforming JavaScript model with the same structure and constraints as the server-side model.

We'll see how this works when we get to the client. Our next stop is the [Entity Framework *DbContext*](/doc-net/ef-dbcontext) which is the gateway to the database.
