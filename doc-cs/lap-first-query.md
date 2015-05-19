---
layout: doc-cs
---

# First query

Many applications begin with a query for some existing data and that's how we'll begin. We're using the [Breeze Todo Sample App](/breeze-sharp/samples) to guide our lap around Breeze. We'll find the **first query** (and all other data service operations) in the ***Todo.Client/ViewModels/TodoViewModel.cs*** file.

The code snippets on this page are in the [Breeze Todo App](/breeze-sharp/samples).
**Todo** is a WPF application that works with a Web API back-end service.

# Create an EntityManager

A query can’t execute itself. We’ll need a Breeze ***EntityManager***. The ***EntityManager*** is a gateway to the persistence service which will execute the query on the backend and return query results in its response. The next few lines give us an ***EntityManager***:
	
	var serviceName = "http://localhost:63030/breeze/Todos/";
    manager = new EntityManager(serviceName);


The ***serviceName*** identifies the service end-point, the route to the Web API controller (“breeze/todos”) [<a href="#note1">1</a>]; all manager operations will address that controller.

# Todos query

We’re ready to write the first query. The Todo app query method is called ***QueryAllTodos*** and it looks like this:
	
	private async void QueryAllTodos() {
	    var query = new EntityQuery<TodoItem>(); // [1]	    
		// ... snip ...
	    var todos = await manager.ExecuteQuery(query);
	    // DoSomething(todos);
	}

1. creates a new Breeze ***EntityQuery*** object that will query objects of type ***TodoItem***.

# The manager executes the query asynchronously

We execute the query with the EntityManager
	
	var todos = await manager.ExecuteQuery(query);

The ExecuteQuery method **does not return Todos**. It can’t return Todos. A .NET client cannot freeze the browser and wait for the server to reply. The ExecuteQuery method does its thing asynchronously.

It must return something and it must do so immediately. The thing it returns is a **Task** or **Task<;TResult>;** [<a href="#note2">2</a>], representing the asynchronous operation.

# Awaiting a task

The `await` keyword is used indicate that further processing in the method should be suspended until the asynchronous task completes.  In the snippet above, the `DoSomething` method will be called when the asynchronous query completes.

# Process the query results

If the query returns from the server without error, the task contains the results of the operation. What’s in those results?

The query results of course! In this example, each ***Todo*** item is added to an IEnumerable collection bound to a list on the screen.

And just like that, the screen fills with Todos.  We’ll discuss how that happens when we peek inside the entity later in this tour. Before we do, let’s [**try another query**](/breeze-sharp-documentation/query-filter).

Notes

<a name="note1"></a>
[1] Breeze appends the “breeze/todos” service name string to the “site of origin”, probably “http://localhost:63030/” if you’re playing along at home. The EntityManager will send requests to “http://localhost:63030/breeze/todos”; the receiving Web API service routes the request to the TodosController on the server and then the server-side magic happens. You can read about this controller later.

<a name="note2"></a>
[2] The task represents the asynchronous operation, and will indicate the status of the operation, the results of a completed operation, and whether the operation was cancelled or failed.