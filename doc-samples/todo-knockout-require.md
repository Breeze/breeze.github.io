---
layout: doc-samples
redirect_from: "/old/samples/todo-require.html"
---
#Todo-Knockout-Require Sample#

The **Todo-Knockout-Require** sample extends the <a href="/doc-samples/todo-knockout">Todo Knockout</a> sample with **dependency management** and **view composition** using the <a href="http://requirejs.org//" target="_blank">RequireJS</a> library.</p>

<p clear="all">The <a href="/doc-samples/about-todo#TodoUx" target="_blank">user experience</a> is the same for this and <a href="/doc-samples/about-todo">all Todo Sample</a> variations. The source lies within the "Samples" package which you can <a href="/documentation/download" target="_blank">download here</a>.</p>

<p><img src="/images/samples/Todo-RequireRunning.png" style="width:100%; max-width:568px;"></p>

#Why Dependency Management?

This Todo Sample is just about the simplest full-CRUD app we could think of. The architecture is deliberately primitive and simplistic. There's only one View, one ViewModel, and one Model type (`TodoItem`). The app has only 5 application files a main script for bootstrapping, html for the view, a ViewModel script, a dataservice to define the model and manage data access, and a logger for diagnostics.

<p><img src="/images/samples/Todo-RequireStack.png" style="width:100%; max-width:414px;"></p>

This is already overkill for such a simple application. We're looking ahead to a future application with many screens, some of them complex, and many application JavaScript files. As the number of moving parts increase, the complexity increases with it.

In a traditional JavaScript page, you put your script tags near the bottom of the file. You can't just dump them there alphabetically or randomly. You have to list them in proper sequence. If script 'A' depends upon script 'B', you'll have "play" script 'B' before script 'A'. If you play 'A' before 'B' you'll probably get a runtime error when some feature in 'B' tries to call upon a feature in 'A'.

It's not hard to get the sequence right when there are few scripts. Here are the script tags at the bottom of *index.html* in the base Todo sample.

	<!-- 3rd party libraries -->
	<script src="Scripts/jquery-1.8.3.min.js"></script>
	<script src="Scripts/knockout-2.2.0.js"></script>
	<script src="Scripts/q.js"></script>
	<script src="Scripts/breeze.debug.js"></script>
	<script src="Scripts/toastr.js"></script>
	
	<!-- App libraries -->
	<script>app = {};</script>
	<script src="Scripts/app/logger.js"></script>
	<script src="Scripts/app/dataservice.js"></script>
	<script src="Scripts/app/viewModel.js"></script>

Nine script tags. That's not too bad. You should be able to remember that *jQuery*,*Knockout* and *Q* must come before Breeze (but can *Knockout* come before *jQuery*? must *Toastr* come last or can it show up anytime?).

The application scripts have a definite sequence. The first tag ensures that the ***app*** namespace is defined so that all other scripts can add their modules to *app* rather than the global namespace. The *viewModel* needs the *dataservice* which needs the *logger* which needs *toastr* so we play *toastr.js*, then, *logger.js*, *dataservice.js*, and finally *viewModel.js* ... which handles the application launch.

But what if there were ten scripts? Twenty scripts? A modest five screen app could easily have that many. Many of those scripts will depend upon each other. Getting the sequence right and keeping it right over a lifetime of application evolution is no small task.

This quandry isn't new or limited to JavaScript. It shows up in applications developed with statically typed languages too where complex component dependency graphs are common. The solution there is the same as for JavaScript here: design with <a href="http://en.wikipedia.org/wiki/Dependency_inversion_principle" target="_blank">dependency management</a> in mind and turn to <a href="http://www.martinfowler.com/articles/injection.html" target="_blank">IoC containers</a> for runtime component construction.

#RequireJS

As always with JavaScript, you have many libraries to choose from. <a href="http://requirejs.org//" target="_blank">RequireJS</a> is a popular, well-regarded, free, open source choice. Breeze itself is built with Require. This Todo-Require sample demonstrates how to get going with Require *before* your application gets too big.

<p class="note">We don't assume you know Require. On the other hand, this isn't a tutorial on require. We'll explain enough to give you a feel for it. You should turn to the web, starting with the <a href="http://requirejs.org//" target="_blank">RequireJS</a> site itself, to learn the options and details.</p>

