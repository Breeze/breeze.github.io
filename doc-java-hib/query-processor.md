---
layout: doc-java-hib
---
 
## The HibernateQueryProcessor ( implements QueryProcessor)

The HibernateQueryProcessor class takes a breezejs *EntityQuery*, encoded as json, and converts it into one or more Hibernate criteria queries,  then executes them and provides a method to serializes the results as JSON. 

The *HibernateQueryProcessor* constructor takes *Metadata* object created as a result of parsing the Hibernate mapping collection along with a [SessionFactory](http://docs.jboss.org/hibernate/core/3.6/javadocs/org/hibernate/SessionFactory.html). Queries may then be executed by passing in a class and a json query string ( or an actual EntityQuery) to the *executeQuery* method.  This in turn internally creates a new [Session](http://docs.jboss.org/hibernate/core/3.6/javadocs/org/hibernate/Session.html) for each query that it executes.

##### EntityQuery to Criteria

The HibernateQueryProcessor typically builds Criteria queries from jsonified *EntityQuery* instances.  Each query also needs the Class on which the query operates.  Example:


    // metadata is the metadata for the hibernate model being queried
    // sessionFactory is a Hibernate SessionFactory
    QueryProcessor qp = new HibernateQueryProcessor(metadata, sessionFactory);
    // First 5 customers in 'Brazil'
    // typically this json string will have come from the client web app. 
    String json = "{ where: { country: 'Brazil' }, take: 5 }";

    // and then we execute it.
    QueryResult qr = qp.executeQuery(Customer.class, json);
    Collection results = qr.getResults();
    String jsonResults = qr.toJson();

	
Behind the scenes, that json string is parsed into an *EntityQuery* object, which is then converted into a Criteria query, which is then executed.  In a Java servelet app, the *QueryResult* object can be converted to json via a 'toJson' call and returned from the HTTP request to the breeze client.

Alternatively the server side breeze EntityQuery can be constructed via the EntityQuery construction api. The construction api provides a more structured, strongly typed alternative for creating a query.


    // Customers with company names starting with 'A'
    Predicate newPred = new BinaryPredicate(Operator.StartsWith,
                "companyName", "A");
    EntityQuery eq = new EntityQuery().where(newPred);
    // an alternative to ...
    // EntityQuery eq = new
    // EntityQuery("{ companyName: { startsWith: 'A' }}");
    QueryResult qr = executeQuery(Customer.class, eq);
    String jsonResults = qr.toJson();        


##### Combining client query with additional server query restrictions

In some scenarios, you may want to be able to allow the client to send  queries, but apply additional filters on the server.  Here's one way:


    // assuming the 'json' var came in via a HttpServlet request.

    // Create an EntityQuery based on what the original query from the client
    EntityQuery eq = new EntityQuery(json);

    // now we add an additional where clause and a take clause    
    Predicate newPred = new BinaryPredicate(Operator.StartsWith,
                    "companyName", 'B');
    // create a new EntityQuery object
    eq = eq.where(newPred).take(10);
    QueryResult qr = qp.executeQuery(Customer.class, eq);
    Collection results = qr.getResults();
    String jsonResults = qr.toJson();

     
Naturally you would apply appropriate exception handling in a real application.

##### InlineCount

The breeze EntityQuery *setInlineCount* and *expand* capabilities are treated specially because of the way they affect the query.

The inlinecount capability is used to get the total number of results that **would have been returned** if *skip* and *top* were not applied.  For server-side paging, *inlinecount* allows you to determine the total number of available pages.

For inlinecount, the Criteria query is essentially executed twice.  First `criteria.list()` is used to get the results.  Then the skip (first result), top (max results), and orderBy operations are removed from the Criteria, and a projection is applied to get the count of the rows.

**Without** `inlinecount`, Ex: **{ take: 2 }** ; the JSON result is an array of objects:

	[
		{
			$id: "0",
			$type: "northwind.model.Customer",
			companyName: "Island Trading",
			country: "UK",
			customerID: "008C5552-1FDE-421F-BDBF-F1C66C612AFA",
		},
		{
			$id: "1",
			$type: "northwind.model.Customer",
			companyName: "HILARION-Abastos",
			country: "Venezuela",
			customerID: "01858F10-9870-4D0F-8903-95223B3524A0",
		}
	]

**With** `inlinecount`, Ex: **{ take: 2, inlineCount: true }** the list of results are wrapped in an outer  object, and the JSON becomes:

	{
		$id: "0",
		$type: "com.breezejs.QueryResult",
		InlineCount: 96,
		Results: [
			{
				$id: "1",
				$type: "northwind.model.Customer",
				companyName: "Island Trading",
				country: "UK",
				customerID: "008C5552-1FDE-421F-BDBF-F1C66C612AFA",
			},
			{
				$id: "2",
				$type: "northwind.model.Customer",
				companyName: "HILARION-Abastos",
				country: "Venezuela",
				customerID: "01858F10-9870-4D0F-8903-95223B3524A0",
			}
		]
	}

The Breeze client handles both result types correctly.

##### Expand

The *expand* capability (Ex: **{ take: 2, expand: 'orders' }** causes entities related to the root entity to be included in the result.  While conceptually related to a JOIN operation in SQL, the semantics are actually quite different.  In order to preserve the shape and relationships of the original entities, and get accurate row counts for paging, breezejs-hibernate does not use joins, but relies on [Hibernate Select fetching](http://docs.jboss.org/hibernate/orm/3.6/reference/en-US/html/performance.html#performance-fetching) (lazy loading).

When an Breeze query is turned into a Criteria, the expands are kept separate. 
After the Criteria query is executed, the expands are processed by the HibernateExpander class, which performs `Hibernate.initialize()` on each of the associations.

Naturally, the disadvantage of select fetching is that it results in more queries. 
The performance impacts can be minimized by using [batch fetching](http://docs.jboss.org/hibernate/orm/3.6/reference/en-US/html/performance.html#performance-fetching-batch).  Consider setting the `default_batch_fetch_size` in your Hibernate configuration:

    <property name="default_batch_fetch_size">32</property>

You may also consider using a [second-level cache](http://docs.jboss.org/hibernate/orm/3.6/reference/en-US/html/performance.html#performance-cache).

