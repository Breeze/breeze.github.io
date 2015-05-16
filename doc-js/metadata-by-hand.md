---
layout: doc-js
---
#Metadata by hand#

Sometimes you can't generate Breeze metadata on the server or don't want to do so. This topic explains **how to write the metadata yourself on the client in JavaScript**.

#It's not hard

We know it seems daunting at first, especially if you've seen the server response from a metadata request. Perhaps you've examined the output from `entityManager.metadataStore.exportMetadata` or rooted around a `MetadataStore` in the debugger.

What you're seeing is a representation of metadata *meant for a machine* ... not for a human.  While it's sort of readable in JSON, no one would *want* to write that ... and **we don't expect you to write that**.

We'll show you how authoring metadata with the Breeze Labs *Metadata-Helper* can be easy and intuitive. 

<a name="metadataHelper"></a>
##Why use *Metadata-Helper*?

Breeze has [a native API for defining an `EntityType`](/sites/all/apidocs/classes/EntityType.html) and [adding it to a `MetadataStore`](/sites/all/apidocs/classes/MetadataStore.html#method_addEntityType). This API affords great control over every detail of metadata definition. You should learn it.

We recognize that it can seem a tad verbose and fussy. Sometimes you wish for something that was a bit friendlier and forgiving. That's why we offer the Breeze Labs <strong>Metadata-Helper</strong>.

The Metadata-Helper is a domain-specific language (DSL) that strives to minimize the information you have to provide when writing Breeze metadata. It relies on common conventions to make good guesses about the details of your model's types, properties and associations. If it guesses incorrectly about a particular point (or can't guess at all), you can configure that specific point explicitly using the core metadata API.

<p class="note">The Breeze Labs <strong><code>MetadataHelper</code></strong> extension is defined in <em>breeze.metadata-helper.js</em>. <a href="https://github.com/IdeaBlade/Breeze/blob/master/Breeze.Client/Scripts/Labs/breeze.metadata-helper.js" target="_blank"><strong>Download it from GitHub</strong></a> and install it on your page <em>after loading breeze</em>.<br/><br/>
It is also available as <a  href="https://www.nuget.org/packages/Breeze.Metadata.Helper/" target="_blank">a NuGet package</a>: <code>Install-Package Breeze.Metadata.Helper</code></p>

*In this topic*, we'll concentrate on *using the **Metadata-Helper** when it gets it right* ... which is most of the time. 

The related topic, [**"Metadata by hand (in depth)"**](metadata-hand-depth) delves into the details of how the helper works, how you can intervene, and how it all relates to the underlying metadata schema that Breeze uses at runtime. Visit that page when you're ready ... if you have to.

#Show me

