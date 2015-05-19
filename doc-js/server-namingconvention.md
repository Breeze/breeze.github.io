---
layout: doc-js
---

# NamingConvention

Breeze moves entity data between client and server as property values.  The property names matter.

By default, the property names of an `EntityType`on the client are the same as the property names of the corresponding type on the server. If a `Person` property is called `FirstName` on the server, it will be `FirstName` on the client.

Many of us prefer camel case names in our JavaScript. We want to refer to the `firstName` on the client even if we retain `FirstName` as the property name on the server (we may not have a choice).

Welcome to the breeze `NamingConvention`, the component responsible for translating between the server-side property name and the client-side property name. The name of the default `none` convention is "noChange":

    var NamingConvention = breeze.NamingConvention; // for convenience

    NamingConvention.defaultInstance === NamingConvention.none; // true
    var name = NamingConvention.defaultInstance.name; // 'noChange'

Consider the scenario just described. Breeze offers a ready-made "camelCase" `NamingConvention`  that translates camelCase client property names to PascalCase server property names (and vice versa).

You can make "camelCase" the default convention for your application with the following line of JavaScript *before creating a `MetadataStore` or `EntityManager`*.

    NamingConvention.camelCase.setAsDefault(); 
    var name = NamingConvention.defaultInstance.name; // 'camelCase'

Subsequently a newly created `MetadataStore` will be governed by this convention.

    var store = new breeze.MetadataStore(); // gets the current default
    var name = store.namingConvention.name; // 'camelCase'

