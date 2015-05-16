---
layout: doc-js
---

#Controlling AJAX calls

A Breeze [*DataSeviceAdapter*](dataserviceadapters) makes HTTP calls to a **Breeze AJAX adapter** that wraps a 3rd party low-level AJAX component. 

The default Breeze AJAX adapter wraps the <a href="http://api.jquery.com/jQuery.ajax/" target="_blank">jQuery.ajax</a> method and assumes your client app is running with jQuery. But you can configure Breeze to use an alternative AJAX implementations or write your own adapter ... as described below.

<p class="note">The OData <em>DataServiceAdapters</em> do <strong>not</strong> use a Breeze AJAX adapter to communicate with OData web services! See the <a href="#odata-ajax">"OData AJAX" discussion below</a></p>

#### Why two adapters?

The *AJAX adapter* and the *DataServiceAdapter* are independent abstractions, a Breeze application can talk to different web services with the same low-level AJAX component or talk to the same web service with different AJAX components. 

For example, your app might communicate with an ASP.NET Web API service, a Node data service, or perhaps a Rails server. Each of these targets requires its own *DataServiceAdapter*, attuned to the specifics of that service's API. But when it comes time to make HTTP requests, your app can speak to any of these services with your preferred AJAX component. 

##Picking an AJAX adapter

