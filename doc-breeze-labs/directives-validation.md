---
layout: doc-breeze-labs
redirect_from: "/old/documentation/directivesvalidation.html"
---
#Breeze Labs: AngularJS Validation and Required Indicator Directive

The **`zValidate`** Breeze/AngularJS validation directive displays and entity property's validation errors on screen. It can also visually identifies a required property with an asterisk.

<p class="note">You can <a href="http://www.nuget.org/packages/Breeze.Angular.Directives" title="Breeze Angular Directives on NuGet" target="_blank">use NuGet to install</a> the JavaScript and CSS files in your .NET web application project. Or you can download the <a href="https://github.com/breeze/breeze.js.labs/blob/master/breeze.directives.js" title="breeze.directives.js" target="_blank">JavaScript</a> and <a href="https://github.com/breeze/breeze.js.labs/blob/master/breeze.directives.css" title="breeze.directives.css" target="_blank">CSS</a> files manually from GitHub.</p>

To use this directive in your app, all you do is:

1. include the Breeze validation directive JavaScript and CSS files,
2. add `z-validate` to your HTML control as you would any Angular directive.

<pre class="brush:jscript;">
&lt;input data-ng-model="vm.person.firstName" data-z-validate >
</pre>

And if there is an error, it displays like this:

<img alt="zValidate error message" src="/images/samples/z-validate-firstNameRequiredError.png" style="width: 100%; max-width: 726px;" />

##Breeze validation

Breeze entities have built-in model-level validation driven by metadata that describe client-side validation rules for properties and entities. Breeze invokes these rules automatically during four phases of the entity life-cycle (attached, queried, property changed, saved).  You also can invoke these rules programmatically at any time. 

You can read about these features [in the user guide](/doc-js/validation) and in the [Validator API documentation](/doc-js/api-docs/classes/Validator.html). 

Those sources describe how to define validation rules and how to invoke them. They tell you that each entity carries a collection of zero-or-more validation errors that you can access by calling its `entityAspect.getValidationErrors()`

**They don't explain how to display validation errors** on screen so that users can see them. How you present errors and tell the user what to do about them is an application user experience question that you'll have to decide for yourself.

But we can show you *one way* to present errors that you may use for inspiration or "as is". That's the purpose of this Breeze Lab.

##Display errors with the zValidate directive

The `zValidate` directive is a way to display property validation errors as error messages adjacent to the errant data value.

A <a href="http://docs.angularjs.org/guide/directive" target="_blank"><em>directive</em></a> is the AngularJS mechanism for manipulating the browser DOM programmatically as part of the Angular binding process. 

Angular ships with a core set of directives that cover many scenarios. But they can't cover everything and you are encouraged to extend the Angular binding system with your own directives as we are doing in this lab project.

##Sample

Perhaps the best way to understand this directive is to see it in a live example of a "Person Edit" screen.

<p class="note">The following sample only works with modern browsers (IE10+, FF, Chrome).</p>
<p style="border: 1px solid lightblue; padding: 4px"><iframe allowfullscreen="allowfullscreen" frameborder="0" src="http://embed.plnkr.co/lxPAbIJmRaLmyagXQAFC/preview" style="width: 100%; height: 450px"></iframe></p>

>If you have trouble viewing the plunker sample in your browser, <a href="http://plnkr.co/edit/lxPAbIJmRaLmyagXQAFC?p=preview" target="_blank">try this link</a>.

The first and last names are required (hence the red asterisks). Try deleting their values. Try entering extraordinarily long names (they have max length validations too). Play with the other properties too.

The "refresh" button restores the original entity. The "new" button creates a new person entity which is immediately in an invalid state.

While this sample demonstrates the `zValidate` directive, it coincidentally demonstrates a few other Breeze coding techniques such as:

- Authoring client-side metadata
- Faking entity data during development
- Reverting pending changes (undo)
- Creating a custom twitter validator

Let's tour the sample code.

###Load the directive files

Pick "index.html" from the "Source Code" drop down (you can get back to the displayed result by clicking the "forward" triangle button in the upper right).  Scroll to the scripts near the bottom.

The `zValidate` directive is defined in <a href="https://github.com/Breeze/breeze.js.labs/blob/master/breeze.directives.js" target="_blank">breeze.directives.js</a>. Notice that we load this script ***after*** loading the angular and breeze JavaScript files and ***before*** loading any application JavaScript files.

