---
layout: doc-samples
redirect_from: "/old/samples/todo-server.html"
---
<h1>
	Todo .NET Sample Server</h1>
<p>The <a href="/doc-samples/about-todo">Todo samples</a> are introductory tutorials on client-side JavaScript development with Breeze. The server is not the point. But the Todo application needs a server to demonstrate its capabilities.</p>
<p>That server, the subject of this topic, is the same for all Todo Sample variations. It is a simple ASP.NET Web Application running a Breeze Web API controller on IIS that queries and saves data to a SQL Server database via an Entity Framework &quot;Code First&quot; model.</p>
<p>We stress that BreezeJS itself is not wedded to this particular combination of technologies. Other Breeze samples will demonstrate Breeze working with other server-side technologies. We settled on ASP.NET, IIS, Web API, Entity Framework, and SQL Server <em>for these Todo samples</em> because they are easy-to-use and widely accepted within the .NET community ... the first community to adopt Breeze as its own.</p>
<h2>
	ASP.NET Web Application</h2>
<p>The Todo samples were built from scratch in Visual Studio 2012 with the <strong>ASP.NET Empty Web Application</strong> template. That template produces a single barebones project with no ASP.NET MVC, no Razor engine, no Entity Framework, no Web API. It is automatically configured to run on IIS Express.</p>
<p>We reset the target .NET framework to <strong>.NET 4.0</strong> to make these samples available to developers who have not yet upgraded to 4.5. You&#39;re welcome to retarget your copies to .NET 4.5 where they work fine as well.</p>
<p class="note">Could we have used an MVC template (MVC Empty, MVC Web API, MVC SPA, ...)? Sure. In fact we did start with the MVC Web API template in earlier versions. And those templates will be a popular foundation for many applications. But the MVC templates add a ton of material ... including MVC itself ... that we aren&#39;t using in this Todo sample. We opted for the cleanest, leanest ASP starting point.</p>
<p>We installed the latest &quot;<strong>Breeze.MVC4WebApi</strong>&quot; NuGet package. Your copy may have an older version of that package; please feel free to upgrade it yourself.</p>
<p>The &quot;Breeze.MVC4WebApi&quot; NuGet package installs the <strong>ASP Web API</strong>, <strong>Entity Framework 5.x</strong>, the <strong>Breeze.NET</strong> components in support of EF and Web API, and the <strong>BreezeJS</strong> JavaScript files (Breeze and <strong>Q</strong>).</p>
<h2>
	SQL Server Database</h2>
<p>The Todo data are stored in a <a href="https://www.microsoft.com/en-us/download/details.aspx?id=30709" target="_blank">SQL Server Compact Edition 4 (SQL Server CE)</a> database. We installed it and a companion EF driver via the &quot;<strong>EntityFramework.SqlServerCompact</strong>&quot; NuGet package.</p>
<p>We picked SQL Server CE because many developers don&#39;t or won&#39;t install any version of the SQL Server on their machines ... and CE deploys as a referenced DLL, not as a Microsoft product. To paraphrase Microsoft&#39;s description, &quot;SQL Server CE is a free, embedded database with a small footprint that supports private deployment of its binaries within the application folder.&quot;&nbsp;</p>
<p>The Todo database itself is not included in the download. Rather the application (re)generates it from scratch, with mock data, every time the server starts. You&#39;ll find it as the hidden &quot;<strong>Todos.sdf</strong>&quot; file in the <strong>App_Data</strong> folder.</p>
<h2>
	JavaScript Libraries</h2>
