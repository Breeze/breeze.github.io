---
layout: samples
---
<table style="border: 0; margin: 0 0 20px 0;">
	<tbody>
		<tr>
			<td style="width:1%"><img alt="" height="66" src="/images/samples/edmunds-app-logo.png" width="66" /></td>
			<td>
			<h1 style="margin: 20px 0 20px 0;">The Edmunds &quot;Not My Server&quot; Sample</h1>
			</td>
		</tr>
	</tbody>
</table>

<p>BreezeJS is a pure JavaScript library that can manage data from <em>any HTTP source</em>. This sample application reads the &quot;Make&quot; and &quot;Model&quot; data from the <a href="http://developer.edmunds.com/docs" target="_blank"><strong>Edmunds.com Vehicle Information service</strong></a> and translates those data into Breeze entities.</p>

<ul>
	<li>no ASP.NET</li>
	<li>no OData or Web API</li>
	<li>no EntityFramework</li>
	<li>no SQL Server</li>
	<li>no metadata from the server</li>
	<li>no IQueryable</li>
</ul>

<p>Just some <strong>HTML and JavaScript on the client</strong> talking to a <strong>public 3rd party API that is completely out of our control</strong>.</p>

<p>You&rsquo;ll find &ldquo;Edmunds&rdquo; among the samples in the <a href="/documentation/download">full download</a>.</p>

<h2>Prep It</h2>

<p>The breeze scripts are not included directly in this sample. You must copy them into the sample before you run it.</p>

<p>Windows users can simply execute the <strong><em>getLibs.cmd</em></strong> command file which copies the files from a source directory in the samples repository into the <em>scripts </em>folder.</p>

<p>Not a Windows user? It&#39;s really simple.</p>

<ul>
	<li>Open the <strong><em>getLibs.cmd</em></strong> command file in a text editor.</li>
	<li>Notice that it copies a small number of source files, starting from&nbsp; <em>..\..\build\libs\</em>, into the&nbsp; <em>scripts&nbsp; </em>folder.</li>
	<li>Do the same manually.</li>
</ul>

<h2>Run it</h2>

<p>Locate the <em>index.html</em> file. Double-click it. The app loads in your default browser.</p>

<p>The app presents a list of automobile &quot;Makes&quot; returned by a request to the <a href="http://developer.edmunds.com/docs">Edmunds.com Vehicle Information service</a> API.</p>

<p>Click a checkbox next to a &quot;Make&quot;, and the application fetches the related &quot;Model&quot; information from the Edmunds model service. In the following image, the app displays the &quot;Aston Martin&quot; models, their names, sizes, and styles.</p>

<p><img alt="Edmunds sample running" src="/images/samples/edmunds-running.png" style="width: 100%; max-width: 511px;" /></p>

<p>Toggling the checkbox will show and hide the &quot;Models&quot;. The app only gets the Model data for a Make the first time; subsequent displays are filled from Model entities in the Breeze <em>EntityManager</em> cache.</p>

<p>A pop-up toast in the lower right corner tells you if the app requested data from the service or retrieved the Models from cache.</p>

<p>Type a few letters in the &quot;<em>Filter by Make ...</em>&quot; text box; the app reduces the list to just the makes with that letter combination somewhere in the name.</p>

<p>The app is deliberately super-simple. We want you to concentrate on what it takes to get data from 3rd party data sources and turn them into Breeze entity graphs.</p>

<p>Once you have entities, you can apply all of your Breeze knowledge to insert, edit, and delete them. Breeze raises property change events, tracks changes, and validates as it does for entities from any other source.</p>

<h2>Dependencies</h2>

<p>This is a pure client-side sample. Yes it&#39;s shipped as a Visual Studio ASP.NET web project for the convenience of our many .NET Breeze developers. But that doesn&#39;t really matter. You can grab and relocate the HTML (<em>index.html</em>), CSS (<em>Content</em>) and JavaScript (<em>app</em>, <em>Scripts</em>) files, edit them with the IDE of your choice, and host them wherever you wish. You can ignore the <em>Web.config</em>.</p>