The directive paints error error messages and the required indicator with default templates that depend upon CSS classes defined in <a href="https://github.com/Breeze/breeze.js.labs/blob/master/breeze.directives.css" target="_blank">breeze.directives.css</a>. Scroll to the top where we loaded that CSS file among the other CSS files. Alternatively, we could have incorporated its contents within the application "style.css".

###Apply the directive
The application is ready to display property validation errors. 

You decide which data bound HTML controls should have this behavior by applying the `zValidate` directive as an attribute of that control. In this sample, we apply it to every textbox. Here is the markup for the "First Name" textbox:

<pre class="brush:jscript;">
&lt;input data-ng-model="vm.person.firstName" data-z-validate placeholder="First name" autofocus>
</pre>

The `zValidate` directive depends upon the `ngModel` binding expression which it examines to determine the entity and property that might have a validation error.

> We use the "data-" HTML 5 prefix for our Angular attribute directives.

The `ngModel` binding specifies a property path starting from a variable named "vm".

We're using the "*Controller as*" technique for binding a view to a ViewModel. Scroll up a bit to see that we told Angular to treat the "*personEditController*" as a ViewModel named "vm":

<pre class="brush:jscript;">
&lt;body data-ng-app="app" 
      data-ng-controller="personEditController as vm">
</pre>

>"*Controller as*" is directly supported as of Angular release v1.2 although you could always use a similar style with earlier releases. We like this approach for our applications but not everyone does. Adapt this example to suit your preference.

Returning to the binding expression, we see that ViewModel (`vm`) exposes a `person` property which is the Person entity to edit and this textbox is bound to the `firstName` property.

The directive drew a red asterisk next to the textbox to indicate that the first name is required. We'll see how it knew to do that in a little bit.

###Validators
You can create and remove validation errors by playing with the textbox values. Breeze monitors your changes and updates the validation error(s) for each property accordingly. Angular updates the property with every keystroke so you get an immediate visual response.

Where are the validators defined? Open the "model.js" via the "Source code" combobox. Look at the `configureMetadataStore` method.

>The `configureMetadataStore` method is called by the `datacontext` (see the *datacontext.js* file). The `datacontext` is a service that encapsulates the mundane details of data access. It also encapsulates many of the application's interactions with Breeze.

>A typical `datacontext` (AKA "dataservice") would query and save data to a remote service at the request of an Angular controller. This sample doesn't have a service. So this `datacontext` returns fake Person data.


The `configureMetadataStore` method has three steps.
 
1. Create a new validator called "twitter"
2. Add the `Person` entity type to the metadata
3. Discover and register all properties with a "required" validation.

###Create a custom validator

Most of the Person properties are validated with stock validators, shipped with Breeze. A "twitter" validator is not one of them so we had to write one. Check it out; notice that it's built with the Breeze RegularExpression validator factory method.

###Client-side metadata
This sample doesn't get data from a server. We're either editing a faked `Person` or a newly created `Person` entity that we won't save. There is no server. There is no server-supplied metadata.

A Breeze client needs metadata. Fortunately, we can define that metadata in JavaScript on the client ... which we do in the `addPersonType` method.

Scroll to that method and look at the definition of the `firstName` data property:

<pre class="brush:jscript;">
firstName:  { dataType: DT.String, 
              validators: [
                  Validator.required(), 
                  Validator.maxLength({maxLength: 20})] }
</pre>

The `firstName` definition includes two stock validators: `required` and `maxLength`. The stock validators are produced by generator functions that are static members of the Breeze `Validator` class. We trust you can follow the pattern for the remaining properties.

###Required property indicator

The directive can paint a ***required property indicator*** next to the input control or combobox bound to a required property.

Breeze itself has no native notion of a "required" property. You can't ask the metadata for the required properties. This directive infers that a property is required and should display the required indicator by inspecting each property's validators. It treats a property as required if one of its validators is either named "required" or its context object has an`.isRequired` property that is `true`.

If you add custom validators that should be treated as required, add `.isRequired = true;` to the validator's context object as seen in this example from the "model.validation.js" in John Papa's PluralSight course, "[Building Apps with Angular and Breeze](http://pluralsight.com/training/Courses/TableOfContents/build-apps-angular-breeze "Building Apps with Angular and Breeze").

        function createRequireReferenceValidator() {
            var name = 'requireReferenceEntity';
            // isRequired = true so zValidate directive displays required indicator
            var ctx = { messageTemplate: 'Missing %displayName%', isRequired: true };
            var val = new Validator(name, valFunction, ctx);
            return val;

            // passes if reference has a value and is not the nullo (whose id===0)
            function valFunction(value) {
                return value ? value.id !== 0 : false;
            }
        }

