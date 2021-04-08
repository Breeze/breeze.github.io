---
layout: doc-samples
redirect_from: "/old/samples/espn.html"
---
<table style="border: 0; margin: 0 0 20px 0;">
	<tbody>
		<tr>
			<td style="width:1%"><img alt="espn"  src="/images/samples/espn-sample.png" /></td>
			<td>
			<h1 style="margin: 20px 0 20px 0;">The ESPN &quot;Not My Server&quot; sample</h1>
			</td>
		</tr>
	</tbody>
</table>
<p class="critical">
Sadly ESPN decided to retire <b>all</b> of its public APIs (<a href="http://www.espn.com/apis/devcenter/overview.html" target="_blank">see announcement</a>). Therefore, this sample no longer runs. We're looking to replace it with something that demonstrates the same ability to consume a 3rd party API. Until then, you may benefit from reading the description and reviewing the code.
</p>
<a href="https://github.com/PWKad" target="_blank">Patrick Walter's</a> "Not My Server" style application shows Breeze using data from a 3rd party service.

Download the sample from <a href="https://github.com/IdeaBlade/ESPN-Breeze" target="_blank">GitHub</a>.

## Prerequisites

1.  Bootstrap.js
2.	Breeze.js
3.	Durandal (jQuery.js, Knockout.js, Require.js) 
4.	q.js
5.	Sammy.js
6.	Toastr.js

<img alt="Team News" style="width:100%; max-width:800px;" src="/images/samples/mlb.png" />

## Overview
Team News is a simple app that consumes ESPN's free public API using Breeze.js for client-caching and using Knockout.js for data-binding.

Patrick started this sample to help those looking for help on using Breeze.js with Knockout.js.  The Breeze website has sample using the [Edmunds API and AngularJS](/doc-samples/edmunds), and Patrick felt that Knockout.js needed its own 3rd-party data sample to make the learning process easier. Durandal’s Starter Kit also includes Twitter Bootstrap for front-end design and Sammy.js for routing. 

## Technologies

In an effort to see how quickly Patrick could create a working sample, he used the <a href="http://durandaljs.com/downloads.html" target="_blank">Durandal.js Starter Kit</a> project.  By starting with this kit he was able to add Breeze.js and get the sample up and running in Visual Studio 2012 in about 10 minutes, as opposed to starting with a blank project, stripping it, setting up views and routes, and everything else that can take additional time.

Key functions in this application include datacontext.js, model.js, and jsonResultsAdapter.js files.  

<img alt="Oakland Athletics" style="width:100%; max-width:800px;" src="/images/samples/oak.png" />

## What to look for

There are a few cool Breeze things going on in this project I wanted to point out: 

1. Inside App/services/model.js you will find how to add entity types without using metadata
2. Inside App/services/datacontext.js you will find a few "gems"'
 * How to use 'toType' in your Breeze queries
 * How to add parameters onto your queries to an API
 * How to add a custom JSON results adapter
3. Inside App/services/jsonResultsAdapter.js you will find a few "stones"
 * How to create a basic results adapter that Breeze uses when data is returned (when 'toType' isn't enough)
 * How to map new properties on top of the data

In addition, there are a few cool Knockout things going on: 

1. The background color for each team is dynamically evaluated
2. The accordion is dynamically created