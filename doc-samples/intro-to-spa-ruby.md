---
layout: doc-samples
redirect_from: "/old/samples/intro-spa-ruby.html"
---
<h1 style="margin: 8px 0px 12px;">Introduction to Single Page Apps ... with Ruby</h1>

<p>John Papa&#39;s &quot;Single Page Apps JumpStart &quot; course is a great way to learn how to build SPAs (single-page applications). He takes you from zero to a multi-screen full CRUD application called Code Camper JumpStart (CCJS) explaining every step along the way.</p>

<p>We&#39;ve secretly replaced the Web API and Entity Framework used to power the backend of his app with Ruby on Rails. Let&#39;s see if he&#39;ll notice.</p>

<p><img alt="" src="/images/samples/sessions.png" style="width: 100%; max-width: 610px;" /></p>

<p>We&#39;d encourage you to:</p>

<ul>
	<li>Download the <a href="/downloads/CCJS-Ruby.zip" target="_blank">CCJS-Ruby source code</a> and run the app yourself.</li>
	<li>Read <a href="http://www.johnpapa.net/spajs04/" target="_blank">What Breeze can do for you</a> on John&#39;s blog along with the 50+ comments from other developers.</li>
	<li>Take the <a href="http://pluralsight.com/training/courses/TableOfContents?courseName=single-page-apps-jumpstart" target="_blank">Single Page Apps JumpStart</a> course on PluralSight (requires subscription, but they&nbsp;have a free trial).</li>
	<li>Flip through slides from Ward&#39;s Bay.NET presentation, <a href="/downloads/CCJS-Ruby.pptx">Breeze, Data, and the Single Page App</a>. We&#39;llbe turning this into a video soon.</li>
	<li>Watch the <a href="http://www.youtube.com/watch?v=YffHd_WBfig" target="_blank">video</a>.<br /><br/>
	<div class="embed-container"><iframe allowfullscreen="" frameborder="0" src="http://www.youtube.com/embed/YffHd_WBfig"></iframe></div></li>
</ul>

<h2>Architecture</h2>

<p>Like the original CCJS, our Ruby version is built with the &quot;Hot Towel&quot; client stack of JavaScript libraries that features <a href="http://durandaljs.com/" target="_blank">Durandal</a>, <a href="http://knockoutjs.com/" target="_blank">Knockout </a>and BreezeJS.<br />
&nbsp;</p>

<p><img alt="CCJS Architecture" src="/images/samples/CCJS-architecture-ruby.png" style="width: 100%; max-width: 561px;" /></p>

<p><br />
The backend is significantly different, as we&#39;ve replaced Web API, EF, and SQL Server and are using a simple Ruby on Rails application that saves data to a MySQL database instead.</p>

<h2>Client</h2>

<p>Changes to the client-side of the app are minor.</p>

<ul>
	<li>Updated Breeze to the latest version</li>
	<li>Reconfigured the server host</li>
	<li>Added a Breeze-AJAX request interceptor</li>
	<li>Added an Active Record data service adaptor</li>
</ul>

<p><img alt="" src="/images/samples/edit-session.png" style="width: 100%; max-width: 610px;" /></p>

<h2>Server</h2>

<p>Changes to the server-side of the app are where things got interesting though:</p>

<h3>Controllers</h3>

<p><strong>rails/app/controllers</strong> contains the three controllers that are used to respond to client requests. Requests routing is configured in <strong>config/routes.rb</strong>.</p>

<ul>
	<li><strong>Session</strong><br />
	Contains the CRUD methods used to manage the sessions. The client uses this controller to get session information and create , update, and delete sessions.</li>
	<li><strong>Speakers</strong><br />
	Uses a single method to get speaker info.</li>
	<li><strong>Settings</strong><br />
	Includes the methods used to get metadata and lookup info.</li>
</ul>

<h3>Models</h3>

<p><strong>rails/app/models</strong> holds the models that hold the business model for the application. There are 6 files that model the data mapping, the relationships between data objects and operations on data objects</p>

<h3>Views</h3>

<p><strong>rails/app/views</strong> holds the views used to define the API responses.</p>

<h2>More Papa</h2>

<p><a href="http://www.johnpapa.net" target="_blank">John Papa</a> is a renowned developer and teacher with <a href="http://www.pluralsight.com/training/Courses/Find?highlight=true&amp;searchTerm=%22John+Papa%22" target="_blank">several great courses on Pluralsight</a> covering a variety of topics and techniques that are important to JavaScript client application developers including the reasons for &quot;Single Page Apps&quot;, the Web API as a SPA backend, dependency management, bundling and optimization, and &quot;responsive design&quot;. Really good stuff.</p>

<p>John will be the first to tell you that Breeze eliminates the need for many files and hundreds of lines of code. His experience of writing the data layer by hand helped him choose Breeze for his second course on SPA. See what you think.</p>

<p>John&#39;s &quot;<a href="http://pluralsight.com/training/courses/TableOfContents?courseName=knockout-mvvm" target="_blank">Building JavaScript apps with MVVM and Knockout</a>&quot; is also a &quot;must&quot; if you need solid Knockout skills.</p>

<p>&nbsp;</p>
