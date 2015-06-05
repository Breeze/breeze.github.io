---
layout: doc-blog
custom-css: /styles/blog-index.css
---
<h1> Blog posts </h1>

> These blog pages are still under construction.  But expect more soon...

<ul>
  {% for post in site.posts %}
    <li class="blog-item"  >
      <a href="{{ post.url }}">{{ post.title }}</a>
      {{ post.excerpt }}
      <a href="{{ post.url }}" title="Read more" class="btn blog-btn">Read more</a>     
    </li>
  {% endfor %}
</ul>

 