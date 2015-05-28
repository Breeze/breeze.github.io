---
layout: doc-cool-breezes
---
<h1>
	Concurrent Saves</h1>
<p>Sometimes you need to be able to make changes and save them while a previous save is in progress or &quot;in flight&quot; as we say. This second save is concurrent with the first. A single <strong><span class="codeword">EntityManager</span> will refuse to perform a concurrent save</strong> but you can work around it with techniques and tools described in this topic. You&#39;ll learn about</p>
<ul>
	<li style="margin-bottom: 4px">
		<a href="#sandboxeditors">Sandbox editors</a></li>
	<li style="margin-bottom: 4px">
		<a href="#savequeuing">Save queuing</a></li>
	<li style="margin-bottom: 4px">
		<a href="#timedelayedsaves">Time-delayed saves</a></li>
</ul>
<h2>
	Save is asynchronous</h2>
<p>A client-side save is an asynchronous operation. It can take a while before the server replies with a report of success or failure.</p>
<p>Until then, entities remain in cache in their pending-save-states (that is, their <span class="codeword">EntityStates</span> remain &quot;Added&quot;, &quot;Modified&quot;, and &quot;Deleted&quot;). Added entities with store-generated keys still have their temporary values. Only when the server reports success will Breeze (a) replace temporary key values with permanent key values and (b) change the <span class="codeword">EntityStates</span> to &quot;Unchanged&quot;. If the server reports a failure, the entities remain in their changed states with temporary key values and you, the developer, must figure out what to do next.</p>
<p>For these reasons, <strong>we recommend blocking further changes until the save succeeds or fails</strong>. You should <strong>not</strong> try to manipulate these pending entities until the save returns. You must leave them in their present, changed state until the pending save resolves. Postpone your efforts until the success callback.</p>
<pre class="brush:jscript;">
manager.saveChanges()
             .then(success)
             .fail(fail);

function success(saveResult) {
   /* do your post-save work here */
}
</pre>
<h2>
	No concurrent saves by default</h2>
<p>You can ignore our recommendation. Nothing in Breeze prevents the user from making more changes while the save is still in progress. The user could even make changes to the entities that are &quot;in flight&quot;. That is probably not a good idea but it&#39;s up to you to determine how to handle this situation. You&#39;re dealing with more of a user experience issue than a technical issue.</p>
<p>While you may let the user makes changes at their peril, know this:&nbsp; the Breeze <span class="codeword">EntityManager</span><strong> will throw an exception if you ask it to save again while a prior save is &quot;in flight&quot;</strong>!</p>
<p>It&#39;s too risky to let you do that without your express permission. For example, if you are saving a new entity and its key is store-generated, a second save will cause that entity to be saved a second time and you will get duplicate records in your database. There is no known solution to this problem except to block the second save until the first completes.</p>
<p>There is a similar problem with pending deletes; the second save tries to delete the entity again ... which is no longer in the database and likely triggers a concurrency violation.</p>
<p>Maybe you know what you are doing. Maybe the user can modify entities but can&#39;t add or delete them on this screen. Well you can tell Breeze to allow concurrent saves by creating a manager with the <span class="codeword">allowConcurrentSaves</span> option.</p>
<pre class="brush:jscript;">
var manager = new breeze.EntityManager({
        dataservice: &quot;api/Todo&quot;,
        saveOptions: new breeze.SaveOptions({allowConcurrentSaves: true})
    });</pre>
<p>Now the potential for trouble is yours to manage.</p>
<h2>
	<a name="sandboxeditors"></a>Sandbox editors</h2>
<p>We suggest that you block the UI while waiting for the save to complete. That&#39;s not too bad if you have a fast connection. Of course it&#39;s an unpleasant experience if the save takes more than a second ... as is likely in mobile scenarios.</p>
<p>In that case, it may be possible to isolate activity that could change entities in a&nbsp; &quot;sandbox&quot; editor with its own manager. The editor is a screen devoted to changing &quot;one thing&quot;. The user will understand if you make her wait while these changes are saved.</p>
<p>Meanwhile, she can switch to other screens and get work done. Perhaps she can review a list of things to do, pick one and launch another sandbox editor for that task. You won&#39;t have to worry about the pending save. The &quot;entities in flight&quot; are in the original sandbox manager and are immune to changes in other managers backing other screens.</p>
<p>Examples and discussion of this approach are forthcoming. In the meanwhile, see Ward&#39;s answer to this <a href="http://stackoverflow.com/questions/14568410/breeze-memory-management-pattern-practice/14570253#14570253" target="_blank">pertinent StackOverflow question</a>.</p>
<h2>
	<a name="savequeuing"></a>Queuing Saves</h2>