<p>The only 3rd party dependencies are JavaScript libraries:</p>

<ul>
	<li><a href="http://jquery.com/" target="_blank" title="jQuery">jQuery</a></li>
	<li><a href="http://angularjs.org/" target="_blank" title="AngularJS">angular.js</a> for binding (could have used <a href="http://knockoutjs.com/" target="_blank" title="KnockoutJS">knockout.js</a>)</li>
	<li><a href="https://github.com/kriskowal/q#readme" target="_blank" title="Q.js">Q.js</a> for promises</li>
	<li><a href="https://github.com/CodeSeven/toastr#readme" target="_blank" title="toastr">toastr</a> for &quot;Toast&quot; messages of app activity</li>
</ul>

<p>And <strong>breeze.js</strong> of course.</p>

<p>However, this app only includes the Breeze JavaScript files which we <a href="/documentation/download" title="Breeze download">extracted from the runtime zip</a>. We did <strong>not</strong> install the <em>breeze.webapi</em> NuGet package because we only want the JavaScript; we don&#39;t need any of the Breeze.NET components.</p>

<h2>Inside the app</h2>

<p>Everything of interest is in one HTML file and five JavaScript application files.</p>

<h3>HTML</h3>

<p>The <em>index.html</em> file loads CSS, 3rd party libraries, and the application scripts.</p>

<p>The UI is a single &quot;view&quot; defined within the &lt;body&gt; tag. The HTML is marked up with Angular.js binding &quot;directives&quot;:</p>

<pre class="brush:xml;">
&lt;div&gt;
  &lt;input class=&quot;filter&quot; data-ng-model=&quot;searchText&quot; type=&quot;search&quot; placeholder=&quot;Filter by Make ...&quot; /&gt;
&lt;/div&gt;
&lt;div data-ng-show=&quot;!makes.length&quot; class=&quot;make&quot;&gt;... loading makes ...&lt;/div&gt;
&lt;div data-ng-repeat=&quot;make in makes | filter:makeFilter&quot; class=&quot;make&quot;&gt;
    &lt;input type=&quot;checkbox&quot; data-ng-model=&quot;make.showModels&quot; data-ng-click=&quot;getModels(make)&quot; /&gt;
    {{make.name}}
   &lt;span data-ng-show=&quot;make.isLoading&quot;&gt; ... (loading models)...&lt;/span&gt;
    &lt;table data-ng-show=&quot;make.showModels&quot; class=&quot;models&quot;&gt;
        &lt;tr data-ng-repeat=&quot;model in make.models | orderBy: &#39;name&#39;&quot;&gt;
            &lt;td class=&quot;modelName&quot;&gt;{{model.name}}&lt;/td&gt; 
            &lt;td class=&quot;modelSize&quot;&gt;{{model.vehicleSizes}}&lt;/td&gt;
            &lt;td class=&quot;modelStyle&quot;&gt;{{model.vehicleStyles}}&lt;/td&gt;
        &lt;/tr&gt;
    &lt;/table&gt;
&lt;/div&gt;</pre>

<p>Highlights:</p>

<ul>
	<li>
	<p>Filter textbox bound to the controller&#39;s <span class="codeword">searchText</span> property.</p>
	</li>
	<li>
	<p>Message text displayed while loading &quot;Make&quot; data, bound to the length of the controller&#39;s <span class="codeword">makes</span> array.</p>
	</li>
	<li>
	<p>A &quot;repeater&quot; &lt;div&gt; enclosing a template for each &quot;Make&quot; in the <span class="codeword">makes</span> array.</p>
	</li>
	<li>
	<p>A checkbox for toggling the display of &quot;Models&quot; for the given &quot;Make&quot;. It&#39;s bound to the <span class="codeword">make</span>&#39;s <span class="codeword">showModels</span> field.</p>
	</li>
	<li>
	<p>An Angular &quot;interpolation&quot; to show the name of the &quot;Make&quot;</p>
	</li>
	<li>
	<p>A table to display the &quot;Models&quot; for the current <span class="codeword">make</span></p>
	</li>
	<li>
	<p>A &quot;repeater&quot; table row for each Model; the interpolations for <span class="codeword">model</span> property appear in each cell.</p>
	</li>
