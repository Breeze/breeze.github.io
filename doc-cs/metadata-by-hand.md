---
layout: doc-cs
redirect_from: "/old/breeze-sharp-documentation/metadata-hand.html"
---

#Metadata by hand#
Sometimes you can't generate Breeze metadata or don't want to do so. This topic explains **how to extend the metadata yourself in .NET on the client**.

#It's not hard

We know it seems daunting at first, especially if you've seen the server response from a metadata request. Perhaps you've examined the output from `MetadataStore.ExportMetadata` or rooted around a `MetadataStore` in the debugger.

What you're seeing is a representation of metadata *meant for a machine* ... not for a human.  While it's sort of readable in JSON, no one would *want* to write that ... and **we don't expect you to write that**.

Most of the metadata in Breeze.Sharp is available simply by virtue of having your Entity and ComplexObject classes defined so that Breeze can reflect over them.

However, relationships between entity types and certain validation rules will still need to be specified.

We'll show you how the *EntityTypeBuilder* can make describing this metadata easy and intuitive. 

### The Model

> The model we are using in from the "Code Camper" model from John Papa's Plural Sight course, "Building Data-Centric Single Page Applications with Breeze". ( This is Breeze.Js course but any Breeze server works with any Breeze client - so we will use this same model for Breeze.Sharp.)

The model has five entity types:

1. Session - a talk delivered at a code camp or a technical conference
1. Person - a person who attends the code camp
1. Room - where the talk is delivered
1. TimeSlot - session time slots in the conference schedule with start and duration
1. Track - a conference track such as "JavaScript", "Data",  "Cloud", "Mobile"

These entities are related. A *Session* has a *Room*, *TimeSlot*, *Track*, and a *Speaker* (a *Person* who delivers the talk).  You should be able to write `session.Room`, `session.Track`, `session.Speaker`, etc.

A *Speaker* may give more than one talk so the *Person* type has a collection of one or more *Sessions* which you access by writing `person.SpeakerSessions`.

### What you write

#### The basic entity model CLR types
 
Here are the CLR types you might write to describe that model.

    

      public class Person : BaseEntity {
        public Int32 Id {
          get { return GetValue<Int32>(); }
          set { SetValue(value); }
        }
        public String FirstName {
          get { return GetValue<String>(); }
          set { SetValue(value); }
        }
        public String LastName {
          get { return GetValue<String>(); }
          set { SetValue(value); }
        }
        public String Email {
          get { return GetValue<String>(); }
          set { SetValue(value); }
        }
        public String Blog {
          get { return GetValue<String>(); }
          set { SetValue(value); }
        }
        public String Twitter {
          get { return GetValue<String>(); }
          set { SetValue(value); }
        }
        public String Gender {
          get { return GetValue<String>(); }
          set { SetValue(value); }
        }
        public String ImageSource {
          get { return GetValue<String>(); }
          set { SetValue(value); }
        }
        public NavigationSet<Session> SpeakerSessions {
          get { return GetValue<NavigationSet<Session>>(); }
          set { SetValue(value); }
        }
      }
      
      public class Session : BaseEntity {
        public Int32 Id {
          get { return GetValue<Int32>(); }
          set { SetValue(value); }
        }
        public String Title {
          get { return GetValue<String>(); }
          set { SetValue(value); }
        }
        public String Code {
          get { return GetValue<String>(); }
          set { SetValue(value); }
        }
        public String Description {
          get { return GetValue<String>(); }
          set { SetValue(value); }
        }
        public String Level {
          get { return GetValue<String>(); }
          set { SetValue(value); }
        }
        public String Tags {
          get { return GetValue<String>(); }
          set { SetValue(value); }
        }
        public Int32 RoomId {
          get { return GetValue<Int32>(); }
          set { SetValue(value); }
        }
        public Int32 SpeakerId {
          get { return GetValue<Int32>(); }
          set { SetValue(value); }
        }
        public Int32 TimeSlotId {
          get { return GetValue<Int32>(); }
          set { SetValue(value); }
        }
        public Int32 TrackId {
          get { return GetValue<Int32>(); }
          set { SetValue(value); }
        }
        public Room Room {
          get { return GetValue<Room>(); }
          set { SetValue(value); }
        }
        public Person Speaker {
          get { return GetValue<Person>(); }
          set { SetValue(value); }
        }
        public TimeSlot TimeSlot {
          get { return GetValue<TimeSlot>(); }
          set { SetValue(value); }
        }
        public Track Track {
          get { return GetValue<Track>(); }
          set { SetValue(value); }
        }
      }
    
      public class Room : BaseEntity {
        public Int32 Id {
          get { return GetValue<Int32>(); }
          set { SetValue(value); }
        }
        public String Name {
          get { return GetValue<String>(); }
          set { SetValue(value); }
        }
      }
    
      public class TimeSlot : BaseEntity {
        public Int32 Id {
          get { return GetValue<Int32>(); }
          set { SetValue(value); }
        }
        public DateTime Start {
          get { return GetValue<DateTime>(); }
          set { SetValue(value); }
        }
        public bool IsSessionSlot {
          get { return GetValue<bool>(); }
          set { SetValue(value); }
        }
        public Int32 Duration {
          get { return GetValue<Int32>(); }
          set { SetValue(value); }
        }
      }
    
      public class Track : BaseEntity {
        public Int32 Id {
          get { return GetValue<Int32>(); }
          set { SetValue(value); }
        }
        public String Name {
          get { return GetValue<String>(); }
          set { SetValue(value); }
        }
      }
    