<p>Maybe your required workflow won&#39;t permit the editing of &quot;one thing&quot; at a time on its own screen. For example, you might want to save each entry in an expense report. You don&#39;t want to add or edit every expense item in its own screen. You want to edit them quickly, perhaps in a grid or list layout. You need another approach besides the sandbox editor.</p>
<p>It may be feasible to allow adds and edits on the same screen using the same manager without blocking user input between saves. The trick is to queue subsequent save requests while the first save is in progress.</p>
<p>The Breeze <span class="codeword">EntityManager.saveChanges</span> method does not support &quot;save queueing&quot; natively. Fortunately, there is a Breeze plugin that will add this capability and that plugin is lurking among the samples. You&#39;ll find it in the <a href="/doc-samples/nodb" target="_blank"><strong>NoDb sample</strong></a>, in its <em>Scripts</em> folder, as &quot;<em>breeze.savequeuing.js</em>&quot;.</p>
<p class="note">This same <em>breeze.savequeuing.js </em>plugin is included in the Breeze MVC SPA Template which will go live soon.</p>
<p>The <em>breeze.savequeuing.js </em> implementation is too lengthy to reproduce here. The idea is pretty simple.</p>
<p>When you call <span class="codeword">manager.saveChanges()</span> and there are no pending saves, it processes the save immediately and returns a promise.</p>
<p>On the other hand, if another save is in progress,the manager puts the request on an internal save queue. That queued request is a <strong>promise</strong>. The manager returns that promise just as it returned a promise for the first save request. The caller can&#39;t tell the difference. It was going to wait for the save to complete anyway; it will just have to wait a little longer for this one.</p>
<p>When the first save returns successfully, the manager pops the next request off the save queue and processes it. The saga continues with more requests added to the queue and more removed until the queue runs dry. Save requests are processed in &quot;first in, first out&quot; order.</p>
<p>A save failure at any point usually leaves the manager&#39;s cache in an uncertain state with the potential for making a mess of the remaining queued saves. Therefore, If a save request fails, the manager stops trying to save the remaining queued saves. Instead it will pass each of them a failure message. Remember that each request is a promise, so the callers who placed those save requests will receive that failure message in their fail callbacks.</p>
<p>To use &quot;save queuing&quot; do the following:</p>
<ol>
	<li>
		Acquire the<em> breeze.savequeuing.js </em>plugin (e.g., from the NoDb sample in <a href="/documentation/download" target="_blank">the sample downloads</a>).</li>
	<li>
		Load it in a script tag just after the BreezeJS script tag.</li>
	<li>
		Enable &quot;save queuing&quot; on the manager.</li>
	<li>
		Call <span class="codeword">manager.saveChanges()</span> as before.</li>
</ol>
<p>Here&#39;s an example of the script tags</p>
<pre class="brush:xml;">
&lt;script src=&quot;Scripts/q.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;Scripts/breeze.debug.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;Scripts/breeze.savequeuing.js&quot;&gt;&lt;/script&gt;
        
&lt;!-- App libraries --&gt;
&lt;script src=&quot;Scripts/app/todo.bindings.js&quot;&gt;&lt;/script&gt;
 ... more app scripts ...</pre>
<p>The <em>breeze.savequeuing.js </em>plugin adds an <span class="codeword">enableSaveQueuing</span> method to the <span class="codeword">EntityManager</span> class.</p>
<pre class="brush:jscript;">
manager.enableSaveQueuing(true);</pre>
<p>When true, the plugin replace the native <span class="codeword">saveChanges</span> method with a queuing wrapper around that method. If you disable queuing, the plugin restores the original <span class="codeword">saveChanges</span> method.</p>
<p>Here&#39;s your save call ... showing no signs of the queuing within</p>
<pre class="brush:jscript;">
return manager.saveChanges();</pre>
<p>The caller should append the appropriate <span class="codeword">then(saveSuccess)</span> and <span class="codeword">fail(saveFailure)</span> callbacks to the returned promise.</p>
<h3>
	<a name="timedelayedsaves"></a>Time-delayed saves</h3>
<p>You may have seen an alternative &quot;time-delayed&quot; approach to preventing concurrent saves. Here&#39;s an excerpt from the <em>dataservice.js</em> in the <strong>Todo sample</strong></p>
<pre class="brush:jscript;">
 function saveChanges(...) {
    ...
    if (_isSaving) {
         setTimeout(saveChanges, 50);
         return;
    }
    _isSaving = true;
    manager.saveChanges()
           .then(saveSucceeded)
           .fail(saveFailed)
           .fin(saveFinished);

    ... implementations of saveSucceeded, saveFailed, saveFinished
}
</pre>
<p>If a save is pending (<span class="codeword">_isSaving ===&nbsp; true</span>), the method waits 50 milliseconds and tries again. Simple in concept and it takes much less code to implement than the plugin.</p>
<p><strong>It&#39;s not a good solution</strong> to the problem for several reasons:</p>
<ul>
	<li>
		it doesn&#39;t return a promise so the caller can&#39;t do something when the first or subsequent save succeeds or fails</li>
	<li>
		the code becomes vastly more complicated if you try to make it return a promise</li>
	<li>
		the <span class="codeword">saveChanges</span> implementation is kind of a mess compared to the equivalent in &quot;save queuing&quot;.</li>
	<li>
		the 50 milliseconds is an arbitrary guess that may be too long or too short</li>
	<li>
		the original sequence of save requests is not guaranteed; the actual order is an accident of timing</li>
	<li>
		it processes the remaining saves after the first one fails.</li>
</ul>
<p>It&#39;s perfectly adequate for the &quot;Todo&quot; demo. Don&#39;t use it in your code; <strong>use &quot;save queuing&quot; instead</strong>.</p>