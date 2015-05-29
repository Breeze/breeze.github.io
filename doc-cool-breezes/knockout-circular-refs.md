---
layout: doc-cool-breezes
redirect_from: "/old/documentation/.html"
---
#Grids and Knockout circular references#

We may run into trouble when we try to display Breeze entities in a vendor grid control.

We run into two kinds of trouble. The grid doesn't understand that Knockout properties are implemented as functions. And the grid throws an exception when it encounters circular references in Breeze entities.
 
Here is an <a href="http://stackoverflow.com/questions/16696307/unwrapping-breeze-entity-properties/16701682#16701682" target="_blank">example post from Stack Overflow</a> of someone who ran into both problems ... and our slightly re-worded reply.

----------

Many vendor grids complain about circular references (or throw an "out of memory"). Shame on them.

Circular references are a natural feature of entity models. Consider a <span class="codeword">Customer.Orders</span> property that returns the customer's orders and each order has a <span class="codeword">Order.Customer</span> navigation property to get back to its parent customer. This is to be expected. Grids should handle this.

You can even get a circular reference problem with a Breeze entity that has no circular navigation paths. The difficulty stems from the fact that every Breeze entity has an inherent circularity by way of its <span class="codeword">entityAspect</span> property:</p>

<pre class="brush:jscript;">
something.entityAspect.entity //&#39;entity&#39; points back to &#39;something&#39;</pre>

Many of these grids also don't recognize that Knockout properties are implemented as functions. 

Fortunately, you can get around both problems fairly easily as long as you're using the grid to display read-only data. It gets more complicated if the user will be editing within the grid. 

In this tip, we'll assume that you're using the grid for display only and that the entities you will display have no navigation paths (no related entities). 

The first step is to unwrap the KO observable object(s) with the <span class="codeword">ko.toJS</span> method. This method returns copies of the observable object(s) with JavaScript value properties instead of KO observable function properties. It recursively unwraps every ko.observable function. 

<p class="note">Take careful note: this method makes a deep copy of every value of every entity in the collection. You may want to look at a different strategy if your collection contains deep object graphs with lots of navigation properties.</p>

Because your entity has no navigation properties (*it is not related to anything*), you only have to worry about the circularity created by the Breeze <span class="codeword">entityAspect</span> property. The following approach may work for you:</p>

<pre class="brush:jscript;">
manager.executeQuery(query).then(success).fail(handleFailure);

function success(data) {
    var unwrapped = ko.toJS(data.results).map(
                           function(entity) {
                              delete entity.entityAspect;
                              return entity;
                           });
    yourGrid.mergeData(unwrapped, args.pageNum, data.inlineCount);
})
</pre>

After <span class="codeword">ko.toJS</span> unwraps the entities, we iterate over these copies, deleting their <span class="codeword">entityAspect</span> properties.

If the entities had navigation properties that were giving you trouble, you could follow the pattern and zap them too.</p>

##Consider projections instead##
You may be paying a double performance price when you don't have to. The query may be pulling more data over the wire than you need to display. And <span class="codeword">ko.toJS</span> may be copying values that you aren't going to display either.

The cost may be negligible and having those entities in cache for some future purpose could save you unnecessary server trips down the line. Only you know what's best for your application.

But if you're only interested in a subset of data for the read-only grid and you don't need to cache the entities, you should consider using a projection query instead.

Construct a query <a href="/doc-js/query-examples#Projection (Selection)  EntityQuery.select" target="_blank">using a <span class="codeword">select</span> clause</a> that names just the property values you'll display in your grid (plus the entity key so you can get the full entity later when you need to).

A projection query returns JavaScript objects with raw property values. You won't need to unwrap them with <span class="codeword">ko.toJS</span>.

Of course the query won't be adding entities to cache. Note also that, if there are  corresponding entities in cache with unsaved changes, the user won't see those changes. She'll see whatever values are currently on the server.  That could be confusing ... or not.
