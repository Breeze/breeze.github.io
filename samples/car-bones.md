---
layout: samples
redirect_from: "/old/samples/car-bones.html"
---
<h1>Car Bones: a Backbone Sample</h1>

<p>Breeze entities can be adapted to suit your preferred modeling framework. The <strong>Car Bones </strong>sample illustrates Breeze entities adapted for <a href="http://backbonejs.org/" target="_blank">Backbone</a>, one of the more popular JavaScript Model-View-Controller (MVC) frameworks. You&#39;ll find the code for Car Bones among the samples in the <a href="/documentation/download" target="_blank">full download</a>.</p>

<h2>What it shows</h2>

<p>The <strong>Car Bones </strong>app presents cars and their options on a single screen. You can edit a <em>Car </em>entity, retrieve its <em>Options</em>, and edit the <em>Options </em>individually and you can save your changes.</p>

<p>The key technical points:</p>

<ul>
	<li>Configuring a Breeze client to use backbone for entity models</li>
	<li>Binding backboned entities to HTML controls using the &quot;Stickit&quot; backbone plugin</li>
</ul>

<p>The sample illustrates other Breeze features of a simple application</p>

<ul>
	<li>Query a Web API backend</li>
	<li>Save changes to multiple objects in a single transaction</li>
	<li>Traversing an object graph (<em>Car </em>to <em>Options</em>)</li>
	<li>Loading <em>Car</em>-related <em>Option </em>entities on-demand.</li>
</ul>

<h2>Try it</h2>

<p>Launch the solution and press <strong>Ctrl-F5</strong> to build and run it without the debugger. A browser opens and after a brief delay to build and initialize the database, the browser displays this screen:</p>

<p><img alt="" src="/images/samples/CarBonesRunning01.png" style="max-width: 499px; width: 100%;" /></p>

<p>Enter changes in the <em>Car </em>textboxes; note that as you type your keystrokes are propagated to the italicized texts to right of the textboxes. Clicking the &quot;<em>Options</em>&quot; link fetches a <em>Car</em>&#39;s related options from the server; clicking a second time hides the <em>Options</em>; click again to reveal them. The application only loads the <em>Options </em>the first time; all subsequent displays are showing cached data.</p>

<p>Save changes by clicking the upward pointing arrow icon at the top of the screen.</p>

<p>Every server operation is logged to the screen in the message area at the bottom.</p>

<p>Adding, deleting, and querying (other than the first query) are out-of-scope. Look to one of the other samples such as &quot;Todo&quot; to learn about those techniques. This sample concentrates on enabling a Breeze Backbone client.</p>

<h2>Inside the app</h2>

<p><strong>Car Bones </strong>began as an empty MVC4 project. With NuGet, we added the usual <strong>jQuery</strong>, <strong>Modernizr</strong>, <strong>EntityFramework SQL Server CE</strong>, and the base Breeze package, &quot;<strong>Breeze.MVC4WebApi</strong>&quot;. Then we added the <strong>backbone.js</strong> the NuGet package which adds the dependent <a href="http://documentcloud.github.com/underscore/" target="_blank"><strong>underscore.js</strong></a> package. Then we dragged in a copy of the <a href="https://github.com/NYTimes/backbone.stickit" target="_blank">backbone.stickit.js</a>, a model-view binding plugin for backbone. We&#39;ll <a href="#DataBindingWithStickit">explain stickit below</a>.</p>

<h3>Server</h3>

<p>The Car Bones server is typical of a Breeze sample application. There&#39;s a <strong><em>CarBonesController</em></strong>, a Breeze Web API controller talking to an Entity Framework <em>DbContext </em>(<strong><em>CarBonesContext</em></strong>). The <em>DbContext </em>exposes <em>DbSets </em>for <em>Cars </em>and <em>Options</em>. The controller API has IQueryable <em>Cars </em>and <em>Options </em>methods.</p>

<p><em>Car </em>and <em>Option </em>are the two model entity types, written in &quot;Code First&quot; style. A <em>Car </em>has an <em>Options </em>navigation property which returns its child <em>Options </em>. An <em>Option </em>has a <em>Car </em>property that returns its parent <em>Car</em>.</p>

<p>A <strong><em>CarBonesDatabaseInitializer </em></strong>(re)creates the database each time the server starts, populating it with the sample data (3 cars and their options).</p>

<h3>Client</h3>

<p>The Car Bones client is an <em>Index.cshtml</em> file and three application JavaScript files. The architectural style is Model-View-Controller (MVC).</p>

<p><em><strong>Index.cshtml</strong></em> is the single web page that serves as the application shell. A &quot;content&quot; <em>&lt;div/&gt;</em> defines the lone application View. Controller code will insert rendered templates, bound to cars and their options, into that <em>&lt;div/&gt;</em>.&nbsp; Below that&nbsp; &lt;div/&gt; are two templates, <em>car-template</em> and <em>option-template</em>, wrapped with inert <em>&lt;script/&gt;</em> tags.&nbsp;<br />
<br />
At the bottom of file are 3rd-party library scripts followed by the three scripts that comprise the client application.</p>

