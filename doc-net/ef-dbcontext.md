---
layout: doc-net
redirect_from: "/old/documentation/entity-framework-dbcontext.html"
---
# DbContext

The Basic Breeze teaching tests make requests for data services to an ASP.NET Web API controller. The controller forwards those requests to the .NET Entity Framework (EF).

This arrangement is typical for many Breeze applications and, although far from necessary, it is the arrangement we're describing in "Basic Breeze".

We've already defined the EF code first model that supports our <a href="/samples/doccode">DocCode </a>sample tests. We'll need an Entity Framework *DbContext* to configure and access that model.

We're *using* Entity Framework, not *teaching* it, so we'll simply show you our *NorthwindDbContext* (located in the *Models* folder) and highlight the key points.


	public class NorthwindContext : DbContext
	{
	    private const string _contextName = "NorthwindContext";
	    public static string ContextName { get { return _contextName; } }
	    public NorthwindContext() : base(ContextName )
	    {
	        Configuration.ProxyCreationEnabled = false;
	        Configuration.LazyLoadingEnabled = false;
	    }
	
	    protected override void OnModelCreating(DbModelBuilder modelBuilder)
	    {
	        // Table names match singular entity names by default (don't pluralize)
	        modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
	
	        modelBuilder.Configurations.Add(new CustomerConfiguration());
	        modelBuilder.Configurations.Add(new OrderDetailConfiguration());
	        modelBuilder.Configurations.Add(new PreviousEmployeeConfiguration());
	    }
	
	    // DbSets begin here</pre>


The NortwindContext constructor calls the base class constructor overload that takes a "context name"; the context name serves also as a key to the  database connection string located in the *Web.config*. We'll make that name publicly accessible; we'll need it later.

The next two lines of configuration are important. EF should only get data from the database when told to do so explicitly. We don't want EF to accidentally lazy load navigation properties such as *Customer.Orders*. To ensure that doesn't happen, we disable both ProxyCreation and LazyLoading.

Next, we override the OnModelCreating method and use EF's fluent API to configure the mapping between our classes and the database.

By convention, EF will assume that our singular entity names should be mapped to plural table names. That's not how the Northwind database is set up. The table backing the Customer entity should be called "Customer" (singular), not "Customers" (plural). So we immediately remove EF's "pluralizing" convention.

Several entity-specific configurations follow. These configurations could have been written inline but we follow the tidier practice of encapsulating each entity's configuration in a dedicated class. Feel free to examine these configuration classes on your own; while necessary to get the model mapping right, they are otherwise of no interest to Breeze.

*DbSet* properties occupy the remainder of the class. Each *DbSet* property identifies an entity class to be managed by the *NorthwindContext* and coincidentally makes it a little easier for the developer to express query and save operations in terms of the entities involved. 


	public DbSet<Category> Categories { get; set; }
	public DbSet<Customer> Customers { get; set; }
	public DbSet<Employee> Employees { get; set; }
	public DbSet<EmployeeTerritory> EmployeeTerritories { get; set; }
	public DbSet<Order> Orders { get; set; }
	public DbSet<OrderDetail> OrderDetails { get; set; }
	public DbSet<PreviousEmployee> PreviousEmployees { get; set; }
	public DbSet<Product> Products { get; set; }
	public DbSet<Region> Regions { get; set; }
	public DbSet<Role> Roles { get; set; }
	public DbSet<Supplier> Suppliers { get; set; }
	public DbSet<Territory> Territories { get; set; }
	public DbSet<User> Users { get; set; }
	public DbSet<UserRole> UserRoles { get; set; }
	public DbSet<InternationalOrder> InternationalOrders { get; set; }


## Multiple assemblies and namespaces

Our samples tend to combine the entity model classes, Entity Framework components, MVC, and scripts all in one big project. We wouldn't do that in a real application. We'd have separate assemblies for the major concerns. We might keep our entity models in a *Models *assembly (with namespace *Todo.Models*) and put our *DbContext in a *Data *assembly (with namespace *Todo.Data*). That's not a problem for the Breeze server-side components which will find them both.

That's not a problem for BreezeJS clients either; as of Breeze v.0.83.3, the namespace of Model classes can be different from the namespace of the *DbContext* (or *ObjectContext*).

## Next Step

That's just about our last word on Entity Framework. Time to move on to the [Web API controller](/doc-net/webapi-controller).

### Appendix: EF Versions

There are many Entity Framework versions floating about. We had to target one of them when we built our *Breeze.WebApi.dll* which you just added to the project. *Breeze.WebApi.dll* was built with Entity Framework version 4.4 for .NET 4.0. Your application may use a different .NET 4.0 version or perhaps your application is built for .NET 4.5 and EF version 5.0.  It there's a mismatch, you could get a runtime exception such as:

> Could not load file or assembly 'EntityFramework, Version=4.3.1.0, Culture=neutral, PublicKeyToken=b77a5c561934e089' or one of its dependencies. The located assembly's manifest definition does not match the assembly reference. (Exception from HRESULT: 0x80131040)

In many cases you can add an <a href="http://msdn.microsoft.com/en-us/library/2fc472t2%28v=vs.110%29.aspx" target="_blank">assembly redirect</a> to the *Web.config* that points to the version you're using.

- Open Web.config
- Find the <runtime> tag
- insert something like


	<dependentAssembly>
		<assemblyIdentity name="EntityFramework" publicKeyToken="b77a5c561934e089" culture="neutral" />
		<bindingRedirect oldVersion="4.0.0.0-5.0.0.0" newVersion="5.0.0.0" />
	</dependentAssembly>

In this example, we're redirecting to version 5.0.0.0.

As a last resort, you can download the source code for the *Breeze.WebApi* project, adjust its platform and Entity Framework references, and compile your own version.
