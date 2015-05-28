---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/validation.html"
---

# Validation

<p class="note">Every code snippet on this page is in the <strong>ValidationTests.cs</strong> file of <a href="https://github.com/Breeze/breeze.sharp.samples/tree/master/DocCode">DocCode</a>. The tests are yours to explore and modify. Please send us your feedback and contributions.</p>

A good application strives to ensure the integrity of data before saving them to permanent storage in part by screening new and changed with validation rules.

Validation in a web application must be performed on the server ... always. Client-side validation is no substitute for server-side validation.

But client-side validation can be essential to the user experience. Users want to know immediately when input is bad. They despise filling in a long form only to have it rejected by the backend. We expect the app to catch bone head mistakes before we submit them. Tell us ***now*** that the date is required, the name is too long, daffodils don't come in black, and we can't receive a product until we've ordered it.

Support for validation is built into Breeze entities and the Breeze processing pipelines. Breeze maintains lists of validation rules and applies them automatically at specific moments in the entity life-cycle. But you remain always in control. Breeze discovers some validation rules and infers others; but you can add your own rules and remove any rule that you don't like. You choose when Breeze validates. You can validate any set of entities or entity properties at any time. You decide what the error messages say and how they're presented.

This topic covers the most important aspects of the Breeze validation system.

## Validator: the Breeze validation rule

Validation is a process of judging the current state of an entity with validation rules.&nbsp; Each rule assesses a fact about the validity of an entity or one of its properties. A rule judges but it does not change; the entity values are the same, before and after evaluation.

Concretely, a validation rule is an instance of the Breeze [`Validator`](/doc-cs/api-docs/html/T_Breeze_Sharp_Validator.htm) class.

<p class="note">Please read the Breeze API documentation for the <strong><a href="/doc-cs/api-docs/html/T_Breeze_Sharp_Validator.htm" target="_blank"><span class="codeword">Validator</span></a></strong> class. It has a lot of good information about how validations work and how to write them.</p>

Most Breeze validators evaluate property data. A length validator can detect if the ***CompanyName*** is too long; a required validator determines that the ***CompanyName*** has a value; a string data type validator ensures that the ***CompanyName*** is a string, not a number or a date. These rules combine to determine the overall validity of the ***CompanyName*** property.

During validation, Breeze calls each validator's `Validate` method, passing in the value to evaluate and such context as the rule requires. If the value passes validation, the Validate method returns null; if the value fails validation, the method returns a `ValidationError`.

Breeze accumulates `ValidationErrors` in the entity&rsquo;s validation errors collection which you can access by calling `anEntity.EntityAspect.GetValidationErrors()`. When a rule fails, Breeze adds the rule's `ValidationError` to the collection. When a rule passes, Breeze removes the previous `ValidationError` associated with that rule.

After a full entity validation, a "clean" entity will have an empty validation errors collection. The entity is invalid if there are any errors left in the collection.

Breeze does not object to entities having errors. It's the developer who decides what to do about invalid entities. Breeze won't interfere except on one occasion: Breeze won't save an entity with validation errors. In fact, it won't save any entities in a change-set if even one of them has errors.

An application typically tells the user when an entity has errors and tries to guide the user toward correcting them. Breeze has no prescription for doing this; it's the developer's job to present errors. Breeze does raise an event when errors are added and removed from the error collection; the developer can listen by subscribing to an entity's `EntityAspect.ErrorsChanged` event and adjust application behavior accordingly.

## Automatic validation

The Breeze `EntityManager` can validate an entity in cache at four predetermined times:

1. 	the entity enters cache as a result of a query
2. 	an entity is added or attached to the EntityManager
3. 	an entity property value is changed
4. 	an entity is about to be saved

The manager's `ValidationOptions` determines whether the manager will or will not validate at those times. The default options are:

| **Option** | **Default**
| ---------| ----------
| OnQuery | false
| OnAttach | true
| OnPropertyChange |true
| OnSave | true


You can change those settings by updating the manager's options. For example, let's stop validating when we attach an entity to a manager:

    // change the default options, turning off "OnAttach"
    var valOpts = new ValidationOptions { ValidationApplicability = ValidationApplicability.OnPropertyChange | ValidationApplicability.OnSave };
    
    // reset manager's options
    manager.ValidationOptions = valOpts;

