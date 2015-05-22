---
layout: samples
---
<style>
.nestedList {
  margin: 4px 0 10px 20px;
  font-family: 'OpenSansRegular';
  font-size: 16px;
}
.bigRed {
  font-size: 200%;
  font-weight: bold;
  color: red;
  margin-right: 2px;
}
.boldBlue {
  font-weight: bold;
  font-size: 150%;
  color: #4183c4;
}
table.stack {
  margin-left: 20px;
  width: 0;
  border-collapse: collapse;
  border-style: none;
  font-family: 'OpenSansRegular';
  font-size: 16px;
}
table.stack tr {
  vertical-align: top;
}
table.stack tr td {
	padding:  0 0 0;
}
td.stack {
  padding-top: .7em !important;
  padding-left: .5em !important;
}

</style>

#![Zza!](/images/samples/zza-sample.png) <span style="font-size: 300%">Zza!</span> (Node/MongoDB)

**Zza!** is a single page application (SPA) for ordering pizzas, salads and drinks.

It's **100% JavaScript**, written for <a href="http://http://nodejs.org/" target="_blank">Node.js</a> running <a href="http://expressjs.com/" target="_blank">Express</a>, and uses a <a href="http://www.mongodb.org/" target="_blank">MongoDB</a> database.

Zza! uses the **BMEAN** stack:

<table class="stack">
<tr><td><span class="bigRed">B</span><span class="boldBlue">reeze</span></td>
<td class="stack">client-side data modeling and data access</td></tr>
<tr><td><span class="bigRed">M</span><span class="boldBlue">ongo</span></td>
<td class="stack">server-side document-oriented database</td></tr>
<tr><td><span class="bigRed">E</span><span class="boldBlue">xpress</span></td>
<td class="stack">server-side web application framework on node</td></tr>
<tr><td><span class="bigRed">A</span><span class="boldBlue">ngular</span></td>
<td class="stack">client-side presentation framework</td></tr>
<tr><td><span class="bigRed">N</span><span class="boldBlue">ode</span></td>
<td class="stack">server-side platform for web applications</td></tr>
</table>
Breeze works well with Microsoft technologies as we've demonstrated many times. It also works well *outside* the Microsoft ecosystem. To drive that point home, this sample has ...
<div class="nestedList">
no C#<br/>
no ASP.NET<br/>
no Web API<br/>
no IIS<br/>
no Entity Framework<br/>
no SQL Server
</div>

# Download

