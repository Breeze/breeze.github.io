---
layout: doc-samples
redirect_from: "/old/samples/todo-viewmodel.html"
---
<h1>
	Todo Sample ViewModel Design</h1>
<p>The <a href="/doc-samples/todo">Todo sample</a> binds HTML widgets in a view to a JavaScript &quot;ViewModel&quot;. The ViewModel could be the <em>viewModel.js</em> of our sample using <a href="http://www.breezejs.com/samples/todo">KnockoutJS </a>or the <em>controller.js</em> in our sample using <a href="http://www.breezejs.com/samples/todo-angular">AngularJS</a>. Both work in essentially the same way and expose for binding virtually the same properties and methods. Both are located in the <em>Scripts/app folder</em>.</p>
<h2>
	Query Todos</h2>
<p>When the viewmodel is created, it calls its own <em>getAllTodos</em> method which delegates to the dataservice (the dataservice is a separate JavaScript component that handles all data operations using Breeze). When the query succeeds, the controller pours the retrieved <em>TodoItems</em> into its <em>items</em> array.</p>
<p>The model library (<em>Knockout</em>, <em>Angular</em>, ...) binds the <em>items</em> array to the unordered list in the view, using an &lt;li&gt; template. Suddenly todos appear on screen.</p>
<p>Checking the &quot;Show archived&quot; checkbox triggers a re-query of Todos.</p>
<p><img alt="" src="/sites/all//images/documentation/BreezeTodoShowArchived.png" style="width: 160px; height: 31px;" /></p>
<p>If the checkbox is checked, the query retrieves every Todo, both the active and the archived. If the checkbox is clear, the query retrieves only the active Todos (those whose isArchived flag is false). Look at the dataservice <em>getAllTodos</em> method to see how this query condition is constructed.</p>
<h2>
	Detecting and saving changes</h2>
<p>This telling of the query story omitted an important step. Before adding a Todo to the <em>items</em> array, the controller calls <em>extendItem</em> on each one. The <em>extendItem</em> method adds an <em>isEditing</em> property to the Todo. The raw Todo entity doesn&#39;t have an <em>isEditing</em> property because there is no &quot;isEditing&quot; column in the database Todo table. We add this property here to help the UI toggle the presentation of the Todo between a readonly and an editable view:</p>
<p><img alt="" src="/sites/all//images/documentation/BreezeTodoItemViews.png" style="width: 497px; height: 122px;" /></p>
<p>The <em>extendItem</em> method also subscribes to the Breeze <em>entityAspect.propertyChanged</em> event which is raised when a Todo data property changes. The user can edit the <em>Description</em> or check the &quot;Is Done&quot; checkbox. Either change flows through to a Todo data property where it triggers a <em>propertyChanged</em> event and Breeze calls the subscription handler.</p>
<p>If you&#39;ve finished editing the Todo, the subscription handler, after a brief delay (so the DOM can settle down), validates the modified entity and saves it. In other words, the Breeze <em>propertyChanged</em> handler saves the entity if any of its data properties change.</p>
<h2>
	Adding a new Todo</h2>
<p>As you enter the name of a new Todo in the big textbox at the top of the screen, that name is bound to the ViewModel&#39;s <em>newTodo</em> property. Leave that textbox and you trigger the ViewModel&#39;s <em>addItem</em> method which (a) asks the dataservice to create a new Todo entity, (b) fills in the new Todo&#39;s properties, (c) extends it with the <em>isEditing</em> property as just discussed, and (d) saves it.</p>
<h2>
	Deleting a Todo</h2>
<p>Clicking the &quot;X&quot; to the right of the Todo description triggers the ViewModel&#39;s <em>removeItem</em> method.</p>
<p><img alt="" src="/sites/all//images/documentation/BreezeTodoRemoveItemSnapshot.png" /></p>
<p>The <em>removeItem </em>method first removes the Todo from the <em>items</em> array, sets its Breeze <em>EntityState</em> to &quot;Deleted&quot;, and tells the dataservice to save the Todo. Saving a Todo in a &quot;Deleted&quot; state deletes that Todo from the database.</p>
<h2>
	&quot;Mark all complete&quot;</h2>
