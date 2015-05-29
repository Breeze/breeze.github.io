---
layout: doc-cool-breezes
redirect_from: "/old/documentation/lookup-lists.html"
---
<h1>
	Lookup Lists</h1>
<p>Many applications display lots of selectable forms (drop-down lists, comboboxes, etc., etc.) each populated with a list of options whose values come from the database.</p>
<p><img alt="Categories combobox" src="/images/CategoriesCombobox.png" style="width: 201px; height: 168px; float: left; margin-right: 8px; margin-left: 8px;" />You know you&#39;ll need these &quot;lookup lists&quot; almost immediately. They tend to be static anyway so why not cache them? The colors, status codes, units-of-measure are unlikely to change during a user&#39;s session.</p>
<p>You&#39;d like to retrieve them from the database and cache them when the application starts.</p>
<p>Unfortunately, there could be a lot of them; a typical medium-sized application might have twenty or thirty. You want the application to start quickly and twenty or thirty separate calls to the server might take too long even if you can make those calls asynchronously in parallel. Each list is short. It would be nice to fetch all of the lists in one shot. Here&#39;s how.</p>
<p class="note" style="clear: both;">Find the example code for this topic in the <strong>queryTests </strong>module of the <a href="/doc-samples/doccode" target="_blank">DocCode sample</a></p>
<h2>
	Create a Lookups controller method</h2>
<p>Let&#39;s assume that you&#39;re using a Breeze Web API controller on the server and that it&#39;s talking to the Entity Framework.</p>
<p>These assumptions aren&#39;t important. What matters is that you can create a single method on the server that returns an object whose properties are the lookup lists. The object can be anonymous; the list elements should be entities known to the client.</p>
<p>The <span class="codeword">NorthwindController</span> in the <a href="/doc-samples/doccode" target="_blank">DocCode sample</a> is a Breeze Web API controller with such a method:</p>
<pre class="brush:csharp;">
[HttpGet]
public object Lookups() // returns an object, not an IQueryable
{
    var regions = _contextProvider.Context.Regions;
    var territories = _contextProvider.Context.Territories;
    var categories = _contextProvider.Context.Categories;

    return new {regions, territories, categories};
}
</pre>
<p>It returns an anonymous object with properties initialized by queries for three different entity lists {<em>regions</em>, <em>territories</em>, <em>categories</em>} ; serialization of the object triggers execution of the queries, populating the properties.</p>
<p>Someday you may think about caching the serialized &quot;lookups&quot; object in the cloud but this approach will do for now.</p>
<h2>
	Fetch Lookups on the client</h2>
