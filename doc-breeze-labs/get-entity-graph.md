---
layout: doc-breeze-labs
redirect_from: "/old/documentation/.html"
---
#Get entity graph from cache

Sometimes you hold one more root entities and want both those roots **and their related entities** in a single array. That array represents the "entityGraph" of the root(s).

The **`EntityManager.getEntityGraph` extension method** is a breeze lab that does the trick.

<p class="note">Please keep in mind that <b>Breeze Labs</b> are not part of core Breeze. The <code>EntityManager.getEntityGraph</code> method may change or be replaced by something in core Breeze itself.</p>

## How to install it

Download the [raw JavaScript file from github](https://github.com/Breeze/breeze.js.labs/blob/master/breeze.getEntityGraph.js "breeze.getEntityGraph.js on github").

Include it among your loaded scripts, *after* breeze itself. It also can be loaded dynamically via *require.js*.

## Usage

Once loaded, the script extends the `EntityManager` with a `getEntityGraph` class (static) method and extends the `EntityManager.prototype` with an instance `getEntityGraph` method.

Both instance and class methods can return an entity graph for one or more root entities that belong to *any* `EntityManager`. Some examples:

    var getEntityGraph = breeze.EntityManager.getEntityGraph;
    var graph;
    var orders; // a small array of orders for which you want graphs
  
    // the orders and their details
    graph = getEntityGraph(orders, 'OrderDetails');
   
    // 1st order's customer and its details
    graph = getEntityGraph(orders[0], 'Customer, OrderDetails');
  
    // 1st order's details and related products
    graph = getEntityGraph(orders[0], 'OrderDetails.Product');

<p class="note">The <a href="https://github.com/Breeze/breeze.js.samples/blob/619eb2bb27d0fc55f56b0d73f0966bbfdda5fa12/net/DocCode/DocCode/tests/getEntityGraphTests.js" target="_blank" title="getEntityGraphTests.js in DocCode"><em>getEntityGraphTests.js</em> file in DocCode</a> provides several examples, including examples that show what happens when you make invalid requests.</p>

The instance version can execute a query locally and return the entity graph for the results rather than just the query result roots:

    var em; // an EntityManager instance with cached query results
    var query = breeze.EntityQuery.from('Customers')
                .where('CompanyName', 'startsWith', 'Alfreds')
                .expand('Orders');
  
    // the 'Alfred' customers and their orders
    graph = em.getEntityGraph(query);

    // the 'Alfred' customers, their orders, and their details
    // the explict expand overrides the query expandClause
    graph = em.getEntityGraph(query, 'Orders.OrderDetail');

**Important**: we passed the query into the `getEntityGraph` method for a specific manager, `em`; we did not (and could not) call the static function with a query.

## Graph entities are distinct; the order is indeterminate
The function removes duplicates from the returned entity graph. If several orders refer to the same customer, that customer will appear only once in the results.

You must not rely on the order of graph results. Today's implementation may return the entities in one order; tomorrow's implementation may return them in a different order. Changing the order will not be a breaking change. You have been warned.
 
## Graph includes deleted entities

Unlike a query, the returned entity graph includes entities in all `EntityStates` including 'Deleted' entities. This is deliberate.  

Suppose you want to export the entire order graph to file or to another `EntityManager`. You want to be sure to export *the entire graph*, including entities marked for deletion.

    /* The History of Change */

    var details = someOrder.getProperty('OrderDetails');

    // mark first detail for delete; Breeze removes it from details
    details[0].entityAspect.setDeleted(); 

    /* NOT what you want because omits deleted details */
    var badGraph = details.concat(someOrder);

    /* DO it this way */
    graph = getEntityGraph(someOrder, 'OrderDetails');
    var exported = em.exportEntities(graph, false); // false == exclude metadata

    /* Create new EntityManager and import complete graph */
    var em2 = em.createEmptyCopy();
    em2.importEntities(exported);

It's pretty easy to filter out the deleted entities if you really don't want them.

    graph = getEntityGraph(someOrder, 'OrderDetails')
            .filter(function(entity) {
                return entity.entityAspect.entityState !== breeze.EntityState.Deleted;
            });

<a name="save-graph"></a>
## Save the graph of changed entities

A popular use case for `getEntityGraph` is to build a change-set of entities to save that is **limited to the graph of changes to a particular root and its descendants**.

For example, you might want to save all pending changes related to a *particular order* ... but not the pending changes to any other order.

    /* A history of changes to the order and its details */

    // The full graph, changed and unchanged
    var graph = getEntityGraph(someOrder, 'OrderDetails');
 
    // Filter for changes only   
    var changes = graph.filter(function(entity) {
        return !entity.entityAspect.entityState.isUnchanged();
        // return entity.entityAspect.entityState !== breeze.EntityState.Unchanged; // or ...
        // return entity.entityAspect.entityState.isAddedModifiedOrDeleted(); // or
    });

    // Lets export the changes first ... for fun (not necessary)
    var exported = em.exportEntities(changes , false);

    // Now save just the changes to this one order and its details
    em.saveChanges(changes);

### Beware

Our strong preference is to let the `EntityManager` find and save all changes rather than try to pick which changes to save and which to leave unsaved in a changed state.

Cherry picking which entities to save is fraught with danger. It is easy to forget to include something that *should have been saved in the same transaction*.

The `getEntityGraph` method helps ... but **it is up to you** to ensure that the expand string (which defines the graph) gives the proper coverage.
