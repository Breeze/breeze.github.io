---
layout: doc-js
redirect_from: "/old/documentation/validation.html"
---
# Validation

> Every code snippet on this page is in the **validationTests** module of <a href="/doc-samples/doccode">DocCode</a>. The tests are yours to explore and modify. Please send us your feedback and contributions.

A good application strives to ensure the integrity of data before saving them to permanent storage in part by screening new and changed with validation rules.

Validation in a web application must be performed on the server &hellip; always. Client-side validation is no substitute for server-side validation.

But client-side validation can be essential to the user experience. Users want to know immediately when input is bad. They despise filling in a long form only to have it rejected by the backend. We expect the app to catch bone head mistakes before we submit them. Tell us *now* that the date is required, the name is too long, daffodils don't come in black, and we can't receive a product until we've ordered it.

Support for validation is built into Breeze entities and the Breeze processing pipelines. Breeze maintains lists of validation rules and applies them automatically at specific moments in the entity life-cycle. But you remain always in control. Breeze discovers some validation rules and infers others; but you can add your own rules and remove any rule that you don't like. You choose when Breeze validates. You can validate any set of entities or entity properties at any time. You decide what the error messages say and how they're presented.

This topic covers the most important aspects of the Breeze validation system.

# Validator: the Breeze validation rule

Validation is a process of judging the current state of an entity with validation rules. Each rule assesses a fact about the validity of an entity or one of its properties. A rule judges but it does not change; the entity values are the same, before and after evaluation.

Concretely, a validation rule is an instance of the Breeze <a href="/doc-js/api-docs/classes/Validator.html" target="_blank">`Validator` class</a>.

> Please read the Breeze API documentation for the **<a href="/doc-js/api-docs/classes/Validator.html" target="_blank">`Validator` class</a>**. It has a lot of good information about how validations work and how to write them.

Most Breeze validators evaluate property data. A length validator can detect if the *CompanyName* is too long; a required validator determines that the *CompanyName* has a value; a string data type validator ensures that the *CompanyName* is a string, not a number or a date.&nbsp; These rules combine to determine the overall validity of the *CompanyName* property.&nbsp;

During validation, Breeze calls each validator's `validate` method, passing in the value to evaluate and such context as the rule requires. If the value passes validation, the validate method returns null; if the value fails validation, the method returns a `ValidationError`.

Breeze accumulates `ValidationErrors` in the entity's validation errors collection which you can access by calling `entity.entityAspect.getValidationErrors()`. When a rule fails, Breeze adds the rules `ValidationError` to the collection. When a rule passes, Breeze removes the previous `ValidationError` associated with that rule.

After a full entity validation, a 'clean' entity will have an empty validation errors collection. The entity is invalid if there are any errors left in the collection.

Breeze does not object to entities having errors. It's the developer who decides what to do about invalid entities. Breeze won't interfere except on one occasion: Breeze won't save an entity with validation errors. In fact, it won't save any entities in a change-set if even one of them has errors.

An application typically tells the user when an entity has errors and tries to guide the user toward correcting them. Breeze has no prescription for doing this; it's the developer's job to present errors. Breeze does raise an event when errors are added and removed from the error collection; the developer can listen by subscribing to an entity's `entityAspect.validationErrorsChanged` event and adjust application behavior accordingly.

## Automatic validation

The Breeze `EntityManager` can validate an entity in cache at four predetermined times:

1. the entity enters cache as a result of a query
1. an entity is added or attached to the EntityManager
1. an entity property value is changed
1. an entity is about to be saved

The manager's `ValidationOptions` determines whether the manager will or will not validate at those times. The default options are:

| **Option** | **Default** 
| ---------- | ------------
| validateOnQuery | 	false
| validateOnAttach | 	true
| validateOnPropertyChange | true
| validateOnSave | 	true
			
You can change those settings by updating the manager's options. For example, let's stop validating when we attach an entity to a manager:

    // copy options, changing only 'validateOnAttach'
    var valOpts = em.validationOptions.using({ validateOnAttach: false });
    
    // reset manager's options
    manager.setProperties({ validationOptions: valOpts });

We can make this the default for all future managers:

    valOpts.setAsDefault();

> Breeze automatically validates entities in cache. It won't do so for detached entities. For example, a newly created *Customer* is technically invalid because its `CompanyName` is null and that property is required. Breeze does not validate the customer until you add it to the cache. This gives you time to set the values of a new entity before it enters the cache and triggers validation.

