---
layout: doc-samples
redirect_from: "/old/samples/todo-angular-sequelize.html"
---

#Todo-Angular-Sequelize Sample

The Todo-Angular-Sequelize sample demonstrates Breeze, <a href="http://angularjs.org/" target="_blank">AngularJS</a> and <a href="http://docs.sequelizejs.com/" target="_blank">Sequelize</a> working together in a single page CRUD (Create/Read/Update/Delete) application.

The <a href="/doc-samples/about-todo#TodoUx" target="_blank">user experience</a> is the same for this and <a href="/doc-samples/about-todo">all Todo Sample</a> variations. The source lies within the &quot;Samples&quot; package which you can <a href="/doc-js/download" target="_blank">download here</a>.

##<img alt="" src="/images/samples/Todo-AngularRunning.png" style="max-width: 568px; width: 100%;" />

<p class="note">Todo-Angular runs in modern browsers such as IE9, IE10, and recent Chrome, Safari, Firefox, and WebKit browsers. Breeze does not support AngularJS apps running in older browsers that lack ECMAScript 5 property getters and setters.</p>

# Download

Download [ALL of the Breeze JavaScript samples from github](https://github.com/Breeze/breeze.js.samples "breeze.js.samples on github") as [a zip file](https://github.com/Breeze/breeze.js.samples/archive/master.zip "breeze.js.samples zip file").

In this case we're interested in the "Todo-Angular" sample, located in the *node/todo-angular* directory. These instructions assume this will be your current working directory.

At the top level you will find:

* a <a href="https://github.com/Breeze/breeze.js.samples/blob/master/node/todo-angular/readme.md" target="_blank" title="readme.md on github"><strong>readme.md</strong></a> explaining how to install and run the app
* the **db-script** folder
* the **client** folder full of client application **HTML, CSS, and JavaScript**
* the **server** folder containing the node/express server application JavaScript.

You can view, edit, and run the code in this project using the tools of your choice.

<p class="note">The sample assumes that you've installed <strong>node.js</strong> and <a href="http://www.mysql.com"
  target="_blank"><strong>MySql</strong></a></p>

##App Architecture

Todo is the simplest full-CRUD app we could think of. The architecture is deliberately primitive and simplistic. There&#39;s only one model type (*TodoItem*) and only one screen. It's all about the mechanics of manipulating data and presenting them for user review and edit.

The entire app is organized in 3 folders that host server-side and client-side components as well as database scripts.

##Server

<p><img alt="" src="/images/samples/Todo-Angular-SequelizeServerStack.png" style="width: 250px; float:left; margin-right: 10px;" /></p>

<p>The server is written for <a href="http://http://nodejs.org/" target="_blank">Node.js</a> running <a href="http://expressjs.com/" target="_blank">Express</a>, and uses a <a href="http://www.mysql.com/" target="_blank">MySql</a> database.</p>

<div style="clear:both; margin-bottom: 20px;"></div>

##Client

<p><img alt="" src="/images/samples/Todo-Angular-SequelizeClientStack.png" style="width: 250px; float:left; margin-right: 10px;" /></p>

<p>The <em>app</em> folder holds the client application JavaScript.</p>

<p>The <em>css</em> folder holds CSS files.</p>

<p>3rd party vendor libraries (including Breeze) are in the <em>bower_components</em> folder. These dependencies will be installed automatically via <a href="http://bower.io/" target="_blank">Bower Package Manager.</a></p>

The *index.html* file is both the host page that loads the assets and the residence of the one-and-only view, written in Angularized-HTML.

<div style="clear:both; margin-bottom: 20px;"></div>
We divide the client app into four functional areas:

<p><img alt="" src="/images/samples/Todo-AngularStack.png" /></p>

<table style="border-collapse: collapse; margin: 0px 0px 20px 1em; padding: 0px; border: 1px solid rgb(204, 204, 204); outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; border-spacing: 0px; width: 669px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: 19px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; background-color: rgb(241, 241, 241); max-width: 400px;">
	<thead style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
		<tr style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
			<th style="border-width: 0px 0px 1px; border-bottom-style: solid; border-bottom-color: rgb(204, 204, 204); padding: 4px 8px; text-align: left; margin: 0px; outline: 0px; font-size: 13px; vertical-align: middle; font: inherit; background-color: rgb(247, 247, 247); color: rgb(51, 51, 51); font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 7em; background-position: initial initial; background-repeat: initial initial;">Area</th>
			<th style="border-width: 0px 0px 1px; border-bottom-style: solid; border-bottom-color: rgb(204, 204, 204); padding: 4px 8px; text-align: left; margin: 0px; outline: 0px; font-size: 13px; vertical-align: middle; font: inherit; background-color: rgb(247, 247, 247); color: rgb(51, 51, 51); font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-position: initial initial; background-repeat: initial initial;">Comment</th>
		</tr>
	</thead>
	<tbody style="border: 0px; margin: 0px; padding: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
		<tr style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
			<td style="margin: 0px; padding: 4px 8px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">Layout</td>
			<td style="margin: 0px; padding: 4px 8px 10px; border: 0px; outline: 0px; font-size: 13px; vertical-align: middle; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);"><em style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-style: italic; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">Index.html</em><span class="Apple-converted-space">&nbsp;</span>contains the &quot;View&quot; HTML with<span class="Apple-converted-space">&nbsp;</span><em style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-style: italic; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">AngularJS</em><span class="Apple-converted-space">&nbsp;</span>data binding markup. It&#39;s also the application host page with css and script tags.</td>
		</tr>
		<tr style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
			<td style="margin: 0px; padding: 4px 8px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">Presentation<br />
			Logic</td>
			<td style="margin: 0px; padding: 4px 8px 10px; border: 0px; outline: 0px; font-size: 13px; vertical-align: middle; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">JavaScript in the<span class="Apple-converted-space">&nbsp;</span><em style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-style: italic; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">controller.js</em><span class="Apple-converted-space">&nbsp;</span>exposes data and method binding points to the view. All <em style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-style: italic; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">AngularJS</em><span class="Apple-converted-space">&nbsp;</span>code lives here. Many of the methods implement CRUD actions by delegating to methods of the service layer.</td>
		</tr>
		<tr style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
			<td style="margin: 0px; padding: 4px 8px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">Model &amp;<br />
			Data Access</td>
			<td style="margin: 0px; padding: 4px 8px 10px; border: 0px; outline: 0px; font-size: 13px; vertical-align: middle; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">JavaScript in the<span class="Apple-converted-space">&nbsp;</span><em style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-style: italic; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">dataservice.js</em><span class="Apple-converted-space">&nbsp;</span>creates, queries, deletes, and saves entities using<span class="Apple-converted-space">&nbsp;</span><em style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-style: italic; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">BreezeJS</em>. All<span class="Apple-converted-space">&nbsp;</span><em style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-style: italic; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">BreezeJS</em><span class="Apple-converted-space">&nbsp;</span>code lives here.</td>
		</tr>
		<tr style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
			<td style="margin: 0px; padding: 4px 8px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">Logging</td>
			<td style="margin: 0px; padding: 4px 8px 10px; border: 0px; outline: 0px; font-size: 13px; vertical-align: middle; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">The<span class="Apple-converted-space">&nbsp;</span><em style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-style: italic; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">logger.js</em><span class="Apple-converted-space">&nbsp;</span>presents activity messages and errors as &quot;toasts&quot; popping from the lower right via the<span class="Apple-converted-space">&nbsp;</span><em style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-style: italic; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">toastr.js</em><span class="Apple-converted-space">&nbsp;</span>3rd party library.</td>
		</tr>
	</tbody>
</table>

##Angular highlights

We assume you&#39;re acquainted with <a href="http://angularjs.org/" target="_blank">AngularJS</a> and that the markup in *index.html* and the JavaScript programming model are familiar to you.

##View

The Todo app&#39;s&nbsp; &quot;View&quot; is embedded in <em>index.html</em>. You&#39;ll recognize the way Angular markup binds buttons to actions, value attributes to data properties, CSS classes to controller properties, and repeats Todo items within a list using an &lt;li&gt; tag template.

The "data-ng-app" attribute references the "app" module; the "data-ng-controller" attribute references the "TodoCtrl" controller module.

Here's an excerpt from the view showing the repeated TodoItem template within the `<li>` tag:

    <li data-ng-repeat="item in items | filter:itemFilter">
        
        <!-- Readonly View -->
        <div data-ng-hide="isEditing(item)">
            <input type="checkbox"
                   data-ng-model="item.IsDone"
                   data-ng-class="{done: item.IsDone}" />
            <label data-ng-click="editBegin(item)"
                   data-ng-class="{done: item.IsDone, archived: item.IsArchived}">
                {{item.Description}}
            </label>
            <a href="#" data-ng-click="deleteItem(item)">X</a>
        </div>

        <!-- Editing View -->
        <div data-ng-show="isEditing(item)">
            <form data-ng-submit="editEnd()">
                <input type="text" autofocus
                       data-ng-model="item.Description"
                       data-ng-blur="editEnd()"
                       data-ng-mouseout="editEnd()" />
            </form>
        </div>
    </li>


We&#39;re using the HTML "data-" prefix for attributes that Angular recognizes as its *directives*.</p>

##Main *app* Module

Every Angular app needs a main module. *Scripts/app/main.js* defines that module, "**app**".

**Important**: the 'app' module definition takes a dependency on the "Breeze Angular Service" module.

    angular.module('app', ['breeze.angular']);

That module has a "breeze" service which, when injected into any application component, will configure Breeze for this application. We'll see it injected into the `dataservice` component.

All application JavaScript files follow the [Immediately Invoked Function Execution](http://benalman.com/news/2010/11/immediately-invoked-function-expression/ "IFFE explained") (IIFE) pattern that keeps the global window namespace free of application variable pollution. Such modules begin and end in this fashion.

    (function() {

       ... your code here ...

    })();

##Controller

The *Scripts/app/controller.js* file defines the Angular controller that is responsible for the presentation of `Todo` items to the user in the "Todo" view.

The controller relies on [Angular's dependency injection](http://docs.angularjs.org/guide/di "Angular Dependency Injection") to acquire access to both Angular and application services. 

    angular.module('app').controller('TodoCtrl',
    ['$q', '$scope', '$timeout', 'dataservice', 'logger', controller]);

The syntax is a bit peculiar but you get used to it quickly. "DI" is an essential aspect of Angular programming and almost every Angular application follows this formula.

Let's break it down:

    angular.module('app')          // get the application module from Angular 
    .controller('TodoCtrl',        // name the controller
    ['service1', 'service2', ...   // name(s) of services to inject
    controller]);                  // the definition function is last item in the array

    // The definition function w/ a parameter for each injectable named above
    function controller(service1, service2, ...) {...}

>Many folks prefer an anonymous definition function instead of the named `controller` definition function that we like. It's up to you.

This controller asks Angular to inject a number of services: 

- `$q` - the Angular promises manager for this app
- `$scope` - a context object to which the view binds
- `$timeout` - Angular equivalent of 'setTimeout'
- `dataservice` - the application data access service
- `logger` - the application's logging facility

The `$scope` object is the vehicle for binding the controller to the HTML in the view. The controller add properties and methods to the `$scope` object. The HTML binds to these `$scope` members declaratively with Angular "directives".

>"directives" is a fancy word for "data bindings"

A controller written in this "MVVM" style makes no references to view elements at all. The View (the HTML) only uses JavaScript expressions to bind to the `$scope`.

>Angular binding declarations are written in a kind of JavaScript syntax. But, as a matter of principle, we keep those JavaScript expressions clean and free of all decision logic. Logical expressions belong in the controller, not in the HTML.

##Dataservice

The *dataservice.js* file handles the creation of new Todo objects and all interactions with the server. It&#39;s written in Breeze and almost all Breeze-related code is in this <em>dataservice</em>. See the &quot;<a href="/doc-samples/about-todo-dataservice">Todo Sample Dataservice</a>&quot; page for details.</p>

Notice the use of Angular dependency injection.

    angular.module('app').factory('dataservice',
    ['$timeout', 'breeze', 'logger', dataservice]);

We're injecting the Angular `$timeout` service (an abstraction over JavaScript's `setTimeout`), the 'breeze' service, and the application's 'logger' service (described below).

Inject the 'breeze' service is a way of accessing Breeze itself without getting it from the global (`window`) namespace. But that's not why we're injecting it. We're actually looking for a side-effect of that injection: the configuration of Breeze for an Angular application. See ["Breeze Angular Service"](/doc-js/breeze-angular) to learn more.

The `controller` is insulated from data access details and has no direct connection with Breeze. The `dataservice` api provides it with all that it needs ... and no more. 

The `dataservice` illustrates the "Revealing Module" module pattern by listing its api near the top of the file:

	var service = {
	    addPropertyChangeHandler: addPropertyChangeHandler,
	    createTodo: createTodo,
	    deleteTodo: deleteTodo,
	    getTodos: getTodos,
	    hasChanges: hasChanges,
	    purge: purge,
	    reset: reset,
	    saveChanges: saveChanges
	};

Now for a few comments about these methods.

The controller considers issuing a save whenever a property changes. It attaches a handler to the **`addPropertyChangeHandler`**. That  method invokes the handler whenever there is a change to any entity property of *any entity*.  You don't have to listen to every entity or every property individually. Breeze offers a "one stop shop" via the [`EntityManager.entityChanged` event](/doc-js/api-docs/classes/EntityManager.html#event_entityChanged).

**`createTodo`** creates a new instance of a `TodoItem` initialized as requested. This item is new in the cache but not yet saved to the database. By design, the command to save it comes from the controller. Note that we did not define the `TodoItem` in JavaScript; Breeze figured that out from metadata.

**`deleteTodo`** marks the `TodoItem` to be deleted but does not physically delete it. By design, the command to update the database (to "save" the delete) comes from the controller.

**`getTodos`** issues a Breeze `EntityQuery` for all Todos, optionally excluding archived Todos (whose `.isArchived` flag is true). The code illustrates how to construct a query based on user input.

**`hasChanges`** indicates if the cache holds any unsaved changes. It delegates to `EntityManager.hasChanges()`.

**`purge`** and **`reset`** are demo-only methods that reset the database to initial conditions after you've wrecked havoc with your trials. They post messages to the Web API controller with Angular's `$http` service. `$http` is just fine for simple AJAX commands while we let Breeze handle data access.

**`saveChanges`** asks Breeze to save all cached entities with pending changes. There might be one entity to save (as when you change a description or delete a Todo). There might be many entities to save (as when you click "Mark all completed"). You don't have to keep track of which entities are "dirty". You don't have to differentiate between add, modify and delete operations. That's Breeze's job.

### Save Queuing
This application takes care of one potential 'gotcha': an attempt to save a second change to an entity when a save request for that entity is already "in flight". 

That can happen in an app like this which saves automatically when it detects changes. It has no Save button.

Duplicate saves are rarely acceptable. For example, you don't want to add the same `TodoItem` twice. 

We guard against duplicate save by putting save requests on a queue. If there is a save request in process, the `EntityManager.saveChanges` queues subsequent requests until it receives a server response for the current save. It processes the queue in order until it runs dry.

"Save Queuing" is a Breeze Labs feature and you can [learn more about it here](/doc-breeze-labs/save-queuing). We enabled "Save Queuing" for this application's `EntityManager` at the top of the `dataservice`:

    manager.enableSaveQueuing(true);

##Logger

The *logger.js* file is an abstraction for logging messages and displaying them to the user. Internally it uses John Papa's open source <a href="https://github.com/CodeSeven/toastr" target="_blank">toastr</a> library to display messages as &quot;toasts&quot; that float up from the bottom right of the screen.

It also relies on Angular's `$log` service to write a second copy of the messages to the browser console window.