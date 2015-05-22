---
layout: doc-js
redirect_from: "/old/documentation/breeze-angular.html"
---

#Breeze Angular Service

Breeze and Angular work well together. They work *better* together when you configure Breeze to use Angular promises ($q) and Angular's ajax component ($http).

The **Breeze Angular Service** is a Breeze "bridge" adapter that performs this configuration for you in an "ngNatural" way.

> Breeze+Angular is great for modern browsers (ECMAScript 5+) that support <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty" target="_blank" style="color: blue">**Object.defineProperty**</a>. If your app must run in IE8 or earlier, the Breeze/Angular combination is not for you. You might consider Breeze+Durandal (Knockout).

##Install it


1. acquire the ***breeze.bridge.angular.js*** JavaScript file in one of the ways described below
	
	> This *breeze.bridge.angular.js* used to be a Breeze Labs file named *breeze.angular.js*. It was moved to Breeze core and renamed in January, 2015.

1. load that script on your web page **after** loading breeze itself.
1. add "breeze.angular" to your application module's list of dependencies
1. inject the "breeze" service into *any* application component that runs before invoking a breeze feature; this injection triggers the configuration.


###bower

The "breeze.angular" service is included among the adapters in the **breeze-client** bower package.

	bower install breeze-client

Now load it in your web page html **after** breeze itself.

	<script src="bower_components/breeze-client/adapters/breeze.bridge.angular.js"></script>

###npm

The "breeze.angular" service is included among the adapters in the **breeze-client** npm package.

> The "breeze-client" npm package becomes available with Breeze release v.1.5.3.

	npm install breeze-client

Now load it in your web page html **after** breeze itself.

	<script src="node_modules/breeze-client/adapters/breeze.bridge.angular.js"></script>

###github source


You can download the <a href="https://github.com/Breeze/breeze.js/blob/master/src/breeze.bridge.angular.js">raw JavaScript file from github</a>. Put it wherever you like.
Load it in your web page html  **after** breeze itself.


###nuget

Visual Studio users can <a href="http://www.nuget.org/packages/Breeze.Angular/" title="breeze.angular on NuGet">install it with NuGet</a>:

	Install-Package Breeze.Angular

Now load it in your web page html **after** breeze itself.

	<script src="Scripts/breeze.bridge.angular.js"></script>


> The nuget package depends on <a href="http://www.nuget.org/packages/Breeze.Client/">breeze.client</a> and the <a href="http://www.nuget.org/packages/Breeze.Angular.Directives/">breeze.angular.directives package</a> which provides the "zValidate" validation directive. You may be able to install everything you need for Breeze+Angular client development with this one package.


##Examples

**Example #1**: Configure when your application boots