#Script tags with Require

The require.js script has been added to the Scripts folder and the application scripts have been updated to use Require. The script tags in *index.html* reveal the first effects:

	<script data-main="Scripts/app/main" src="Scripts/require.js"></script>

We've reduced the nine script tags to one. The third party library scripts and the application scripts are all gone ... except for the mention of&nbsp;*Scripts/app/main.js* in the *require.js* script tag. No matter how big our application grows, we may never add another script to *index.html*. Require will load what we need, as we need it.

Require handles dependency management as we'll see ... and it also downloads scripts dynamically on demand. That means we don't have to load all of our JavaScript files before the application can start. Require will load them as they are needed.

>You don't have to load the scripts asynchronously one by one. You can bundle and minify them with require's "r.js" tool.

#*main.js*

The *main.js* script is the application bootstrapper. Require finds it, loads it, and everything flows from there.

*main.js* has three responsibilities

1. configure RequireJS for this application
1. launch the app
1. bind the first View to its ViewModel

We'll talk about the complete *main.js* shown here:

	(function () {
	
	    requirejs.config({
	        paths: {
	            'breeze': '../breeze.debug',
	            'breeze.savequeuing': '../breeze.savequeuing',
	            'jquery': '../jquery-1.8.3.min',
	            'ko': '../knockout-2.2.0',
	            'Q': '../q'
	        }
	    });
	
	    //  Launch the app
	    //  Start by requiring the 3rd party libraries that Breeze should find
	    define(['require', 'ko', 'jquery', 'logger', 'Q'], function (require, ko, $, logger) {
	
	        logger.info('Breeze Todo is booting');
	
	        // require the 'viewModel' shell 
	        // require '../text' which is an html-loader require plugin; 
	        //     see http://requirejs.org/docs/api.html#text
	        // require 'breeze.savequeuing` so that it will extend breeze before the app starts.
	        require(['viewModel', '../text!view.html', 'breeze.savequeuing'],
	
	        function (viewModel, viewHtml) {
	            var $view = $(viewHtml);
	            ko.applyBindings(viewModel, $view.get(0));
	            $("#applicationHost").append($view);
	        });
	    });
	})()

###Configuring RequireJS

The paths in the *requirejs.config* tell RequireJS where to find the 3rd party library scripts and gives them aliases that later code will use to reference these "modules". For example, the first path tells Require that the 'breeze' module should be loaded from the *breeze.debug.js* JavaScript file which is located in the directory above that of *main.js*. We do the same thing for the other libraries, giving aliases to most of the module names that the application expects ("jquery" "ko", and "Q").

###Launching with *define*

The`define` function call executes immediately and launches the application proper. Its first parameter, a dependency array, announces the need for five dependencies, all of which must be resolved before the application calls the bootstrapping function in `define`'s second parameter. These dependencies are:

`require` &mdash; the requireJS function that asynchronously loads other modules; we'll see it used in a moment.

`ko` &mdash; the Knockout library that this application uses for data&nbsp; binding.

`jquery` &mdash; jQuery for some DOM manipulation; Breeze will use jQuery.AJAX in this app for communication with the server

`logger` &mdash; the application logger that writes diagnostic messages to the console and also to pop-up toasts.

`Q` &mdash; the Q.js promises library that both Breeze and the app will use for managing asynchronous method calls.

Notice that `require`, `jQuery`, `knockout` and `logger` are all referenced directly in the body of the bootstrapping function. It's obvious why we are injecting them. But `Q` is not used. Why?

Breeze needs a promises library. *Q.js* is the promises library for this application. Breeze can only discover the *Q* library if *Q.js* is loaded before Breeze itself. Therefore, for this application, *Q* is one of Breeze's dependencies and it must be loaded with Require before Breeze is loaded.

The same reasoning applies to *Knockout* and *jQuery*; we'd have to list them in the dependencies array even if we were not going to reference them in the body of the defining function. We must cause Require to load them before Breeze tries to discover them when it resolves.

Strictly speaking, Breeze doesn't depend on *Knockout*, *jQuery*, or *Q*. Breeze requires *some sort of external library* for data binding, AJAX calls, and promises. But those capabilities could be supplied by alternative libraries (e.g., *angularJS*, *amplifyJS*, or angular's *$q*).