You can configure your app to use any AJAX adapter that has been registered with Breeze. Angular applications typically designate the 'angular' AJAX adapter that wraps [Angular's `$http`](https://docs.angularjs.org/api/ng/service/$http) (as described [below](#angular)).

Breeze core offers two adapters *out of the box* and you can [write your own](#customAdapter). 

You designate the AJAX adapter for your app with an expression like **one** of the following:

    var adapterName;

    // pick one
    adapterName = 'jQuery';  // the default
    adapterName = 'angular';
    adapterName = 'custom';  // your custom adapter
    
    var ajaxAdapter = 
        breeze.config.initializeAdapterInstance('ajax', adapterName, true /* use as default */); 

>The "jQuery" adapter is the default AJAX adapter. You don't have to initialize this adapter as we did here for illustrative purposes.

<a name="angular"></a>
##The AngularJS $http adapter

Many Angular developers prefer to use Angular's native `$http` AJAX component; *we do*.

You *could* designate this as your AJAX adapter as follows:

    angular.module('app').run(['$http', function($http) {
        var ajax = breeze.config.initializeAdapterInstance('ajax', 'angular');
        ajax.setHttp($http); // use the $http instance that Angular injected into your app.
    }]);

However, there's **a much better way to prepare Breeze for Angular**, a way that not only selects the Breeze 'angular' AJAX adapter but also **configures Breeze to us Angular's `$q` promises** and chooses the best Breeze **'modelLibrary' adapter for data binding** with Angular.

It's an Angular module called the "**Breeze Angular Service**".  You can download it from github or install the package [as described here](breeze-angular "Breeze Angular Service"). 

Then wire it up when your app boots:

    angular.module('app', ['breeze.angular'])
           // merely depending on the 'breeze' service configures Breeze for Angular
           .run(['breeze', function() {/* noop - unless you want do do something */}]);

Internally, the "Breeze Angular Service" makes the same AJAX adapter configuration shown above ... as well as other configurations.

#Configuring an AJAX adapter

An AJAX adapter may require some setup before it can be used. It's best to pick your adapter and configure it ***before you make any HTTP calls through Breeze***.

For example, you might want to send a fixed set of headers with every Breeze AJAX request.

     // get the current default Breeze AJAX adapter
     var ajaxAdapter = breeze.config.getAdapterInstance('ajax');

     // set fixed headers
     ajaxAdapter.defaultSettings = {
         headers: { 
            "X-Test-Header": "foo2" 
         },
    };

Some AJAX components have their own proprietary settings and you might want to configure them too. 

For example, the jQuery `ajax` method takes a `settings` configuration object. One of the settings is a `beforeSend` function.  You could set a default for that function too:

    // get the current Breeze AJAX adapter (assume it is 'jQuery')
    var ajaxAdapter = breeze.config.getAdapterInstance('ajax');

    ajaxAdapter.defaultSettings = {
       beforeSend: function(xhr, settings) {
           // examine the XHR and customize the headers accordingly.
           if (isFooRequest(xhr)) {
               xhr.setRequestHeader("x-Test-Before-Send-Header", "foo");
           }
       }
    };

>Every AJAX component is different. This kind of configuration requires specific knowledge of the component and version deployed with your application.

<a name="customAdapter"></a>
##Write your own AJAX adapter

You can write your own JavaScript AJAX adapter, one that either replaces or extends one of the stock adapters.

An AJAX adapter is a constructor function. It requires a `name` property; the name must be unique among all AJAX adapters.

It can have additional properties and methods that make it easier for developers to configure or consume.

Here's the outline of the jQuery ajax adapter:

    var ctor = function () {
        this.name = 'jQuery';
        this.defaultSettings = { };     
        this.requestInterceptor = null;
    };

    ctor.prototype.initialize = function () {
        // look for the jQuery lib but don't fail immediately if not found
        jQuery = core.requireLib('jQuery');
    };

    ctor.prototype.ajax = function (config) { ... }


It should have an `initialize` method like all Breeze adapters. It must have an `ajax` method that takes a single `config` parameter.

You have no obligation to implement the "defaultSettings" or the [`requestInterceptor`](#requestInterceptor) extension points seen in the stock Breeze "jQuery" and "angular" adapters. They are "nice to have" features.

#### The *config* parameter

The `config` parameter passed to the `ajax` method conforms to a Breeze-specific interface. It is **not** the same as the `setting` parameter you'd pass to jQuery's `$.ajax` or Angular's `$http()`. 

The `config` parameter is designed for consumption by a Breeze [*DataSeviceAdapter*](dataserviceadapters). The *DataServiceAdapters* shipped with Breeze (excluding OData adapters) construct their HTTP requests in terms of the AJAX adapter's `config` interface.

### Register your adapter

You usually register your adapter with breeze in the last step of the JavaScript module that defines it. If you wrote one called `myAjaxAdapter`, you could register it like this:

    breeze.config.registerAdapter('ajax', myAjaxAdapter); 

Then you'd make this the default AJAX adapter when the application starts:

    breeze.config.initializeAdapterInstance('ajax', 'myAjaxAdapter', true);

<p class="note">Take a look at one of the stock AJAX adapters - such as the <a href="https://github.com/Breeze/breeze.js/blob/master/src/b00_breeze.ajax.jQuery.js" target="_blank" title="jQuery AJAX Adapter on github">'jQuery' adapter</a> - before you write your own.</p>

<a name="requestInterceptor"></a>

## Configure a specific AJAX request with *requestInterceptor*

The `defaultSettings` extension point is the perfect choice if you have a fixed set of configurations for all requests.

But sometimes you need to make an adjustment for a particular request. Of course could try to change the `defaultSettings` before every request and restore it immediately after use.  That's cumbersome, error-prone, and really isn't what `defaultSettings` is for; it is intended to be a one-time, "set and forget" operation.

Stock Breeze AJAX adapters offer another extension point, the `requestInterceptor`. This interceptor gives the developer one last look at each request before the adapter calls the actual AJAX component. 

The interceptor takes a single parameter, the `requestInfo`, and returns nothing.

    var requestInfo = {
            adapter: this,      // this AJAX adapter
            config: ...,        // the configuration object passed to the wrapped AJAX component
            dsaConfig: config,  // the config arg from the calling Breeze DataServiceAdapter
            success: successFn, // adapter's success callback
            error: errorFn      // adapter's error callback
    } 

If you've set the `adapter.requestInterceptor`, the adapter calls it. Then it takes a last look at the `requestInfo.config`. If it's "truthy" (e.g., not `null`), the adapter calls the wrapped AJAX component.

If `requestInfo.config` is "falsey" (e.g., `null`), the adapter returns immediately without calling the wrapped AJAX component.

The logic is something like this:

    if (requestInfo.config){
        ajaxComponent(requestInfo.config)
        .success(requestInfo.success)
        .error(requestInfo.error);          
    }

This means the developer can 

- log details of each HTTP request

- change any of `requestInfo` members just before the AJAX call.

- setup service call timeout or provide a "cancel" option.

    >The jQuery adapter adds `requestInfo.jqXHR` so the `requestInterceptor` can wire-up a "canceller" that can call `jqXHR.abort()`. Normally jQuery's XHR object isn't made available to developers on the grounds that it is an implementation detail. But you'll need it to cancel a jQuery AJAX request. See the [DocCode:jQueryAjaxAdapterTests](http://www.breezejs.com/samples/doccode) for an example of canceling a request. 

- make AJAX-component-specific changes for this particular request, e.g., set jQuery's 'cache' flag
  or setup an [angular $http request cancel option](
  http://odetocode.com/blogs/scott/archive/2014/04/24/canceling-http-requests-in-angularjs.aspx "Scott Allen on canceling $http requests").

- skip the actual AJAX service call by setting `requestInfo.config` to `null`.

- invoke the `success` or `error` callbacks immediately (best to skip the service call at the same time!). This is an easy way to fake an HTTP response during a test.

- wrap or replace the `success` and `error` callbacks to change or supplement behavior. This is an opportunity to modify the raw JSON response before any downstream Breeze or application process sees it.

Here's how you could set a 5 second timeout for the adapter (works for both `jQuery.ajax` and Angular's `$http`):

    var ajaxAdapter = breeze.config.getAdapterInstance('ajax');
    ajaxAdapter.requestInterceptor = function (requestInfo) {
        requestInfo.config.timeout = 5000; 
    }

>`$http`'s timeout configuration also accepts a promise which can be used for a cancel facility as described by Scott Allen in his
blog post, "<a href="http://odetocode.com/blogs/scott/archive/2014/04/24/canceling-http-requests-in-angularjs.aspx" target="_blank">Canceling $http Requests in AngularJS</a>".

<p class="note"><strong>Be careful</strong>: the <strong><code>requestInterceptor</code></strong> puts you very close to the metal. Small mistakes can have effects that show up much later and are hard to find.</p>

#### Timeout and Cancel examples

The samples on github illustrate both cancel and timeout with these adapters. For users of the jQuery AJAX component there is [***DocCode**:jQueryAjaxAdapterTests.js*](https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode/tests/jQueryAjaxAdapterTests.js "DocCode jQuery adapter tests"). For users of Angular's `$http` there is the [***Zza-Node-Mongo**:ajax-adapter.async.spec.js*](https://github.com/Breeze/breeze.js.samples/blob/master/node/zza-node-mongo/client/test/specs.async/ajax-adapter.async.spec.js "Zza angular adapter tests").

>It's best if you can run the samples but if you can't (perhaps because you don't use one of the technologies involved), the test files are easy to read and we trust you can glean ideas that will help.

### Clearing the *requestInterceptor*

The `requestInterceptor` *is not cleared* or *reset* after the request completes. The adapter will run the same `requestInterceptor` for each subsequent request until you clear or reset it manually. 

You can clear it yourself in your Breeze `EntityManager` method callbacks. 

If you know that the interceptor should only be used for the next request, there's an easier way: set the `oneTime` property on the interceptor function itself.

    ajaxAdapter.requestInterceptor.oneTime = true;

Breeze will clear the `ajaxAdapter.requestInterceptor` automatically after the next request.

<a name="changeRequestInterceptor"></a>
<a name="dataservice-adapters"></a>

### Consider a *DataServiceAdapter.changeRequestInterceptor*

While we're talking about AJAX interceptors, it's worth mentioning the `changeRequestInterceptor` hook implemented by all *DataServiceAdapters* shipped with Breeze.

>We are talking about the **DataServiceAdapter** now, *not* the *AJAX adapter* which we've been discussing up to this point.

The `EntityManager.saveChanges` method delegates many of the details of save processing to a *DataServiceAdapter* which handles the specifics of communicating with a particular web service. Breeze ships with [several *DataServiceAdapters*](dataserviceadapters#breeze-oob-adapters) and you can also [write your own](dataserviceadapters#custom-adapter).

But writing a custom *DataServiceAdapter* isn't always easy because web service APIs are often complicated.

Sometimes one of the Breeze adapters is *almost right* for you. You only need a small change to the data in the body of the save request such as:

- You want to remove data for an unmapped property.
 
- You don't want to send the original value for a changed property because (a) it is big and (b) it's not needed or useful on the server.
 
- You're using an OData adapter's $batch save to talk and you need to add a special authentication header to each individual request within the batch.

Thanks to the AJAX adapter's `requestInterceptor`, you could manipulate the request data object just before you send it. In practice this would be wildly complicated and you probably don't have the information you need *at that point* to make the appropriate changes. You might think you have to write a custom *DataServiceAdapter* after all. 

Maybe you don't. All of stock Breeze adapters have a `changeRequestInterceptor` with which you can manipulate the change requests just before they're handed off to the AJAX adapter. Breeze calls the `changeRequestInterceptor` with lots of save context so it can make well-informed decisions.

[Learn more](dataserviceadapters#changeRequestInterceptor) about the `changeRequestInterceptor` and how it [compares to the AJAX adapter's&nbsp; `requestInterceptor`](dataserviceadapters#changeRequestInterceptor-when-to-use).

<a name="odata-ajax"></a>

##OData AJAX 

The "OData" and "webApiOData" [OData *DataServiceAdapters*](#dataservice-adapters) **do not use the AJAX adapter**. Therefore, configuring the Breeze AJAX adapter is pointless when using these adapters to access OData sources.

These adapters rely on the Microsoft-sponsored **[Data.js library](http://datajs.codeplex.com/)** to handle many aspects of the interaction with OData sources including the AJAX calls. You adjust this library's `OData` component if you would configure its AJAX behavior.

Here's how you might add an authorization header to every request:

    var oldClient = OData.defaultHttpClient;

    var myClient = {
         request: function (request, success, error) {
             request.headers.Authorization = authorization;
             return oldClient.request(request, success, error);
         }
    };

    OData.defaultHttpClient = myClient;
