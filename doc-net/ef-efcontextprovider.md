---
layout: doc-net
redirect_from: "/old/documentation/efcontextprovider.html"
---
# EFContextProvider

Many application servers use an ASP.NET Web API controller to handle the client's HTTP requests. And they use the Entity Framework (EF) to model and access a SQL database. Breeze has an ***EFContextProvider** component to make controller interactions with EF a little easier. It's basically a wrapper around your application's *ObjectContext* or *DbContext* that mediates between the Breeze controller and EF. It takes care of a lot of routine plumbing.

You can use the EFContextProvider "as is", right out-of-the-box when you're getting started. But you will almost certainly customize it to add your application's business logic. For example, you will want to **[intercept save requests and validate them](#SaveInterception)**. You may want to do something special immediately before or after the provider tells EF to save entities to the database. And you may want to dynamically control how the provider creates the EntityFramework ObjectContext or DbContext at the core of the EF operations.

This topic explores the *EFContextProvider* in greater detail and explains how to subclass it to get the behavior you need.

## Details

Any Breeze application that will be communicating with an Entity Framework backed domain model will contain either an *ObjectContext* or a *DbContext* that looks something like what is shown below:


      public partial class NorthwindIBContext : System.Data.Objects.ObjectContext {
      // automatically generated code from the EDMX designer
      }

Or

	public partial class NorthwindIBContext : System.Data.Entity.DbContext {
	  // Code-First DBSet definitions and any model initialization code
	}

This ObjectContext or DbContext will in turn be wrapped in an **EFContextProvider**. The Breeze.WebApi.EFContextProvider class may be found in the Breeze.WebApi dll. An instance of this EFContextProvider is then used to provide services to a standard .NET MVC 4 ApiController (Sytem.Web.Http.ApiControllerApiController). This will look something like:

	public class NorthwindIBModelController : System.Web.Http.ApiController {
	
	    readnnly EFContextProvider<NorthwindIBContext> ContextProvider =
	         new EFContextProvider<NorthwindIBContext>();

The remainder of the ApiController will then make use of this instance of the EFContextProvider as a helper object to provide an implementation for each of the ApiController's externally exposed methods. Again something like this:

	[BreezeController]
	public class NorthwindIBModelController : System.Web.Http.ApiController {
	
	    readonly EFContextProvider<NorthwindIBContext> ContextProvider =
	         new EFContextProvider<NorthwindIBContext>();
	
	    [HttpGet]
	    public String Metadata() {
	      return ContextProvider.Metadata();
	    }
	
	    [HttpPost]
	    public SaveResult SaveChanges(JObject saveBundle) {
	      return ContextProvider.SaveChanges(saveBundle);
	    }
	
	    [HttpGet]
	    public IQueryable<Customer> Customers() {
	      return ContextProvider.Context.Customers;
	    }
	
	    [HttpGet]
	    public IQueryable<Order> Orders() {
	      return ContextProvider.Context.Orders;
	    }
	
	    [HttpGet]
	    public IQueryable<Customer> CustomersAndOrders() {
	      return ContextProvider.Context.Customers.Include("Orders");
	    }
	
	    [HttpGet]
	    public IQueryable<Customer> CustomersStartingWithA() {
	      return  ContextProvider.Context.Customers
	         .Where(c => c.CompanyName.StartsWith("A"));

<a name="SaveInterception"></a>In many cases, however, it will be important to "intercept" calls to the EFContextProvider and provide additional logic to be performed at specific points in either the query or save pipeline.

These interception points may be accessed by subclassing the EFContextProvider and overriding specific virtual methods. This will look something like:

	public class NorthwindContextProvider: EFContextProvider<NorthwindIBContext>  {
	    public NorthwindContextProvider() : base() { }
	
	    protected override bool BeforeSaveEntity(EntityInfo entityInfo) {
	      // return false if we don't want the entity saved.
	      // prohibit any additions of entities of type 'Role'
	      if (entityInfo.Entity.GetType() == typeof(Role)
	        &amp;&amp; entityInfo.EntityState == EntityState.Added) {
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
	
	  [BreezeController]
	  public class NorthwindIBModelController : ApiController {
	
	    NorthwindContextProvider ContextProvider = new NorthwindContextProvider();
	
	    // other code shown earlier with no change.
	  }

The current interception points for the EFContextProvider are described below. However, we do expect this list to grow as we receive additional feedback from all of you. Please feel free to contribute to our UserVoice regarding any specific extension that you think would be useful here.

## Create your ObjectContext/DbContext Dynamically

The *EFContextProvider calls a virtual method *T CreateContext() when it creates your ObjectContext/DbContext of type 'T'. The base implementation looks like this:

	protected virtual T CreateContext() {
	    return new T();
	}

Override and replace that in your *EFContextProvider* subclass and you will be able to make your context of type 'T' just the way you like it.

**N.B.: The base *EFContextProvider* will still do a little post-creation configuration** to make sure it behaves as the EFContextProvider requires; it does not want the context doing any lazy loading or creating proxies. So if 'T' is an *ObjectContext*, the provider will do this:

	objCtx.ContextOptions.LazyLoadingEnabled = false;

and if 'T' is a *DbContext it will do this:

	dbCtx.Configuration.ProxyCreationEnabled = false;
	dbCtx.Configuration.LazyLoadingEnabled = false;

## Why not IDisposable?

Both the EF *ObjectContext* and the *DbContext* implement *IDisposable*. In Microsoft Web API controller samples they dispose of the EF context. But the Breeze.NET *EFContextProvider* is **not disposable** and makes no attempt to dispose of the EF context. Is that a mistake?

We think not for a couple of reasons. First, the *EFContextProvider* should have the same lifetime as the *ApiController* and when the API controller is garbage collected any EF resources should be disposed of by the finalizer. Second, Joseph Albahari, the renowned author of "C# 4.0 in a Nutshell", says you don't have to:

> *Although DataContext/ObjectContext implement IDisposable, you can (in general) get away without disposing instances. Disposing forces the context's connection to dispose - but this is usually unnecessary because [Link to SQL] and EF close connections automatically whenever you finish retrieving results from a query. *[p.352]

Not convinced? You have direct access to the *Context* object; cast it to *IDisposable* and call *Dispose* yourself.

