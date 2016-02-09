---
layout: doc-cool-breezes
redirect_from: "/old/documentation/presenting-many-many.html"
---
# Presenting a Many-to-Many association with Checkboxes in Breeze and Angular

It is surprisingly difficult to write an intuitive UI with which
a user can maintain many-to-many associations. This "Cool Breeze" describes one way to do it ... with a live code example (see <a href="#livecode">below</a>)

![Many-to-Many CheckBoxes in Breeze and Angular](/images/ManyToManyCheckboxes.png)

Breeze does not (yet) 
directly support a many-to-many association between two EntityTypes. 
Breeze requires an explicit "map entity" to join the two. 
The "map entity" holds a one-to-many relationship to each entity 
and can also hold an (optional) payload with properties such as 
`isActive` or `mappingCreateDate`.

The implementation of the mapping, whether implicitly or through a "map entity", is besides the point we're making here.
The essential quandry is how to present *all the available mappings* so the user
can pick which ones to keep and which to discard.

We can't simply present the existing mapping entities (the `HeroPowerMap` entities)
with checkboxes in front of them
because these entities only represent the powers that *the hero already has*.
We need a check list of *all available powers*, not just the hero's current powers.

## Example
In the live code example, an AngularJS UI presents one entity (the "hero") and all possible
related mappings to the other type (the "super powers" that a "hero" can have)
as a collection of checkboxes. The user adds and removes "super power" mappings by checking the checkboxes.

Rather than repeat the details, we refer you to the [***readme.md*** on plunker](http://plnkr.co/edit/G4gOH68iKLobAumoEsXx?p=info).

<a name="livecode"></a>
## Live Code
<p class="note">The following live code only works with modern browsers (IE10+, FF, Chrome).</p>

<p style="border: 1px solid lightblue; padding: 4px"><iframe allowfullscreen="allowfullscreen" frameborder="0" src="http://embed.plnkr.co/G4gOH68iKLobAumoEsXx/preview" style="width: 100%; height: 600px"></iframe></p>