<p>Let&#39;s keep it simple on the client. We&#39;ll assume you have <a href="/documentation/share-entitymanager" target="_blank">datacontext with a single EntityManager</a>. Let&#39;s add a <em>getLookups</em> method:</p>
<pre class="brush:jscript;">
   var getLookups = function () {
        return EntityQuery
            .from(&#39;Lookups&#39;)
            .using(manager)
            .execute()
            .then(querySucceeded)
            .fail(queryFailed);
   };</pre>
<p>This is just like other Breeze query methods you&#39;ve written before ... except, perhaps, for the <em>from(...)</em> clause. You&#39;re used to seeing the name of an entity collection as the argument; a name such as &quot;<em>Customers</em>&quot; or &quot;<em>Orders</em>&quot; would be typical. Here the argument is &#39;<em>Lookups</em>&quot; ... the name we gave to the GET action method on the controller [<a href="#Note01">1</a>].&nbsp; Here is <em>querySucceeded</em>:</p>
<pre class="brush:jscript;">
  function querySucceeded(data) {
      datacontext.lookups = data.results[0];
      // datacontext was defined earlier in the module.
  }</pre>
<p>The first element of the query results is a JavaScript object representing the anonymous object from the server. It has three properties, {<em>regions</em>, <em>territories</em>, <em>categories</em>}, each returning an array of <em>Region</em>, <em>Territory</em> and <em>Category </em>entities.</p>
<p><strong>These are real entities in the <em>manager </em>cache</strong>. The <em>lookups </em>object that holds these lists is <em>not </em>an entity; it&#39;s an arbitrary JavaScript object. Breeze took a look at it on the way in and didn&#39;t recognize it. Breeze doesn&#39;t mind; it just passes it along in the query result ... in the same way that it returns the results of a <a href="/documentation/projection-queries" target="_blank">projection query</a>. But before returning it, Breeze inspects its contents. In each of the three list properties Breeze finds instances of entity types that it recognizes from metadata. Remember what we stipulated early on: the members of the lookup lists are entities on the server and therefore (thanks to metadata) they are entities on the Breeze client.</p>

<p>Here's a live code, Angular version of what we're talking about .</p>

<p class="note">The following "plunker" only works with modern browsers (IE10+, FF, Chrome).</p>

<p style="border: 1px solid lightblue; padding: 4px"><iframe allowfullscreen="allowfullscreen" frameborder="0" src="http://embed.plnkr.co/8YZLwxnfzTYWf3wY3HtE/preview" style="width: 100%; height: 300px"></iframe></p>

<h2>
	<a name="FetchOnLaunch"></a>Fetch lookups on launch</h2>
<p>You might want to fetch these lookup lists before you release the UI to user input. Start by adding an <em>initialize </em>method <a href="#Note02">[2</a>] to your <em>datacontext</em> like the following:</p>
<pre class="brush:jscript;">
  var datacontext = {
       ...
       lookups: null, // set by private getLookups method
       initialize: initialize,
       ...
  }

  function initialize() {
     return getLookups();
  }</pre>
<p>You might start your application with a bootstrapper which waits until datacontext initialization is finished before setting up the UI</p>
<pre class="brush:jscript;">
   dataservice.initialize()
       .then(go)
       .fail(failedInitialization);

   function go() {
      // setup views, view models, routing, etc.
      // and start the magic
   }
</pre>
<h2>
	Bind to a combobox</h2>
<p>Now you have primed your <em>datacontext </em>(and your application) with the lists you&#39;ll need throughout the user session. Your ViewModels can get them from the <em>datacontext </em>and deliver them to their Views as in this Knockout-inspired example:</p>
<pre class="brush:jscript;">
app.vm.productEditor = (function (datacontext) {
    
    var vm = {
              product: ko.observable(),
              categories: ko.observableArray();
              activate: activate,
              ...,    
    };
    ...
    return vm;

    function activate() {
       ...
       vm.categories(datacontext.lookups.categories);
    }
})(app.datacontext);</pre>
<p>... which is later bound to a combobox (an HTML <em>select </em>element) as seen in this fragment from a <em>productEditorView</em></p>
<pre class="brush:xml;">
&lt;div data-bind=&quot;with: product&quot;&gt;    
   &lt;input data-bind=&quot;value:name&quot; /&gt;
   &lt;label&gt;Category&lt;/label&gt;
   &lt;select data-bind=&quot;options: $parent.categories, optionsText: &#39;categoryName&#39;, value: category&quot;
   &lt;/select&gt;
  ...
&lt;/div&gt;
</pre>

<h4>Combobox binding in Angular</h4>
<pre class="brush:jscript;">
    <select ng-model="vm.product.Category" ng-options="cat.CategoryName for cat in vm.categories">
      <option value="">-- choose category --</option>
    </select></pre>

<h2>
	Notes</h2>
<p>[<a name="Note01">1</a>] You may have thought that the string argument had to be the name of an entity collection. Not so. An entity collection name is the <em>conventional</em> argument to a <em>from(...)</em> clause. What matters is that it match the name of a GET action method on your controller. Look again at the <span class="codeword">NorthwindController</span> and you&#39;ll find the <em>Customers </em>and <em>Orders </em>methods. We could have called them <em>Bob </em>and <em>Sue </em>to demonstrate our fine sense of humor. We restrained ourselves and stuck with conventional naming.</p>
<p>[<a name="Note02"></a>2] Sometimes you have more than one asynchronous operation to perform before the datacontext initialization is complete. These operations might proceed in sequence:</p>
<pre class="brush:jscript;">
  var initialize = function () {
      return doFirst()
          .then(getLookups)
          .then(doLast);
  };</pre>
<p>... or you might be able to do them in parallel:</p>
<pre class="brush:jscript;">
  var initialize = function () {
      return Q.all([getLookups(), doSomethingInParallel()]);
  };</pre>
<p>... or you can write any combination of the above. Whatever you do, you return a single promise which, when fully and successfully resolved, signals that <em>datacontext </em>initialization is complete.</p>
