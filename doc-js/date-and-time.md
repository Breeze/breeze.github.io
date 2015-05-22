---
layout: doc-js
redirect_from: "/old/documentation/date-time.html"
---

#Entity Date &amp; Time

Date and time are slippery concepts in software systems and no where more so than in JavaScript applications. This topic describes how Breeze handles them and drops a few hints about pitfalls and practices.

##ISO 8601

<a href="http://en.wikipedia.org/wiki/ISO_8601" target="_blank">ISO 8601</a> is the current international standard for representing date and time in software systems. That&#39;s the default format for *DateTime *values exchanged between a Breeze client and a remote service that serializes JSON objects with Json.Net. The Breeze `JsonFormatter` for ASP.NET Web API controllers is set for ISO8601 and the default "preserve timezone" handling (<a href="http://james.newtonking.com/projects/json/help/index.html?topic=html/T_Newtonsoft_Json_DateTimeZoneHandling.htm" target="_blank">`DateTimeZoneHandling.RoundTripKind`</a>); that means that the timezone of the value on the server will be carried over to the value on the client (and vice versa).

You can opt for different settings if you understand the consequences. Make sure you understand how the remote service is handling *DateTime* values if you're communicating with a system other than a Web Api configured per the Breeze default.

Remember, though, that Breeze on the client serializes per ISO 8601 and there is no supported way to change that behavior.

##New entity *DateTime* values

The metadata determine how Breeze initializes the *DateTime* property of a newly-created entity. The property will be *null* if the property is nullable. If the property is not nullable (i.e., required), Breeze sets it to the constant value in <a href="/doc-js/api-docs/classes/DataType.html#property_DateTime" target="_blank">`breeze.DataType.DateTime.defaultValue`</a>. That default is "January 1, 1900". You can change this value for your application as long as you do so *before* fetching or setting metadata.

####Custom initialization

You may require a different initial or default value for certain *DateTime* properties of specific entities. Maybe the value should be the current *DateTime* at the moment of entity creation. There are at least three ways to achieve this effect:


1. Set the property inline immediately after creating the entity.
1. Initialize it with a function inside a custom constructor that you&#39;ve registered for this entity type.
1. Set it in an initializer function that you&#39;ve registered for this entity type, taking care to do so only for a created entity, not a materialized entity.


The techniques in support of choices (2) and (3) are described in "<a href="/doc-js/extending-entities" target="_blank">Extending Entities</a>".

##Gotchas!

<a href="https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date" target="_blank">JavaScript *DateTimes*</a> are not like DateTime objects in other languages.

####Constructors are peculiar.

	Date.now(); // returns an integer, e.g., 1355549799408
	new Date(Date.now()); // the &#39;now&#39; DateTime you expected
	
	// Don&#39;t forget &#39;new&#39;
	Date(); // not a date; the string version of Date.now() 
	Date(2013,1,1); // not a date; also the string version of Date.now() !?!
	
	new Date(2013,0,1); // ahh ... a date at last ... but in January; time is midnight
	new Date(2013,0,1, 23, 59, 59); // minute before midnight
	new Date(2013,0,1, 24, 0, 0);   // midnight of Jan 2nd

The month numbers are zero origin. That means 0=January, 1=February, ... 11=December. However, the Day and Year are origin-1 as you'd expect.

####Native DateTime functions are *weird*.

The native JavaScript function for getting a date part is not always obvious. For example, to get and set the day of the month:

	var testDate = new Date(2013,0,1);
	testDate.getDay();  // 2 = Tuesday = day-of-the-week
	testDate.getDate(); // 1 = first of the month  = day-of-the-month
	testDate.setDay(15);  // exception ... no such method
	testDate.getDate(15); // sets day-of-the-month

`Date.parse` returns an integer:

	Date.parse("1/1/2013"); // returns integer such as 1357027200000
	new Date( Date.parse("1/1/2013") ); // this is a date

####Beware equality tests

	var date1 = new Date(2013,0,1, 12, 30, 0);
	var date2 = new Date(2013,0,1, 12, 30, 0); // same as date1
	
	// date equality fails because compares object identity, not value equality");
	date1 == date2;  // false !?!
	date1 === date2; // false !?!
	date1 !== date2; // true!?!
	
	// use getTime() which returns the integer rep of a datetime
	// integer equality is always a value test
	date1.getTime() === date2.getTime(); // true

Breeze local cache queries compare date values using `getTime()`.

##DateTime parts are mutable but not observable

> Critically important for Breeze developers

Do not change part of a date and expect the entity to change its <a href="/doc-js/inside-entity" target="_blank">EntityState</a>. **It won't!** Your change may not be saved.

	// assume order is unchanged.
	var testDate = order.getProperty("OrderDate");
	var day = testDate.getDate();
	
	testDate.setDate(day + 1); // bump the day
	
	order.getProperty("OrderDate").getDate() !== day; // we did change it
	
	var entityStateName = order.entityAspect.entityState;
	entityStateName === "Unchanged"; // however the entity remains unchanged
	
	manager.saveChanges(); // the order will NOT be saved !!!


Therefore, **don't just change a part of an entity's date property, change the entire date!**

	// assume order is unchanged.
	var testDate = order.getProperty("OrderDate");
	var day = testDate.getDate();
	
	testDate.setDate(day + 1); // bump the day
	
	// set the date property with a clone of the changed date
	order.setProperty("OrderDate", new Date(testDate));
	
	var entityStateName = order.entityAspect.entityState;
	entityStateName === "Modified"; // now the entityState has changed
	
	manager.saveChanges(); // the order will be saved !!!

##Try MomentJS

Working with JavaScript dates is "challenging" to put it politely. Consider using a third-party library for date manipulation. We've had good success with the open source <a href="http://momentjs.com/" target="_blank">MomentJS library</a>.

