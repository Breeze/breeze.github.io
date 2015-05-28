---
layout: doc-breeze-labs
---
# Breeze Angular Q-Promises

<p class="note"><strong>This <em>breeze.angular.q</em> library has been deprecated</strong>. It is superseded by the <a href="/doc-js/breeze-angular" title="Breeze Angular Service"><strong>Breeze Angular Service</strong></a> which more cleanly configures breeze for Angular development.<br/><br/>The Breeze Angular Service  tells Breeze to use Angular's <code>$q</code> for promises and to use Angular's <code>$http</code>for ajax calls.<br/></br>The <em>breeze.angular.q</em> library has been from removed Breeze Labs. As always, you can retrieve <a href="https://github.com/IdeaBlade/Breeze/blob/master/Breeze.Client/Scripts/Labs/breeze.angular.q.js" target="_blank">the frozen copy from github</a>.</p>

### Migration to "Breeze Angular Service"

Some outdated examples and PluralSight courses still refer to "breeze.angular.q" library and `use$q`. If you followed their lead, here's how to migrate your app to the *Breeze Angular Service*.

1. Remove the *breeze.angular.q.js* script from your project.

    >`Uninstall-Package Breeze.Angular.Q` if you used NuGet.

1. Install *breeze.bridge.angular.js* as explained [here](breeze-angular).

1. Update your *index.html*, changing *breeze.angular.q.js* to *breeze.bridge.angular.js*.

1. Update your app module to depend on "breeze.angular".

1. Find the one place in your code where you call "use$q" and replace it with the "breeze" dependency.

For example, you might go from this:

	var app = angular.module('app', [
	   // ... other dependencies ...
	   'breeze.angular.q' // tells breeze to use $q instead of Q.js
	]);
	 
	app.run(['$q','use$q', function ($q, use$q) {
	       use$q($q);
	}]);

to this:

	var app = angular.module('app', [
	   // ... other dependencies ...
	   'breeze.angular'
	]);
	 
	app.run(['breeze', function () { }]);

You should also track down and eliminate code that configures Breeze to use the "backingStore" model library adapter and `$http`. For example, you could go from this:

    function configBreeze($q, $http, use$q) {
        // use $q for promises
        use$q($q);

        // use the current module's $http for ajax calls
        var ajax = breeze.config.initializeAdapterInstance('ajax', 'angular');
        ajax.setHttp($http);

        // the native Breeze 'backingStore' works for Angular
        breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);

        breeze.NamingConvention.camelCase.setAsDefault();
    }

to this: 

    function configBreeze() {
        breeze.NamingConvention.camelCase.setAsDefault();
    }

You might not need a `configBreeze` method at all!