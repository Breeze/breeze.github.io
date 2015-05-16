---
layout: doc-net
---
# EFContextProvider

Many application servers use an ASP.NET Web API controller to handle the client&#39;s HTTP requests. And they use the Entity Framework (EF) to model and access a SQL database. Breeze has an <strong><span class="codeword">EFContextProvider</span></strong> component to make controller interactions with EF a little easier. It&#39;s basically a wrapper around your application&#39;s <span class="codeword">ObjectContext</span> or <span class="codeword">DbContext</span> that mediates between the Breeze controller and EF. It takes care of a lot of routine plumbing.

You can use the EFContextProvider &quot;as is&quot;, right out-of-the-box when you&#39;re getting started. But you will almost certainly customize it to add your application&#39;s business logic. For example, you will want to **<a href="#SaveInterception"> intercept save requests and validate them </a>**. You may want to do something special immediately before or after the provider tells EF to save entities to the database. And you may want to dynamically control how the provider creates the EntityFramework ObjectContext or DbContext at the core of the EF operations.

This topic explores the <span class="codeword">EFContextProvider</span> in greater detail and explains how to subclass it to get the behavior you need.

## Details

Any Breeze application that will be communicating with an Entity Framework backed domain model will contain either an  <span class="codeword">ObjectContext</span>  or a  <span class="codeword">DbContext</span>  that looks something like what is shown below:


      public partial class NorthwindIBContext : System.Data.Objects.ObjectContext {
      // automatically generated code from the EDMX designer
      }

Or

<div>
<pre class="brush:csharp;">
public partial class NorthwindIBContext : System.Data.Entity.DbContext {
  // Code-First DBSet definitions and any model initialization code
}</pre>
</div>

<p>This ObjectContext or DbContext will in turn be wrapped in an <strong>EFContextProvider</strong>. The Breeze.WebApi.EFContextProvider class may be found in the Breeze.WebApi dll.&nbsp; An instance of this EFContextProvider is then used to provide services to a standard .NET MVC 4 ApiController (Sytem.Web.Http.ApiControllerApiController). This will look something like:</p>

<pre class="brush:csharp;">
public class NorthwindIBModelController : System.Web.Http.ApiController {

    readnnly EFContextProvider&lt;NorthwindIBContext&gt; ContextProvider =
         new EFContextProvider&lt;NorthwindIBContext&gt;();</pre>

<p>The remainder of the ApiController will then make use of this instance of the EFContextProvider as a helper object to provide an implementation for each of the ApiController&rsquo;s externally exposed methods.&nbsp; Again something like this:</p>

<pre class="brush:csharp;">
[BreezeController]
public class NorthwindIBModelController : System.Web.Http.ApiController {

    readonly EFContextProvider&lt;NorthwindIBContext&gt; ContextProvider =
         new EFContextProvider&lt;NorthwindIBContext&gt;();

    [HttpGet]
    public String Metadata() {
      return ContextProvider.Metadata();
    }

    [HttpPost]
    public SaveResult SaveChanges(JObject saveBundle) {
      return ContextProvider.SaveChanges(saveBundle);
    }

    [HttpGet]
    public IQueryable&lt;Customer&gt; Customers() {
      return ContextProvider.Context.Customers;
    }

    [HttpGet]
    public IQueryable&lt;Order&gt; Orders() {
      return ContextProvider.Context.Orders;
    }

    [HttpGet]
    public IQueryable&lt;Customer&gt; CustomersAndOrders() {
      return ContextProvider.Context.Customers.Include(&quot;Orders&quot;);
    }

