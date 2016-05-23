---
layout: doc-net
redirect_from: "/old/documentation/odata-server.html"
---
# **OData Services**

A Breeze client can consume any <a href="http://www.odata.org/" target="_blank">standard OData</a> feed "as is" when you configure the client for OData.

Topics elsewhere cover configuring for [OData BreezeJS Clients](/doc-js/server-odata) and for [OData Breeze Sharp clients](/doc-cs/odata).

OData is a cross-platform standard (with several versions). Unfortunately, not every OData service fully complies with the standard. The deviations from the metadata specifications can easily trip you up.

If you have no control over the server, you may have to abandon the server's *$metadata* feed and construct the `MetadataStore` on the client ... as described in the [BreezeJS documentation](/doc-js/metadata "Metadata documentation") and the [Breeze Sharp Documentation](/doc-cs/metadata).

If you do control the server you *may* be able to make adjustments on the server that improve the situation for the Breeze client. In this topic we explore your options on some well known OData server stacks.

# WCF Data Services (WCF OData)

This is Microsoft's original OData implementation. It is the most compliant implementation and Breeze clients should have no trouble with the metadata it generates.

However, Microsoft seem to have <a href="http://blogs.msdn.com/b/odatateam/archive/2014/03/27/future-direction-of-wcf-data-services.aspx" target="_blank" title="Mike Pizzo discusses MS OData roadmap">redirected their energies toward development of **ASP.NET Web API OData**</a> and away from **WCF Data Services**. The future of WCF Data Services is anyone's guess.

# ASP.NET Web API OData Service

**Web API OData** is both the present and future of OData services from Microsoft.

This is an evolving platform with numerous peculiarities. It has yet to fully comply with the OData standards. There are worrisome implementation decisions that will affect your application design. Read on and proceed with caution.

>We highly recommend Brian Noyes' <a href="http://briannoyes.net/consuming-an-asp-net-web-api-odata-service-with-breeze/" target="_blank">brilliant **blog post with step-by-step instructions** for building a Breeze/Web API OData sample</a> which includes a downloadable sample.  We also recommend his Pluralsight course "<a href="http://pluralsight.com/training/courses/TableOfContents?courseName=aspnetwebapi-odata" target="_blank">**Building ASP.NET Web API OData module, "Consuming OData Services..." module**</a> that demonstrates consuming a Web API OData service with a Breeze client.

## Web API OData v.3 or v.4

The <a href="http://www.odata.org/documentation/" target="_blank">OData spec</a> is continuously evolving. The v.4 is the most recent version.

The Microsoft OData team began publishing a **v.4 version** of their Web API platform in May 2014 and are applying all of their current energies to v.4. The primary nuget package is titled "Microsoft ASP.NET Web API 2.2 for OData v4.0" ; the package name is <a href="https://www.nuget.org/packages/Microsoft.AspNet.OData/" target="_blank">Microsoft.AspNet.OData</a>,

The **v.3 version** of the platform is still available. It is titled "Microsoft ASP.NET Web API 2.2 for OData v1-3" and the package name is <a href="https://www.nuget.org/packages/Microsoft.AspNet.WebApi.OData/" target="_blank">Microsoft.AspNet.WebApi.OData</a>.

>Did you notice the difference between package names,   "Microsoft.AspNet.WebApi.OData" (v3) and "Microsoft.AspNet.OData" (v4)?  They've dropped the "WebApi" from v.4.
>
>Both packages have release versions that begin "5.x". They have identical release numbers through "5.5.1"!

These are very different implementations despite the similarity of their package names and release numbers.

