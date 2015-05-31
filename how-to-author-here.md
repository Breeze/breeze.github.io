# How to author and organize pages on this site.

> This website is hosted on GitHub and uses Jekyl (http://jekyllrb.com/docs/home/)  and Liquid markdown.

## Directory Organization 

- Directories starting with 'doc-' contain files each of which represents a page on the actual site.  Each of these files is either an html or a markdown file.
    
  - **doc-main** - the intro pages to the site
  - **doc-cs** - all breeze-sharp related pages
  - **doc-js** - all breezejs related pages
  - **doc-net** - all .NET server related pages
  - **doc-java-hib** - all Java Hibernate related pages
  - **doc-node-mongo** - - all Node/Mongo related pages
  - **doc-node-sequelize** - all Node/Sequelize related pages
  - **doc-samples** - all docs related to a specific sample regardless of tech.
  - **doc-cool-breezes** - all cool-breezes docs
  - **doc-breeze-labs** - all breeze labs docs  

  > The 'doc-' prefix is a Breeze convention that makes it easier to find refs to documentation pages.  

- Jekyl 'reserved' directories 
  - **_data** - contains 'custom' metadata for this site.  In our case, the menu structures are defined here ( described later)
  - **_layouts** - every page on the site ( pages in one of the 'doc-' directories) has a corresponding layout. 
  - **_includes** - html fragments that are shared across possibly multiple pages.
    > This includes our standard header, footer, search dialog and leftNav bar.
  - **site** - This directory will only appear if you run Jekyl locally and consists of the generated website.  
    > This directory should never be checked in and you should NEVER edit in here directly; your changes will be lost.
    
  > These directory names are mandated by Jekyl 
  
- Helper directories
  - **js** - all javascript files used on the site
  - **styles** - all css files used on the site
  - **images** - all images used on the site. - There are two subdirs here that should be used for specific purposes    
      - **samples** - any image used exclusively for a sample's documentation
      - **logos** - all 3rd party logos go here.  
  - **downloads** - any loose files that may be downloaded in raw form via a link.

  > These directory names are a Breeze convention.
   
## Html/Markdown files

Every file in each of the "doc-" directories starts with "front matter"
This "front matter" must be the first thing in the file and must take the form of valid YAML set between triple-dashed lines. Here is a basic example:

    ---
    layout: doc-net
    ---

The 'layout' section should appear on every page and will reference one of the files in the **_layouts** directory.  The Html or Markdown text within each file represents the contents of the each page.     
   
#Layouts

There should be one html file in the **_layouts** directory with the same name as one of the 'doc-' directories.

For example, there should be a '*doc-samples.html*' file that corresponds to the '*doc-samples*' documentation directory.

Each of these html files contains the 'decoration' for all of the pages in the corresponding 'doc-' directory.  'Decoration' means the header, footer and left navigation bar on each page.  

However, because this decoration is pretty much the same for each page, except for the contents of the left menu and some extra buttons on the header bar, most of the pages will share a very similar structure and include much of the same html. An example of this structure for the doc-cs layout looks like this:

    {% assign menu = {{site.data.menu-cs}} %}
    {% assign widget1 = "breezesharp-api-button.html" %}
    {% include default.html %}

The first two lines assign variables that will be used within the 'default.html' file that is referenced in the 3rd line.  This file will be found in the '_includes' directory. 

The text found between the '{%' and '%}' delimiters is termed 'liquid markup' and is described on the Jekyl site.  

Note that there is no actual html in this file even though it has an '.html' extension.  This is because all of the actual html is in the 'default.html' file.

The 1st line of each file will typically involve an assignment statement for the 'menu' variable. This defines the menu structure that the corresponding 'doc-' directory will use. The name that is assigned; '{{site.data.menu-cs}}' in the example above references a specific file in the '_data' directory.  The {{site.data}} tells Jekyl to look in the '_data' directory and the 'menu-cs' tells it to look for yaml file with the name 'menu-cs.yml'.  

> The **site.data** name is a Jekyl convention.
> The 'menu-xxx' name is a Breeze convention and is described in more detail below.
 
The html pages in some directories will require more 'header' decoration than others. For example, **doc-js** pages each have a reference to the BreezeJs Tutorial and the BreezeJs API documentation.  Pages in the **doc-samples** directory have neither of these.  For this reason, we have created some 'named' variables that are referenced in the default.html file.  The 'widget1' in line2 is one of these.           


## Menus ( left nav bar)

All menus may be found in the **_data** dir. Normally there will be a 1-1 correspondence between a menu in **_data** dir and a specific 'layout' in the **_layouts** dir. In each case the name of the menu should follow the following pattern.

*doc dir name*:  doc-**xxx**           
*layout file name*: doc-**xxx**.html
*menu file name*: menu-**xxx**.yml

An example menu yml file is shown below:

    title: JavaScript client
    shorttitle: JS
    menuitems:
      - { link: download.html, title: Download } 
      - { link: features.html, title: Features }
      - { link: prerequisites.html, title: Prerequisites }
      - { link: lap-around-breeze.html, title: A lap around Breeze, isparent: true }
      - { link: lap-first-query.html, title: First query, ischild: true }
      - { link: lap-query-filter.html, title: Query with a filter, ischild: true } 

- The **title** is the title of the menu itself and will appear at the top of the left nav bar
- The **shorttitle** is used in combinatation with each page's title to create the 'title' tag in the <head> html for each page. ( This is also what appears in the title bar and what appears at the top of search results for a page).
- The **menuitems** is a collection of items, each of which points to one of the pages within the directory associated with this menu. The order of items within this list of items is the order that the items will appear in the left nav bar. Each item consists of the following tags: 
  - **link** is the name of the html/md file associated with this page.
  > Note: the '.html' extension must be specified and is used regardless of whether the page is an '.md' or a '.html' page.  Both will get converted to '.html' pages and this is what is being ref'd.
  - **title** is the title of the page itself and will appear both in the left nav bar and will also be combined with the menu title and used as the <title> in the <head> section of the page.
  - **isparent** with a value of 'true' is used if this is a parent menu item.
  - **ischild** with a value of 'true' is used if this is a child menu item.

> Only two levels of menus are supported. So no menuitem should ever have both a **isparent** and **ischild** tag. 