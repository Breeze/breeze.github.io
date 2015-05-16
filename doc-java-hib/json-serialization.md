---
layout: doc-java-hib
---

## JSON Serialization

Currently, breeze-hibernate performs JSON serialization using the   [Google's GSON library](https://code.google.com/p/google-gson/ "Google's Gson library") library and several custom Gson TypeAdapters. These custom adapters are necessary to support handling circular references in a manner that is compatible with the default breezeJs configuration settings. (and thus with [Json.NET](http://james.newtonking.com/json/help/index.html?topic=html/PreserveObjectReferences.htm)) and to allow correct handling of Hibernate proxies.
  
