---
layout: doc-samples
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

<p>TempHire reduces complexity by leveraging frameworks like <a href="http://angularjs.org">AngularJS</a> for presentation and libraries like Breeze for data management, so developers can focus on solving business problems rather than the plumbing and wiring.</p>

<p>Even better, through the use of proven architecture and design patterns, multiple developers can work independently on specific views, models, and workflows without impacting other modules.</p>

<p><img src="/images/samples/temphire/temphire-angular-sequelize.png" style="border-width: 0px; border-style: solid; width: 100%; max-width: 543px;" /></p>

# Download

Download [ALL of the Breeze JavaScript samples from github](https://github.com/Breeze/breeze.js.samples "breeze.js.samples on github") as [a zip file](https://github.com/Breeze/breeze.js.samples/archive/master.zip "breeze.js.samples zip file").

In this case we're interested in the "tempHire" sample, located in the *node/tempHire* directory. These instructions assume this will be your current working directory.

At the top level you will find:

* a <a href="https://github.com/Breeze/breeze.js.samples/blob/master/node/tempHire/readme.md" target="_blank" title="readme.md on github"><strong>readme.md</strong></a> explaining how to install and run the app
* the **db-script** folder
* the **client** folder full of client application **HTML, CSS, and JavaScript**
* the **server** folder containing the node/express server application JavaScript.

You can view, edit, and run the code in this project using the tools of your choice.

<p class="note">The sample assumes that you've installed <strong>node.js</strong> and <a href="http://www.mysql.com"
  target="_blank"><strong>MySql</strong></a></p>

<h1>TempHire under the hood</h1>

<p>So what exactly does an enterprise JavaScript app look like from the inside? TempHire is one way to do it&mdash;a way we&rsquo;ve had success with and are happy to share with you.</p>

<p>TempHire is composed of a client side app (JavaScript, CSS, HTML, etc.), and various server side components.</p>

<p><img src="/images/samples/temphire/solution-explorer-webstorm.png" style="border-width: 0px; border-style: solid; width: 100%; max-width: 250px;" /></p>

<h2>Projections</h2>

<p>Temphire uses projections and DTOs where applicable to improve performance and to move complex queries to the server. You can see this in action on the master details screen:</p>

<p><img src="/images/samples/temphire/mastergrid.png" style="border-width: 0px; border-style: solid; width: 100%; max-width: 640px;" /></p>

<p>&nbsp;</p>

<p>Frequently you&rsquo;ll see grids like this populated by entities, but we don&rsquo;t do that here. Instead, this grid uses a projection query that cherry picks the information from an object graph, condenses it, and sends it down the wire. Projections are a simple way to enhance performance, and your customers who are connecting via an EDGE network will be happy you did.</p>

<h1>TempHire app</h1>

<h2>App</h2>

<p>The <em>client</em> folder contains the core components of the TempHire client: AngularJS, Client Services, ViewModel code, the HTML Views, and main.js, the script that bundles the app&rsquo;s scripts into a single package.</p>

<p>We&rsquo;re assuming you&rsquo;re familiar with the basics, so the most interesting components here are likely App/AngularJS and App/ Services.</p>

<h3>AngularJS</h3>

<p>AngularJS is a very popular front end SPA framework created by Google.  For this sample, we are using a preliminary version of AngularJS 1.4 as well as it's <a href="https://github.com/angular/router">new router</a>. Please note that there may be issues that will be resolved once the router is final and we upgrade the sample to AngularJS 1.4 final release.</p>

<h3>Services</h3>

<p>Services contains the JavaScript that powers TempHire&rsquo;s primary services &hellip; most of which revolve around Temphire&rsquo;s reliance on the Unit of Work (UOW) pattern.</p>

<p>Entitymangerprovider.js offers a CreateManager method for TempHire to call whenever it needs a new EntityManager instance&mdash;something it does frequently as each UOW must spin up a new EntityManager. Logger.js takes care of TempHire&rsquo;s logging functions, Repository.js is responsible for the configuration of UOW Repositories, and Unitofwork.js is responsible for the configuration of the UOW themselves.</p>

<h2>Content</h2>

<p>All of TempHire&rsquo;s content files (CSS and images) are stored in the <em>client/css</em> folder.&nbsp; This is a good time to mention that TempHire uses <a href="http://twitter.github.io/bootstrap/">Twitter Bootstrap</a>, an excellent template for quickly standing up a modern front-end.&nbsp;</p>

<p>HTML, CSS, UI elements, responsivity&mdash;yeah, Bootstrap takes care of all of that.</p>

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

<p><a href="http://jquery.com/"><strong>jQuery</strong></a> is a dependency for some of TempHire&rsquo;s libraries and templates. Bootstrap, Breeze, and AngularJS rely on one bit of jQuery or another.&nbsp;</p>

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

<p>TempHire uses Node, Express, Sequelize and MySql with the help of our <a href="/doc-node-sequelize">Breeze-Sequelize</a> library.</p>

<p>If you prefer a Rails or Java backend, or NoSQL database, you&rsquo;re ok too. TempHire is a JavaScript app and can been configured to run on almost any server stack that can deliver web assets and data services.</p>