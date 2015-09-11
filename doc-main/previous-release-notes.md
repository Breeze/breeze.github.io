---
layout: doc-main
---

<h1>Previous release notes</h1>

<p><a href="#13x">1.3.x </a></p>

<p><a href="#12x">1.2.x </a></p>

<p><a href="#11x">1.1.x </a></p>

<p><a href="#10x">1.0.x </a></p>

<p><a href="#0x">0.x </a></p>

<h2><a id="13x" name="13x"></a>1.3.x</h2>

<h3><a name="136"></a>1.3.6<span class="doc-date">June 23, 2013</span></h3>

<h4>Features</h4>

<ul>
	<li>New method: <em>EntityAspect.setDetached()</em> - this performs exactly the same operation as <em>EntityManager.detachEntity(entity)</em>.</li>
	<li><em>EntityManager.ImportEntities</em> now accepts either a string or a JSON object as its first parameter. This was added to assist in testing scenarios.</li>
	<li>Web API only: The server side <em>EntityInfo</em>&nbsp;class&nbsp;available during a Breeze save operation&nbsp;has a new <em>UnmappedValuesMap</em> property that is a <em>Dictionary&lt;String, Object&gt;</em> where each entry in the map is the value of an unmapped property sent from the client to a server.&nbsp;</li>
	<li><em>MetatadataStore.importMetadata&nbsp;</em>now supports metadata import in CSDL JSON format in addition to Breeze native format.&nbsp;</li>
	<li>Updated API docs.</li>
</ul>

<h4>Breaking changes</h4>

<ul>
	<li>In the relationArray.<em>arrayChanged</em> event the&nbsp;<em>relationArray</em> property has been renamed to <em>array</em>.</li>
	<li>The <em>ComplexAspect.entityAspect</em> property has been removed and replaced with the method <em>ComplexAspect.getEntityAspect()</em>.</li>
	<li>The <em>ComplexAspect.propertyPath </em>property has been removed and replaced with the method C<em>omplexAspect.getPropertyPath(propName)</em>.</li>
</ul>

<h4>Bug fixes</h4>

<ul>
	<li>Fixed a bug with the&nbsp;<em>EntityQuery.withParameters</em>&nbsp;method&nbsp;involving&nbsp;0, null, or empty string parameters.&nbsp;</li>
	<li>Fixed a number of JavaScript/IE8 compatability issues.</li>
	<li>Fixed a bug where detaching a&nbsp;parent entity modifies the in-cache children&#39;s entity state when&nbsp;it should not affect the children.</li>
	<li>Modified&nbsp;the default Json.NET serialization settings to not ignore nulls. This fixes a bug involving null updates to previously non-null values.&nbsp;</li>
	<li>Fixed a bug with named query results not arriving in same order on the client as they arrived on server&nbsp;when the query involved a skip or take.&nbsp;</li>
	<li>Fixed intermittent error with IE10 &#39;localStorage&#39; reference.&nbsp;</li>
</ul>

<h3><a name="135"></a>1.3.5<span class="doc-date">June 4, 2013</span></h3>

<h4>Features</h4>

<ul>
	<li><em>EntityManager.ExportEntities</em> and <em>EntityManager</em>.<em>ImportEntities </em>now try to avoid remapping temporary ids<strong> if at all possible</strong>. This makes writing unit tests around the use of these methods somewhat easier.&nbsp;&nbsp;</li>
	<li>Improved heuristics for when <em>entityType </em>/ <em>resourceName </em>mappings are not provided. This should allow more queries to succeed without misleading&nbsp;error messages.</li>
	<li>Updated conceptual&nbsp;and API documentation.&nbsp;</li>
</ul>

<h4>Bug fixes</h4>

<ul>
	<li>Unidirectional 1-&gt;n relations now update and perform foreign key fixup properly. Previously, these relations needed to be defined as bidirectional.
	<ul>
		<li>This fix does cause a version change in the Breeze native metadata format. The old metadata still works, but there is an additional optional NavigationProperty (invForeignKeyNames)&nbsp;that has been added to support this use case. This is handled automatically if you are working with an EF backend.&nbsp;</li>
	</ul>
	</li>
	<li>Fixed bug with <em>EntityManager.exportEntities</em> when exporting entities with <em>complexType</em> properties.</li>
	<li>Fixed bug with<em>&nbsp;MetadataStore.addEntityType</em>&nbsp;method when called with a config object containing embedded <em>dataProperties</em>.</li>
	<li>Fixed bug with unsubscription event tokens.</li>
	<li><span style="line-height: 1.6em;">Breeze.WebApi.dll</span><em style="line-height: 1.6em;">&nbsp;BeforeSaveEntity</em><span style="line-height: 1.6em;">/</span><em style="line-height: 1.6em;">BeforeSaveEntities </em><span style="line-height: 1.6em;">bug fixes:</span>
	<ul>
		<li><strong>Added </strong>and <strong>Modified </strong>entities that were not part of the original <em>saveBundle </em>sent to the server but were added / updated completely within the&nbsp;<em>BeforeSaveXXX&nbsp;</em>method&nbsp;were not being returned to client properly. This has been fixed.</li>
	</ul>
	</li>
</ul>

<h3><a name="134"></a>1.3.4<span class="doc-date">May 24, 2013</span></h3>

<h4>Features</h4>

<ul>
	<li>Added new <a href="/doc-samples/temp-hire">TempHire sample</a>.</li>
</ul>

<h4>Bug fixes</h4>

<ul>
	<li>Fixed bug with <em>FindEntityByKey </em>and inheritance hierarchies.&nbsp;</li>
	<li>Fixed query bug involving self referential base types within an inheritance hierarchy.</li>
	<li>Fixed issue with interaction between Require and Knockout when building a Breeze application that did not involve Knockout.</li>
</ul>

<h3><a name="133"></a>1.3.3<span class="doc-date">May 8, 2013</span></h3>

<h4>Features</h4>

<ul>
	<li>Setting the value of a property to an empty string&nbsp;on an Breeze Entity will&nbsp;now be coerced to a <em>null </em>for all Nullable properties.</li>
	<li>A new method has been added to the <em>ContextProvider</em> class on the server side Breeze.WebApi.dll to allow for the construction of new <em>EntityInfo </em>instances while within a <em>BeforeSaveEntities </em>call.
	<pre class="brush:jscript;">
public EntityInfo CreateEntityInfo(Object entity, EntityState entityState = EntityState.Added)</pre>
	</li>
</ul>

<h4>Bug fixes</h4>

<ul>
	<li>Importing of exported null DateTimeOffsets no longer converts them to JavaScript invalid dates.</li>
	<li>Fix for bug with projections involving complex types.</li>
	<li>Fix for Incorrect error handling where <em>EntityManager.executeQuery</em> fails during a merge.</li>
	<li>Fix for issue with the&nbsp;<em>JsonResultsAdapter </em>not being able to handle null nodes.</li>
	<li>Fix for&nbsp;attach logic involving 1 -&gt; 0:1 relation between entities with a shared primary key.&nbsp;</li>
	<li>In an inheritance&nbsp;hierarchy the <em>EntityType.defaultResourceName</em> now&nbsp;inherits from its parent&#39;s <em>defaultResourceName</em>.</li>
	<li>Fix for issue where Guid keys were not being compared in a case insensitive manner and should have been.&nbsp;</li>
	<li>Fix for incorrect resource name / entityType mapping being defined for some inheritance hierarchies.&nbsp;</li>
	<li>Fix for assumption that an identity column is always part of the primary key for an Entity.&nbsp;</li>
</ul>

<h3><a name="132"></a>1.3.2<span class="doc-date">May 2, 2013</span></h3>

<h4>Features</h4>

<ul>
	<li>The <em>EntityManager.createEntity</em> <em>initializer </em>parameter now allows related entities to be attached to the newly created entity.</li>
	<li>The <em>EntityManager.createEntity</em> method will now accept an <em>EntityType </em>as well as an entity type name as its first parameter.</li>
</ul>

<h4>Bug fixes</h4>

<ul>
	<li>Fix for Breeze/EF bug involving a single query with &quot;expand&quot;, &quot;orderBy&quot;, and &quot;take&quot; performing incorrect ordering.</li>
	<li>Fix for several&nbsp;issues with nested complex types.</li>
	<li>Fix for metadata resolution failures on some models using inheritance.</li>
	<li>Fix for issue with <em>MetadataStore.registerEntityTypeCtor</em> and<em> EntityManager.importEntities</em> involving the &quot;backingStore&quot; model library.</li>
	<li>Fix for bug involving the&nbsp;<em>EntityQuery.using</em>&nbsp;method and the <em>JsonResultsAdapter</em>.</li>
	<li>Fix for condition where the<em> DataProperty.nameOnServer</em> was incorrectly defined for some unmapped properties and not for others.</li>
</ul>

