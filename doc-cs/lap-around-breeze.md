---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/.html"
---

# A lap around Breeze

This is a quick spin around Breeze. It sticks to the basics that a .NET client developer must know to work with Breeze. You won’t learn everything but you will acquire a foundation in breeze sufficient to build a simple application. You'll know

- how to query the persistence service for entities

- how to write a query filter on the client and sort the results on the data tier

- to ***await*** a task from Breeze while you wait for the service to respond; the task will tell you when the service is ready with results

- the EntityManager maintains a local cache of entities that you've queried, added to, modified, and marked for deletion

- the EntityType describes the details of an entity class, how it's structured and how it behaves

- how to use the EntityType to create new instances of entities

- that a Breeze entity tracks changes, validates changes, and raises property changed events

- how a Breeze entity can be bound to UI controls with WPF (or another data binding library)

- how to save changes permanently to remote storage or temporarily to local storage on the device.

We've organized the "lap..." as a tour of the Todo sample application. We'll detour occasionally into the automated teaching tests to clarify a point or find a more apt illustration.

You could just dive in. We think you'll get more from the tour if you take these three preliminary steps:

1. Review ["**Start with NuGet**"](/breeze-sharp-documentation/start-nuget).  It takes about 10 minutes. You might follow along and build the sample.

2. Try the [**Todo sample application**](/breeze-sharp/samples) and at least skim its documentation.

3. Try the [**DocCode teaching tests**](/breeze-sharp/samples).

We’ll wait.

# Welcome back

You’ve downloaded the code and experienced the Todo sample as a user would. It's time to [write a query](/breeze-sharp-documentation/first-query).
