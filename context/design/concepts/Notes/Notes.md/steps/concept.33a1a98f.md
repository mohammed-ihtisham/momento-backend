---
timestamp: 'Sun Nov 23 2025 14:56:09 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_145609.425d29cd.md]]'
content_id: 33a1a98ff6b08889359c9b7e4e74711f0b89d413d0ddd05caff039b29db248dc
---

# concept: Notes spec

**concept** Notes \[User, Relationship]

**purpose** allow users to store, organize, and retrieve textual information associated with relationships

**principle** If a user creates a note with a title and content associated with a relationship, they can later retrieve that note by its title, filter by relationship, and update its content.

**state**
a set of Notes
a owner User
a relationship Relationship
a title String
a content String

**actions**

createNote (owner: User, relationship: Relationship, title: String, content: String): (note: Note)
**requires** user exists; relationship exists; no Note owned by `owner` for the same `relationship` already has `title`.
**effects** creates a new Note `n`; sets `owner` of `n` to `owner`; sets `relationship` of `n` to `relationship`; sets `title` of `n` to `title`; sets `content` of `n` to `content`; returns `n` as `note`.

updateNote (note: Note, title: String?, content: String?): (note: Note)
**requires** `note` exists; if `title` is provided, no other Note owned by `note`'s `owner` for the same `relationship` has the new `title`; at least one of `title` or `content` is provided.
**effects** if `title` is provided, sets `title` of `note` to `title`; if `content` is provided, sets `content` of `note` to `content`; returns `note`.

deleteNote (note: Note)
**requires** `note` exists.
**effects** removes `note` from the set of Notes.

**queries**

\_getNote (note: Note): (owner: User, relationship: Relationship, title: String, content: String)
**requires** `note` exists.
**effects** returns `owner` of `note`, `relationship` of `note`, `title` of `note`, and `content` of `note`.

\_getNotes (owner: User): (note: Note, relationship: Relationship, title: String, content: String)
**requires** `owner` exists.
**effects** returns set of all `note`s owned by `owner`, each with its `relationship`, `title`, and `content`.

\_getNotesByRelationship (owner: User, relationship: Relationship): (note: Note, title: String, content: String)
**requires** `owner` exists; relationship exists.
**effects** returns set of all `note`s owned by `owner` for the given `relationship`, each with its `title` and `content`.

\_getNoteByTitle (owner: User, relationship: Relationship, title: String): (note: Note, content: String)
**requires** `owner` exists; relationship exists; a `note` exists for `owner` with `relationship` and `title`.
**effects** returns the `note` owned by `owner` with `relationship` and `title`, and its `content`.
