---
layout: doc-js
---
<h1>Save changes</h1>

<p class="note">The code snippets on this page are drawn from the <a href="/samples/todo">Breeze Todo Sample App</a> and from the <strong>basicTodoTests</strong> module of the <a href="/samples/doccode">DocCode teaching tests</a>.</p>

<p>The Todo sample App doesn&rsquo;t have a save button. It saves changes as you add new items, update descriptions, check the &ldquo;done&rdquo; box, archive the completed Todos, and tick &ldquo;Mark all as complete&rdquo;. Create, update, and delete operations are all represented. Clicking &ldquo;Mark all as complete&rdquo; saves multiple updates in one transaction bundle.</p>

<p>Here&rsquo;s one way to save using the <span class="codeword">EntityManager.saveChanges</span> method:</p>

<div>
<pre class="brush:jscript;">
function saveChanges() {
    if (manager.hasChanges()) {
        manager.saveChanges()
            .then(saveSucceeded)
            .fail(saveFailed);
    } else {
        logger.info(&quot;Nothing to save&quot;);
    };
};</pre>
</div>

<p>Checking for the presence of changes with <span class="codeword">hasChanges()</span> [<a href="#note 1">1</a>] was optional; Breeze won&rsquo;t try to save if there is nothing to save. In this case, the author wants the user to see that there were no changes so he logs that fact and only calls <span class="codeword">manager.saveChanges()</span> when necessary.</p>

<h2>The save process</h2>

<p>The <em>EntityManager</em> collects every entity with a pending change into a change-set. Then it validates the entities in that change-set, invoking each entity&rsquo;s property- and entity-level validation rules, adding and removing errors from each entity&rsquo;s <span class="codeword">validationErrorsCollection</span>. The save fails if any entity in the bundle has errors. If they are all error-free, the manager sends the change-set in the body of a single POST request to the persistence service [<a href="#note 2">2</a>].</p>

<p>A save is an async operation, like any other service operation, so the method returns a promise &ndash; a promise to report the outcome of the save.&nbsp; The Todo app releases the UI immediately, enabling the user to keep working unblocked. When the save result arrives from the service, the app reports success or failure with its logger.</p>

<h2>After the save</h2>

<p>If the save fails, the contents of the cache are unchanged. The entities with pending changes remain in their changed state. The app should analyze the <span class="codeword">saveResult.error</span> to determine the appropriate recovery or shutdown steps.</p>

<p>If the save succeeds, Breeze has some bookkeeping to do. The service sent the saved entities back to Breeze; the list is available from the&nbsp; <span class="codeword">saveResult.entities</span>[<a href="#note 3">3</a>]. They may contain changes that are news to the client, changes made by something in the backend. &nbsp;Breeze merges these changes back into the cache.</p>

<p>An entity that was marked for delete is removed from cache; its <span class="codeword">entityState</span> becomes &ldquo;Detached&rdquo;. The <span class="codeword">entityState</span> of new and modified entities becomes &ldquo;Unchanged&rdquo;.</p>

<h2>Id Fixup</h2>

<p>Updates to store-generated keys are the most common backend changes. A new Todo.Id() was assigned a temporary id such as (-1) while it was in cache before save. &nbsp;During the save, the database assigned it a permanent id, say (42). The Breeze <em>EntityManager</em> detects this and updates its cache key map accordingly. Then it visits every other entity in cache that might have had a reference to (-1) and replaces that value with (42) in a process called &ldquo;<em>id fix-up</em>&rdquo;.</p>

<p>The Todo app doesn&rsquo;t need id fix-up because there are no relationships among entities in this model. But if we were saving a new <em>Order</em> and its <em>OrderDetails</em>, Breeze would replace all of the <span class="codeword">OrderDetail.OrderID</span> values with the new <span class="codeword">Order.OrderID</span>; for example, their (-1) values would be updated to (42).</p>

<h2>Offline</h2>

<p>What if we couldn&#39;t save Todo changes right away? What if we couldn&#39;t rely on a fast, continuous connection to the server? We&#39;d like to stash the cache contents to local storage. Breeze can smooth that process for you with its EntityManager export/import facilities. Here&#39;s an extract from a test in the <strong>basicTodoTests </strong>module.</p>

<pre class="brush:jscript;">
// add a new Todo to the cache
var newTodo = em.addEntity(createTodo(&quot;Export/import safely&quot;));

var changes = em.getChanges(); // we&#39;ll stash just the changes
var changesExport = em.exportEntities(changes);

window.localStorage.setItem(&quot;todos&quot;, changesExport);

// ... much later ...

var changesImport = window.localStorage.getItem(&quot;todos&quot;);
em.importEntities(changesImport);

// ... the todo is back in cache in its added state  ...</pre>

<p>We cover export/import in greater detail in <a href="http://www.breezejs.com/documentation/exportimport">Export and Import Entities</a>.</p>

<h2>So ends the tour</h2>

<p>You&rsquo;ve queried, added new entities, changed others, and perhaps deleted one or two. You&rsquo;ve saved your changes to the server. Those are the basics of data management in any application &hellip; and now you&rsquo;ve run that lap with Breeze.</p>

<p>There are plenty of details to explore in later topics. You&rsquo;ll likely dig deeper as you encounter more challenging scenarios. But now, you&rsquo;re properly equipped to get started building a Breeze app. What&rsquo;s stopping you? Get going! Have fun! And please stay in touch.</p>

<h2>Notes</h2>

<p><a name="note 1"></a>[1] Pass an entity type or array of types into the <span class="codeword">hasChanges()</span> function if you want to know about changes to those types specifically.</p>

<p>You can also examine the pending changes by calling <span class="codeword">getChanges()</span>.</p>

<p><a name="note 2"></a>[2] You can call <span class="codeword">saveChanges(save_only_these_entities)</span> if you want to cherry pick entities to save. If the list includes unchanged entities, Breeze won&rsquo;t bother saving them. We advise against using this option because it&rsquo;s easy to save one entity while neglecting an important dependent entity. For example, you probably don&rsquo;t want to save a new OrderDetail without saving its parent new Order. It is your application; use the power wisely.</p>

<p><a name="note 3"></a>[3] The list from <span class="codeword">saveResult.entities</span> includes the deleted entities that are no longer in cache.</p>
