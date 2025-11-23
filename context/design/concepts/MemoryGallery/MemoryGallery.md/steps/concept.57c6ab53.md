---
timestamp: 'Sun Nov 23 2025 14:50:27 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_145027.caff3fd4.md]]'
content_id: 57c6ab532e8350e50d9c3bd46e1d58105fcc27dd08499dffb7ac70b2f084bb06
---

# concept: MemoryGallery spec

**concept** MemoryGallery \[User, Relationship]

**purpose** store a list of images associated with relationships the user has

**principle** If a user adds an image associated with a relationship, it is stored in their gallery. The user can view all their images, filter by relationship, and remove images from their gallery.

**state**
a set of Images
a owner User
a relationship Relationship
a imageUrl String
a uploadDate Date

**actions**

addImage (owner: User, relationship: Relationship, imageUrl: String): (uploadDate: Date)
**requires** user exists; relationship exists; imageUrl is not empty; imageUrl is not already in the gallery.
**effects** creates a new Image entry `i`; sets `owner` of `i` to `owner`; sets `relationship` of `i` to `relationship`; sets `imageUrl` of `i` to `imageUrl`; sets `uploadDate` of `i` to current time; returns `uploadDate`.

removeImage (owner: User, imageUrl: String)
**requires** user exists; an Image with `imageUrl` exists; the `owner` of that Image is `owner`.
**effects** deletes the Image with the given `imageUrl` from the gallery.

**queries**

\_getImages (owner: User): (imageUrl: String, relationship: Relationship, uploadDate: Date)
**requires** user exists.
**effects** returns all images where `owner` is `owner`, along with their associated `relationship` and `uploadDate`.

\_getImagesByRelationship (owner: User, relationship: Relationship): (imageUrl: String, uploadDate: Date)
**requires** user exists; relationship exists.
**effects** returns all images where `owner` is `owner` and `relationship` is `relationship`, along with their `uploadDate`.