The libraries chosen for this particular app are popular and well-known to Breeze. Rather than oblige you to configure Breeze explicitly for them, Breeze calls require to detect them and configures itself to use them. Breeze can only detect them if they are already loaded; that's why they must be loaded by require ***before*** Breeze is resolved. Listing "Q" among the dependencies causes require to load *Q.js* before any other module can ask for breeze.

>We know that none of these 3rd party libraries depend on breeze so we are not worried that they might ask for the 'breeze' module. On the other hand, the *logger* is an application module and an application module might depend on breeze! In this case, we know that logger does not depend on 'breeze' so it is safe to load it with the other dependencies.

###Dependency resolution in action

The *logger*  module doesn't depend on Breeze. But it does depend upon *toastr.js*. Take a look at the first line of *logger.js*. It calls *define* too, announcing its dependence on *toastr*.

	define(['../toastr'], function (toastr) { ...

So now Require must download the *toastr* JavaScript file in a directory one up from the *main.js* directory (that is, it loads it from the *Scripts* directory). 

If you peek inside *toastr.js* you'll see that it depends on 'jquery'. Remember that we asked for 'jquery' in the same dependency array as 'logger' back in *main.js*. Require may or may not have resolved "jquery" by the time it starts resolving 'toastr'. Fortunately, require knows what it is doing, the jQuery library is only downloaded once, and there is no race condition.

'jquery' has no dependencies so there are no more files to download and require can unwind the stack. Require passes 'jquery' to *toastr*'s definition function. Then it passes *toastr* into the *logger*'s definition function. And finally it has the *logger* module ready for the boostrapping function in *main.js*.

You don't see any mention of this dependency chain in *main.js* ... nor should you. The point of a dependency management system is to shield you from this madness. Both the author and the reader of *main.js* need only be aware of *main*'s direct dependencies. It is require's job resolve the dependency chain, however tortuous, before calling the boostrapping function.

###Where is Breeze resolved?

Notice that the 'breeze' module is never explicitly requested in *main.js*. The defining function in *main.js* doesn't need the 'breeze' module. Other modules do need Breeze. But, as with 'logger', they will trigger 'breeze' loading and resolution when the time is ripe.

###Further dependency resolution with inner *require*

As it happens, the "*time is ripe*" almost immediately. After logging that our app is loading, we call the injected `require` function.

    require(['viewModel', '../text!view.html'], function (viewModel, viewHtml) {
        ...
    });

That call injects the application 'viewModel' module. That module depends upon the 'dataservice' module. And the 'dataservice' module depends upon 'breeze'. Ta da!

#View Composition

The second dependency injects the view. It looks like we are at last ready to load and bind our ViewModel and View ... almost.

We're about to discover how requireJS can help with something called "view composition." To understand what that's about, we'll take a step back and review the <a href="/doc-samples/todo-knockout" title="Original Todo Sample" target="_blank">original Todo sample</a> which assembled views in a more traditional way.

In the original sample, the View was a chunk of HTML within *index.html.* At the bottom of the *viewModel.js* in that version is one line of bootstrapping that binds the ViewModel to the View in *index.html*

	// Bind viewModel to view in index.html
	ko.applyBindings(app.viewModel);

That's a fine way to operate for an app with a single screen. What happens when there are many screens? Should we embed the HTML for each of screen in one huge *index.html* file? Would we do that even for the HTML of screens that we haven't shown yet ... and may never show?

We don't have to. We can extract the View from *index.html* and put it in its own HTML partial file. Require can download that file on demand when it is time to show it. At that moment, the app can bind the View to the appropriate ViewModel and insert the View into the browser DOM where the user can see it.

This business of acquiring HTML fragments and binding them to ViewModels is called "View Composition". We see it in action right here in this *main.js* bootstrapping function.

	require(['viewModel', '../text!view.html'],
	
	    function(viewModel, viewHtml) {
	        var $view = $(viewHtml);
	        ko.applyBindings(viewModel, $view.get(0));
	        $("#applicationHost").append($view);
	    
	});

In this snippet we are using Require again to resolve both the Todo ViewModel (in *viewModel.js*) and its companion *view.html*.

We've learned how Require loads the JavaScript file named 'viewModel'. It's more surprising that it can load the *view.html* as well. By default, Require can only load JavaScript files. But there's a Require plug-in that can load any text file (including an HTML file) as if it were a JavaScript module.

You tell Require to use a plugin by using the "!" syntax:

	'../text!view.html'

The plugin is the part *before* the "!", It identifies the JavaScript *text.js* located in the directory above *main.js* (which explains the '../' prefix).

The part *after* the "!" is the path and name of the text file to load, *view.html*, located in *Scripts/app* ... the same directory as *main.js*.

Compare the *view.html* in this Todo sample with the contents of the "applicationHost" `<div>` in the <a href="/doc-samples/todo-knockout" target="_blank">original Todo sample</a>'s *index.html*; you'll see that they are identical. We just ripped that `<div>` out and put it in its own file.

The revised *index.html* becomes the much simpler application shell with a

1. head tag for metadate and CSS
1. slot to host views
1. Minimal script loading at the bottom

Here it is, reduced for exposition:

	<html>
	    <head>
	        <meta charset="utf-8" />
	        ...
	        <link rel="stylesheet" href="Content/todo.css"/>
	    </head>
	    <body>
	        <div id="applicationHost"></div>
	        ...
	        <script data-main="Scripts/app/main" src="Scripts/require.js"></script>
	    </body>
	</html>

#Require-enabled app scripts#

Now that you know how Require works in *main.js*, apply the same thinking to the remaining application scripts. Before Require, each was written in the <a href="http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript" target="_blank">revealing module pattern</a> style and attached to a namespace called *app*. With Require, the module pattern changes slightly, making use of Require's `define` function to identify its dependencies and encapsulate its implementation.
	
	// dataservice
	define(['ko', 'breeze', 'logger', 'breeze.savequeuing'], function (ko, breeze, logger) { ... }
	
	// logger
	define(['../toastr'], function (toastr) { ... }
	
	// viewModel
	define(['ko', 'logger', 'dataservice'], function (ko, logger, dataservice) { ...}

#Loading breeze extensions with require

Look again at the `define` call in *dataservice.js*. Focus on the last dependency, 'breeze.savequeuing'.

'breeze.savequeuing' is a Breeze extension. It's a [Breeze Lab](/doc-breeze-labs/save-queuing "breeze.savequeuing documentation") extension that we [downloaded from from the Breeze source on GitHub](https://github.com/IdeaBlade/Breeze/blob/master/Breeze.Client/Scripts/Labs/breeze.savequeuing.js "breeze.savequeuing source"). 

>[Breeze Labs](/doc-breeze-labs/ "Breeze Labs") are code that you might find useful in your application. They aren't part of Breeze and they are not officially supported (although we take good care of them in practice).

"Save Queuing" copes with the fact that this app allows the user to issue save requests in rapid succession without waiting for saves to finish. The server doesn't have enough time to process a a prior save request before the next request arrives. The client could become confused unless we buffered the outbound requests ... which is what the "breeze.savequeueing" extension does.

'breeze.savequeuing' patches this feature into Breeze itself. It isn't the kind of module that returns a value. That's why there is no 'saveQueueing' parameter in the require function call. But like other modules it does take Breeze (and Q) as dependencies and the `require` call resolves it.

This is a pretty standard pattern for loading a module extension with requireJS. No component call an extension module directly. It is valuable for its side-effect, the way it modifies the behavior of the module it extends.

#Summary#

Require saves us from having to write lots of script tags and list them in the right order. Instead of loading all JavaScript files before the app starts - even scripts we may never use - Require can load scripts dynamically as they are needed. We can see any module's dependencies by looking at its first line, making it easier to understand, maintain, and test. And Require helps with view composition, the practice of building up larger views from smaller, potentially reusable view parts.

These capabilities came with a cost. We added the *require.js* library. We added a *main.js* for bootstrapping. We extracted the *view.html* from *index.html*. We increased the number of files by two (66%) and increased the concept count substantially. We've dug into our "complexity budget".

This is all too expensive for a simple Todo app. But we think it's a solid investment when building a real app, an investment that pays off quickly.

[Back to the main Todo Sample page](/doc-samples/about-todo)
