---
layout: samples
redirect_from: "/old/samples/doccode.html"
---
# DocCode "Teaching Tests"

DocCode is the code companion to the Breeze documentation. Every code snippet you read should be present as a working example somewhere in the DocCode. Please let us know if we missed one.


DocCode helps you experience Breeze features as running code. It consists of a battery of <a href="http://qunitjs.com/" target="_blank">QUnit </a>automated tests we call "Teaching Tests". You can add new tests to explore aspects of Breeze that interest you. If you think your new Teaching Test could benefit others, please send it to us and we'll put it in a nice spot, with kudos to you. The Breeze community thanks you in advance.

## Video
The following video shows you how to use the DocCode sample.

>The video is slightly dated. The "Basic Breeze" test modules make use of the Todo Sample application's model and server-side controller. A copy of the Todo application used to be embedded in DocCode. Rather than maintain two copies of the same application, we removed the client-side Todo app from DocCode. We refer you now to the single, stand-alone version of the [Todo sample application](/samples/todo).

The first part of the video explains the Todo application which is the context for the "Basic Breeze" tests; the DocCode test framework walk-through <a href="http://www.youtube.com/watch?v=6OULlr7A6Ps&amp;feature=player_detailpage#t=295s" target="_blank">begins at 4:58</a>.</p>
<p><iframe allowfullscreen="" frameborder="0" height="315" src="http://www.youtube.com/embed/6OULlr7A6Ps" width="420"></iframe></p>
## Setup
1. **Open** the *DocCode* solution in Visual Studio.

1. **Build** it. It may take a while to download the NuGet packages.

1. **Look at the output window** when it's finished building. There should be no errors, warnings or messages.

## Run the tests
Start the app, either with debugging (F5) or without debugging (**Ctrl-F5**). The browser launches, displaying test results as shown in this snapshot

<img alt="" src="/images/samples/DocCodeTestsRunning.jpg" style="border-width: 0px; border-style: solid;" />

QUnit lists each test by its module name and test name. Clicking the test row opens a window showing the message output by each of the test's asserts in the test &hellip; as seen in this close up.

<img src="/images/samples/ASingleSuccessfulTest.jpg" style="border-width: 0px; border-style: solid;" />

Double click the test name or click the faint **Rerun** link on the right to run just that one test.

Tests are grouped in modules. Each module is dedicated to a topic or theme such as *entityTests*. Run just the tests of a single module by picking it from the combo-box in the upper right of the toolbar:

<img alt="" src="/images/samples/DocCodeTestsModulePicking.jpg" style="border-width: 0px; border-style: solid;" />

Click the title, "Breeze Documentation Test Suite", to get back to the full suite.

Tests are grouped in modules. Each module is dedicated to a topic or theme such as *entityTests*. In most cases, each module is in its own JavaScript test file in the ***tests*** folder.

You'll find the test scripts enumerated in *index.html*.

## An example

**Open** *tests/basicTodoTests.js* test file which illustrates basic Breeze functionality by accessing a Web API "Todos" service.

