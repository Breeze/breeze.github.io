---
layout: doc-java-hib
redirect_from: "/old/documentation/java-server.html"
---

# Java Server + Hibernate

<a class="logo-inline" href="/doc-java-hib" title="Java">
  <img src="/images/logos/Breeze-java.png" alt="Java" width="100">
</a> 

The [breeze.server.java](https://github.com/Breeze/breeze.server.java) libraries make it easy to write Java servers that work with [Breeze clients](/doc-js/).  They currently support Hibernate, with JPA coming soon. 

Breeze with Java + Hibernate lets you develop JavaScript client applications using the same powerful idioms you find in Hibernate.  You can

- query with a rich query syntax
- navigate the graph of related entities
- track changes as you add/change/delete entities
- perform client-side validation
- save all changes in a single transaction
- use your existing Hibernate entity model on the JavaScript client


<div style="clear:both" />

{% include support-frag.html %}

## Getting Started

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

The Breeze code is open source and available at [https://github.com/Breeze/breeze.server.java](https://github.com/Breeze/breeze.server.java).  There are four projects:

1. **breeze-hibernate**: Handles metadata, query, and save requests through Hibernate
2. **breeze-webserver**: Handles HTTP requests and JSON serialization in front of breeze-hibernate.
3. **breeze-northwind**: Data model for the Northwind database, used for unit testing
4. **breeze-webtest**: Web app for running breeze unit tests.

It is set up as a Maven project.  The [build](https://github.com/Breeze/breeze.server.java/tree/master/build) directory contains a master pom.xml that builds all the projects in the correct order.

# Samples

<a href="/doc-samples/todo-angular-hibernate.html">
        <img src="/images/logos/angular-logo-new.png" width="100">
        <p>Todo Angular Hibernate</p>
</a>

