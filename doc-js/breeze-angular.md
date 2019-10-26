---
layout: doc-js
redirect_from: "/old/documentation/breeze-angular.html"
---

# Breeze AngularJS Service

Breeze and AngularJS work well together. They work *better* together when you configure Breeze to use AngularJS promises ($q) and AngularJS's ajax component ($http).

The **Breeze AngularJS Service** is a Breeze "bridge" adapter that performs this configuration for you in an "ngNatural" way.

> Breeze+AngularJS is great for modern browsers (ECMAScript 5+) that support <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty" target="_blank" style="color: blue">**Object.defineProperty**</a>. If your app must run in IE8 or earlier, the Breeze/AngularJS combination is not for you. You might consider Breeze+Durandal (Knockout).

## Install it


1. acquire the ***breeze.bridge.angular.js*** JavaScript file in one of the ways described below
	
	> This *breeze.bridge.angular.js* used to be a Breeze Labs file named *breeze.angular.js*. It was moved to Breeze core and renamed in January, 2015.

1. load that script on your web page **after** loading breeze itself.
1. add "breeze.angular" to your application module's list of dependencies
1. inject the "breeze" service into *any* application component that runs before invoking a breeze feature; this injection triggers the configuration.


### bower

The "breeze.angular" service is included among the adapters in the **breeze-client** bower package.

	bower install breeze-client

Now load it in your web page html **after** breeze itself.

	<script src="bower_components/breeze-client/adapters/breeze.bridge.angular.js"></script>

### npm

The "breeze.angular" service is included among the adapters in the **breeze-client** npm package.

> The "breeze-client" npm package becomes available with Breeze release v.1.5.3.

	npm install breeze-client

Now load it in your web page html **after** breeze itself.

	<script src="node_modules/breeze-client/adapters/breeze.bridge.angular.js"></script>

### github source


You can download the <a href="https://github.com/Breeze/breeze.js/blob/master/src/breeze.bridge.angular.js">raw JavaScript file from github</a>. Put it wherever you like.
Load it in your web page html  **after** breeze itself.


### nuget

Visual Studio users can <a href="http://www.nuget.org/packages/Breeze.Angular/" title="breeze.angular on NuGet">install it with NuGet</a>:

	Install-Package Breeze.Angular

Now load it in your web page html **after** breeze itself.

	<script src="Scripts/breeze.bridge.angular.js"></script>


> The nuget package depends on <a href="http://www.nuget.org/packages/Breeze.Client/">breeze.client</a> and the <a href="http://www.nuget.org/packages/Breeze.Angular.Directives/">breeze.angular.directives package</a> which provides the "zValidate" validation directive. You may be able to install everything you need for Breeze+AngularJS client development with this one package.


## Examples

**Example #1**: Configure when your application boots

{% highlight javascript linenos=table %}
var app = angular.module('app', [
    // ... other dependencies ...
    'breeze.angular' // the breeze service module
]);
 
// Ensure that breeze is minimally configured by loading it when the app runs
app.run(['breeze', function (breeze) { }]); // doing nothing at the moment
{% endhighlight %}


**Example #2**: Configure upon your first use of Breeze

{% highlight javascript linenos=table %}
var app = angular.module('app', [
    // ... other dependencies ...
    'breeze.angular' // the breeze service module
]);
 
// Any first use of breeze would likely involve the breeze.EntityManager.
// Apps often combine EntityManager and breeze configuration in a "factory".
// This 'entityManagerFactory' creates a new EntityManager
// configured for a specific remote service.
angular.module('app')
       .factory('entityManagerFactory', ['breeze', emFactory]);
 
function emFactory(breeze) {
  // Convert properties between server-side PascalCase and client-side camelCase
  breeze.NamingConvention.camelCase.setAsDefault();
 
  // Identify the endpoint for the remote data service
  var serviceRoot = window.location.protocol + '//' + window.location.host + '/';
  var serviceName = serviceRoot + 'breeze/breeze'; // breeze Web API controller
 
  // the "factory" services exposes two members
  var factory = {
    newManager: function() {return new breeze.EntityManager(serviceName);},
    serviceName: serviceName
  };
 
  return factory;
}
{% endhighlight %}

The Breeze AngularJS Service is not clairvoyant. It can't configure Breeze for everything your app requires. The second example illustrates configuration of the *NamingConvention* and the remote service endpoint (the `serviceName`), both specific to your application.

## The Breeze service instance

The 'breeze' service that AngularJS injects is Breeze itself, identical to `window.breeze`. Whether you use that service object or refer to the global `breeze` object is a matter of style.

The "Breeze AngularJS Service" simply configures Breeze to use

- AngularJS for data binding 
- the `$q` service for promises 
- the `$http` service for ajax calls 

The balance of this documentation provides more details about promises and the ajax service.

## Promises

A **promise** is a pledge to tell you when an asynchronous activity completes.

Breeze and AngularJS rely on promises to manage chaining of asynchronous method calls such as a sequence of data queries.

