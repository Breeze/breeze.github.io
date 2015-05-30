# How to author here

> This website is hosted on GitHub and uses Jekyl and Liquid markdown.

## Directory Organization 

- Directories starting with 'doc-' are the actual pages that will appear on the site
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

- Jekyl 'reserved' directories ( named per Jekyl)
  - **_data** - contains 'custom' metadata for this site.  In our case, the menu structures are defined here ( described later)
  - **_layouts** - every page on the site ( pages in one of the 'doc-' directories) has a corresponding layout. 
  - **_includes** - html fragments that are shared across possibly multiple pages.
    > This includes our standard header, footer, search dialog and leftNav bar.
  - **site** - This directory will only appear if you run Jekyl locally and consists of the generated website.  
    > This directory should never be checked in and you should NEVER edit in here directly; your changes will be lost. 
  
- Helper directories
  - **js** - all javascript files used on the site
  - **styles** - all css files used on the site
  - **images** - all images used on the site. - There are two subdirs here that should be used for specific purposes    
      - **samples** - any image used exclusively for a sample's documentation
      - **logos** - all 3rd party logos go here.  
  - **downloads** - any loose files that may be downloaded in raw form via a link. 

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