<p><em><strong>logger.js</strong></em> is a diagnostic script, called by other components when they log activity messages to the message area at the bottom of the screen.</p>

<p><em><strong>dataservice.js</strong></em> is the mediating layer between the <em>viewcontroller</em> and the application&#39;s Breeze code. You&#39;ll want to study this script. It demonstrates configuring Breeze to use backbone and the Web API, querying data, and saving changes.</p>

<p>Most of our samples are configured for Knockout. This sample is configured explicitly for <strong>backbone </strong>and the ASP.NET Web API as follows:</p>

<pre class="brush:jscript;">
    breeze.config.initializeAdapterInstances(
        { modelLibrary: &quot;backbone&quot;, dataService: &quot;webApi&quot; });</pre>

<p>Otherwise, this dataservice looks and behaves much like a dataservice configured for any other framework. You query and save in the same manner with the same syntax. <strong>Backbone </strong>reveals itself most clearly when you access an entity property. Instead of working with Knockout observable functions, you call <em>get </em>and <em>set </em>properties. Here&#39;s what we mean:</p>

<pre class="brush:jscript;">
logger.success(&quot;...&quot; + car.id());               // Knockout style
logger.success(&quot;...&quot; + car.getProperty(&quot;id&quot;));  // backbone style</pre>

<p>CarBones is configured for the &quot;camel case&quot; <em>NamingConvention</em>.</p>

<pre class="brush:jscript;">
// Declare the camel case name convention to be the norm
entityModel.NamingConvention.camelCase.setAsDefault();</pre>

<p>This means we can follow the JavaScript naming conventions while on the client and retain the C# conventions on the server:</p>

<pre class="brush:jscript;">
  someCar.Make; // C#
  someCar.make: // JavaScript</pre>

<p><em><strong>viewcontroller.js</strong></em> defines the main application controller and its <strong>backbone </strong>sub-controllers. It starts the app rolling. It defines two backbone <em>Views</em> (which are in fact controllers ... confusing but true), the <em>CarView </em>and the <em>OptionView</em>. These controllers acquire model objects (<em>Cars </em>and <em>Options</em>) by querying with the dataservice and then bind those objects to HTML controls in <em>Index.cshtml</em>.</p>

<p>Binding to entities built with backbone is quite different from binding entities built for Knockout. CarBones relies for binding on a backbone extension library called <strong>stickit </strong>... to which we turn next.</p>

<h2><a name="DataBindingWithStickit"></a>Data binding with stickit</h2>

<h3>Why stickit?</h3>

<p>Most Backbone developers expect to bind Backbone models to either underscore templates or <a href="http://handlebarsjs.com/" target="_blank">Handlebars </a>templates. You are welcome to do that. We tried both ... and were frustrated. These templating choices are fine for one-way binding from the model properties to the controls on the screen. But most developrs build Breeze apps that accept user input ... and a lot of it. That means data entry also flows from the controls back to the model properties.</p>

<p>We are used to two-way data binding frameworks such as <a href="http://knockoutjs.com/" target="_blank">Knockout </a>that coordinate flows both <em><strong>to </strong></em>and <em><strong>from </strong></em>the HTML controls. Backbone is good with pushing data into controls through the templates. It doesn&#39;t do a thing to help you get data from the controls back into the model objects. You have to hook up events to the controls to learn of user entry yourself. And you have to write code to extract the data from those controls and set the model properties. This is a lot of tedious, error prone work. We&#39;re not knocking backbone; we are saying that it isn&#39;t well suited for that kind of user interaction.</p>

<p>Fortunately, someone agreed and wrote <em><strong>backbone.stickit</strong></em>, a two-way binding framework that&#39;s <a href="https://github.com/NYTimes/backbone.stickit#readme" target="_blank">easy to learn</a> and easy to use.</p>

<h3>Binding with stickit</h3>

<p>You&#39;ll probably want to go beyond what we do in Car Bones which uses the simplest form of <strong>stickit </strong>binding.&nbsp; As with most binding frameworks, you write an HTML template in which you declare binding points in the template syntax. Stickit only has one binding point: the HTML &quot;id&quot; attribute. Here&#39;s the entire template for an <em>Option</em>.</p>

<pre class="brush:xml;">
&lt;script id=&quot;option-template&quot; type=&quot;text/x-template&quot;&gt;
    &lt;li&gt;
        &lt;input id=&quot;name-input&quot;&gt;
        &lt;span id=&quot;name-desc&quot; class=&quot;description&quot;/&gt;
    &lt;/li&gt;
&lt;/script&gt;?
</pre>

