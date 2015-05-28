---
layout: doc-samples
redirect_from: "/old/samples/northbreeze.html"
---
#NorthBreeze NHibernate demo

Northbreeze is a  simple data-entry demo application that uses the Northwind data model.  This sample demonstrates how to use Breeze with NHibernate on the server, and Breeze with Angular on the client.  

#Client side
- [Breeze](http://breezejs.com) data retrieval, validation, change tracking, transactional saves
- [Angular](http://angularjs.com) JavaScript framework
- [AngularUI Grid](http://angular-ui.github.io/ng-grid/) with paging
- [Twitter Bootstrap](http://getbootstrap.com/2.3.2/) styling

NorthBreeze uses an Angular custom directive to apply Bootstrap styles to show validation errors detected by Breeze.

#Server side
- Breeze HTTP filters and persistence context
- ASP.NET [Web API](http://www.asp.net/web-api)
- [NHibernate](http://nhforge.org/)
- Northwind data model

NorthBreeze uses metadata provided by NHibernate on the server to control validation on the client.  It saves changes through NHibernate by updating the server-side entity model and persisting it to the database.  It supports OData queries using NHibernate's IQueryable implementation.
 
# Download
[Download the sample](https://github.com/IdeaBlade/Breeze/raw/master/Samples/NorthBreeze/NorthBreeze.zip).  It's a zip file containing a Visual Studio 2012 solution that includes the NorthwindIB.sdf database.  When you first build it, it will pull in Web API and Breeze dependencies via NuGet.  You can also check out the [source code on GitHub](https://github.com/IdeaBlade/Breeze/tree/master/Samples/NorthBreeze).

#Screen Shots

##Edit Customer
This shows the customer screen with its paged data grid and editing fields.  Here we're editing a customer and we have a validation error.
<img src="/images/samples/northbreeze-customers.png" style="width:100%; ">

##Scoreboard
This shows the home screen, which has a list of all the entities that have changed.  For each changed entity, it shows the type, ID, and all the fields that have changed, including any validation errors as a result of those changes.

No, this is **not** something you would have in a real application, but it demonstrates how Breeze tracks changes.
<img src="/images/samples/northbreeze-scoreboard.png" style="width:100%; ">