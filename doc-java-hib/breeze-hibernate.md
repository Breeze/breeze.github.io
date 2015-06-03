---
layout: doc-java-hib
redirect_from: "/old/documentation/javahibernate.html"
---
# Breeze-Hibernate Introduction

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


## Getting Started

### Maven

[Maven](http://maven.apache.org) is a project management system that automatically downloads project dependencies during the build process.  Breeze has a dedicated Maven repository on github.  To use it, you will need to add the repository to your project's POM file:

```XML
  <repositories>
    <repository>
        <id>maven-breeze</id>
        <name>Breeze Repository</name>
        <url>https://raw.githubusercontent.com/Breeze/breeze.server.java/master/maven-repo/</url>
    </repository>
  </repositories>
```

Then you add the actual dependency information for breeze-hibernate and breeze-webserver:

```XML
  <dependency>
	<groupId>com.breeze</groupId>
	<artifactId>breeze-hibernate</artifactId>
	<version>0.1a</version>
  </dependency>
  <dependency>
	<groupId>com.breeze</groupId>
	<artifactId>breeze-webserver</artifactId>
	<version>0.1a</version>
  </dependency>
```

### JAR Download

If you are not using Maven, you can download the JARs manually from github:

[breeze-hibernate-0.1a.jar](https://github.com/Breeze/breeze.server.java/raw/master/maven-repo/com/breeze/breeze-hibernate/0.1a/breeze-hibernate-0.1a.jar)

[breeze-webserver-0.1a.jar](https://github.com/Breeze/breeze.server.java/raw/master/maven-repo/com/breeze/breeze-webserver/0.1a/breeze-webserver-0.1a.jar)

### Build it yourself

If you wish, you can build the Breeze JARs yourself.  The Breeze code is open source and available at [https://github.com/Breeze/breeze.server.java](https://github.com/Breeze/breeze.server.java).  There are four projects:

1. **breeze-hibernate**: Handles metadata, query, and save requests through Hibernate
2. **breeze-webserver**: Handles HTTP requests and JSON serialization in front of breeze-hibernate.
3. **breeze-northwind**: Data model for the Northwind database, used for integration testing
4. **breeze-webtest**: Web app for running breeze integration tests.

Only the first two are needed for building a Breeze application.  The last two are for testing the Breeze features during development.  Each project is set up for development using Eclipse and for builds using Maven.  The [build](https://github.com/Breeze/breeze.server.java/tree/master/build) directory contains a master pom.xml that builds all the projects in the correct order.

### breeze-webserver
The [breeze-webserver](https://github.com/Breeze/breeze.server.java) library implements servlets to handle requests from the Breeze client.  It extracts the data from the request and passes it on to breeze-hibernate. More information is found in the [breeze-webserver topic page](http://breeze.github.io/doc-java-hib/breeze-webserver.html).

### breeze-hibernate

The [breeze-hibernate](https://github.com/Breeze/breeze.server.java) library implements classes to perform the server-side data manipulation with Hibernate.

- Generates [Breeze metadata](http://doc-js/metadata.html) from Hibernate mappings
- Parses breeze client EntityQuery instances encoded as JSON into [Criteria](http://docs.jboss.org/hibernate/core/3.6/javadocs/org/hibernate/Criteria.html) queries
- Executes these queries using Hibernate Sessions
- Expands graphs of related entites using lazy loading.
- Serializes query results to [JSON](http://www.json.org/java/), using [$id/$ref syntax for handling references](https://blogs.oracle.com/sundararajan/entry/a_convention_for_circular_reference)
- Handles saving Breeze payloads in Hibernate


## Using the API

There are three main classes that you will use to do most of the work: `HibernateQueryProcessor`, `HibernateSaveProcessor`, and `HibernateMetadata`.  Each of these is a subclass of the generic QueryProcessor, SaveProcessor and Metadata classes respectively.  Use of these classes is described in the following pages.


