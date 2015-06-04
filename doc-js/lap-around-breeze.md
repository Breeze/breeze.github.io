---
layout: doc-js
redirect_from: "/old/documentation/lap-around-breeze.html"
---
#	A lap around Breeze

This is a quick spin around Breeze. It sticks to the basics that a JavaScript client developer must know to work with Breeze. You won't learn everything but you will acquire a foundation in breeze sufficient to build a simple application. You'll know:
	 

- how to query the persistence service for entities
- how to write a query filter on the client and sort the results on the data tier
- to hold a *promise* from Breeze while you wait for the service to respond; the promise will tell you when the service is ready with results
- the EntityManager maintains a local cache of entities that you've queried, added to, modified, and marked for deletion 
- the EntityType describes the details of an entity class, how it's structured and how it behaves
- how to use the EntityType to create new instances of entities
- that a Breeze entity tracks changes, validates changes, and raises property changed events
- how a Breeze entity can be bound to UI controls with Knockout (or another data binding library)
- how to save changes permanently to remote storage or temporarily to local storage on the device.

We've organized the "lap..." as a tour of the Todo sample application. We'll detour occasionally into the automated teaching tests to clarify a point or find a more apt illustration.

You could just dive in. We think you'll get more from the tour if you take these three preliminary steps:

- 	Review "<a href="/doc-net/nuget-packages">Start with NuGet</a>".  It takes about 10 minutes. You might follow along and build the sample.
- 	Try the <a href="/doc-samples/about-todo">Todo sample application</a> and at least skim its documentation..
- Try the <a href="/doc-samples/doccode">DocCode teaching tests</a>.

We'll wait.

##	Welcome back
You've downloaded the code and experienced the Todo sample as a user would. It's time to <a href="/doc-js/lap-first-query">write a query</a>.
