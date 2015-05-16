---
layout: doc-net
---
<h1>DbContext</h1>

<p>The Basic Breeze teaching tests make requests for data services to an ASP.NET Web API controller. The controller forwards those requests to the .NET Entity Framework (EF).</p>

<p>This arrangement is typical for many Breeze applications and, although far from necessary, it is the arrangement we&rsquo;re describing in &ldquo;Basic Breeze&rdquo;.</p>

<p>We&rsquo;ve already defined the EF code first model that supports our <a href="/samples/doccode">DocCode </a>sample tests. We&rsquo;ll need an Entity Framework <em>DbContext</em> to configure and access that model.</p>

<p>We&rsquo;re <em>using</em> Entity Framework, not <em>teaching</em> it, so we&rsquo;ll simply show you our <em>NorthwindDbContext</em> (located in the <em>Models</em> folder) and highlight the key points.</p>

<div>
<pre class="brush:jscript;">
public class NorthwindContext : DbContext
{
    private const string _contextName = &quot;NorthwindContext&quot;;
    public static string ContextName { get { return _contextName; } }
    public NorthwindContext() : base(ContextName )
    {
        Configuration.ProxyCreationEnabled = false;
        Configuration.LazyLoadingEnabled = false;
    }

    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
        // Table names match singular entity names by default (don&#39;t pluralize)
        modelBuilder.Conventions.Remove&lt;PluralizingTableNameConvention&gt;();

        modelBuilder.Configurations.Add(new CustomerConfiguration());
        modelBuilder.Configurations.Add(new OrderDetailConfiguration());
        modelBuilder.Configurations.Add(new PreviousEmployeeConfiguration());
    }

    // DbSets begin here</pre>
</div>

<p>The&nbsp; <span class="codeword">NortwindContext</span> constructor calls the base class constructor overload that takes a &ldquo;context name&rdquo;; the context name serves also as a key to the &nbsp;database connection string located in the <em>Web.config</em>. We&rsquo;ll make that name publically accessible; we&rsquo;ll need it later.</p>

<p>The next two lines of configuration are important. EF should only get data from the database when told to do so explicitly. We don&rsquo;t want EF to accidentally lazy load navigation properties such as <span class="codeword">Customer.Orders</span>. To ensure that doesn&rsquo;t happen, we disable both ProxyCreation and LazyLoading.</p>

<p>Next, we override the <span class="codeword">OnModelCreating</span> method and use EF&rsquo;s fluent API to configure the mapping between our classes and the database.</p>

<p>By convention, EF will assume that our singular entity names should be mapped to plural table names. That&rsquo;s not how the Northwind database is set up. The table backing the Customer entity should be called &ldquo;Customer&rdquo; (singular), not &ldquo;Customers&rdquo; (plural). So we immediately remove EF&rsquo;s &ldquo;pluralizing&rdquo; convention.</p>

<p>Several entity-specific configurations follow. These configurations could have been written inline but we follow the tidier practice of encapsulating each entity&rsquo;s configuration in a dedicated class. Feel free to examine these configuration classes on your own; while necessary to get the model mapping right, they are otherwise of no interest to Breeze.</p>

<p><em>DbSet</em> properties occupy the remainder of the class. Each <em>DbSet</em> property identifies an entity class to be managed by the <em>NorthwindContext</em> and coincidentally makes it a little easier for the developer to express query and save operations in terms of the entities involved.&nbsp;</p>

<div>
<p>&nbsp;&nbsp;</p>

<pre class="brush:jscript;">
public DbSet&lt;Category&gt; Categories { get; set; }
public DbSet&lt;Customer&gt; Customers { get; set; }
public DbSet&lt;Employee&gt; Employees { get; set; }
public DbSet&lt;EmployeeTerritory&gt; EmployeeTerritories { get; set; }
public DbSet&lt;Order&gt; Orders { get; set; }
public DbSet&lt;OrderDetail&gt; OrderDetails { get; set; }
public DbSet&lt;PreviousEmployee&gt; PreviousEmployees { get; set; }
public DbSet&lt;Product&gt; Products { get; set; }
public DbSet&lt;Region&gt; Regions { get; set; }
public DbSet&lt;Role&gt; Roles { get; set; }
public DbSet&lt;Supplier&gt; Suppliers { get; set; }
public DbSet&lt;Territory&gt; Territories { get; set; }
public DbSet&lt;User&gt; Users { get; set; }
public DbSet&lt;UserRole&gt; UserRoles { get; set; }
public DbSet&lt;InternationalOrder&gt; InternationalOrders { get; set; }
</pre>
</div>

<h2>Multiple assemblies and namespaces</h2>

<p>Our samples tend to combine the entity model classes, Entity Framework components, MVC, and scripts all in one big project. We wouldn&#39;t do that in a real application. We&#39;d have separate assemblies for the major concerns. We might keep our entity models in a <em>Models </em>assembly (with namespace <em>Todo.Models</em>) and put our <span class="codeword">DbContext</span> in a <em>Data </em>assembly (with namespace <em>Todo.Data</em>). That&#39;s not a problem for the Breeze server-side components which will find them both.</p>

<p>That&#39;s not a problem for BreezeJS clients either; as of Breeze v.0.83.3, the namespace of Model classes can be different from the namespace of the <em><span class="codeword">DbContext</span></em> (or <em><span class="codeword">ObjectContext</span></em>).</p>

<h2>Next Step</h2>

<p>That&rsquo;s just about our last word on Entity Framework. Time to move on to the <a href="/documentation/web-api-controller">Web API controller.</a></p>

<h3>Appendix: EF Versions</h3>

<p>There are many Entity Framework versions floating about. We had to target one of them when we built our <em>Breeze.WebApi.dll</em> which you just added to the project. <em>Breeze.WebApi.dll</em> was built with Entity Framework version 4.4 for .NET 4.0. Your application may use a different .NET 4.0 version or perhaps your application is built for .NET 4.5 and EF version 5.0.&nbsp; It there&#39;s a mismatch, you could get a runtime exception such as:</p>

<p style="margin-left:.5in;">Could not load file or assembly &#39;EntityFramework, Version=4.3.1.0, Culture=neutral, PublicKeyToken=b77a5c561934e089&#39; or one of its dependencies. The located assembly&#39;s manifest definition does not match the assembly reference. (Exception from HRESULT: 0x80131040)</p>

<p>In many cases you can add an <a href="http://msdn.microsoft.com/en-us/library/2fc472t2%28v=vs.110%29.aspx" target="_blank">assembly redirect</a> to the <em>Web.config</em> that points to the version you&#39;re using.</p>

<ul>
	<li>Open Web.config</li>
	<li>Find the &lt;runtime&gt; tag</li>
	<li>insert something like</li>
</ul>

<div style="margin-left:.25in;">
<pre class="brush:xml;">
&lt;dependentAssembly&gt;
    &lt;assemblyIdentity name=&quot;EntityFramework&quot; publicKeyToken=&quot;b77a5c561934e089&quot; culture=&quot;neutral&quot; /&gt;
    &lt;bindingRedirect oldVersion=&quot;4.0.0.0-5.0.0.0&quot; newVersion=&quot;5.0.0.0&quot; /&gt;
&lt;/dependentAssembly&gt;</pre>
</div>

<p>In this example, we&#39;re redirecting to version 5.0.0.0.</p>

<p>As a last resort, you can download the source code for the <em>Breeze.WebApi</em> project, adjust its platform and Entity Framework references, and compile your own version.</p>
