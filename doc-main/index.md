---
layout: doc-main
redirect_from: "/" 
---
# Breeze  

Breeze is a library that helps you manage data in rich client applications. If you store data in a database, query and save those data as complex object graphs, and share these graphs across multiple screens of your JavaScript client, Breeze is for you.

Client-side querying, caching, dynamic object graphs, change tracking and notification, model validation, batch save, offline ... all part of rich data management with Breeze.  Breeze clients communicate with any remote service that speaks HTTP and JSON.

Breeze lets you develop applications using the same powerful idioms on the client and server.  You can

- query with a rich query syntax
- navigate the graph of related entities
- track changes as you add/change/delete entities
- perform client-side validation
- save all changes in a single transaction
- use the same entity model on the server and client

## Client and Server

**Breeze JS** ([breeze-client](https://www.npmjs.com/package/breeze-client)) is a JavaScript library for managing data on the client, much as an ORM manages it on the server.  

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
<div class="diagram-box" style="width: 300px">
	<div class="diagram-box-title">Browser</div>
	<div class="diagram-box-row" style="background-color: rgb(226, 98, 189);">Angular / Vue / React / etc.</div>
	<div class="diagram-box-row" style="background-color: rgb(126, 197, 238);"><b>Breeze JS</b></div>
</div>

<div class="diagram-line" style="line-height: 40px;">JSON</div>

<div class="diagram-box" style="width: 300px">
	<div class="diagram-box-title">Server (Node, .NET, Java)</div>
	<div class="diagram-box-row" style="background-color: rgb(113, 159, 192);">Web Routing layer</div>
	<div class="diagram-box-row" style="background-color: rgb(126, 197, 238);"><b>Breeze Server library</b></div>
	<div class="diagram-box-row" style="background-color: rgb(219, 212, 184);">ORM</div>
</div>
</div>

**Breeze Server** is a library that works with an ORM (Entity Framework, Sequelize, Hibernate) to manage persistence for Breeze client applications.  It turns Breeze queries into ORM queries, and saves changes to the database via the ORM.  

The Breeze server is intented to be **stateless**.  No long-running transactions, detached objects, or persistent connections are required.  Entity state is kept on the client, not the server.

Breeze clients do not *require* a Breeze server; for example, BreezeJS will also work with existing RESTful APIs.  The full power of Breeze comes with supporting the three types of client-server communication.

## Client-Server Communication

Breeze client applications make three basic kinds of AJAX calls:

   1. Breeze metadata 'GET' requests
   2. Breeze query 'GET' requests
   3. Breeze save 'POST' requests
 
The Breeze server libraries make it easy to support these requests.
 
## Breeze Client Technologies
<p>
   <a style="display:inline-block;float:left;margin-right:7%" href="/doc-js/" title="BreezeJS">
   <img src="/images/logos/BreezeJsB.png" alt="BreezeJS" width="100">
   </a>&nbsp; 
   <a style="display:inline-block;margin-right:7%" href="/doc-cs/" title="BreezeSharp">
   <img src="/images/logos/BreezeSharpB.png" alt="BreezeSharp" width="100">
   </a>&nbsp; 
</p>
 

## Breeze Server Technologies
<p>
  <a style="display:inline-block;margin-right:7%" href="/doc-net/" title="ASP.NET">
  <img src="/images/logos/Breeze-aspnet.png" alt="ASP.NET" width="100">
  </a>&nbsp; 
  <a style="display:inline-block;float:left;margin-right:7%" href="/doc-java-hib/" title="Java">
  <img src="/images/logos/Breeze-java.png" alt="Java" width="100">
  </a>&nbsp; 
  <a style="display:inline-block;float:left;margin-right:7%" href="/doc-node-mongodb/" title="Node MongoDB">
  <img src="/images/logos/Breeze-mongodb.png" alt="Node MongoDB" width="100">
  </a>&nbsp; 
  <a style="display:inline-block;float:left;margin-right:7%"  href="/doc-node-sequelize/" title="Node Sequelize">
  <img src="/images/logos/Breeze-sequelize.png" alt="Node Sequelize" width="100">
  </a>
</p>

<hr/>

<div style="clear:both"/>

{% include support-frag.html %}






