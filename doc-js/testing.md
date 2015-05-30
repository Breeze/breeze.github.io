---
layout: doc-js
redirect_from: "/old/documentation/testing-breeze-application.html"
---
# Testing a Breeze application

One of the best ways to learn Breeze is through the automated <a href="/doc-samples/doccode.html">DocCode</a> code sample. You can be sure that the examples we show in print actually work. You can clone the tests and tweak them to explore options and edge cases we didn't cover. And if you discover a bug, a variation on one of our tests is a great way to report it.

The test suite is also a useful model for testing your own application code. We've tackled many of the challenges you'll face in testing your own code such as setting up a test suite, modularizing the tests, isolating tests with clean EntityManagers, testing asynchronous code.

This page will introduce you inner workings of the sample code 'teaching tests' which demonstrate the same structure and techniques we use to develop Breeze itself.

# QUnit

Our tests are written in popular <a href="http://qunitjs.com/">QUnit</a> test automation tool, the same tool used by the jQuery family of projects. The <a href="http://qunitjs.com/">QUnit</a> web site and many other web sources are the best way to learn it (perhaps starting <a href="http://msdn.microsoft.com/en-us/magazine/gg749824.aspx">here</a> and <a href="http://net.tutsplus.com/tutorials/javascript-ajax/how-to-test-your-javascript-code-with-qunit/">here</a>). We'll have to assume you know a bit about testing and a bit about QUnit so that we can move quickly to the particulars of testing Breeze.

# The Teaching Test Suite

We'll also assume that you've got the sample tests running. You'll need Visual Studio, at least to get the persistence service running. When you start the project, either with debugging (F5) or without (Ctrl-F5), a browser should launch and the window should something like this:

<img src="/images/samples/DocCodeTestsRunning2.jpg" />

QUnit lists each test by its module name and test name. Clicking the test row opens a window showing the message output by each of the test's asserts in the test ...  as seen in this close up.

<img src="/images/samples/ASingleSuccessfulTest.jpg" />

Double-click the test or click the faint 'Rerun' link on the right to run just that one test.

Tests are grouped in modules. Each module is dedicated to a topic or theme such as 'entityTests'. Run just the tests of a single module by picking it from the combo-box in the upper right of the toolbar (notice the query string it created in the address [<a href="#note 4">4</a>]):

<img src="/images/samples/DocCodeTestsModulePicking.jpg" />

Click the title, 'Breeze Documentation Sample Test Suite', to get back to the full suite.

**Open** *Scripts/test runner.js* and scroll down to a `require` method call that looks a bit like this:

    require(['testFns' // always first
    
        // The test modules to run (prefix with comma):  
        , 'basicTodoTests'
        , 'queryTests'
        , 'entityTests'
        // , 'dontRunTheseTests'
        // ... more test module names
    
    ], function (testFns) {
        // Configure testfns as needed prior to running any tests
    
        QUnit.start(); //Tests loaded, run tests
    });

Each entry in the array is a module name. To exclude a module, comment it out (as we did with the '*dontRunTheseTests*' module). Save and refresh the browser.

By convention, each module is in its own JavaScript file in the ***Scripts/Tests*** folder. We'll look at one of them next.

## Inside a test module

