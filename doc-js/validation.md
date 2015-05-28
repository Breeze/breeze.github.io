---
layout: doc-js
redirect_from: "/old/documentation/validation.html"
---
<h1>Validation</h1>

<p class="note">Every code snippet on this page is in the <strong>validationTests</strong> module of <a href="/doc-samples/doccode">DocCode</a>. The tests are yours to explore and modify. Please send us your feedback and contributions.</p>

<p>A good application strives to ensure the integrity of data before saving them to permanent storage in part by screening new and changed with validation rules.</p>

<p>Validation in a web application must be performed on the server &hellip; always. Client-side validation is no substitute for server-side validation.</p>

<p>But client-side validation can be essential to the user experience. Users want to know immediately when input is bad. They despise filling in a long form only to have it rejected by the backend. We expect the app to catch bone head mistakes before we submit them. Tell us <em>now</em> that the date is required, the name is too long, daffodils don&rsquo;t come in black, and we can&rsquo;t receive a product until we&rsquo;ve ordered it.</p>

<p>Support for validation is built into Breeze entities and the Breeze processing pipelines. Breeze maintains lists of validation rules and applies them automatically at specific moments in the entity life-cycle. But you remain always in control. Breeze discovers some validation rules and infers others; but you can add your own rules and remove any rule that you don&rsquo;t like. You choose when Breeze validates. You can validate any set of entities or entity properties at any time. You decide what the error messages say and how they&rsquo;re presented.</p>

<p>This topic covers the most important aspects of the Breeze validation system.</p>

<h2>Validator: the Breeze validation rule</h2>

<p>Validation is a process of judging the current state of an entity with validation rules.&nbsp; Each rule assesses a fact about the validity of an entity or one of its properties. A rule judges but it does not change; the entity values are the same, before and after evaluation.</p>

<p>Concretely, a validation rule is an instance of the Breeze <a href="/doc-js/api-docs/classes/Validator.html" target="_blank"><span class="codeword">Validator</span> class</a>.</p>

<p class="note">Please read the Breeze API documentation for the <strong><a href="/doc-js/api-docs/classes/Validator.html" target="_blank"><span class="codeword">Validator</span> class</a></strong>. It has a lot of good information about how validations work and how to write them.</p>

<p>Most Breeze validators evaluate property data. A length validator can detect if the <em>CompanyName</em> is too long; a required validator determines that the <em>CompanyName</em> has a value; a string data type validator ensures that the <em>CompanyName</em> is a string, not a number or a date.&nbsp; These rules combine to determine the overall validity of the <em>CompanyName</em> property.&nbsp;</p>

<p>During validation, Breeze calls each validator&rsquo;s <span class="codeword">validate</span> method, passing in the value to evaluate and such context as the rule requires. If the value passes validation, the validate method returns null; if the value fails validation, the method returns a <span class="codeword">ValidationError</span>.</p>

<p>Breeze accumulates <span class="codeword">ValidationErrors</span> in the entity&rsquo;s validation errors collection which you can access by calling <span class="codeword">entity.entityAspect.getValidationErrors()</span>. When a rule fails, Breeze adds the rules <span class="codeword">ValidationError</span> to the collection. When a rule passes, Breeze removes the previous <span class="codeword">ValidationError</span> associated with that rule.</p>

<p>After a full entity validation, a &ldquo;clean&rdquo; entity will have an empty validation errors collection. The entity is invalid if there are any errors left in the collection.</p>

<p>Breeze does not object to entities having errors. It&rsquo;s the developer who decides what to do about invalid entities. Breeze won&rsquo;t interfere except on one occasion: Breeze won&rsquo;t save an entity with validation errors. In fact, it won&rsquo;t save any entities in a change-set if even one of them has errors.</p>

