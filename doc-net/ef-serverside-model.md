---
layout: doc-net
---
<h1>The server-side model</h1>

<p>In the sample code we implement the persistence service as an ASP.NET Web API that queries and saves entities with the help of the Entity Framework. You can write the service a different way but this is a convenient approach for .NET developers and the one we&rsquo;ll discuss on this page and the ones that follow.</p>

<h2>Entity Framework</h2>

<p><a href="http://msdn.microsoft.com/en-us/data/ef.aspx">Entity Framework</a> (EF) is a .NET data access technology with an Object Relational Mapper (ORM). The ORM maps a domain-specific object model to the schema of a relational database. It uses that map to move data between entity model objects (instances of .NET classes) and the tables and columns of a relational database.</p>

<p>A Breeze client model maps easily to (almost) every structure supported by Entity Framework 4.x, including:</p>

<ul>
	<li>All simple data types</li>
	<li>Complex types</li>
	<li>Inheritance (TPH, TPT, TPC)</li>
	<li>Associations: 1-1, 1-M</li>
</ul>

<p>The Breeze.js client does not support &quot;many to many&quot; relationships at this time. You will have to expose the junction/mapping table as an entity.</p>

<p>The Breeze.net server components support EF 4.x and 5.x but not EF 6 (which has not been released) nor versions prior to v.4.2 .</p>

<h2>Build your model</h2>

<p>You can build your EF model in two ways:</p>

<ol>
	<li>Start from an existing database, derive a conceptual model from the database schema, and generate entity classes from that conceptual model.</li>
	<li>Write your .NET entity classes first, then tell EF to derive the conceptual model and database mapping from your classes.</li>
</ol>

<p>The first approach is called &ldquo;<strong>database first</strong>&rdquo;. You point EF&rsquo;s model design tool at a database and it produces an XML description of the mapping called an EDMX file. You&rsquo;ll see this artifact in the .NET model project.</p>

<p>The second approach is called &ldquo;<strong>code first</strong>&rdquo;. You write your entity classes to suit your application needs with comparatively little regard for the database, the EF, or its mapping. There is no EDMX file.</p>

<p>The &ldquo;code first&rdquo; approach rarely works in the pristine way I described. You usually have to take EF by the hand and walk it in the right direction, perhaps by decorating your classes with helpful attributes or perhaps more explicitly through EF&rsquo;s &ldquo;fluent&rdquo; mapping API.</p>

<p>Both approaches have merit. We can use either to build the model for our Breeze application.</p>

<p class="note">See the <a href="/documentation/web-api-configuration" target="_blank">Web Api Configuration</a> topic to resolve Entity Framework version issues.</p>

<h2>A simplistic code first model</h2>

<p>This isn&rsquo;t a lesson in Entity Framework so we&rsquo;ll just pick one &hellip; and we&rsquo;ll pick &ldquo;code first&rdquo;.</p>

<p>Here&rsquo;s the one entity class in model for the &ldquo;Breeze Todo&rdquo; sample application:</p>

<div>
<pre class="brush:csharp;">
    public class TodoItem    {
        public int Id { get; set; }                     // 42

        [Required, StringLength(maximumLength: 30)]     // Validation rules
        public string Description { get; set; }         // &quot;Get milk&quot;

        public System.DateTime CreatedAt { get; set; }  // 25 August 2012, 9am PST
        public bool IsDone { get; set; }                // false
        public bool IsArchived { get; set; }            // false
    }</pre>
</div>

<p>All properties are data properties whose values belong in the database. There are no navigation properties to related entities (because this is the only entity in the model). The class is public and all properties are fully public so it will serialize to a wire format cleanly on its own. The property names match the table and column names we&rsquo;d like to see in our database. The primary key can be inferred from the property named &ldquo;Id&rdquo; and, being integer, EF will assume that the database is responsible for generating new Ids when inserting new TodoItem rows.</p>

<p>The Description is adorned with two validation attributes, one making the Description required, the other limiting its maximum length to 30 characters. Validation aside, the class could hardly be simpler &hellip; or less realistic.</p>

<h2>A more realistic code first model</h2>

<p>Let&rsquo;s try something more ambitious. We&rsquo;ll look at excerpts from three related entity classes in the Northwind model, starting with the Customer class.</p>

<div>
<pre class="brush:csharp;">
public class Customer {

  public Guid CustomerID { get; internal set; }

  [Required, MaxLength(40)]
  public string CompanyName { get; set; }

  [MaxLength(30)]
  public string ContactName { get; set;}

  // ... more properties ...

  public ICollection&lt;Order&gt; Orders { get; set; }
}</pre>
</div>

<p>Some of the properties are decorated with validation attributes (<span class="codeword">Required</span>, <span class="codeword">MaxLength</span>). Entity Framework can use this information to validate changed entities before saving them. <a href="/documentation/validation">So can Breeze</a>.</p>

<p>Notice the <span class="codeword">Orders</span> navigation property returns a collection of type Order. Customer has a one-to-many relationship with Order and this property implements that relationship in the server-side class model. Expect to see that same relationship implemented in the Order property of Customer entity in the Breeze JavaScript client-side model.</p>

<p>One more thing before we look at other entity classes.&nbsp; The <span class="codeword">CustomerID</span> is the customer primary key. Entity Framework recognizes that fact but it doesn&rsquo;t know who is responsible for setting the key when adding new customers. By convention, EF assumes the client will set it. That not true in our sample where the Northwind database sets the key. We&rsquo;ll have to tell EF about that &hellip; which we could do with another attribute &hellip; or we could do with EF&rsquo;s &ldquo;fluent API&rdquo; for configuring the model mapping. We used the fluent API in our sample code; look for the <span class="codeword">CustomerConfiguration</span> class when you have a moment.</p>

