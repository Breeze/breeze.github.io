---
layout: doc-js
---

<h1>Entity Date &amp; Time</h1>

<p>Date and time are slippery concepts in software systems and no where more so than in JavaScript applications. This topic describes how Breeze handles them and drops a few hints about pitfalls and practices.</p>

<h2>ISO 8601</h2>

<p><a href="http://en.wikipedia.org/wiki/ISO_8601" target="_blank">ISO 8601</a> is the current international standard for representing date and time in software systems. That&#39;s the default format for <em>DateTime </em>values exchanged between a Breeze client and a remote service that serializes JSON objects with Json.Net. The Breeze <span class="codeword">JsonFormatter</span> for ASP.NET Web API controllers is set for ISO8601 and the default &quot;preserve timezone&quot; handling (<code><a href="http://james.newtonking.com/projects/json/help/index.html?topic=html/T_Newtonsoft_Json_DateTimeZoneHandling.htm" target="_blank">DateTimeZoneHandling.RoundTripKind</a></code>); that means that the timezone of the value on the server will be carried over to the value on the client (and vice versa).</p>

<p>You can opt for different settings if you understand the consequences. Make sure you understand how the remote service is handling <em>DateTime </em>values if you&#39;re communicating with a system other than a Web Api configured per the Breeze default.</p>

<p>Remember, though, that Breeze on the client serializes per ISO 8601 and there is no supported way to change that behavior.</p>

<h2>New entity <em>DateTime</em> values</h2>

<p>The metadata determine how Breeze initializes the <em>DateTime </em>property of a newly-created entity. The property will be <em>null </em>if the property is nullable. If the property is not nullable (i.e., required), Breeze sets it to the constant value in <span class="codeword"><a href="/sites/all/apidocs/classes/DataType.html#property_DateTime" target="_blank">breeze.DataType.DateTime.defaultValue</a></span>. That default is &quot;January 1, 1900&quot;. You can change this value for your application as long as you do so <em>before </em>fetching or setting metadata.</p>

<h4>Custom initialization</h4>

<p>You may require a different initial or default value for certain <em>DateTime </em>properties of specific entities. Maybe the value should be the current <em>DateTime </em>at the moment of entity creation. There are at least three ways to achieve this effect:</p>

<ol>
	<li>Set the property inline immediately after creating the entity.</li>
	<li>Initialize it with a function inside a custom constructor that you&#39;ve registered for this entity type.</li>
	<li>Set it in an initializer function that you&#39;ve registered for this entity type, taking care to do so only for a created entity, not a materialized entity.</li>
</ol>

<p>The techniques in support of choices (2) and (3) are described in &quot;<a href="/documentation/extending-entities" target="_blank">Extending Entities</a>&quot;.</p>

<h2>Gotchas!</h2>

<p><a href="https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date" target="_blank">JavaScript <em>DateTimes</em></a> are not like DateTime objects in other languages.</p>

<h4>Constructors are peculiar.</h4>

<pre class="brush:jscript;">
Date.now(); // returns an integer, e.g., 1355549799408
new Date(Date.now()); // the &#39;now&#39; DateTime you expected

// Don&#39;t forget &#39;new&#39;
Date(); // not a date; the string version of Date.now() 
Date(2013,1,1); // not a date; also the string version of Date.now() !?!

new Date(2013,0,1); // ahh ... a date at last ... but in January; time is midnight
new Date(2013,0,1, 23, 59, 59); // minute before midnight
new Date(2013,0,1, 24, 0, 0);   // midnight of Jan 2nd</pre>

<p>The month numbers are zero origin. That means 0=January, 1=February, ... 11=December. However, the Day and Year are origin-1 as you&#39;d expect.</p>

<h4>Native DateTime functions are <em>weird</em>.</h4>

<p>The native JavaScript function for getting a date part is not always obvious. For example, to get and set the day of the month:</p>

<pre class="brush:jscript;">
var testDate = new Date(2013,0,1);
testDate.getDay();  // 2 = Tuesday = day-of-the-week
testDate.getDate(); // 1 = first of the month  = day-of-the-month
testDate.setDay(15);  // exception ... no such method
testDate.getDate(15); // sets day-of-the-month</pre>

<p><span class="codeword">Date.parse</span> returns an integer:</p>

<pre class="brush:jscript;">
Date.parse(&quot;1/1/2013&quot;); // returns integer such as 1357027200000
new Date( Date.parse(&quot;1/1/2013&quot;) ); // this is a date</pre>

<h4>Beware equality tests</h4>

<pre class="brush:jscript;">
var date1 = new Date(2013,0,1, 12, 30, 0);
var date2 = new Date(2013,0,1, 12, 30, 0); // same as date1

// date equality fails because compares object identity, not value equality&quot;);
date1 == date2;  // false !?!
date1 === date2; // false !?!
date1 !== date2; // true!?!

// use getTime() which returns the integer rep of a datetime
// integer equality is always a value test
date1.getTime() === date2.getTime(); // true</pre>

<p>Breeze local cache queries compare date values using <code>getTime()</code>.</p>

<h2>DateTime parts are mutable but not observable</h2>

<p class="note">Critically important for Breeze developers</p>

<p>Do not change part of a date and expect the entity to change its <a href="/documentation/inside-entity" target="_blank">EntityState</a>. <strong>It won&#39;t! </strong>Your change may not be saved.</p>

<pre class="brush:jscript;">
// assume order is unchanged.
var testDate = order.getProperty(&quot;OrderDate&quot;);
var day = testDate.getDate();

testDate.setDate(day + 1); // bump the day

order.getProperty(&quot;OrderDate&quot;).getDate() !== day; // we did change it

var entityStateName = order.entityAspect.entityState;
entityStateName === &quot;Unchanged&quot;; // however the entity remains unchanged

manager.saveChanges(); // the order will NOT be saved !!!
</pre>

<p>Therefore, <strong>don&#39;t just change a part of an entity&#39;s date property, change the entire date!</strong></p>

<pre class="brush:jscript;">
// assume order is unchanged.
var testDate = order.getProperty(&quot;OrderDate&quot;);
var day = testDate.getDate();

testDate.setDate(day + 1); // bump the day

// set the date property with a clone of the changed date
order.setProperty(&quot;OrderDate&quot;, new Date(testDate));

var entityStateName = order.entityAspect.entityState;
entityStateName === &quot;Modified&quot;; // now the entityState has changed

manager.saveChanges(); // the order will be saved !!!</pre>

<h2>Try MomentJS</h2>

<p>Working with JavaScript dates is &quot;challenging&quot; to put it politely. Consider using a third-party library for date manipulation. We&#39;ve had good success with the open source <a href="http://momentjs.com/" target="_blank">MomentJS library</a>.</p>

<p>&nbsp;</p>
