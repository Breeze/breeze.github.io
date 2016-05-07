---
layout: doc-breeze-labs
redirect_from: "/old/documentation/breezeajaxpostjs.html"
---
# Breeze queries using POST #
This feature is for handling large object graphs as query parameters - object graphs so large that they won't fit in a URL.
It updates the [Breeze AJAX adapter](/doc-js/server-ajaxadapter) to allow HTTP POST 
for specially-constructed [.withParameters](/doc-js/api-docs/classes/EntityQuery.html#method_withParameters)
 queries.  

It works by telling jQuery's AJAX implementation, or Angular's $http service, to use POST instead of GET.  

This is an add-on to Breeze, and POST requires changes to the way your `.withParameters` queries are structured, so don't use it unless you really need it.

## Installation
Get [breeze.ajaxpost.js](https://github.com/Breeze/breeze.js.labs/blob/master/breeze.ajaxpost.js) from GitHub.

In your HTML file (e.g. index.html), add a script tag for **breeze.ajaxpost.js** ***after*** the breeze library:

      <script src="Scripts/breeze.debug.js"></script>
      <script src="Scripts/breeze.ajaxpost.js"></script>

The *ajaxpost* script immediately wraps the current Breeze ajax adapter and plugs itself into the *breeze* namespace.

That's fine if you're using breeze's *default* ajax adapter. If you change the adapter ... as you do for an Angular app by way of the *breeze.angular* module ... you'll have to wrap the replacement adapter by calling `breeze.ajaxPost()` explicitly after the change as in this example.

    // app module definition
    var app = angular.module('app', ['breeze.angular']);  // add other dependencies

    // this data service abstraction definition function injects the 'breeze.angular' service
    // which configures breeze for angular use including choosing $http as the ajax adapter
    app.factory('datacontext', ['breeze', function (breeze) {    // probably inject other stuff too
        breeze.ajaxPost(); // wraps the now-current $http adapter
        //... your service logic
    }]);

## Usage
Server side method using GET (example using .NET Web API):

        [HttpGet]
        public IQueryable<Customer> SimilarCustomersGET([FromUri]Customer customer)
        {
            // repository exposes a method that does query-by-example
            return repository.CustomersLikeThis(customer);
        }

Use the GET method from the Breeze client:

     var query = breeze.EntityQuery.from('SimilarCustomersGET')
            .withParameters({
                CompanyName: 'Hilo Hattie', ContactName: 'Donald', City: 'Duck', 
                Country: 'USA', Phone: '808-234-5678' 
            });

Server side method using POST:

        [HttpPost]
        public IQueryable<Customer> SimilarCustomersPOST(Customer customer)
        {
            return repository.CustomersLikeThis(customer);
        }

Use the POST method from the Breeze client:

     var query = breeze.EntityQuery.from('SimilarCustomersPOST')
            .withParameters({ 
                $method: 'POST',
                $encoding: 'JSON',
                $data: { CompanyName: 'Hilo Hattie', ContactName: 'Donald', City: 'Duck', 
                             Country: 'USA', Phone: '808-234-5678' } 
            });

Special parameters:

- $method: ‘POST’ or ‘GET’ (the default)
- $encoding: ‘JSON’ or x-www-form-urlencoded (the default)
- $data: contains the data to be sent to the server

## Examples
### Live POST queries

A StackOverflow question prompted us to produce [**this plunker example**](http://plnkr.co/edit/TvjvCpjlB1FyglRJinp5?p=info) of an Angular app making POST queries to a cross-origin server. All app JavaScript is in the *script.js* file. Be sure to follow along with the *README.md* which describes the mechanics in detail.

Features:

* Gets data from a foreign server that knows nothing of breeze
* breeze labs “ajaxpost” plugin to make POST queries to that server
* Custom `jsonResultsAdapter` to help Breeze translate JSON into entities.
* Client-side metadata

<p class="note">The sample only works with modern browsers (IE10+, FF, Chrome) .</p>

### *ajaxpost* in DocCode
The breeze [ngDocCode sample](https://github.com/Breeze/breeze.js.samples/tree/master/node/ngDocCode) has tests of `ajaxPost` for AngularJS apps in the [*query_with_post.spec.js*](https://github.com/Breeze/breeze.js.samples/blob/master/node/ngDocCode/public/test/server_specs/query_with_post.spec.js) file. Here's one of the tests (written in mocha/chai):

    it("by CompanyName", function (done) {

        var companyName = 'Die Wandernde Kuh';

        EntityQuery.from(resource)
            .withParameters({
                $method: 'POST',
                $encoding: 'JSON',
                $data: {
                    CompanyName: companyName
                }
            })
            .using(em).execute()
            .then(success)
            .then(done, done);

        function success(data){
            expect(data.results).to.have.length(1);
            var cust = data.results[0];
            expect(cust.CompanyName).to.equal(companyName);
        }
    });

These tests POST to a server method on the [*northwindController*](https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode/Controllers/NorthwindController.cs#L67)  (an ASP.NET Web API Controller):

    [HttpPost]
    // For breeze labs "breeze.ajaxpost" tests
    public HttpResponseMessage CustomersWithFilterOptions(JObject options) {
      // for debugging
      var queryParams = Request.GetQueryNameValuePairs();

      // do the job
      return Request.CreateResponse(HttpStatusCode.OK,
        _repository.CustomersWithFilterOptions(options));
    }

That method delegates to a method in the [*northwindRepository*](https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode.DataAccess.EF/NorthwindRepository.cs#L51) that parses the JSON request body:

    public IQueryable<Customer> CustomersWithFilterOptions(JObject options)
    {
      var query = ForCurrentUser(Context.Customers);
      if (options == null) { return query; }

      if (options["CompanyName"] != null)
      {
        var companyName = (string) options["CompanyName"];
        if (!String.IsNullOrEmpty(companyName))
        {
          query = query.Where(c => c.CompanyName == companyName);
        }
      }

      if (options["Ids"] != null)
      {
        var ids = options["Ids"].Select(id => (Guid) id).ToList();
        if (ids.Count > 0)
        {
          query = query.Where(c => ids.Contains(c.CustomerID));
        }
      }

      return query;
    }