<table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td class="gutter"><div class="line number1 index0 alt2">1<div class="line number2 index1 alt1">2<div class="line number3 index2 alt2">3<div class="line number4 index3 alt1">4<div class="line number5 index4 alt2">5<div class="line number6 index5 alt1">6<div class="line number7 index6 alt2">7</td><td class="code"><div class="container"><div class="line number1 index0 alt2"><code class="javascript keyword">var <code class="javascript plain">app = angular.module(<code class="javascript string">'app'<code class="javascript plain">, [<div class="line number2 index1 alt1"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript comments">// ... other dependencies ...<div class="line number3 index2 alt2"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript string">'breeze.angular' <code class="javascript comments">// the breeze service module<div class="line number4 index3 alt1"><code class="javascript plain">]);<div class="line number5 index4 alt2">&nbsp;<div class="line number6 index5 alt1"><code class="javascript comments">// Ensure that breeze is minimally configured by loading it when the app runs<div class="line number7 index6 alt2"><code class="javascript plain">app.run([<code class="javascript string">'breeze'<code class="javascript plain">, <code class="javascript keyword">function <code class="javascript plain">(breeze) { }]); <code class="javascript comments">// doing nothing at the moment</td></tr></tbody></table>

**Example #2**: Configure upon your first use of Breeze

<table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td class="gutter"><div class="line number1 index0 alt2">1<div class="line number2 index1 alt1">2<div class="line number3 index2 alt2">3<div class="line number4 index3 alt1">4<div class="line number5 index4 alt2">5<div class="line number6 index5 alt1">6<div class="line number7 index6 alt2">7<div class="line number8 index7 alt1">8<div class="line number9 index8 alt2">9<div class="line number10 index9 alt1">10<div class="line number11 index10 alt2">11<div class="line number12 index11 alt1">12<div class="line number13 index12 alt2">13<div class="line number14 index13 alt1">14<div class="line number15 index14 alt2">15<div class="line number16 index15 alt1">16<div class="line number17 index16 alt2">17<div class="line number18 index17 alt1">18<div class="line number19 index18 alt2">19<div class="line number20 index19 alt1">20<div class="line number21 index20 alt2">21<div class="line number22 index21 alt1">22<div class="line number23 index22 alt2">23<div class="line number24 index23 alt1">24<div class="line number25 index24 alt2">25<div class="line number26 index25 alt1">26<div class="line number27 index26 alt2">27<div class="line number28 index27 alt1">28</td><td class="code"><div class="container"><div class="line number1 index0 alt2"><code class="javascript keyword">var <code class="javascript plain">app = angular.module(<code class="javascript string">'app'<code class="javascript plain">, [<div class="line number2 index1 alt1"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript comments">// ... other dependencies ...<div class="line number3 index2 alt2"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript string">'breeze.angular' <code class="javascript comments">// the breeze service module<div class="line number4 index3 alt1"><code class="javascript plain">]);<div class="line number5 index4 alt2">&nbsp;<div class="line number6 index5 alt1"><code class="javascript comments">// Any first use of breeze would likely involve the breeze.EntityManager.<div class="line number7 index6 alt2"><code class="javascript comments">// Apps often combine EntityManager and breeze configuration in a "factory".<div class="line number8 index7 alt1"><code class="javascript comments">// This 'entityManagerFactory' creates a new EntityManager<div class="line number9 index8 alt2"><code class="javascript comments">// configured for a specific remote service.<div class="line number10 index9 alt1"><code class="javascript plain">angular.module(<code class="javascript string">'app'<code class="javascript plain">)<div class="line number11 index10 alt2"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript plain">.factory(<code class="javascript string">'entityManagerFactory'<code class="javascript plain">, [<code class="javascript string">'breeze'<code class="javascript plain">, emFactory]);<div class="line number12 index11 alt1">&nbsp;<div class="line number13 index12 alt2"><code class="javascript keyword">function <code class="javascript plain">emFactory(breeze) {<div class="line number14 index13 alt1"><code class="javascript spaces">&nbsp;&nbsp;<code class="javascript comments">// Convert properties between server-side PascalCase and client-side camelCase<div class="line number15 index14 alt2"><code class="javascript spaces">&nbsp;&nbsp;<code class="javascript plain">breeze.NamingConvention.camelCase.setAsDefault();<div class="line number16 index15 alt1">&nbsp;<div class="line number17 index16 alt2"><code class="javascript spaces">&nbsp;&nbsp;<code class="javascript comments">// Identify the endpoint for the remote data service<div class="line number18 index17 alt1"><code class="javascript spaces">&nbsp;&nbsp;<code class="javascript keyword">var <code class="javascript plain">serviceRoot = window.location.protocol + <code class="javascript string">'//' <code class="javascript plain">+ window.location.host + <code class="javascript string">'/'<code class="javascript plain">;<div class="line number19 index18 alt2"><code class="javascript spaces">&nbsp;&nbsp;<code class="javascript keyword">var <code class="javascript plain">serviceName = serviceRoot + <code class="javascript string">'breeze/breeze'<code class="javascript plain">; <code class="javascript comments">// breeze Web API controller<div class="line number20 index19 alt1">&nbsp;<div class="line number21 index20 alt2"><code class="javascript spaces">&nbsp;&nbsp;<code class="javascript comments">// the "factory" services exposes two members<div class="line number22 index21 alt1"><code class="javascript spaces">&nbsp;&nbsp;<code class="javascript keyword">var <code class="javascript plain">factory = {<div class="line number23 index22 alt2"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript plain">newManager: <code class="javascript keyword">function<code class="javascript plain">() {<code class="javascript keyword">return <code class="javascript keyword">new <code class="javascript plain">breeze.EntityManager(serviceName);},<div class="line number24 index23 alt1"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript plain">serviceName: serviceName<div class="line number25 index24 alt2"><code class="javascript spaces">&nbsp;&nbsp;<code class="javascript plain">};<div class="line number26 index25 alt1">&nbsp;<div class="line number27 index26 alt2"><code class="javascript spaces">&nbsp;&nbsp;<code class="javascript keyword">return <code class="javascript plain">factory;<div class="line number28 index27 alt1"><code class="javascript plain">}</td></tr></tbody></table>

The Breeze Angular Service is not clairvoyant. It can't configure Breeze for everything your app requires. The second example illustrates configuration of the *NamingConvention* and the remote service endpoint (the *serviceName*), both specific to your application.

##The Breeze service instance

The 'breeze' service that Angular injects is Breeze itself, identical to > window.breeze. Whether you use that service object or refer to the global > breeze object is a matter of style.

The "Breeze Angular Service" simply configures Breeze to use


	- Angular for data binding 
	- the *$q* service for promises 
	- the *$http* service for ajax calls 


The balance of this documentation provides more details about promises and the ajax service.

##Promises

A **promise** is a pledge to tell you when an asynchronous activity completes.

Breeze and Angular rely on promises to manage chaining of asynchronous method calls such as a sequence of data queries.

Every Breeze async method returns a ***promise object***. Initially the asynchronous activity is incomplete and the promise object is "unfullfilled". Your code continues without knowing the outcome of that activity. The promise object has a > then() method. You supply success and failure callbacks as parameters to the > then(). When the asynchronous activity completes, the promise is "fullfilled" and it invokes either your success or your failure callback as appropriate.

<a href="https://github.com/kriskowal/uncommonjs/blob/master/promises/specification.md" title="'Thenable Promises'">Read more about "Thenable Promises</a>" from the author of the Q.js library, <a href="https://github.com/kriskowal" title="Kris Kowal">Kris Kowal</a>. The Angular *$q* implementation adheres to his description in all essential respects.

###Breeze promises

Out of the box, a Breeze asynchronous method returns a <a href="http://documentup.com/kriskowal/q/" target="_blank">**Q.js** promise</a>, not an AngularJS <a href="http://docs.angularjs.org/api/ng.$q" target="_blank">**$q** promise</a>. Breeze also assumes that you included the Q.js library in your client stack.

While the Q.js default makes good sense in other environments, it is not Angular friendly. First you have to load the Q library. Then you'll find that you often have to convert a Q promise to a *$q* promise because many Angular components don't understand a Q promise. Because the Angular dirty-checking <a href="http://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest">"Digest" cycle</a> knows nothing of Q, you'll probably have to call <a href="http://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply">> $scope.$apply</a>. Finally, it's extremely difficult to test with *ng-mocks* when you have a mix of *$q* and Q promises.

Angular developers should switch to *$q* promises and this Breeze Angular Service does that for you automatically.

### *$q* usage

There's nothing to it. Breeze async methods now return Angular *$q* promises. Append promise callbacks to those promises per the *$q* API.

<table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td class="gutter"><div class="line number1 index0 alt2">1<div class="line number2 index1 alt1">2<div class="line number3 index2 alt2">3</td><td class="code"><div class="container"><div class="line number1 index0 alt2"><code class="javascript keyword">var <code class="javascript plain">promise = entityManager<div class="line number2 index1 alt1"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript plain">.executeQuery(query)<div class="line number3 index2 alt2"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript plain">.then(successCallback, failCallback); <code class="javascript comments">// not preferred; see next.</td></tr></tbody></table>

###exceptions

What if one of the callbacks throws an exception? Per <a href="https://github.com/kriskowal/uncommonjs/blob/master/promises/specification.md" title="'Thenable Promises'">the specification</a>, if either the  *successCallback* or *failCallback* throws an exception, the promise returned from *then(...)* is rejected. Don't expect a failed *successCallback* to propagate its error to the sibling *failCallback*.

Because the *successCallback* is often fragile, especially in tests, we often move the *failCallback* to a separate *then(null, failCallback)* so that it can catch failures either of the original promise or of the "success path" promise.

<blockquote>
	The *$q* promise sports a "sugar" method, *.catch(failCallback)*, which is the same as *.then(null, failCallback)*.
</blockquote>

You may also need cleanup logic that should run whether the original promise succeeds or fails.

<blockquote>
	While you could append *.then(wrapUp, wrapUp)*, we prefer another bit of sugar,  *.finally(wrapUp)*.
</blockquote>

Putting these thoughts together we might write something like this:

<table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td class="gutter"><div class="line number1 index0 alt2">1<div class="line number2 index1 alt1">2<div class="line number3 index2 alt2">3<div class="line number4 index3 alt1">4<div class="line number5 index4 alt2">5</td><td class="code"><div class="container"><div class="line number1 index0 alt2"><code class="javascript keyword">var <code class="javascript plain">promise = entityManager<div class="line number2 index1 alt1"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript plain">.executeQuery(query)<div class="line number3 index2 alt2"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript plain">.then(successCallback)<div class="line number4 index3 alt1"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript plain">.<code class="javascript keyword">catch<code class="javascript plain">(failCallback) <div class="line number5 index4 alt2"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript plain">.finally(wrapUp);</td></tr></tbody></table>

We encourage you to review the <a href="http://docs.angularjs.org/api/ng.$q" target="_blank">**$q** promises documentation</a> for details.

##AJAX

The Breeze *EntityManager* makes HTTP calls to a remote server via an "ajax" adapter. While Breeze ships with both a 'jQuery' and an 'angular' ajax adapter, it defaults to the 'jQuery' adapter which wraps *jquery.ajax*. This Breeze Angular Service re-configures breeze to use the 'angular' adapter which wraps *$http*, ensuring that Breeze receives the specific *$http* service instance that Angular injects into your app module.

Speaking of service instances ...

##Multiple *$q* and *$http* instances

There is a nuance you may discover in extraordinary circumstances: Angular creates a new *$q* and a new *$http* **for each application module**.

Rare is the application that has multiple app modules. But if you did have multiple app modules, each would have its own *$q* and *$http* instance.

Breeze expects exactly one promise and ajax implementation across the entire application. That *might* become a problem if you toggled between multiple app modules. You could workaround it by switching the Breeze promise  and ajax implementations every time you switch app modules. The specifics of this technique are beyond the scope of this topic.

You're more likely to become aware of multiple *$q* and *$http* instances during testing. In fact, you can *count on getting a new instance* for each and every test (known as a "spec" in Jasmine).

Fortunately, you get a new instance of the app module too. So when your app module and services load under test, they create a fresh instance of the Breeze Angular service at the same time ... and that new instance will configure Breeze with the current *$q* and *$http* services for each executing test (or "spec").

Here's an example of a Jasmine "beforeEach" test setup:

<table border="0" cellpadding="0" cellspacing="0"><tbody><tr><td class="gutter"><div class="line number1 index0 alt2">1<div class="line number2 index1 alt1">2<div class="line number3 index2 alt2">3<div class="line number4 index3 alt1">4</td><td class="code"><div class="container"><div class="line number1 index0 alt2"><code class="javascript plain">beforeEach(<code class="javascript keyword">function <code class="javascript plain">() {<div class="line number2 index1 alt1"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript plain">module(<code class="javascript string">'app'<code class="javascript plain">); <code class="javascript comments">// new instance of the 'app' module<div class="line number3 index2 alt2"><code class="javascript spaces">&nbsp;&nbsp;&nbsp;&nbsp;<code class="javascript plain">inject(<code class="javascript keyword">function<code class="javascript plain">(breeze){ }); <code class="javascript comments">// just to be sure.<div class="line number4 index3 alt1"><code class="javascript plain">})</td></tr></tbody></table>
