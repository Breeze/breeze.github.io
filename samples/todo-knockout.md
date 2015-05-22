---
layout: samples
---
<h1>Todo Knockout Sample</h1>

<p>The base Todo sample demonstrates Breeze and <a href="http://knockoutjs.com/" target="_blank">KnockoutJS</a> working together in a single page CRUD (Create/Read/Update/Delete) application.</p>

<p clear="all">The <a href="/samples/todo/#TodoUx" target="_blank">user experience</a> is the same for this and <a href="/samples/todo">all Todo Sample</a> variations. The source lies within the &quot;Samples&quot; package which you can <a href="/documentation/download" target="_blank">download here</a>.</p>

<h2><img alt="" src="/images/samples/Todo-KoRunning.png" style="width: 100%; max-width: 568px;" /></h2>

<h2>App Architecture</h2>

<p>Todo is the simplest full-CRUD app we could think of. The architecture is deliberately primitive and simplistic. There&#39;s only one model type (<em>TodoItem</em>) and only one screen. It&#39;s all about the mechanics of manipulating data and presenting them for user review and edit.<br />
<br />
The entire app is organized in a single .NET web application project that hosts both server-side and client-side components. The three items outlined in red are the client; everything else is server-side.</p>

<p><img alt="" src="/images/samples/Todo-KoSolution.png" style="border: 0px; margin: 0px; padding: 0px; outline: 0px; font-size: 16px; vertical-align: bottom; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);" /></p>

<h3>Server</h3>

<p>The server is a simple ASP.NET Web Application. It hosts the client-side assets (HTML, CSS, and JavaScript). It also hosts an ASP.NET Web API service consisting of a single Breeze-styled Web API controller in front of an Entity Framework &quot;Code First&quot; model talking to a SQL Server database.<br />
<br />
The server is identical across all Todo sample variations.</p>

<h3>Client</h3>

<p>There are no client-side .NET dependencies: no ASP.MVC, no Razor, just pure CSS, HTML, and JavaScript.<br />
<br />
The <em>Content </em>folder holds CSS files, the <em>Scripts </em>folder holds 3rd party and application JavaScript libraries; the application libraries are within an inner <em>App </em>folder. The <em>index.html</em> file holds all HTML.<br />
<br />
We divide the client app into four functional areas:</p>

<p><img alt="" src="/images/samples/Todo-KoStack.png" /></p>

<p>&nbsp;</p>

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
			<td style="margin: 0px; padding: 4px 8px 10px; border: 0px; outline: 0px; font-size: 13px; vertical-align: middle; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);"><em style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-style: italic; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">Index.html</em><span class="Apple-converted-space">&nbsp;</span>contains the &quot;View&quot; HTML with<span class="Apple-converted-space"> </span><em style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-style: italic; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">KnockoutJS</em><span class="Apple-converted-space">&nbsp;</span>data binding markup. It&#39;s also the application host page with css and script tags.</td>
		</tr>
		<tr style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
			<td style="margin: 0px; padding: 4px 8px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">Presentation<br />
			Logic</td>
			<td style="margin: 0px; padding: 4px 8px 10px; border: 0px; outline: 0px; font-size: 13px; vertical-align: middle; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">JavaScript in the<span class="Apple-converted-space"> </span><em style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-style: italic; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">viewModel.js</em><span class="Apple-converted-space">&nbsp;</span>exposes data and method binding points to the view. All <em style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-style: italic; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">KnockoutJS</em><span class="Apple-converted-space">&nbsp;</span>code lives here. Many of the methods implement CRUD actions by delegating to methods of the service layer.</td>
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

<h2>Knockout highlights</h2>

<p>We assume you&#39;re acquainted with <a href="http://knockoutjs.com/" target="_blank">KnockoutJS</a> and that the markup in <em>index.html</em> and the JavaScript programming model are familiar to you.</p>

<h2>View</h2>

<p>The Todo app&#39;s&nbsp; &quot;View&quot; is embedded in <em>index.html</em>. You&#39;ll recognize the way Knockout (KO) markup is expressed in &quot;data-bind&quot; attributes whose values declare bindings of buttons to actions, widget values and CSS classes to view model properties, and repeats Todo items within a list using an &lt;li&gt; tag template.</p>

<p>Here&#39;s an excerpt showing the TodoItem template within the &lt;li&gt; tag:</p>

