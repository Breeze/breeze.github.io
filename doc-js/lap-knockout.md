---
layout: doc-js
---
<h1>
	Data binding with Knockout</h1>
<p class="note">The code snippets on this page are in the <a href="/samples/todo">Breeze Todo Sample App</a>.</p>
<p>Breeze entities in the Todo sample are built for UI data binding with <a href="http://knockoutjs.com/">Knockout</a>.&nbsp; A property that return a single value is exposed as a <a href="http://knockoutjs.com/documentation/observables.html">Knockout observable property</a>. A property that returns a collection (e.g., a collection navigation property such as Customer.Orders) is exposed as a <a href="http://knockoutjs.com/documentation/observableArrays.html">Knockout observable array property</a>.</p>
<p>To appreciate what this means, let&rsquo;s look at the screen the user sees when the <em>ViewModel</em> first pours queried Todo entities into its <span class="codeword">items</span> array.</p>
<p><img src="/sites/default/files/images/documentation/DocCodeTodosListSnapshotjpg.jpg" style="border-width: 0px; border-style: solid;" /></p>
<p>On launch the screen was empty; now it has a list of Todos, styled to reflect the IsDone and <span class="codeword">IsArchived</span> properties of each Todo.</p>
<p>This is <a href="http://knockoutjs.com/">Knockout</a> at work, binding HTML controls and CSS classes to Breeze Todo entity properties. A developer didn&rsquo;t write code to punch the word &ldquo;Food&rdquo; into a label or to tick the &ldquo;Drink&rdquo; checkbox or to paint &ldquo;Shelter&rdquo; in a paler shade.</p>
<p>A developer did mark up the HTML with declarative binding instructions. Here&rsquo;s a brief look at some of the HTML behind the screenshot.</p>
<div>
	<pre class="brush:jscript;">
&lt;ul data-bind=&quot;foreach: items&quot;&gt;
    &lt;li&gt;
        &lt;input type=&quot;checkbox&quot; data-bind=&quot;checked: IsDone&quot; /&gt;
        &lt;label data-bind=&quot;text: Description&quot;&gt;&lt;/label&gt;           
    &lt;/li&gt;
&lt;/ul&gt;</pre>
</div>
<p>The &ldquo;data-bind&rdquo; attributes are Knockout&rsquo;s markup convention. The &ldquo;<em>foreach</em>:&rdquo; binding declaration tells KO to iterate over the ViewModel&rsquo;s <span class="codeword">items</span> array, creating HTML list items for each Todo in the array. The checkbox &ldquo;checked&rdquo; property is bound to the Todo&rsquo;s <span class="codeword">IsDone</span> property. The label&rsquo;s &ldquo;text&rdquo; property is bound to the Todo&rsquo;s <span class="codeword">Description property</span>.</p>
<p>The catch is that someone &ndash; or something &ndash; had to make every entity property observable to the Knockout framework. If you did it yourself, you&rsquo;d probably write code like this:</p>
<div>
	<pre class="brush:jscript;">
var new TodoItem = {
    Id: ko.observable(dto.Id),   
    Description: ko.observable(dto.Description),   
    CreatedAt: ko.observable(dto.CreatedAt),
    IsDone: ko.observable(dto.IsDone),
    IsArchived: ko.observable(dto.IsArchived),
};</pre>
</div>
<p>That&rsquo;s no fun for five properties. Think about writing and maintaining that kind of code for thirty entity types averaging twenty properties each. How about 100 entity types &hellip; a typical model size in a business application? The Breeze <span class="codeword">createEntity</span> method does this grunt work for you.</p>
<h2>
	Knockout properties are functions</h2>
<p>Heads up! Knockout (KO) properties are JavaScript functions, not JavaScript properties. Check if the Todo is done by calling <span class="codeword">newTodo.IsDone()</span> with parentheses; set it by calling <span class="codeword">newTodo.IsDone(true)</span>.</p>
<p>Don&rsquo;t call <span class="codeword">newTodo.IsDone</span> without the parentheses and expect to get the property value. While you think you&rsquo;re testing for &ldquo;doneness&rdquo;, the answer is always <span class="codeword">true</span> &hellip; even when the underlying property value is <span class="codeword">false</span>. Why? Because what you actually asked for was the KO function and the Boolean value of a function is always <span class="codeword">true</span>. You can thank <a href="http://11heavens.com/falsy-and-truthy-in-javascript">JavaScript &ldquo;truthiness&rdquo;</a> for that one.</p>
<p>Be careful how you set a KO property. If you write <span class="codeword">newTodo.IsDone = true</span>, you won&rsquo;t be setting the KO property. You&rsquo;ll be replacing the KO property function with the value <span class="codeword">true</span>. Henceforth, the &ldquo;<em>IsDone</em>&rdquo; data binding fails and Breeze can&rsquo;t find or track the property.</p>
<p>We all make these mistakes &hellip; frequently. You recognize the symptoms more quickly as you gain experience.</p>
<h2>
	Next step</h2>
<p>There is more to a Breeze entity than its properties. Every Breeze entity has &ldquo;entity-ness&rdquo; at its core. You tap that &ldquo;entity-ness&rdquo; by way of its <span class="codeword">entityAspect</span> property which we meet in the <strong><a href="/documentation/change-tracking">next topic on change tracking</a></strong>.</p>
