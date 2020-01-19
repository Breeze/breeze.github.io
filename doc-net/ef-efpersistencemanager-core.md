---
layout: doc-net
---
# EFPersistenceManager

> **NOTE: This page is for Breeze running on .NET Core**<br>
> [Go here for .NET 4.x version](/doc-net/ef-contextprovider-4x)

Many application servers use an ASP.NET Web API controller to handle the client's HTTP requests. And they use the Entity Framework (EF) to model and access a SQL database. Breeze has an ***EFPersistenceManager** component to make controller interactions with EF a little easier. It's basically a wrapper around your application's *DbContext* that mediates between the Breeze controller and EF. It takes care of a lot of routine plumbing.

You can use the EFPersistenceManager "as is", right out-of-the-box when you're getting started. But you will almost certainly customize it to add your application's business logic. For example, you will want to **[intercept save requests and validate them](#SaveInterception)**. You may want to do something special immediately before or after the provider tells EF to save entities to the database. And you may want to dynamically control how the provider creates the EntityFramework ObjectContext or DbContext at the core of the EF operations.

This topic explores the *EFPersistenceManager* in greater detail and explains how to subclass it to get the behavior you need.

## Details

Any Breeze application that will be communicating with an Entity Framework backed domain model will contain a *DbContext* that looks something like what is shown below:

```
	public partial class NorthwindContext : DbContext {

		public virtual DbSet<Order> Orders { get; set; }
		public virtual DbSet<Customer> Customers { get; set; }
		public virtual DbSet<Role> Roles { get; set; }

	}
```

This DbContext will in turn be wrapped in an **EFPersistenceManager**.  As mentioned earlier you can use the EFPersistenceManager "as is", right out-of-the-box when you're getting started. 

In many cases, however, it will be important to "intercept" calls to the EFPersistenceManager and provide additional logic to be performed at specific points in either the query or save pipeline.

These interception points may be accessed by subclassing the EFPersistenceManager and overriding specific virtual methods. This will look something like:

```
	public class NorthwindPersistenceManager : EFPersistenceManager<NorthwindDbContext> {

	  public NorthwindPersistenceManager(NorthwindDbContext dbContext) : base(dbContext) { 
    }
	
		protected override bool BeforeSaveEntity(EntityInfo entityInfo) {
			// return false if we don't want the entity saved.
			// prohibit any additions of entities of type 'Role'
			if (entityInfo.Entity.GetType() == typeof(Role)
				&& entityInfo.EntityState == EntityState.Added) {
				return false;
			} else {
				return true;
			}
		}
	
		protected override Dictionary<Type, List<EntityInfo>> BeforeSaveEntities(Dictionary<Type, List<EntityInfo>> saveMap) {
			// return a map of those entities we want saved.
			return saveMap;
		}
	}
	
```

 An instance of this EFPersistenceManager ( NorthwindPersistenceManager) is then used to provide services to a WebApi Controller. This will look something like:

```
  [Route("breeze/[controller]/[action]")]   // Note that the `Route` attribute specifies the `[action]` as part of the path.
  [BreezeQueryFilter]
  public class NorthwindController : Controller

    // Add a new `persistenceManager` field to the `NorthwindController` class, and add a constructor that takes a NorthwindDbContext and sets the `persistenceManager` 
    // field.  This will be called by dependency injection.
    private NorthwindPersistenceManager persistenceManager;
    public NorthwindController(NorthwindDbContext dbContext) {
        persistenceManager = new NorthwindPersistenceManager(dbContext);
    }

    [HttpGet]
    public IQueryable<Customer> Customers() {
        return persistenceManager.Context.Customers;
    }

    [HttpGet]
    public IQueryable<Order> Orders() {
        return persistenceManager.Context.Orders;
    }

		[HttpGet]
		public IQueryable<Customer> CustomersAndOrders() {
			return persistenceManager.Context.Customers.Include("Orders");
		}

		[HttpGet]
		public IQueryable<Customer> CustomersStartingWithA() {
			return  persistenceManager.Context.Customers
					.Where(c => c.CompanyName.StartsWith("A"));
		}
	
		[HttpPost]
		public SaveResult SaveChanges(JObject saveBundle) {
			return persistenceManager.SaveChanges(saveBundle);
		}
		
```					 