###Reconfiguring the error and required templates

The `zValidate` directive has a default template for displaying errors and another template for displaying the required indicator. 

You can replaces these templates with your own templates via the `zDirectivesConfig` service (included in *breeze.directives.js*). It's best to reset the templates when your application starts-up as this sample does.

Open the *app.js* file. 

<pre class="brush:jscript;">
  angular.module('app', ['breeze.directives'])
    .config(['zDirectivesConfigProvider', configDirective]);
</pre>

The app is resetting the templates (see the`configDirective` method)  during the application module's "config" phase. Because this is the "config" phase, we inject the `zDirectivesConfigProvider` into the `configDirective` method rather than the `zDirectivesConfig` service. 

>See the Angular <a href="http://docs.angularjs.org/guide/module" target="_blank">documentation for modules</a> to learn about the life-cycle of an Angular module and "configuration blocks" in particular.

##zValidate in a repeater 
This sample shows how you can display validation messages while editing a single `Person` entity. What if the screen presented many `Person` entities and you wanted to see all of their property validation error messages?

You can do that in the manner you'd expect.

<pre class="brush:jscript;">
&lt;li data-ng-repeat="person in vm.persons">
    &lt;div>&lt;input data-ng-model="firstName" data-z-validate placeholder="First name">&lt;/div>
    ...
&lt;/li>
</pre> 

##Why not use HTML5 or Angular validation

HTML 5 defines a collection of <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Data_form_validation" target="_blank">form validation attributes</a>. Angular forms and controls have <a href="http://docs.angularjs.org/guide/forms" target="_blank">built-in validation services</a>. Why not use either of these facilities instead of Breeze validation?

The answer boils down to a fundamental **difference between "Markup validation" and "Model validation"**.

We could argue from principle. Validations are business rules. Business rules belong in the model, not in the markup. The model is the single source of truth on the client; the UI is merely an expression of the state of the model.

While all true, most of us are unmoved by this kind of philosophical reasoning. We are practical people, trying to get the job done efficiently.

Fortunately, there is a practical argument to bolster the philosophical: **the `zValidate` directive is easier to write and maintain** than either HTML or Angular markup.

* The person who writes the markup doesn't have to know the validation rules for each field; she just writes `z-validate`. 

* A single directive is sufficient whether the property has one validation rule or five validation rules.

* No one must update the HTML when validation rules come (and go and change). 

* If we have more than one view of `Person`, we don't have to worry whether the same validation rules are coded on both views.

* "Markup validation" systems only reveal errors when the user enters a value. Sometimes the data are invalid on arrival. The user won't know that a property is invalid until ... and unless ... she modifies the value. That's a sub par user experience.

Markup validation makes sense when you are binding to a simple object that doesn't have its own business rules. It is a convenient declarative alternative to writing a lot of validation JavaScript in the ViewModel. But Breeze entities come equipped, out-of-the-box with a metadata-driven, extensible, model validation mechanism which is both more powerful and easier to use. Skip the markup validation and go straight to the source ... with `zValidate`.

##Limitations
The approach described and implemented in this directive doesn't cover every scenario.

###Property errors only

This directive displays property validation errors only. The entity may have errors that are not specific to a particular entity. You'll need to find another way to display them.

###Message location and format
You can configure the "required" and "error" templates but the directive is written to display those templates in a particular location relative to the data bound HTML control. You'll have to revise the directive if that doesn't suit your needs.

###Only input controls
The directive only works for HTML controls with the `ngModel` directive which is to say, with controls that accept user input. If you wanted to display error messages next to a read-only display of person properties, you would probably revise the directive to get the property info from `ngBind` and devise another way to present the error message. 

###Multiple errors
A property can have multiple validation errors. This directive concatenates their error messages, separated by semi-colons (;). You'll have to revise the directive if you want different behavior.

##What about Knockout?
This directive is an Angular solution.

We love Knockout too. We expect to write a <a href="http://knockoutjs.com/documentation/custom-bindings.html" target="_blank">Knockout Custom Binding</a> that implements the same behavior with the same simplicity of application.

Feel free to beat us to it. We'd love to hear about it and perhaps publish it in Breeze Labs.
