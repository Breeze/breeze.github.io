---
layout: doc-java-hib
---

## breeze-webserver

This project is a Java library that builds on top of breeze-hibernate by making it relatively easy to build a breeze backend webserver servlet app. 
 
This library has two primary classes

- AppContextListener - This is a very simple class that simply caches the Hibernate sessionFactory and makes a single Metadata call against the current Hibernate model and caches this as well. The BreezeControllerServlet base class makes use of both of these.
- BreezeControllerServlet - This is the primary class for this library. You will typically subclass this class and add a variety of NamedQuery and NamedSave methods for any nondefault queries and saves within your app.  You will also write any beforeSave and afterSave interception methods within your subclass.
 
### Subclassing BreezeControllerServlet

A simple example of subclassing the BreezeControllerServlet is shown below, along with an example of how to add save interception methods.

    public class NorthwindTestServlet extends BreezeControllerServlet {

      @Override
      public SaveWorkState createSaveWorkState(Map saveBundle) {
        return new SaveWorkState(saveBundle) {
           /* all of the overriden methods below have access to all of the  SaveWorkState data and methods. These methods provide a simple 
           means to find/add/remove/modify any entities involved in the save pipeline - see the api documentation for more detail 
           */  

           @Override
           public boolean beforeSaveEntity(EntityInfo entityInfo) {
             // custom code here -
           }

           @Override
           public void beforeSaveEntities() {
             // custom code here -
           }

           @Override   
           public void afterSaveEntities() {
             // custom code here -
           }

           // other overriden SaveWorkState methods here ...
        }     
     }

### Queries and 'Named Queries'

The BreezeControllerServlet will automatically route and handle any servlet requests that are not *Metadata* or *SaveChanges* operations as queries. 

If there is a public method whose name matches the resource name in the servlet request on your subclass of the BreezeControllerServlet then this method will be called. This is referred to as a 'Named Query'.  If a matching method cannot be found, the BreezeControllerServlet will consider this a 'Standard Query' and will attempt to interpret the resource name and map it to a query against one of the EntityTypes in your Hibernate domain model. It uses the Metadata's resourceName/EntityType mapping for this purpose. The remainder of the incoming url will be interpreted as a json serialized EntityQuery.  'Standard' queries are nice because you will not need to do any additional work to handle them in your subclass.

#### Example of a 'Named Query'.

The 'Named' query below would be called from a breeze client to return a list of customers the 'expand' to include the Orders associated with these customers will be added on the server. 

JavaScript client: 

    var q = EntityQuery.from("CustomersAndOrders").where("companyName", "startsWith", "P");
    myEntityManager.executeQuery(q).then(...);

Java Servlet:

    public class NorthwindTestServlet extends BreezeControllerServlet {

      public void CustomersAndOrders(HttpServletRequest request,
            HttpServletResponse response) {
        // extractEntityQuery is a built in method on the BreezeControllerServlet class 
        // that converts the url string in the HttpRequest into an EntityQuery instance.
        EntityQuery eq = this.extractEntityQuery(request);
        // create a new EntityQuery object
        eq = eq.expand("orders");
        QueryResult qr = executeQuery(Customer.class, eq);
        // writeQueryResponse is a built-in method of the BreezeControllerServlet class.
        this.writeQueryResponse(response, qr);
      }
    }

### Saves and 'Named Saves'

he BreezeControllerServlet will automatically route and handle any servlet requests that the result of client *SaveChanges* operations, i.e. any javascript operations that look like

JavaScript client:

    myEntityManager.saveChanges(...).then(...);

In other words, if you are doing a standard breezeJs save operation you will not need to do anything further than simply instantiate an instance of your BreezeControllerServlet and these saves will be performed without any further intervention on your part.

However, if you want more control over the save process, either to validate the data being saved or to possibly add/modify/remove some the data being saved then you can create a 'Named Save' interception point.  

This involves simply naming a method in your servlet subclass with the same name used as a 'resourceName' in the client js saveChanges call.

In the example below, we perform a standard save plus the addition of an additional comment record added for each save operation performed.

JavaScript client:

    var so = new SaveOptions({ resourceName: "SaveWithComment", tag: "some additional info" });
    em.saveChanges(null, so).then(...)

Java Servlet:  

    public void SaveWithComment(HttpServletRequest request,
            HttpServletResponse response) {
      Map saveBundle = extractSaveBundle(request);
      SaveWorkState sws = new SaveWorkState(saveBundle) {
          @Override
          // public void beforeSaveEntities() {
          public void beforeCommit(Object context) {
              Comment comment = new Comment();
              String tag = (String) this.getSaveOptions().tag;

              comment.setComment1((tag == null) ? "Generic comment" : tag);
              comment.setCreatedOn(new Date());
              comment.setSeqNum((byte) 1);
              this.addEntity(comment,  EntityState.Added);

          }
      };

      SaveResult sr = saveChanges(sws);
      writeSaveResponse(response, sr);
    }

  
