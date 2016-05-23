---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/naming-convention.html"
---

# NamingConvention

Breeze moves entity data between client and server as JSON values.  The property names is the JSON matter.

By default, the property names of an *EntityType* on the client are the same as the property names of the corresponding type on the server. If a `Person` property is called `FirstName` on the server, it will be `FirstName` on the client.

In some environments, a developer may prefer camel case names on our .NET client. We want to refer to the `firstName` on the client even if we retain `FirstName` as the property name on the server (we may not have a choice).

Welcome to the breeze *NamingConvention*, the component responsible for translating between the server-side property and type names and the corresponding client-side names. The default convention is to do nothing, i.e. to leave client and server side 
    
The *NamingConvention* is defined on the *MetadataStore* and all Breeze translations will be governed by this convention.
  
If you create a new `NamingConvention`, you can set it on the MetadataStore via 

    myMetadataStore.NamingConvention = new MyCustomNamingConvention();     

NamingConventions are immutable, but there are several helper methods on the base NamingConvention class that allow you to create new NamingConvention instances from existing instances. The rest of this section dives deeper into how to create your own NamingConvention.

## Don't try to fix it with formatters ##

Let's mention what **will not work** before talking about what will work. The server-side JSON formatter is often capable of translating property names from server to client to server. It could translate between Pascal case ("FirstName") and camel case ("firstName") for you. The JSON.NET formatter used by ASP.NET Web API has this feature.

**Don't use it!** You'll confuse Breeze. Yes Breeze uses property names for accessing entity data. But it also uses them to compose the URL when you query for data on the server. URLs are officially case sensitive and so are the property names of classes on the server. When you look for a person whose first name is "Joe", Breeze must know if the query expression should be "FirstName eq 'Joe'" or "firstName eq 'Joe'". Breeze needs the server-side property name to compose the queries correctly. Disguising the problem with server-side formatter configuration will confuse Breeze. Again, **don't do it**.

## Create a custom NamingConvention ##

In essence, a *NamingConvention* is a class that inherits from Breeze.Sharp.NamingConvention and overrides either 2 or 4 methods from the base implementation. Two of these methods are intended for translating property names between client and server and two are for translating type names. 

- Type name translation methods
      
        public virtual TypeNameInfo ServerTypeNameToClient(TypeNameInfo serverNameInfo)      
     
        public virtual TypeNameInfo ClientTypeNameToServer(TypeNameInfo clientNameInfo) 

- Property name translation methods 

        public virtual String ServerPropertyNameToClient(String clientName, StructuralType parentType)
      
        public virtual String ClientPropertyNameToServer(String serverName, StructuralType parentType)


You can create your own conventions too such as this one for removing underscores from server-side property names.

     // Creates a convention that removes underscores from server property names
     // Remembers them in a private dictionary so it can restore them
     // when going from client to server
     // Warning: use only with metadata loaded directly from server
     public class UnderscoreRemovallNamingConvention : NamingConvention {

       private Dictionary<String, String> _clientServerPropNameMap = new  Dictionary<string, string>();

       public override String ServerPropertyNameToClient(String serverPropertyName,  StructuralType parentType) {
         if (serverPropertyName.IndexOf("_", StringComparison.InvariantCulture) != -1)  {
           var clientPropertyName = serverPropertyName.Replace("_", "");
           _clientServerPropNameMap[clientPropertyName] = serverPropertyName;
           return clientPropertyName;
         }
       }

       public override string ClientPropertyNameToServer(string clientPropertyName,  StructuralType parentType) {
         String serverPropertyName;
         if (_clientServerPropNameMap.TryGetValue(clientPropertyName, out  serverPropertyName)) {
           serverPropertyName = clientPropertyName;
         }
         return serverPropertyName;
       }
     }
   }

## NamingConvention for EntityType/ComplexType names

You can also create a NamingConvention that performs type name mapping.  There is a very common version of this requirement that simply involves mapping namespaces between server and client, with the rest of the type names staying the same. Because this is so common Breeze adds a separate method to assist with the *WithClientServerNamespaceMapping* method. Example below: 

    var customNamingConvention = new NamingConvention().
         .WithClientServerNamespaceMapping("ClientNamespace.Billing", ""ServerNamespace.XYZBilling")
         .WithClientServerNamespaceMapping("ClientNamespace.Receipts", "AnotherServerNamespace.XYZBilling");
    myMetadataStore.NamingConvention = customNamingConvention;
 
This same effect could be accomplished by creating your own subclass of NamingConvention. 

     public MyCustomNamingConvention : NamingConvention {
          public MyCustomNamingConvention() {
              // AddClientServerNamespaceMapping is a 'protected' method that provides access to internal namespace mapping dictionary
              // without requiring a new instance to be created.
              this.AddClientServerNamespaceMapping("ClientNamespace.Billing", "ServerNamespace.XYZBilling")
              this.AddClientServerNamespaceMapping("ClientNamespace.Receipts", "AnotherServerNamespace.XYZBilling");
          }     
     }

      myMetadataStore.NamingConvention = new MyCustomNamingConvention();

<a name="Beware"></a>

## Beware of exported NamingConventions

Each `MetadataStore` has a no-op `NamingConvention` at birth. 

If the `MetadataStore` is empty, its NamingConvention can be changed *indirectly* by importing metadata:

    // exported metadata has its own namingConvention
    myMetadataStore.ImportMetadata(exportedMetadata);
    // note: myMetadataStore.NamingConvention may changed...

This can be an unwelcome surprise. Imagine you defined your `MetadataStore` with one convention. Then you imported metadata you need from some source and discover (after your app misbehaves mysteriously) that your store is locked into a *different convention*.
