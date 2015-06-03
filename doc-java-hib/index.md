---
layout: doc-java-hib
redirect_from: "/old/documentation/java-server.html"
---

# Java Server + Hibernate

<a class="logo-inline" href="/doc-java-hib" title="Java">
  <img src="/images/logos/Breeze-java.png" alt="Java" width="100">
</a> 

Breeze helps you manage data in rich client applications.  It gives you ORM-like data management capability in a JavaScript application.

The [breeze.server.java](https://github.com/Breeze/breeze.server.java) libraries make it easy to write Java servers that work with [Breeze clients](/doc-js/).  They currently support Hibernate, with JPA coming soon. 

<div style="clear:both" ></div>

{% include support-frag.html %}

## Overview

Breeze with Java + Hibernate lets you develop JavaScript client applications using the same powerful idioms you find in Hibernate.  You can

- query with a rich query syntax
- navigate the graph of related entities
- track changes as you add/change/delete entities
- perform client-side validation
- save all changes in a single transaction
- use your existing Hibernate entity model on the JavaScript client

### Client vs. Server

Breeze JS is a pure JavaScript library for managing data on the client, much as Hibernate manages it on the server. 

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

# Samples

<a href="/doc-samples/todo-angular-hibernate.html">
        <img src="/images/logos/angular-logo-new.png" width="100">
        <p>Todo Angular Hibernate</p>
</a>

