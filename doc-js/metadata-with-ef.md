---
layout: doc-js
---

#Entity Framework as a metadata design tool#

A Breeze application that relies on Entity Framework for data access gets Breeze metadata generation *for free*.

This topic may persuade you to **let Entity Framework generate Breeze metadata** for your .NET classes even **when you aren't using EF in production** or when your service exposes DTO classes that don't map to real database tables.

###Why use EF to generate metadata?###

You can always <a href="http://www.breezejs.com/documentation/metadata-by-hand" title="Metadata By Hand">write metadata by hand</a>. It's not hard. And you'll almost certainly write the metadata by hand if you're building your server in a non-.NET technology.

Let's admit it. Hand-coded metadata is pretty unappealing when you have a large model with a lot of types and you are worried about keeping your metadata in sync as the model evolves. In these circumstances, if you are a .NET developer,  Metadata generation with EF starts to look mighty attractive.

>It doesn't have to be "*either/or*". For example, you could generate metadata for most of the types on the server and then add missing types by hand on the client.

###But I'm not using EF###

That's OK. We're not talking about using Entity Framework for data access. You can keep using NHibernate or raw ADO or your other .NET access technology of choice. We're talking strictly about employing EF as a design time tool. You don't have to use EF at runtime. You don't have to include any EF assemblies in production. No one has to know. It can be our secret.

###But I'm using DTOs###
That's OK too. Your DTOs (<a href="http://en.wikipedia.org/wiki/Data_transfer_object" title="DTO defined" target="_blank">Data Transfer Objects</a>) don't have to correspond to any actual database tables. They only have to *look like* they *could* correspond to database tables that might exist in an alternate universe. 

>EF is an "Object-Relational Mapping" tool so if we're going to map the DTOs to something that "something" has to be "relational". 

Nor will you have to dirty your DTOs with Entity Framework attribute goop. You can keep your DTOs exactly the way they are. We'll use the Code First Fluent API to resolve any mapping issues that can't be handled by EF's conventions.

###How does it work?###

In brief, we

* identify a set of classes for which we need metadata, the classes you have chosen to expose to the client. Call this set the "service model". As noted earlier these classes don't have to be entity classes; they could be DTOs.

* write a **`DbContext`** that describes the service model. We'll only use this `DbContext` for metadata generation. We'll never use it for data access. We can hide it from other assemblies so that *it can't be used for data access*.

* write a Breeze.NET "metadata-only" `EFContextProvider` that wraps this `DbContext`. 

* expose a "metadata" endpoint on our service controller that responds with metadata from our metadata-only `EFContextProvider`.

#Example#

We'll demonstrate this technique with an example web application that accesses a Microsoft "Northwind" database via DTOs. Those DTOs do not map directly to Northwind tables nor to tables of any other database.

<p class="note">The code in this example is adapted from the <a href="http://www.breezejs.com/samples/doccode" title="DocCode sample">Breeze "DocCode" sample</a>. Try that sample to explore Breeze in general and EF metadata generation in particular through the medium of QUnit tests.</p>

There is a `NorthwindDtoController` Web API controller whose methods expose and consume those DTOs which collectively constitute the NorthwindDto service model. 

The Breeze client asks the controller for the metadata it needs  to interpret the JSON objects it receives from the controller. These metadata describe the DTO service model. At no point does the client become aware of the actual entity model on the server.