<p>An application typically tells the user when an entity has errors and tries to guide the user toward correcting them. Breeze has no prescription for doing this; it&rsquo;s the developer&rsquo;s job to present errors. Breeze does raise an event when errors are added and removed from the error collection; the developer can listen by subscribing to an entity&rsquo;s <span class="codeword">entityAspect.validationErrorsChanged</span> event and adjust application behavior accordingly.</p>

<h2>Automatic validation</h2>

<p>The Breeze <span class="codeword">EntityManager</span> can validate an entity in cache at four predetermined times:</p>

<ol>
	<li>the entity enters cache as a result of a query</li>
	<li>an entity is added or attached to the EntityManager</li>
	<li>an entity property value is changed</li>
	<li>an entity is about to be saved</li>
</ol>

<p>The manager&rsquo;s <span class="codeword">ValidationOptions</span> determines whether the manager will or will not validate at those times. The default options are:</p>

<table border="0" cellpadding="0" cellspacing="0">
	<tbody>
		<tr>
			<td style="width:217px;">
			<p><strong>Option</strong></p>
			</td>
			<td style="width:421px;">
			<p><strong>Default</strong></p>
			</td>
		</tr>
		<tr>
			<td style="width:217px;">
			<p>validateOnQuery</p>
			</td>
			<td style="width:421px;">
			<p>false</p>
			</td>
		</tr>
		<tr>
			<td style="width:217px;">
			<p>validateOnAttach</p>
			</td>
			<td style="width:421px;">
			<p>true</p>
			</td>
		</tr>
		<tr>
			<td style="width:217px;">
			<p>validateOnPropertyChange</p>
			</td>
			<td style="width:421px;">
			<p>true</p>
			</td>
		</tr>
		<tr>
			<td style="width:217px;">
			<p>validateOnSave</p>
			</td>
			<td style="width:421px;">
			<p>true</p>
			</td>
		</tr>
	</tbody>
</table>

<p>You can change those settings by updating the manager&rsquo;s options. For example, let&#39;s stop validating when we attach an entity to a manager:</p>

<pre class="brush:jscript;">
// copy options, changing only &quot;validateOnAttach&quot;
var valOpts = em.validationOptions.using({ validateOnAttach: false });

// reset manager&#39;s options
manager.setProperties({ validationOptions: valOpts });</pre>

<p>We can make this the default for all future managers:</p>

<pre class="brush:jscript;">
valOpts.setAsDefault();</pre>

<p class="note">Breeze automatically validates entities in cache. It won&rsquo;t do so for detached entities. For example, a newly created <em>Customer</em> is technically invalid because its <span class="codeword">CompanyName</span> is null and that property is required. Breeze does not validate the customer until you add it to the cache. This gives you time to set the values of a new entity before it enters the cache and triggers validation.</p>

<h2>Manual validation</h2>

<p>You can validate an individual entity at any time, whether it is attached or not:</p>

<pre class="brush:jscript;">
if (!newCustomer.entityAspect.validateEntity()) {/* do something about errors */}</pre>

<p>You can also validate a specific property:</p>

<pre class="brush:jscript;">
if (!newCustomer.entityAspect.validateProperty(&quot;CompanyName&quot;)) {
       /* do something about errors */}</pre>

<h2>Server-side validation</h2>
Validation on the client improves the user experience; some say that makes it optional. Validation on the server protects the permanent data; everyone agrees that is mandatory.

There are many ways to validate data on the server. Much depends on the technologies and practices that you are using.

No matter what you do, you'll probably want to surface the validation errors on the client. The topic ["Server-side validation"](/doc-net/ef-serverside-validation) covers how to prepare errors and transmit them in JSON so that the Breeze client can include them in the entity's validation errors collection. 

>That topic also explains how validation errors detected by Entity Framework are automatically communicated to the client.

Client- and server-generated validation errors share the same entity errors collection. You can distinguish between these two kinds of error by the `isServerError` property.

### Clearing server validation errors ###

Breeze automatically removes *client* validation errors when the user cures the problem. It can't do that for *server* validation errors. 

