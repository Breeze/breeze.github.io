---
layout: doc-node-sequelize
---

# Introduction

Breeze-Sequelize lets you develop JavaScript applications using the same powerful idioms on the client and server.  You can

- query with a rich query syntax
- navigate the graph of related entities
- track changes as you add/change/delete entities
- perform client-side validation
- save all changes in a single transaction
- use the same entity model on the server and client

## Client and Server

**Breeze JS** ([breeze-client](https://www.npmjs.com/package/breeze-client)) is a pure JavaScript library for managing data on the client, much as an ORM manages it on the server.  

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
	<div class="diagram-box-row" style="background-color: rgb(226, 98, 189);">Angular / Aurelia / React / etc.</div>
	<div class="diagram-box-row" style="background-color: rgb(126, 197, 238);"><b>Breeze JS</b></div>
</div>

<div class="diagram-line" style="line-height: 40px;">JSON</div>

<div class="diagram-box" style="width: 300px">
	<div class="diagram-box-title">Node Server</div>
	<div class="diagram-box-row" style="background-color: rgb(113, 159, 192);">Express / Routing layer</div>
	<div class="diagram-box-row" style="background-color: rgb(126, 197, 238);"><b>Breeze-Sequelize</b></div>
	<div class="diagram-box-row" style="background-color: rgb(219, 212, 184);">Sequelize</div>
</div>
</div>

**Breeze Sequelize** ([breeze-sequelize](https://www.npmjs.com/package/breeze-sequelize)) is a server-side library that works with [Sequelize](http://docs.sequelizejs.com/en/latest/) to manage persistence for Breeze client applications.  It turns Breeze queries into Sequelize queries, and saves changes to the database using Sequelize.  

The Breeze server is designed to be **stateless**.  **No** long-running transactions, detached objects, or persistent connections are required.  Entity state is kept on the client, not the server.

Breeze clients do not *require* a Breeze server; for example, BreezeJS will also work with existing RESTful APIs.  The full power of Breeze comes with supporting the three types of client-server communication.

## Client-Server Communication

Breeze client applications make three basic kinds of AJAX calls:

   1. Breeze metadata 'GET' requests
   2. Breeze query 'GET' requests
   3. Breeze save 'POST' requests
 
The [breeze-sequelize](https://www.npmjs.com/package/breeze-sequelize) npm package provides a server side framework for translating the results of the breeze 
*query* and *save* HTTP calls into operations against any backend database supported by the node 'Sequelize' library.  

The [node 'Sequelize' library](https://github.com/sequelize/sequelize "sequelize on github ") is described on github as follows 

> The Sequelize library provides easy access to MySQL, MariaDB, SQLite or PostgreSQL databases by mapping database entries to objects and vice versa. To put it in a nutshell, it's an ORM (Object-Relational-Mapper). The library is written entirely in JavaScript and can be used in the Node.JS environment.    

> Note that In order to use the 'breeze-sequelize' library, you do NOT need to interact directly with 'Sequelize', so knowledge of how to query or save with 'Sequelize' is not actually necessary, but might be helpful. 

## Node libraries needed for a Breeze-Sequelize server

  - **breeze-sequelize**: Breeze library that allows client side breeze query and save requests to be translated into Sequelize syntax and executed against a backend SQL database.
  	- Note that internally *breeze-sequelize* uses the *breeze-client* npm library. 

Standard usage:
       
    var breezeSequelize = require("breeze-sequelize");

Additional libraries ( not actually required but useful for certain operations)

    var Sequelize = require('sequelize'); // The actual 'sequelize' library used by 'breeze-sequelize'
    var Promise = require('bluebird');    // The Promise implementation used by 'breeze-sequelize'

## Configuring the Client

There are two different URI formats that the Breeze client can use to send queries to the server: [OData](http://www.odata.org/documentation/odata-version-3-0/url-conventions/#url5) and [JSON](http://breeze.github.io/doc-js/query-using-json.html).  

The Breeze Sequelize server only understands the JSON format, so you'll need to configure the client:

    breeze.core.config.initializeAdapterInstance("uriBuilder", "json");

  