<p>We&rsquo;re not going to teach you the intricacies of Entity Framework. Plenty of other books, articles, videos and blog posts cover that ground. And EF is really tangential to the Breeze story.&nbsp; We trust it is sufficient to show you that Breeze can accommodate an EF model of this kind.</p>

<h2>The Order entity</h2>

<p>The Order entity is on the other end of the <span class="codeword">Customer.Orders</span> property. Let&rsquo;s look at it.</p>

<div>
<pre class="brush:jscript;">
public class Order {

  public int OrderID {get; set;}
  public Guid? CustomerID {get; set;}
  public DateTime? OrderDate {get; set;}
  public decimal? Freight {get; set;}

  // ... more properties ...

  [ForeignKey(&quot;CustomerID&quot;)]
  [InverseProperty(&quot;Orders&quot;)]
  public Customer Customer {get; set;}

  [InverseProperty(&quot;Order&quot;)]
  public ICollection&lt;OrderDetail&gt; OrderDetails {get; set;}
}</pre>
</div>

<p>Near the bottom is the <span class="codeword">Customer</span> navigation property. This is the inverse of the customer&rsquo;s <span class="codeword">Orders</span> property and gives us a way to navigate back to the parent Customer.</p>

<p><span class="codeword">CustomerID</span> is the foreign key that helps us relate the order to its parent customers. Order is the dependent entity in the relationship so it must hold a foreign key value to match the primary key of its parent entity, the customer.</p>

<p>A dependent entity in Breeze must also have a foreign key to its parent.</p>

<p>Did you notice that the <span class="codeword">CustomerID</span> is nullable? That means an order doesn&rsquo;t have to have a parent customer. Probably not a good design but it&rsquo;s the truth in Northwind. Our application will need to know that &ldquo;Customer&rdquo; is optional.</p>

<p>Finally, we come to the <span class="codeword">OrderDetails</span> navigation property. This returns an order&rsquo;s line items just as <span class="codeword">Customer.Orders</span> returned a customer&rsquo;s orders. The customer object graph is now three legs long: customer to orders to orderdetails.</p>

<h2>The OrderDetails entity</h2>

<p>Here it is:</p>

<div>
<pre class="brush:jscript;">
public class OrderDetail {

  public int OrderID {get; set;}
  public int ProductID {get; set;}
  public decimal UnitPrice {get; set;}

  // ... more properties ...

  [ForeignKey(&quot;OrderID&quot;)]
  [InverseProperty(&quot;OrderDetails&quot;)]
  public Order Order {get; set;}

  [ForeignKey(&quot;ProductID&quot;)]
  public Product Product {get;set;}
}</pre>
</div>

<p>This seems familiar. At the bottom are two navigation properties, one to the parent <em>Order</em> and another to a <em>Product</em>. That makes sense: a real world line item belongs to an order and is associated with a product of some kind, probably in the catalog of products that Northwind sells.</p>

<p>Where is the primary key? There is no obvious candidate such as <span class="codeword">OrderDetailID</span>. The <span class="codeword">OrderID</span> can&rsquo;t be the key because it isn&rsquo;t unique; neither is the <span class="codeword">ProductID</span>. The combination {<span class="codeword">OrderID</span>, <span class="codeword">ProductID</span>} can be unique &hellip; and this combination is, in fact, the primary key for OrderDetail. Yes OrderDetail has a <strong>composite key</strong>.</p>

<p>We could use attributes to tell EF about this composite key but we&rsquo;ll use EF&rsquo;s fluent mapping API instead; see the <span class="codeword">OrderDetailConfiguration</span> &nbsp;class in the sample code.</p>

<p>Can Breeze handle entities with composite keys? It sure can.</p>

<h2>Model Metadata</h2>

<p>We could continue by tracing the path from OrderDetail to Product to Supplier, then work our way around to the rest of the model. But you get the idea and you can study the model in the sample code at your leisure.</p>

<p>I&rsquo;d like for you to pause for a moment and reflect on what we&rsquo;ve discovered in these three classes along. Although each is simple in its own right, there&rsquo;s rather a lot to know about the entities in a model. For each entity property we have questions that go beyond &ldquo;<em>what&rsquo;s the property name?</em>&rdquo; &hellip; questions such as:</p>

<ul>
	<li>What&rsquo;s its datatype?</li>
	<li>Is it nullable?</li>
	<li>Is it a navigation property? If so, how does it relate to another entity?</li>
	<li>Is it a primary key or a foreign key?</li>
	<li>Is it part of a compound key? If so which part?</li>
	<li>Is the client or the server responsible for assigning keys to new entities?</li>
	<li>Is a value required? Is there a minimum or maximum length?</li>
</ul>

<p>These questions are just as important on the client. A client customer entity has a required CompanyName property and a Guid primary key that it shouldn&rsquo;t touch. The application ought to limit the length of the CompanyName to 40 characters; it would be pointless to try to save a customer with a 50 character name.</p>

<p>A customer on the JavaScript client will have orders and those orders will have order details and they&rsquo;ll all be wired together in the same manner as their server-side companions.</p>

<p>Imagine a model with 30, 50, 100, or 200 entities, each with an average of 10 properties. No one wants to re-code this kind of metadata in JavaScript for all of those entities and properties.</p>

<p>You don&rsquo;t have to with Breeze. There&rsquo;s a .NET Breeze component that scoops up this information and packages it as a metadata document. Your persistence service can send this document to the Breeze client. The Breeze client interprets the metadata and builds a conforming JavaScript model with the same structure and constraints as the server-side model.</p>

<p>We&rsquo;ll see how this works when we get to the client. Our next stop is the <a href="/documentation/entity-framework-dbcontext-0">Entity Framework <em>DbContext</em> </a>which is the gateway to the database.</p>