Breeze can't because it doesn't know about server validation logic, only client validation logic. Therefore, server validation errors stay in the entity's validation errors collection until (a) you try to save the entity or (b) you clear them manually.

>Breeze automatically clears server-generated errors before evaluating an entity for save.

You can remove all current errors from the collection by calling `entityAspect.clearValidationErrors`. You can remove a specific error, client- or server-generated, by calling `entityAspect.removeValidationError`. A simple loop can remove the server-generated errors:

	entity.entityAspect.getValidationErrors().forEach(function(err) {
		if (err.isServerError) {  aspect.removeValidationError(err);	}
	});

It's up to you to pick the appropriate time to clear those server errors.

<h2>Add a Breeze validator</h2>

Of course validation works only because there are validation rules (AKA, &quot;validators&quot;) associated with the property definitions in the metadata. It&#39;s up to you to ensure that you put the right validators in place.

If your metadata was generated by an `EFContextProvider`, many of the properties will have validators already. The `EFContextProvider` interprets the server-side type information and adds required and data type validations to the metadata. it also recognizes the length <a href="http://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations.aspx" target="_blank">.NET data annotations</a> and adds validators for them.

You can add validations to metadata with client code. You'll probably want to do that if you are not generating metadata from an `EFContextProvider` or you want additional validations.

<p>The Breeze <span class="codeword">Validator</span> class offers some stock property validators, all available as static methods.</p>

- *integer*, *date*, *string* and many more &quot;dataType&quot; validators that ensure new values conform to the target data type
- *creditCard*
- *emailAddress*
- *maxLength*
- *phone*  (BETA)
- *regularExpression*
- *required*
- *url*

>Many of these validators correlate to <a href="http://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations.aspx" target="_blank">.NET data annotations</a> . In a future release, the Breeze.NET `EFContextProvider`will be able to include these validations in the metadata automatically for you. For now, you'll have to add them to the properties on the client side as we show next.

Here's how you might add the "url" and "required" validators to a `Person` property :

    // Add Url validator to the blog property of a Person entity
    // Assume em is a preexisting EntityManager.
    var personType = em.metadataStore.getEntityType("Person"); //get the Person type
    var websiteProperty = personType.getProperty("website"); //get the property definition to validate

    var validators = websiteProperty.validators; // get the property's validator collection
    validators.push(Validator.required()); // add a new required validator instance 
    validators.push(Validator.url()); // add a new url validator instance 

### Regular Expression validators ###

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

<h2>Write a custom validator</h2>

<p>You can write your own validators too. A validator is defined and applied in the same way whether stock or custom.</p>

<p>You create a custom validator by calling the <span class="codeword">Validator</span>&rsquo;s constructor with three parameters:</p>

<ol>
	<li>The name of your validator</li>
	<li>The validation function that actually performs the assessment; <span class="codeword">Validator.validate</span> delegates to this function.</li>
	<li>An optional, arbitrary context object which is your chance to supply the function with any external information it needs.</li>
</ol>

<p>To illustrate, we&rsquo;ll add a jingoistic validator to our application that only approves of the United States. We start with the validation function for that rule:</p>

<pre class="brush:jscript;">
function countryIsUSValidationFn(value, context) {
    if (value == null) return true; // &#39;== null&#39; matches null and empty string
    return value.toUpperCase().startsWith(&quot;US&quot;);
};</pre>

<p>Next we construct a new validator to apply this function:</p>

<pre class="brush:jscript;">
var countryIsUSValidator = new breeze.Validator(
     &quot;countryIsUS&quot;,              // validator name
     countryIsUSValidationFn,    // validation function
     {                           // validator context
         messageTemplate: &quot;&#39;%displayName%&#39; must start with &#39;US&#39;&quot;
     });</pre>

<p>The validator context object defines a <span class="codeword">messageTemplate</span> that Breeze will recognize and use to construct an error message, substituting the property name for &ldquo;%displayName%&rdquo;.</p>