<p>All third party libraries are in the <strong><em>Scripts </em>folder</strong>. In our own applications, we tend to put them in to a <em>Scripts/lib</em> folder. But NuGet insists on deploying them to the <em>Scripts </em>directory and we let that be.</p>
<p>We installed <strong>jQuery </strong>and <strong>toastr </strong>with NuGet in all sample variations. We use the <a href="https://github.com/CodeSeven/toastr" target="_blank"><strong>toastr </strong>library</a> to display process and error messages in pop up &quot;toast&quot; windows.</p>
<p>For the Todo-Knockout variations we installed the &quot;<strong>knockoutjs</strong>&quot; NuGet package. For the Todo-AngularJS variations, we downloaded and added <strong><em>angular.js</em></strong> and <strong><em>angular.min.js</em></strong> directly to the <em>Scripts </em>directory; the AngularJS NuGet package installs far too many unwanted scripts for our tastes.</p>
<p>For Todo-Require we installed the &quot;<strong>RequireJS</strong>&quot; NuGet package.</p>
<h2>
	content</h2>
<p>The <em>content </em>folder holds three CSS files</p>
<table style="border-collapse: collapse; margin: 0px 0px 20px 1em; padding: 0px; border: 1px solid rgb(204, 204, 204); outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; border-spacing: 0px; width: 669px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68); font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: 19px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-size-adjust: auto; -webkit-text-stroke-width: 0px; background-color: rgb(241, 241, 241); max-width: 400px;">
	<thead style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
		<tr style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
			<th style="border-width: 0px 0px 1px; border-bottom-style: solid; border-bottom-color: rgb(204, 204, 204); padding: 4px 8px; text-align: left; margin: 0px; outline: 0px; font-size: 13px; vertical-align: middle; font: inherit; background-color: rgb(247, 247, 247); color: rgb(51, 51, 51); font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 7em; background-position: initial initial; background-repeat: initial initial;">
				CSS file</th>
			<th style="border-width: 0px 0px 1px; border-bottom-style: solid; border-bottom-color: rgb(204, 204, 204); padding: 4px 8px; text-align: left; margin: 0px; outline: 0px; font-size: 13px; vertical-align: middle; font: inherit; background-color: rgb(247, 247, 247); color: rgb(51, 51, 51); font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-position: initial initial; background-repeat: initial initial;">
				Description</th>
		</tr>
	</thead>
	<tbody style="border: 0px; margin: 0px; padding: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
		<tr style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
			<td style="margin: 0px; padding: 4px 8px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
				reset</td>
			<td style="margin: 0px; padding: 4px 8px 10px; border: 0px; outline: 0px; font-size: 13px; vertical-align: middle; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
				Eric Meyer&#39;s CSS that clears ambient settings. Copied from his web site.</td>
		</tr>
		<tr style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
			<td style="margin: 0px; padding: 4px 8px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
				toastr</td>
			<td style="margin: 0px; padding: 4px 8px 10px; border: 0px; outline: 0px; font-size: 13px; vertical-align: middle; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
				Formatting for the toastr pop-ups. Installed by the &quot;toastr&quot; NuGet package</td>
		</tr>
		<tr style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
			<td style="margin: 0px; padding: 4px 8px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
				todo</td>
			<td style="margin: 0px; padding: 4px 8px 10px; border: 0px; outline: 0px; font-size: 13px; vertical-align: middle; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
				Formatting specifically for this application.</td>
		</tr>
	</tbody>
</table>
<h2>
	Models</h2>
<p>The <strong><em>Models </em>folder</strong> holds the business model for the application.</p>
<p><strong>TodoItem.cs</strong> defines the one and only entity class. It is small and simple enough to reprint in full:</p>
<pre class="brush:csharp;">
public class TodoItem
{
    public int Id { get; set; }                     // 42

    [Required, StringLength(maximumLength: 30)]     // Validation rules
    public string Description { get; set; }         // &quot;Get milk&quot;