</ul>

<p>This is standard Angular fare.</p>

<h3>Application JavaScript</h3>

<p>The client-side experience is driven by five short application JavaScript files. Each file is dedicated to a simple purpose:</p>

<p><strong><em>controller</em></strong> - Display vehicle data in the view and respond to user gestures (clicks and key strokes). The controller delegates data access chores to the <em>datacontext</em>.</p>

<p><strong><em>datacontext</em></strong> - Uses Breeze to request &quot;Make&quot; and &quot;Model&quot; data from the Edmunds service and turn those data into AngularJS-ready entities. It delegates to <em>model.js</em> for metadata about <span class="codeword">make</span> and <span class="codeword">model</span> entity types. It requires the <em>jsonResultsAdapter.js</em> to transform Edmunds data into instances of those types</p>

<p><strong><em>model</em></strong> - Defines <span class="codeword">make</span> and <span class="codeword">model</span> entity types using the Breeze metadata API.</p>

<p><strong><em>jsonResultsAdapter</em></strong> - Tells breeze how to convert the JSON results returned from the Edmunds service into <span class="codeword">make</span> and <span class="codeword">model</span> entity instances.</p>

<p><strong><em>logger</em></strong> - Logs application activity messages to the console log and to &quot;toastr&quot; which presents those messages as color-coded &quot;toasts&quot; rising from the lower right corner of the screen.</p>

<p>Let&#39;s look at some highlights from selected scripts.</p>

<h3>controller.js</h3>

