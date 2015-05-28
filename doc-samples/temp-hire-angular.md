---
layout: doc-samples
redirect_from: "/old/samples/temphire-angular.html"
---
<h1>TempHire reference application</h1>

<p>TempHire is a reference application that has been designed from the ground up to scale to the needs of medium-to-large business applications. It demonstrates a range of architectural and design patterns, including repository patterns, Model-View-ViewModel (MVVM) presentation style, view composition, multi-screen navigation, data-binding, reusable UI components, validation, and multiple EntityManagers for sandbox editing, and cache management.</p>

<p>Being a reference app, we&rsquo;ve kept TempHire manageable and limited its scope to something that highlights our enterprise design decisions without too many distractions. TempHire demonstrates a single Resource Management module in action, but you can see how additional modules (Scheduling, Customer Management, etc.) could easily be built on this framework.</p>

<p>&nbsp;</p>

<p><img src="/images/samples/temphire/temphire-breeze.png" style="width: 640px; max-width: 640px;" /></p>

<h1>Challenge</h1>

<p>Enterprise applications (line of business applications or LOBs) typically have task-oriented UIs and complex, cross-functional, workflows. They need multiple views and require considerable navigation. Given only a few screens, screen composition, decomposition, and data-binding to complex data models can get out of hand in a hurry.</p>

<p>Likewise, LOBs need to able to read, modify, and create data, so determining how to shuttle data back and forth between the UI and the back-end becomes yet another challenge. There&rsquo;s a lot of tedious code involved in turning all that raw data into business objects and moving them to and from the client.</p>

<p>Putting all of the pieces together is enough of a challenge on traditional, relatively static, desktop clients; but more and more frequently, product requirements demand that these apps go cross-platform and work on desktops, tablets, and multiple mobile devices.</p>

<p>How do you design and write LOB apps that can handle real-world complexity? How do you build apps that can be easily maintained and extended over multiple years? How do you go cross-platform without hiring an army of developers to rewrite your code for multiple clients?</p>

<h1>Solution</h1>

<p>TempHire is designed to be a completely modular single-page application (SPA). It&rsquo;s written in JavaScript, so it works on the platforms your customers use today&mdash;and will still be using tomorrow.</p>

<p>TempHire reduces complexity by leveraging frameworks like <a href="http://angularjs.org">Angular</a> for presentation and libraries like Breeze for data management, so developers can focus on solving business problems rather than the plumbing and wiring.</p>

<p>Even better, through the use of proven architecture and design patterns, multiple developers can work independently on specific views, models, and workflows without impacting other modules.</p>

<p><img src="/images/samples/temphire/temphire-angular.png" style="border-width: 0px; border-style: solid; width: 100%; max-width: 543px;" /></p>

<h1>TempHire under the hood</h1>

<p>So what exactly does an enterprise JavaScript app look like from the inside? TempHire is one way to do it&mdash;a way we&rsquo;ve had success with and are happy to share with you.</p>

<p>TempHire is composed of a client side app (JavaScript, CSS, HTML, etc.), a domain model (entities, and business logic), and various server side components (services, controllers, etc.).</p>

<p><img src="/images/samples/temphire/solution-explorer.png" style="border-width: 0px; border-style: solid; width: 100%; max-width: 350px;" /></p>

<h1>Domain model</h1>

<p>The DomainModel is the main model for all of the application data. TempHire&rsquo;s domain model contains all of its entity classes, an entity base class, and a DbContext file. &nbsp;</p>

<h2>Entity classes</h2>

<p>Let&rsquo;s look at AddressType as an example of one of Temphire&rsquo;s entity classes. It&rsquo;s a Code First class that has four properties.</p>

<p><img src="/images/samples/temphire/addresstype.png" style="border-width: 0px; border-style: solid; width: 100%; max-width: 479px;" /></p>

<h2>EntityBase</h2>

<p>TempHire uses a base class that all the entities, directly or indirectly, inherit from (EntityBase.cs). The nice thing about Code First is that TempHire can add common functionalities to the base class that will be applied to all of the entities in the domain model. Because these functions are in the base class, TempHire doesn&rsquo;t need to add them to derived classes. Everything is inheritable.</p>

<p>You can see this in action by the way that TempHire handles concurrency checking. It&rsquo;s located in the base class and is inherited by every entity.&nbsp;</p>

<p><img src="/images/samples/temphire/concurrencycheck.png" style="border-width: 0px; border-style: solid; width: 100%; max-width: 410px;" /></p>

<h2>DbContext</h2>

