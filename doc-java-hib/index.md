---
layout: doc-java-hib
redirect_from: "/old/documentation/java-server.html"
---

# Java Server + Hibernate

<a class="logo-inline" href="/doc-java-hib" title="Java">
  <img src="/images/logos/Breeze-java.png" alt="Breeze+Java" width="100">
</a> 

Breeze helps you manage data in rich client applications.  It gives you ORM-like data management capability in a JavaScript application.

The [breeze.server.java](https://github.com/Breeze/breeze.server.java) libraries make it easy to write Java servers that work with [Breeze clients](/doc-js/).  They currently support Hibernate, with JPA coming soon. 

<div style="clear:both" ></div>

{% include support-frag.html %}

# Overview

Breeze with Java + Hibernate lets you develop JavaScript client applications using the same powerful idioms you find in Hibernate.  You can

- query with a rich query syntax
- navigate the graph of related entities
- track changes as you add/change/delete entities
- perform client-side validation
- save all changes in a single transaction
- use your existing Hibernate entity model on the JavaScript client

## Client and Server

**Breeze JS** is a pure JavaScript library for managing data on the client, much as Hibernate/JPA manages it on the server.  

Breeze JS has an [EntityManager](/doc-js/entitymanager-and-caching.html) that queries entities from the server, keeps them in cache, keeps track of the state of each entity, and saves the changes to the server when requested.

<style scoped>
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
	padding: 8px;
	border-top: black solid 1px;
}
.diagram .diagram-line {
	width: 50%;
	padding: 10px 3px;
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

**Breeze Java** is a server-side library that works with Hibernate/JPA to manage persistence for Breeze client applications.  It turns Breeze queries into Hibernate/JPA queries, and saves changes to the database using Hibernate/JPA.  

The Breeze server is designed to be **stateless**.  A Hibernate Session/JPA EntityManager is created to handle each query or save request, but then discarded.  **No** long-running transactions, detached objects, or disconnected sessions are required.  Entity state is kept on the client, not the server.

## Client-Server Communication

Breeze client applications make three basic kinds of AJAX calls:

   1. Breeze metadata 'GET' requests
   2. Breeze query 'GET' requests
   3. Breeze save 'POST' requests

The [breeze-hibernate](https://github.com/Breeze/breeze.server.java) library runs on the server and uses Hibernate to handle each of these requests.

### Metadata Requests

The Breeze client requires [metadata](http://breeze.github.io/doc-js/metadata.html) about the entity model in order to know the data types and relationships of the entities.  The breeze-hibernate library uses the [Hibernate metadata API](http://docs.jboss.org/hibernate/orm/4.3/javadocs/org/hibernate/metadata/package-summary.html) to extract this information from the application's Hibernate configuration. It creates a data structure that is serialized to JSON and returned to the Breeze client. 

### Query Requests

The Breeze client has a [powerful query language](http://breeze.github.io/doc-js/query-using-json.html) that can send a [variety of queries](http://breeze.github.io/doc-js/query-examples.html) to the server.  These queries are sent to the Java server in JSON format.  The breeze-hibernate library converts these queries into Hibernate [Criteria queries](http://docs.jboss.org/hibernate/orm/4.3/manual/en-US/html/ch17.html) to query the database.

The query results, a collection of entities or graphs of entities, are serialized to JSON and returned to the Breeze client.

### Save Requests

The Breeze client performs saves by sending an array of entities to the server as JSON in a POST request.  The entities in the array are separate, i.e. not arranged in a graph. The breeze-hibernate library re-connnects the relationships between the entities, adds them to a Hibernate [Session](http://docs.jboss.org/hibernate/orm/4.3/javadocs/org/hibernate/Session.html) (in the appropriate order) as a save, update, or delete, and commits all the changes in a single transaction.

# Samples

<a href="/doc-samples/todo-angular-hibernate.html">
        <img src="/images/logos/angular-logo-new.png" width="100">
        <p>Todo Angular Hibernate</p>
</a>