<p>We might write some unit tests that call <span class="codeword">validate</span> with a variety of values, something you can do to stock validators as well.</p>

<h2>Apply the validator</h2>

<p>Now that we&#39;ve crafted a new validator, it&#39;s time to put it to work. Let&#39;s add this validator to the property of an Employe. We get the <span class="codeword">EntityType</span> for the Employee from a <em>MetadataStore </em>and add the rule to the validators for the Employee type&rsquo;s &ldquo;<em>Country</em>&rdquo; <span class="codeword">DataProperty</span>:</p>

<pre class="brush:jscript;">
var employeeType = manager.metadataStore.getEntityType(&quot;Employee&quot;);
employeeType
    .getProperty(&quot;Country&quot;)
    .validators.push(countryIsUSValidator);</pre>

<p>The &ldquo;countryIsUS&rdquo; rule is now active for the <span class="codeword">Employee.Country</span> property.</p>

<p>It&rsquo;s a general purpose rule that we could apply to any other string property. For example, we might only do business with US companies:</p>

<pre class="brush:jscript;">
var customerType = manager.metadataStore.getEntityType(&quot;Customer&quot;);
customerType
    .getProperty(&quot;Country&quot;) // Customer has &quot;Country&quot; property too
    .validators.push(countryIsUSValidator);</pre>

<p class="note">The <code>EntityType</code> must be present in metadata before you can apply the rule. You can <em>define </em>the rule <em>before </em>getting the metadata, perhaps immediately after launching the application. But you can&#39;t add the validator to the type or any of its properties until the type is defined. For most applications,<strong> you must wait</strong> untl the client has retrieved metadata from the server. You can fetch that metadata explicitly or wait until Breeze gets it implicitly during the first query.</p>

<h2>Parameterized validator</h2>

<p>The &ldquo;countryIsUS&rdquo; property now excludes non-US customers. What if a Canadian company wants to use this validator and wants only Canadian customers?</p>

<p>Rather than mint a completely new rule, we can generalize the one we have:</p>

<pre class="brush:jscript;">
function countryValidationFn(value, context) {
    if (value == null) return true; // &#39;== null&#39; matches null and empty string
    return value.toUpperCase().startsWith(context.country.toUpperCase());
};</pre>

<p>Notice that we&rsquo;re actually using the context object this time. It holds the value (the country name) to compare with user input.</p>

<p><a name="ValidatorFactory"></a>Then we create a validator <em>factory</em> (a function returning a validator) instead of a fixed validator object:</p>

<pre class="brush:jscript;">
// returns a countryValidator with its parameters filled
function countryValidatorFactory(context) {

    return new breeze.Validator(
        &quot;countryValidator&quot;,  // validator name
        countryValidationFn, // validation function
        {                    // validator context
            messageTemplate: &quot;&#39;%displayName%&#39; must start with &#39;%country%&#39;&quot;,
            country: context.country
        });
}</pre>

<p>Notice that the message template incorporates the parameter.</p>

<p>Finally, our Canadian friends use the factory to add their version of the rule to the model:</p>

<pre class="brush:jscript;">
// create a Canada-only validator
var canadaOnly = countryValidatorFactory({ country: &quot;Canada&quot; });

// add the Canada-only validator
customerType
    .getProperty(&quot;Country&quot;)
    .validators.push(canadaOnly);</pre>

<a name="refNav"></a>
##Reference navigation validation

What if a reference navigation is required? How do you validate that?

A reference navigation property returns a single related "parent" ("Principal") entity. For example, an instance of the `OrderDetail` type has a parent `Order` which you access via the `OrderDetail.Order` property. The parent must exist. 

The Breeze client metadata will require `OrderDetail.Order` automatically if (a) you rely on EntityFramework to generate metadata and (b) you marked the C# `OrderDetail.Order` navigation property with the `[Required]` attribute. However, many folks either don't or don't want to require the navigation property on the server. But they do want to require it on the client.

