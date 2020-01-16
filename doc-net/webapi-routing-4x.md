---
layout: doc-net
redirect_from: "/old/documentation/web-api-routing.html"
redirect_from: "/doc-net/webapi-routing.html"
---
# Web API Routing

**NOTE: This page is for Breeze running on .NET 4.x**

[Go here for .NET Core version](/doc-net/webapi-controller-core)

We've built a Breeze controller that Web API will discover automatically. Now we must teach the Web API to route Breeze client requests to this controller and configure the Web API to use the controller properly.

# Web API routes

The Web API redirects incoming HTTP requests to the appropriate controllers based on routing information. Many applications are satisfied with the Web API's out-of-the-box, convention-based routing patterns and a small amount of configuration.

A typical ASP.NET server would have a *Global.asax* file with an *Application_Start method that registered Web API routes as follows:

	protected void Application_Start()
	{
		...

		WebApiConfig.Register(GlobalConfiguration.Configuration);
		...
	}


The Web API nuget package generates a *WebApiConfig class in the *App_Start* folder; here's its default *RegisterRoutes method:

	public static void Register(HttpConfiguration config)
	{
	 config.Routes.MapHttpRoute(
	 name: "DefaultApi",
	 routeTemplate: "api/{controller}/{id}",
	 defaults: new { id = RouteParameter.Optional }
	 );
	}

The default routing scheme expressed above is intended for REST-ish requests in the form "controller/id" where the "id" parameter is optional. It's ready for requests such as

	GET http://my.site.com/api/cats
	GET http://my.site.com/api/dogs/42
	DELETE http://my.site.com/api/goats/3

The "cats", "dogs", and "goats" path segments identify separate controllers: *CatsController*, *DogsController*, and *GoatsController*. The first request seeks all cats. The second would get the dog with id=42. The third would delete the goat with id=3.

###	Breeze Web API route

The default routing scheme won't work for Breeze Web API controllers. Breeze controllers expect requests in "controller/<strong>action</strong>" form where the "action" is a method name and is always required, never optional.

Typical Breeze requests look like:

	GET http://my.site.com/breeze/Pets/Cats
	GET http://my.site.com/breeze/Pets/Dogs/$filter=id eq 42
	POST http://my.site.com/breeze/Pets/SaveChanges

Notice that the last path segment (before the optional query string) is a word. The words "Cats", "Dogs", and "SaveChanges" map to like-named action methods on the *PetsController.* The first queries for all cats. The second queries for Dogs with id=42, using the OData query syntax, and the third POSTs a change-set which could include the deleted goat with id=3.

Notice that the controller name in all three examples is "Pets". In general, a Breeze application has only one Web API controller, the *PetsController *in this example.

###	Make Breeze controller routes distinct

In the Breeze routes above, the path prefix is 'breeze' instead of the usual default prefix, 'api' . That change helps distinguish Breeze routes, which require an "action" routing specification, from the "REST"-like syntax of the default Web API route. Compare these two templates to see why that is important:

	routeTemplate: "api/{controller}/{id}"     // Web API default template
	routeTemplate: "api/{controller}/{action}" // Breeze template

Which template will the Web API pick when it sees the following request?

	~api/someController/xxx

Does "*xxx*" map to an *action *method of a Breeze controller or the *id *parameter of a GET method in a standard Web API controller? There is no way to tell!

In practice, the Web API picsk the first route with a matching template. The route registered first wins.You can avoid the "race to be first" by replacing the default 'api' prefix with something unique such as 'breeze'.

Here's a suitable Breeze controller route specification:

		GlobalConfiguration.Configuration.Routes.MapHttpRoute(
			  name: "BreezeApi",
			  routeTemplate: "breeze/{controller}/{action}"
		);

>Note: some earlier examples and documentation still use the 'api' prefix which can conflict with other Web API routes. We encourage you to update your code to use a distinct prefix word such as 'breeze' or a word of your own choosing. Remember also to update the "serviceName" that you use to initialize your *EntityManager*.

## Registering the Breeze route

Three problems remain:

1.  Registering the Breeze controller route
1.  Ensuring that a Breeze Web API route doesn't conflict with default Web API routes
1.  Solving #1 and #2 with an safe, automated solution.


*#*3 isn't your concern but it is one that we worry about. We're trying to automate the Breeze installation process as much as possible without compromising an existing app. We don't want to overwrite *anything *in your application, including your custom route definitions in *WebApiConfig.cs*. Our automation shouldn't touch the *Global.asax* either ... assuming the project has one ... which it need not!

The [Breeze "MVC4 Web Api" NuGet package](nuget-packages.html) solves all three problems. It doesn't touch any existing project files. It installs a new configuration file, *BreezeWebApiConfig*, in *App_Start*. The Microsoft <a href="http://blogs.msdn.com/b/davidebb/archive/2010/10/11/light-up-your-nupacks-with-startup-code-and-webactivator.aspx" target="_blank">WebActivator.PreApplicationStartMethod</a> assembly attribute puts the *BreezeWebApiConfig* startup method *at the front* of the server launch sequence where it can register the Breeze route before routes registered by a *Global.asax*. It uses the word "breeze" as the prefix so as not to conflict with the default prefix, "api". And finally, the use of Web Activator means that a Breeze Web API server doesn't have to have a *Global.asax* at all.

Here's the gist of the code:

	[assembly: WebActivator.PreApplicationStartMethod(
		typeof(BreezeWebApiConfig), "RegisterBreezePreStart")]
	namespace Todo.App_Start {

	  public static class BreezeWebApiConfig {

		public static void RegisterBreezePreStart() {

		  GlobalConfiguration.Configuration.Routes.MapHttpRoute(
			  name: "BreezeApi",
			  routeTemplate: "breeze/{controller}/{action}" 
		  );
		}
	  }
	}


