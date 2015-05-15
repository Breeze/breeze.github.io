---
layout: doc-main
title: FAQ
---
<h1>Frequently asked questions</h1>

<ul>
	<li><a href="#cost">How much does Breeze cost?</a></li>
	<li><a href="#support">How can I get support?</a></li>
	<li><a href="#handcuff">Is Breeze handcuffed to .NET?</a></li>
	<li><a href="#database">What databases does Breeze support?</a></li>
	<li><a href="#browsers">What browsers does Breeze support?</a></li>
	<li><a href="#learn-breeze">Where can I learn more about Breeze?</a></li>
	<li><a href="#learn-spa">Where can I learn more about building SPAs?</a></li>
	<li><a href="#multiple-entities">Can you add multiple entities on the client and then save in bulk across the wire?</a></li>
	<li><a href="#manage-relationship">Will Breeze manage the relationship on the client even though you have no key value yet?</a></li>
	<li><a href="#cache-options">Are there caching options like expiration?</a></li>
	<li><a href="#store-cache">Can I store the cache contents somewhere (semi-) permanently?</a></li>
	<li><a href="#html5-validation">Will it take advantage of HTML5 validation if present, so we don&#39;t have to manually add attributes?</a></li>
	<li><a href="#self-tracking">How smart is the self-tracking?</a></li>
	<li><a href="#mock-data-library">Can you integrate with mock data libraries? </a><br />
	&nbsp;</li>
</ul>

<p><strong><a id="cost" name="cost"></a>How much does Breeze cost?</strong></p>

<p>Breeze is free and open source through the <a href="http://opensource.org/licenses/mit-license.php" target="_blank">MIT license</a>.</p>

<p>&nbsp;</p>

<p><strong><a id="support" name="support"></a>How can I get support?</strong></p>

<p>Just because Breeze is free and open source doesn&#39;t mean that you&#39;re on your own. We sell <a href="http://www.breezejs.com/support">support packages</a> to ensure you have the help to succeed.</p>

<p>If you want to build your app really fast, contact our <a href="http://www.ideablade.com/professional-services/professional-services.aspx" target="_blank">Professional Services team</a>.</p>

<p>&nbsp;</p>

<p><strong><a id="handcuff" name="handcuff"></a>Is Breeze handcuffed to .NET?</strong></p>

<p>BreezeJS is a pure JavaScript library for building Single Page Applications in HTML and JavaScript. Technically, the server technology does not matter. Breeze works with any server capable of delivering data in response to an HTTP request. The server could be running Microsoft&#39;s ASP.NET. Or it could be running node, Rails, PHP, Java. BreezeJS neither &quot;knows&quot; nor &quot;cares.&quot;</p>

<p>But we understand why you <a href="http://www.breezejs.com/blog/handcuffed-microsoft">might think otherwise</a>.</p>

<p>&nbsp;</p>

<p><strong><a id="database" name="database"></a>What databases does Breeze support? What about NoSQL databases like MongoDB?</strong></p>

<p>Any standard SQL&nbsp;database like Oracle, MySQL, MariaDB, SQLServer, etc&nbsp;is supported out of the box as long as there is an <a href="http://msdn.microsoft.com/en-us/data/dd363565" target="_blank">Entity Framework Provider</a> for it (and almost all of them do).</p>

<p>Breeze supports <a href="http://www.breezejs.com/documentation/mongodb">MongoDB</a>, and for other NoSQL databases Breeze&nbsp;exposes a lower level IQueryable interface that allows querying these databases through a LINQ provider. Many of the most common NoSQL databases have such a provider. Saves to NoSQL databases are more complicated and do require customized code for each NoSQL database. We can provide these server side adapters as part of our consulting services.</p>

<p>&nbsp;</p>

<p><strong><a id="browsers" name="browsers"></a>What browsers does Breeze support?</strong></p>

<p>Breeze works out-of-the-box with all&nbsp;modern browsers on desktop and mobile devices. These browsers implement the current JavaScript standard, known as ECMAScript 5 (ES5), which Breeze uses internally.</p>