<pre class="brush:xml;">
&lt;li&gt;
     &lt;!-- readonly view --&gt;
    &lt;div data-bind=&quot;visible: !isEditing()&quot;&gt;
        &lt;input type=&quot;checkbox&quot; data-bind=&quot;checked: IsDone&quot; /&gt;
        &lt;label data-bind=&quot;text: Description, click: $parent.edit, 
               css: { done: IsDone, archived: IsArchived }&quot;&gt;&lt;/label&gt;
        &lt;a href=&quot;#&quot; data-bind=&quot;click: $parent.removeItem&quot;&gt;X&lt;/a&gt; 
    &lt;/div&gt;
    &lt;!-- edit view --&gt;
    &lt;div data-bind=&quot;visible: isEditing&quot;&gt;
        &lt;form data-bind=&quot;event: { submit: $parent.completeEdit }&quot;&gt;
            &lt;input type=&quot;text&quot; 
                   data-bind=&quot;value: Description, hasfocus: isEditing&quot; /&gt;
        &lt;/form&gt;
    &lt;/div&gt;
&lt;/li&gt;</pre>

<h2>ViewModel</h2>

<p>All Knockout-related JavaScript is in the <em>Scripts/app/viewModel.js</em> file. The script returns a ViewModel object whose properties are the binding surface, the targets of the &quot;data-bind&quot; attributes in the HTML. The script is written in the &quot;<a href="http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript" target="_blank">revealing module pattern</a>&quot; style that emphasizes readability. The returned module object (<em>vm</em>) is a hashmap whose properties are one-liners:</p>

<pre class="brush:jscript;">
var vm = {
    newTodo: ko.observable(&quot;&quot;),
    items: ko.observableArray(),
    includeArchived: ko.observable(false),
    addItem: addItem,
    edit: edit,
    completeEdit: completeEdit, 
    removeItem: removeItem,
    archiveCompletedItems: archiveCompletedItems,
    purge: purge,
    reset: reset
};</pre>

<p>Either the implementation is crystal clear (e.g., <span class="codeword">newTodo: ko.observable(&quot;&quot;)</span>) or is delegated to a function.(e.g., <span class="codeword">addItem: addItem</span>) whose definition appears lower in the file.</p>

<p>The ViewModel definition is followed by an initialization function call (<span class="codeword">initVm()</span>) and is then returned as the value of this ViewModel module (<span class="codeword">app.viewModel</span>).</p>

<p>The private functions that do work come next. They&#39;re wrapped in a region comment (<span class="codeword">//*region private functions</span>) that separates the high-level-responsibility code above from the implementation details below.&nbsp; Visual Studio can collapse the region for easy exposition.</p>

<p>Here&#39;s the ViewModel initialization function</p>

<pre class="brush:jscript;">
function initVm() {
    vm.includeArchived.subscribe(getAllTodos);
    addComputeds();
    getAllTodos();
}</pre>

<p>It has 3 jobs:</p>

<ol>
	<li>Re-fetch the Todos when the user ticks the &quot;Show archived&quot; checkbox which is bound to the ViewModel&#39;s <em>includeArchived </em>observable.</li>
	<li>Add three KnockOut computed observables which are functions</li>
	<li>Fetch the initial set of active (non-archived) Todos.</li>
</ol>

<p>The <a href="/samples/todo-viewmodel" target="_blank">Todo ViewModel Sample Design</a> topic describes the purpose and basic mechanics of the remaining functions including the three computeds.</p>

<h2>Dataservice</h2>

<p>The <em>dataservice.js</em> file handles the creation of new Todo objects and all interactions with the server. It&#39;s written in Breeze and almost all Breeze-related code is in this <em>dataservice</em>. See the &quot;<a href="/samples/todo-dataservice">Todo Sample Dataservice</a>&quot; page for details.</p>

<p>Breeze ships configured to use Knockout as the model library. When the application creates new Todos or materializes Todos from query result data, Breeze instantiates Todo objects with Knockout observables in lieu of JavaScript properties. For example, the server-side TodoItem.Description property becomes the KO <em>item.Description</em> observable function; you get the value by calling <span class="codeword">item.Description()</span> and you set the value by calling <span class="codeword">item.Description(&quot;Learn Breeze&quot;)</span>.</p>

<h2>Logger</h2>

<p>The <em>logger.js</em> file is an abstraction for logging messages and displaying them to the user. Internally it uses the open source <a href="https://github.com/CodeSeven/toastr" target="_blank">toastr</a> library to display messages as &quot;toasts&quot; that float up from the bottom right of the screen.</p>

<p>This file is identical across all Todo sample variations.</p>

<p><a href="/samples/todo">Back to the main Todo Sample page</a></p>