Test modules follow a common pattern that merits examination. Here's the beginning of the '*queryTests.js*' module It's a bit longer than our usual examples but we'll take it apart in small pieces:

    define(['testFns'], function (testFns) {
    
        'use strict';
    
        /*********************************************************
        * Breeze configuration and module setup 
        *********************************************************/
    
        var Breeze = testFns.Breeze;
        var entityModel = Breeze.entityModel;
    
        var handleFail = testFns.handleFail;
        var EntityQuery = entityModel.EntityQuery;
        var verifyQuery = testFns.verifyQuery;
    
        // ...skip some stuff
    
        var serviceName = testFns.northwindServiceName;
        var newEm = testFns.newEmFactory(serviceName);
    
        module('queryTests (basic)', testFns.getModuleOptions(newEm));
    
        /*********************************************************
        * all customers - test suite 'concise' style
        * execute the query via a test helper method
        * that encapsulates the ceremony
        *********************************************************/
    
        test('all customers (concise)', 1, function () {
    
            var query = new EntityQuery('Customers');
    
            verifyQuery(newEm, query, 'all customers');
        });
    
        /*********************************************************
        * all customers - promises style
        *********************************************************/
    
        test('all customers (promises)', 1, function () {
    
            var query = new EntityQuery('Customers');
    
            stop();                     // going async ... tell test runner to wait
            newEm().executeQuery(query)
              .then(assertGotCustomers) // success callback
              .fail(handleFail)         // failure callback
              .fin(start);              // 'fin' always called.
        });</pre>

The module is an anonymous function, wrapped in a requireJS `define` method call:

    define(['testFns'], function (testFns) { ... });

`define` first locates a module called 'testFns'. The `testFns` object is a helper with reusable test-support functionality; its properties return constant values and its methods perform common test tasks such as setup, teardown, asserts, and error handling. `testFns` is defined in *Scripts/tests/testFns.js*

Having first acquired `testFns`, the `define` method passes it to the anonymous function in the second parameter. That anonymous function is the constructor for your test module [<a href="#note 1">1</a>].

## Test module preparation

The test module function typically begins with some initialization logic such as

    var Breeze = testFns.Breeze;              // [1]
    var entityModel = Breeze.entityModel;     // [2]
    
    var handleFail = testFns.handleFail;      // [3]
    var EntityQuery = entityModel.EntityQuery;// [4]
    var verifyQuery = testFns.verifyQuery;    // [5]

- Get the Breeze module object from the testFns helper
- extract the entityModel namespace from Breeze
- grab a function from the testFns helper to handle async test failures.
- get objects from the entityModel namespace that you'll use repeatedly in this module.
- grab another function from testFns that simplifies routine query validation.

The next two lines are typical of test modules that need a Breeze *EntityManager*.

    var serviceName = testFns.northwindServiceName,
        newEm = testFns.emFactory(serviceName);

Together they create an *EntityManager* factory function, `newEm`, for producing new Breeze *EntityManager* instances. Each new manager will talk to the same persistence service endpoint (the *Northwind* model endpoint in this example) and will share a common set of metadata for the model for that service.

As we'll see, each test in the module calls `newEm` to get its own, empty manager. We want our tests to run independently without any cross-test contamination. We don't want cached entities in one test to confuse the situation for another test [<a href="#note 2">2</a>].

It should be obvious by now that we are writing *integration* tests, not *unit* tests. Integration tests are appropriate because we are exploring how the parts of a Breeze app fit together.

## Module setup and teardown

QUnit can call a setup function before running each test and call a teardown function after running each test.

In this test suite the setup and teardown functions are mostly the same across most of the test modules so we've wrapped them up in a `testFns` helper called `getModuleOptions` which we call in the next line:

    module('queryTests (basic)', testFns.getModuleOptions(newEm));

The string parameter is the **module name** as it appears in the test output; the second parameter supplies the setup and teardown functions, configured to use this module's *EntityManager* factory.

## Calling a test

Finally, we have the tests themselves. Each test is a call to QUnit's `test` method.

    test('all customers (concise)', 1, function () { ... }

The first string parameter is the **test name** as it will appear in QUnit's browser display. The last parameter is the **test function**. The body of this function is the test.

The first test is trivially simple:

    test('all customers (concise)', 1, function () {
      var query = new EntityQuery('Customers');
      verifyQuery(newEm, query, 'all customers');
    });

The first line establishes the query to test. The second line runs the query and verifies the results (it makes sure the server returns successfully with at least one customer).

This is actually an asynchronous test; `verifyQuery` manages to hide the async ceremony from us so we can focus on the main issue ... the query definition.

## Counting asserts

Let's go back to the `test` call again and talk about the **middle** integer parameter which is '1' in our example. This parameter specifies how many times we expect the test to assert something. The test fails if it actually asserts more or fewer times than expected.

While the assert-count expectation is optional we recommend it. A test that bails out early will lull us into false confidence. Setting an expectation keeps the test honest.

Remember to count the assertions in the setup function; we don't have setup assertions in this particular module but you might.

## A slightly more complex test

We'd make all tests as simple as the first one if we could. We can't. We often have to string together a sequence of actions and tests that defy easy encapsulation in a wrapper like `verifyQuery`. It pays to know how `verifyQuery` works so we can cope with complexity when we meet it.

Here's the same test without the benefit of `verifyQuery`.

    test('all customers (promises)', 1, function () {

        var query = 
          new EntityQuery('Customers'); // [1] prepare the query of interest
    
        stop();                         // [2] going async, stop the test runner 
        newEm().executeQuery(query)     // [3] query and wait ...
          .then(assertGotCustomers)     // [4] do this if query succeeds
          .fail(handleFail)             // [5] do that if the query fails
          .fin(start);                  // [6] resume test runner.
    });

We rarely change the way we deal with test failure which is why a single `handleFail` method does the job for almost all of our tests.

What we do when the query (or save or whatever) succeeds might involve several lines of code. When it does, we prefer to pull that code into a separate method, named to express its intent as we've done here:

    function assertGotCustomers(data) {
        var count = data.results.length;
        ok(count &gt; 0, 'customer query returned ' + count);
    }

Clearly this function could have been in-lined - and perhaps should have been - but it serves a more important purpose as an illustration of technique.

## Async testing

Most of our tests are asynchronous as this one is. Most tests ask a Breeze EntityManager to make an asynchronous request of the persistence service. The test must be asynchronous if anything in the body of the test is asynchronous.

It takes a little forethought and effort to write an asynchronous test in JavaScript because there's a fundamental problem: the test runner tries to run tests synchronously. If you don't pay attention, your test method will complete before the asynchronous action-of-interest is finished. You may think your test passed &hellip; when in fact that interesting part is still running.

You have to tell the QUnit test runner to ***stop*** ... and wait ... until the asynchronous part is finished. Only then can the test runner resume its test processing ... only then can it ***start***.

Fortunately, an asynchronous testing pattern is pretty easy to follow with the aide of promises. Here's an example from the ***queryTests*** module that chains two asynchronous queries:


     test('OrderDetails obtained fromEntityNavigation', 7, function () {
    
         var alfredsFirstOrderQuery = new EntityQuery('Orders')
           .where('CustomerID', '==', testFns.wellKnownData.alfredsID)
           .take(1)
           .expand('Customer');
    
         var em = newEm();
         stop();                                     // [1]
         queryForOne(em, alfredsFirstOrderQuery)     // [2]
         .then(queryOrderDetailsfromEntityNavigation)// [3]
         .then(assertCanNavigateOrderOrderDetails)   // [4]
         .fail(handleFail)                           // [5]
         .fin(start);                                // [6]
    
     });

- Stop the test runner (make it wait for the test to call `start()`)
- Issue the first query and wait for it to return
- The 1<sup>st</sup> query returned; read it's results, form another query, issue that one, and wait again
- The 2<sup>nd</sup> query returned; assert that it did what you expected
- Handle any failures in the chain leading to this point
- The end. No matter what happened, re-start the test runner

To recap:

- Begin with synchronous setup code
- Call `stop()` just before the first async method
- Chain async methods together using promises `then(&hellip;)` function
- Catch failure with '`.fail(handleFail)`'
- Re-start the test runner with a final '`.fin(start)`'


## QUnit assertions

QUnit only ships with two assertion methods, <a href="http://docs.jquery.com/QUnit/ok">*ok*</a> and <a href="http://docs.jquery.com/QUnit/equals">*equals*</a>. We mostly use ok we did in this example:

    ok(data.results.length &gt; 0, 'should have customers.');

The first parameter is a true/false test; the second is a message which, while technically optional, is always required in our shop.

If `data.results.length` actually is greater than zero, this test passes and displays in green. If the value is not greater than zero or the test throws an exception, it fails and displays in red:

<img src="/images/samples/ASingleFailingTest.jpg" />

Some test gurus maintain that a test should check a single fact about the test subject and therefore should have only one assertion. We're not that picayune. We agree that a test ought to stay focused on a narrow issue. But we're happy to sprinkle it liberally with assertions that illuminate from multiple angles.

## Learn more about testing with QUnit

You should turn to the web to learn more about QUnit and automated JavaScript testing. The MSDN article '<a href="http://msdn.microsoft.com/en-us/magazine/gg749824.aspx">Automating JavaScript Testing with QUnit</a>' by Jorn Zaefferer is a good place to start.

## Notes 

<a name="note 1"></a>[1] Our use of the requireJS `require(...)` and&nbsp; `define(...)` methods to first resolve dependencies and then pass them as parameters to a callback function may remind you of dependency injection; it's how we do asynchronous dependency injection in our JavaScript applications.

<a name="note 2"></a>[2] It is OK that these *EntityManagers* instances share the same metadata and service names. We could play it safe and get fresh metadata for each new manager. But there's a significant performance price for getting metadata &ndash; an extra trip to the service. The metadata and service endpoint should not change within a module so we won't pay that price for every test.

<a name="note 3"></a>[3] QUnit has another test method called `asyncTest`. It's tempting to use because it shouts 'async' and it calls the initial `stop()` for you ***at the top of the test***.

You save one line per test &hellip; but at a terrible price. If the test throws an exception while arranging things before it gets to the first async method, your test will hang &hellip; forever &hellip; unless you've set the QUnit global timeout (`QUnit.config.testTimeout`) as we do in *test runner.js*.

If your test hangs and you don't instantly understand why, you'll probably switch back to the test method and insert a `stop()` *below* the setup code, *just before* your first asynchronous method call. You might as well do that upfront and be done with it.

<a name="note 4"></a>[4] The module combo-box may be missing, especially in some versions of Internet Explorer. Fortunately, filtering your test selection in the address bar is easy to do. The QUnit query string for modules, `?module=...`, is only one of several filtering options. For example, `filter=get%20all` runs all tests whose names contain the phrase '*get all*'. If you're typing this into a browser address bar, don't bother with the '%20' escape characters; just type `filter=get all`. Put a bang (!) in front of the text to exclude queries whose names contain that phrase; entering `?filter=!get` will exclude tests containing the word '*get*'. You can combine module and filter criteria as in this example: `module=basicTodoTests&amp;filter=get`.