If you create a new `EntityManager` (and don't specify the `MetadataStore`) it too is governed by this convention.

    var manager = new breeze.EntityManager();  
    manager.metadataStore.namingConvention.name; // 'camelCase'

It the `none` and `camelCase` conventions don't satisfy your property translation requirements, you can <a href="#CreateConvention">create your own `NamingConvention`</a> and register it as the default.

The rest of this section dives deeper into these subjects.

<p class="note">The <a href="/samples/doccode" title="DocCode Sample" target="_blank">"DocCode" sample</a> devotes <a href="https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode/tests/namingConventionTests.js" title="DocCode: NamingConvention tests" target="_blank">an entire test suite</a> to the <strong><code>NamingConvention</code></strong> and the details described herein.</p>

## Don't fix it on the server

Let's mention what **will not work** before talking about what will work. A server-side serializer may be able to map property names on the server to property names on the client. For example, it could translate the PascalCase "FirstName" property name to the camelCase "firstName" property as it ships `Person` data to the client. The JSON.NET formatter used by ASP.NET Web API can be configured to do this.

**Don't do it!** You'll only confuse both BreezeJS and your server. 

Yes, Breeze uses property names for accessing entity data. But it also uses them to compose the query URL and to construct the data for a save request. 

When you search for a person whose first name is "Joe", Breeze must know if the wire format should say `FirstName eq 'Joe'` or `firstName eq 'Joe'`. If you change the person's name to "Joseph", Breeze must know if the JSON request should be `{"firstName": "Joseph"}` or `{"FirstName": "Joseph"}`. Breeze needs the server-side property name to compose these requests correctly. Disguising the problem with a server-side formatter  deprives Breeze of the information it needs to communicate correctly. Again, **don't do it**.

## Use the *NamingConvention*

**Use the Breeze `NamingConvention` feature instead.** In essence, a `NamingConvention` is a pair of JavaScript translation functions that execute on the client: one to translate server to client names and one to translate from client to server names.

There are two built-in `NamingConvention` instances, both static properties of the `NamingConvention` class: 

1. <a href="/sites/all/apidocs/classes/NamingConvention.html#property_defaultInstance" target="_blank">none</a> which preserves the names in both directions.
 
1. <a href="/sites/all/apidocs/classes/NamingConvention.html#property_camelCase" target="_blank">camelCase</a> which performs the 'FirstName' / 'firstName' translation.

There is always a default `NamingConvention` instance. You can ask the `NamingConvention` for the current default.

    breeze.NamingConvention.instance.name; // 'noChange'

The initial default is `none` which does nothing; it simply passes property names "*as is*" in both directions. Its name is 'noChange'.
 
You can change the default to the preferred convention  for your application.

Call the following line before creating any `MetadataStores` or `EntityManagers` to establish the `camelCase` convention as the default for your application.

    // a convention can self-register as the default
    breeze.NamingConvention.camelCase.setAsDefault();
    breeze.NamingConvention.instance.name; // now it's 'camelCase' 

#### The *MetadataStore* and the *NamingConvention*

A Breeze <a href="/sites/all/apidocs/classes/MetadataStore.html" target="_blank"><code>MetadataStore</code></a> requires a `NamingConvention` to handle property name translation.

When you create a new instance of a `MetadataStore` (explicitly or indirectly when you create a new `EntityManager`), you're also pinning it to a specific `NamingConvention` instance. It will be pinned to the default convention unless you say otherwise:

    var metadataStore = new breeze.MetadataStore();
    var convention = metadataStore.namingConvention;
    convention.name; // 'noChange'

You don't have to rely on the default convention. You can create a `MetadataStore` with a specific, alternative convention and then create an `EntityManager` that uses that `MetadataStore`:

    var convention = breeze.NamingConvention.camelCase;
    var store = new breeze.MetadataStore({ namingConvention: convention}); 
    var manager= new breeze.EntityManager( { metadataStore: store });
    manager.metadataStore.namingConvention.name; // 'camelCase'

    breeze.NamingConvention.instance.name; // default remains 'noChange'

<a name="CreateConvention"></a>
## Create a custom NamingConvention

You can create your own conventions. Here is one that translates between server property names with underscore ('\_') word separators and camelCase property names on the client.

>It assumes that *every* server-side property name is completely lowercase with '\_' separators, e.g. "first\_name". This convention will not properly round-trip a server property such as "First\_Name" or "Can\_of\_Worms"!

    function UnderscoreCamelCaseConvention() {

      return new breeze.NamingConvention({
        name: 'underscoreCamelCase',
        clientPropertyNameToServer: clientPropertyNameToServer,
        serverPropertyNameToClient: serverPropertyNameToClient
      });

      function clientPropertyNameToServer(propertyName) {
        return propertyName.replace(/[A-Z]/g, upperToUnderscoreLower);
      }

      function upperToUnderscoreLower(match) {
        return '_' + match.toLowerCase();
      }

      function serverPropertyNameToClient(propertyName) {
        return propertyName.replace(/_[a-z]/g, underscoreLowerToUpper);
      }

      function underscoreLowerToUpper(match) {
        return match[1].toUpperCase();
      }
    }

Now make it the default for your application:

    new UnderscoreCamelCaseConvention().setAsDefault();
    breeze.NamingConvention.defaultInstance.name; // 'underscoreCamelCase'

#### getting info about the property

Sometimes your convention depends upon ***more*** than just the name of the property. 

For example, you might only want to translate property names for certain `EntityType`s. Or maybe you should only translate a name for a property that returns a particular `DataType`.

Fortunately, Breeze passes in the property definition as the second parameter to both translation methods ... *if it has a property definition*. 

>The property definition will be missing when translating the name of a property of an **anonymous type**.  The data returned from a *projection* query are the most common **anonymous type** objects.
>
>You should **always** be prepared for a null or deficient property definition argument.

From the property definition you can learn a lot about the property whose name you're translating.

    serverPropertyNameToClient: function (propertyName, propDef) {
        propDef.entityType.name;      // the full name with namespace
        propDef.entityType.shortName; // the name without namespace
        propDef.dataType;             // what type it returns
        propDef.isDataProperty;       // is it a Data prop or Nav prop?
    }

>See the <a href="/doc-js/api-docs/classes/DataProperty.html" title="API: DataProperty" target="_blank">DataProperty API</a> for details of likely property definition members. Remember that this parameter may be null or deficient so always be ready for missing information.

The following convention performs BOTH a camelCase translation AND prefixes `Boolean` properties with the word particle, 'is'.  If your `VendingMachine` server-side class has a `Boolean` property called '*Enabled*', this convention turns it into 'VendingMachine.*isEnabled*' on the client:

    function BooleanNamingConvention() {

      var BOOL = breeze.DataType.Boolean;
      var camelCase = breeze.NamingConvention.camelCase;

      return new breeze.NamingConvention({
        name: 'booleanNamingConvention',
        clientPropertyNameToServer: clientPropertyNameToServer,
        serverPropertyNameToClient: serverPropertyNameToClient
      });

      function clientPropertyNameToServer(name, propDef) {
        // guard against empty or deficient property definition
        if (propDef && propDef.isDataProperty && propDef.dataType === BOOL) {
          return name.substr(2); // strip off the "is"
        } else {
          return camelCase.clientPropertyNameToServer(name);
        }
      }

      function serverPropertyNameToClient(name, propDef) {
        if (propDef && propDef.isDataProperty && propDef.dataType === BOOL) {
          return 'is' + name;
        } else {
          return camelCase.serverPropertyNameToClient(name);
        }
      }
    }

    var convention = new BooleanNamingConvention();

#### Stateful NamingConventions

Sometimes there is no way to calculate a property name that safely round-trips.

<p class="note">It is <strong>essential</strong> that your convention translate reliably in both directions.
<pre>
var clientName    = convention.serverPropertyNameToClient(serverName);
var newServerName = convention.clientPropertyNameToServer(clientName);
if (newServerName !=== serverName) { /* Big Trouble! */ }
</pre>
</p>

There are plenty of real world examples where you just can't calculate both directions. As we noted earlier, for example, the  custom `UnderscoreCamelCaseConvention` can't handle a server property name with some upper case letters in it. A server property like "Can\_of\_Worms" will become "CanOf\_Worms" on the client. You need a way to account for deviant cases like this one.

More often the problem is that you have a few unpredictable translations. For example, you are generally happy with the "camelCase" convention but you have a handful of property names that require special handling:

<table>
<tr><th style="padding-right:20px">EntityType</th><th>Client </th><th>Server </th></tr>
<tr><td>Customer </td><td style="padding-right:20px">customerName</td><td>CompanyName </td></tr>
<tr><td>Customer </td><td>zip </td><td>PostalCode </td></tr>
<tr><td>Order </td><td>freightCost </td><td>Freight </td></tr>
<tr><td>Person </td><td>firstName </td><td>FnName </td></tr>
</table>
<p></p>

A common solution to this problem is to create a dictionary with specialized *client-to-server-name* mappings. Your convention should try this dictionary first. If there is no mapping, it should fall back to your default convention.

The <a href="https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode/tests/namingConventionTests.js#L273" title="DocCode: namingConventionTests.js" target="_blank">DocCode sample has a `NamingConventionWithDictionary` type</a> that can do this for you. 

Here is how you could call it:

    var clientToServerDictionary = {
      'Customer:#Northwind.Models': {customerName: 'CompanyName', zip: 'PostalCode'},
      'Order:#Northwind.Models':    {freightCost: 'Freight'}
      undefined: {foo: 'Bar'} // translation for expected anonymous type property
    };

    var convention = new NamingConventionWithDictionary('northwind',
        breeze.NamingConvention.camelCase, clientToServerDictionary);

Notice the mapping for the `undefined` type. This option affords support for *anonymous type* name translation.

But what if there are just too many names to remember in a dictionary? 

Maybe you can calculate the client name from the server name but the process is not reversible. In that case, you could record the server property names in the convention instance itself as you translate them to client property names. 

You'll also leverage the fact that Breeze runs the `NamingConvention` server-to-client translation when you load the metadata.

Here is an example of a convention that follows that plan:

    // Removes underscores from server property names
    // Remembers them in a private dictionary so it can restore them
    // when translating from client name to server name
    // Warning: use only with metadata loaded directly from server
    function NoUnderscoreConvention() {

      var _underscoredNames = {}; // hash of every translated server name

      return new NamingConvention({
        name: 'noUnderscore',
        clientPropertyNameToServer: clientPropertyNameToServer,
        serverPropertyNameToClient: serverPropertyNameToClient
      });

      function clientPropertyNameToServer(clientPropertyName) {
        var serverName = _underscoredNames[clientPropertyName];
        return serverName || clientPropertyName;
      }

      function serverPropertyNameToClient(serverPropertyName) {
        if (serverPropertyName.indexOf('_') > -1) {
          var clientName = serverPropertyName.replace(/_/g, ''); // remove all _
          // remember this substitution
          _underscoredNames[clientName] = serverPropertyName;
          return clientName;
        }
        return serverPropertyName;
      }
    }

## No NamingConvention for EntityType names

The `NamingConvention` translates property names but it can't translate `EntityType` names. 

<p class="note">In fact, at this time the developer would find it extremely difficult to translate <code>EntityType</code> names in Breeze. If you need this feature, please vote for it on <a href="http://breezejs.uservoice.com/forums/173093-1-breezejs-feature-suggestions/suggestions/7079377-namingconvention-for-entitytype-names" "Suggestion on UserVoice" target="_blank">UserVoice</a>.</p>

<a name="NamingConventionInMetadata"></a>
## Beware of the baked-in NamingConvention

Each `MetadataStore` has a `NamingConvention` at birth. 

    var store1 = new breeze.MetadataStore(); // born with the then-current NamingConvention.defaultInstance
    var store2 = new breeze.MetadataStore({namingConvention: NamingConvention.camelCase}); // born with the camelCase convention

Once a `MetadataStore` has been created, its `NamingConvention` cannot be changed directly.

If the `MetadataStore` is empty, it can be changed *indirectly* by importing metadata:

    var exportedMetadata = store2.exportMetadata(); // store2 has NamingConvention.camelCase
    var store3 = new breeze.MetadataStore(); // assume NamingConvention.none
    store3.importMetadata(exportedMetadata);
    store3.namingConvention.name; // "camelCase"

This can be an unwelcome surprise. Imagine you defined your `MetadataStore` with one convention. Then you imported metadata you need from some source and discover (after your app misbehaves mysteriously) that your store is locked into a *different convention*.

Suppose you want the metadata exported from an existing store but  you don't want the convention buried in that metadata. With a bit of cleverness, you can remove that "commitment" - make the metadata "naming convention agnostic" - and import that metadata into a new `MetadataStore` that has a different convention.

    var x = JSON.parse(exportedMetadata); // from the previous example
    delete x.namingConvention; // delete the 'NamingConvention' node
    cleanCopy = JSON.stringify(x); // serialize it again but without the 'NamingConvention' node

    // now load this NamingConvention-agnostic metadata into a new MetadataStore
    var store4 = new breeze.MetadataStore(); // created with the default "noChange" convention
    store.importMetadata(cleanCopy);
    store.metadataStore.NamingConvention.name; // "noChange"

#### Key Points

1. Changing the default `NamingConvention` after you've defined a `MetadataStore` has no effect on that store.

1. When you import metadata to store 'x', the `NamingConvention` of the imported metadata trump 'x's current convention.

1. You can "purify" exported metadata of its embedded `NamingConvention` and then import it into another `MetadataStore` governed by a completely different convention.

# Beyond the NamingConvention ... the JsonResultsAdapter

The `NamingConvention` is ideal for *property name* translation. When you need to do more complex manipulations of data arriving from the server, you can turn to the [**`JsonResultsAdapter`**](mapping-json)