<p>Older browsers (such as IE 8) implement the prior ES3 standard. Fortunately, you can enable ES5 syntax on these browsers by adding a JavaScript &quot;shim&quot; library to your page. See the&nbsp;<a href="http://www.breezejs.com/documentation/prerequisites">Prerequisites</a> topic for more details and a specific list of supported browser versions.</p>

<p>&nbsp;</p>

<p><strong><a id="learn-breeze" name="learn-breeze"></a>Where can I learn more about Breeze?</strong></p>

<ul>
	<li><strong>Documentation</strong><br />
	Not to brag, but the <a href="http://www.breezejs.com/documentation/introduction">documentation here on the Breeze website</a> is pretty good. Same goes for the <a href="http://www.breezejs.com/sites/all/apidocs/index.html" target="_blank">Breeze API</a>. Both are indexed and searchable.</li>
	<li><strong>Troubleshooting</strong><br />
	Community support for Breeze can be found on Stack Overflow. We look for <a href="http://stackoverflow.com/questions/tagged/breeze" target="_blank">questions using the Breeze tag</a>.</li>
	<li><strong>Feature suggestions</strong><br />
	Suggest and vote on <a href="https://breezejs.uservoice.com/forums/173093-breeze-feature-suggestions" target="_blank">new features on UserVoice</a> to let us know what you&#39;d like to see next.</li>
</ul>

<p>&nbsp;</p>

<p><strong><a id="learn-spa" name="learn-spa"></a>Where can I learn more about building SPAs (Single Page Applications)?</strong></p>

<p>One of the best places to learn about building SPAs is John Papa&rsquo;s Pluralsight video course &ldquo;<a href="http://pluralsight.com/training/Courses/TableOfContents/spa" target="_blank">Single Page Apps with HTML5, Web API, Knockout and jQuery</a>&rdquo;. He explains and demonstrates many valuable tools and techniques that you&rsquo;ll use in your application.</p>

<p>He didn&rsquo;t use Breeze &hellip; because it wasn&rsquo;t available at the time. However, John Papa is preparing a new SPA course using Breeze called&nbsp;Code Camper Jumpstart. <a href="http://www.johnpapa.net/recent-presentation-on-spa-basics/" target="_blank">See John&#39;s blog to learn more.</a></p>

<p>&nbsp;</p>

<p><strong><a id="multiple-entities" name="multiple-entities"></a>Can you add multiple entities on the client (like new customer, new order, new order details) and then save in bulk across the wire? </strong></p>

<p>Yes. You can add a variety of entities to the cache and they can all have different operations pending. For example, you could have added a new order line item to an existing order, deleted a line item, and modified the ship date to the order. So you have three entities (one Order, two LineItems) in three different states (new, deleted, changed). You call saveChanges() and they all go up to the server together as a single change-set. Assuming the server plays along, it saves them as a single transaction.</p>

<p>&nbsp;</p>

<p><strong><a id="manage-relationship" name="manage-relationship"></a>Will Breeze manage the relationship on the client even though you have no key value yet?</strong></p>

<p>Yes. Breeze supports a variety of store-generated key strategies out of the box and you can add your own. Assume for example, that Order has an integer identity key. Breeze assigns it a temporary key while in cache. All of the related LineItems have that temporary value in their &ldquo;OrderID&rdquo; foreign key (these property names can be whatever). After save, the permanent ID comes down to the client inside the Order (and the LineItems). If there were another unsaved entity that referred to that Order (perhaps saved only some of the changed entities), Breeze will fix-up that entity&rsquo;s FK value to match the new permanent ID.</p>

<p>&nbsp;</p>

<p><strong><a id="cache-options" name="cache-options"></a>Are there caching options like expiration?</strong></p>

<p>No. This is an important difference with server side caching. A server side cache does not have to worry about lingering references to cached data. When it evicts something, it doesn&rsquo;t break any references. The next request for that thing results in a refetch; no biggie.</p>

<p>It&rsquo;s different on the client where state lasts a long time and there are many possible consumers of the same entity at any one time. If we arbitrarily evicted an entity, we&rsquo;d break whatever other object (a ViewModel?) had a reference to it and expected it to be alive in cache.</p>

