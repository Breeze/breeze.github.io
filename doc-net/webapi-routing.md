---
layout: doc-net
---
<h1>
	Web API Routing</h1>
<p>We&rsquo;ve built a Breeze controller that Web API will discover automatically. Now we must teach the Web API to route Breeze client requests to this controller and configure the Web API to use the controller properly.</p>
<h2>
	Web API routes</h2>
<p>The Web API redirects incoming HTTP requests to the appropriate controllers based on routing information. Many applications are satisfied with the Web API&#39;s out-of-the-box, convention-based routing patterns and a small amount of configuration.</p>
<p>A typical ASP.NET server would have a <em>Global.asax</em> file with an <span class="codeword">Application_Start</span> method that registered Web API routes as follows:</p>
<pre class="brush:csharp;">
protected void Application_Start()
{
    ...

    WebApiConfig.Register(GlobalConfiguration.Configuration);
    ...
}
</pre>
<p>The Web API nuget package generates a <span class="codeword">WebApiConfig</span> class in the <em>App_Start</em> folder; here&#39;s its default <span class="codeword">RegisterRoutes</span> method:</p>
<pre class="brush:csharp;">
public static void Register(HttpConfiguration config)
{
&nbsp;&nbsp;&nbsp; config.Routes.MapHttpRoute(
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; name: &quot;DefaultApi&quot;,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; routeTemplate: &quot;api/{controller}/{id}&quot;,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; defaults: new { id = RouteParameter.Optional }
&nbsp;&nbsp;&nbsp; );
}</pre>
<p>The default routing scheme expressed above is intended for REST-ish requests in the form &quot;controller/id&quot; where the &quot;id&quot; parameter is optional. It&#39;s ready for requests such as</p>
<pre class="brush:xml;">
GET http://my.site.com/api/cats
GET http://my.site.com/api/dogs/42
DELETE http://my.site.com/api/goats/3</pre>
<p>The &quot;cats&quot;, &quot;dogs&quot;, and &quot;goats&quot; path segments identify separate controllers: <em>CatsController</em>, <em>DogsController</em>, and <em>GoatsController</em>. The first request seeks all cats. The second would get the dog with id=42. The third would delete the goat with id=3.</p>
<h3>
	Breeze Web API route</h3>
<p>The default routing scheme won&#39;t work for Breeze Web API controllers. Breeze controllers expect requests in &quot;controller/<strong>action</strong>&quot; form where the &quot;action&quot; is a method name and is always required, never optional.</p>
<p>Typical Breeze requests look like:</p>
<pre class="brush:xml;">
GET http://my.site.com/breeze/Pets/Cats
GET http://my.site.com/breeze/Pets/Dogs/$filter=id eq 42
POST http://my.site.com/breeze/Pets/SaveChanges</pre>
<p>Notice that the last path segment (before the optional query string) is a word. The words &quot;Cats&quot;, &quot;Dogs&quot;, and &quot;SaveChanges&quot; map to like-named action methods on the <em>PetsController.</em> The first queries for all cats. The second queries for Dogs with id=42, using the OData query syntax, and the third POSTs a change-set which could include the deleted goat with id=3.</p>
<p>Notice that the controller name in all three examples is &quot;Pets&quot;. In general, a Breeze application has only one Web API controller, the <em>PetsController </em>in this example.</p>
<h3>
	Make Breeze controller routes distinct</h3>
<p>In the Breeze routes above, the path prefix is &#39;breeze&#39; instead of the usual default prefix, &#39;api&#39; . That change helps distinguish Breeze routes, which require an &quot;action&quot; routing specification, from the &quot;REST&quot;-like syntax of the default Web API route. Compare these two templates to see why that is important:</p>
<pre class="brush:jscript;">
routeTemplate: &quot;api/{controller}/{id}&quot;     // Web API default template
routeTemplate: &quot;api/{controller}/{action}&quot; // Breeze template</pre>
<p>Which template will the Web API pick when it sees the following request?</p>
<pre class="brush:jscript;">
~api/someController/xxx</pre>
<p>Does &quot;<em>xxx</em>&quot; map to an <em>action </em>method of a Breeze controller or the <em>id </em>parameter of a GET method in a standard Web API controller? There is no way to tell!</p>
<p>In practice, the Web API picsk the first route with a matching template. The route registered first wins.You can avoid the &quot;race to be first&quot; by replacing the default &#39;api&#39; prefix with something unique such as &#39;breeze&#39;.</p>
<p>Here&#39;s a suitable Breeze controller route specification:</p>
<pre class="brush:csharp;">
    GlobalConfiguration.Configuration.Routes.MapHttpRoute(
          name: &quot;BreezeApi&quot;,
          routeTemplate: &quot;breeze/{controller}/{action}&quot;
    );</pre>
<p class="note">Note: some earlier examples and documentation still use the &#39;api&#39; prefix which can conflict with other Web API routes. We encourage you to update your code to use a distinct prefix word such as &#39;breeze&#39; or a word of your own choosing. Remember also to update the &quot;serviceName&quot; that you use to initialize your <span class="codeword">EntityManager</span>.</p>
<h2>
	Registering the Breeze route</h2>
<p>Three problems remain:</p>
<ol>
	<li>
		Registering the Breeze controller route</li>
	<li>
		Ensuring that a Breeze Web API route doesn&#39;t conflict with default Web API routes</li>
	<li>
		Solving #1 and #2 with an safe, automated solution.</li>
</ol>
<p>#3 isn&#39;t your concern but it is one that we worry about. We&#39;re trying to automate the Breeze installation process as much as possible without compromising an existing app. We don&#39;t want to overwrite <em>anything </em>in your application, including your custom route definitions in <em>WebApiConfig.cs</em>.&nbsp; Our automation shouldn&#39;t touch the <em>Global.asax</em> either ... assuming the project has one ... which it need not!</p>
<p>The <a href="http://documentation/start-nuget" target="_blank">Breeze &quot;MVC4 Web Api&quot; NuGet package</a> solves all three problems. It doesn&#39;t touch any existing project files. It installs a new configuration file, <em>BreezeWebApiConfig</em>, in <em>App_Start</em>. The Microsoft <a href="http://blogs.msdn.com/b/davidebb/archive/2010/10/11/light-up-your-nupacks-with-startup-code-and-webactivator.aspx" target="_blank">WebActivator.PreApplicationStartMethod</a> assembly attribute puts the <em>BreezeWebApiConfig </em>startup method <em>at the front</em> of the server launch sequence where it can register the Breeze route before routes registered by a <em>Global.asax</em>. It uses the word &quot;breeze&quot; as the prefix so as not to conflict with the default prefix, &quot;api&quot;. And finally, the use of Web Activator means that a Breeze Web API server doesn&#39;t have to have a <em>Global.asax</em> at all.</p>
<p>Here&#39;s the gist of the code:</p>
<pre class="brush:csharp;">
[assembly: WebActivator.PreApplicationStartMethod(
    typeof(BreezeWebApiConfig), &quot;RegisterBreezePreStart&quot;)]
namespace Todo.App_Start {

  public static class BreezeWebApiConfig {

    public static void RegisterBreezePreStart() {

      GlobalConfiguration.Configuration.Routes.MapHttpRoute(
          name: &quot;BreezeApi&quot;,
          routeTemplate: &quot;breeze/{controller}/{action}&quot; 
      );
    }
  }
}</pre>
<p>&nbsp;</p>
