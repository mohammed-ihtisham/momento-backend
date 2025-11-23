---
timestamp: 'Sun Nov 23 2025 15:09:13 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_150913.81564984.md]]'
content_id: 06478c2394199ed1565c3e392dddcc8028cedda34f9f84821f7e9abfb55f8354
---

# concept: Relationship spec

**concept** Relationship \[User]

**purpose** track the people that a user cares about by attributing a relationship type to each person

**principle** If a user creates a relationship with a person by providing a name and relationship type, they can later retrieve and manage that relationship.

**state**
a set of Relationships
a owner User
a name String
a relationshipType String

**actions**

createRelationship (owner: User, name: String, relationshipType: String): (relationship: Relationship)
**requires** user exists; `name` is not empty; `relationshipType` is not empty; no Relationship owned by `owner` already has `name`.
**effects** creates a new Relationship `r`; sets `owner` of `r` to `owner`; sets `name` of `r` to `name`; sets `relationshipType` of `r` to `relationshipType`; returns `r` as `relationship`.

updateRelationship (relationship: Relationship, name?: String, relationshipType?: String): (relationship: Relationship)
**requires** `relationship` exists; at least one of `name` or `relationshipType` is provided; if `name` is provided, no other Relationship owned by the same `owner` already has `name`.
**effects** updates the specified properties (`name`, `relationshipType`) of `relationship`; returns `relationship`.

deleteRelationship (relationship: Relationship)
**requires** `relationship` exists.
**effects** removes `relationship` from the set of Relationships.

**queries**

\_getRelationship (relationship: Relationship): (owner: User, name: String, relationshipType: String)
**requires** `relationship` exists.
**effects** returns the `owner`, `name`, and `relationshipType` of `relationship`.

\_getRelationships (owner: User): (relationship: Relationship, name: String, relationshipType: String)
**requires** `owner` exists.
**effects** returns a set of all Relationships owned by `owner`, each with its `name` and `relationshipType`.

\_getRelationshipByName (owner: User, name: String): (relationship: Relationship, relationshipType: String)
**requires** `owner` exists; `name` is not empty; a Relationship owned by `owner` with `name` exists.
**effects** returns the Relationship owned by `owner` with `name`, and its `relationshipType`.
