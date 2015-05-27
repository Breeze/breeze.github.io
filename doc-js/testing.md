---
layout: doc-js
---

<h1>Testing a Breeze application</h1>

<p>One of the best ways to learn Breeze is through the automated <a href="/samples/doccode.html">DocCode</a> code sample. You can be sure that the examples we show in print actually work. You can clone the tests and tweak them to explore options and edge cases we didn&rsquo;t cover. And if you discover a bug, a variation on one of our tests is a great way to report it.</p>

<p>The test suite is also a useful model for testing your own application code. We&rsquo;ve tackled many of the challenges you&rsquo;ll face in testing your own code such as setting up a test suite, modularizing the tests, isolating tests with clean EntityManagers, testing asynchronous code.</p>

<p>This page will introduce you inner workings of the sample code &ldquo;teaching tests&rdquo; which demonstrate the same structure and techniques we use to develop Breeze itself.</p>

<h2>QUnit</h2>

<p>Our tests are written in popular <a href="http://qunitjs.com/">QUnit</a> test automation tool, the same tool used by the jQuery family of projects. The <a href="http://qunitjs.com/">QUnit</a> web site and many other web sources are the best way to learn it (perhaps starting <a href="http://msdn.microsoft.com/en-us/magazine/gg749824.aspx">here</a> and <a href="http://net.tutsplus.com/tutorials/javascript-ajax/how-to-test-your-javascript-code-with-qunit/">here</a>). We&rsquo;ll have to assume you know a bit about testing and a bit about QUnit so that we can move quickly to the particulars of testing Breeze.</p>

<h2>The Teaching Test Suite</h2>

<p>We&rsquo;ll also assume that you&rsquo;ve got the sample tests running. You&rsquo;ll need Visual Studio, at least to get the persistence service running. When you start the project, either with debugging (F5) or without (Ctrl-F5), a browser should launch and the window should something like this:</p>

<p><img src="/sites/default/files/images/documentation/DocCodeTestsRunning2.jpg" /></p>

<p>QUnit lists each test by its module name and test name. Clicking the test row opens a window showing the message output by each of the test&rsquo;s asserts in the test &hellip; as seen in this close up.</p>

<p><img src="/sites/default/files/images/documentation/ASingleSuccessfulTest.jpg" /></p>

<p>Double-click the test or click the faint &ldquo;Rerun&rdquo; link on the right to run just that one test.</p>

<p>Tests are grouped in modules. Each module is dedicated to a topic or theme such as &ldquo;entityTests&rdquo;. Run just the tests of a single module by picking it from the combo-box in the upper right of the toolbar (notice the query string it created in the address [<a href="#note 4">4</a>]):</p>

<p><img src="/sites/default/files/images/documentation/DocCodeTestsModulePicking.jpg" /></p>

<p>Click the title, &ldquo;Breeze Documentation Sample Test Suite&rdquo;, to get back to the full suite.</p>

<p><strong>Open</strong> <em>Scripts/test runner.js</em> and scroll down to a <span class="codeword">require</span> method call that looks a bit like this:</p>

<div>
<pre class="brush:jscript;">
require([&quot;testFns&quot; // always first

    // The test modules to run (prefix with comma):  
    , &quot;basicTodoTests&quot;
    , &quot;queryTests&quot;
    , &quot;entityTests&quot;
    // , &quot;dontRunTheseTests&quot;
    // ... more test module names

], function (testFns) {
    // Configure testfns as needed prior to running any tests

    QUnit.start(); //Tests loaded, run tests
});</pre>
</div>

<p>Each entry in the array is a module name. To exclude a module, comment it out (as we did with the &ldquo;<em>dontRunTheseTests</em>&rdquo; module). Save and refresh the browser.</p>

<p>By convention, each module is in its own JavaScript file in the <strong><em>Scripts/Tests</em></strong> folder. We&rsquo;ll look at one of them next.</p>

<p>&nbsp;</p>

<h2>Inside a test module</h2>

<p>Test modules follow a common pattern that merits examination. Here&rsquo;s the beginning of the &ldquo;<em>queryTests.js</em>&rdquo; module It&rsquo;s a bit longer than our usual examples but we&rsquo;ll take it apart in small pieces:</p>