We can make this the default for all future managers:

    ValidationOptions.Default = valOpts;

> Breeze automatically validates entities in cache. It won't do so for detached entities. For example, a newly created *Customer* is technically invalid because its `CompanyName` is null and that property is required. Breeze does not validate the customer until you add it to the cache. This gives you time to set the values of a new entity before it enters the cache and triggers validation.

## Manual validation

You can validate an individual entity at any time, whether it is attached or not:

    var results = newCustomer.EntityAspect.Validate();
    if (results.Any()) {/* do something about errors */}

You can also validate a specific property:

    var dp = newCustomer.EntityAspect.EntityType.GetDataProperty("CompanyName");
    results = newCustomer.EntityAspect.ValidateProperty(dp);
    if (results.Any()) { /* do something about errors */}

## Server-side validation

Validation on the client improves the user experience; some say that makes it optional. Validation on the server protects the permanent data; everyone agrees that is mandatory.

There are many ways to validate data on the server. Much depends on the technologies and practices that you are using.

No matter what you do, you'll probably want to surface the validation errors on the client. The topic ["Server-side validation"](/doc-cs/server-side-validation) covers how to prepare errors and transmit them in JSON so that the Breeze client can include them in the entity's validation errors collection. 

>That topic also explains how validation errors detected by Entity Framework are automatically communicated to the client.

Client- and server-generated validation errors share the same entity errors collection. You can distinguish between these two kinds of error by the `IsServerError` property.

### Clearing server validation errors ###

Breeze automatically removes ***client*** validation errors when the user cures the problem. It can't do that for ***server*** validation errors. 

Breeze can't because it doesn't know about server validation logic, only client validation logic. Therefore, server validation errors stay in the entity's validation errors collection until (a) you try to save the entity or (b) you clear them manually.

>Breeze automatically clears server-generated errors before evaluating an entity for save.

You can remove all current errors from the collection by calling `EntityAspect.ValidationErrors.Clear()`. You can remove a specific error, client- or server-generated, by calling `newCustomer.EntityAspect.ValidationErrors.Remove(specificError)`. A simple loop can remove the server-generated errors:

    var errors = newCustomer.EntityAspect.ValidationErrors;
    errors.ForEach(ve =>
                       {
                           if (ve.IsServerError) errors.Remove(ve);
                       });


It's up to you to pick the appropriate time to clear those server errors.

## Add a Breeze validator

Of course validation works only because there are validation rules (AKA, "validators") associated with the property definitions in the metadata. It's up to you to ensure that you put the right validators in place.

