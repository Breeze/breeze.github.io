---
layout: doc-samples
redirect_from: "/old/samples/introduction-single-page-apps-sharepoint.html"
---
<h1 style="margin: 8px 0px 12px;">SharePoint SPA</h1>

<p>Andrew Connell has a great blog post on <a href="http://www.andrewconnell.com/blog/breezejs-makes-client-side-sharepoint-2013-rest-development-a-breeze" target="_blank">building single page applications with SharePoint and BreezeJS</a> over on <a href="http://www.andrewconnell.com/"  target="_blank">his blog</a>.</p>
<br />
<p>Andrew does a great job of summarizing what he loves about BreezeJS:</p>

<blockquote>
  <ul>
    <li>LINQ Style Queries: As you'll see from the code snippets below in this post, when you want to work with data, you can write your queries using the familiar LINQ style syntax, enabling you to chain calls, sort using orderby() and filter using where() to name a few.</li>
    <li>Client-Side Cache: When Breeze gets data from the server, it stores it in a local cache. You get to use this local cache to spare trips to the server or to batch up a handful of changes to multiple items.</li>
    <li>Automatic Validation: Breeze also allows you to define some validation logic in your entities. Some things are built in, like checking for valid dates & times, URLs, emails, phone numbers, max string lengths, non-nullable fields... you name it. If you try to save your changes, Breeze throws validation errors before sending the request to the server.</li>
    <li>Abstracting Away the Data Access Plumbing: I can't stress this one enough. Just like LINQ in server-side code abstracts away the queries we have to write, Breeze does the same for us on the client-size. This means we can have much cleaner code and less of a change in forgetting that single quote mart, a closing parentheses, the question mark for the query string... you get the picture.</li>
  </ul>
</blockquote>
<br />
<h2>BreezeJS SharePoint Architecture</h2>
<img src="/images/samples/sharepoint-learning-path-architecture.png" alt="BreezeJS SharePoint architecture" title="BreezeJS SharePoint architecture" />

Check out this <a href="https://github.com/andrewconnell/BreezeSP2013Sample" target="_blank">sample code of a single page app with SharePoint and Breeze on GitHub</a>.

<img src="/images/samples/sharepoint-learning-path-1.png" alt="Learning Path Manager" title="Learning Path Manager" /><br />
<img src="/images/samples/sharepoint-learning-path-2.png" alt="Learning Path Manager view items" title="Learning Path Manager view items" /><br />
<img src="/images/samples/sharepoint-learning-path-3.png" alt="Learning Path Manager create new item" title="Learning Path Manager create new item" /><br />
<img src="/images/samples/sharepoint-learning-path-4.png" alt="Learning Path Manager file paths" title="Learning Path Manager file paths" />

<p>Resources</p>
<ul>
  <li>Use this <a href="http://www.nuget.org/packages/Breeze.DataService.SharePoint"  target="_blank">Breeze DataServiceAdapter for SharePoint 2013 apps</a> to connect BreezeJS and SharePoint.</li>
  <li>Module 4 of the PluralSight course <a href="http://pluralsight.com/training/courses/TableOfContents?courseName=building-sharepoint-apps-spa-angularjs " target="_blank">"Incorporating Live Data Using Breeze and the SharePoint REST API"</a>, is 46 minutes.</li>
  <!--<li>Module 5 of the PluralSight course <a href="http://pluralsight.com/training/Courses/TableOfContents/sharepoint-2013-fundamentals"  target="_blank">SharePoint 2013 Fundamentals</a> covers BreezeJS.</li>-->
</ul>