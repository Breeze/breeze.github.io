---
layout: doc-java-hib
---
# Introduction

Breeze JS is a pure JavaScript library for managing data on the client, much as Hibernate manages it on the server. 

<style>
.diagram {
	text-align: center;
	display: flex;
	flex-direction: column;
}
.diagram .diagram-box {
	border: 2px solid gray; border-radius: 10px;
	flex: 1;
	margin: auto;
}
.diagram .diagram-box .diagram-box-title {
	font-size: smaller;
}
.diagram .diagram-box .diagram-box-row {
	margin: 0px 10px;
	border-top: black solid 1px;
}
.diagram .diagram-line {
	width: 50%;
	border-right: black solid 3px;
	text-align: right;
}
</style>

<div class="diagram" style="width: 400px">
	<div class="diagram-box" style="width: 250px">
		<div class="diagram-box-title">Browser</div>
		<div class="diagram-box-row" style="background-color: rgb(226, 98, 189);">Angular / KO / Aurelia / etc.</div>
		<div class="diagram-box-row" style="background-color: rgb(126, 197, 238);"><b>Breeze JS</b></div>
	</div>

	<div class="diagram-line" style="line-height: 40px;">JSON</div>

	<div class="diagram-box" style="width: 300px">
		<div class="diagram-box-title">Java Server</div>
		<div class="diagram-box-row" style="background-color: rgb(113, 159, 192);">Servlet / MVC / JAX-RS / etc.</div>
		<div class="diagram-box-row" style="background-color: rgb(126, 197, 238);"><b>Breeze Java</b></div>
		<div class="diagram-box-row" style="background-color: rgb(219, 212, 184);">Hibernate / JPA</div>
	</div>
</div>

Breeze on the Java server works with Hibernate to manage persistence for Breeze client applications.  It turns Breeze queries into Hibernate queries, and saves changes to the database using Hibernate.  

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


## breeze-hibernate

The [breeze-hibernate](https://github.com/Breeze/breeze.server.java) project is a Java library that facilitates building [BreezeJS](/doc-js/)-compatible backends using
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

There are three main classes that you will use to do most of the work: `HibernateQueryProcessor`, `HibernateSaveProcessor`, and `HibernateMetadata`.  Each of these is a subclass of the generic QueryProcessor, SaveProcessor and Metadata classes respectively.