<h3><a name="131"></a>1.3.1<span class="doc-date">Apr. 25, 2013</span></h3>

<h4>Two Beta Features:</h4>

<ul>
	<li>
	<p><strong>Inheritance Support</strong> - This includes the ability to query and save all forms of Entity Framework inheritance models (TPC, TPH, and TPT). This also includes metadata changes so that non-EF / non-.NET services can expose inheritance hierarchies as well. Features include:</p>

	<ul>
		<li>Ability to perform server side polymorphic queries or navigations.</li>
		<li>Ability to perform client side polymorphic queries or navigations.</li>
		<li>Insert, update, delete.</li>
		<li>Navigation to related parent and child entities.</li>
		<li>Extensions to the Breeze metadata format to support inheritance.</li>
		<li>Two new EntityType methods: <em>EntityType.isSubtypeOf</em> and <em>EntityType.getSelfAndSubtypes</em>.</li>
	</ul>

	<p>Documentation is on the way. Meanwhile you can explore a comprehensive collection of explanatory tests in the <em>inheritanceTests</em> file of <a href="/samples/doccode">the DocCode Sample</a>. There is a new companion &quot;Inheritance&quot; model in that sample project illustrating TPH, TPT, and TPC inheritance.</p>
	</li>
	<li>
	<p><strong>OData Write/Save Support</strong> - Calling <em>EntityManager.saveChanges</em> now performs the appropriate OData Multipart MIME POST, MERGE, and DELETE operations. (Previously, only OData read operations were supported).</p>

	<ul>
		<li>This feature requires that the OData service support OData batch operations. See <a href="http://www.odata.org/documentation/odata-version-2-0/batch-processing/">http://www.odata.org/documentation/odata-version-2-0/batch-processing/</a>. Currently Microsoft&#39;s WCF Data Services do support batch operations but the new ASP.NET MVC4 Web API OData library does NOT... (although they say it&#39;s coming).</li>
	</ul>
	</li>
</ul>

<p>These two features are being released as Beta features <strong><em>not</em></strong> because we expect these API&#39;s to change in the future. (In fact, there were very few new API calls added to support either of these features. Almost all of the code to support these capabilities occurs under the covers.) The Beta designation indicates that although we have done a great deal of testing on these features, we only have a moderate number of test scenarios and need community feedback to determine whether we&#39;ve missed any test cases.</p>

<h4>Other Features</h4>