The following simple example queries the github API for the members of the AngularJS team. The API developers didn't know about breeze and the API doesn't conform to OData. The response from a request for [github Members](https://developer.github.com/v3/orgs/members/) is an array of simple JSON objects with no type information. 

We can't change the github server to suit Breeze. If we want Breeze to treat these objects as cached entities, we'll have to create their metadata on the client ... which we do in the **`dataservice`** service defined in the *script.js* file. Check out the <em>README.md</em> file for more details. 

<p style="border: 1px solid lightblue; padding: 4px"><iframe allowfullscreen="allowfullscreen" frameborder="0" src="http://embed.plnkr.co/sTMzICATSG2cI1LPO1eG/preview" style="width: 100%; height: 300px"></iframe></p>

>This sample only works with modern browsers (IE10+, FF, Chrome).

#Go deeper

Let's look at the JavaScript metadata for the "Code Camper" model from John Papa's Plural Sight course, "[**Building Data-Centric Single Page Applications with Breeze**](http://www.pluralsight.com/courses/table-of-contents/building-single-page-applications-breeze)".

### The Model

The model has five entity types:

1. Session - a talk delivered at a code camp or a technical conference
1. Person - a person who attends the code camp
1. Room - where the talk is delivered
1. TimeSlot - session time slots in the conference schedule with start and duration
1. Track - a conference track such as "JavaScript", "Data",  "Cloud", "Mobile"

These entities are related. A *Session* has a *Room*, *TimeSlot*, *Track*, and a *Speaker* (a *Person* who delivers the talk).  You should be able to write `session.room`, `session.track`, `session.speaker`, etc.

A *Speaker* may give more than one talk so the *Person* type has a collection of one or more *Sessions* which you access by writing `person.speakerSessions`.

### What you write
Here is the metadata you might write to describe that model. 

>This code extract comes from a [test helper file in the DocCode sample](https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode/tests/helpers/ccjs.model.metadata.js). See related tests in [*metadataOnClientTests.js*](https://github.com/Breeze/breeze.js.samples/blob/master/net/DocCode/DocCode/tests/metadataOnClientTests.js).
>
>You see these tests [running live in this plunker](http://embed.plnkr.co/A1vPWiMtGJy35MTzPuSb/preview). Feel free to explore these metadata further by adding your own tests right there in plunker.

<p class='note'>Remember to install and enable the Breeze Labs <a href="#metadataHelper"><strong><code>MetadataHelper</code></strong></a>.</p>

    function fillMetadataStore(store) {

        // Metadata-Helper instance configured with default namespace and key generator for this model
        var helper = new breeze.config.MetadataHelper( 'CC.Model', breeze.AutoGeneratedKeyType.Identity);

        // DataTypes
        var DT = breeze.DataType;
        var BOOL = DT.Boolean;
        var DATE = DT.DateTime;
        var ID = DT.Int32;

        // type order is irrelevant
        addPerson();
        addSession();
        addRoom();
        addTimeSlot();
        addTrack();

        // addType - make it easy to add the type to the store using the helper
        function addType(type) {
            helper.addTypeToStore(store, type);
        };

        function addPerson() {
            addType({
                name: 'Person',
                dataProperties: {
                    id: { type: ID },
                    firstName: { max: 50, required: true },
                    lastName: { max: 50, required: true },
                    // could add validators here; let model.validation add them
                    email: { max: 400 },
                    blog: { max: 400 },
                    twitter: { max: 400 },
                    gender: { max: 1 },
                    imageSource: { max: 400 },

                    // could let Breeze add unmapped but we do so to lock in the Boolean data type
                    isPartial: { type: BOOL, required: true, isUnmapped: true },
                    isSpeaker: { type: BOOL, required: true, isUnmapped: true }
                },

                navigationProperties: {
                    speakerSessions: { type: 'Session', hasMany: true }
                }
            });
        }

        function addSession() {
            addType({
                name: 'Session',
                dataProperties: {
                    id: { type: ID },
                    title: { max: 50, required: true },
                    code: { max: 10 },
                    description: { max: 4000 },
                    level: { max: 30 },
                    tags: { max: 4000 },

                    roomId: { type: ID, required: true },
                    speakerId: { type: ID, required: true },
                    timeSlotId: { type: ID, required: true },
                    trackId: { type: ID, required: true },

                    isPartial: { type: BOOL, required: true, isUnmapped: true }
                },

                // Let model.validation add the requireReferenceEntity validators
                navigationProperties: {
                    room: 'Room',
                    speaker: 'Person',
                    timeSlot: 'TimeSlot',
                    track: 'Track'
                }

            });
        }

        function addRoom() {
            addType({
                name: 'Room',
                dataProperties: {
                    id: { type: ID },
                    name: { max: 50, required: true }
                }
            });
        }

        function addTimeSlot() {
            addType({
                name: 'TimeSlot',
                dataProperties: {
                    id: { type: ID },
                    start: { type: DATE, required: true },
                    isSessionSlot: { type: BOOL, required: true },
                    duration: { type: ID, required: true }
                }
            });
        }

        function addTrack() {
            addType({
                name: 'Track',
                dataProperties: {
                    id: { type: ID },
                    name: { max: 50, required: true }
                }
            });
        }
    }

##Next steps

Now you're ready for a more complex, multiple entity, live code example <a href="http://plnkr.co/edit/G4gOH68iKLobAumoEsXx?p=info" target="_blank"><em><strong>in this plunker</em></strong></a>.  Look in particular at the *metadataFactory.js* script.