## Manual validation

You can validate an individual entity at any time, whether it is attached or not:

    if (!newCustomer.entityAspect.validateEntity()) {/* do something about errors */}

You can also validate a specific property:

    if (!newCustomer.entityAspect.validateProperty('CompanyName')) {
       /* do something about errors */}

## Server-side validation

Validation on the client improves the user experience; some say that makes it optional. Validation on the server protects the permanent data; everyone agrees that is mandatory.

There are many ways to validate data on the server. Much depends on the technologies and practices that you are using.

No matter what you do, you'll probably want to surface the validation errors on the client. The topic ["Server-side validation"](/doc-net/ef-serverside-validation) covers how to prepare errors and transmit them in JSON so that the Breeze client can include them in the entity's validation errors collection. 

>That topic also explains how validation errors detected by Entity Framework are automatically communicated to the client.

Client- and server-generated validation errors share the same entity errors collection. You can distinguish between these two kinds of error by the `isServerError` property.

### Clearing server validation errors ###

Breeze automatically removes *client* validation errors when the user cures the problem. It can't do that for *server* validation errors. 

Breeze can't because it doesn't know about server validation logic, only client validation logic. Therefore, server validation errors stay in the entity's validation errors collection until (a) you try to save the entity or (b) you clear them manually.

> Breeze automatically clears server-generated errors before evaluating an entity for save.

You can remove all current errors from the collection by calling `entityAspect.clearValidationErrors`. You can remove a specific error, client- or server-generated, by calling `entityAspect.removeValidationError`. A simple loop can remove the server-generated errors:

	entity.entityAspect.getValidationErrors().forEach(function(err) {
		if (err.isServerError) {  aspect.removeValidationError(err);	}
	});

It's up to you to pick the appropriate time to clear those server errors.

## Add a Breeze validator

Of course validation works only because there are validation rules (AKA, 'validators') associated with the property definitions in the metadata. It's up to you to ensure that you put the right validators in place.

If your metadata was generated by an `EFContextProvider`, many of the properties will have validators already. The `EFContextProvider` interprets the server-side type information and adds required and data type validations to the metadata. it also recognizes the length <a href="http://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations.aspx" target="_blank">.NET data annotations</a> and adds validators for them.

You can add validations to metadata with client code. You'll probably want to do that if you are not generating metadata from an `EFContextProvider` or you want additional validations.

The Breeze `Validator` class offers some stock property validators, all available as static methods.

- *integer*, *date*, *string* and many more 'dataType' validators that ensure new values conform to the target data type
- *creditCard*
- *emailAddress*
- *maxLength*
- *phone*  (BETA)
- *regularExpression*
- *required*
- *url*

> Many of these validators correlate to <a href="http://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations.aspx" target="_blank">.NET data annotations</a> . In a future release, the Breeze.NET `EFContextProvider`will be able to include these validations in the metadata automatically for you. For now, you'll have to add them to the properties on the client side as we show next.

Here's how you might add the "url" and "required" validators to a `Person` property :

    // Add Url validator to the blog property of a Person entity
    // Assume em is a preexisting EntityManager.
    var personType = em.metadataStore.getEntityType("Person"); //get the Person type
    var websiteProperty = personType.getProperty("website"); //get the property definition to validate

    var validators = websiteProperty.validators; // get the property's validator collection
    validators.push(Validator.required()); // add a new required validator instance 
    validators.push(Validator.url()); // add a new url validator instance 

### Regular Expression validators