If your metadata was generated by an `EFContextProvider`, many of the properties will have validators already. The `EFContextProvider` interprets the server-side type information and adds required and data type validations to the metadata. it also recognizes the length [.NET data annotations](http://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations.aspx) and adds validators for them.

You can add validations to metadata with client code. You'll probably want to do that if you are not generating metadata from an `EFContextProvider` or you want additional validations.

Breeze offers some stock property validators in the Breeze.Sharp namespace. 

- ***RequiredValidator***
- ***MaxLengthValidator***
- ***RangeValidator<T>*** 
- ***RegularExpressionValidator***
- ***EmailValidator***
- ***UrlValidator***
- ***PhoneValidator***  (BETA)

>Many of these validators correlate to [.NET data annotations](http://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations.aspx). In a future release, the Breeze.NET `EFContextProvider`will be able to include these validations in the metadata automatically for you. For now, you'll have to add them to the properties on the client side as we show next.

Here's how you might add a "required" validator to a `Customer` property :

    // Add required validator to the Country property of a Customer entity
    var customerType = manager.MetadataStore.GetEntityType(typeof(Customer)); //get the Customer type
    var countryProp = customerType.GetProperty("Country"); //get the property definition to validate

    var validators = countryProp.Validators; // get the property's validator collection
    validators.Add(new RequiredValidator()); // add a new required validator instance 

### Regular Expression validators ###

Many real world validations can be implemented with the `RegularExpression` validator and a well crafted regular expression. The `RegexValidator` makes that a little easier and also encapsulates the regular expression within the validator it creates. For example, we can make specify a `RegexValidator` that validates emails and apply it to one of the `Employee` properties.

    // add regex validator that validates emails to the HomePhone property
    employeeType.GetProperty("HomePhone")
                .Validators.Add(new RegexValidator(@"^((\([2-9]\d{2}\) ?)|([2-9]\d{2}[-.]))\d{3}[-.]\d{4}$")); // email pattern

## Write a custom validator

You can write your own validators too. A validator is defined and applied in the same way whether stock or custom.

You create a custom validator by creating a class that extends from `Validator` and implements the following:

1. A constructor that initializes `LocalizedMessage` with a custom message.

2. Overrides the `ValidateCore` method that actually performs the assessment; `Validator.Validate` delegates to this method.

3. Overrides the `GetErrorMessage` method which supplies the `LocalizedMessage` with inputs for the property name and value.

To illustrate, we'll add a jingoistic validator to our application that only approves of the United States. We start with the validation function for that rule:</p>

    protected override bool ValidateCore(ValidationContext context)
    {
        var value = (String)context.PropertyValue;
        if (value == null) return true; // '== null' matches null and empty string
        return value.ToUpper().StartsWith("US");
    }

Next we implement the constructor:

    public CountryIsUsValidator()
    {
        LocalizedMessage = new LocalizedMessage("{0} must start with 'US', '{1}' is not valid");
    }

And override the `GetErrorMessage` method:

    public override string GetErrorMessage(ValidationContext validationContext)
    {
        return LocalizedMessage.Format(validationContext.Property.DisplayName, validationContext.PropertyValue);
    }

The `LocalizedMessage` defines a custom message template that Breeze will recognize and use to construct an error message, substituting the {0} property name and {1} property value supplied by the `GetErrorMessage` method.

We might write some unit tests that call `Validate` with a variety of values, something you can do to stock validators as well.

## Apply the validator

Now that we've crafted a new validator, it's time to put it to work. Let's add this validator to the property of a Customer. We get the `EntityType` for the Customer and add the rule to the validators for the Customer type's ***"Country"*** `DataProperty`:

    customer.EntityAspect.EntityType.GetProperty("Country")
            .Validators.Add(new CountryIsUsValidator());

The "CountryIsUS" rule is now active for the Customer.Country property.

It's a general purpose rule that we could apply to any other string property. For example, we might only hire US employees:

    employee.EntityAspect.EntityType.GetProperty("Country")
            .Validators.Add(new CountryIsUsValidator());

>The *EntityType* must be present in metadata before you can apply the rule. You can <em>define </em>the rule <em>before </em>getting the metadata, perhaps immediately after launching the application. But you can't add the validator to the type or any of its properties until the type is defined. For most applications, **you must wait** until the client has retrieved metadata from the server. You can fetch that metadata explicitly or wait until Breeze gets it implicitly during the first query.

<a name="refNav"></a>
## Reference navigation validation

What if a reference navigation is required? How do you validate that?

A reference navigation property returns a single related "parent" ("Principal") entity. For example, an instance of the `OrderDetail` type has a parent `Order` which you access via the `OrderDetail.Order` property. The parent must exist. 

The Breeze client metadata will require `OrderDetail.Order` automatically if (a) you rely on EntityFramework to generate metadata and (b) you marked the C# `OrderDetail.Order` navigation property with the `[Required]` attribute. However, many folks either don't or don't want to require the navigation property on the server. But they do want to require it on the client.

Cover this case by adding the required validation to the client-side metadata yourself:

	var detailType = manager.MetadataStore.GetEntityType(typeof(OrderDetail));
    var property = detailType.GetProperty("Order");
    property.Validators.Add(new RequiredValidator());  

## Foreign Key validation

That takes care of the `OrderDetail.Order` navigation property. But what about the foreign key (FK) property that backs it, `OrderDetail.OrderID`? 

The `OrderDetail.OrderID` FK property should be required and probably is already required. You can relax, right?

Maybe not. Unfortunately, a `RequiredValidator` is unlikely to provide useful protection because `OrderID` almost always has a value anyway. It may not be the right value but it *has* a value.

When you create a new `OrderDetail`, Breeze initializes the `OrderID` FK property to the default value for the datatype which in this case is zero.  Zero is a valid integer. The `OrderID`'s "required" validator can't complain. 

The validator would complain if `OrderID` were null. But Breeze initialized it with zero as it does other integer properties such as `quantity`, `price`, and `weight`.

Zero may be a good default elsewhere. Here zero is an invalid dummy value. While **you know** that there is no `Order` with `OrderID == 0`, Breeze doesn't know that and can't assume that. It's entirely possible that you really do have a valid `Order` with `OrderID == 0`.

What can you do?

***You could initialize the FK property to null (if the type is a nullable integer).***

    var detail = manager.CreateEntity<OrderDetail>(new {OrderID = null});

The `required` validator will complain as expected because the `OrderID` is "missing".

***You could add a custom validator to check for zero.***

First create it:

    public class NonZeroIdValidator : Validator
    {
        public NonZeroIdValidator()
        {
            LocalizedMessage = new LocalizedMessage("{0} is required");
        }

        protected override bool ValidateCore(ValidationContext context)
        {
            var value = (int)context.PropertyValue;
            return value != 0;
        }

        public override string GetErrorMessage(ValidationContext validationContext)
        {
            return LocalizedMessage.Format(validationContext.Property.DisplayName);
        }
    }

Now apply it to the property (properties) that need it during your application model initialization phase.

	var detailType = manager.MetadataStore.GetEntityType(typeof(OrderDetail));
    var property = detailType.GetProperty("OrderID");
    property.Validators.Add(new NonZeroIdValidator()); 

Although a bit more involved than initializing an FK to null, there are advantages to this approach:

- no need for an initialization "trick"
- the `NonZeroIdValidator` states the issue clearly
- you can reuse the `NonZeroIdValidator` by applying it to every required integer FK (and PK) properties on every type in your model. 

>You might write a helper class that spiders through your metadata, adding this validator to non-nullable integer PK and FK properties. Be sure to share that with the community!

## Entity-level validator

Some business rules evaluate the entity as a whole. They might confirm that the values of several properties are collectively consistent or that a parent entity (e.g., ***Order***) has proper child entities (e.g., at least one ***OrderDetail***).

To illustrate, we'll add a rule to test if a customer postal code is a valid US zip code. We only want to perform that test if the customer is in the USA.

First, the validator:

    public class ZipCodeValidator : Validator
    {
        public ZipCodeValidator()
        {
            LocalizedMessage = new LocalizedMessage("{0} is not a valid US zip code");
        }

        protected override bool ValidateCore(ValidationContext context)
        {
            // This validator only validates US Zip Codes.
            var entity = context.Entity;
            if (entity.GetPropValue<string>("Country") == "USA")
            {
                var postalCode = entity.GetPropValue<string>("PostalCode");
                context.PropertyValue = postalCode;
                return IsValidZipCode(postalCode);
            }
            return true;
        }

        private static bool IsValidZipCode(string postalCode)
        {
            const string pattern = @"/^\d{5}([\-]\d{4})?$/";
            return Regex.IsMatch(postalCode, pattern);
        }

        public override string GetErrorMessage(ValidationContext validationContext)
        {
            return LocalizedMessage.Format(validationContext.PropertyValue);
        }
    }

Take note of this line:

	context.PropertyValue = postalCode;

We added the actual entity property value as the property value of the context. Breeze can pick up that value later and plug it into the error message token of the `LocalizedMessage` template.

Now add this validation rule to the model.

    // add US zip code validator to the entity (not to a property)
    customerType.Validators.Add(new ZipCodeValidator());


## Remove a validator from the EntityType

You can remove a rule from the model by removing the validator from its collection.

    var alwaysWrongValidator = new AlwaysWrongValidator();
    var validators = customerType.Validators;
    validators.Remove(alwaysWrongValidator);

## ValidationErrors

We removed the rule but not any `ValidationError`s that were already produced by that rule. Those you must remove manually from the affected entities.</p>

    // Clear out the "alwaysWrong" error
    // Must do manually because that rule is now gone
    // and, therefore, can't cleanup after itself
    customer.EntityAspect.ValidationErrors.RemoveKey(ValidationError.GetKey(alwaysWrongValidator));

And of course you can insert a `ValidationError` of your own - one that you made up yourself without the aid of a validator - by doing this:

    // create a fake error
    var fakeError = new ValidationError( 
        new AlwaysWrongValidator(),     // the marker validator
        new ValidationContext(customer),// validation context
        "You were wrong this time!"     // error message
    );

    // add the fake error
    customer.EntityAspect.ValidationErrors.Add(fakeError);

### EntityAspect.ValidationErrors

The ***EntityAspect.ValidationErrors*** property is automatically set and cleared as validation errors are added or removed.

### INotifyDataErrorInfo 

The ***BaseEntity*** and ***BaseComplexObject*** classes implement `INotifyDataErrorInfo` explicit interface ([Standard .NET Interface](http://msdn.microsoft.com/en-us/library/vstudio/system.componentmodel.inotifydataerrorinfo)) which has a `GetErrors` method and an `ErrorsChanged` event.

This ***GetErrors*** method (which is on the Entity)  delegates to the ***EntityAspect.GetValidationErrors*** method. 

This ***ErrorsChanged*** event (which is also on the Entity) is fired  whenever any entity within the EntityManager experiences any changes to its validation errors collection, available via the  ***EntityAspect.GetValidationErrors*** method. 

`INotifyDataErrorInfo`, which is used by all data binding code, can be obtained programmatically by casting an Entity to `INotifyDataErrorInfo`.

## Customize the message templates

Don't like the messages produced by the stock validators? Need to translate them to another language? No problem. The messages are based on templates that you can access and change. The [ValidatorExtensions](/doc-cs/api-docs/index.html) class contains `WithMessage` methods to create new messages based on existing validator messages. For example, we could make the `RequiredValidator` message a bit more emphatic:

    var vr = new RequiredValidator().WithMessage("Dude! The {0} is really required ... seriously ... as in mandatory");

## Probing for custom validators with Breeze

Typically, you define a custom validator, get the metadata from the server (implicitly or explicitly), and then add your custom validator to the validator collections of the appropriate entity types and properties as discussed above **That's usually all you have to do**.

But there is a special case. When you get your metadata from a local serialized source rather than the server, you must take one more step: you must register that validator with Breeze.

For example, suppose you designed your application to load entities from local storage when it starts. In the previous session you exported the entity cache and stowed the serialized cache data to browser local storage (see [Export/Import](/doc-csn/export-import)). Now when you start a new session, your app restores the cache and you pick up where you left off ... without having to hit the server. Pretty cool!

Unfortunately, the app throws an exception when it loads the locally stored data. The exception complains about an unknown, unregistered validation rule ... perhaps that custom ***ZipCodeValidator*** we just created. What happened?

When you exported the cache of entities, you also exported the metadata; they're part of the serialized cache. Inside that metadata is a reference to a validator named ***ZipCodeValidator*** along with its 'state'. The ***name*** of the validator is in the serialized metadata; the function ***definition*** is not. The metadata definition of the Customer includes the fact that a customer entity must be validated with something called "ZipCodeValidator". Unfortunately, Breeze doesn't know how to create a ZipCodeValidator unless it has already probed the assembly that contains the ZipCodeValidator class definition. This means that BEFORE you import any metadata that contains custom validators, you must first tell Breeze to probe the assemblies that contains your custom validators types.

    MetadataStore.Instance.ProbeAssembly(typeof(ZipCodeValidator).Assembly);

> Note that this is the same method that you call to probe for Entity and Complex type classes, so if you keep your Validators in the same assembly as your model classes, then you are already done.

> We think it's a good practice to always probe for your custom validators at the beginning of your application, although you don't have to unless you'll be getting metadata from a serialized source other than the server.  Play it safe; probe for them.

## Validator Interning

> This is really an implementation detail, but it IS interesting.

Because a standard Breeze application may use many validator instances many of which are exactly the same, Breeze attempts to reduce the memory footprint of all of these validators by keeping around only a single instance of each unique validator instance. i.e. if there are 25 references to a *MaxLengthValidator* with a MaxLength of 30 characters, Breeze will try to insure that it holds onto only a single reference within its metadata even though 25 instances were created.   

This means storing a ref to a specific instance of a validator ('interning' it) and then replacing any other instances that are 'structurally' the same as the 'interned' validator with the 'interned' instance.
 
This occurs whenever a validator is assigned to any of the Breeze validation collections. i.e. on an EntityType, a ComplexType, a DataProperty or a NavigationProperty.

You will not usually even realize that this is happening because the Validator class has overloaded *Equals* so that two structurally equal validators equal one another.