<ul>
	<li>The <em>MetadataStore.importMetadata</em> method will now accept metadata in either Breeze&#39;s native metadata format or as an EDMX CSDL document encoded as JSON (this is what is returned by both OData services as well as <em>EFContextProvider </em>backed web services).</li>
	<li><strong>Breaking Change</strong>: the Breeze controller route prefix has changed from &#39;api/&#39; to &#39;breeze/&#39; in all NuGet packages, templates, and samples. This change addresses the oft occurring conflicts between Breeze Web API routes and default Web API routes.<br />
	<br />
	Heretofore, a request such as &quot;<em>host.com/api/something/123</em>&quot;, which was supposed to go to a regular Web API controller would be routed instead to a Breeze Web API controller ... and fail. There was no reliable way to disambiguate these requests without changing the route prefix (note: the Microsoft Web API team recently did something similar when it designated &#39;odata/&#39; as the route prefix for its specialized OData controllers).<br />
	<br />
	The&nbsp;<em>BreezeWebApiConfig.cs </em>in App_Start incorporates this change.<br />
	<br />
	After updating your breeze.webapi NuGet package, <strong>you may have to change the <a href="http://www.breezejs.com/sites/all/apidocs/classes/EntityManager.html" target="_blank">&quot;serviceName&quot; passed to your EntityManager constructor</a> from &#39;api/...&#39; to &#39;breeze/...&#39;</strong>. Alternatively, you can change the value in&nbsp;<em>BreezeWebApiConfig.cs </em> back to &#39;api/&#39; ... and future NuGet package updates will not touch this file again. We regret the inconvenience.</li>
</ul>

<h4>Bug fixes</h4>

<ul>
	<li>Fix for incorrect error propagation involving failed promises.</li>
	<li>Fix for issue involving entity navigation fixup with a unidirectional associations. This manifested as children that would not be correctly associated with their parents if the child was loaded first</li>
	<li>Fix so that when Breeze deletes a parent entity, it no longer clears the related property on any children if the related property is actually part of the child&#39;s key.</li>
	<li>Fix for bug with <em>EntityQuery.inlineCount</em> and CORS. This involved a move of inlineCount information out of the HTTP header and into the query response payload.</li>
	<li>Fix for bug involving the <em>EntityQuery.toType</em> method.</li>
</ul>

<h3><a name="130"></a>1.3.0 - Feature Release<span class="doc-date">Apr. 16, 2013</span></h3>

<ul>
	<li>Added a new AngularJS sample, &quot;<a href="/samples/edmunds" target="_blank">Edmunds</a>&quot;, showing <strong>how to consume a generic HTTP service with Breeze</strong>. It&#39;s a pure JavaScript client sample with no ASP.NET, Web API, EF, or SQL database dependencies. It demonstrates several features and changes of this release including the compact Metadata format and JSONP support.</li>
	<li>Added &quot;Named Saves&quot;. By default the <em>EntityManager.saveChanges</em> method sends a save request to an endpoint called &quot;SaveChanges&quot;. With &quot;Named Save&quot;, you can target a different server endpoint such as an arbitrarily named <em>action </em>method on another Web API controller. There are two new properties on the <em>SaveOptions</em> class. A <em>resourceName</em> (for the <em>action</em> method) and a <em>dataService</em> (for targeting a different controller). Assuming that you want to save all pending changes, you could write
	<pre class="brush:jscript;" style="color: black; font-family: Consolas; margin-left: 80px;">
var so = new SaveOptions({ resourceName: &quot;myCustomSave&quot; });
// null = &#39;all-pending-changes&#39;; saveOptions is the 2nd parameter
myEntityManager.SaveChanges(null, so ); </pre>
	The client sends a JSON change-set bundle to &#39;MyCustomSave&#39;. The signature of &#39;MyCustomSave&#39; should be the same as &#39;SaveChanges&#39;.</li>
	<li>Added two new delegates to the <em>Breeze.WebApi.ContextProvider </em>class, <em>BeforeSaveEntitiesDelegate </em>and <em>BeforeSaveEntityDelegate</em>. Developers may extend a <em>ContextProvider </em>with save interception logic by assigning these delegates rather than subclassing and overriding the corresonding <em>BeforeSaveEntities </em>and <em>BeforeSaveEntity</em> methods. There is no difference in functionality. Choose the approach that suits your architectural style.</li>
	<li>?Added JSONP support via a new <em>useJsonp </em>property on the <em>DataService </em>class:
	<pre class="brush:jscript;" style="color: black; font-family: Consolas; margin-left: 80px;">
var ds = new breeze.DataService({
    serviceName: serviceName,
    hasServerMetadata: false,
    useJsonp: true
});

var manager = new breeze.EntityManager({dataService: ds});</pre>
	</li>
	<li>Added a new compact metadata format. The <em>EntityType </em>constructor will now accept <em>DataProperties </em>and <em>NavigationProperties </em>in&nbsp;the following format. The more verbose API is still available and has not changed.
	<pre class="brush:jscript;" style="color: black; font-family: Consolas; margin-left: 40px;">
metadataStore.addEntityType({
    shortName: &quot;Model&quot;,
    namespace: &quot;Edmunds&quot;,
    dataProperties: {
        id:            { dataType: &quot;String&quot;, isPartOfKey: true },
        makeId:        { dataType: &quot;Int64&quot; },
        name:          { dataType: &quot;String&quot; },
        vehicleStyles: { dataType: &quot;String&quot; },
        vehicleSizes:  { dataType: &quot;String&quot; },
        categories:    { dataType: &quot;Undefined&quot; }
    },
    navigationProperties: {
        make: {
            entityTypeName:  &quot;Make:#Edmunds&quot;, isScalar: true,
            associationName: &quot;Make_Models&quot;,  foreignKeyNames: [&quot;makeId&quot;]
        }
    }
});</pre>
	</li>
</ul>

<ul>
	<li>The <em>DataProperty </em>constructor accepts <em>DataTypes </em>as strings as well as <em>DataType</em> objects.</li>
	<li>The <em>visitNode </em>method of the <em>JsonResultsAdapter </em>may return a string as well as an <em>EntityType</em>.</li>
	<li>The Breeze Typescript definition file was updated to the latest version of Breeze.</li>
	<li>Improved the error messages in several areas related to Metadata construction and use of the <em>JsonResultsAdapter</em>.</li>
	<li>The native Breeze metadata format was modified. The <em>structuralTypeMap </em>property, the value of which was an object containing <em>EntityTypes </em>keyed by type name, has become the <em>structuralTypes </em>property, a simple array of <em>EntityTypes</em>. This is a small breaking change that should only affect applications that served metadata using the native Breeze metadata format created as a JSON object on the server.</li>
</ul>

<ul>
	<li>Bug fix involving queries and type coercion with &#39;byte&#39; properties.</li>
	<li>Bug fix involving saves where a date property was part of the key.</li>
	<li>Bug fix involving incorrect change tracking of date properties.</li>
	<li>Bug fix involving Incorrect ordering in local query results when using an <em>orderBy </em>clause on properties containing null values.</li>
	<li>Bug fix involving calling <em>entityAspect.validateProperty</em> with a null value.</li>
</ul>

<p>&nbsp;</p>

<h2><a id="12x" name="12x"></a>1.2.x</h2>

<h3>1.2.8<span class="doc-date">Apr. 5, 2013</span></h3>

<ul>
	<li><em>QueryOptions</em>, <em>SaveOptions</em>, and <em>ValidationOptions </em>property inheritance rules have been formalized.

	<ul>
		<li>Each of these options may be specified at multiple points within Breeze, for example a <em>QueryOptions </em>instance may be specified for a <em>Query</em>, for an <em>EntityManager</em>,<em> </em>or as a global default. Any&nbsp;properties of&nbsp;these &#39;options&#39; instances that are not specified will now automatically take their value at run time from any values specified one level higher up in the hierarchy. &nbsp; In other words, if an <em>EntityQuery </em>is executed using a specified <em>QueryOptions </em>with only a <em>FetchStrategy </em>specified, then the <em>MergeStrategy </em>used will be that defined by the <em>EntityManager.queryOptions </em>instance that the query is being run against.&nbsp;This logic applies to all of the properties for each of these &#39;options&#39; types. &nbsp;</li>
		<li>This is a possible breaking change but only in those cases where &#39;partial&#39; options instances were created.&nbsp;</li>
	</ul>
	</li>
	<li>Updated API documentation.</li>
	<li>Bug fix for the case where a save involving a delete would fail when that save also involved a modification to an unmapped property.&nbsp;</li>
</ul>

<h3>1.2.7<span class="doc-date">Mar. 26, 2013</span></h3>

<ul>
	<li>Breeze metadata changes:
	<ul>
		<li>Breeze&rsquo;s native metadata format is <a href="http://www.breezejs.com/documentation/metadata-schema">now documented</a> and JSON representations in this format can now be used:

		<ul>
			<li>as the result of any Web API Metadata service method call. This means that any server can produce metadata in this format and return it as a response to the Breeze Metadata web service call. If using&nbsp;.NET, you can return the JSON metadata object directly from the Metadata method on the <em>ApiController</em>. This provides a simple mechanism for supplying server-side metadata for services that are not backed by an EDMX representation.</li>
			<li>as a parameter to the <em>metadataStore.importMetadata </em>method (in addition to current string format).</li>
		</ul>
		</li>
		<li>Metadata export size is now less than half its previous size.</li>
		<li>There is a new <em>breeze.metadataVersion </em>property.&nbsp;An exception is now thrown when the imported metadata version does not match the current version.</li>
		<li>Metadata returned by any <em>ApiController </em>with a <em>BreezeController </em>attribute is no longer redundantly wrapped as a string.&nbsp;This is a bit faster and has a smaller payload.<br />
		&nbsp;</li>
	</ul>
	</li>
	<li>Bug fix involving the foreign key fixup of default values that occurs after the deletion of a parent entity.</li>
	<li>Bug fix involving the <em>EntityQuery.usin</em>g method with a <em>jsonResultsAdapter</em>.</li>
	<li>Bug fix involving an <em>EntityQuery.where </em>clause involving a <em>dateTimeOffset </em>property.</li>
	<li>Eliminated extraneous code needed&nbsp; to create a mock <em>dataService </em>or <em>metadataStore</em>.</li>
	<li>Added missing API documentation on the available properties of the <em>Validator </em>class.</li>
</ul>

<h3>1.2.5<span class="doc-date">Mar. 19, 2013</span></h3>

<ul>
	<li>Updated TypeScript definitions</li>
	<li>Updated API documentation.</li>
	<li>Fix for <em>EFContentProvider.BeforeSaveEntity </em>bug where a <em>false</em> returned value was not handled correctly.</li>
</ul>

<h3>1.2.4<span class="doc-date">Mar. 17, 2013</span></h3>

<ul>
	<li>Same functionality -&nbsp;just smaller and a bit faster.</li>
	<li>Removed internal dependencies on RequireJS. External dependencies on RequireJS should now play nice with Breeze.</li>
</ul>

<h3>1.2.1<span class="doc-date">Mar. 14, 2013</span></h3>

<ul>
	<li>Support for new Microsoft ASP.NET Web API OData features.
	<ul>
		<li>The<strong> </strong>[<em>BreezeController</em>]<strong> </strong>attribute has been rewritten to use Microsoft&rsquo;s ASP.NET Web API OData library.&nbsp;This new version should be <strong>completely</strong> compliant with the old one.&nbsp;However,&nbsp;just in case, the old version has been renamed to [<em>LegacyBreezeController</em>] and marked obsolete.&nbsp;It will be removed in 6 months or so.

		<ul>
			<li>The &lsquo;new&rsquo; [<em>BreezeController</em>] attribute provides support for full OData semantics to any method within the controller that meets<strong> all</strong> of the following criteria.

			<ul>
				<li>It returns an <em>IQueryable</em>.</li>
				<li>It does not have its own [<em>Queryable</em>] attribute or subclass of this attribute applied.</li>
				<li>It does not have an <em>ODataOptions </em>parameter in its parameter list. (This is a backdoor mechanism that MS designed to give more control to selected methods.)</li>
			</ul>
			</li>
			<li>As with the old version, the new version provides support for OData capabilities that Microsoft&#39;s [<em>Queryable</em>] attribute does not. This includes:support for <em>$expand</em>, <em>$select</em>, and the ability to perform ordering on any nested property path.</li>
			<li>The new version now supports the same OData restriction properties that the [Queryable] attribute does. See the &quot;Query Security&quot; portion of <a href="http://www.asp.net/web-api/overview/odata-support-in-aspnet-web-api/odata-security-guidance" target="_blank">OData Security Guidance</a> for more information. Yes, now you can now apply restrictions at the controller level.</li>
			<li>As with the old version, &nbsp;this attribute also configures the JSON.NET formatter to Breeze&rsquo;s requirements.</li>
			<li>The Irony DLL is now&nbsp;is now only needed to support of the <em>LegacyBreezeControllerAttribute </em>and will be removed in 6 months.</li>
		</ul>
		</li>
		<li>There is a new [<em>BreezeQueryable</em>] attribute that subclasses the Web API&rsquo;s [<em>Queryable</em>] attribute, and&nbsp;can be applied on a per method basis.&nbsp;It supports all of the Breeze standard OData support by default, but can be configured just like the [<em>Queryable</em>] attribute to suppress certain capabilities.</li>
		<li>You can also use&nbsp;Web API&rsquo;s own [<em>Queryable</em>] attribute on any method, in which case you will lose the OData capabilities of <em>$expand</em>, <em>$select</em>, and nested ordering for that method.</li>
		<li>The [<em>JsonFormatter</em>] attribute has been renamed to [<em>BreezeJsonFormatter</em>]. (The old version has been marked obsolete and will be removed in 6 months.).&nbsp;Note that you can now apply just this attribute to your <em>ApiController </em>and then use the [<em>BreezeQueryable</em>] attribute or the [<em>Queryable</em>] attribute on each method that you want OData support for.&nbsp;The alternative is to use the [<em>BreezeController</em>] attribute and suppress specific OData capabilities on selected methods by applying the [<em>BreezeQueryable</em>] or [<em>Queryable</em>] attributes.&nbsp;So you can go with either an exclusionary or inclusionary policy for OData support.&nbsp;</li>
	</ul>
	</li>
	<li>Support for the ability to provide custom extraction and parsing logic on the JSON results returned by any web service. This facility makes it possible for Breeze to <a href="http://www.breezejs.com/documentation/processing-results-any-web-service">talk to virtually any web service</a> and return objects that will be first class Breeze entities. The requirement to use a specific server side JSON serializer in no longer applicable. This is a <strong>BETA </strong>feature and may still undergo some changes.
	<ul>
		<li>New <em><a href="http://www.breezejs.com/sites/all/apidocs/classes/JsonResultsAdapter.html" target="_blank">JsonResultsAdapter </a></em>class.</li>
		<li>The <strong>DataService </strong>ctor will now accept a <em>JsonResultsAdapter </em>in its configuration hash.</li>
	</ul>
	</li>
	<li>The<strong> </strong><em>EntityQuery.using</em> method will now also accept a parameter that is a <em>DataService </em>or a <em>JsonResultsAdapter</em>.
	<ul>
		<li>This allows an individual query to point to a different <em>DataService </em>or specify special handling for the results of just that query.</li>
	</ul>
	</li>
	<li>A new<em> EntityQuery.toType </em>method has been added to allow the results of simple &#39;namedQueries&#39; without embedded type information to be hydrated as instances of a specific type.</li>
	<li>The following <strong>breaking changes</strong> were also made.
	<ul>
		<li>.NET Enums are now queried and materialized on the client as strings instead of ints. This is to stay compliant with the behaviour of MS&#39;s OData support.</li>
		<li>The <em>EntityManager.dataServiceAdapterInstance </em>property has been removed. The same value can be returned via the <em>EntityManager.dataService.adapterInstance</em> property path.</li>
	</ul>
	</li>
</ul>

<h3>New Tutorial<span class="doc-date">Mar. 12, 2013</span></h3>

<ul>
	<li><a href="http://learn.breezejs.com/">Angular tutorial</a> added. Select it from the drop down menu inside the tutorial link.</li>
</ul>

<h2><a id="11x" name="11x"></a>1.1.x</h2>

<h3>1.1.3<span class="doc-date">Mar. 2, 2013</span></h3>

<ul>
	<li>Web API changes:
	<ul>
		<li>A new static <em>ContextProvider.ExtractSaveOptions </em>method has been added that may be used to extract any <em>SaveOptions </em>from an incoming <em>SaveBundle</em>. Used to implement Unit of Work pattern within Breeze.&nbsp;</li>
		<li>A new <em>EntityInfo.ForceUpdate&nbsp;</em>boolean property has been&nbsp;added.&nbsp;This property may be used to force a server side update of an entire entity when server side modification&nbsp;has been made to an existing entity.&nbsp;May be used in place of explicitly updating the <em>EntityInfo.OriginalValuesMap</em>.&nbsp;See&nbsp;server documentation.</li>
	</ul>
	</li>
	<li>New <em>MetadataStore.setEntityTypeForResourceName </em>and <em>MetadataStore.getEntityTypeNameForResourceName </em>methods have been added&nbsp;to explicitly associate an entityType with a resourceName. More details are available&nbsp;in the Breeze&nbsp;API docs.</li>
	<li>A new <em>SaveOptions.tag </em>property has been added to allow custom information to be passed to the Breeze server during a save operation.</li>
	<li>Bug fix for issues with involving&nbsp;the <em>Object.hasOwnProperty&nbsp;</em>method on certain browsers. &nbsp;</li>
	<li>Removal of an extraneous global property added to the global namespace.&nbsp;</li>
</ul>

<h3>New Documentation<span class="doc-date">Feb. 25, 2013</span></h3>

<ul>
	<li>Updated documentation on <a href="http://www.breezejs.com/documentation/odata">Open Data (OData)</a>.</li>
</ul>

<h3>New Documentation<span class="doc-date">Feb. 21, 2013</span></h3>

<ul>
	<li>Walkthrough showing how to <a href="http://www.breezejs.com/bridging-phone-gap">deploy a Breeze application as a native mobile app</a> using PhoneGap.</li>
</ul>

<h3>1.1.2<span class="doc-date">Feb. 9, 2013</span></h3>

<ul>
	<li>Better error message when no modelLibrary adapter can be instantiated.</li>
</ul>

<h3>1.1.1<span class="doc-date">Feb. 8, 2013</span></h3>

<ul>
	<li>Added support for .NET <em>DateTimeOffset </em>and <em>DateTime2 </em>datatypes.</li>
	<li>Metadata properties with unknown datatypes no longer throw an exception when encountered during metadata discovery.
	<ul>
		<li>Data properties with &quot;unknown&quot; data types will now appear within the <em>EntityType </em>metadata with a <em>DataType </em>of &quot;Undefined&quot;.</li>
		<li>Data returned from the server for any &quot;Undefined&quot; datatypes will be now passed through raw, meaning the data will be exactly what was serialized on the server, without any Breeze processing.
		<ul>
			<li>This includes <em>DbGeometry </em>and <em>DbGeography </em>classes for now.</li>
		</ul>
		</li>
	</ul>
	</li>
	<li>Individual data properties can now be removed from the array returned by the <em>EntityType.dataProperties </em>property.
	<ul>
		<li>Removal of a property tells Breeze that this property should not be materialized onto any entity of this type when returned to the client.&nbsp; This allows the data for any server side property to be effectively ignored by the client.</li>
		<li>Note: it is probably desirable, but not required, when ignoring a property to <strong>also </strong>ensure that it doesn&#39;t get serialized by the server in the first place.</li>
	</ul>
	</li>
</ul>

<h3>1.1.0<span class="doc-date">Feb. 6, 2013</span></h3>

<ul>
	<li>The <em><span class="codeword">EntityManager.hasChanges</span> </em><u>event</u> has been renamed to <em>hasChangesChanged</em>. This is a breaking change.

	<ul>
		<li>&quot;hasChanges&quot; was both an event and a method, a cause of confusion.</li>
		<li>A global search/replace of &quot;<em>hasChanges.subcribe</em>&quot; to &quot;<em>hasChangesChanged.subscribe</em>&quot; should fix your code safely.</li>
		<li>The <em><span class="codeword">EntityManager.hasChanges</span> </em><u>method</u> remains and continues to report whether entities in cache have unsaved changes.</li>
	</ul>
	</li>
</ul>

<ul>
	<li>Several memory leaks have been fixed and we&#39;ve reduced excess memory consumption during large queries and multiple metadata fetches.
	<ul>
		<li>We traced one memory leak to an older version of the Q library.&nbsp;Please make sure to use the latest available version of Q in your applications.&nbsp;The Breeze NuGet packages and samples all include the latest version.</li>
		<li>In newer versions of the Q library, the &quot;end&quot; method has been renamed to &quot;done&quot;.</li>
	</ul>
	</li>
</ul>

<ul>
	<li>Bug fix to correct incorrect behavior of <em>EntityAspect.rejectChanges</em> with boolean properties.</li>
	<li>Removed spurious error message that would occasionally appear during NuGet package install.</li>
</ul>

<h2><a id="10x" name="10x"></a>1.x</h2>

<h3>1.0.1<span class="doc-date">Jan. 28, 2013</span></h3>

<ul>
	<li>Bug fix for <em>EntityManager.executeQueryLocally </em>throwing a null reference exception when no metadata is found. (A clearer exception is now thrown).</li>
	<li>Bug fix for <em>EntityManager.hasChanges </em>returning true after calling <em>setDeleted </em>on an &#39;Added&#39; entity.</li>
	<li>Bug fix involving multiple unidirectional 1-1 relations on a single entity type.</li>
	<li>Bug fix involving custom server side entity level validation errors not propogating to the Breeze client.</li>
	<li>Minified version of Breeze renamed from &quot;breeze.js&quot; to &quot;breeze.min.js&quot;.</li>
</ul>

<h3>New Documentation<span class="doc-date">Jan. 24, 2013</span></h3>

<ul>
	<li><a href="http://www.breezejs.com/documentation/entitymanager-and-caching">EntityManager</a> documented.</li>
</ul>

<h3>New Documentation<span class="doc-date">Jan. 22, 2013</span></h3>

<ul>
	<li><a href="http://www.breezejs.com/samples/nodb">NoDB sample</a> documented. Shows Breeze working without&nbsp;a database.</li>
</ul>

<h2><a id="0x" name="0x"></a>0.x</h2>

<h3>0.85.2<span class="doc-date">Jan. 17, 2013</span></h3>

<p class="note">NuGet packages have been renamed: <a href="http://nuget.org/packages/Breeze.WebApi" target="_blank"><strong><span style="color: blue;">Breeze.WebApi</span> </strong></a>and <a href="http://nuget.org/packages/Breeze.WebApiSample" target="_blank"><strong><span style="color: blue;">Breeze.WebApiSample</span></strong></a>.<br />
<br />
If you rely on NuGet package updates, you will need to remove any old Breeze packages and replace them with these new ones.</p>

<ul>
	<li><em>EntityManager.createEntity </em>method added.

	<ul>
		<li>This method allows the construction, initialization, and attachment of an entity&nbsp;to an EntityManager in a single step. See API docs for more information.</li>
	</ul>
	</li>
	<li><em>Validator.register </em>and <em>Validator.registerFactory </em>methods added.
	<ul>
		<li>These methods allow custom validators to be registered so that the deserialization of any metadata that needs these validators is successful. See API docs for more information.</li>
	</ul>
	</li>
</ul>

<h3>0.84.4<span class="doc-date">Jan. 16, 2013</span></h3>

<ul>
	<li>TypeScript support added.
	<ul>
		<li>Zip packages now include a TypeScript directory with a &quot;breeze.d.ts&quot; file that supports the complete Breeze API.</li>
	</ul>
	</li>
	<li>&quot;ToDo-NoEF&quot; sample renamed to &quot;NoDb&quot;.&nbsp;Documentation available soon on the Breeze website.</li>
	<li>Bug fix so that <em>EntityManager.attachEntity</em> will no longer generate primary key values unless the entity is to be &#39;Added&quot;.&nbsp;This is a breaking change.
	<ul>
		<li>All other key generation rules remain unchanged.</li>
	</ul>
	</li>
</ul>

<h3>0.84.3<span class="doc-date">Jan. 10, 2013</span></h3>

<ul>
	<li>Bug fix involving failing local entity queries for null dates.</li>
	<li>Bug fix for &#39;namespace&#39; reserved word on Chrome.</li>
</ul>

<h3>0.84.2<span class="doc-date">Jan. 09, 2013</span></h3>

<ul>
	<li>Bug fix involving detached child entities being added incorrectly during an eager load of related parents.</li>
</ul>

<h3>0.84.1<span class="doc-date">Jan. 09, 2013</span></h3>

<ul>
	<li><em>TimeSpan </em>support:

	<ul>
		<li><em>TimeSpans </em>are represented as ISO 8601 &#39;duration&#39; strings on the Breeze client.&nbsp;See <a href="http://en.wikipedia.org/wiki/ISO_8601">http://en.wikipedia.org/wiki/ISO_8601</a>.</li>
		<li>Full query capability, including the ability to both filter and return TimeSpan/Duration properties. i.e.:
		<ul>
			<li>var query = EntityQuery.from(&quot;Contracts&quot;).where(&quot;TimeElapsed&quot;, &quot;&gt;&quot;, &quot;PT4H30M&quot;);</li>
		</ul>
		</li>
		<li>Full save support.</li>
	</ul>
	</li>
</ul>

<h3>0.83.5<span class="doc-date">Jan. 08, 2013</span></h3>

<ul>
	<li>Bug fix for <em>EntityManager.createEmptyCtor</em>.</li>
	<li>Bug fix involving removal of superfluous <em>dataProperty </em>when using<em> MetadataStore.registerEntityTypeCtor </em>and Knockout.</li>
	<li>Bug fix involving the loss of custom ctors when using <em>MetadataStore.registerEntityTypeCtor </em>and <em>EntityManager.importEntities</em>.</li>
	<li>Partial <em>TimeSpan </em>support - a complete implementation will follow soon with docs.</li>
</ul>

<h3>New documentation<span class="doc-date">Jan. 07, 2013</span></h3>

<ul>
	<li>New <em>Getting started with Breeze using NuGet</em> <a href="http://www.breezejs.com/documentation/start-nuget">video</a>.</li>
	<li>A lot of documentation added for Todo <a href="http://www.breezejs.com/samples/todo">sample</a>.</li>
</ul>

<h3>0.83.4<span class="doc-date">Jan. 07, 2013</span></h3>

<ul>
	<li>Bug fix for OData enums.</li>
	<li>Bug fix for IE8 support with shims.</li>
</ul>

<h3>0.83.3<span class="doc-date">Jan. 05, 2013</span></h3>

<ul>
	<li>Breeze now allows an Entity Framework backed application to have a different namespace for its model and the Entity Framework <em>DbContext </em>or <em>ObjectContext </em>that hosts it.

	<ul>
		<li>This previously enforced limitation was relaxed because so many of our users stumbled over it.</li>
	</ul>
	</li>
	<li>The Breeze.WebApi.dll <em>EFContextProvider </em>can now be subclassed to allow custom creation of an <em>DbContext </em>or <em>ObjectContext</em>.
	<ul>
		<li>There is now a new virtual CreateContext method on the EFContextProvider.</li>
	</ul>
	</li>
	<li>Bug fix involving Enums not always resolving properly with Entity Framework v.5 Code First.</li>
</ul>

<h3>0.82.1<span class="doc-date">Jan. 03, 2013</span></h3>

<ul>
	<li>Added support for Entity Framework Enumerations.
	<ul>
		<li>Enums will appear as integers in the Breeze client.</li>
		<li>Both queries and saves involving enums are supported, including the use of where clauses involving enum values.</li>
	</ul>
	</li>
	<li>Bug fix involving calling <em>EntityManager.clear </em>after the save of a deleted entity.</li>
	<li>Bug fix to the [<em>BreezeController</em>] attribute to avoid inadvertently removing WebApi authorization filters.</li>
</ul>

<h3>0.81.2<span class="doc-date">Jan. 02, 2013</span></h3>

<ul>
	<li>Added abiltity to set the &#39;AutoGeneratedKeyType&#39; in the EntityType ctor.</li>
	<li>The Breeze.WebApi dll is now signed.</li>
	<li>New sample:
	<ul>
		<li>ToDo-NoEF - An example of using in-memory backing store instead of an Entity Framework based backing store.</li>
	</ul>
	</li>
</ul>

<h3>0.81.1<span class="doc-date">Dec. 29, 2012</span></h3>

<ul>
	<li>New and updated samples. Samples now include:
	<ul>
		<li><a href="http://www.breezejs.com/samples/breezy-devices">Breezy Devices</a></li>
		<li><a href="http://www.breezejs.com/samples/car-bones">Car Bones</a></li>
		<li><a href="http://www.breezejs.com/samples/doccode">DocCode</a></li>
		<li><a href="http://www.breezejs.com/samples/todo">Todo-Knockout</a></li>
		<li><a href="http://www.breezejs.com/samples/todo-angular">Todo-Angular</a></li>
		<li><a href="http://www.breezejs.com/samples/todo-require">Todo-Require</a></li>
	</ul>
	</li>
</ul>

<h3>0.80.5<span class="doc-date">Dec. 28, 2012</span></h3>

<ul>
	<li>Bug fix to <em>BreezeConfig </em>probing logic to ignore unreflectable assemblies.</li>
	<li>Bug fix to handle clean roundtripping of Dates with Time components.
	<ul>
		<li>As of this release, all dates returned from the server will go through the new DataType.parseDateFromServer method (which can be replaced).&nbsp;The default implementation of this method treats any serialized date string coming from the server that does not have a UTC specification as a UTC date despite the missing specification.&nbsp;Prior to this fix, different browsers would interpret a date string without a UTC component differently, some as a local time, some as a UTC time.&nbsp;Since most SQL databases do not return dates with explicit timezone information, this was causing problems when these dates were serialized back to a JavaScript client.&nbsp;Since the Breeze client transmits all dates to the server as UTC dates during a save operation, it seems reasonable to assume that any dates returned to it will also be UTC dates.&nbsp;Note that the treatment of&nbsp; Date strings <strong>with </strong>a UTC component has not changed.</li>
	</ul>
	</li>
</ul>

<h3>0.80.3<span class="doc-date">Dec. 22, 2012</span></h3>

<ul>
	<li>Added new class, <em>BreezeConfig</em>, to the Breeze.WebApi dll. <em>BreezeConfig </em>enables customization of components supporting Breeze-related operations in the Web API. <em>BreezeConfig </em>defines default behaviors; you can substitute your own behaviors by deriving from it and overriding its virtual methods. Breeze.NET will discover your subclass among the assemblies referenced by your project and use it instead of <em>BreezeConfig</em>.<br />
	<br />
	BreezeConfig is in BETA and may&nbsp;change in future releases<em>.</em><br />
	<br />
	For example, <em>BreezeConfig </em>configures the Json.Net serializer with specific settings. You can replace those settings by writing a subclass of BreezeConfig that overrides the &#39;<em>CreateJsonSerializerSettings</em>&#39; method as shown in this example:</li>
</ul>

<pre class="brush:csharp;">
    public class CustomBreezeConfig : Breeze.WebApi.BreezeConfig {
 
        /// &lt;summary&gt;
        /// Overriden to create a specialized JsonSerializer implementation
        /// that uses UTC date time zone handling.
        /// &lt;/summary&gt;
        protected override JsonSerializerSettings CreateJsonSerializerSettings() {
            var baseSettings = base.CreateJsonSerializerSettings();
            baseSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
            return baseSettings;
        }
    }</pre>

<p style="margin-left: 40px;">Although this the only overrideable method at this time, BreezeConfig is intended to be the locus of future extension points of this kind.</p>

<ul>
	<li>Bug fix related to foreign key fixup involving null foreign keys.</li>
</ul>

<h3>0.80.2<span class="doc-date">Dec. 22, 2012</span></h3>

<ul>
	<li>Automatic datatype coercion is now applied when setting any Breeze &#39;entity&#39; properties. This means, for example, that when setting a string to a numeric or date field that Breeze will attempt to coerce the value to the correct datatype before assignment.
	<ul>
		<li>This capability is customizable for each defined Breeze &#39;DataType&#39; by replacing the appropriate DataType&#39;s &#39;parse&#39; method. For example, to&nbsp;coerce nulls into empty strings and to trim all strings before assignment, the following code could be used:</li>
	</ul>
	</li>
</ul>

<pre class="brush:jscript;" style="margin-left: 40px;">
breeze.DataType.String.parse = 
    function (source, sourceTypeName) {
        if (source == null) {
            return &quot;&quot;;
        } else if (sourceTypeName === &quot;string&quot;) {
            return source.trim();
        } else {
            return source.toString();
        }
    };</pre>

<h3>0.80.1<span class="doc-date">Dec. 22, 2012</span></h3>

<ul>
	<li>Complex Type support added
	<ul>
		<li>New type: <em>ComplexType </em>- see API docs.</li>
		<li>New type: <em>ComplexAspect </em>- see API docs.</li>
		<li>Query/Save changes:
		<ul>
			<li>Queries can now return ComplexTypes and ComplexType properties can be queried, i.e. EntityQuery.from(&quot;Customer&quot;).where(&quot;location.city&quot;, &quot;startsWith&quot;, &quot;A&quot;)</li>
			<li>Entities containing complex types may be saved.</li>
		</ul>
		</li>
		<li><em>EntityAspect.PropertyChanged </em>and<em> EntityManager.EntityChanged </em>events now return &quot;property paths&quot; whenever a property of an embedded complex type is modified. i.e. &quot;location.city&quot;.</li>
		<li>MetadataStore changes:
		<ul>
			<li><em>getEntityType</em>, <em>getEntityTypes</em>, <em>addEntityType</em>, <em>registerEntityTypeCtor </em>all now either take or return <em>ComplexType </em>instances in addition to <em>EntityType </em>instances.&nbsp;</li>
			<li>EntityTypes may be distinguished from ComplexTypes by using:&nbsp;&quot;aType instanceof EntityType&quot; or &quot;aType instanceof ComplexType&quot;</li>
		</ul>
		</li>
		<li>Validation changes:
		<ul>
			<li>Property level validation errors involving complex type properties include the &quot;property path&quot; to the errant property.</li>
		</ul>
		</li>
	</ul>
	</li>
</ul>

<ul>
	<li><em>EntityAspect.clearValidationErrors </em>method added (see API docs)</li>
	<li>API docs updated to describe the <em>DataService </em>type.</li>
	<li>Bug fix to<em> EntityAspect.validateEntity</em>.</li>
</ul>

<h3>0.78.3<span class="doc-date">Dec. 20, 2012</span></h3>

<ul>
	<li>Added a new <em>BreezeControllerAttribute </em>class. The [<em>BreezeController</em>] attribute should now be applied to all Breeze WebApi Api Controller classes instead of the formerly recommended &quot;[JsonFormatter, ODataActionFilter]&quot; pair. This change is particularly <strong>important </strong>when you apply the Breeze.MVC4WebApiClientSample NuGet package to an MVC 4 project generated from the <strong>MVC 4 SPA Template</strong>.</li>
	<li>The Breeze client only understands JSON formatted content. The AJAX POST triggered by the Breeze client <em>EntityManager.saveChanges</em> method now specifies &quot;dataType: &#39;json&#39;&quot; which resolves to an Accept header requesting save results formatted as JSON. This addresses certain scenarios (e.g, CORS) in which the browser requested content formatted as XML.</li>
	<li>Updated&nbsp;the ToDo and ToDo-Angular samples to use the latest NuGet package and with CORS support.</li>
</ul>

<h3>0.78.2<span class="doc-date">Dec. 17, 2012</span></h3>

<ul>
	<li>The <em>EntityQuery </em>methods <em>expand</em>, <em>select</em>, <em>orderBy </em>and <em>orderByDesc&nbsp;</em>will&nbsp;now accept an array of property path strings in addition to the previously supported comma delimited string.</li>
	<li>The <em>MetadataStore.registerEntityTypeCtor </em>method will now accept a null as its second parameter. See the API docs for more details.</li>
	<li>A JSON serialization fix was added to work around this IE bug: <a href="http://stackoverflow.com/questions/11789114/internet-explorer-json-net-javascript-date-and-milliseconds-issue">http://stackoverflow.com/questions/11789114/internet-explorer-json-net-javascript-date-and-milliseconds-issue</a></li>
	<li>The<em> EntityManager.fetchEntityByKey </em>method will no longer return &#39;deleted&#39; entities.&nbsp;This is a breaking change.</li>
</ul>

<h3>0.78.1<span class="doc-date">Dec. 16, 2012</span></h3>

<ul>
	<li>Support for Entity Framework <em>DbContext </em>validations on save, including serialization of server-side validation error messages back to the Breeze client.

	<ul>
		<li>The means that performing a Breeze <em>EntityManager.SaveChanges </em>call against any Entity Framework DbContext-based backend model will cause all registered <em>DbContext </em>validations to execute and any validation errors will cause the save to rollback.&nbsp;The validation errors encountered will then be sent back to the client.</li>
	</ul>
	</li>
</ul>

<h3>0.77.2<span class="doc-date">Dec. 14, 2012</span></h3>

<ul>
	<li>Bug fix for DateTime Timezone serialization issues. This affected both <em>EntityManager.SaveChanges </em>and <em>EntityManager.ImportEntities</em>.</li>
	<li>DataType.DateTime.defaultValue is now 1/1/1900 - This is the &#39;default&#39; date that will be set for any non-nullable DateTime properties after a call to EntityType.createEntity.
	<ul>
		<li>Note that you can change this default as long as the call to set this property occurs before entity metadata is fetched. For example:.
		<ul>
			<li>breeze.DataType.DateTime.defaultValue = new Date(2000, 0, 1);</li>
		</ul>
		</li>
	</ul>
	</li>
</ul>

<h3>0.77.1<span class="doc-date">Dec. 13, 2012</span></h3>

<ul>
	<li>Added support for cross-property query expressions. For example:
	<ul>
		<li>var shippedLateQuery = EntityQuery.from(&quot;Orders&quot;).where(&quot;requiredDate&quot;,&quot;&gt;&quot;,&quot;shippedDate&quot;);
		<ul>
			<li>The third parameter (&quot;shippedDate&quot; above) will be treated as either a property expression or a literal depending on context. In general, if the value can be interpreted as a property expression it will be, otherwise it will be treated as a literal.&nbsp;In most cases this works well, but you can also force the interpretation. Please see the API Docs for more details.</li>
		</ul>
		</li>
	</ul>
	</li>
</ul>

<h3>0.76.4<span class="doc-date">Dec. 12, 2012</span></h3>

<ul>
	<li>Bug fix to handle SQL Server Timestamp columns correctly.</li>
	<li>Bug fix to correctly handle Binary datatype conversions to Base64 encoded strings on the client.</li>
	<li>Cleanup of WebApi.dll - The <em>BeforeSaveEntity </em>and <em>BeforeSaveEntities </em>methods are now protected virtual instead of public virtual. This is a breaking change.</li>
</ul>

<h3>0.76.3<span class="doc-date">Dec. 11, 2012</span></h3>

<ul>
	<li>Bug fix involving an exception being thrown when a Knockout computed property defined in a ctor depends on a navigation property.</li>
</ul>

<h3>0.76.2<span class="doc-date">Dec. 9, 2012</span></h3>

<ul>
	<li>New <em>EntityQuery </em>method:<em><strong> </strong></em><em>withParameters</em>.&nbsp;This method allows custom parameters to be passed to any server side method, in addition to those that Breeze uses for its normal querying. Custom parameters can be mixed in with other query clauses. For example:</li>
</ul>

<p style="margin-left: 40px;">var query = EntityQuery.from(&quot;EmployeesFilteredByCountryAndBirthdate&quot;)<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; .withParameters({ BirthDate: &quot;1/1/1960&quot;, Country: &quot;USA&quot; })<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; .where(&quot;LastName&quot;, &quot;startsWith&quot;, &quot;S&quot;)<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; .orderBy(&quot;BirthDate&quot;);</p>

<ul>
	<li>Bug fix involving the <em>entityManager.export </em>method failing when encountering detached entities.</li>
</ul>

<h3>0.75.2<span class="doc-date">Dec. 7, 2012</span></h3>

<ul>
	<li>Bug fix for client side key fixup involving multipart foreign keys.</li>
</ul>

<h3>0.75.1<span class="doc-date">Dec. 7, 2012</span></h3>

<ul>
	<li>Added an &#39;inlineCount&quot; method to the <em>EntityQuery</em>.&nbsp;This provides, in addition to standard query results, the count of records that would be returned by this query if no &#39;skip&#39; or &#39;take&#39; option were included on the query.&nbsp;In other words, the count is calculated after applying any filters/where clauses but before any skip/take operations.&nbsp;See API Docs for more details.&nbsp;Both OData and Web API endpoints are supported with this feature.</li>
</ul>

<h3>0.74.3<span class="doc-date">Dec. 6, 2012</span></h3>

<ul>
	<li>Bug fix so that local queries now correctly interpret &#39;select&#39; clauses.</li>
	<li>Bug fix for local query failure when encountering detached entities.</li>
</ul>

<h3>New documentation<span class="doc-date">Dec. 3, 2012</span></h3>

<ul>
	<li>Query examples now shows how to <a href="http://www.breezejs.com/documentation/query-examples#queryByKey">Query by key</a>.</li>
</ul>

<h3>New sample<span class="doc-date">Dec. 1, 2012</span></h3>

<ul>
	<li>Added a new Todo-Angular sample that shows how to use AngularJS with Breeze.</li>
</ul>

<h3>0.74.2<span class="doc-date">Nov. 29, 2012</span></h3>

<ul>
	<li>Bug fix for incorrect &#39;added&#39; entity state with a custom server side entity graph.</li>
</ul>

<h3>0.74.1<span class="doc-date">Nov. 29, 2012</span></h3>

<ul>
	<li>Added new <em>EntityManager.FetchEntityByKey </em>method - see API docs for details.&nbsp;This method is currently in Beta and may change before release.</li>
	<li>Added new <em>EntityManager.GetEntityByKey </em>method - see API docs for details.</li>
	<li>Deprecated <em>EntityManager.FindEntityByKey </em>- the new <em>GetEntityByKey </em>method is a full replacement (with additional overloads).</li>
</ul>

<h3>New documentation<span class="doc-date">Nov. 27, 2012</span></h3>

<ul>
	<li>Added a new documentation section for patterns and practices called &#39;Cool Breezes&#39;. Three new articles there:
	<ul>
		<li><a href="http://www.breezejs.com/documentation/share-entitymanager">Share an EntityManager</a></li>
		<li><a href="http://www.breezejs.com/documentation/multiple-managers">Multiple Managers</a></li>
		<li><a href="http://www.breezejs.com/documentation/lookup-lists">Lookup Lists</a></li>
	</ul>
	</li>
</ul>

<h3>0.73.6<span class="doc-date">Nov. 27, 2012</span></h3>

<ul>
	<li>Automatic type coercion now occurs when constructing a query predicate where the property type and the value types are different.</li>
	<li>Bug fix for <em>EntityManager.hasChanges </em>event not firing after a successful save.</li>
	<li>Bug fix for query &quot;orderBy&quot; clauses with &quot;desc&quot;.</li>
	<li>Bug fix for multiple metadata controllers.</li>
	<li>Bug fix for error with concurrent metadata queries.</li>
</ul>

<h3>0.73.1<span class="doc-date">Nov. 21, 2012</span></h3>

<ul>
	<li><em>EntityManager hasChanges</em>, <em>getChanges</em>, and <em>getEntities </em>methods all now allow entity types to also be specified as strings.</li>
	<li>The EntityType <em>createEntity </em>method now accepts an optional initialization object containing initial property values.</li>
	<li>Changes to unmapped properties no longer trigger an <em>EntityState </em>change. This is a breaking change.</li>
	<li>A new <em>DataService </em>type has been added that represents the composite of a service name and a Breeze dataService adapter.&nbsp;This type will be extended in later releases.</li>
	<li><em>EntityManager ctor </em>and <em>setProperties </em>methods now also accept a &quot;dataService&quot; property within the configuration object.</li>
	<li>Fixed&nbsp;bug&nbsp;in Breeze.WebApi&nbsp;to better handle HTTP exceptions thrown within the API controller.</li>
	<li>The MetadataStore <em>fetchMetadata</em> method no longer supports a <em>dataServiceAdapterName </em>as its&nbsp;second parameter.&nbsp;The first parameter to <em>fetchMetadata </em>is now either a serviceName or an instance of the new <em>DataService </em>type (which provides the same capability).&nbsp;This is a breaking change.</li>
</ul>

<h3>New documentation<span class="doc-date">Nov. 19, 2012</span></h3>

<ul>
	<li><a href="http://www.breezejs.com/documentation/inside-entity">Inside the Entity</a></li>
	<li><a href="http://www.breezejs.com/documentation/customizing-ajax">Customizing AJAX</a></li>
	<li><a href="http://www.breezejs.com/documentation/projection-queries">Projection queries</a></li>
</ul>

<h3>0.72.1<span class="doc-date">Nov. 19, 2012</span></h3>

<ul>
	<li>Namespaces have been flattened&nbsp;to simplify the Breeze API.
	<ul>
		<li>The <em>entityModel </em>namespace has been made obsolete.&nbsp;All of the classes of the <em>entityModel </em>namespace have been promoted up to <em>breeze</em>.</li>
		<li>The <em>core.config </em>object has also been promoted up one namespace. i.e. <em>breeze.core.config </em>-&gt; <em>breeze.config</em></li>
		<li>The original&nbsp;namespaces and paths will be supported through June of 2013.</li>
	</ul>
	</li>
	<li>The <em>EntityType </em>ctor no longer supports the <em>metadataStore</em> and <em>serviceName</em> properties.&nbsp;This is a breaking change.
	<ul>
		<li>MetadataStore has a new addEntityType method that should be used in its place.</li>
		<li>There will be additional changes in this area in order to provide a simpler Metadata API for accessing non-Entity Framework and non-.NET services.</li>
	</ul>
	</li>
	<li>Fixed bug&nbsp;related to <em>EntityAspect.AcceptChanges </em>and &quot;Deleted&quot; entities.</li>
</ul>

<h3>0.71.3<span class="doc-date">Nov. 17, 2012</span></h3>

<ul>
	<li>Support for Entity Framework &quot;DataBase first&quot; <em>DbContext</em>

	<ul>
		<li><em>ObjectContext </em>and &quot;Code First&quot; DbContext were already supported.</li>
	</ul>
	</li>
	<li>Bug fixes related to <em>EntityAspect.RejectChanges </em>calls not correctly handling &quot;Deleted&quot; entities and firing too many &quot;propertyChange&quot; events.</li>
</ul>

<h3>0.70.1<span class="doc-date">Nov. 13, 2012</span></h3>

<ul>
	<li>New Plugin / Adapter model
	<ul>
		<li>The new model allows easy replacement or modification of existing adapters as well as a simple mechanism for adding new adapters.</li>
		<li>Allows custom, and therefore smaller, versions of&nbsp;Breeze to be created that support only selected adapters.</li>
		<li>The <em>core.config.setProperties</em> method has been marked obsolete.&nbsp;The <em>core.config.initializeAdapterInsta</em>nces method&nbsp;now provides similar functionality.&nbsp;See the API docs for more information.</li>
	</ul>
	</li>
	<li>New pluggable AJAX support - This provides capabilities ranging from the ability to control AJAX headers to the ability to completely replace or inherit from the default AJAX implementation.&nbsp;This means that any alternative AJAX library may be used as well as libraries that allow mocking AJAX calls, like Amplify.</li>
</ul>

<h3>New sample<span class="doc-date">Nov. 8, 2012</span></h3>

<ul>
	<li><a href="http://www.breezejs.com/samples/car-bones">Car Bones</a> - a new sample showing how to use Breeze with Backbone.</li>
</ul>

<h3>0.65.1<span class="doc-date">Nov. 6, 2012</span></h3>

<ul>
	<li>New <em>EntityManager.hasChanges </em>event. (See API docs)

	<ul>
		<li>This event makes it much easier to determine whether an <em>EntityManager </em>has any pending changes, without having to repeatedly ask it.</li>
	</ul>
	</li>
	<li>New <em>LocalQueryComparisonOptions</em> class. (See API docs)
	<ul>
		<li>This class addresses issues regarding differences between local query and remote query semantics by allowing the localQuery semantics to be adjusted to match those of a remote service.</li>
	</ul>
	</li>
</ul>

<h3>New tutorials<span class="doc-date">Nov. 1, 2012</span></h3>

<ul>
	<li>Breeze now has online <a href="http://learn.breezejs.com/" target="_blank">Tutorials</a> similar to Knockout. The first three are:

	<ul>
		<li>Basic queries</li>
		<li>Advanced queries</li>
		<li>Client-side caching</li>
	</ul>
	</li>
</ul>

<h3>0.64.6<span class="doc-date">Oct. 31, 2012</span></h3>

<ul>
	<li>Updated NuGet packages.</li>
	<li>Better error messages for failed queries.</li>
	<li>Bug fix for <em>FilterQueryOp.Contains</em>.</li>
</ul>

<h3>0.64.5<span class="doc-date">Oct. 25, 2012</span></h3>

<ul>
	<li>NamingConvention has two new static properties: &quot;camelCase&quot; and &quot;none&quot;.</li>
	<li>New Breeze.WebApi class: <em>JsonFormatterAttribute</em>.</li>
	<li>Bug with unidirectional navigation property setters fixed.</li>
</ul>

<h3>New documentation<span class="doc-date">Oct. 22, 2012</span></h3>

<ul>
	<li>Added the <a href="http://www.breezejs.com/documentation/start-nuget">Start with NuGet</a> topic which describes development of an ASP.NET MVC 4 Web API application with the Breeze NuGet packages.</li>
	<li>Revised the <a href="/samples/doccode">DocCode </a>sample documentation to reflect the changes for this release. The sample videos have not been updated yet.</li>
	<li>Simplified documentation in the <a href="/documentation/hosting-mvc-4">Breeze on the server</a> section in accord with the recommended NuGet development path.</li>
</ul>

<h3>0.64.3<span class="doc-date">Oct. 22, 2012</span></h3>

<ul>
	<li>Query and Save execution results returned via the WebApi provider now include the raw XHR response from the server as an additional property (see API docs).</li>
	<li>Improved error messages when metadata retrieval fails.</li>
	<li>Improved NuGet support for MVC4 Web projects (search for &quot;Breeze for MVC4&quot; on NuGet).</li>
	<li>Revised the <a href="http://www.breezejs.com/documentation/start-nuget">Breeze NuGet packages</a>. You can now start from the smaller &ldquo;ASP.NET MVC4 Empty&rdquo; project template as well as the larger &ldquo;ASP.NET MVC4 Web API&rdquo; template.</li>
	<li>The BreezyDevices, Todo, and DocCode samples have been rewritten to be consistent with a development path that begins with the &ldquo;ASP.NET MVC4 Empty&rdquo; project template followed by the &ldquo;Breeze.MVC4WebApi&rdquo; NuGet package.</li>
	<li>The DocCode sample no longer incorporates the Breeze Sample Todo; the Todo app stands on its own as a separate sample.</li>
</ul>

<h3>0.64<span class="doc-date">Oct. 17, 2012</span></h3>

<ul>
	<li>Visual Studio 2012 Intellisense support (see breeze.intellisense.js).</li>
	<li>NuGet support for MVC4 Web projects (search for &quot;Breeze for MVC4&quot; on NuGet).</li>
	<li>Misc small bug fixes having to do with automatic key generation and naming conventions.</li>
</ul>

<h3>New documentation<span class="doc-date">Oct. 16, 2012</span></h3>

<ul>
	<li><a href="/documentation/extending-entities">Extending Entities</a>.</li>
	<li><a href="/documentation/exportimport">Export/Import</a></li>
</ul>

<h3>0.63<span class="doc-date">Oct. 9, 2012</span></h3>

<ul>
	<li>First pass at Backbone support - still in Beta at this stage. Plugin API will be modified in a future release to make additional external library integration easier.&nbsp; Some of this work appears in this release.</li>
	<li>The <em>EntityType.RegisterEntityTypeCtor </em>method now has its post initialization logic run after entity materialization instead of before.</li>
	<li>Bug fix where wamingConventions were not being properly restored after a Metadata import.</li>
	<li>Misc smaller bug fixes.</li>
</ul>

<h3>0.62<span class="doc-date">Oct. 4, 2012</span></h3>

<ul>
	<li>Changes to the eventing model to support enabling and disabling event notification in a consistent manner for all events within Breeze.&nbsp; This includes the ability to enable and disable events at various levels of the Breeze object model hierarchy. More details may be found in the API docs under &#39;Event.enable&#39; and &#39;Event.isEnabled&#39;. As a result of these changes, two properties were removed from the <em>EntityManager </em>API because they are no longer needed.

	<ul>
		<li><em>EntityManager.entityChangeNotificationEnabled </em>- removed.&nbsp;Breaking Change.</li>
		<li><em>EntityManager.propertyChangeNotificationEnabled </em>- removed. Breaking Change.</li>
	</ul>
	</li>
	<li>Changes to Breeze metadata model - constructors are now provided for <em>EntityType</em>, <em>DataProperty </em>and <em>NavigationProperty</em>.
	<ul>
		<li>&nbsp;&nbsp; <em>DataProperty.isKeyProperty </em>-&gt; <em>DataProperty.isPartOfKey </em>Breaking Change.</li>
		<li>&nbsp;&nbsp; <em>DataProperty.maxLength </em>property was of type string. It is now numeric.<em><strong> </strong></em>Breaking Change.</li>
	</ul>
	</li>
	<li>Queries that fail will now include the failed query object as an additional &#39;query&#39; property attached to any error thrown.</li>
	<li>Additonal api documentation on <em>relationArrays</em>.</li>
	<li>Misc bug fixes.</li>
</ul>

<h3>0.61<span class="doc-date">Oct. 1, 2012</span></h3>

<ul>
	<li>NamingConvention functions now take an additional optional &#39;property&#39; parameter. See the API docs for more details.</li>
	<li>Only a single notification event is now fired per navigation collection during queries and imports. The single notification contains an array of all of the entities added or removed during the operation. Previously one notification was fired for each entity added or removed from a collection.</li>
	<li>All query results now include an additional &#39;query&#39; property that contains the original query object.</li>
	<li>Misc bug fixes especially related to knockout observable arrays and the importEntities functionality.</li>
</ul>

<h3>0.60<span class="doc-date">Sep. 27, 2012</span></h3>

<ul>
	<li>Added ability to register a post-create method to tweak an entity when created, imported or materialized by query. See <em>EntityMetadata.registerEntityTypeCtor </em>in the API docs.</li>
	<li>Unidirectional navigations are now supported. For example, you might want to allow orderDetail.product but not product.orderDetails.&nbsp; Previously only bidirectional navigations were supported.</li>
	<li>Server side save interception is now supported - see the <a href="/documentation/server-side-interception" target="_blank">Server-side Interception</a> topic in the documentation.</li>
	<li>Numeric validators now support an &#39;allowStrings&#39; boolean property that can be used as shown below.&nbsp; &#39;allowStrings&#39;&nbsp; may be used to perform a numeric validation on a property of type &#39;string&#39;.
	<ul>
		<li>var myValidator = Validator.number({allowString: true})</li>
		<li>myProp.validators.push(myValidator)</li>
	</ul>
	</li>
</ul>

<h3>0.59<span class="doc-date">Sep. 25, 2012</span></h3>

<ul>
	<li><strong>Breaking change</strong>: In order to avoid conflict with &quot;future&quot; JavaScript reserved words, we have changed the names of all methods named either <em><strong>import </strong></em>or <em><strong>export</strong></em>. See <a href="https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Reserved_Words">https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Reserved_Words</a>

	<ul>
		<li><em>EntityManager </em>methods: <em>import </em>-&gt; <em>importEntities</em>, <em>export </em>-&gt; <em>exportEntities</em></li>
		<li><em>MetadataStore </em>methods: <em>import </em>-&gt; <em>importMetadata</em>, <em>export </em>-&gt; <em>exportMetadata</em></li>
	</ul>
	</li>
	<li>All sample projects have been converted to load and run cleanly in VS 2012 (as well as VS 2010).</li>
</ul>

<h3>0.58<span class="doc-date">Sep. 24, 2012</span></h3>

<ul>
	<li>Improve Breeze&#39;s AMD access pattern for Knockout and jQuery. Breeze is now always accessible globally (window.breeze) and through requireJS when window.define is a functoin .</li>
	<li>Minor bug fixes.</li>
</ul>

<h3>0.57<span class="doc-date">Sep. 24, 2012</span></h3>

<ul>
	<li>Breeze.WebApi dependency changed from EF 4.3.1 to EF 5 - Breeze.webApi can still be built against EF 4.3.1. &nbsp;</li>
	<li>AMD bug fixed to allow exposure of window.breeze.</li>
</ul>

<h3><br />
0.56<span class="doc-date">Sep. 21, 2012</span></h3>

<ul>
	<li>Remove requirement that <em>EFContextProvider </em>pass in a context name for an <em>ObjectContext</em>.</li>
	<li>Fixes for <em>EFContextProvider </em>issues with KeyGeneration when using an <em>ObjectContext</em>.</li>
</ul>

<h3>0.55<span class="doc-date">Sep. 19, 2012</span></h3>

<ul>
	<li>Server model classes can be in different assembly and namespace; <em>EFContextProvider </em>will find them.</li>
	<li>No longer automatically validates deleted entities as their validation state is typically irrelevant. Can still validate them manually if you wish.</li>
	<li><em>EFActionFilter </em>replaced by properly named <em>ODataActionFilter</em>; <em>EFActionFilter </em>deprecated.</li>
	<li>Other fixes.</li>
</ul>

<h3>0.54<span class="doc-date">Sep. 18, 2012</span></h3>

<ul>
	<li>NamingConvention support and minor bug fixes.</li>
</ul>

<h3>0.53<span class="doc-date">Sep. 17, 2012</span></h3>

<ul>
	<li>First public release.</li>
</ul>
