---
layout: doc-js
redirect_from: "/old/documentation/.html"
---

#Creating a new entity

Breeze creates new entity instances on two primary occasions: (1) when it "**materializes**" entities from query results and (2) when you ask it to **create **a brand new entity.

Entity materialization is largely hidden from the developer. You issue a query; you get entities back. Behind the scenes Breeze converts the stream of model object data into entities in cache. The developer only becomes aware of entity creation details when making new model objects.

##Don&#39;t use "new"

You might expect to make a model object by calling *new *on a constructor function:

<pre class="brush:jscript;">
  var newCust = new Customer(); // rarely done in Breeze

You can do it this way ... if you&#39;ve defined a *Customer *constructor and registered it with Breeze. But most Breeze developers don&#39;t define entity constructors or, if they do, they define only a subset of the entity&#39;s properties and methods (see the "<a href="/doc-js/extending-entities.html" target="_blank">Extending entities</a>" topic).

It&#39;s preferable to let Breeze create the entity based on entity type information gleaned from <a href="/doc-js/extending-entities.html" target="_blank">metadata acquired from the remote data service</a> ... in which case there is no constructor to "*new up*".

##EntityManager.createEntity

The standard approach is to call the Breeze ***createEntity ***factory function on an *EntityManager*:

<pre class="brush:jscript;">
var newCust = manager.createEntity(&#39;Customer&#39;, {name:&#39;Acme&#39;});

The first parameter is the name of the <span class="codeword">EntityType</span>; don&#39;t confuse the "type name" (&#39;Customer&#39;) with the similar "resource name" (&#39;Customers&#39;) that you use in a query.

In this example, we also passed in an optional property initializer hash that sets the new customer&#39;s name: <span class="codeword">{name: &#39;Acme&#39;}</span>.

You may not need an initializer. But If the entity key is ***client ***generated, then you **must **specify the key in the initializer ... or you&#39;ll likely get an exception.

<pre class="brush:jscript;">
// The Northwind OrderDetail has a composite key consisting of 
// its parent order and product ids.
var newOrderDetail = 
    manager.createEntity(&#39;OrderDetail&#39;, {orderId: oid, productId: pid});

The <span class="codeword">createEntity</span> method adds the entity to the manager because that&#39;s what you usually want to do with a newly created entity. Alternatively, you can provide the optional third parameter specifying the <span class="codeword">EntityState</span> to keep the entity detached or maybe attach it in some other state.

<pre class="brush:jscript;">
var EntityState = breeze.EntityState;

// unattached new customer
// you can keep configuring it and add/attach it later
var newCust = manager.createEntity(&#39;Customer&#39;, {name:&#39;Beta&#39;}, EntityState.Detached);

// attached customer, as if retrieved from the database
// note that the id must be specified when attaching an &#39;existing&#39; entity
var oldCust = manager.createEntity(&#39;Customer&#39;, {id: 42, name:&#39;Gamma&#39;}, EntityState.Unchanged);

##EntityType.createEntity

The <span class="codeword">createEntity</span> method of the *EntityManager* is shorthand for something like:

<pre class="brush:jscript;">
var metadataStore = manager.metadataStore; // model metadata known to this EntityManager instance
var customerType = metadataStore.getEntityType(&#39;Customer&#39;); // metadata about the Customer type 
var newCust = customerType.createEntity({name:&#39;Acme&#39;}); // call the factory function for the Customer type
manager.addEntity(newCust); // attach the entity as a new entity; it&#39;s EntityState is "Added"


Why would you ever want to write **that**? Perhaps you are creating hundreds of new customer entities all at once. With the longhand version, you can avoid the cost of finding the <span class="codeword">customerType</span> for each new customer.

Four important facts about this approach:


	<li>Breeze creates the data properties and entity navigation properties based on metadata.
	<li>Breeze defines these properties in the manner appropriate for the model library you choose
	<li>The new object is "wired up" as a Breeze entity
	<li>The new object is "detached" and does not belong to any *EntityManager *cache until you attach it explicitly


The first fact means you don&#39;t have to worry about keeping your client-side *Customer *definition aligned with the server-side *Customer *definition if you&#39;re getting your metadata from the server. Change the server-side definition and the client-side definition updates automatically.

The second fact means that *newCust *is shaped to match your model preference. If you configured Breeze for Knockout, *newCust *has a *CompanyName()* observable function for getting and setting the name. If you configured Breeze for backbone, *newCust *understands *get("CompanyName")* and *set("CompanyName")* and the *newCust *is observable in the backbone manner.

The third fact means *newCust *has embedded Breeze capabilities you can tap via the *newCust.entityAspect* property. We&#39;ll talk about <a href="/documentation/inside-entity">***entityAspect ***in the next topic</a>.

The fourth fact means some of *newCust*&#39;s Breeze capabilities are temporarily disabled until you attach it to the manager. For example, if we stopped at line #3, the *newCust* couldn&#39;t navigate to related entities in cache because it&#39;s not in a cache. Only after the fourth line ...

<pre class="brush:jscript;">
manager.addEntity(newCust);

... is the *newCust *ready to behave both as a *Customer *and as an *entity*.