    [HttpGet]
    public IQueryable&lt;Customer&gt; CustomersStartingWithA() {
      return  ContextProvider.Context.Customers
         .Where(c =&gt; c.CompanyName.StartsWith(&quot;A&quot;));</pre>

<p><a name="SaveInterception"></a>In many cases, however, it will be important to &ldquo;intercept&rdquo; calls to the EFContextProvider and provide additional logic to be performed at specific points in either the query or save pipeline.</p>

<p>These interception points may be accessed by subclassing the EFContextProvider and overriding specific virtual methods.&nbsp;&nbsp; This will look something like:</p>

<pre class="brush:csharp;">
public class NorthwindContextProvider: EFContextProvider&lt;NorthwindIBContext&gt;  {
    public NorthwindContextProvider() : base() { }

    protected override bool BeforeSaveEntity(EntityInfo entityInfo) {
      // return false if we don&rsquo;t want the entity saved.
      // prohibit any additions of entities of type &#39;Role&#39;
      if (entityInfo.Entity.GetType() == typeof(Role)
        &amp;&amp; entityInfo.EntityState == EntityState.Added) {
        return false;
      } else {
        return true;
      }
   }

    protected override Dictionary&lt;Type, List&lt;EntityInfo&gt;&gt; BeforeSaveEntities(Dictionary&lt;Type, List&lt;EntityInfo&gt;&gt; saveMap) {
      // return a map of those entities we want saved.
      return saveMap;
    }
  }

  [BreezeController]
  public class NorthwindIBModelController : ApiController {

    NorthwindContextProvider ContextProvider = new NorthwindContextProvider();

    // other code shown earlier with no change.
  }</pre>

<p>The current interception points for the EFContextProvider are described below.&nbsp; However, we do expect this list to grow as we receive additional feedback from all of you.&nbsp; Please feel free to contribute to our UserVoice regarding any specific extension that you think would be useful here.</p>

## Create your ObjectContext/DbContext Dynamically
The <span class="codeword">EFContextProvider</span> calls a virtual method <span class="codeword">T CreateContext()</span> when it creates your ObjectContext/DbContext of type &#39;T&#39;. The base implementation looks like this:

<pre class="brush:csharp;">
protected virtual T CreateContext() {
    return new T();
}
</pre>

<p>Override and replace that in your <span class="codeword">EFContextProvider</span> subclass and you will be able to make your context of type &#39;T&#39; just the way you like it.</p>

<p><strong>N.B.: The base <span class="codeword">EFContextProvider</span> will still do a little post-creation configuration</strong> to make sure it behaves as the EFContextProvider requires; it does not want the context doing any lazy loading or creating proxies. So if &#39;T&#39; is an <span class="codeword">ObjectContext</span>, the provider will do this:</p>

<pre class="brush:csharp;">
objCtx.ContextOptions.LazyLoadingEnabled = false;
</pre>
and if &#39;T&#39; is a <span class="codeword">DbContext</span> it will do this:

<pre class="brush:csharp;">
dbCtx.Configuration.ProxyCreationEnabled = false;
dbCtx.Configuration.LazyLoadingEnabled = false;
</pre>

## Why not IDisposable?

<p>Both the EF <span class="codeword">ObjectContext</span> and the <span class="codeword">DbContext</span> implement <span class="codeword">IDisposable</span>. In Microsoft Web API controller samples they dispose of the EF context. But the Breeze.NET <span class="codeword">EFContextProvider</span> is <strong>not disposable</strong> and makes no attempt to dispose of the EF context. Is that a mistake?</p>

<p>We think not for a couple of reasons. First, the <span class="codeword">EFContextProvider</span> should have the same lifetime as the <span class="codeword">ApiController</span> and when the API controller is &nbsp;garbage collected any EF resources should be disposed of by the finalizer. Second, Joseph Albahari, the renowned author of &quot;C# 4.0 in a Nutshell&quot;, says you don&#39;t have to:</p>

<p style="margin-left:1em;background-color:#f0f8ff;"><em>Although DataContext/ObjectContext implement IDisposable, you can (in general) get away without disposing instances. Disposing forces the context&rsquo;s connection to dispose&mdash;but this is usually unnecessary because [Link to SQL] and EF close connections automatically whenever you finish retrieving results from a query. </em>[p.352]</p>

<p>Not convinced? You have direct access to the <span class="codeword">Context</span> object; cast it to <span class="codeword">IDisposable</span> and call <span class="codeword">Dispose</span> yourself.</p>

