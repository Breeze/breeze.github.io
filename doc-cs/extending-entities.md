---
layout: doc-cs
---

# Extending Entities

While Breeze can create an entity based exclusively on its metadata description, you can add additional properties and behaviors as needed to support client-side requirements. For example, you may want to add a method that is useful when presenting data to the user. This topic explains how to extend the entity definition with members that are not defined in metadata.

### Basic extension

Breeze entities are either created or “materialized”. They are typically created either by "newing" them up or by calling the CreateEntity method on an EntityManager.

    var cust = new Customer();

or

    var cust = EntityManager.CreateEntity<Customer>();

Ok, we have a Customer object. But in our application, every Customer should have an  *IsLocal* property. That is a client application property; it's unknown on the server and it's not in the server's metadata. 

 We can accomplish this simply by adding a new property to the Customer class. 
    
    public class Customer : BaseEntity {

        /* Added to existing Customer class definition
        public bool IsLocal { get; set; }

    }

At this point, if you ran an app that uses the Customer CLR type, the Customer EntityType metadata will now contain a new *IsLocal* 'unmapped' property. The reason that the propery will be 'unmapped' is that Breeze will have discovered it via reflection but will found no corresponding server side description of the same property. 

### Additional extension
  
We can go one step further and have this new property treated as a first class breeze property by changing the property definition just slightly:

    public class Customer : BaseEntity {

        /* Added to existing Customer class definition
        public bool IsLocal { 
            get { return GetValue<bool>(); }
            set { SetValue(value); }
        }

    }

It will still be an unmapped property but now we will get property change notifications along with accept/reject change capabilities, validation and error notification support and the rest of breeze's basic capabilities.

### Post construction initialization

The next issue is that sometimes we want to default the value of an unmapped property based on other data in the entity.  We can obviously do this immediately after constructing the entity via `new` or `EntityManager.CreateEntity` but what about the case where we materialize the entity as a result of a query. 

In this case, we need some method that is executed AFTER the entity is materialized but before the entity is actually attached to an EntityManager.  This is provided by the virtual protected *Initialize* method on every BaseEntity and BaseComplexObject.  You can override this method to accomplish any needed initialization. 

  public class Customer : BaseEntity {

        /* Added to existing Customer class definition
        public bool IsLocal { 
            get { return GetValue<bool>(); }
            set { SetValue(value); }
        }

        protected override Initialize() {
            IsLocal = this.ZipCode.StartsWith("9");
        }

    }

Breeze will automatically call this Initialize method whenever an entity is materialized into an EntityManager for the ***first*** time as a result of a query, as well as after any EntityManager.AddEntity or EntityManager.AttachEntity calls.

> If an entity is already in an EntityManager, *Initialize* will NOT be called a 2nd time ( unless the entire entity is replaced as a result of an OverwriteChanges MergeStrategy). 

### Custom constructors

A natural place to extend an entity definition is in its constructor, and it is often useful to create a variety of constructors for different purposes.  

However, as far as Breeze is concerned the only constructor that it will use during materialization is the empty constructor.  So you are free to add whatever custom logic you want to this constructor.  You can also create your own parameterized constructors, but be aware that they will NOT be called during materialization of the entity from a query.  Because of this it is often a better idea to add custom construction code using the 'Initialize' method discussed above.  

> If you create parameterized constructors, insure that a public empty constructor is still available.
 