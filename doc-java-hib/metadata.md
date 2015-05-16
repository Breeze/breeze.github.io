---
layout: doc-java-hib
---

## HibernateMetadata extends Metadata

The Breeze client requires metadata about the domain model in order to entities manage entities.  The HibernateSaveProcessor also requires metadata to convert foreign keys into navigation properties for related entities.  Metadata for both of these purposes is provided by the `Metadata` class and in particular its specialized  HibernateMetadata subclass.

The HibernateMetadata class uses Hibernate's Metadata API to get information about entity mappings
and relationships.  This information should be consistent whether mapping is done using .hbm.xml files, annotations, or programatically.  

The HibernateMetadata class requires the Hibernate SessionFactory and the Configuration.  Depending upon the Hibernate version, the Configuration may be accessible from the SessionFactory itself; then you can use the constructor

	public HibernateMetadata(SessionFactory sessionFactory)

Otherwise, you will need to provide the Configuration:

	public HibernateMetadata(SessionFactory sessionFactory, Configuration configuration)

Calling the *build* method then populates the new instance.

If you're using [Spring Framework](http://projects.spring.io/spring-framework/), you may need to follow [this advice](http://stackoverflow.com/questions/2736100/how-can-i-get-the-hibernate-configuration-object-from-spring) to get the Configuration.

Building the Metadata is a relatively expensive operation, and metadata doesn't change during the run time of the app.  The result should be cached and used for all subsequent requests.