<p><strong>TempHireDbContext</strong> demonstrates how we map TempHire&rsquo;s domain model to a database using EntityFramework Code First. TempHire tells EF what its entitysets are, and sets a few initialization strategies (e.g. <em>dropcreatedatabaseifmodelchanges</em>). &nbsp;To be very clear, we&rsquo;ve built TempHire as a demo app ... and in this context, this makes sense. Don&rsquo;t drop your database in a production application!</p>

<h2>Projections</h2>

<p>Temphire uses projections and DTOs where applicable to improve performance and to move complex queries to the server, where implementing them in LINQ is a lot easier. You can see this in action on the master details screen:</p>

<p><img src="/images/samples/temphire/mastergrid.png" style="border-width: 0px; border-style: solid; width: 100%; max-width: 640px;" /></p>

<p>&nbsp;</p>

<p>Frequently you&rsquo;ll see grids like this populated by entities, but we don&rsquo;t do that here. Instead, this grid uses a projection query that cherry picks the information from an object graph, condenses it, and sends it down the wire. Projections are a simple way to enhance performance, and your customers who are connecting via an EDGE network will be happy you did.</p>

<h1>TempHire app</h1>

<p>With the domain model behind us, let&rsquo;s take a look inside the app itself.</p>

<h2>App</h2>

<p>The App folder contains the core components of the TempHire client: Angular, Client Services, ViewModel code, the HTML Views, and main.js, the script that bundles the app&rsquo;s scripts into a single package.</p>

<p>We&rsquo;re assuming you&rsquo;re familiar with the basics, so the most interesting components here are likely App/Angular and App/ Services.</p>

<h3>Angular</h3>

<p>Angular is a very popular front end SPA framework created by Google.  For this sample, we are using a preliminary version of Angular 1.4 as well as it's <a href="https://github.com/angular/router">new router</a>. Please note that there may be issues that will be resolved once the router is final and we upgrade the sample to Angular 1.4 final release.</p>

<h3>Services</h3>

<p>Services contains the JavaScript that powers TempHire&rsquo;s primary services &hellip; most of which revolve around Temphire&rsquo;s reliance on the Unit of Work (UOW) pattern.</p>

<p>Entitymangerprovider.js offers a CreateManager method for TempHire to call whenever it needs a new EntityManager instance&mdash;something it does frequently as each UOW must spin up a new EntityManager. Logger.js takes care of TempHire&rsquo;s logging functions, Repository.js is responsible for the configuration of UOW Repositories, and Unitofwork.js is responsible for the configuration of the UOW themselves.</p>

<h2>App_Start</h2>

<p>App_Start contains BreezeWebApiConfig.cs, BundleConfig.cs, and InfrastructureConfig.cs. &nbsp;These files run at the beginning of the server launch sequence and register their applicable routes. BreezeWebApiConfig routes Breeze client requests to the Breeze controller, and InfrastructureConfig registers the resource bundles via the BundleConfig helper class. Additional infrastructure configuration can be added here later.</p>

<h2>Content</h2>

<p>All of TempHire&rsquo;s content files (CSS and images) are stored in the appropriately named Content folder.&nbsp; This is a good time to mention that TempHire uses <a href="http://twitter.github.io/bootstrap/">Twitter Bootstrap</a>, an excellent template for quickly standing up a modern front-end.&nbsp;</p>

<p>HTML, CSS, UI elements, responsivity&mdash;yeah, Bootstrap takes care of all of that.</p>

<h2>Controllers</h2>

<h3>DefaultController.cs</h3>

<p>The default controller is responsible for delivering the common metadata. Query and Save logic is to the respective module controllers.</p>

<h3>LookupBundle.cs</h3>

<p>The LookupBundle is a DTO used to ship global read-only entities such as lookup data to the client in one shot. A client requests this data once at the beginning and holds it in a global cache. Every EntityManager when first created is pre-seeded with this global lookup data.</p>

<h3>ResourceMgtController.cs</h3>

<p>The ResourcMgtController defines the query and save endpoints for the resource management module. Each module gets its own controller in order to keep their size manageable and combine related functionality in one place.</p>

<p>Much as like we did client-side, the server-side also uses the unit of work pattern to structure the query and save logic and keep it external to the controllers. This way the controllers stay small enough and the business logic is encapsulated in the corresponding server-side unit of work.</p>

<h2>Scripts</h2>

<p>Temphire is powered by multiple JavaScript libraries. If you&rsquo;re new to JavaScript and are concerned by seeing so many libraries, please stop reading this article and read to John Papa&rsquo;s <a href="http://www.johnpapa.net/howmanyistoomany/">Why all those JavaScript libraries</a>. Feel better now? The libraries that make TempHire tick include:&nbsp;</p>

