---
layout: doc-breeze-labs
redirect_from: "/old/documentation/breezedirectivesfloat.html"
---
# Angular Float Directive

The `zFloat` directive tells Angular to display the view value rather than the floating point
model value when the view and model values are "equivalent".

# What's the problem

Without this directive, Angular data binding can erase the user's input as she
is typing, making it difficult for her to complete her intended data value.

The cause is Angular's eager data binding. 
Angular sends *each keystroke* through to the data bound model property.

That becomes a problem when Breeze parses data entry before
the user has finished typing. The user could be in the middle of data entry
when Breeze parsing does something to her intermediate value and
updates the property with something else *before she has a chance to 
complete her thought*.

This *something else* is (or should be) "equivalent" to the current value
displayed in the control. But it may not be identical, "letter-for-letter".

This is a problem for floating point properties (decimal, single, double, float).

For example, suppose the user tries to enter the decimal value, 250.05.

<p class="note">The following sample only works with modern browsers (IE10+, FF, Chrome).</p>
<p style="border: 1px solid lightblue; padding: 4px"><iframe allowfullscreen="allowfullscreen" frameborder="0" src="http://embed.plnkr.co/DTYukSS0kMYSrRz6STrj/preview" style="width: 100%; height: 560px"></iframe></p>

She types "2", "5", "0". So far so good. Inside the bound model property Breeze
parses these strings to the integers 2, 25, 250.

Then she enters the decimal point ('.'), intending to finish the amount with the $0.05 cents.

The "viewValue" is "250." (the string with the trailing decimal point).
Breeze parses it to its numerical equivalent, the integer 250. The parsed value
is the same as a moment ago so Breeze makes no change to the model property. 
But the viewValue ("250.") and the parsed value (250) are no longer identical.

Without "zFloat", the Angular digest cycle re-reads the model property, 
sees integer 250, and revises the input box viewValue dropping the decimal point. 
**The user never has a chance to enter the digits *after* the decimal point.**

>The same thing happens when the user enters '0's after the decimal.
The user wants to enter "250.05" but can't type the "zero" after the decimal
because Breeze keeps parsing the value to the integer 250 and Angular keeps
re-updating the input box, wiping out the user's last "zero" keystroke.

You can experience these unwanted behaviors in the "**Without zFloat**" textbox.

Now try the same thing in the "**With zFloat**" textbox. 
You can enter the full value, taking as long 
as you like to complete the floating point number. 

# How it works
The directive adds a  "floating point equivalence" $formatter to the ngModelController.
This formatter compares the "viewValue" and "modelValue" and returns 
the "viewValue" if that string representation is deemed "equivalent" 
to the numeric representation in the model.

Because "250." is equivalent to the parsed integer 250, Angular displays
the "250." viewValue ... and the user can continue typing "0", "5" yielding
the intended value of 250.05.

>This directive only applies numeric equivalence. 
A future more generic version could apply different equivalence functions 
based on the data bound property's data type and might be configurable 
with custom equivalence fns.
    
# Install

This directive is part of the Breeze Labs. Install in three steps:

1. [download](https://github.com/Breeze/breeze.js.labs/blob/master/breeze.directives.js "directives.float on github") the script file (or [install with NuGet](https://www.nuget.org/packages/Breeze.Angular.Directives/))

1. load the breeze.directives module script *after* angular itself.

1. add the 'breeze.directives' module to your app module's dependencies as seen in this example

        angular.module('app', ['breeze.directives']);

Now you're ready to apply the directive.

# Usage

Add the `zFloat` attribute directive to the input box HTML.

    <input data-ng-model="vm.person.balance" data-z-float>

# Thanks

The significance of the problem was first pointed out to me by
[@qorsmond in a StackOverflow question](http://stackoverflow.com/questions/21997537/breezejs-double-trouble-in-angularjs/22296446).

Thanks @qorsmond for your inspiration.