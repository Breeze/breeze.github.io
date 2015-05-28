---
layout: doc-js
redirect_from: "/old/documentation/projection-queries.html"
---

<h1>
	Projection queries</h1>
<p>Breeze can make a &quot;projection query&quot; - a query for selected properties - and transmit only the properties we need.</p>
<p>For example, suppose you have a Person entity and Person has 100 columns/properties including an image property that could be 100KB. We want to present a list of Persons, just their first and last names. We can&#39;t afford to download every property of every Person in the list. You can do this with a projection query using &#39;select&#39;:</p>
<pre class="brush:jscript;">
var query = EntityQuery.from(&quot;Person&quot;)
     .select(&quot;FirstName, LastName&quot;);</pre>
<p>This projects the results of the query into a custom data structure that contains only the FirstName and LastName properties of the Person.</p>
<p>You can also perform many other type of projections, including properties and&nbsp;entities that span&nbsp;the object&nbsp;graph.&nbsp;Here are a few examples:</p>
<h3>
	<a name="Single data property projections"></a>Single data property projections</h3>
<pre class="brush:jscript;">
// just the names of the Customers that begin with &#39;C&#39;
var query = EntityQuery.from(&quot;Customers&quot;)
     .where(&quot;CompanyName&quot;, &quot;startsWith&quot;, &quot;C&quot;)
     .select(&quot;CompanyName&quot;);</pre>
<h3>
	<a name="Single navigation property projections"></a>Single navigation property projections</h3>
<pre class="brush:jscript;">
// Orders of the Customers that begin with &#39;C&#39;
var query = EntityQuery.from(&quot;Customers&quot;)
     .where(&quot;CompanyName&quot;, &quot;startsWith&quot;, &quot;C&quot;)
     .select(&quot;Orders&quot;);</pre>
<h3>
	<a name="Multiple property projections"></a>Multiple property projections</h3>
<pre class="brush:jscript;">
// Selected properties of customers with names starting with &lsquo;C&rsquo;
var query = EntityQuery.from(&quot;Customers&quot;)
    .where(&quot;CompanyName&quot;, FilterQueryOp.StartsWith, &quot;C&quot;)
    .select(&quot;CustomerID, CompanyName, ContactName&quot;)
    .orderBy(&quot;CompanyName&quot;);</pre>
<h3>
	<a name="Related property projections"></a>Related property projections</h3>
<pre class="brush:jscript;">
// Names of customers with orders that have excessive freight costs
var query = EntityQuery.from(&quot;Orders&quot;)
    .where(&quot;Freight&quot;, FilterQueryOp.GreaterThan, 500)
    .select(&quot;Customer.CompanyName&quot;)
    .orderBy(&quot;Customer.CompanyName&quot;);
</pre>
<p>Note that projections themselves are not entities and will not be cached on the client. However, if the projection <strong>contains</strong> entities, these entities <strong>will</strong> be cached on the client.</p>
<p>This is a&nbsp;valuable feature and you can use it to query and cache all your pick-lists in the application in a single shot. For example, you might create a service method called &quot;Lookups&quot; that returns a single object whose properties are arrays of Color, Status, Size, ProductType, ... you get the idea. That object is essentially a bag of lists that you&#39;ll use to populate combo boxes.</p>
<p>Then you make a single query to &quot;Lookups&quot;,&nbsp;which returns this bag of lists.&nbsp;Now Breeze doesn&#39;t recognize the bag as an entity. But each of the bag&#39;s properties is a collection of objects that <strong><em>are </em></strong>described as entities in metadata: Color is an entity type, Status is a type, Size is a type, ProductType is a type. Breeze recognizes that these nested objects are entities and puts them in cache.&nbsp;</p>
<p>So in a single request, in a single payload, you&#39;re able to populate the EntityManager cache with all of the little pick-lists.</p>
