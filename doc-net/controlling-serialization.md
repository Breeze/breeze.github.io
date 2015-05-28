---
layout: doc-net
redirect_from: "/old/documentation/controlling-serialization.html"
---
#Controlling Serialization

If you're serving data with Breeze-flavored ASP.NET Web API controllers, you're using the Newtonsoft.Json .NET library to serialize and de-serialize data. 

All Web API controllers use this library. The native Web API configures it one way. Breeze configures it a little differently.

It's important that you stick with the Breeze settings rather than the native ones. For example **do not use Json.Net's camel casing**! Breeze needs to handle casing on the client-side with its own [`NamingConvention.camelCase`](/doc-js/server-namingconvention). You'll mess things up badly if you set Json.Net's camel casing too.

##Custom serialization

You do have some latitude to change some of the Json.Net settings. Be careful and test the results before deploying.

You can probably change *any* of the settings if you know what you're doing and are willing - in the extreme case - to closely manage how the client serializes and deserializes server data with a custom `JsonResultsAdapter` and custom `DataServiceAdapter`. 

Just because you *can* doesn't mean you *should*. Only a few developers have ever needed to change these settings.

##Creating a custom configuration

If you must change a serialization setting, here's how to do it automatically.

Write a custom class that derives from `Breeze.ContextProvider.BreezeConfig`. Drop it somewhere in your Web API project. Breeze discovers it automatically and uses your version in place of its own.

Here's an example that overrides the `CreateJsonSerializerSettings` method:

    using Newtonsoft.Json;

    /// <summary>
    /// Overrides the JsonSerializerSettings so that the Json.Net serializer
    /// uses UTC date time zone handling.
    /// </summary>
    public class CustomBreezeConfig : Breeze.ContextProvider.BreezeConfig {

        protected override JsonSerializerSettings CreateJsonSerializerSettings() {
              var baseSettings = base.CreateJsonSerializerSettings();
              baseSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
              return baseSettings;
        }
    }

You could put this *CustomBreezeConfig.cs* file in the *Controllers* folder of your Web API project and Breeze will find it automatically. 

>You can deploy only one custom BreezeConfig class.

>Although `JsonSerializerSettings ` is the only virtual method you can override at this time, `BreezeConfig` is intended to be the locus of future extension points of this kind.

##Use Case: replace the nasty serialized dynamic type names

You may have seen the awful type names that Json.Net emits when it serializes the query results of a projection query (a query with a "select" clause). 

Here's an excerpt from the JSON returned by the "SessionsBrief" query in John Papa's "Code Camper Jumpstart" app:

     "$type":"_IB_DGU56or_prSk3yzZB87I8gCBWABk[[System.Int32, mscorlib],[System.String, mscorlib],
     [System.String, mscorlib],[System.Int32, mscorlib],[System.Int32, mscorlib],[System.Int32, mscorlib],
     [System.Int32, mscorlib],[System.String, mscorlib],[System.String, mscorlib]], 
     _IB_DGU56or_prSk3yzZB87I8gCBWABk_IdeaBlade"

Breeze uses the `$type` property to map the JSON data to the corresponding `EntityType` defined in a `MetadataStore`.

If the query result contained entity data for complete `Session` entities, the `$type` would be something sensible like "CC.Model.Session, CC.Model". Breeze *will* find an `EntityType` definition with *that name* in the manager's `metadataStore`.

But a projection query doesn't return whole entities. It usually returns objects with a subset of the entity properties. The CLR type for these objects is a dynamic type with a wacky name like the one shown above Obviously this wacky type name is *not* registered in metadata.

In our opinion, you shouldn't care about this ugly name. It's perfectly harmless.  

As a Breeze developer you'll never see it. You won't find a `$type` property on any entity or JavaScript object returned by a Breeze query. You don't have to worry about payload size either. It looks gigantic when displayed - and you'll see this  monstrosity repeated over and over. But your server and browser should be gzipping the payload;  this bad boy will zip down to irrelevance.

###"Dynamic Type Renaming" to the rescue

Nonetheless, many developers have complained about it. They're worried that external customers of the API will fear it ... and perhaps hate the entire API for no better reason than the evidence of its .NET pedigree in the inner type names (e.g., "System.String, mscorlib").

Fortunately, there's a Breeze Lab called **"Breeze Dynamic Type Renaming"**. Search for the **nuget package** with that name and install it in your Web API project.

You'll discover two new files in the *Controllers* folder. One of them is `CustomBreezeConfig.cs`. It defines a class that derives from `Breeze.ContextProvider.BreezeConfig` much like the one we discussed above.

This version assigns the Json.Net  `JsonSerializerSettings` to a singleton instance of  a`DynamicTypeRenamingSerializationBinder`, defined in the second file. That singleton changes the way Json.Net generates the `$type` name for the JSON data sent to the client in response to a projection query.

Run the app again after you install the nuget package and re-build the server. Look at the projection payload again. You should see:

     "$type":"_IB_DGU56or_prSk3yzZB87I8gCBWABk, Dynamic"

Much better, right? It's ugly but not too long and you can safely infer that this type is not a registered `EntityType`.

See this nuget package and its contents in action in [the "DocCode" sample](/doc-samples/doccode).

>Remember that this is a Breeze Lab and not part of the core Breeze product. We're confident that it's good and has no adverse side-effects. But it is offered "as is" with no promise of support and we could take it away in future if we discover a better way to handle the problem.