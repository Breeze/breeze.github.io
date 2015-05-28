---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/entities-and-complex-objects.html"
---

# Entities and Complex Objects  

Breeze manages two types of business objects, called Entities and Complex Objects. These are both represented by instances of .NET CLR types that implement either the *IEntity* or the *IComplexObject* interfaces.  One of the requirements of Breeze.Sharp is that it be able to locate a CLR type that implements one of these interfaces before it resolves any data returned by a remote web service that represents instances of these types. 

Breeze can handle data that cannot be matched up with an Entity or Complex object type but these will be handled as anonymous types and will not participate in the entire Breeze lifecycle. 

This means that any Breeze.Sharp application will have a number of CLR types defined in a some assembly within the application. Breeze provides the *Configuration.ProbeAssemblies* method to be used to automatically discover any entity or complex types within a given assembly. The Configuration class is a 'singleton' and you access the single instance via the static `Configuration.Instance` property.   In a typical Breeze.sharp application, a call to this method should be among the first actions that the application takes. Something like:
    
     Configuration.Instance.ProbeAssemblies(typeof(Customer).Assembly); 

will discover the Customer type as well as any other Entity and ComplexObject types within the same assembly.    

Relationships, validations and other ancillary metadata about each Entity and ComplexObject type are provided either via metadata fetched from the service or described via a fluent interface directly on the client. Discrepencies between the service metadata and the automatically discovered metadata via probing will be surfaced during this stage. 

The Breeze.Sharp client provides two base classes that provide abstract implementations of the IEntity and IComplexObject interfaces.  These are the *BaseEntity* and *BaseComplexObject* classes.  In general, every entity or complex type you create should inherit either directly or indirectly from one of these classes.

### Entities 

A sample implementation of a Customer class is shown below: 

	public partial class Customer : BaseEntity {
		
 		// Data properties
	    public System.Guid CustomerID {
	      get { return GetValue<System.Guid>(); }
	      set { SetValue(value); }
	    }  
	    public string CompanyName {
	      get { return GetValue<string>(); }
	      set { SetValue(value); }
	    }   
	    public string Address  {
	      get { return GetValue<string>(); }
	      set { SetValue(value); }
	    }
	    
		// Navigation properties
	    public NavigationSet<Order> Orders {
	      get { return GetValue<NavigationSet<Order>>(); }
	    }
	    public Employee SalesRep {
		  get { return GetValue<Employee>(); }
          set { SetValue(value); }
		}
		// Unmapped properties
	    public string MiscData {
		  get { return GetValue<string>(); }
	      set { SetValue(value); }
	    }
	    // called after 
	    public override void Initialize() {
	      // code to be executed immediately after an
		  // entity is fetched via a remote service.
	    }
	  }
	 
The only real requirement here is that any property that you expect to be returned from the server and want to make available on the client should be described using the pattern shown above, i.e using the GetValue<T> and SetValue methods. 

Note that are two forms of NavigationProperties, a scalar form (SalesRep from above) and a nonscalar form (Orders). The scalar form looks just like any other property but the nonscalar form does NOT have a setter and expects a return type of *NavigationSet< T>*.  This is deliberate, because Breeze will automatically construct an empty NavigationSet for each nonscalar property.

Note also that you can create "unmapped" properties that follow the DataProperty convention described above.  Any properties constructed in this fashion will participate fully in the Breeze lifecycle but simply will not be automatically queried or persisted. 

The *Initialize* overriden method shown above may be used to perform any entity specific initialization that needs to occur AFTER an entity has been returned from a remote service, but before it gets attached to an *EntityManager*.    

### Complex objects 

A complex object class looks much like an Entity class with two major differences.

- You inherit from *BaseComplexObject* instead of BaseEntity
- There are no *NavigationProperties* on a ComplexObject i.e. no properties that return an entity or a collection of entities.	
 
> ComplexObject classes can also contain properties that reference other ComplexObject types. i.e. ComplexObject types can be nested. 

Here is a sample ComplexObject class:


    public partial class Location : BaseComplexObject {
        public Location() {
          Country = "USA"; // just to show that you can use the empty ctor.
        }
        public string Address {
          get { return GetValue<string>(); }
          set { SetValue(value); }
        }
        public string City {
          get { return GetValue<string>(); }
          set { SetValue(value); }
        }
        public string Region {
          get { return GetValue<string>(); }
          set { SetValue(value); }
        }
        public string PostalCode {
          get { return GetValue<string>(); }
          set { SetValue(value); }
        }
        public string Country {
          get { return GetValue<string>(); }
          set { SetValue(value); }
        }
      }
    }

If we wanted we could then add a property to Customer class shown earlier that returns an instance of this ComplexObject type.

    public partial class Customer : BaseEntity {
        public Location ShippingAddress {
            get { return GetValue<Location>(); }
            set { SetValue(value); }
        }
    }