    public System.DateTime CreatedAt { get; set; }  // 25 August 2012, 9am PST
    public bool IsDone { get; set; }                // false
    public bool IsArchived { get; set; }            // false
}
</pre>
<p>Notice the <em>System.ComponentModel.DataAnnotations</em> attributes, <span class="codeword">Required</span> and <span class="codeword">StringLength</span>, decorating the <em>Description </em>property. They impose minimum and maximum lengths for the <em>TodoItem.Description</em> - validations that are enforced by Entity Framework on the server and by BreezeJS on the client. The Breeze.Net detects these validations and includes them in the metadata it sends to the client.</p>
<p><strong>TodosContext </strong>is an Entity Framework Code First <span class="codeword">DbContext</span> for modeling and database access. It too is trivially simple:</p>
<pre class="brush:csharp;">
public class TodosContext : DbContext 
{
    // DEVELOPMENT ONLY: initialize the database
    static TodosContext()
    {
        Database.SetInitializer(new TodoDatabaseInitializer());
    }
    public DbSet&lt;TodoItem&gt; Todos { get; set; }
}</pre>
<p>It exposes a single st <span class="codeword">DbSet</span> property with which to query <span class="codeword">TodoItem</span>.</p>
<p>The static constructor ensures that the database is (re)built from scratch with demo data when the server is launched. The database initialization class, <strong>TodoDatabaseInitializer.cs</strong>, is too big to reprint here but it is easy to read.</p>
<p>When the application requests data from the <em>TodosContext</em>, it finds a connection string for the database in the <strong>Web.config</strong> under the name &quot;<em><strong>TodosContext</strong></em>&quot;.</p>
<pre class="brush:xml;">
&lt;connectionStrings&gt;
   &lt;add name=&quot;TodosContext&quot; 
        connectionString=&quot;Data Source=|DataDirectory|Todos.sdf&quot;
        providerName=&quot;System.Data.SqlServerCe.4.0&quot; /&gt;
&lt;/connectionStrings&gt;</pre>
<h2>
	Web API Controller</h2>
<p>The <strong><em>Controllers </em>folder</strong> holds the sole Web API controller, <strong>TodosController</strong>.</p>
<p>Web API developers will not be surprised to learn that there is only one controller; afterall, there is only one entity type. But, this being a Breeze Web API, there probably would be only one controller even if the model had twenty entity types.</p>
<p>The todosController is a tad too big to reprint in full. We&#39;ll break it down in parts.</p>
<p>First, here is the essence of it:</p>
<pre class="brush:csharp;">
[BreezeController]
public class TodosController : ApiController {

    // ~/api/todos/Metadata 
    [HttpGet]
    public string Metadata() { 
        return _contextProvider.Metadata();  
    }

    // ~/api/todos/Todos
    // ~/api/todos/Todos?$filter=IsArchived%20eq%20false&amp;$orderby=CreatedAt 
    [HttpGet]
    public IQueryable&lt;TodoItem&gt; Todos() {
        return _contextProvider.Context.Todos;
    }

    // ~/api/todos/SaveChanges
    [HttpPost]
    public SaveResult SaveChanges(JObject saveBundle) {
        return _contextProvider.SaveChanges(saveBundle);
    }
}
</pre>
<p class="note">This would have been the <em><strong>entire </strong></em>controller implementation ... if we hadn&#39;t added extra material for deploying and managing this demo on our servers at <a href="http://todo.breezejs.com" target="_blank">todo.breezejs.com</a>.</p>
<p>The <strong>[<span class="codeword">BreezeController</span>]</strong> attribute adorning the class is essential. It configures the Web API specifically for this controller.</p>
<ul>
	<li>
		It removes all media type filters from the pipeline and adds the Breeze.NET <strong><span class="codeword">JsonFormatter</span></strong>. Consequently, the controller&#39;s response to every GET request is formatted as JSON in the manner that a BreezeJS client requires.</li>
	<li>
		It adds an <strong><span class="codeword">ODataActionFilter</span></strong> to the GET processing pipeline that Breeze.NET uses to apply an OData query string from the client to an&nbsp; <strong><span class="codeword">IQueryable</span></strong> returned by a controller action method such as <em>Todos</em>.</li>
