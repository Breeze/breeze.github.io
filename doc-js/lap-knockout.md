---
layout: doc-js
redirect_from: "/old/documentation/databinding-knockout.html"
---
#	Data binding with Knockout

> The code snippets on this page are in the <a href="/samples/todo">Breeze Todo Sample App</a>.

Breeze entities in the Todo sample are built for UI data binding with <a href="http://knockoutjs.com/">Knockout</a>.  A property that returns a single value is exposed as a <a href="http://knockoutjs.com/documentation/observables.html">Knockout observable property</a>. A property that returns a collection (e.g., a collection navigation property such as Customer.Orders) is exposed as a <a href="http://knockoutjs.com/documentation/observableArrays.html">Knockout observable array property</a>.
To appreciate what this means, let's look at the screen the user sees when the *ViewModel* first pours queried Todo entities into its <span class="codeword">items</span> array.
<img src="/images/DocCodeTodosListSnapshotjpg.jpg" style="border-width: 0px; border-style: solid;" />
On launch the screen was empty; now it has a list of Todos, styled to reflect the IsDone and <span class="codeword">IsArchived</span> properties of each Todo.
This is <a href="http://knockoutjs.com/">Knockout</a> at work, binding HTML controls and CSS classes to Breeze Todo entity properties. A developer didn't write code to punch the word "Food" into a label or to tick the "Drink" checkbox or to paint "Shelter" in a paler shade.
A developer did mark up the HTML with declarative binding instructions. Here's a brief look at some of the HTML behind the screenshot.

<pre class="brush:jscript;">
	<ul data-bind="foreach: items">
	    <li>
	        <input type="checkbox" data-bind="checked: IsDone" />
	        <label data-bind="text: Description"></label>           
	    </li>
	</ul>
</pre>

The "data-bind" attributes are Knockout's markup convention. The "*foreach*:" binding declaration tells KO to iterate over the ViewModel's <span class="codeword">items</span> array, creating HTML list items for each Todo in the array. The checkbox "checked" property is bound to the Todo's <span class="codeword">IsDone</span> property. The label's "text" property is bound to the Todo's <span class="codeword">Description property</span>.
The catch is that someone - or something - had to make every entity property observable to the Knockout framework. If you did it yourself, you'd probably write code like this:

<pre class="brush:jscript;">
var new TodoItem = {
    Id: ko.observable(dto.Id),   
    Description: ko.observable(dto.Description),   
    CreatedAt: ko.observable(dto.CreatedAt),
    IsDone: ko.observable(dto.IsDone),
    IsArchived: ko.observable(dto.IsArchived),
};
</pre>

That's no fun for five properties. Think about writing and maintaining that kind of code for thirty entity types averaging twenty properties each. How about 100 entity types ... a typical model size in a business application? The Breeze <span class="codeword">createEntity</span> method does this grunt work for you.

## 	Knockout properties are functions
Heads up! Knockout (KO) properties are JavaScript functions, not JavaScript properties. Check if the Todo is done by calling <span class="codeword">newTodo.IsDone()</span> with parentheses; set it by calling <span class="codeword">newTodo.IsDone(true)</span>.
Don't call <span class="codeword">newTodo.IsDone</span> without the parentheses and expect to get the property value. While you think you're testing for "doneness", the answer is always <span class="codeword">true</span> ... even when the underlying property value is <span class="codeword">false</span>. Why? Because what you actually asked for was the KO function and the Boolean value of a function is always <span class="codeword">true</span>. You can thank <a href="http://11heavens.com/falsy-and-truthy-in-javascript">JavaScript "truthiness"</a> for that one.
Be careful how you set a KO property. If you write <span class="codeword">newTodo.IsDone = true</span>, you won't be setting the KO property. You'll be replacing the KO property function with the value <span class="codeword">true</span>. Henceforth, the "*IsDone*" data binding fails and Breeze can't find or track the property.
We all make these mistakes ... frequently. You recognize the symptoms more quickly as you gain experience.

## 	Next step
There is more to a Breeze entity than its properties. Every Breeze entity has "entity-ness" at its core. You tap that "entity-ness" by way of its <span class="codeword">entityAspect</span> property which we meet in the **<a href="/doc-js/lap-changetracking">next topic on change tracking</a>**.
