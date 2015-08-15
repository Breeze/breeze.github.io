---
layout: doc-java-hib
---
# Getting Started

As explained in the [introduction](/doc-java-hib/index.html), there are both client and server components to Breeze.  Here we will tell you how to get both.

## Downloading Breeze - JavaScript Client

You can get the latest build of BreezeJS from [github](https://github.com/Breeze/breeze.js/tree/master/build).  You'll need either 
[breeze.debug.js](https://raw.githubusercontent.com/Breeze/breeze.js/master/build/breeze.debug.js) or 
[breeze.min.js](https://raw.githubusercontent.com/Breeze/breeze.js/master/build/breeze.min.js).

### Prerequisites and Add-ons

BreezeJS requires 3rd-party libraries for its [promise](https://www.promisejs.org/) implementation and for its AJAX implementation.

#### If you are using [AngularJS](https://angularjs.org/)
Get [breeze.bridge.angular.js](https://raw.githubusercontent.com/Breeze/breeze.js/master/build/adapters/breeze.bridge.angular.js).  This sets up Breeze to use Angular's $q for promises, and $http for AJAX.  In your index.html you should have, in order:

    <script src="Scripts/angular.js"></script>
    <script src="Scripts/breeze.debug.js"></script>
    <script src="Scripts/breeze.bridge.angular.js"></script>

See the [Todo-Angular-Hibernate](/doc-samples/todo-angular-hibernate.html) sample for an example Breeze+Angular application.

#### If you are using [KnockoutJS](http://knockoutjs.com/)
Get [Q.js](https://github.com/kriskowal/q) (for promises) and [jQuery](https://jquery.com/) (for AJAX).  You will also need the [KO model libary](https://raw.githubusercontent.com/Breeze/breeze.js/master/build/adapters/breeze.modelLibrary.ko.js) for change tracking between Knockout and Breeze.  In your `index.html` you should have, in order:

    <script src="Scripts/jquery.min.js"></script>
    <script src="Scripts/knockout.js"></script>
    <script src="Scripts/q.min.js"></script>
    <script src="Scripts/breeze.debug.js"></script>
    <script src="Scripts/breeze.modelLibrary.ko.js"></script>

#### If you are using [BackboneJS](http://backbonejs.org/)
Get [Q.js](https://github.com/kriskowal/q) (for promises) and [jQuery](https://jquery.com/) (for AJAX).  You will also need the [Backbone model libary](https://raw.githubusercontent.com/Breeze/breeze.js/master/build/adapters/breeze.modelLibrary.backbone.js) for change tracking between Backbone and Breeze.  In your `index.html` you should have, in order:

    <script src="Scripts/jquery.min.js"></script>
    <script src="Scripts/underscore.js"></script>    
    <script src="Scripts/backbone.js"></script> 
    <script src="Scripts/q.min.js"></script>
    <script src="Scripts/breeze.debug.js"></script>
    <script src="Scripts/breeze.modelLibrary.backbone.js"></script>

### Configuring the Client

There are two different URI formats that the Breeze client can use to send queries to the server: [OData](http://www.odata.org/documentation/odata-version-3-0/url-conventions/#url5) and [JSON](http://breeze.github.io/doc-js/query-using-json.html).  

The Breeze Java Server only understands the JSON format, so you'll need to configure the client:

    breeze.core.config.initializeAdapterInstance("uriBuilder", "json");

  

## Downloading Breeze - Java Server

### Maven

[Maven](http://maven.apache.org) is a project management system that automatically downloads project dependencies during the build process.  Breeze has a dedicated Maven repository on github.  To use it, you will need to add the repository to your project's POM file:


      <repositories>
        <repository>
            <id>maven-breeze</id>
            <name>Breeze Repository</name>
            <url>https://raw.githubusercontent.com/Breeze/breeze.server.java/master/maven-repo/</url>
        </repository>
      </repositories>


Then you add the actual dependency information for breeze-hibernate and breeze-webserver:


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

### JAR Download

If you are not using Maven, you can download the JARs manually from github:

[breeze-hibernate-0.1a.jar](https://github.com/Breeze/breeze.server.java/raw/master/maven-repo/com/breeze/breeze-hibernate/0.1a/breeze-hibernate-0.1a.jar)

[breeze-webserver-0.1a.jar](https://github.com/Breeze/breeze.server.java/raw/master/maven-repo/com/breeze/breeze-webserver/0.1a/breeze-webserver-0.1a.jar)

### Build it yourself

If you wish, you can build the Breeze JARs yourself.  The Breeze code is open source and available at [https://github.com/Breeze/breeze.server.java](https://github.com/Breeze/breeze.server.java).  There are five projects:

1. **breeze-hibernate**: Handles metadata, query, and save requests through Hibernate
2. **breeze-webserver**: Handles HTTP requests and JSON serialization in front of breeze-hibernate.
3. **breeze-northwind**: Data model for the Northwind database, used for integration testing
4. **breeze-webtest**: Web app for running breeze integration tests.
5. **breeze-webtest-jersey**: Jersey web app for running breeze integration tests. 

Only the first two are needed for building a Breeze application.  The others are for testing the Breeze features during development.  Each project is set up for development using Eclipse and for builds using Maven.  The [build](https://github.com/Breeze/breeze.server.java/tree/master/build) directory contains a master pom.xml that builds all the projects in the correct order.

### breeze-webserver
The [breeze-webserver](https://github.com/Breeze/breeze.server.java) library implements servlets to handle requests from the Breeze client.  It extracts the data from the request and passes it on to breeze-hibernate. More information is found in the [breeze-webserver topic page](/doc-java-hib/breeze-webserver.html).

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