The script encapsulates details using the JavaScript standard [IIFE style](http://benalman.com/news/2010/11/immediately-invoked-function-expression/).

    (function(testFns) {
     ...
     })(docCode.testFns);

We're "injecting" the global object, `docCode.testFns`, into the scope of the test script. 

`testFns` is a collection of helper methods and values that reduce repetition throughout the entire docCode test suite. It's defined in *tests/helpers/testFns.js* along with several other helper JavaScript files.

The script begins by defining some convenience variables ... simply to reduce the amount of typing we'll have to do later in the file:

    var EntityManager = breeze.EntityManager;
    var EntityQuery   = breeze.EntityQuery;
    ...
    var handleFail    = testFns.handleFail; // async failure callback
    var verifyQuery   = testFns.verifyQuery;
    ... 

Soon we arrive at the QUnit `module` which sets the scope for the subsequent tests in this file.

Right away were relying on `testFns` to define some routine *before* test and *after* test behavior ... the setup and teardown we'll need for these "Todos"-oriented tests.

At last we come to our first real test ... a test that shows how to query for all "Todos" and then assert that we got them.

Because we're querying an actual server (one running as "localHost"), this has to be an asynchronous test. There are several ways to define async tests with QUnit. Here we see one of them, the [**`asyncTest`**](http://api.qunitjs.com/QUnit.asyncTest/). 

The basic outline of a DocCode async test looks like this:

    asyncTest("a description of Breeze functionality", function () {
      expect(1); // expected number of assertions in this test

      var aPromise = doSomethingAsync();

      aPromise
        .then(success)
        .catch(handleFail)
        .finally(start); // resume testrunner
    });

* We tell QUnit it's going to be an async test. 
* We tell it how many assertions we'll run (one in this example). 
* We do *something* of interest ... what we're testing ... that returns a promise.
* *then* if the *something* succeeds, we run a success callback ... where we expect (assert) that good things happened.
* We *catch* the error if our test method throw one and process that in our failure callback.
* *finally*, in either case, we re-`start` the QUnit test runner.

Here is the actual first test:

    asyncTest("get all todos (raw)", function () {
      expect(1);
      var query = new EntityQuery("Todos");

      var em = new EntityManager(serviceName);

      em.executeQuery(query)
          .then(function (data) {
            var count = data.results.length;
            ok(count > 0, "all todos query succeeded; count = " + count);
          })
          .catch(handleFail)
          .finally(start); // resume testrunner
    });

The querying is what we're actually interested in demonstrating with our test. 

      var query = new EntityQuery("Todos");

      var em = new EntityManager(serviceName);

      em.executeQuery(query)

That's the meat of it. Those are the only three lines that really matter.

Three good lines out of twelve is a poor signal-to-noise ratio. Therefore, we'll often strive to reduce the noise with additional `testFns` helper methods ... as seen in the next test which ***does the same thing*** but with less ceremony. 

    test("get all todos (condensed)", function () {
        expect(1);

        var query = new EntityQuery("Todos"); // query all Todos

        verifyQuery(newEm, query, "all todos query");
    });

This too is an *async* test ... despite the fact that it is built with the *synchronous* QUnit `test` method.  

We can do this because inside `testFns.verifyQuery` 

* we're telling QUnit to run the test asynchronously
* creating the manager and executing the query
* attaching success and fail callbacks to the promise
* asserting that we did get results from within the success callback
* finally calling `start` to resume the QUnit test runner regardless of outcome.

Presumably you are now able to focus on the one line of interest ... and learn from it:

    var query = new EntityQuery("Todos"); // query all Todos

## Have fun

After you've looked at this test and a few of the others, you should feel comfortable playing along and writing your own. 

Maybe you want to try  `where` and `take` in combination. So you copy the previous query and modify it to get the first "Todo" with a description that begins with "A".


    test("get all todos (condensed)", function () {
        expect(1);

        var query = new EntityQuery("Todos")
            .where('Description', 'startsWith', 'A')
            .take(1)

        verifyQuery(newEm, query, "first 'A' Todo query");
    });


## Knockout bias?

DocCode is written as a Knockout (KO) application sample and you'll see evidence of that here and there. For example, almost all entity properties are KO observable properties which means you get and set values with functions:

	var desc = todo.Description();       // get the value
    todo.Description('New description'); // set the value

Don't despair if you're not using Knockout. These teaching tests illustrate features of Breeze. Almost all of those features apply to entity models written for *any* presentation framework: Angular, React, Backbone, Ember, etc. Getting and setting property values is almost never the point.

So please do your best to look past the KO-isms and glean insights about Breeze.

## DocCode Persistence Services

Many of the DocCode tests make calls upon remote services implemented as ASP.NET Web API controllers.

One of them is the Web API `TodosController` from the [Breeze Todos application](/samples/todo). The controller calls upon an Entity Framework "code first" model with a single `TodoItem` entity, mapped to the single-table *Todos* database. While patently simplistic, it does have two virtues from our point of view: it's easy to understand and it's easy to rebuild. After messing it up with saved changes, we can quickly restore it to a known state.

A second service is implemented with the Web API `NorthwindController`. It also talks to a "code first" Entity Framework model.  This one is backed by the "Northwind" SQL Server database which has more than 15 interrelated tables.

*Northwind* stores data for the fictional "Northwind" company whose seven employees sell a variety of strangely named food products to some 90+ customers. The database holds orders placed with those customers. Each order has associated order line items called "OrderDetails".

>The Northwind database referenced by this test suite is IdeaBlade's slightly altered version of the well-known <a href="http://www.sqltutorial.org/sqlsampledatabase.aspx" target="_blank">Northwind sample database</a> from Microsoft.
>
>This is a  SQL CE database located at *App_Data/NorthwindIB.sdf*. Get the latest Visual Studio tools for SQL CE from <a href="http://sqlcetoolbox.codeplex.com/" target="_blank">here</a> and  <a href="https://visualstudiogallery.msdn.microsoft.com/0e313dfd-be80-4afb-b5e9-6e74d369f7a1/" target="_blank">here</a>. 

The *Northwind* schema betrays a history of dubious decisions, typical of real world databases. Primary keys are inconsistent (guids, integers, strings). The "OrderDetail" table has a two-part key {CustomerID, EmployeeID}. Each employee's image is stored one of Employee table columns, making the full employee entity an unnecessarily heavy choice in most UI scenarios. These peculiarities afford opportunities to demonstrate such distinctive features as exclusion of a heavy-weight image property with a projection query.

## Microsoft bias?
A breeze application doesn't have to depend upon .NET or any server-side technology. It doesn't have to depend upon ASP.NET Web API, MVC, IIS, Entity Framework, SQL Server, Visual Studio, or NuGet &hellip; although all of these Microsoft technologies play a part in supporting these DocCode teaching tests.

Please stick around even if .NET is not your thing. We chose these technologies for historical reasons and for (our) convenience. But you're not stuck with any of them and there are many other Breeze samples that communicate with non-Microsoft server technologies including Java, Rails, PHP, and Node.

Remember that Breeze is a ***client-side JavaScript library*** and this DocCode sample concentrates on client-side HTML/JavaScript development with Breeze. The server technology is mostly irrelevant.

>Mostly but not entirely. If you're a .NET Entity Framework developer, examining the DocCode server code can teach you a great deal about Web API strategies, Json.Net serialization, EF modeling, and UnitOfWork and respository patterns.
