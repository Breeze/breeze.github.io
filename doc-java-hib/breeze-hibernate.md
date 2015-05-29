---
layout: doc-java-hib
redirect_from: "/old/documentation/javahibernate.html"
---

## breeze-hibernate

This project is a Java library that facilitates building [BreezeJS](/doc-js/)-compatible backends using
[Hibernate](http://hibernate.org/orm/).  It is set up as a [Maven](http://maven.apache.org/) project, which builds a JAR that can then
be used as a library in a web application. 

Source and apidocs at: [https://github.com/Breeze/breeze.server.java](https://github.com/Breeze/breeze.server.java) 

Note: There is a separate `breeze-webserver` library (discussed later) that references the `breeze-hibernate` library to provide an easy path to creating a Java servlet app to wrap the breeze-hibernate functionality.  

### Features:

- Generates [Breeze metadata](http://doc-js/metadata.html) from Hibernate mappings
- Parses breeze client EntityQuery instances encoded as json into [Criteria](http://docs.jboss.org/hibernate/core/3.6/javadocs/org/hibernate/Criteria.html) queries
- Executes these queries using Hibernate Sessions
- Expands graphs of related entites using lazy loading.
- Serializes query results to [JSON](http://www.json.org/java/), using [$id/$ref syntax for handling references](https://blogs.oracle.com/sundararajan/entry/a_convention_for_circular_reference)
- Handles saving Breeze payloads in Hibernate


## Using the API

There are three main classes that you will use to do most of the work: HibernateQueryProcessor, HibernateSaveProcessor, and HibernateMetadata.  Each of these is a subclass of the generic QueryProcessor, SaveProcessor and Metadata classes respectively.