Breeze intends to support both of them, albeit with different client-side **DataServiceAdapters** (see the [discussion here](http://breeze.github.io/doc-js/server-odata.html)).

Unfortunately, **Breeze does not yet support Web API OData v.4**. There are many breaking changes and other issues that have delayed Breeze support. We're working through them with the OData team.

## Web API OData v.3

The following discussion in this section concerns Web API OData v.3 only.

### No transactional save

A "$batch" save to a WCF OData service backed by an Entity Framework model is a transactional save. That means every entity in the change-set either saves successfully or none of them do.

A "$batch" save to a Web API OData service is non-transactional *out-of-the-box* no matter what mechanism you use for a backing store. That means some entity operations in the batch could be saved even if others are rejected. You have to deal with the consequences.

For the record, this is a violation of the [OData $batch spec](http://www.odata.org/documentation/odata-version-2-0/batch-processing/):

>All operations in a ChangeSet represent a single change unit so the server must successfully process and apply all the requests in the ChangeSet or else apply none of the requests in the ChangeSet.  It is up to the service to define rollback semantics to undo any requests within a ChangeSet that may have been applied before another request in that same ChangeSet failed and thereby honor this all-or-nothing requirement.

For what it's worth, the BreezeJS WebAPIOData adapter returns information that reveals which entity changes were saved and which failed.

### Save order is not guaranteed

When you "$batch" save to a WCF OData service backed by an Entity Framework model, EF takes care of ordering the operations properly. For example, if you create a new Order and a new OrderDetail, EF ensures that the parent Order is inserted first before its child OrderDetail.

In a "$batch" save to a Web API OData service *the order of save is not guaranteed* and there is nothing you can do on the client to ensure that the service will save the entity changes in the correct order. 

Even if your batch specifies the new Order before the new OrderDetail in separate ChangeSets, the Web API service might try to save the OrderDetail first. This could (and probably will) fail the database referential integrity check, causing the OrderDetail save to fail.

For the record, this is a violation of the [OData $batch spec](http://www.odata.org/documentation/odata-version-2-0/batch-processing/):

>The order of ChangeSets and retrieve requests within a Batch request is significant as it states the order in which the service processes the components of the Batch.

It is up to you to ensure that no $batch save has the potential to trigger a referential integrity violation, most likely by chaining separate `saveChanges()` for changes that must be processed in a particular order.

### Metadata fail!

Microsoft's instructions for creating a Web API OData controller tell you to describe your API data model with the `ODataConventionModelBuilder`. This component is responsible for generating metadata from the model.

Unfortunately, **it does NOT produce fully compliant metadata**. Most egregiously, it omits foreign key information a Breeze client needs to maintain navigation properties. It also doesn't handle namespaces properly. 

>Microsoft has promised to repair the deficiencies but has not done so yet and has no timetable for doing so. After almost a year of waiting we have grown pessimistic.

You won't have relationship support on the Breeze client if you use `ODataConventionModelBuilder` to describe your model. You won't be able to use "$expand" to include related entities in the query results. You won't be able to navigate among related entities. Breeze won't maintain the navigation properties. 

Why? Because the metadata it generates don't identify the foreign key properties Breeze needs to wire up the relationships.

>As yet there is no officially endorsed way to repair the navigation metadata on the client. We cannot stop you from monkey patching the MetadataStore with the missing Foreign Key property information.

<a name="edmBuilder"></a>

### EdmBuilder workaround

There is an approved workaround if your OData service is backed by the Entity Framework. You can **use the Breeze Labs `EdmBuilder`** to produced the metadata instead of the Web API's own `ODataConventionModelBuilder`. The ["Web API OData and Breeze" sample](/doc-samples/web-api-odata#BuildEDM "Web API OData and Breeze sample") explains why this is necessary and how to wire up the `EdmBuilder`.

We summarize here:

1. Get "EdmBuilder.cs"  [from nuget](https://www.nuget.org/packages/Breeze.EdmBuilder/ "EdmBuilder.cs on nuget") with the command `Install-Package Breeze.EdmBuilder`. You can also [download it from github](https://github.com/IdeaBlade/Breeze/blob/master/Breeze.Client/Scripts/Labs/EdmBuilder.cs "EdmBuilder.cs on github").  Put it in your Web API "App_Start" folder.

1. Adjust your *WebApiConfig.cs* accordingly:

        config.Routes.MapODataRoute(
            routeName: "odata",
            routePrefix: "odata",
            model: EdmBuilder.GetEdm<MyDbContext>(),
            batchHandler: new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer)
        );

### Correcting the namespace for EdmBuilder

**Beware of model classes with a different namespace!**

Many folks put their model classes in one namespace and put their `DbContext` or EDMX in a *different* namespace. 

Unfortunately the EDM generator ignores the model namespace. In effect, it "relocates" the model classes (for its purposes) to the `DbContext` namespace (or the EDMX namespace if you're generating from an EDMX). The `ODataConventionBuilder` has the same problem.

For example, if a "code first" `DbContext` namespace is "EF" and the model namespace is "Models", the Microsoft generated metadata describe the `Customer` class as an "**EF.**Customer" even though the Web API controller methods (properly) refer to that entity as "**Models.**Customer". 

This mistake creates confusion on both server and client. The OData server is confused about the actual entity class types so it rejects client requests for data with the response: **`406 - Not Acceptable`**. 

>That's not a helpful message is it. Oh well ...

When the Breeze client reads the metadata, it's told to expect the "**EF**.Customer" entity type. But the JSON query results are typed as "**Models**.Customer". Breeze can't find that type and assumes that you haven't fetched metadata at all. It reports: "*Unable to locate a 'Type' by the name: 'Customer:#EF'. Be sure to execute a query or call fetchMetadata first.*". That's technically correct ... but not the actual cause of the problem.

We can suggest a server-side workaround, depending on how you constructed your `DbContext`.

#### Code First `DbContext` workaround

Tell the `EdmBuilder` to generate metadata from a *derived* `DbContext` that you've located in the *same namespace as the model classes*. Let's try it.

First we write a derived `DbContext` (we'll call it `MyDbContextForEdm`) in the "Models" namespace. We could put this class in any file. Let's put it in the *WebApiConfig.cs* because **that's the only place we'll ever need it**.

    // WebApiConfig.cs
    namespace Models {
        internal class MyDbContextForEdm : MyApp.EF.MyDbContext {}
    }

Notice that *it has no implementation*. Its sole purpose is to relocate `MyDbContext` to the "Models" namespace. We can ignore it once it has helped with EDM generation.

Now we reference it in place of the base `MyDbContext`.

    // WebApiConfig.cs
    ...
    namespace MyApp {

        public static void Register(HttpConfiguration config) {
            ... 
            config.Routes.MapODataRoute(
                routeName: "odata",
                routePrefix: "odata",
                model: EdmBuilder.GetEdm<MyApp.Models.MyDbContextForEdm>(),
                batchHandler: new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer)
            );
            ...
        }
        ...
    }

Did you see the change?

`model: EdmBuilder.GetEdm<`**MyApp.Models.MyDbContextForEdm**`>(),`

#### EDMX-based `DbContext` workaround

If you maintain your EF model "Database First" with an EDMX, you need a different workaround because the `EdmBuilder` acquires the namespace **from the EDMX** rather than the `DbContext` (whose namespace can by something else entirely).

Therefore you have to correct the EDMX namespace to match the model entity namespace. You can do that through the EDMX designer:

* Open the EDMX in the designer (double-click it)
* Open the "Properties" for the entire model
* Change the "Namespace" property to the model entity namespace.

Here's that property sheet:

![EDMX property editor](/images/EDMXnamespace.png)

>The EDMX namespace does not appear to play a practical role in an existing EF application. For example, changing it does not affect the namespaces of the corresponding entity classes.

#### Correcting the namespace for ODataConventionModelBuilder

What if you don't care about related entities? 

You can use the `ODataConventionModelBuilder` if your model lacks entity relationships or your Breeze client application won't need them.

Once again, **beware of model classes with a different namespace!** The `ODataConventionModelBuilder` assumes that the model classes have the same namespace as your API controller. So when it generates metadata, **it ignores the model classes' own namespace and specifies the controller's namespace instead**. 

The solution is to tell the `ODataConventionModelBuilder` to generate metadata for classes in the model's namespace, not the controller's namespace.  Put code like this in your *WebApiConfig.cs* (located in the *App_Start* folder).

    public static IEdmModel GetEdmModel()
    {
        ODataModelBuilder builder = new ODataConventionModelBuilder();
        builder.EntitySet<customer>('Customers');
        builder.Namespace = "Models";  // DON'T FORGET THIS!
        return builder.GetEdmModel();
    }

    public static void Register(HttpConfiguration config)
    {
        ...
        config.Routes.MapODataRoute(
                routeName: "odata", 
                routePrefix: "odata",
                model: GetEdmModel(), 
                batchHandler: new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer)
                );
        ...
    }

#### What about multiple model namespaces?

As far as we know, Web API OData cannot handle model classes located in multiple namespaces. We have no workaround for you at this time.

## Is Web API OData right for you?

We've describe here some of the real-world challenges of Web API OData development. We discuss more of them in "[OData vs. Web API](/doc-net/odata-vs-webapi)". These are pretty serious obstacles for many applications.

Should you build a Breeze Web API service, a Conventional Web API service, or an OData Web API service? Here's how we see it. 

First things first! A Breeze ***client*** can talk to any HTTP service you choose including any flavor of Web API: Breeze, Conventional, or OData.

A Breeze Web API server gives you the best combination of productivity, flexibility, power, and safety. There are no metadata namespace issues, no fundamental obstacles to transactions or your control over save order. The Breeze Web API server handles these for you when used with Entity Framework or NHIbernate.

You have the most flexibility when you write a Conventional Web API (no Breeze on the server) but you'll spend more time and money developing and maintaining that service.

On the downside, either the Breeze or conventional Web API path leads to an idiosyncratic API. That may not be the best approach if you need a public API.  The Breeze API is "standard" for Breeze clients only; a custom Web API implementation is not standard at all.

The OData Web API solution yields an *out-of-the-box* OData API which is a public, widely recognized standard. That's a tempting choice if you need an open API with the widest reach.

On the other hand, it *may* be very difficult ... or effectively impossible ... to save changes properly with the OData Web API implementation as it exists today. That may not matter if your public API is read-only. But if clients can save data through the public API, we urge you to think carefully about your needs and proceed with caution.

### How do I choose?
Pick the server that's best for you. As we said, a Breeze client application communicates equally well with all of them.

Perhaps you can take a hybrid approach: a Breeze Web API server for "internal" clients accompanied by a more restrictive OData Web API server for "public" clients. *You won't have to write the server twice*. Rather you wrap the same core server logic in two separate lightweight controller sets - one Breeze controller and one small, focused set of OData controllers. Each controller is a dispatcher, delegating real work to the core server logic in common. Each controller exposes the API that is appropriate for its target audience.

Contact <a href="mailto:breeze@ideablade.com?subject=Hybrid OData solutions" title="Contact the Breeze team">breeze@ideablade.com</a> to learn more about this option.

# SharePoint OData

SharePoint 2010 and 2013 offer "OData REST APIs". They only partially comply with the OData spec and none of them return metadata that a Breeze client can consume.

Even if SP did produce "correct metadata", we rather doubt that you'd want it; a trivial data model produces almost 750Mb of metadata, most of it of no interest to the client application developer.

Your only recourse at this time is to define the metadata you need on the client. Learn more by starting with our [SharePoint 2013 Sample](/doc-samples/intro-to-spa-sharepoint "SharePoint 2013 Sample documentation").