Download [ALL of the Breeze JavaScript samples from github](https://github.com/Breeze/breeze.js.samples "breeze.js.samples on github") as [a zip file](https://github.com/Breeze/breeze.js.samples/archive/master.zip "breeze.js.samples zip file").

In this case we're interested in the "Zza" sample, located in the *node/zza-node-mongo* directory. These instructions assume this will be your current working directory.

At the top level you will find:

* a <a href="https://github.com/Breeze/breeze.js.samples/blob/master/node/zza-node-mongo/readme.md" target="_blank" title="readme.md on github"><strong>readme.md</strong></a> explaining how to install and run the app
* the Zza! Mongo **database** folder
* the **client** folder full of client application **HTML, CSS, and JavaScript**
* the **server** folder containing the node/express server application JavaScript.

You can view, edit, and run the code in this project using the tools of your choice.

<p class="note">The sample assumes that you've installed <strong>node.js</strong> and <a href="http://blog.mongodb.org/post/82092813806/mongodb-2-6-our-biggest-release-ever"
  target="_blank" title="MongoDb release 2.6 announcement"><strong>MongoDb >= v.2.6</strong></a></p>

# Run it!

The *readme.md* has the details. Just remember the three basic steps:

1. Start your MongoDB server: <code>mongod</code>
2. Start the Node/Express server: <code>node server</code>
3. Launch a browser and navigate to <code>localhost:3000</code>

The app should load on the home screen with a big picture of "Zza" himself. Click the "Order" link in the menu bar and you'll see what's on the menu beginning with pizzas.

<img src="/images/samples/ZzaPizzaProductsEmpty.jpg" style="width:100%; max-width:645px;">

The "Salad" and "Drinks" links switch the view to similar views of those products.

You want the "Holy Smokes" pizza so you click on it. You're taken to a screen where you can pick the size and add toppings. Go for the "Large", pick the "Wheat Crust", and pile on some "BBQ Chicken" from the "Meat" toppings. You're hungry so why not order two of these babies?

<img src="/images/samples/ZzaHolySmokesOrder.jpg" style="width:100%; max-width:643px;">

The dashboard on the left displays that we're considering a "Holy Smokes" pizza but haven't put it in our cart yet. Click the "Add to Cart" button and it moves up the dashboard into the "Order Summary" panel.

Click the "View Cart" link (or the "Cart" button on the upper-right) and we'll see our order so far:

<img src="/images/samples/ZzaHolySmokesCart.jpg" style="width:100%; max-width:601px;">

Go back to "Order" and load up on Salads and Drinks.

# Inside the app #
A single web page, *index.html*, frames the story. Most of it is css and JavaScript file loading. In the middle there's a tiny bit of layout:

    <body class="ng-cloak" data-ng-app="app">
    
        <!-- *** Shell of the SPA  *** -->
        <div data-ui-view="header"></div>
    
        <div id="shell-content" data-ui-view="content"></div>
    
        <div data-ui-view="footer"></div>
    
        <!-- *** Vendor scripts  *** -->
        <!-- App javascript libraries -->
    </body>

# Angular.js ##

<a href="http://angularjs.org/" target="_blank">Angular.js</a> is running the show. It asynchronously loads header and footer HTML. 

In the middle are three `<div>` tags each with a `data-ui-view` attribute. Angular dynamically loads templated views into these tags based on a "route". The middle `<div>` called "shell-content" displays most of what you see. It could show the "Home" page with the picture of "Zza"; it could show the "About" page; it could display a product menu page, an order page, or the cart page. It all depends upon the route ... which you see in the address bar:

![Pizza menu](/images/samples/ZzaRoute.jpg)

In this example, the route identifies the pizza product whose id is "3". Angular uses **route information** (in *public/app/services/routes.js*) to download the correct **view** (a file in the *public/app/views* directory) and marry it to a **controller** (a JavaScript file in the *public/app/controllers* directory).

All the displayed values are **data bound** either to a controller (e.g., `orderItem` defined in *app/order/orderItem.js*) or to a **Breeze entity** exposed by the controller (e.g., `Product`)

# BreezeJS on the client #

Breeze handles the application's data modeling and data access chores. "Entities" are JavaScript types constructed by a combination of developer code (in *public/app/services/model.js*) and Breeze metadata (in *public/app/metadata.js*).

The Breeze `EntityManager` and related components handle the details of creating, querying, materializing, caching, change-tracking, validating, and saving entity data.

While the controllers could interact directly with the Breeze `EntityManager` we prefer that controllers make data requests through a facade, here called the `dataservice` (*client/app/services/dataservice*).  The `dataservice` provides the controllers with a higher level data abstraction, shielding them from application-specific details of working with Breeze. 

The Zza dataservice API offers kind of looks like this:

    {
        cartOrder: ...,
        draftOrder: ...,
        getCustomers: ...,
        getOrderHeadersForCustomer: ...,
        lookups: ...,
        ready: ...,
        saveChanges: ...
    }


That's what we mean by "higher level data abstraction". If it reminds you of the Unit-of-Work and Repository patterns ... then you've caught on to what we have in mind.

### The Zza! client is server agnostic ###

**The client-side code is virtually unaware of the server technology**. Everything you've learned about programming in Angular and Breeze applies without alteration.

To prove that point, the exact same Zza! client - HTML, JavaScript and CSS - runs in front of a .NET server, hosted on IIS, running the Web API, Entity Framework, and SQL Server.

>Somethings have changed over time but this part remains essentially true.

Exactly four files are different: 

1. *metadata.js*, reflecting the difference between a relational schema and MongoDB document schema.

2. *model.js*, for much the same reason 

3. *environment.js*, a small configuration file

4.	*/scripts/breeze.dataservice.mongo.js*, a Breeze "dataservice adapter" plug-in that handles low level details of communicating with node and a MongoDB server.

Otherwise, the same client-code runs in radically different environments.

# Node and Express #

The web application server is written in about 60 lines of JavaScript (*server.js*), using the <a href="http://expressjs.com/" target="_blank">Express framework</a> running on the <a href="http://http://nodejs.org/" target="_blank">node.js</a> platform.

This server is either **delivering static content** to the client such as HTML, CSS, image, and JavaScript files or **routing client data requests** to a data access module called *routes.js*.

# Breeze on the Server #

The server-side data management component (*breeze-routes.js*) is developer-written, application-specific code for handling Breeze client data requests such as queries and saves for Zza data . 

Here you decide what data request your server will honor and implement the necessary business logic including validations.

This particular **Zza!** application server handles a small number of requests. 

Most are unalloyed Breeze queries aimed a resource whose name is the plural of an Zza entity type. These are Breeze-enabled query endpoints that understand the OData query semantics familiar to Breeze client-side developers. For example, a Breeze client query such as:

    breeze.EntityQuery.from('products')
    .where ('name', 'gt', 'Caesar') // products whose name comes after `Caesar`
    .orderBy('name')                    // sort by product name
    .skip(5).take(5)                     // skip the first and take the second (pagesize = 5) 
    .using(manager).execute();

 becomes a GET request like this one:

    http://localhost:3000/breeze/zza/products?$filter=name gt 'Caesar'&$orderby=name&$skip=5&$top=5

which is routed to the `getQuery` method.  

The **breeze-routes** module is a controller that mediates between client requests and a repository that does the data access work. So the `getQuery` method delegates to `repository.getsomething` ("getproducts" in this case). "getproducts" passes the query to a breeze-mongo component that queries the Zza database and returns JSON product data. This data bubbles back up to the breeze-router which sends to the client something like the following:

    [
        {
            _id: 31,
            type: "drink",
            name: "Cola",
            description: "Cola",
            image: "cola.jpg",
            hasOptions: false,
            isPremium: false,
            isVegetarian: false,
            withTomatoSauce: false,
            sizeIds: [
                10,
                11,
                12
            ]
        },
        {...},
        {...},
        {...},
        {...}
    ]

## Plain old GET endpoints ##

This OData query facility is made possible thanks to the **breeze-mongodb** module that you installed with npm. 

Your server doesn't have to support OData queries. You can simply return an object and let the Breeze client sort it out. 

The `lookups` endpoint invokes `getLookups`, a method that returns a single JSON object whose properties are arrays of the four Zza reference entities:`OrderStatus`, `Product`, `ProductOption`, `ProductSize`.                                                                          

With **this one call**, the client receives all of the reference items it needs to populate comboboxes and drive pricing calculations. The Breeze client automatically shreds the package and stows these entity lists in cache.

It bears repeating that the "magic" in this call is all on the client. The `lookups` implementation is standard JavaScript with four standard MongoDB queries in the inner `getAll` function.    

<p class="note"><a href="http://www.breezejs.com/documentation/mongodb"><b>Learn more here</b></a> about the <em>breeze-mongodb</em> module and programming with breeze, node, and MongoDB.</p>

# The Zza! MongoDB database <a id="mongodb"></a>

The Zza! MongoDB database is pre-loaded with ample sample data. 

<div class="nestedList">
100 Customers</br>
513 Orders</br>1447 OrderItems on those orders</br>
1773 OrderItemOptions (toppings) on those OrderItems</br>
</br>
41 Products in the catalog (pizza, salads, drinks)</br>
64 ProductOptions such as pizza toppings</br>
15 ProductSize objects that define sizes ("Large 14") and prices for products of each size</br>
6 OrderStatuses</br>
</div>

The *Customer* and *Order...* stuff are the transactional data representing the activity of the Zza! pizza parlor.

In a relational database, the *Order*, *OrderItems* and *OrderItemOptions* would be in separate tables, related via foreign keys.

This is a Mongo database with "collections" instead of "tables" and "documents" instead of "rows". A document can have nested sub-documents. 

In this database, there is an *Orders* collection but no *OrderItems* or *OrderItemOptions* collections. Instead, each Order has an "items" array of `OrderItem` sub-documents. Each `OrderItem` sub-document has an "options" array of `OrderItemOption` sub-documents.

Here's an illustration with a sample data snapshot in the background:

    <img src="/images/samples/ZzaOrderSchema.jpg" style="width:100%; max-width:800px;">

Breeze metadata can describe complex documents like the Zza! Order document. Root documents - the objects like `Order` in MongoDB collections - map to Breeze **`EntityTypes`**. The sub-documents, which have no existence independent of their parent documents, map to Breeze **`ComplexTypes`**. 

Breeze already supports *scalar* (single valued) complex types for relational databases. Relational databases don't have collection properties. Document databases do. So Breeze supports *arrays* of complex types.

###Schema summary###

The *OrderStatuses*, *Products*, *ProductOptions*, and *ProductSizes* are relatively static reference data. The application can't change them. Each has a document in its own MongoDB collection.

So the entire Zza! database consists of seven collections:

<div class="nestedList">
Customer<br/>
Order<br/>
OrderStatus<br/>
Product<br/>
ProductOption<br/>
ProductSize
</div>

# On the backlog #

This sample is a work in progress. Among the features yet to be implemented:

- Place the order (and save it to the database)
- Client- and server-side validation
- Deliver a delicious, hot pizza to your laptop

Breeze is ready to tackle the first three; we just need a little more time to work on the code. We haven't figured out the pizza delivery system yet. We're thinking about it.