<p>This file defines the application module, `app, and the controller for the application&#39;s only view, <em>index.html</em>.</p>

<p>The <span class="codeword">app</span> module is the only object added to the global namespace; it serves as both module and application namespace. As you look at other the other application JavaScript files, you&#39;ll see that each adds itself as a &quot;service&quot; to the <span class="codeword">app</span> module through one of the Angular configuration methods: <span class="codeword">controller</span>, <span class="codeword">factory</span>, or <span class="codeword">value</span>.</p>

<p>Note how the controller factory method relies on Angular to inject the application&#39;s <span class="codeword">datacontext</span> and <span class="codeword">logger</span> services at runtime.</p>

<pre class="brush:jscript;">
app.controller(&#39;EdmundsCtrl&#39;, function ($scope, datacontext, logger) {
    ...
} 
</pre>

<p>You&#39;ll see this pattern repeated in the other scripts that define components with application service dependencies.</p>

<p>The &#39;EdmundsCtrl&#39; controller governs the view through the Angular <span class="codeword">$scope</span> variable which it configures with properties and methods. The <span class="codeword">makes</span> array is one of those properties; it holds the &quot;Make&quot; entities fetched from the Edmunds service by the <span class="codeword">getMakes</span> method:</p>

<pre class="brush:jscript;">
function getMakes() {
    datacontext.getMakes().then(succeeded).fail(queryFailed);

    function succeeded(results) {
        $scope.makes = results;
        $scope.$apply();
        logger.info(&quot;Fetched &quot; + results.length + &quot; Makes&quot;);
    }
};
</pre>

<p>See how it delegates to the <span class="codeword">datacontext.getMakes</span> method which returns a <strong>promise</strong>. When the Edmumnds service returns successfully, the controller replaces the <span class="codeword">makes</span> array with the results of the service call. These results are <span class="codeword">make</span> entities, ready for binding.</p>

<p>The <span class="codeword">getModels</span> method is a little trickier:</p>

<pre class="brush:jscript;">
function getModels(make) {

    if (!make.showModels) {
        return; // don&#39;t bother if not showing
    } else if (make.models.length &gt; 0) {
        // already in cache; no need to get them
        logGetModelResults(true /*from cache*/);
    } else {
        getModelsFromEdmunds()
    }
    ...
}</pre>

<p>For the selected &quot;Make&quot; it will do one of the following:</p>

<ul>
	<li>
	<p>nothing if the &quot;Show models&quot; checkbox is unchecked.</p>
	</li>
	<li>
	<p>get the models from cache via the &quot;Make&quot;&#39;s <span class="codeword">models</span> navigation property if its models have already been loaded.</p>
	</li>
	<li>
	<p>fetch the models from the Edmunds service if this is the first request for models for this &quot;Make&quot;.</p>
	</li>
</ul>

<p>The third choice - fetching models - is like <span class="codeword">getMakes</span> in that it delegates to a <em>datacontext</em> for asynchronous data access.</p>

<h3>datacontext.js</h3>

<p>The <em>datacontext</em> is a client-side application &quot;service&quot; responsible for fetching data from the remote Edmonds services and turning those data into Breeze entities.</p>

<p>These will be Angular entities so we have to configure Breeze accordingly. Breeze makes Knockout-ready entities by default. The following line tells Breeze to use its native &quot;backingStore&quot; modeling adapter instead (the adapter appropriate for AngularJS entities).</p>

<pre class="brush:jscript;">
breeze.config.initializeAdapterInstance(
    &quot;modelLibrary&quot;, &quot;backingStore&quot;, true);
</pre>

<p>The Edmunds Vehicle Information service is a 3rd party service. That service defines its <a href="http://developer.edmunds.com/docs" title="Edmunds Developer API">own proprietary API</a> over which we have no control. It won&#39;t send us metadata. It will send us data in a non-standard, proprietary JSON format.</p>

<p>We can&#39;t change the service. We can&#39;t make it adapt to Breeze. We have to adapt to it.</p>

<p>We begin by creating a Breeze <span class="codeword">DataService</span> object that describes some high-level characteristics of the Edmunds service. Then we create an <span class="codeword">EntityManager</span> to targets that service.</p>

<pre class="brush:jscript;">
var ds = new breeze.DataService({
    serviceName: serviceName, // the URL endpoint
    hasServerMetadata: false, // the service won&#39;t give us metadata
    useJsonp: true,           // request data using the JSONP protocol
    jsonResultsAdapter: jsonResultsAdapter
});

var manager = new breeze.EntityManager({dataService: ds});
</pre>

<p>Note that the Edmunds service is hosted hosted in a different domain than our application. The browser&#39;s <a href="http://en.wikipedia.org/wiki/Same_origin_policy" title="Same Origin Policy">Same Origin Policy</a> prevents us from accessing the service through regular AJAX calls. We&#39;ll only GET data so we can use the <a href="http://en.wikipedia.org/wiki/JSONP" title="JSONP protocol">JSONP protocol</a> to circumvent that policy (Edmunds supports that protocol).</p>

<p>The <span class="codeword">manager</span> will need metadata to create, materialize, and manage Edmunds data as Breeze entities. The <em>remote </em>Edmunds service won&#39;t give us metadata. So with this next line of initialization code, we&#39;ll get metadata via the <em>local</em> <span class="codeword">model</span> service which we wrote in JavaScript and arranged for Angular to inject into the <em>datacontext</em>.</p>

<pre class="brush:jscript;">
model.initialize(manager.metadataStore);
</pre>

<p>The <em>datacontext</em> is finally ready to make Edmunds service calls. Here&#39;s the request for vehicle &quot;Makes&quot;:</p>

<pre class="brush:jscript;">
function getMakes() {
    var parameters = makeParameters();
    var query = breeze.EntityQuery
        .from(&quot;vehicle/makerepository/findall&quot;)
        .withParameters(parameters);
    return manager.executeQuery(query).then(returnResults);
}
</pre>

<p>Edmunds doesn&#39;t support <span class="codeword">IQueryable</span> so we won&#39;t be constructing queries with the Breeze query verbs such as <span class="codeword">where</span>, <span class="codeword">orderBy</span>, and <span class="codeword">expand</span>.</p>

<p>We begin by constructing a query targeting the Edmunds &quot;vehicle/makerepository/findall&quot; endpoint that returns all vehicle &quot;Makes&quot;.</p>

<p>The Edmunds API expects some query parameters in the request which we add using the Breeze <span class="codeword">withParameters</span> syntax. We encapsulated the required parameters themselves in the <span class="codeword">makeParameters</span> method for use in all of our Edmunds service calls:</p>

<pre class="brush:jscript;">
var parameters = {
    fmt: &quot;json&quot;,
    api_key: &quot;z35zpey2s8sbj4d3g3fxsqdx&quot;
    // Edmund throttles to 4000 requests per API key
    // get your own key: http://developer.edmunds.com/apps/register
};
</pre>

<p>The balance of the <em>datacontext</em> is standard Breeze and JavaScript. Let&#39;s move on to the <em>model.js</em> application script.</p>

<h3>model.js</h3>

<p>We <em>can&#39;t</em> get Breeze metadata from the Edmunds service. We <em>can</em> define the metadata on the client.</p>

<p>The calling <em>datacontext</em> extracts the <span class="codeword">metadataStore</span> from its <span class="codeword">EntityManager</span> and passes it into the <span class="codeword">model.initialize</span> method. The <em>initialize</em> method adds to that store the descriptions for the application&#39;s two entity types, &quot;Make&quot; and &quot;Model&quot;.</p>

<p style="background-color: #EEEEEE; margin: 0 8px 8px 8px;">Although you will find individual methods documented in the Breeze API (see especially <a href="/doc-js/api-docs/classes/EntityType.html" title="EntityType API doc">EntityType</a> and <a href="/doc-js/api-docs//classes/DataType.html">DataType</a>, we have not yet described the Metadata Definition API properly. We ask that you rely on your intuition as you read this code ... your intuition will usually be correct. Please post questions to <a href="http://stackoverflow.com/questions/tagged/breeze?sort=newest" target="_blank" title="StackOverflow tagged with &quot;breeze&quot;">StackOveflow tagged with &quot;breeze&quot;</a>.</p>

<h3>jsonResultsAdapter.js</h3>

<p>The format of the JSON payload from the Edmunds service is proprietary and idiosyncratic.</p>

<p>The author of this sample read the definitions for each service response (e.g, the <a href="http://developer.edmunds.com/docs/read/the_vehicle_api/Make_Repository" target="_blank">&quot;Make_Repository&quot; response</a>) on the Edmunds website and translated that information into a <span class="codeword">JsonResultsAdapter</span>. That adapter guides Breeze as it &quot;materializes&quot; <span class="codeword">Make</span> and <span class="codeword">Model</span> entities from Edmunds JSON response data.</p>

<p>If this application were more complicated, involving a rich entity model and many different service calls, we&#39;d probably want to write more than one <span class="codeword">JsonResultsAdapter</span> ... perhaps one for each Edmunds service endpoint. But this app is very simple; we can get away with just one <span class="codeword">JsonResultsAdapter</span> for all entity types and service calls.</p>

<p>A <span class="codeword">JsonResultsAdapter</span> has two methods. The first extracts the true data contents - the &quot;dataset&quot; - from the &quot;envelope&quot; of the response. The Edmunds service is typical in this respect: the fetched dataset is in the <span class="codeword">results</span> property as we see here.</p>

<pre class="brush:jscript;">
extractResults: function (data) {
    var results = data.results;
    ...
    return results &amp;&amp; (results.makeHolder || results.modelHolder);
},
</pre>

<p>We&#39;re only interested in &quot;Make&quot; and &quot;Model&quot; datasets which Edmunds identifies by &quot;<em>...Holder</em>&quot; properties.</p>

<p>Breeze calls the second adapter method, <span class="codeword">visitNode</span>, for each node in the dataset. A &#39;node&quot; is a JavaScript object containing data for a single thing.</p>

<p>For example, when we request &quot;Make&quot; data, the dataset will be an array of &quot;Make&quot; nodes. The &quot;Make&quot; node is an object with all the properties that came over the wire in its JSON representation.</p>

<p>Each &quot;Make&quot; node could have sub-nodes representing related information. In our simple example, we only consider the top level &quot;Make&quot; and &quot;Model&quot; nodes.</p>

<p>This <span class="codeword">visitNode</span> implementation handles both &quot;Make&quot; and &quot;Model&quot; nodes. It distinguishes between the two types by looking for the type&#39;s &quot;fingerprint&quot;.</p>

<p>The &quot;fingerprint&quot; is whatever it takes to distinguish one type from all others. For example, we identify a &quot;Model&quot; node by the presence of a <span class="codeword">makeId</span> property ... a unique characteristic of a &quot;Model&quot; node.</p>

<p>The code to prepare a &quot;Model&quot; node is in the second &quot;IF&quot; block. The visitor&#39;s job is to <strong>manipulate node data until the properties and values of the node align with the properties and data types defined for the corresponding entity type</strong>. This often involves some shuffling of properties and transformation of property values as we see in this code extract:</p>

<pre class="brush:jscript;">
// move &#39;node.make&#39; link so &#39;make&#39; can be null reference
node.makeLink = node.make;
node.make = null;
...
</pre>

<p>The <span class="codeword">Model.make</span>&nbsp;<strong>node </strong>property is a string, a URL link to the parent &quot;Make&quot; object on the Edmunds service. The <span class="codeword">Model.make</span> <strong>entity </strong>property is supposed to be a navigation property that returns the model&#39;s parent <span class="codeword">Make</span> entity. These are two entirely different values for properties of the same name. So the vistor relocates the URL string to a new property called <span class="codeword">makeLink</span> and &quot;nulls-out&quot; the node&#39;s <span class="codeword">make</span> property. Breeze will set the model&#39;s corresponding entity property later to the parent <span class="codeword">Make</span> entity.</p>

<p>Here&#39;s a different example. The &quot;Model&quot; node has a collection of strings, each defining a &quot;Vehicle Style&quot;. The visitor combines these strings into a single, comma-separated string so that the information fits into a single entity <span class="codeword">vehicleStyles</span> property:</p>

<pre class="brush:jscript;">
var styles = node.categories &amp;&amp; node.categories[&quot;Vehicle Style&quot;];
node.vehicleStyles = styles &amp;&amp; styles.join(&quot;, &quot;);
</pre>

<p>Finally, the vistor returns an object with a single property, <span class="codeword">entityType</span> that (a) tells Breeze to turn this node into an entity and (b) tells Breeze what kind of entity to make.</p>

<pre class="brush:jscript;">
return { entityType: &quot;Model&quot; };
</pre>

<p>Breeze takes over from there. It reads the (revised) node and moves selected node data into a newly created entity instance.</p>

<p class="note">Note that Breeze only sets values for the data properties defined in metadata for that entity type. Most of the node data from the Edmunds service are discarded in this sample application.</p>

<p><a href="http://www.breezejs.com/documentation/web-service-data-parsing" title="JsonResultsAdapter">Learn more about <em>JsonResultsAdapter</em></a> in the Breeze documentation.</p>

<h2>Service glitches</h2>

<p>Of course you&#39;ll need a good network connection to reach the Edmunds service. The Edmunds service is pretty reliable but occasionally fails to respond properly. You&#39;ll see a red error toast when that happens. The app is too simple to auto-recover; simply trying the operation again is usually sufficient.</p>

<p>Edmunds throttles requests, limiting each API key to 4,000 requests daily. In the unlikely event that sample users exceed this threshold, you can <a href="http://developer.edmunds.com/apps/register" title="Get your own Edmunds API key">get your own key from Edmunds</a> and replace the one baked into the sample in the <em>datacontext.js</em>.</p>

<h2>Wrap up</h2>

<p>We hope you enjoyed this sample. We&#39;ve tried to keep it very simple and focused on the most basic mechanics of working with 3rd party services.</p>

<p>We demonstrated a two entity model in which the entities are related to each other. The application relies on the entity navigation property from &quot;Make&quot; to &quot;Model&quot; to get models from cache and display them in a table beneath each &quot;Make&quot;.</p>

<p>We didn&#39;t show how you can edit &quot;Makes&quot; and &quot;Models&quot;. We didn&#39;t show how to add validation rules to the metadata. And we didn&#39;t show how to save changed entities back to the service (which you can&#39;t do with the Edmunds service anyway). These are capabilities we&#39;ll demonstrate in future samples.</p>
