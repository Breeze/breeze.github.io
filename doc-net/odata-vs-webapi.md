---
layout: doc-net
---
<h1>OData vs Web Api support in Breeze</h1>

<p>There are several differences between the capabilities of an OData service and a Web Api service when exposed to Breeze. Most of these differences are simply the result of either the OData specification or the Microsoft &#39;datajs&#39; JavaScript library for OData (which Breeze uses to provide OData support) not supporting certain capabilities.</p>

<p>These are <strong>NOT </strong>Breeze specific issues.</p>

<h3>Queries</h3>

<ol>
	<li>
	<p>OData &quot;selects&quot; involving navigation properties must also include a corresponding &quot;expand&quot;. For example:</p>

	<ul>
		<li style="list-style-image:circle !important;">Web Api
		<pre class="brush: jscript">

var query = EntityQuery.from(&quot;Customers&quot;)
   .where(&quot;companyName&quot;, &quot;startsWith&quot;, &quot;C&quot;)
   .select(&quot;orders&quot;);

</pre>
		</li>
	</ul>

	<ul>
		<li style="list-style-image:circle !important;">OData ( needs the additional &quot;.expand&quot; call.)
		<pre class="brush: jscript">
var query = EntityQuery.from(&quot;Customers&quot;)
   .where(&quot;companyName&quot;, &quot;startsWith&quot;, &quot;C&quot;)
   .select(&quot;orders&quot;)
   .expand(&quot;orders&quot;);
</pre>
		</li>
	</ul>
	</li>
</ol>

<h3>Saves</h3>

<ol>
	<li>
	<p>OData&#39;s HTTP PUT/MERGE semantics <strong>does not </strong>return the entity after an update operation. Breeze Web Api updates <strong>do </strong>return the &quot;updated&quot; entity. This means that Breeze cannot see any server side changes that occur as a result of an update when using OData. As a result:</p>

	<ul>
		<li style="list-style-image:circle !important;">
		<p>With OData, any change of the value of a server side computed field will not be available in Breeze after an update. If you need these values refreshed, you must requery.</p>
		</li>
		<li style="list-style-image:circle !important;">
		<p>With OData, no EntityManager &#39;EntityChanged&#39; events will occur as a result of an update, because in effect the client side entity is not updated except to note that it&#39;s entityState has been changed.</p>
		</li>
		<li style="list-style-image:circle !important;">
		<p><strong>Note:</strong> OData Insert operations, handled by an HTTP POST, return the inserted entity. This is what allows Breeze to correctly reflect the transition from a temporary entity key to a permanent one after a save operation returns.</p>
		</li>
	</ul>
	</li>
	<li>
	<p>OData optimistic concurrency uses ETags, so you will not see changes to any optimistic concurrency properties if these are exposed on the client. Breeze makes use of the ETags and you will get optimistic concurrency checks, but as noted above, this information is not returned to the client as a change to any of the underlying optimistic concurrency properties.</p>
	</li>
	<li>
	<p>Breeze&#39;s WebApi implementation can add or remove an object from the save on the server via the use of the BeforeSave interceptors. These are not available in OData.</p>
	</li>
	<li>
	<p>Breeze&#39;s WebApi implementation <strong>does </strong>support a server side KeyGenerator. OData <strong>does not</strong>.</p>
	</li>
	<li>
	<p>Breeze&#39;s WebApi implementation <strong>does </strong>support the concept of a &quot;Named Save&quot;. OData <strong>does not</strong>.</p>
	</li>
	<li>
	<p>OData <strong>does not</strong> support .NET enum types.</p>
	</li>
</ol>
