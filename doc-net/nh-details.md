---
layout: doc-net
redirect_from: "/old/documentation/nhibernate-support.html"
---
# NHibernate support

Breeze provides a server-side assembly that supports using NHibernate with WebAPI. **Breeze.WebApi.NH** provides features similar to those offered by the Breeze WebAPI Entity Framework provider, and makes it easier to develop a Breeze client application by taking care of some of the server-side plumbing.

Our [first NHibernate sample](/samples/northbreeze) is available now. Please have a look and kick the wheels.

## Features

- **Metadata**

	[Metadata](/doc-js/metadata) generation from the NHibernate model mappings (whether [XML files](http://nhforge.org/doc/nh/en/index.html#mapping), [Fluent](https://github.com/jagregory/fluent-nhibernate/wiki/Getting-started), or [mapping-by-code](http://notherdev.blogspot.com/2012/02/nhibernates-mapping-by-code-summary.html)).

- **SaveChanges**

	`SaveChanges` implementation to persist the entity changes from Breeze through the NHibernate model

- **BeforeSaveEntities**

	`BeforeSaveEntities` interception point for business logic to be applied after the entites have been materialized from the HTTP request, but **before** they are saved to the database. This is a good place for [server-side validation](/doc-net/ef-serverside-validation).

- **AfterSaveEntities**

	`AfterSaveEntities` interception point for business logic to be applied **after** the entities have been saved, but before they have been composed in the HTTP response

- **OData filtering parameters**

	Support (via NHibernate's LINQ provider) for OData filtering parameters in the HTTP request: `$filter, $orderby, $select, $skip, $top`

- **OData $expand**

	Support (via HTTP Filter, `NHQueryableInclude`, and NHibernate lazy loading) for OData `$expand` 

## Getting Started
The following instructions assume you're using Visual Studio 2012. Please look at the [NorthBreeze sample application](/samples/northbreeze), where the following steps have already been performed:

1. Create a new project. Choose "ASP.NET MVC 4 Web Application" and the "Empty" template.

1. Using the Library Package Manager (NuGet):
    - Add the package, [Breeze Server - for ASP.NET Web Api and NHibernate](http://www.nuget.org/packages/Breeze.Server.WebApi.NH/), to your web project. This will install the Breeze server and WebAPI assemblies into the project references.
    - Add the package, [Breeze Client - JavaScript](http://www.nuget.org/packages/Breeze.Client/), to your web project. This will install the Breeze JavaScript files into the Scripts folder of the project.

1. Add another project to your solution for your domain model and NHibernate mappings, and add a reference from your web project.  (See the [Limitations](#limitations) section for more about mappings)

1. In your web project's **web.config** file, add your [NHibernate configuration section](http://bradhe.wordpress.com/2010/06/22/migrating-nhibernate-configuration-in-to-web-config/) and connectionStrings. You can use [another way to configure NHibernate](http://nhforge.org/blogs/nhibernate/archive/2009/07/17/nhibernate-configuration.aspx) if you choose. 

1. Add a class to configure your NHibernate model and build the SessionFactory. Here's a simple static example:

        public static class NHConfig
        {
            private static Configuration _configuration;
            private static ISessionFactory _sessionFactory;
    
            static NHConfig()
            {
                var modelAssembly = typeof(Customer).Assembly;
                _configuration = new Configuration();
                _configuration.Configure();  //configure from the web.config
                _configuration.AddAssembly(modelAssembly);  // mapping is in this assembly
    
                _sessionFactory = _configuration.BuildSessionFactory();
            }
    
            public static Configuration Configuration
            {
                get { return _configuration; }
            }
    
            public static ISession OpenSession()
            {
                return _sessionFactory.OpenSession();
            }
        }

1.  Add a class that extends `Breeze.WebApi.NH.NHContext` and provides IQueryables for each of your model classes that will need to be queried through the WebAPI. It will need the `Configuration` and `Session` (from the NHConfig class defined above) in its constructor.  

    The `NHContext` base class defines a GetQuery<> method that returns an `NHQueryableInclude<>` for a model class. `NHQueryableInclude` extends `NHQueryable` to add an `Include` clause that can emulate EntityFramework's. Here's an example for the Northwind model:

        public class NorthwindContext : NHContext
        {
            public NorthwindContext() : base(NHConfig.OpenSession(), NHConfig.Configuration) { }
    
            public NhQueryableInclude<Customer> Customers
            {
                get { return GetQuery<Customer>(); }
            }
            public NhQueryableInclude<Order> Orders
            {
                get { return GetQuery<Order>(); }
            }
            // ... more methods for other entities ...
        }
    
1. Write your [WebAPI controller](/doc-net/webapi-controller) class.  It uses your derived NHContext class (described above) to implement the SaveChanges and Metadata methods, as well as a method that exposes each of your entities for querying. The [BreezeNHController] attribute adds a filter to each of the query methods, applyingOData parameters to the query before execution.

        [BreezeNHController]
        public class NorthBreezeController : ApiController
        {
            private NorthwindContext northwind;
    
            protected override void Initialize(System.Web.Http.Controllers.HttpControllerContext controllerContext)
            {
                base.Initialize(controllerContext);
                northwind = new NorthwindContext();
            }
    
            [HttpGet]
            public String Metadata()
            {
                return northwind.Metadata();
            }
    
            [HttpPost]
            public SaveResult SaveChanges(JObject saveBundle)
            {
                return northwind.SaveChanges(saveBundle);
            }
    
            [HttpGet]
            public IQueryable<Customer> Customers()
            {
                var custs = northwind.Customers;
                return custs;
            }
    
            [HttpGet]
            public IQueryable<Order> Orders()
            {
                var orders = northwind.Orders;
                return orders;
            }
            //... Additional methods for other entities
        }

1. Write your Breeze client. Dive into the [Breeze documentation](/doc-js/introduction) for a full description.  


## Caveats and Limitations

#### Foreign Keys Must Be Mapped
Unlike NHibernate itself, Breeze requires foreign keys that are mapped to object properties so Breeze can maintain the relationships on the client side. Here's an example, mapping a relationship from Order to Customer:

        <many-to-one name="Customer" column="`CustomerID`" class="Customer" />
    
        <property name="CustomerID" type="System.Guid" insert="false" update="false" />
The "Customer" property is mapped normally, while the "CustomerID" property is mapped with `insert="false"` and `update="false"`. This way, the CustomerID is exposed to Breeze, but NHibernate will perform inserts and updates using the ID of the Customer object itself.

We intend to fix this in the future by auto-generating the foreign key properties on the client (using a custom [JsonResultsAdapter](/doc-js/server-jsonresultsadapter)), and adding them to the server-generated metadata.

#### No Examples (yet) using HQL, Criteria, or QueryOver
NHibernate supports many querying methods. You may use any of them with Breeze, but we only have examples with NHQueryable at the moment.