<p><img alt="" src="/sites/all//images/documentation/BreezeTodoMarkAllComplete.png" style="width: 214px; height: 35px;" /></p>
<p>A change to the &quot;<em>Mark all as complete</em>&quot; checkbox triggers the ViewModel&#39;s <em>markAllCompleted</em> method which sets every displayed Todo&#39;s <em>IsDone</em> flag to true (checked) or false (unchecked). Normally, the <em>propertyChanged</em> subscription (mentioned above) would save each changed Todo individually. But this method intervenes by setting <em>suspendItemSave</em> before updating the <em>isDone</em> values. After updating all Todos, it tells the dataservice to save all of the modified Todos in a single batch.</p>
<h2>
	Validation</h2>
<p>Sometimes a changed entity fails validation. Breeze maintains validation rules for entity types. In this example, the <em>Description</em> is constrained by a minimum and maximum length rule, established by the <code>[Required, StringLength(maximumLength: 30)]</code> attribute decorating the <em>Description</em> property of the <em>TodoItem</em> class in the <em>Model</em> back on the server. Breeze.NET transmitted this rule to the client via metadata. The Breeze client picks it up and applies it here ... automatically.</p>
<p>This ViewModel wants to take charge of validation and the display of validation errors. So it validates the entity explicitly in several places and routes validation failures to its <em>handleItemItemErrors</em> method.</p>
<p>The <em>handleItemItemErrors</em> method logs the first error it finds which causes a red &quot;toast&quot; message to float up from the bottom right of the screen. Then it tells Breeze to &quot;reject all changes&quot; to the errant entity. So if you make the Todo <em>Description</em> too long, you&#39;ll see both a &quot;toast&quot; error and the <em>Description</em> revert to its previous state.</p>
<p><img alt="" src="/sites/all//images/documentation/BreezeTodoTooLongErr.png" style="width: 540px; height: 156px;" /></p>
<h2>
	Archive completed</h2>
<p>A message in the lower left tells you how many Todos are &quot;left&quot; to do. The moment any active Todos are completed, a button appears on the lower right telling you that you can archive these completed todos. That button is bound to the ViewModel&#39;s <em>archiveCompletedItems</em> method.</p>
<p><img alt="" src="/sites/all//images/documentation/BreezeTodoBottom.png" style="width: 583px; height: 236px;" /></p>
<p>Like <em>markAllCompleted</em>, the ViewModel&#39;s <em>archiveCompletedItems</em> method suspends save while it sets the <em>IsArchived</em> flag of one or more Todos. Then it saves all updated Todos as a single batch.</p>
<p>The ViewModel&#39;s <em>getState</em> method handles the bookkeeping about how many active Todos are left and how many are archivable. This <em>getState</em> method is called by two message building methods: <em>itemsLeftMessage</em> and <em>archiveCompleted</em>.</p>
<p>In the Knockout-based <em>viewModel.js</em>, these methods are Knockout computeds that update the UI when Todos are added or removed from the <em>items</em> array or when any Todo&#39;s <em>IsDone</em> or <em>IsArchived</em> changes. It may seem like magic. But it&#39;s a consequence of the fact that these methods rely on <em>getState()</em> which evaluates the <em>items</em> array and every Todo&#39;s <em>IsDone</em> or <em>IsArchived</em> property ... all of which are Knockout observables. Knockout computeds respond to changes in every dependent Knockout observable, no matter how deep in the call chain.</p>
<p>In the Angular-based <em>controller.js</em>, Angular regularlly polls the controller&#39;s <em>itemsLeftMessage</em> and <em>archiveCompletedMessage</em> methods to freshen the messages on screen.</p>
<h2>
	Purge and Reset</h2>
<p>After playing with Todo for a while, you can accumulate a great many junk Todos. You can delete every Todo in the database with the &quot;purge&quot; feature or reset the database to it&#39;s initial condition with &quot;reset&quot;.</p>
<p>The pertinent links below the Todo list are bound to the ViewModel&#39;s <em>purge</em> and <em>reset</em> methods which relay those requests to the dataservice after which the ViewModel re-queries the database and the session (in effect) begins anew.</p>
<p><a href="/doc-samples/todo">Back to the main Todo Sample page</a></p>