<p>As is typical of client-side templates, the <em>&lt;script/&gt;</em> tag surrounds some HTML that defines the layout for an object, a Car Bones <em>Option </em>in this case. The <em>&lt;script/&gt;</em> tag is just a clever way of preventing the browser from displaying that template. We want to <em>use </em>the template, not <em>display </em>it.</p>

<p>This template only has two slots: the input texbox with <em>id=&quot;name-input&quot;</em> and the span with <em>id=&quot;name-desc&quot;</em>. When rendered it looks like this:</p>

<p><img alt="" src="/images/samples/CarBonesOption.png" style="width: 286px; height: 36px;" /></p>

<p>That template defines what we would call the &quot;View&quot; - the surface seen by the user, the controls the user manipulates with keyboard, mouse and touch. In the <em><strong>viewcontroller.js</strong></em> you&#39;ll find the following line that uses jQuery to pull the HTML out of the <em>&lt;script/&gt;</em> tag and make it available as a JavaScript string.</p>

<pre class="brush:jscript;">
var optionTemplateSource = $(&quot;#option-template&quot;).html();</pre>

<p>Now that we have the template within the code, we&#39;re ready to use it in data binding.</p>

<p>In an MVC architecture, a <strong>Controller </strong>coordinates the <strong>View</strong>, represented by the template, with a <strong>Model</strong> object that holds the data. That controller class in Backbone is called <em>View </em>(confused? so were we).</p>

<p>Here is half of the code that defines the <em>OptionView</em> controller:</p>

<pre class="brush:jscript;">
var OptionView = Backbone.View.extend({
    bindings: {
        &#39;#name-input&#39;: &#39;name&#39;,
        &#39;#name-desc&#39;: &#39;name&#39;
    },
    ...
});
</pre>

<p>If you know Backbone, you know that the &quot;<em>bindings</em>&quot; member is not a native property of a Backbone <em>View </em>class. The &quot;bindings&quot; is <strong>stickit</strong>&#39;s extension to the <strong>backbone </strong><em>View </em>class.</p>

<p>The<em> bindings</em> member defines binding relationships between slots in a template and properties of a data object. This particular <em>bindings </em>object has two properties, &quot;<em>#name-input</em>&quot; and &quot;<em>#name-desc</em>&quot;. You probably recognize these as CSS selectors that match the &quot;<em>Id</em>&quot; attributes in the template.</p>

<p>These <em>bindings </em>property values - both &#39;<em>name</em>&#39; - identify the <em>Option </em>property to which the matching control should be bound. Of course the Option model object has a &#39;<em>name</em>&#39; property. Evidently we are binding both the <em>textbox </em>and the <em>span </em>to the same <em>Option </em>&#39;<em>name</em>&#39; property.</p>

<p>Notice that instead of inscribing the binding declaration in the HTML, as one does in <em>underscore</em>, <em>HandleBars</em>, <em>Knockout</em>, and most other templating frameworks, <strong>stickit </strong>declares its bindings in code.</p>

<p>Here&#39;s the rest of the <em>OptionView</em>, the part that renders an <em>Option </em>model instance:</p>

<pre class="brush:jscript;">
var OptionView = Backbone.View.extend({
    bindings: {...
    },
    render: function () {
        this.$el.html(optionTemplateSource);
        this.stickit();
        return this;
    }
});
</pre>

<p>The <em>OptionView</em>&#39;s &quot;<em>render</em>&#39; method, when called by backbone, constructs a DOM-ready element (<em>$el</em>) from the template source described above. Then <strong>stickit </strong>&quot;<em>sticks</em>&quot; the jproperty values of the bound <em>Option</em> into the prescribed slots of the DOM-ready element.</p>

<p>Elsewhere, in <em><strong>viewcontroller.js</strong></em> you&#39;ll find code that builds up DOM-ready elements, brick-by-brick, inside-out, using this same technique. Eventually, you get to a line that plugs the final elements into the browser DOM. Here is a schematic code snippet showing how that happens.</p>

<pre class="brush:jscript;">
var content = $(&quot;#content&quot;); // the slot in the Index.cshtml where we put the composed result
...
cars.forEach(  
    function(car) {
           ...
           content.append(view.render().el); // render the view and put it on screen
    });
    ...
}</pre>

<h3>The data binding cycle</h3>

<p>We saw how <strong>stickit </strong>fills a DOM-ready element, built from a template. We saw <strong>backbone </strong>render the view and used <strong>jQuery </strong>to push the rendered elements on to the screen. That&#39;s one-way binding.</p>

<p><strong>Stickit </strong>also listens to events on the bound controls. For example, as the user enters data into the <em>Option name </em>textbox, <strong>stickit </strong>propagates the user&#39;s keystrokes back to the <em>Option</em> object&#39;s <em>name </em>property. The updated <em>name </em>property (which is observable) triggers another event.&nbsp; <strong>stickit </strong>hears that event, and propagates the changes to the <em>&lt;span&gt;</em>. The circle is complete.</p>

<p>You can see this for yourself by adding and removing characters in the <em>Options </em>textbox.</p>