</ul>
<p>There are three action methods - <em>MetaData</em>, <em>Todos</em>, and <em>SaveChanges</em> -, each preceded by a comment illustrating the kind of HTTP request handled by that method. Each is adorned with a Web API, <em>System.Web.Http</em> attribute identifying which HTTP methods can be routed to this action.</p>
<table>
	<tbody>
		<tr style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: baseline; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
			<th style="border-width: 0px 0px 1px; border-bottom-style: solid; border-bottom-color: rgb(204, 204, 204); padding: 4px 8px; text-align: left; margin: 0px; outline: 0px; font-size: 13px; vertical-align: middle; font: inherit; background-color: rgb(247, 247, 247); color: rgb(51, 51, 51); font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; width: 7em; background-position: initial initial; background-repeat: initial initial;">
				Action</th>
			<th style="border-width: 0px 0px 1px; border-bottom: 1px solid rgb(204, 204, 204); padding: 4px 8px; text-align: left; margin: 0px; outline: 0px none; vertical-align: middle; font-style: inherit; font-variant: inherit; font-weight: inherit; font-size: inherit; line-height: inherit; font-size-adjust: inherit; font-stretch: inherit; -moz-font-feature-settings: inherit; -moz-font-language-override: inherit; background-color: rgb(247, 247, 247); color: rgb(51, 51, 51); font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; width: 66px;">
				Http Method</th>
			<th style="border-width: 0px 0px 1px; border-bottom: 1px solid rgb(204, 204, 204); padding: 4px 8px; text-align: left; margin: 0px; outline: 0px none; vertical-align: middle; font-style: inherit; font-variant: inherit; font-weight: inherit; font-size: inherit; line-height: inherit; font-size-adjust: inherit; font-stretch: inherit; -moz-font-feature-settings: inherit; -moz-font-language-override: inherit; background-color: rgb(247, 247, 247); color: rgb(51, 51, 51); font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; width: 408px;">
				Description</th>
		</tr>
		<tr style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
			<td style="margin: 0px; padding: 4px 8px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
				Metadata</td>
			<td style="margin: 0px; padding: 4px 8px; border: 0px none; outline: 0px none; vertical-align: top; font-style: inherit; font-variant: inherit; font-weight: inherit; font-size: inherit; line-height: inherit; font-size-adjust: inherit; font-stretch: inherit; -moz-font-feature-settings: inherit; -moz-font-language-override: inherit; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; color: rgb(68, 68, 68); width: 66px;">
				GET</td>
			<td style="margin: 0px; padding: 4px 8px 10px; border: 0px none; outline: 0px none; vertical-align: middle; font-style: inherit; font-variant: inherit; font-weight: inherit; font-size: inherit; line-height: inherit; font-size-adjust: inherit; font-stretch: inherit; -moz-font-feature-settings: inherit; -moz-font-language-override: inherit; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; color: rgb(68, 68, 68); width: 408px;">
				Returns BreezeJS metadata describing the model so the Breeze client can create, materialize, validate and save TodoItems.</td>
		</tr>
		<tr style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
			<td style="margin: 0px; padding: 4px 8px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
				Todos</td>
			<td style="margin: 0px; padding: 4px 8px; border: 0px none; outline: 0px none; vertical-align: top; font-style: inherit; font-variant: inherit; font-weight: inherit; font-size: inherit; line-height: inherit; font-size-adjust: inherit; font-stretch: inherit; -moz-font-feature-settings: inherit; -moz-font-language-override: inherit; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; color: rgb(68, 68, 68); width: 66px;">
				GET</td>
			<td style="margin: 0px; padding: 4px 8px 10px; border: 0px none; outline: 0px none; vertical-align: middle; font-style: inherit; font-variant: inherit; font-weight: inherit; font-size: inherit; line-height: inherit; font-size-adjust: inherit; font-stretch: inherit; -moz-font-feature-settings: inherit; -moz-font-language-override: inherit; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; color: rgb(68, 68, 68); width: 408px;">
				Returns an IQueryable of all TodoItems in the database which can be filtered, sorted, and paged on the database by client request.</td>
		</tr>
		<tr style="margin: 0px; padding: 0px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
			<td style="margin: 0px; padding: 4px 8px; border: 0px; outline: 0px; font-size: 13px; vertical-align: top; font: inherit; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: rgb(68, 68, 68);">
				SaveChanges</td>
			<td style="margin: 0px; padding: 4px 8px; border: 0px none; outline: 0px none; vertical-align: top; font-style: inherit; font-variant: inherit; font-weight: inherit; font-size: inherit; line-height: inherit; font-size-adjust: inherit; font-stretch: inherit; -moz-font-feature-settings: inherit; -moz-font-language-override: inherit; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; color: rgb(68, 68, 68); width: 66px;">
				POST</td>
			<td style="margin: 0px; padding: 4px 8px 10px; border: 0px none; outline: 0px none; vertical-align: middle; font-style: inherit; font-variant: inherit; font-weight: inherit; font-size: inherit; line-height: inherit; font-size-adjust: inherit; font-stretch: inherit; -moz-font-feature-settings: inherit; -moz-font-language-override: inherit; font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; color: rgb(68, 68, 68); width: 408px;">
				Receives a bundle of entity information describing one or more entities (TodoItems in this case) that should be created, updated, or deleted. All standard Breeze client save requests are routed to this method.</td>
		</tr>
	</tbody>
