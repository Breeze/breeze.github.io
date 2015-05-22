---
layout: samples
---
<h1 style="margin: 8px 0 12px 0;">Todo</h1>

<p>It seems every JavaScript library must have a Todo sample. The <strong>Breeze Todo </strong>isn&#39;t much more than a &quot;<em>Hello World</em>&quot;, but it demonstrates Breeze&#39;s ability to query; create, modify, and delete entities; validate, and save. <a href="http://todo.breezejs.com" target="_blank"><strong>Give it a try</strong></a>.</p>

<p><a href="http://todo.breezejs.com/" target="_blank"><img alt="Breeze Todos" src="/images/samples/breeze-todos.png" style="border: 1px solid rgb(70, 173, 232); max-width: 400px;" /></a></p>

<div style="margin-left: 2em;">&nbsp;</div>

<h2><a name="variations"></a>Variations</h2>

<p>BreezeJS is designed to work with a variety of JavaScript libraries. To make that point, this Todo Sample comes in several flavors, each one a variation in the client implementation.</p>

<ul>
	<li><a href="/samples/todo-angular"><strong>Todo-Angular</strong></a><br />
	Built with AngularJS.</li>
	<li><a href="/samples/todo-knockout"><strong>Todo-Knockout</strong></a><br />
	Built with KnockoutJS.</li>
	<li><a href="/samples/todo-require"><strong>Todo-Knockout-Require</strong></a><br />
	Introduces dependency management with RequireJS to the base KO version.</li>
</ul>

<p>To facilitate comparison, these variations differ from each other as little as possible. They all have the same UI and the same one-entity TodoItem model. Because our focus is on client-side programming, they share the same server side design and implementation: an ASP.NET Web API controller accessing a SQL database via Entity Framework.&nbsp;</p>

<h2><a name="details"></a>Details</h2>

<p>We&#39;ll explore some details of the Todo sample and its variations over this and several other pages:</p>

<ul>
	<li><strong><a href="/samples/todo-server">Application server</a></strong>&nbsp;<br />
	Describes everything happening on the Todo application server. The server is the same across all samples</li>
</ul>

<ul>
	<li><strong><a href="/samples/todo-viewmodel">ViewModel design</a></strong>&nbsp;<br />
	All samples have a ViewModel whose API and basic design is the same but whose implementation differs by variation. This topic explains what they have in common.</li>
</ul>

<ul>
	<li><strong><a href="/samples/todo-dataservice">Dataservice</a></strong>&nbsp;<br />
	This module uses Breeze to access remote data and manage data locally; its design and implementation is almost identical accross the variations.</li>
</ul>

<h2><a name="TodoUx"></a>User Experience</h2>

<p><iframe allowfullscreen="" frameborder="0" height="315" src="http://www.youtube.com/embed/bujYpCf1n4s" width="420"></iframe></p>

<p>The user experience of all Todo variations is the same.</p>

<p>The app launches with a query for active <em>TodoItems </em>which are shown in a list. Each item has a <em>Description </em>displayed in a label, an <em>IsDone </em>flag governed by a checkbox, and a hidden <em>IsArchived </em>flag.<br />
<br />
You create a new Todo by entering its <em>Description </em>in the large textbox below the application title.<br />
<br />
You can edit the <em>Description </em>of an exiting Todo by clicking in the label. The label changes to a textbox where you can type or erase characters. Validation rules prevent you from making the description too long or leaving it blank. Label and check/uncheck the <em>IsDone </em>state; such &quot;completed&quot; todos display with a line struck through the label.<br />
<br />
The <strong>Mark all as complete</strong> checkbox (above the item list) toggles the <em>IsDone </em>state of all displayed todos.<br />
<br />
Clicking <strong>Archive...</strong> will flip an item into the archived state if it <em>IsDone </em>and not already archived. The archived item immediately disappears. Checking <strong>Show archived</strong> (above the item list) will re-query the database to show both active and archived items; archived items display in gold. You can&#39;t unarchive an item once it&#39;s been archived.<br />
<br />
You can delete any item by hovering over the <em>Description </em>and clicking the <strong>X</strong> that appears to the right.</p>

<p><img alt="" src="/images/samples/BreezeTodoRemoveItemSnapshot.png" /></p>

<p>All changes are saved immediately.<br />
<br />
<strong>Purge </strong>and <strong>Reset </strong>links at the bottom respectively delete all Todos in the database or reset the data to the initial demo state.</p>

<h2>Fiddle with it</h2>

<p>Here is another way to see these same &quot;Todos&quot; with Breeze and KO.</p>

<p><iframe allowfullscreen="allowfullscreen" frameborder="0" src="http://jsfiddle.net/IdeaBlade/ExaFM/embedded/js,html,result" style="width: 100%; height: 300px"></iframe></p>

<p>Enjoy!</p>