<p>That said, you have complete control over the cache. If you know what the lifetimes of the entities are, you can evict them. You can make as many caches as you like so you can sandbox data into different workflows and manage them separately.</p>

<p>It&rsquo;s easy to refresh an entity or a collection of entities at any time without breaking the object references or removing them from cache. So you could set up your own MRU or refresh timer policy for refreshing periodically &hellip; or evicting old stuff if you know it is safe to do so.</p>

<p>It would be cool to hook up to something like <a href="https://github.com/SignalR/SignalR" target="_blank">SignalR </a>to learn about server-side changes (e.g., truck changed location, new order arrived, etc.), and respond to that signal with a refresh.</p>

<p>&nbsp;</p>

<p><strong><a id="store-cache" name="store-cache"></a>Can I store the cache contents somewhere (semi-) permanently?</strong></p>

<p>Yes. The cache manager, called the EntityManager, can export all or a portion of its cache contents as a serialized string &hellip; which you can then store wherever you like. Reimport that string to re-populate that EntityManager &hellip; or any other EntityManager. We have a couple of examples of storing to browser local storage and restoring from there to a new EntityManager.</p>

<p>&nbsp;</p>

<p><strong><a id="html5-validation" name="html5-validation"></a>Will it take advantage of HTML5 validation if present, so we don&#39;t have to manually add attributes?</strong></p>

<p>We assume you are hoping to avoid adding all of those HTML validation attributes that put validation logic in your HTML instead of in your model.</p>

<p>We&#39;re looking at the &ldquo;Custom Validation&rdquo; section of Stephen Walther&rsquo;s &nbsp;<a href="http://stephenwalther.com/archive/2012/03/13/html5-form-validation.aspx" target="_blank">post on HTML 5 Validation</a> for reference where he attaches an event listener to an element and calls setCustomValidity with the error message. You could use that technique to pass through to the Breeze validator for the corresponding model property and let Breeze apply all of the appropriate validations for that property and forward its error messages to the UI.</p>

<p>Apparently the&nbsp;Knockout&nbsp;Validation library does something like this.&nbsp;We will explore options for integrating Breeze and HTML 5 validation in the near future. Stay tuned.</p>

<p>&nbsp;</p>

<p><strong><a id="self-tracking" name="self-tracking"></a>How smart is the self-tracking? Can it differentiate between an add, insert, delete?</strong></p>

<p>Yes. Each entity has an EntityState enum in the set {Added, Modified, Deleted, Unchanged, Detached}. If the entity was changed, you have access to the origina&rdquo; values for the properties that changed.</p>

<p>&nbsp;</p>

<p><strong><a id="mock-data-library" name="mock-data-library"></a>Can you integrate with mock data libraries?</strong></p>

<p>We mock up entities all the time when testing and demonstrating Breeze features. We throw entities into the cache that we make appear to have been queried from remote storage by changing their EntityState to &ldquo;Unchanged&rdquo;.</p>

<p>Because you query the cache with the same query object that you&rsquo;d use to query the server &hellip; and we always run ViewModel logic through a dataservice/repository layer &hellip; it&rsquo;s easy to redirect queries to the in-cache fakes rather than the server.</p>

<p>Note also that we can keep this cache of fakes in an EntityManager that is separate from the one used by the application workflow. So the results of a query against this Cache-&lsquo;O-Fakes can be poured into your working EntityManager <em>as if they had come over the wire</em>. Copying entities between EntityManagers is trivial. Faking the save is only slightly more difficult.</p>

<p>You&rsquo;d still have to map the results of a mocking library (say, <a href="https://github.com/mennovanslooten/mockJSON" target="_blank">mockJSON</a>) into entities. That shouldn&rsquo;t be hard &hellip; no harder than creating entities with fake data by hand. Hope to have an example&nbsp;in the&nbsp;coming weeks. But&nbsp;why should you wait?&nbsp;All the better if you beat us to it. Let us know if you need help.</p>

<p>&nbsp;</p>