<div>
<pre class="brush:jscript;">
define([&quot;testFns&quot;], function (testFns) {

    &quot;use strict&quot;;

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

    module(&quot;queryTests (basic)&quot;, testFns.getModuleOptions(newEm));

    /*********************************************************
    * all customers - test suite &quot;concise&quot; style
    * execute the query via a test helper method
    * that encapsulates the ceremony
    *********************************************************/

    test(&quot;all customers (concise)&quot;, 1, function () {

        var query = new EntityQuery(&quot;Customers&quot;);

        verifyQuery(newEm, query, &quot;all customers&quot;);
    });

    /*********************************************************
    * all customers - promises style
    *********************************************************/

    test(&quot;all customers (promises)&quot;, 1, function () {

        var query = new EntityQuery(&quot;Customers&quot;);

        stop();                     // going async ... tell test runner to wait
        newEm().executeQuery(query)
          .then(assertGotCustomers) // success callback
          .fail(handleFail)         // failure callback
          .fin(start);              // &quot;fin&quot; always called.
    });</pre>
</div>

<p>The module is an anonymous function, wrapped in a requireJS <span class="codeword">define</span> method call:</p>

<div>
<pre class="brush:jscript;">
define([&quot;testFns&quot;], function (testFns) { ... });</pre>
</div>

<p><span class="codeword">define</span> first locates a module called &ldquo;testFns&rdquo;. The <span class="codeword">testFns</span> object is a helper with reusable test-support functionality; its properties return constant values and its methods perform common test tasks such as setup, teardown, asserts, and error handling. <span class="codeword">testFns</span> is defined in <em>Scripts/tests/testFns.js</em></p>

<p>Having first acquired <span class="codeword">testFns</span>, the <span class="codeword">define</span> method passes it to the anonymous function in the second parameter. That anonymous function is the constructor for your test module [<a href="#note 1">1</a>].</p>

<h2>Test module preparation</h2>

<p>The test module function typically begins with some initialization logic such as</p>

<div>
<pre class="brush:jscript;">
var Breeze = testFns.Breeze;              // [1]
var entityModel = Breeze.entityModel;     // [2]

var handleFail = testFns.handleFail;      // [3]
var EntityQuery = entityModel.EntityQuery;// [4]
var verifyQuery = testFns.verifyQuery;    // [5]</pre>
</div>

<ol>
	<li value="NaN">Get the Breeze module object from the testFns helper</li>
	<li value="NaN">extract the entityModel namespace from Breeze</li>
	<li value="NaN">grab a function from the testFns helper to handle async test failures.</li>
	<li value="NaN">get objects from the entityModel namespace that you&rsquo;ll use repeatedly in this module.</li>
	<li value="NaN">grab another function from testFns that simplifies routine query validation.</li>
</ol>

<p>The next two lines are typical of test modules that need a Breeze <em>EntityManager</em>.</p>

<div>
<pre class="brush:jscript;">
var serviceName = testFns.northwindServiceName,
    newEm = testFns.emFactory(serviceName);</pre>
</div>

<p>Together they create an <em>EntityManager</em> factory function, <span class="codeword">newEm</span>, for producing new Breeze <em>EntityManager</em> instances. Each new manager will talk to the same persistence service endpoint (the <em>Northwind</em> model endpoint in this example) and will share a common set of metadata for the model for that service.</p>

<p>As we&rsquo;ll see, each test in the module calls <span class="codeword">newEm</span> to get its own, empty manager. We want our tests to run independently without any cross-test contamination. We don&rsquo;t want cached entities in one test to confuse the situation for another test [<a href="#note 2">2</a>].</p>

<p>It should be obvious by now that we are writing <em>integration</em> tests, not <em>unit</em> tests. Integration tests are appropriate because we are exploring how the parts of a Breeze app fit together.</p>

<h2>Module setup and teardown</h2>

<p>QUnit can call a setup function before running each test and call a teardown function after running each test.</p>

<p>In this test suite the setup and teardown functions are mostly the same across most of the test modules so we&rsquo;ve wrapped them up in a <span class="codeword">testFns</span> helper called <span class="codeword">getModuleOptions</span> which we call in the next line:</p>

<pre class="brush:jscript;">
module(&quot;queryTests (basic)&quot;, testFns.getModuleOptions(newEm));</pre>

<div>
<pre class="brush:jscript;">

&nbsp;</pre>
</div>

<p>The string parameter is the <strong>module name</strong> as it appears in the test output; the second parameter supplies the setup and teardown functions, configured to use this module&rsquo;s <em>EntityManager</em> factory.</p>

<h2>Calling a test</h2>

<p>Finally, we have the tests themselves. Each test is a call to QUnit&rsquo;s <span class="codeword">test</span> method.</p>

<div>
<pre class="brush:jscript;">
test(&quot;all customers (concise)&quot;, 1, function () { ... }</pre>
</div>

<p>The first string parameter is the <strong>test name</strong> as it will appear in QUnit&rsquo;s browser display. The last parameter is the <strong>test function</strong>. The body of this function is the test.</p>

<p>The first test is trivially simple:</p>

<div>
<pre class="brush:jscript;">
test(&quot;all customers (concise)&quot;, 1, function () {

    var query = new EntityQuery(&quot;Customers&quot;);

    verifyQuery(newEm, query, &quot;all customers&quot;);
});</pre>
</div>

<p>The first line establishes the query to test. The second line runs the query and verifies the results (it makes sure the server returns successfully with at least one customer).</p>

<p>This is actually an asynchronous test; <span class="codeword">verifyQuery</span> manages to hide the async ceremony from us so we can focus on the main issue &hellip; the query definition.</p>

<h2>Counting asserts</h2>

<p>Let&rsquo;s go back to the <span class="codeword">test</span> call again and talk about the <strong>middle</strong> integer parameter which is &lsquo;1&rsquo; in our example. This parameter specifies how many times we expect the test to assert something. The test fails if it actually asserts more or fewer times than expected.</p>

<p>While the assert-count expectation is optional we recommend it. A test that bails out early will lull us into false confidence. Setting an expectation keeps the test honest.</p>

<p>Remember to count the assertions in the setup function; we don&rsquo;t have setup assertions in this particular module but you might.</p>

<h2>A slightly more complex test</h2>

<p>We&rsquo;d make all tests as simple as the first one if we could. We can&rsquo;t. We often have to string together a sequence of actions and tests that defy easy encapsulation in a wrapper like <span class="codeword">verifyQuery</span>. It pays to know how <span class="codeword">verifyQuery</span> works so we can cope with complexity when we meet it.</p>

<p>Here&rsquo;s the same test without the benefit of <span class="codeword">verifyQuery</span>.</p>

<div>
<pre class="brush:jscript;">
test(&quot;all customers (promises)&quot;, 1, function () {

    var query = 
      new EntityQuery(&quot;Customers&quot;); // [1] prepare the query of interest

    stop();                         // [2] going async, stop the test runner 
    newEm().executeQuery(query)     // [3] query and wait ...
      .then(assertGotCustomers)     // [4] do this if query succeeds
      .fail(handleFail)             // [5] do that if the query fails
      .fin(start);                  // [6] resume test runner.
});</pre>
</div>

<p>We rarely change the way we deal with test failure which is why a single <span class="codeword">handleFail</span> method does the job for almost all of our tests.</p>

<p>What we do when the query (or save or whatever) succeeds might involve several lines of code. When it does, we prefer to pull that code into a separate method, named to express its intent as we&rsquo;ve done here:</p>

<div>
<pre class="brush:jscript;">
function assertGotCustomers(data) {
    var count = data.results.length;
    ok(count &gt; 0, &quot;customer query returned &quot; + count);
}</pre>
</div>

<p>Clearly this function could have been in-lined &ndash; and perhaps should have been &ndash; but it serves a more important purpose as an illustration of technique.</p>

<h2>Async testing</h2>

<p>Most of our tests are asynchronous as this one is. Most tests ask a Breeze EntityManager to make an asynchronous request of the persistence service. The test must be asynchronous if anything in the body of the test is asynchronous.</p>

<p>It takes a little forethought and effort to write an asynchronous test in JavaScript because there&rsquo;s a fundamental problem: the test runner tries to run tests synchronously. If you don&rsquo;t pay attention, your test method will complete before the asynchronous action-of-interest is finished. You may think your test passed &hellip; when in fact that interesting part is still running.</p>

<p>You have to tell the QUnit test runner to <strong><em>stop</em></strong> &hellip; and wait &hellip; until the asynchronous part is finished. Only then can the test runner resume its test processing &hellip; only then can it <strong><em>start</em></strong>.</p>

<p>Fortunately, an asynchronous testing pattern is pretty easy to follow with the aide of promises. Here&rsquo;s an example from the <strong><em>queryTests</em></strong> module that chains two asynchronous queries:</p>

<div>
<pre class="brush:jscript;">
 test(&quot;OrderDetails obtained fromEntityNavigation&quot;, 7, function () {

     var alfredsFirstOrderQuery = new EntityQuery(&quot;Orders&quot;)
       .where(&quot;CustomerID&quot;, &quot;==&quot;, testFns.wellKnownData.alfredsID)
       .take(1)
       .expand(&quot;Customer&quot;);

     var em = newEm();
     stop();                                     // [1]
     queryForOne(em, alfredsFirstOrderQuery)     // [2]
     .then(queryOrderDetailsfromEntityNavigation)// [3]
     .then(assertCanNavigateOrderOrderDetails)   // [4]
     .fail(handleFail)                           // [5]
     .fin(start);                                // [6]

 });</pre>
</div>

<ol>
	<li value="NaN">Stop the test runner (make it wait for the test to call <span class="codeword">start()</span>)</li>
	<li value="NaN">Issue the first query and wait for it to return</li>
	<li value="NaN">The 1<sup>st</sup> query returned; read it&rsquo;s results, form another query, issue that one, and wait again</li>
	<li value="NaN">The 2<sup>nd</sup> query returned; assert that it did what you expected</li>
	<li value="NaN">Handle any failures in the chain leading to this point</li>
	<li value="NaN">The end. No matter what happened, re-start the test runner</li>
</ol>

<p>To recap:</p>

<ol>
	<li>Begin with synchronous setup code</li>
	<li>Call <span class="codeword">stop()</span> just before the first async method</li>
	<li>Chain async methods together using promises <span class="codeword">then(&hellip;)</span> function</li>
	<li>Catch failure with &ldquo;<span class="codeword">.fail(handleFail)</span>&rdquo;</li>
	<li>Re-start the test runner with a final &ldquo;<span class="codeword">.fin(start)</span>&rdquo;</li>
</ol>

<h2>QUnit assertions</h2>

<p>QUnit only ships with two assertion methods, <a href="http://docs.jquery.com/QUnit/ok"><em>ok</em></a> and <a href="http://docs.jquery.com/QUnit/equals"><em>equals</em></a>. We mostly use ok we did in this example:</p>

<div>
<pre class="brush:jscript;">
ok(data.results.length &gt; 0, &quot;should have customers.&quot;);</pre>
</div>

<p>The first parameter is a true/false test; the second is a message which, while technically optional, is always required in our shop.</p>

<p>If <span class="codeword">data.results.length</span> actually is greater than zero, this test passes and displays in green. If the value is not greater than zero or the test throws an exception, it fails and displays in red:</p>

<p><img src="/sites/default/files/images/documentation/ASingleFailingTest.jpg" /></p>

<p>Some test gurus maintain that a test should check a single fact about the test subject and therefore should have only one assertion. We&rsquo;re not that picayune. We agree that a test ought to stay focused on a narrow issue. But we&rsquo;re happy to sprinkle it liberally with assertions that illuminate from multiple angles.</p>

<h2>Learn more about testing with QUnit</h2>

<p>You should turn to the web to learn more about QUnit and automated JavaScript testing. The MSDN article &ldquo;<a href="http://msdn.microsoft.com/en-us/magazine/gg749824.aspx">Automating JavaScript Testing with QUnit</a>&rdquo; by Jorn Zaefferer is a good place to start.</p>

<h2>Notes</h2>

<p><a name="note 1"></a>[1] Our use of the requireJS <span class="codeword">require(...)</span> and&nbsp; <span class="codeword">define(...)</span> methods to first resolve dependencies and then pass them as parameters to a callback function may remind you of dependency injection; it&rsquo;s how we do asynchronous dependency injection in our JavaScript applications.</p>

<p><a name="note 2"></a>[2] It is OK that these <em>EntityManagers</em> instances share the same metadata and service names. We could play it safe and get fresh metadata for each new manager. But there&rsquo;s a significant performance price for getting metadata &ndash; an extra trip to the service. The metadata and service endpoint should not change within a module so we won&rsquo;t pay that price for every test.</p>

<p><a name="note 3"></a>[3] QUnit has another test method called <span class="codeword">asyncTest</span>. It&rsquo;s tempting to use because it shouts &ldquo;async&rdquo; and it calls the initial <span class="codeword">stop()</span> for you <strong><em>at the top of the test</em></strong>.</p>

<p>You save one line per test &hellip; but at a terrible price. If the test throws an exception while arranging things before it gets to the first async method, your test will hang &hellip; forever &hellip; unless you&rsquo;ve set the QUnit global timeout (<span class="codeword">QUnit.config.testTimeout</span>) as we do in <em>test runner.js</em>.</p>

<p>If your test hangs and you don&rsquo;t instantly understand why, you&rsquo;ll probably switch back to the test method and insert a <span class="codeword">stop()</span> <em>below</em> the setup code, <em>just before</em> your first asynchronous method call. You might as well do that upfront and be done with it.</p>

<p><a name="note 4"></a>[4] The module combo-box may be missing, especially in some versions of Internet Explorer. Fortunately, filtering your test selection in the address bar is easy to do. The QUnit query string for modules, <span class="codeword">?module=...</span>, is only one of several filtering options. For example, <span class="codeword">filter=get%20all</span> runs all tests whose names contain the phrase &ldquo;<em>get all</em>&rdquo;. If you&rsquo;re typing this into a browser address bar, don&rsquo;t bother with the &ldquo;%20&rdquo; escape characters; just type <span class="codeword">filter=get all</span>. Put a bang (!) in front of the text to exclude queries whose names contain that phrase; entering <span class="codeword">?filter=!get</span> will exclude tests containing the word &ldquo;<em>get</em>&rdquo;. You can combine module and filter criteria as in this example: <span class="codeword">module=basicTodoTests&amp;filter=get</span>.</p>
