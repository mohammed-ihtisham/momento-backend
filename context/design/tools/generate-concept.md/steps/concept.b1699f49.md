---
timestamp: 'Sun Nov 23 2025 14:22:01 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_142201.2aecaa51.md]]'
content_id: b1699f4940595a4bb766f928a58e61a48ca464001ae56508d89b2c7724c03624
---

# concept: Notes \[Item, User]

**purpose**: to enable users to create, store, and manage textual notes associated with arbitrary items.

**principle**: after creating a note for an item, the user can retrieve it, update its content, and eventually delete it, thereby maintaining a coherent set of personal annotations.

**state**
a set of Notes with
an item Item
a creator User
a content String
a createdAt Date
a updatedAt Date

**actions**
createNote (item: Item, creator: User, content: String): (note: Note)
**requires** `item` and `creator` are valid IDs. `content` is not empty.
**effects** creates a new `Note` entity; associates it with `item` and `creator`; sets `content`, `createdAt`, and `updatedAt`; returns the new `note`.

getNote (note: Note): (item: Item, creator: User, content: String, createdAt: Date, updatedAt: Date)
**requires** `note` exists.
**effects** returns the details of the specified `note`.

updateNote (note: Note, content: String): (note: Note)
**requires** `note` exists. `content` is not empty.
**effects** updates the `content` and `updatedAt` of the `note`; returns the updated `note`.

deleteNote (note: Note): Empty
**requires** `note` exists.
**effects** deletes the `note` and all its associated data.

**queries**
\_getNotesByItem (item: Item): (notes: {note: Note, creator: User, content: String, createdAt: Date, updatedAt: Date}\[])
**requires** `item` is a valid ID.
**effects** returns a list of all notes associated with `item`, including their details.

\_getNotesByCreator (creator: User): (notes: {note: Note, item: Item, content: String, createdAt: Date, updatedAt: Date}\[])
**requires** `creator` is a valid ID.
**effects** returns a list of all notes created by `creator`, including their details.

***
