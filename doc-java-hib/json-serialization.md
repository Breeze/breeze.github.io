---
layout: doc-java-hib
---

## JSON Serialization

Currently, breeze-hibernate performs JSON serialization using [Google's Gson library](https://code.google.com/p/google-gson/ "Google's Gson library") and several custom Gson TypeAdapters. These custom adapters are necessary to support handling circular references in a manner that is compatible with the default BreezeJS configuration settings. (and thus with [Json.NET](http://james.newtonking.com/json/help/index.html?topic=html/PreserveObjectReferences.htm)) and to allow correct handling of Hibernate proxies.
  
### Reference Handling

Breeze uses the [$id/$ref convention](https://blogs.oracle.com/sundararajan/entry/a_convention_for_circular_reference) in its JSON to handle repeated references to the same objects.  Each unique object in the JSON gets a unique number in its **$id** property.  Subsequent references to the same object are replaced with a **$ref** containing its unique number, rather than repeating the serialized form of the object.

This prevents bloating the JSON with repeated data, and it automatically handles circular references.  For example, in the Northwind model, Customer entities have a collection of Orders, and each Order has a reference to the Customer.  This is a circular reference, and it is handled using $id/$ref.  

### Type

The type name (package and class name) of each entity is included in the JSON results.    For example, 
```javascript
$type: "northwind.model.Customer"
```
This is so that the Breeze client will know how to handle each entity when it arrives.

### Hibernate Proxies
Hibernate automatically lazy-loads related entities when they are accessed while attached to a `Session`.  This can cause problems for JSON serialization, because the JSON serializer attempts to walk the graph of objects, and Hibernate obligingly loads all the objects that are reached.  So the entire domain of entities could be loaded from the database.

To prevent this, the Gson serializer is configured to skip un-initialized Hibernate proxies.  Hibernate collections must be explicitly loaded before serialization.

When an [expand](/doc-js/query-examples.html#EagerLoading) operation is requested, the [QueryProcessor](query-processor.html) performs the initialization of related entities prior to JSON serialization, so that the requested child entities are included in the result.

### Example 

Here are the results of a query for the first two Customers and their Orders, `/northwind/Customers?{ take: 2, expand: 'orders'}`.  Note that:
- Each entity has a `$type` property and a `$id` property
- `Order` entities have a "customer" property that refers to their parent via `$ref`  
- `Order` entities have an "internationalOrder" property that is included because it was configured in Hibernate for eager loading. 

```javascript
[
  {
    "customerID": "008c5552-1fde-421f-bdbf-f1c66c612afa",
    "customerID_OLD": "ISLAT",
    "companyName": "ISLAND TRADING_X",
    "contactName": "Helen Bennett_X",
    "contactTitle": "Marketing Manager",
    "address": "Garden House Crowther Way",
    "city": "Cowes",
    "region": "Isle of Wight",
    "postalCode": "PO31 7PJ",
    "country": "UK",
    "phone": "(198) 555-8888",
    "rowVersion": 92,
    "orders": [
      {
        "orderID": 10829,
        "customerID": "008c5552-1fde-421f-bdbf-f1c66c612afa",
        "employeeID": 9,
        "orderDate": "1998-01-13T08:00:00.000Z",
        "rowVersion": 33,
        "customer": {
          "$ref": "1"
        },
        "internationalOrder": {
          "orderID": 10829,
          "customsDescription": "Northwoods Cranberry Sauce and other products for personal use",
          "exciseTax": 805.9109,
          "rowVersion": 0,
          "order": {
            "$ref": "2"
          },
          "$type": "northwind.model.InternationalOrder",
          "$id": "3"
        },
        "orderDetails": [
        ],
        "$type": "northwind.model.Order",
        "$id": "2"
      },
      {
        "orderID": 10933,
        "customerID": "008c5552-1fde-421f-bdbf-f1c66c612afa",
        "employeeID": 6,
        "orderDate": "1998-03-06T08:00:00.000Z",
        "rowVersion": 0,
        "customer": {
          "$ref": "1"
        },
        "internationalOrder": {
          "orderID": 10933,
          "customsDescription": "Sirop d'\u00e9rable and other products for personal use",
          "exciseTax": 420.5905,
          "rowVersion": 0,
          "order": {
            "$ref": "4"
          },
          "$type": "northwind.model.InternationalOrder",
          "$id": "5"
        },
        "orderDetails": [
        ],
        "$type": "northwind.model.Order",
        "$id": "4"
      }
    ],
    "$type": "northwind.model.Customer",
    "$id": "1"
  },
  {
    "customerID": "009b784d-3606-4b13-a298-617dc2549d7a",
    "companyName": "Test_js_1",
    "city": "Oakland",
    "fax": "510 999-9999",
    "rowVersion": 13,
    "orders": [
      {
        "orderID": 20875,
        "customerID": "009b784d-3606-4b13-a298-617dc2549d7a",
        "orderDate": "2015-05-08T05:50:57.000Z",
        "rowVersion": 0,
        "customer": {
          "$ref": "6"
        },
        "orderDetails": [
        ],
        "$type": "northwind.model.Order",
        "$id": "7"
      },
      {
        "orderID": 20836,
        "customerID": "009b784d-3606-4b13-a298-617dc2549d7a",
        "orderDate": "2015-05-08T05:50:57.000Z",
        "rowVersion": 0,
        "customer": {
          "$ref": "6"
        },
        "orderDetails": [
        ],
        "$type": "northwind.model.Order",
        "$id": "8"
      }
    ],
    "$type": "northwind.model.Customer",
    "$id": "6"
  }
]
```
