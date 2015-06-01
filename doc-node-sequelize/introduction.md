---
layout: doc-node-sequelize
---

# Introduction

Breeze client applications make three basic kinds of HTTP ajax calls:

  - 1) Breeze metadata 'Get' requests
  - 2) Breeze query 'Get' requests
  - 3) Breeze save 'Post' requests
  
The **breeze-sequelize** npm package provides a server side framework for translating the results of the breeze 
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