</table>
<p>Almost all Breeze Web API controllers will have a single <em>Metadata </em>and a single <em>SaveChanges </em>method, regardless of the number of entity types it supports.</p>
<p>If there were more entity types to query ... and you wanted the client to be able to query them ... you would add more query methods like <em>Todos</em>.</p>
<h3>
	EFContextProvider</h3>
<p>Notice that all three methods delegate to an instance of <strong>EFContextProvider</strong>.The <em>EFContextProvider </em>is a helper class that makes it easier for Breeze Web API controllers to interact with an Entity Framework <em>DbContext </em>(or <em>ObjectContext</em>).</p>
<p>This provider wraps an instance of <em>TodoContext</em>, the application model&#39;s <em>DbContext </em>(described above). The provider&#39;s <em>Context </em>property exposes this <em>DbContext</em> directly to controller query methods such as <em>Todos</em>, making it easy to return a <em>DbContext</em>&#39;s <em>DbSet </em>property as the action result.</p>
<p>Creating metadata for the Breeze client based on an Entity Framework model is no small task. The provider&#39;s <em>Metadata </em>method does the job.</p>
<p>The provider&#39;s <em>SaveChanges </em>method can turn the incoming Json.NEt object representing an entity changeset into a database update via the Entity Framework.</p>
<p>Read <a href="/doc-net/ef-efcontextprovider-4x">more about the EFContextProvider here</a>.</p>
<h3>
	Demo members</h3>
<p>The rest of the controller - perhaps as much as half of the controller code - has nothing to do with the Todo application <em>per se</em>. You probably wouldn&#39;t include any of it in your applications.</p>
<p>We need it because we host this sample on our servers at <a href="http://todo.breezejs.com" target="_blank">todo.breezejs.com</a>. People trying the application tend to enter a lot of junk data some of which may be offensive. The <em>Purge </em>method deletes all TodoItems in the database. The <em>Reset </em>method purges the database and re-creates the demo data set.</p>
<p>A BreezeJS <em>EntityManager </em>can&#39;t call these methods itself. The only HTTP POST an <em>EntityManager </em>can send is a <em>SaveChanges </em>request. But the client application can ... with a simple AJAX call ... in the same way it can call <em>any </em>Web API method. And the Todo client application does bind HTML links to <em>dataservice.js </em>methods that make purge and reset requests.</p>
<p>There is also timer logic at the top and bottom of the controller to purge and reset the database automatically every 20 minutes. You are unlikey to want to do this to your production database.</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p><a href="/doc-samples/about-todo">Back to the main Todo Sample page</a></p>