Every Breeze async method returns a ***promise object***. Initially the asynchronous activity is incomplete and the promise object is "unfullfilled". Your code continues without knowing the outcome of that activity. The promise object has a > then() method. You supply success and failure callbacks as parameters to the > then(). When the asynchronous activity completes, the promise is "fullfilled" and it invokes either your success or your failure callback as appropriate.

<a href="https://github.com/kriskowal/uncommonjs/blob/master/promises/specification.md" title="'Thenable Promises'" target="_blank">Read more about "Thenable Promises</a>" from the author of the Q.js library, <a href="https://github.com/kriskowal" title="Kris Kowal" target="_blank">Kris Kowal</a>. The AngularJS `$q` implementation adheres to his description in all essential respects.

### Breeze promises

Out of the box, a Breeze asynchronous method returns a <a href="http://documentup.com/kriskowal/q/" target="_blank">**Q.js** promise</a>, not an AngularJS <a href="http://docs.angularjs.org/api/ng.$q" target="_blank">***$q*** promise</a>. Breeze also assumes that you included the Q.js library in your client stack.

While the Q.js default makes good sense in other environments, it is not AngularJS friendly. First you have to load the Q library. Then you'll find that you often have to convert a Q promise to a `$q` promise because many AngularJS components don't understand a Q promise. Because the AngularJS dirty-checking <a href="http://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest">"Digest" cycle</a> knows nothing of Q, you'll probably have to call <a href="http://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply">> $scope.$apply</a>. Finally, it's extremely difficult to test with *ng-mocks* when you have a mix of `$q` and Q promises.

AngularJS developers should switch to `$q` promises and this Breeze AngularJS Service does that for you automatically.

### *$q* usage

There's nothing to it. Breeze async methods now return AngularJS `$q` promises. Append promise callbacks to those promises per the `$q` API.

{% highlight javascript linenos=table %}
var promise = entityManager
       .executeQuery(query)
       .then(successCallback, failCallback); // not preferred; see next.
{% endhighlight %}

### exceptions

What if one of the callbacks throws an exception? Per <a href="https://github.com/kriskowal/uncommonjs/blob/master/promises/specification.md" title="'Thenable Promises'" target="_blank">the specification</a>, if either the  `successCallback` or `failCallback` throws an exception, the promise returned from `then(...)` is rejected. Don't expect a failed `successCallback` to propagate its error to the sibling `failCallback`.

Because the `successCallback` is often fragile, especially in tests, we often move the `failCallback` to a separate `then(null, failCallback)` so that it can catch failures either of the original promise or of the "success path" promise.

>The `$q` promise sports a "sugar" method, `.catch(failCallback)`, which is the same as `.then(null, failCallback)`.

You may also need cleanup logic that should run whether the original promise succeeds or fails.

>While you could append `.then(wrapUp, wrapUp)`, we prefer another bit of sugar,  `.finally(wrapUp)`.

Putting these thoughts together we might write something like this:

{% highlight javascript linenos=table %}
var promise = entityManager
       .executeQuery(query)
       .then(successCallback)
       .catch(failCallback)
       .finally(wrapUp);
{% endhighlight %}

We encourage you to review the <a href="http://docs.angularjs.org/api/ng.$q" target="_blank">`$q` promises documentation</a> for details.

## AJAX

The Breeze `EntityManager` makes HTTP calls to a remote server via an "ajax" adapter. While Breeze ships with both a 'jQuery' and an 'angular' ajax adapter, it defaults to the 'jQuery' adapter which wraps `jquery.ajax`. This Breeze AngularJS Service re-configures breeze to use the 'angular' adapter which wraps `$http`, ensuring that Breeze receives the specific `$http` service instance that AngularJS injects into your app module.

Speaking of service instances ...

## Multiple *$q* and *$http* instances

There is a nuance you may discover in extraordinary circumstances: AngularJS creates a new `$q` and a new `$http` **for each application module**.

Rare is the application that has multiple app modules. But if you did have multiple app modules, each would have its own `$q` and `$http` instance.

Breeze expects exactly one promise and ajax implementation across the entire application. That *might* become a problem if you toggled between multiple app modules. You could workaround it by switching the Breeze promise  and ajax implementations every time you switch app modules. The specifics of this technique are beyond the scope of this topic.

You're more likely to become aware of multiple `$q` and `$http` instances during testing. In fact, you can *count on getting a new instance* for each and every test (known as a "spec" in Jasmine).

Fortunately, you get a new instance of the app module too. So when your app module and services load under test, they create a fresh instance of the Breeze AngularJS service at the same time ... and that new instance will configure Breeze with the current `$q` and `$http` services for each executing test (or "spec").

Here's an example of a Jasmine "beforeEach" test setup:

{% highlight javascript linenos=table %}
beforeEach(function () {
    module('app'); // new instance of the 'app' module
    inject(function(breeze){ }); // just to be sure.
})
{% endhighlight %}
