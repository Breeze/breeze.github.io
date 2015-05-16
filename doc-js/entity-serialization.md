---
layout: doc-js
---

#Entity Serialization

Breeze serializes entity data when saving to remote storage and when [exporting entities](http://www.breezejs.com/documentation/entitymanager-and-caching "Export/Import") to a string. Sometimes Breeze needs your help in serializing values in the manner your app requires.

Serialization is not as obvious as it might seem. Entities have circular references (e.g., Order &rarr; OrderDetail &rarr; parent Order) that confound naive serialization. Some internal Breeze properties shouldn't be serialized (e.g., the deep details of the entity type). And Breeze discards unrecognized properties as a matter of policy (e.g., `someEntity.foo="ha ha ha"` where `foo` is not a property identified in [metadata](http://www.breezejs.com/documentation/metadata "MetadataStore")).

>"Unmapped" and "unrecognized" properties are different. 
>
>An "unmapped" property *is a recognized property* in the sense that it is registered in metadata. You typically create "unmapped" properties by defining them in a custom constructor. You can also register an "unmapped" property explicitly. A registered property is "unmapped" if it does not translate to a persisted property of the corresponding server-side entity class.
>
>A property is "unrecognized" if it is not registered in metadata. Properties that you add to an entity in an entity initializer or "on the fly" are unrecognized.

Breeze uses <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FJSON%2Fstringify" title="JSON.stringify API" target="_blank">`JSON.stringify`</a> internally to serialize data, subject to policy constraints and customizations attuned to your needs.
<a name="Unmapped-properties"></a>
##Unmapped properties

Breeze strives to minimize serialization exceptions. It has a good handle on things that can go wrong in *mapped* properties over which it has a great deal of control. 

Your custom ***unmapped*** properties present a greater challenge. Breeze serializes *unmapped* properties per the following rules:

1. If the object returned by the unmapped property has a property named `toJSON`, Breeze invokes that function first and then serializes the function's return value.

    >This is the same function and behavior as is used by the `JSON.stringify`.
     
2. Functions are never serialized unless they have a `toJSON` function property.
     
3. Objects that contain cycles have cyclical properties stubbed out at the point where a previously serialized node is encountered. As with functions, this behavior can be mediated with a `toJSON` property.

##serializerFn

You can set an optional `serializerFn` property of the `MetadataStore` and `EntityType` classes with your own serialization function. Breeze calls your function first when serializing entity property values. Then Breeze applies its own serialization to your function's return values, applying the techniques discussed previously. 

The `serializerFn` has two parameters: the <a href="http://www.breezejs.com/sites/all/apidocs/classes/DataProperty.html" title="DataProperty API" target="_blank">`DataProperty`</a>  to serialize and the object's current value for that property.  If the `serializerFn` returns `undefined`, the serialization of that property is suppressed.

Use *MetadataStore.setProperties* and  *EntityType.setProperties* methods to set the `serializerFn` property.

In this example, the `serializerFn` suppresses serialization of all "unmapped" properties.  

    manager.metadataStore.setProperties({
        serializerFn: function (dataProperty, value) {
            return dataProperty.isUnmapped ? undefined : value;
        }
    });