#The DTO service model #
Here is the complete DTO service model

    namespace Northwind.DtoModels
    {
        public class Customer
        {
            public Guid CustomerID { get; set; }
            public string CompanyName { get; set; }

            public int? FragusIndex { get; set;}        // proprietary value, determined on server
            public int? OrderCount { get; set;}         // calculated on server

            public ICollection<Order> Orders { get; set; }
        }

        public class Order 
        {
            public int OrderID { get; set; }
            public Guid? CustomerID { get; set; }
            public string CustomerName { get; set;}     // copied from Customer
            public DateTime? OrderDate { get; set; }
            public DateTime? RequiredDate { get; set; }
            public DateTime? ShippedDate { get; set; }
            public decimal? Freight { get; set; }
            public int RowVersion { get; set; }

            public Customer Customer { get; set; }
            public ICollection<OrderDetail> OrderDetails { get; set; }
        }

        public class OrderDetail
        {
            public int OrderID { get; set; }
            public int ProductID { get; set; }
            public decimal UnitPrice { get; set; }
            public short Quantity { get; set; }
            public float Discount { get; set; }
            public int RowVersion { get; set; }

            public Order Order { get; set; }
            public Product Product { get; set; }
        }

        public class Product
        {
            public int ProductID { get; set; }
            public string ProductName { get; set; }
        }
    }

These DTO classes are about as clean classes can be. There are no data annotations. No business logic. Just auto-properties.

Those familiar with the Microsoft Northwind schema will notice immediately that this DTO service model is much smaller than the full entity model. Most of the tables are unrepresented. The DTOs corresponding to the tables that remain have fewer properties. 

The `Customer`, for example, has properties mapped to only two of the "Customer" table's twelve columns; this DTO is evidently designed to be read-only on the client.

`Order` and `OrderDetail` have all of the essential properties for creating and updating complete orders. But Order is missing one of its relationships (Order.Employee) and the related entity (`Employee`) is not in the service model.

We also added three properties that are not in the source tables. 

1. `Customer.FragusIndex` is a top-secret property whose value can only be determined on the server and is only available to clients who call the proper controller method. Don't tell anyone but the following url returns a customer with a FragusIndex: `~/breeze/northwindDto/Customer/729de505-ea6d-4cdf-89f6-0360ad37bde7`).

1. `Customer.OrderCount` is the number of orders placed by this customer as calculated on the server.

1. `Order.CustomerName` is a copy of `Order.Customer.CompanyName`.

Three of the DTOs have "navigation properties", properties referring to related DTO classes in the service model. The actual web service may or may not fill these properties in response to client requests. 

They are present in the service model mostly to facilitate generation of navigation property metadata. The Breeze client will be able to navigate from an `Order` to the parent `Customer` even if the server didn't include the customer data with its response to a request for orders. 

>If empty/unused DTO properties really trouble you, you can always fall back to handwritten metadata.

The DTO class names are the same as the entity class names but they're defined in their own namespace ("Northwind.DtoModels" as opposed to "Northwind.Models"). 

This choice simplified our Code First mapping. `CustomerID`, for example, is automatically and correctly interpreted as the key to the `Customer` DTO class. Had we named the class `CustomerDto` and wished to preserve the `CustomerID` property name, we would have to explicitly identify `CustomerID` as the key in the fluent API. 

It also simplified things for our client where we want to refer to the `Customer` type, not the `CustomerDto` type, the name EF would have generated into the metadata. 

>We could finesse that particular complication with more code on both client and server. We don't see the return on that complexity but feel free to give your DTOs custom names (and pay the translation tax) if that's how you roll.

#The metadata-only DbContext #

We create `NorthwindDtoContext` a special `DbContext` class for our DTOs. This `DbContext` will not be used for data access. In fact, it could not be used for data access because it doesn't correspond to an actual database and there is no connection string for it in the Web.config.

We'll make it internal to drive that point home. No one outside its home assembly ever needs to see it.

    internal class NorthwindDtoContext : DbContext
    {
        static NorthwindDtoContext()
        {
            // Prevent attempt to initialize a database for this context
            Database.SetInitializer<NorthwindDtoContext>(null);
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new CustomerDtoConfiguration());
            modelBuilder.Configurations.Add(new OrderDtoConfiguration());
            modelBuilder.Configurations.Add(new OrderDetailDtoConfiguration());
            modelBuilder.Configurations.Add(new ProductDtoConfiguration());
        }

        // Dto versions of these Northwind Model classes
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Product> Products { get; set; }
    }

This `DbContext` is bare bones. Its most notable feature is the class constructor that prevents unintended database generation by passing `null` into `Database.SetInitializer`.