<p>&nbsp;</p>

<p><img src="/images/logos/twitterbootstrap.png" style="border-width: 0px; border-style: solid; width: 101px; height: 50px;" /></p>

<p><a href="http://twitter.github.io/bootstrap/"><strong>Bootstrap</strong></a> adds front-end pizazz with a variety of widgets, transitions, buttons, etc. It should go without saying that they all work seamlessly with the Twitter Bootstrap CSS (See Content). The various GUI elements are documented at <a href="http://twitter.github.io/bootstrap/javascript.html">twitter.github.io</a>.</p>

<p><img src="/images/logos/breeze.png" style="border-width: 0px; border-style: solid; width: 100px; height: 50px;" /></p>

<p><strong>Breeze</strong> excels at data management and takes care of the Model &ndash;the M in MVVM. Breeze queries, saves, and manages all data interactions between client and server. &nbsp;Breeze <em>EntityManagers</em> make writing TempHire&rsquo;s Unit of Work patterns considerably easier.</p>

<p>Breeze automatically creates JavaScript model objects (entities) that match the shape of the data coming from the remote service. It adds business rules and infrastructure that support validation, change tracking, and navigation to related entities. Breeze navigation properties automate traversal of the object graphs that are implicit in a relational model so you can walk the graph, from a customer to its orders, and from an order to its line items. Breeze tracks users&rsquo; changes and validates them with rules, some of which may have been propagated to the client from the server.</p>

<p>If you store data in a database, query and save data as complex object graphs, and share graphs across multiple views&mdash;and want to do it in JavaScript&mdash;there&rsquo;s no better way than with Breeze.</p>

<p><img src="/images/logos/jquery.png" style="border-width: 0px; border-style: solid; width: 100px; height: 50px;" /></p>

<p><a href="http://jquery.com/"><strong>jQuery</strong></a> is a dependency for some of TempHire&rsquo;s libraries and templates. Bootstrap, Breeze, and Angular rely on one bit of jQuery or another.&nbsp;</p>

<p><img src="/images/logos/moment.png" style="border-width: 0px; border-style: solid; width: 100px; height: 50px;" /></p>

<p><a href="http://momentjs.com/"><strong>Moment</strong></a> is our go-to library when working with date and time (parsing, validating, manipulating, and formatting) in JavaScript.</p>

<p><img src="/images/logos/toastr.png" style="border-width: 0px; border-style: solid; width: 100px; height: 50px;" /></p>

<p><a href="https://github.com/CodeSeven/toastr"><strong>Toastr</strong></a> displays process and error notifications in &quot;toast&quot; windows that float up from the lower right to let you know what TempHire is doing at any given time.</p>

<h2>Services</h2>

<p>All of TempHire&rsquo;s persistence ignorance is built into the server-side services using Unit of Work (UOW) patterns.</p>

<h3>Unit of Work</h3>

<p>The UOW is a design pattern that encapsulates anything from simple tasks to complex workflows. The UOW can be short or long lived, may involve retrieving data, modifying data, creating new data, performing business logic, checking business rules, and saving or rolling back changes.</p>

<p>An EntityManger is spun up for each UOW and takes care of the configuration, authentication, and connection details, while the UOW&rsquo;s Repository handles the business logic that governs access to a specific type of entity.</p>

<p>UOWs make it possible to highly optimize the fetching strategy for a given entity type. e.g. A Repository for a static type such as <em>Color</em> can be optimized to load all colors on the first request and serve future requests directly from the cache instead of making additional trips to the server.</p>

<p>UOWs can be shared between ViewModels if different parts of the UI work with the same data, but each UOW remains a unique sandbox.</p>

<p>TempHire uses UOWs as transaction boundaries&mdash;each with customized responsibilities that lead to an organized codebase that&rsquo;s easier to maintain and improve over time.</p>

<h1>What about the back-end?</h1>

<p>TempHire&#39;s is an ASP.NET Web Application. The server hosts all the client-side assets as well as an ASP.NET MVC4 Web API service that queries and saves to a SQL Server database with the help of an Entity Framework Code First model. We used ASP.NET because it&rsquo;s quick and effective for enterprise developers familiar with the Microsoft stack. It&rsquo;s also helpful that Breeze ships with components that ease development of Web API and Entity Framework back-ends.</p>

<p>If you prefer a Rails or Java backend, or NoSQL database, you&rsquo;re ok too. TempHire is a JavaScript app and can been configured to run on almost any server stack that can deliver web assets and data services.</p>