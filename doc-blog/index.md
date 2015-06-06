---
layout: doc-blog
custom-css: /styles/blog-index.css
---
<h1> Blog posts </h1>

> These blog pages are still under construction.  But expect more soon...

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
  		<a href="{{ post.url }}#disqus_thread" class="btn" title="Comments"></a>
		</div>   
	</li>
  {% endfor %}
</ul>

{% include discus-count.html %}
 