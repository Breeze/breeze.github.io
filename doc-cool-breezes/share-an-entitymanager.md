---
layout: doc-cool-breezes
redirect_from: "/old/documentation/.html"
---
<h2>
	<a name="SingleManagerApp"></a>Share a single EntityManager</h2>
<p>An <em>EntityManager </em>is both a gateway to a service and a local cache of entities. A single <em>EntityManager</em> will often suffice for applications that communicate with one service and can share a single cache of entities with every application view.</p>
<p><a name="EncapsulateInDatacontext"></a>We recommend encapsulating the application manager within a &quot;datacontext&quot; (AKA &quot;dataservice&quot;) module and putting that <em>datacontext </em>where other modules - such as View Models and View Controllers - can get it. Your application&#39;s modularity pattern will guide you. For example, if your modules are attached to an application namespace, you might define a <em>datacontext </em>as follows:</p>
<pre class="brush:jscript;">
app.datacontext = (function () {

   // ... configure the application for Breeze ...
   var manager = new breeze.EntityManager(applicationServiceName);

   // ... more datacontext ...

   var datacontext {
       getThis: getThis,
       getThat: getThat,
       saveChanges: saveChanges,
       // ... other datacontext API ...
   }
   return datacontext;

   function getThis(thisList) { ... }
   function getThat(thatList) { ... }
   function saveChanges( ) { ... }
})();</pre>
<p>And your <em>ViewModel </em>classes might look somewhat like these:</p>
<pre class="brush:jscript;">
/*** ViewModel of This ***/
app.ThisViewModel = (function (ko, datacontext) {

   var _activate = false,
       thisList = ko.observableArray();

   return {
       thisList: thisList,
       activate: activate,
       refresh: refresh
   };

   function activate() {
      if (!_activated) {
          _activated = true;
          refresh();
      }   
   }

   function refresh() {
      return datacontext.getThis(thisList).fail(queryFailed);   
   }

   function queryFailed(error) { ... }

})(ko, app.datacontext);</pre>
<pre class="brush:jscript;">
/*** ViewModel of That ***/
app.ThatViewModel = (function (ko, datacontext) {

   // ... like a ThisViewModel for that ...

})(ko, app.datacontext);</pre>
