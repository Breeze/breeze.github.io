---
layout: doc-net
redirect_from: "/old/documentation/web-api-controller.html"
redirect_from: "/doc-net/webapi-controller.html"
---
# The ASP.NET Web API controller

> **NOTE: This page is for Breeze running on .NET 4.x**<br>
> [Go here for .NET Core version](/doc-net/webapi-controller-core)

The Basic Breeze teaching tests in the [DocCode sample](/doc-samples/doccode "Breeze 'DocCode' teaching sample") demonstrate the Breeze `EntityManager` making requests of a **Breeze ASP.NET Web API controller**.

The [ASP.NET Web API](https://dotnet.microsoft.com/apps/aspnet/apis "Microsoft ASP.NET Web API ") is a framework for building HTTP services. Its simplicity has made it instantly popular with .NET backend developers who are used to struggling with Microsoft’s enormously complex, SOAP-based, WCF communications stack.

In a nutshell, the Web API routes an HTTP request (GET, POST, PUT, DELETE, etc) to an action method of a controller. The controller developer has easy access to the complete client request but is usually most interested in the URL query parameters or the body of the request. There's more to it of course but that's the gist of it.

The Breeze Controller is just one of many ways to serve a Breeze client with either .NET or non-Net technologies. It is among the easiest and most capable server stacks available to .Net developers. You'll see it driving many of the Breeze samples. 

# "*One controller to rule them all ...*"

When targeting a Breeze client, it is usually preferable to write a Web API **controller per *service***. 

The [Breeze Getting Started tutorial](https://github.com/Breeze/northwind-demo) creates a selection of endpoints grouped into a single 'Controller' on a single entity model. This is our recommended pattern for Breeze services. Note that if you have more than one entity model, we recommend a seperate controller for each.

### Controller-per-type

You *could* adopt the customary *controller-per-**type*** implementation pattern: write one controller for `Customer`, another for `Order`, another for `Product`, etc. 

But this is tedious and usually unnecessary. As we'll see, Breeze can radically reduce the number of controller methods that you'll need for each type ... typically to one query method. Most Breeze clients combine the discrete entity insert, update, and delete operations into compound "change-sets" and send that change-set to a controller save method. The Breeze controller may only require a single save method to support an entire suite of entity types. 

>You can have multiple "save changes" methods to support "[named saves](/doc-js/saving-changes)"; here we're describing the simple case.

If you followed the *controller-per-type* approach, you'd be writing numerous controllers, each with a single method ... the query method. In our opinion, that's a maintenance burden without a compensating benefit. 

We recommend instead that you consolidate into one Web API controller *per service*. The notion of "service" typically is aligned with a "feature set" and corresponding business model. 

# A single BreezeController example

The "NorthwindCore" model only has a few entity types so its Web API controller is small, making it a good place for us to start. Here’s a `BreezeController` associated with the NorthwindCore model:

### Add query methods to the BreezeController

Add a HttpGet method returning `IQueryable<>` for each of the `Customer`, `Order`, and `Product` types in the data model.  We won't do one for `OrderItem` because we will only query those with an `Order`
```

  [Route("api/[controller]/[action]")]   \\ Note that the `Route` attribute specifies the `[action]` as part of the path.
  [BreezeQueryFilter]
  public class BreezeController : Controller
    \\ Add a new `persistenceManager` field to the `BreezeController` class, and add a constructor that takes a NorthwindCoreContext and sets the `persistenceManager` 
    \\ field.  This will be called by dependency injection.

    private NorthwindCorePersistenceManager persistenceManager;
    public BreezeController(NorthwindCoreContext dbContext) {
        persistenceManager = new NorthwindCorePersistenceManager(dbContext);
    }

    [HttpGet]
    public IQueryable<Customer> Customers() {
        return persistenceManager.Context.Customer;
    }

    [HttpGet]
    public IQueryable<Order> Orders() {
        return persistenceManager.Context.Order;
    }

    [HttpGet]
    public IQueryable<Product> Products() {
        return persistenceManager.Context.Product;
    }
    ...   
  }   
```  

# It's just a Web API Controller

A "Breeze Controller"  is just a Web API controller that has been extended to support a "happy path" for Breeze .NET developers.
 
Notice that there is no Breeze base class. The `BreezeController` inherits directly from the `Controller` Web API base class. A Breeze Controller fits into the Web API  pipeline like other controllers. It works with the same **Web API security schemes** as other controllers.

# BreezeControllerAttribute

A Breeze Web API controller and an out-of-the-box Breeze client share a common understanding about the nature and format of HTTP requests, responses, and payloads. The `BreezeQueryFilter` configures the Web API pipeline to conform to that understanding when interpreting breeze queries. 

>Your Breeze Web API Controller may co-habitate with other, non-Breeze controllers that have different requirements. The `BreezeQueryFilter` attribute configuration applies to *this controller only*.


# Configuring Serialization, Exceptions and Connection strings

Listed below is a code fragment from our [Creating a Breeze Server example.] (https://github.com/Breeze/northwind-demo/blob/master/server/STEPS-Server-Core3.md)

In this fragment in the `ConfigureServices` method, we need to 
1. Enable MVC, so our `BreezeController` class can be used to handle requests
2. Set JSON serialization options so the client-side Breeze can send and receive entities. All communications between Breeze clients and Web API controllers are formatted as JSON. A Web API formatter serializes .NET objects as JSON. Out-of-the box, the Web API installs a very simple default formatter that isn't configured optimally for Breeze clients. Note that we explicitly reconfigure the formatter to remove the default behaviour that automatically renames entity and property names during serialization.  Instead we will use the BreezeJS  [`NamingConvention`](/doc-js/metadata#NamingConvention) mechanism instead.
3. Add an exception filter, so errors are communicated to the Breeze client
4. Add the DbContext to dependency injection, so our BreezeController can receive it

add some MVC options to let the Breeze client communicate with the server:

```
  namespace NorthwindServer {
    public class Startup     {
      private IConfiguration configuration;
      public Startup(IConfiguration configuration) {
          this.configuration = configuration;
      }

      // This method gets called by the runtime. Use this method to add services to the container.
      // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
      public void ConfigureServices(IServiceCollection services)  {
        var mvcBuilder = services.AddMvc();

        services.AddControllers().AddNewtonsoftJson(opt => {
            // Set Breeze defaults for entity serialization
            var ss = JsonSerializationFns.UpdateWithDefaults(opt.SerializerSettings);
            if (ss.ContractResolver is DefaultContractResolver resolver)
            {
                resolver.NamingStrategy = null;  // remove json camelCasing; names are converted on the client.
            }
            ss.Formatting = Newtonsoft.Json.Formatting.Indented; // format JSON for debugging
        });
        // Add Breeze exception filter to send errors back to the client
        mvcBuilder.AddMvcOptions(o => { o.Filters.Add(new GlobalExceptionFilter()); });

        // Add DbContext using connection string
        var connectionString = configuration.GetConnectionString("NorthwindCore");
        services.AddDbContext<NorthwindCoreContext>(options => options.UseSqlServer(connectionString));

      }

    ...

    }
  }
```


<a name="breeze-query-filter"></a>

# BreezeQueryFilterAttribute

The `BreezeQueryFilterAttribute` converts Breeze client query URLs into LINQ expressions.

For example, a client could query for Customers with 'City' names starting with 'C', sorted by 'Company Name', with this Breeze query on the client. 
```
  const query = new EntityQuery('Customers')
    .where('lastName', 'startsWith', 'C')
    .orderBy('companyName);
  const customers = await this.entityManager.executeQuery(query);
```  
 This in turn would be converted to the following URL formatted with an encoded json query string. 

```
  .../api/Breeze/Customers?%7B%22where%22%3A%7B%22City%22%3A%7B%22startswith%22%3A%22C%22%7D%7D%2C%22orderBy%22%3A%5B%22CompanyName%22%5D%7D
```

The Web API router finds a corresponding controller GET action method ... which is the `Customers` method of our `BreezeController`:
```
    [HttpGet]
    public IQueryable<Customer> Customers() {
    	return _contextProvider.Context.Customer;
    }
```
The `BreezeQueryFilterAttribute` translates the URL Query parameters into a revision of the LINQ `IQueryable` returned by controller method, resulting in LINQ query expressions such as this one:

    Customers.Where(c => c.StartsWith('C').OrderBy(c => c.CompanyName));

Then the Web API takes over, executes the query (invoking the query's LINQ provider), and serializes the query results back to the client.

The `BreezeControllerAttribute` automatically applies a `BreezeQueryFilterAttribute` to every controller GET method that returns an `IQueryable`.

You don't have to add the attribute to each controller method yourself ... unless you want to do something special with that method.


# EFContextProvider

Many .NET server developers turn to the Microsoft's [Entity Framework](http://msdn.microsoft.com/en-us/data/ef.aspx) for relational data modeling and relational data access. It's so popular that Breeze offers a special [`EFContextProvider` class](/doc-net/ef-efcontextprovider-4x) to facilitate development of .NET servers for Breeze clients.

This provider encapsulates three main functions:

1. Instantiation of a context for accessing the data store
1. Generation (or acquisition) of metadata to send to Breeze clients
1. Processing "change-set" save requests

The `TodosController` defines a `_contextProvider` field, initialized to a fresh instance of `EFContextProvider<T>`.:

    readonly EFContextProvider<TodoDbContext> _contextProvider =
        new EFContextProvider<TodoDbContext>();

`EFContextProvider<T>` is a generic class that wraps a single EF model’s `DbContext`.

>If you wrote an EF "database first" model rather than a "code first" model, you *may* have an `ObjectContext` instead of a `DbContext`. Pass your `ObjectContext` as the type parameter instead of a `DbContext`.

### Better style

Your controller could instantiate an out-of-the-box `EFContextProvider` from Breeze exactly as we show here. 

We don't do that in real world code. The approach you see here is fine for demos but it isn't clean, robust or testable.

1. The controller and the context are separate concerns and we prefer to define them in separate classes. We'd start by sub-classing `EFContextProvider<TodoDbContext>` as `TodoContext`.

1. We prefer that the controller work with a higher level abstraction such as a "repository" class than work directly with a context provider. We might write a `TodoRepository` that instantiates the `TodoContext` and have it implement `ITodoRepository` for improved testability.

1. We'd make our controllers easier to test by injecting the `ITodoRepository` rather than "new-ing" the concrete `TodoRepository`. The Web API is [friendly to dependency injection](http://www.asp.net/web-api/overview/extensibility/using-the-web-api-dependency-resolver).

### Alternatives to Entity Framework

The `EFContextProvider` derives from the Breeze [`ContextProvider`](/doc-net/ef-efcontextprovider-4x "ContextProvider") which can be the base class for alternative providers that don't involve Entity Framework ... and don't store data in a relational database either. 

Breeze ships [components for NHibernate](/doc-net/nh-details) developers.  The [in-memory "No DB" sample](/doc-samples/no-db) has a custom `ContextProvider` that doesn't write to a database. The source for any of these providers can guide you in writing your own provider.

But back to our story .. and the first of the "Breeze Controller"  specialty methods.

## The Metadata controller method

The Breeze JavaScript client requires metadata to query the service, create new entities, and save changes. These metadata describe the client-side entity model and how to translate it into the service model that is understood by the persistence service.

As we saw earlier, it takes a fair amount of [metadata](/doc-js/metadata) to adequately describe a model. Fortunately, an `EFContextProvider` tell Entity Framework to generate metadata for the Breeze client so that the JavaScript developer doesn’t have to [write it by hand](/doc-js/metadata-by-hand). 

The Breeze client requests metadata from the server by calling upon the controller's `Metadata` method.

    // ~/breeze/todos/Metadata 
    [HttpGet]
    public string Metadata() {   
        return _contextProvider.Metadata(); // delegate to the ContextProvider
    }

## A query controller method

The `TodosController` has only one model type so it has just one query method

    // ~/breeze/todos/Todos
    // ~/breeze/todos/Todos?$filter=IsArchived eq false&$orderby=CreatedAt 
    [HttpGet]
    public IQueryable<TodoItem> Todos() {
        return _contextProvider.Context.Todos;
    }

This method returns an `IQueryable` of an entity type in the model, the `TodoItem` type in this case. 

The `IQueryable<TodoItem>` is important. It means that this action does not return data!  Instead, it returns a LINQ query object that can be extended with additional query parameters to filter, order, page, project, and expand the query results. A comment shows two URL examples that Web API would route to this method. The first gets all `TodoItems`; the second returns non-archived `TodoItems`, sorted by creation date. 

The Web API executes the query after the `BreezeQueryableAttribute` applies these parameters to the LINQ expression (the `IQueryable`) returned by the method [as we discussed above](#breeze-queryable).

Thanks to the power and flexibility of OData query syntax, a single controller action method can satisfy all of this particular application’s `TodoItem` query requirements. We don’t have to write a separate query action method for every application query request.

### Query actions per entity type

The "Todos" model only has one entity so the `TodosController` only has one query action.  The "Northwind" model exposes many more entity types … and its `NorthwindController` has corresponding query actions, implemented in the same manner, as seen in this elided extract:

    BreezeController]
    public class NorthwindController : ApiController {

      [HttpGet]
      public IQueryable<Customer> Customers() {
    	return _contextProvider.Context.Customers;
      }
    
      [HttpGet]
      public IQueryable<Order> Orders() {
    	return _contextProvider.Context.Orders;
      }
    
      [HttpGet]
      public IQueryable<OrderDetail> OrderDetails() {
    	return _contextProvider.Context.OrderDetails;
      }
    
      [HttpGet]
      public IQueryable<Product> Products() {
    	return _contextProvider.Context.Products;
      }
    }

### Client-initiated "eager" queries

You do not have to publish a query method for every entity type. For example, you might choose not to publish an `OrderDetails` action; `OrderDetail` entities belong exclusively to their parent `Orders`. You might feel that a client should only access them through their parent orders.

How do you get the `OrderDetails` to the client if there is no controller action for them? Using OData "expand". Here's an example Breeze JS client query:

    breeze.EntityQuery.from('Orders')
          .where('CustomerID', '==', alfredsID)
          .expand('OrderDetails') // <--- gets OrderDetails of "Alfreds" orders
          .using(manager).execute()
          .then(successCallback).catch(failCallback); 

On the server, the `BreezeQueryableAttribute` adds an Entity Framework "include" clause. The executed LINQ query returns the "Alfreds" order and that order's line items in the same payload.

After eagerly fetching the related order line items with this query, the client can navigate from an order to its details (e.g, in Knockout you could write `someOrder.OrderDetails()`) without first loading those details in a separate step.

### Specialized query methods

Suppose you don't want to expose an "OrderDetails" controller method and you don't want clients to send query requests with the "expand" clause. You can write a specialized controller query method that internally includes the `OrderDetails` in the payload automatically:

    [HttpGet]
    public IQueryable<Order> OrdersAndDetails()
    {
        return _contextProvider.Context.Orders.Include('OrderDetails');
    }

This time the client queries for orders by targeting the “OrdersAndDetails” endpoint. The method ensures that the line items come along for the ride. The client developer can still filter and page the orders, but he doesn’t have to specify the expansion.

    breeze.EntityQuery
	      .from('OrdersAndDetails')  // <--- Specify the "OrdersAndDetails" resource
          .where('CustomerID', '==', alfredsID)
          .using(manager).execute()
          .then(successCallback).catch(failCallback); 

This example is probably not a great case for a specialized query action. It’s easy to put the “expand” on the client query rather than clutter up the controller with extra actions. But the technique is worth knowing because someday you will have a query that *should be* or *can only be* written on the server.

# The SaveChanges method

When the Breeze client calls `saveChanges()`, the `EntityManager` posts a bundle of JSON entity changes to the controller’s `SaveChanges` method. 

The bundle could contain a mix of different types (`Customer`, `Order`, `OrderDetail`) and different operations (add, update, delete). They all travel together in the body of the POST.

The Web API delivers the bundle to the controller’s `SaveChanges` method as a JSON object (`JObject`). You could unpack that bundle yourself but it is far more convenient to let the `_contextProvider.SaveChanges` method handle that … and save those changes in EF as a single transaction:

    [HttpPost]
    public SaveResult SaveChanges(JObject saveBundle) {
      return _contextProvider.SaveChanges(saveBundle);
    }

### Server-side Validation

Are alarm bells ringing when you read this code? We shouldn't blithely save everything the client tells us to save. We should inspect every request, making sure that the changes are valid and that the user is authorized to make them.

Learn how to do that with [a custom EFContextProvider and save interception](/doc-net/ef-efcontextprovider-4x#SaveInterception).