Cover this case by adding the required validation to the client-side metadata yourself:

	var detailType = metadataStore.getEntityType('OrderDetail');
    var property = detailType.getProperty('Order');
    property.validators.add(breeze.Validator.required());  

####Foreign Key validation

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

>You might write a helper class that spiders through your metadata, adding this validator to non-nullable integer PK and FK properties. Be sure to share that with the community!

<h2>Entity-level validator</h2>

<p>Some business rules evaluate the entity as a whole. They might confirm that the values of several properties are collectively consistent or that a parent entity (e.g., <em>Order</em>) has proper child entities (e.g., at least one <em>OrderDetail</em>).</p>

<p>To illustrate, we&rsquo;ll add a rule to test if a customer postal code is a valid US zip code. We only want to perform that test if the customer is in the USA.</p>

<p>First, the validation function:</p>

<pre class="brush:jscript;">
// The value to assess will be an entity
// with Country and PostalCode properties
function zipCodeValidationFn(entity, context) {
    // This validator only validates US Zip Codes.
    if (entity.getProperty(&quot;Country&quot;) === &quot;USA&quot;) {
        var postalCode = entity.getProperty(&quot;PostalCode&quot;);
        context.postalCode = postalCode;
        return isValidZipCode(postalCode);
    }
    return true;
};

function isValidZipCode(value) {
    var re = /^\d{5}([\-]\d{4})?$/;
    return (re.test(value));
}</pre>

<p>Take note of this line:</p>

<pre class="brush:jscript;">
 context.postalCode = postalCode;</pre>

<p>We added the actual entity property value as a new property of the context. Breeze can pick up that value later and plug it into the error message if the template has a &ldquo;%postalCode% token.</p>

<p>Now the validator:</p>