Code First conventions handle most of the mapping that drives metadata . Type-specific configuration methods, written in <a href="http://msdn.microsoft.com/en-us/data/jj591617.aspx" title="EF Fluent API" target="_blank">Entity Framework Fluent API</a> syntax, compensate where the conventions are inadequate. 

Here are the configuration methods:

    internal class CustomerDtoConfiguration : EntityTypeConfiguration<Customer>
    {
        public CustomerDtoConfiguration()
        {
             Property(c => c.CompanyName).IsRequired().HasMaxLength(40);
        }
    }

    internal class OrderDtoConfiguration : EntityTypeConfiguration<Order>
    {
        public OrderDtoConfiguration()
        {
             Property(o => o.CustomerName).HasMaxLength(40);
        }
    }

    internal class OrderDetailDtoConfiguration : EntityTypeConfiguration<OrderDetail>
    {
        public OrderDetailDtoConfiguration()
        {
            HasKey(od => new { od.OrderID, od.ProductID });
            Property(od => od.OrderID)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);
            Property(od => od.ProductID)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);
        }
    }

    internal class ProductDtoConfiguration : EntityTypeConfiguration<Product>
    {
        public ProductDtoConfiguration()
        {
            Property(p => p.ProductName).IsRequired().HasMaxLength(40);       
        }
    }

We don't need much configuration. We only have configuration for some types so we can add validation constraints via the fluent API such as:

    Property(c => c.CompanyName).IsRequired().HasMaxLength(40);

We don't need these configurations if we are willing to dirty our DTO classes with data annotation attributes such as:

    [Required, MaxLength(40)]
    public string CompanyName { get; set; }

#The metadata-only EFContextProvider#

We'll get metadata from a Breeze.NET `EFContextProvider` wrapped around our metadata-only `DbContext`.

If we were using that provider for queries and saves, we'd hold on to it. But we only need it long enough to get the metadata. So we will write a simple property that instantiates a provider, returns the metadata, and forgets about it ... all in one line like this:

    public string Metadata {
        get  {
            return new EFContextProvider<NorthwindDtoContext>().Metadata();
        }
    }

The only remaining question of any significance is "who hosts this metadata property?" That's really up to you.

>Of course as long as the `DbContext` remains`internal`, the host must be a component with its home assembly.

We are fans of the Unit of Work and Repository patterns so we'd probably locate it in one of those components.  You'll find it in the `NorthwindDtoRepository` of the DocCode sample which is responsible for all phases of Northwind database access via these DTO classes.

It remains for the web service to expose a "Metadata" endpoint for Breeze clients as does the `NorthwindDtoController`:

    // ~/breeze/northwindDto/Metadata 
    [HttpGet]
    public string Metadata() {
        return _repository.Metadata;
    }

#Hey ... I said I don't want EF in production#

Of course this approach assumes that EF is part of your runtime environment. 

That is not necessary. You could make a separate design-time utility application whose only purpose is to generate the metadata and write it out to a static JavaScript file (perhaps named *metadata.js*). 

>The only thing this utility and your production app need have in common are the service model DTO classes which you keep in a shared assembly.

The client app loads its `MetadataStore` from that JavaScript file rather than a call to your web service.

This important technique is discussed more thoroughly in documentation elsewhere.

#Review#

It's easy to let Entity Framework generate Breeze metadata from your .NET service model classes even if EF plays no part in your production application. 

You've written the service model classes anyway and you don't have to change them to accommodate EF.

You'll need a project that includes EF assemblies.  That would be a separate project if you're not using EF in production.

You'll write a fake `DbContext` that identifies the classes of the service model and does a little EF Fluent API mapping wherever the Code First conventions come up short. Those conventions are pretty effective so you'll likely write only a small amount of mapping code.

At the last moment you briefly spin up an `EFContextProvider`, ask for the metadata, and ship it.

You are almost certain to write far less code this way than if you'd  spelled out the metadata by hand entirely in JavaScript. Less to write means less to maintain.