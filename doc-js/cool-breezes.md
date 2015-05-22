---
layout: doc-js
---
<h1>
	Cool Breezes</h1>
<p>Cool Breezes are tips and techniques for using Breeze in real applications.</p>
<p>&nbsp;</p>
<h2>
	<a href="http://www.breezejs.com/documentation/share-entitymanager">Share a single EntityManager</a></h2>
<p>An EntityManager is both a gateway to a service and a local cache of entities. A single EntityManager will often suffice for applications that communicate with one service and can share a single cache of entities with every application view.</p>
<h2>
	<a href="http://www.breezejs.com/documentation/multiple-managers">Multiple EntityManagers</a></h2>
<p>Many applications need only one EntityManager. Some applications should have more than one EntityManager. This topic explains when multiple managers are advantageous and how to create multiple managers when you need them.</p>
<h2>
	<a href="http://www.breezejs.com/documentation/lookup-lists">Lookup Lists</a></h2>
<p>Many applications display lots of selectable forms each populated with a list of options whose values come from the database. Unfortunately, there could be a lot of them; a typical medium-sized application might have twenty or thirty. Separate calls to the server might take too long even if you can make those calls asynchronously in parallel. It would be nice to fetch all of the lists in one shot. Here&#39;s how.<br />
	&nbsp;</p>