<pre class="brush:jscript;">
var zipCodeValidator = new breeze.Validator(
    &quot;zipCodeValidator&quot;,
     zipCodeValidationFn,
    { messageTemplate: &quot;&#39;%postalCode%&#39; is not a valid US zip code&quot; });</pre>

<p>Finally, add this validation rule to the model.</p>

<pre class="brush:jscript;">
// add US zip code validator to the entity (not to a property)
customerType
    .validators.push(zipCodeValidator);</pre>

<h2>Register custom validators with Breeze</h2>

<p>Typically, you define a custom validator, get the metadata from the server (implicitly or explictily), and then add your custom validator to the validator collections of the appropriate entity types and properties as discussed above <strong>That&#39;s usually all you have to do</strong>.</p>

<p>But there is a special case. When you get your metadata from a local serialized source rather than the server, you must take one more step: you must register that validator with Breeze.</p>

<p>For example, suppose you designed your application to load entities from local storage when it starts. In the previous session you exported the entity cache and stowed the serialized cache data to browser local storage (see &quot;<a href="/doc-js/export-import" target="_blank">Export/Import</a>&quot;). Now when you start a new session, your app restores the cache and you pick up where you left off ... without having to hit the server. Pretty cool!</p>

<p>Unfortunately, the app throws an exception when it loads the locally stored data. The exception complains about an unknown, unregistered validation rule ... perhaps that custom <em>zipCodeValidator </em>we just created. What happened?</p>

<p>When you exported the cache of entities, you also exported the metadata; they&#39;re part of the serialized cache. Inside that metadata is a reference to a validator named <em>zipCodeValidator</em>. The <em><strong>name </strong></em>of the function is in the serialized metadata; the function <em><strong>definition </strong></em>is not. The metadata definition of the Customer includes the fact that a customer entity must be validated with something called &quot;zipCodeValidator&quot;. Unfortunately, Breeze doesn&#39;t know what a &quot;zipCodeValidator&quot; is. When Breeze restores the metadata (and the entities) it needs your help in connecting the name of the validator to the validator function itself. You provide that help by registering your custom validator with the Breeze Validator class:</p>

<pre class="brush:jscript;">
Validator.register(zipCodeValidator);</pre>

<p>If you created a <a href="#ValidatorFactory">validator factory</a>, you register that with a related method:</p>

<pre class="brush:jscript;">
Validator.registerFactory(countryValidatorFactory, &quot;countryValidator&quot;);</pre>

<p>Notice the second parameter. That&#39;s the registration name and it must be the name of the validator that your factory creates; <a href="#ValidatorFactory">scroll up</a> and you&#39;ll find that we named it &quot;countryValidator&quot;. No, Breeze won&#39;t figure that out for you; it would have to execute your factory with a context object to produce a validator with the right name ... but has no way to create a valid context object</p>

<p>Make sure you register your custom validators and validator factories <em>before </em>retrieving metadata from local storage.</p>

<p class="note">We think it's a good practice to register your custom validators although you don't have to unless you&#39;ll be getting metadata from a serialized source other than the server.  Play it safe; register them.</p>

Breeze keeps all validators in a central registry. You can retrieve any validator by name as follows:

    var myValidator= breeze.config.functionRegistry['Validator.myValidator'](); 

<h2>Remove a validator from the EntityType</h2>

<p>You can remove a rule from the model by removing the validator from its collection.</p>

<pre class="brush:jscript;">
var custValidators = customerType.validators;
custValidators.splice(custValidators.indexOf(unwantedRule), 1);</pre>

<div>
<h2>ValidationErrors</h2><a name="ValidationErrors"></a>

<p>We removed the rule but not any <span class="codeword">ValidationError</span>s that were already produced by that rule. Those you must remove manually from the affected entities.</p>

<pre class="brush:javascript;">
// Clear out any &quot;unwantedRule&quot; errors
// Must do manually because that rule is now gone
// and, therefore, can&#39;t cleanup after itself
cust.entityAspect.removeValidationError(unwantedRule);</pre>
</div>

<p>And of course you can insert a <span class="codeword">ValidationError</span> of your own - one that you made up yourself without the aid of a validator - by doing this:</p>

<pre class="brush:jscript;">
// create a fake ValidationError for a someValidator
var fakeError = new breeze.ValidationError(
    someValidator,                // a marker validator, perhaps faked
    {},                           // validation context
    &quot;You were wrong this time!&quot;   // error message
);

// add the fake error
cust.entityAspect.addValidationError(fakeError);</pre>

### EntityAspect.hasValidationErrors<a name="hasValidationErrors"></a>

The *EntityAspect.hasValidationErrors* property is automatically set and cleared as validation errors are added or removed.

### EntityManager.validationErrorsChanged<a name="validationErrorsChanged"></a>

This event is fired whenever any entity within the EntityManager experiences any changes to its validation errors collection, available via the *EntityAspect.getValidationErrors* method. Event suppression (enabling/disabling) is fully supported at both the EntityManager and the EntityAspect level for this event. This means:
	
	            Event.enable("validationErrorsChanged, myEntityManager, false); // will suppress both entityManager and entityAspect level validationErrorsChanged events for ‘myEntityManager’
	                   // Whereas 
	            Event.enable("validationErrorsChanged, myEntity.entityAspect, false); // will only suppress the entityAspect level validationErrorsChanged event for this entity.

<h2><a name="message-templates"></a>Customize the message templates</h2>

<p>Don&#39;t like the messages produced by the stock validators? Need to translate them to another language? No problem. The messages are based on templates that you can access and change. The <a href="/doc-js/api-docs/classes/Validator.html#property_messageTemplates" target="_blank">Validator.messageTemplates</a> class property returns the template collection, keyed by the validator name. Configure it to suit your needs. For example, we could make the <span class="codeword">Validator.required</span> message a bit more emphatic:</p>

<pre class="brush:jscript;">
Validator.messageTemplates[&quot;required&quot;,
  &quot;Dude! The &#39;%displayName%&#39; is really required ... seriously ... as in mandatory&quot;);
</pre>

<p>Your custom validators can keep their templates in this collection too.</p>