Many real world validations can be implemented with the `regularExpression` validator and a well crafted regular expression. The
[`breeze.Validator.makeRegExpValidator`](/doc-js/api-docs/classes/Validator.html#method_makeRegExpValidator) static helper makes that a little easier and also encapsulates the regular expression within the validator it creates. For example, we can make a U.S. zipcode validator and apply it to one of the `Customer` properties.

    // Make a zipcode validator
    function zipValidator = breeze.Validator.makeRegExpValidator(
        "zipVal",  
        /^\d{5}([\-]\d{4})?$/,  
        "The %displayName% '%value%' is not a valid U.S. zipcode");

    // Register it with the breeze Validator class.
    breeze.Validator.register(zipValidator);

    // Add it to the Customer.PostalCode data property. Assume em is a preexisting EntityManager.
    var custType = em.metadataStore.getEntityType("Customer");  //get the Customer type
    var zipProperty = custType.getProperty("PostalCode");    //get the PostalCode property definition
    zipProperty.validators.push(zipValidator);    // get that property's validators and push on the zipValidator

## Write a custom validator

You can write your own validators too. A validator is defined and applied in the same way whether stock or custom.

You create a custom validator by calling the `Validator`'s constructor with three parameters:

- The name of your validator
- The validation function that actually performs the assessment; `Validator.validate` delegates to this function.
- An optional, arbitrary context object which is your chance to supply the function with any external information it needs.

To illustrate, we'll add a jingoistic validator to our application that only approves of the United States. We start with the validation function for that rule:

    function countryIsUSValidationFn(value, context) {
        if (value == null) return true; // '== null' matches null and empty string
        return value.toUpperCase().startsWith('US');
    };

Next we construct a new validator to apply this function:

    var countryIsUSValidator = new breeze.Validator(
         'countryIsUS',              // validator name
         countryIsUSValidationFn,    // validation function
         {                           // validator context
             messageTemplate: ''%displayName%' must start with 'US''
         });

The validator context object defines a `messageTemplate` that Breeze will recognize and use to construct an error message, substituting the property name for '%displayName%'.

We might write some unit tests that call `validate` with a variety of values, something you can do to stock validators as well.

# Apply the validator

Now that we've crafted a new validator, it's time to put it to work. Let's add this validator to the property of an Employe. We get the `EntityType` for the Employee from a *MetadataStore* and add the rule to the validators for the Employee type's '*Country*' `DataProperty`:

    var employeeType = manager.metadataStore.getEntityType('Employee');
    employeeType
        .getProperty('Country')
        .validators.push(countryIsUSValidator);

The 'countryIsUS' rule is now active for the `Employee.Country` property.

It's a general purpose rule that we could apply to any other string property. For example, we might only do business with US companies:

    var customerType = manager.metadataStore.getEntityType('Customer');
    customerType
        .getProperty('Country') // Customer has 'Country' property too
        .validators.push(countryIsUSValidator);

> The `EntityType` must be present in metadata before you can apply the rule. You can *define* the rule *before* getting the metadata, perhaps immediately after launching the application. But you can't add the validator to the type or any of its properties until the type is defined. For most applications,** you must wait** untl the client has retrieved metadata from the server. You can fetch that metadata explicitly or wait until Breeze gets it implicitly during the first query.

## Parameterized validator

The 'countryIsUS' property now excludes non-US customers. What if a Canadian company wants to use this validator and wants only Canadian customers?

Rather than mint a completely new rule, we can generalize the one we have:

    function countryValidationFn(value, context) {
        if (value == null) return true; // '== null' matches null and empty string
        return value.toUpperCase().startsWith(context.country.toUpperCase());
    };

Notice that we're actually using the context object this time. It holds the value (the country name) to compare with user input.

<a name="ValidatorFactory"></a>Then we create a validator *factory* (a function returning a validator) instead of a fixed validator object:

    // returns a countryValidator with its parameters filled
    function countryValidatorFactory(context) {
    
        return new breeze.Validator(
            'countryValidator',  // validator name
            countryValidationFn, // validation function
            {                    // validator context
                messageTemplate: ''%displayName%' must start with '%country%'',
                country: context.country
            });
    }

Notice that the message template incorporates the parameter.

Finally, our Canadian friends use the factory to add their version of the rule to the model:

    // create a Canada-only validator
    var canadaOnly = countryValidatorFactory({ country: 'Canada' });
    
    // add the Canada-only validator
    customerType
        .getProperty('Country')
        .validators.push(canadaOnly);
    
<a name="refNav"></a>

## Reference navigation validation

What if a reference navigation is required? How do you validate that?

A reference navigation property returns a single related "parent" ("Principal") entity. For example, an instance of the `OrderDetail` type has a parent `Order` which you access via the `OrderDetail.Order` property. The parent must exist. 

The Breeze client metadata will require `OrderDetail.Order` automatically if (a) you rely on EntityFramework to generate metadata and (b) you marked the C# `OrderDetail.Order` navigation property with the `[Required]` attribute. However, many folks either don't or don't want to require the navigation property on the server. But they do want to require it on the client.

Cover this case by adding the required validation to the client-side metadata yourself:

    var detailType = metadataStore.getEntityType('OrderDetail');
    var property = detailType.getProperty('Order');
    property.validators.add(breeze.Validator.required());  

#### Foreign Key validation

That takes care of the `OrderDetail.Order` navigation property. But what about the foreign key (FK) property that backs it, `OrderDetail.OrderID`? 

The `OrderDetail.OrderID` FK property should be required and probably is already required. You can relax, right?

Maybe not. Unfortunately, a `required` validator is unlikely to provide useful protection because `OrderID` almost always has a value anyway. It may not be the right value but it *has* a value.

When you create a new `OrderDetail`, Breeze initializes the `OrderID` FK property to the default value for the datatype which in this case is zero.  Zero is a valid integer. The `OrderID`'s "required" validator can't complain. 

The validator would complain if `OrderID` were null. But Breeze initialized it with zero as it does other integer properties such as `quantity`, `price`, and `weight`.

Zero may be a good default elsewhere. Here zero is an invalid dummy value. While **you know** that there is no `Order` with `OrderID === 0`, Breeze doesn't know that and can't assume that. It's entirely possible that you really do have a valid `Order` with `OrderID === 0`.

What can you do?

***You could initialize the FK property to null.***

    var detail = manager.createEntity('OrderDetail', {
        OrderID: null});

The `required` validator will complain as expected because the `OrderID` is "missing".

***You could add a custom validator to check for zero***

First create it:

    function nonZeroIdValidator(msgTemplate) {
        var name = 'nonZeroId';
        var ctx = { 
             messageTemplate: msgTemplate || 'the %displayName% is required.'};

        var validator = new breeze.Validator(name, valFunction, ctx);
        return validator;

        function valFunction(value) {
            return value ? value !== 0 : false;
        }
    }

Now apply it to the property (properties) that need it during your application model initialization phase.

    var detailType = metadataStore.getEntityType('OrderDetail');
      var property = detailType.getProperty('OrderID');
      property.validators.add(nonZeroIdValidator());

Although a bit more involved than initializing an FK to null, there are advantages to this approach:

- no need for an initialization "trick"
- the `nonZeroIdValidator` states the issue clearly
- you can reuse the `nonZeroIdValidator` by applying it to every required integer FK  (and PK) properties on every type in your model. 

> You might write a helper class that spiders through your metadata, adding this validator to non-nullable integer PK and FK properties. Be sure to share that with the community!

## Entity-level validator

Some business rules evaluate the entity as a whole. They might confirm that the values of several properties are collectively consistent or that a parent entity (e.g., *Order*) has proper child entities (e.g., at least one *OrderDetail*).

To illustrate, we'll add a rule to test if a customer postal code is a valid US zip code. We only want to perform that test if the customer is in the USA.

First, the validation function:

    // The value to assess will be an entity
    // with Country and PostalCode properties
    function zipCodeValidationFn(entity, context) {
        // This validator only validates US Zip Codes.
        if (entity.getProperty('Country') === 'USA') {
            var postalCode = entity.getProperty('PostalCode');
            context.postalCode = postalCode;
            return isValidZipCode(postalCode);
        }
        return true;
    };

    function isValidZipCode(value) {
        var re = /^\d{5}([\-]\d{4})?$/;
        return (re.test(value));
    }

Take note of this line:

    context.postalCode = postalCode;

We added the actual entity property value as a new property of the context. Breeze can pick up that value later and plug it into the error message if the template has a '%postalCode% token.

Now the validator:

    var zipCodeValidator = new breeze.Validator(
        'zipCodeValidator',
         zipCodeValidationFn,
        { messageTemplate: ''%postalCode%' is not a valid US zip code' });

Finally, add this validation rule to the model.


    // add US zip code validator to the entity (not to a property)
    customerType
        .validators.push(zipCodeValidator);

## Register custom validators with Breeze

Typically, you define a custom validator, get the metadata from the server (implicitly or explictily), and then add your custom validator to the validator collections of the appropriate entity types and properties as discussed above **That's usually all you have to do**.

But there is a special case. When you get your metadata from a local serialized source rather than the server, you must take one more step: you must register that validator with Breeze.

For example, suppose you designed your application to load entities from local storage when it starts. In the previous session you exported the entity cache and stowed the serialized cache data to browser local storage (see '<a href="/doc-js/export-import" target="_blank">Export/Import</a>'). Now when you start a new session, your app restores the cache and you pick up where you left off ... without having to hit the server. Pretty cool!

Unfortunately, the app throws an exception when it loads the locally stored data. The exception complains about an unknown, unregistered validation rule ... perhaps that custom *zipCodeValidator* we just created. What happened?

When you exported the cache of entities, you also exported the metadata; they're part of the serialized cache. Inside that metadata is a reference to a validator named *zipCodeValidator*. The ***name*** of the function is in the serialized metadata; the function ***definition*** is not. The metadata definition of the Customer includes the fact that a customer entity must be validated with something called 'zipCodeValidator'. Unfortunately, Breeze doesn't know what a 'zipCodeValidator' is. When Breeze restores the metadata (and the entities) it needs your help in connecting the name of the validator to the validator function itself. You provide that help by registering your custom validator with the Breeze Validator class:

    Validator.register(zipCodeValidator);

If you created a <a href="#ValidatorFactory">validator factory</a>, you register that with a related method:

    Validator.registerFactory(countryValidatorFactory, 'countryValidator');

Notice the second parameter. That's the registration name and it must be the name of the validator that your factory creates; <a href="#ValidatorFactory">scroll up</a> and you'll find that we named it 'countryValidator'. No, Breeze won't figure that out for you; it would have to execute your factory with a context object to produce a validator with the right name ... but has no way to create a valid context object

Make sure you register your custom validators and validator factories *before* retrieving metadata from local storage.

> We think it's a good practice to register your custom validators although you don't have to unless you'll be getting metadata from a serialized source other than the server.  Play it safe; register them.

Breeze keeps all validators in a central registry. You can retrieve any validator by name as follows:

    var myValidator= breeze.config.functionRegistry['Validator.myValidator'](); 

## Remove a validator from the EntityType

You can remove a rule from the model by removing the validator from its collection.

    var custValidators = customerType.validators;
    custValidators.splice(custValidators.indexOf(unwantedRule), 1);


## ValidationErrors<a name="ValidationErrors"></a>

We removed the rule but not any `ValidationError`s that were already produced by that rule. Those you must remove manually from the affected entities.

    // Clear out any 'unwantedRule' errors
    // Must do manually because that rule is now gone
    // and, therefore, can't cleanup after itself
    cust.entityAspect.removeValidationError(unwantedRule);

And of course you can insert a `ValidationError` of your own - one that you made up yourself without the aid of a validator - by doing this:

    // create a fake ValidationError for a someValidator
    var fakeError = new breeze.ValidationError(
        someValidator,                // a marker validator, perhaps faked
        {},                           // validation context
        'You were wrong this time!'   // error message
    );

    // add the fake error
    cust.entityAspect.addValidationError(fakeError);

### EntityAspect.hasValidationErrors<a name="hasValidationErrors"></a>

The *EntityAspect.hasValidationErrors* property is automatically set and cleared as validation errors are added or removed.

### EntityManager.validationErrorsChanged<a name="validationErrorsChanged"></a>

This event is fired whenever any entity within the EntityManager experiences any changes to its validation errors collection, available via the *EntityAspect.getValidationErrors* method. Event suppression (enabling/disabling) is fully supported at both the EntityManager and the EntityAspect level for this event. This means:
	
    Event.enable("validationErrorsChanged, myEntityManager, false); // will suppress both entityManager and entityAspect level validationErrorsChanged events for ‘myEntityManager’
           // Whereas 
    Event.enable("validationErrorsChanged, myEntity.entityAspect, false); // will only suppress the entityAspect level validationErrorsChanged event for this entity.

## <a name="message-templates"></a>Customize the message templates

Don't like the messages produced by the stock validators? Need to translate them to another language? No problem. The messages are based on templates that you can access and change. The <a href="/doc-js/api-docs/classes/Validator.html#property_messageTemplates" target="_blank">Validator.messageTemplates</a> class property returns the template collection, keyed by the validator name. Configure it to suit your needs. For example, we could make the `Validator.required` message a bit more emphatic:

    Validator.messageTemplates['required',
      'Dude! The '%displayName%' is really required ... seriously ... as in mandatory');

Your custom validators can keep their templates in this collection too.