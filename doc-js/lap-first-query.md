---
layout: doc-js
redirect_from: "/old/documentation/.html"
---
#First query

Many applications begin with a query for some existing data and that's how we'll begin. We're using the <a href="/samples/todo">Breeze Todo Sample App</a> to guide our lap around Breeze. We'll find the **first query** (and all other data service operations) in the *Scripts/services/**dataservice.js*** folder.

The code snippets on this page are in the <a href="/samples/todo">Breeze Todo App</a>.

##Setup

**Open*** Scripts/services/**dataservice.js***.

This Todo app works with the <a href="http://knockoutjs.com/" target="_blank">Knockout </a>model library and a <a href="http://www.asp.net/web-api" target="_blank">Web API</a> back-end service. You might prefer a different model library (e.g., "backbone") or a different data service (e.g., "OData") in which case you'd make those preferences known first, at the top of this file (see the <a href="/samples/todo-angular" target="_top">Todo-Angular</a> version for an example). In Basic Breeze we're building with Knockout and the Web API; these are the Breeze defaults so we can proceed without further ado.

##Create an EntityManager

A query can't execute itself. We'll need a Breeze ***EntityManager***. The *EntityManager* is a gateway to the persistence service which will execute the query on the backend and return query results in its response. The next few lines give us an *EntityManager*:

<pre class="brush:jscript;">
var serviceName = 'breeze/todos', // route to the Web Api controller
    manager = new breeze.EntityManager(serviceName);


The *serviceName *identifies the service end-point, the route to the Web API controller ("breeze/todos") [<a href="#note 1">1</a>]; all *manager *operations will address that controller.

##Todos query

We're ready to write the first query. The Todo app query method is called *getAllTodos *and it looks like this:


<pre class="brush:jscript;">
function getAllTodos(includeArchived) {
    var query = breeze.EntityQuery // [1]
            .from("Todos")         // [2]
            .orderBy("CreatedAt"); // [3]

    // ... snip ...

    return manager.executeQuery(query);
};



	<li>creates a new Breeze *EntityQuery *object
	<li>aims the query at a method on the Web API controller named "*Todos*" that returns *Todo* items.
	<li>adds an *orderBy* clause that tells the remote service to sort results by the "CreatedAt" property *before* sending them to the client.



The string, "Todos", is case sensitive and must match the controller method name *exactly*.


##The manager makes a promise

We execute the query with the EntityManager


<pre class="brush:jscript;">
 return manager.executeQuery(query);


The executeQuery method **does not return Todos**. It can't return Todos. A JavaScript client cannot freeze the browser and wait for the server to reply. The executeQuery method does its thing asynchronously.

It must return something and it must do so immediately. The thing it returns is a **promise **[<a href="#note 2">2</a>], a promise to report back when the service response arrives.

##Accepting a promise

A caller of the *dataservice*'s ***getAllTodos ***method typically attaches both a success and failure callback to the returned promise. Here's how the Todo app's ***ViewModel ***calls *getAllTodos*:


<pre class="brush:jscript;">
 function getTodos() {
     dataservice.getAllTodos(includeArchived)
         .then(querySucceeded)
         .fail(queryFailed);
 }


Notice the use of method chaining:


	<li>the *dataservice* returned a promise;
	<li>the *ViewModel* called the promise's *then( ... )* method for the success path
	<li>the *ViewModel* called the promise's *fail( ... )* method for the failure path.


Both the *then() *and the *fail() *return a promise which means we can chain a sequence of asynchronous steps. Such syntax makes it easy to flatten what might otherwise be a nasty nest of dependent async calls. We don't have dependent async calls in this application... but a real application might... and you'll see plenty of examples among the <a href="/samples/doccode" target="_blank">teaching tests</a> [<a href="#note 3">3</a>].

##Process the query results

If the query returns from the server without error, the promise calls the *ViewModel*'s *querySucceeded *method, passing in a data packet from the *EntityManager*. What's in that packet?

The query results of course! Get them from the ***data.results*** property as the *ViewModel* does. In this example, each *Todo *item is pushed into a <a href="http://knockoutjs.com/documentation/observableArrays.html">Knockout observable array</a> bound to a list on the screen.


<pre class="brush:jscript;">
function querySucceeded(data) {
    ...
    data.results.forEach(function (item) {
        ...
        shellVm.items.push(item);
    });
    ...
}


And just like that, the screen fills with *Todos*.  We'll discuss how *that* happens when we peek inside the entity <a href="/doc-js/databinding-knockout">later in this tour</a>. Before we do, let's **<a href="/doc-js/query-filter">try another query</a>**.

##Notes

<a name="note 1"></a>[1] Breeze appends the "breeze/todos" service name string to the "site of origin", probably "http://localhost:26843/" if you're playing along at home. The *EntityManager *will send requests to "http://localhost:26843/breeze/todos"; the receiving Web API service routes the request to the TodosController on the server and then the server-side magic happens. You can <a href="/doc-js/web-api-controller">read about this controller</a> later.

<a name="note 2"></a>[2] Promises are a technique for managing sequences of asynchronous method calls.

<a name="note 3"></a>[3] See the "get by Id" test in *basicTodoTest* test module.