### Define keys and the relationships between objects including foreign keys

You will need to define the key properties for each type and the relationships between them.  This is usually done in a single method that will only get called once.

    var personBuilder = new EntityTypeBuilder<Person>(myMetadataStore);
    personBuilder.DataProperty(person => person.Id).IsPartOfKey();
    
    var sessionBuilder = new EntityTypeBuilder<Session>(myMetadataStore);
    sessionBuilder.DataProperty(session => session.Id).IsPartOfKey().IsAutoIncrementing();
    sessionBuilder.NavigationProperty(session => session.Room)
        .HasForeignKey(session => session.RoomId);
    sessionBuilder.NavigationProperty(session => session.TimeSlot)
        .HasForeignKey(session => session.TimeSlotId);
    sessionBuilder.NavigationProperty(session => session.Track)
        .HasForeignKey(session => session.TrackId);
    sessionBuilder.NavigationProperty(session => session.Speaker)
        .HasForeignKey(session => session.SpeakerId)
        .HasInverse(speaker => speaker.SpeakerSessions);
    
    var roomBuilder = new EntityTypeBuilder<Room>(myMetadataStore);
    roomBuilder.DataProperty(room => room.Id).IsPartOfKey().IsAutoIncrementing();
    
    var timeSlotBuilder = new EntityTypeBuilder<TimeSlot>(myMetadataStore);
    timeSlotBuilder.DataProperty(timeSlot => timeSlot.Id).IsPartOfKey().IsAutoIncrementing();
    
    var trackBuilder = new EntityTypeBuilder<Track>(myMetadataStore);
    timeSlotBuilder.DataProperty(track => track.Id).IsPartOfKey().IsAutoIncrementing();

### Define constraints and validations

Then you can define any constraints and validations

    personBuilder.DataProperty(person => person.FirstName).IsRequired().MaxLength(50);
    personBuilder.DataProperty(person => person.LastName).IsRequired().MaxLength(50);
    
    sessionBuilder.DataProperty(session => session.TrackId).IsRequired();
    sessionBuilder.DataProperty(session => session.RoomId).IsRequired();
    sessionBuilder.DataProperty(session => session.SpeakerId).IsRequired();
    sessionBuilder.DataProperty(session => session.RoomId).IsRequired();
    
    sessionBuilder.DataProperty(session => session.Title).IsRequired().MaxLength(50);
    sessionBuilder.DataProperty(session => session.Description).MaxLength(4000);
      
    // . . .    

>  Eventually Breeze.Sharp will also support DataAnnotation attributes for [Required], [MaxLength] and a few others.