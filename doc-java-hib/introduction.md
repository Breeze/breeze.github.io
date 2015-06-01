---
layout: doc-java-hib
---
# Breeze with Hibernate 

Breeze client applications make three basic kinds of AJAX calls:

   1. Breeze metadata 'GET' requests
   2. Breeze query 'GET' requests
   3. Breeze save 'POST' requests

The [breeze-hibernate](https://github.com/Breeze/breeze.server.java) is a Java library that runs on the server and uses Hibernate to handle each of these requests.

### Metadata Requests

The Breeze client requires [metadata](http://breeze.github.io/doc-js/metadata.html) about the entity model in order to know the data types and relationships of the entities.  The breeze-hibernate library uses the [Hibernate metadata API](http://docs.jboss.org/hibernate/orm/4.3/javadocs/org/hibernate/metadata/package-summary.html) to extract this information from the application's Hibernate configuration. It creates a data structure that is serialized to JSON and returned to the Breeze client. 

### Query Requests

The Breeze client has a [powerful query language](http://breeze.github.io/doc-js/query-using-json.html) that can send a [variety of queries](http://breeze.github.io/doc-js/query-examples.html) to the server.  These queries are sent to the Java server in JSON format.  The breeze-hibernate library converts these queries into Hibernate [Criteria queries](http://docs.jboss.org/hibernate/orm/4.3/manual/en-US/html/ch17.html) to query the database.

The query results, a collection of entities or graphs of entities, are serialized to JSON and returned to the Breeze client.

### Save Requests

The Breeze client performs saves by sending an array of entities to the server as JSON in a POST request.  The entities in the array are separate, i.e. not arranged in a graph. The breeze-hibernate library re-connnects the relationships between the entities, adds them to a Hibernate [Session](http://docs.jboss.org/hibernate/orm/4.3/javadocs/org/hibernate/Session.html) (in the appropriate order) as a save, update, or delete, and commits all the changes in a single transaction.

