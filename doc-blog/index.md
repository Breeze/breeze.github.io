---
layout: doc-blog
custom-css: /styles/blog-index.css
---
<ul>
  {% for post in site.posts %}
	<li class="blog-item"  >
		<div class="blog-excerpt">
	  {% if post.content contains '<!-- more -->' %}
			{{ post.content | split: '<!-- more -->' | first }}
			<a href="{{ post.url }}" title="Read more" class="btn btn-default">Read more</a>
	  {% else %}
			{{ post.content }}
	  {% endif %}
		  <a href="{{ post.url }}" class="btn">Posted on: {{ post.date | date: "%Y-%m-%d" }}</a>
  		<a href="{{ post.url }}#disqus_thread" class="btn btn-default" title="Comments"></a>
		</div>   
	</li>
  {% endfor %}
</ul>

{% include discus-count.html %}
 