---
timestamp: 'Sun Nov 23 2025 14:53:30 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_145330.79cfaf65.md]]'
content_id: 24696abe43f1e64d5fd69231900bfdab0105eef4d4d2abc337dea2042f373116
---

# concept: Notes spec

```concept
concept Notes [User]

purpose allow users to store, organize, and retrieve textual information

principle if a user creates a note with a title and content, they can later retrieve that note by its title and update its content

state
  a set of Notes with
    an owner User
    a title String
    a content String

actions
  createNote (owner: User, title: String, content: String): (note: Note)
    requires no Note owned by `owner` already has `title`
    effects creates a new Note `n`; sets `owner` of `n` to `owner`; sets `title` of `n` to `title`; sets `content` of `n` to `content`; returns `n` as `note`

  updateNote (note: Note, title: String?, content: String?): (note: Note)
    requires `note` exists; if `title` is provided, no other Note owned by `note`'s `owner` has the new `title`; at least one of `title` or `content` is provided
    effects if `title` is provided, sets `title` of `note` to `title`; if `content` is provided, sets `content` of `note` to `content`; returns `note`

  deleteNote (note: Note)
    requires `note` exists
    effects removes `note` from the set of Notes

queries
  _getNote (note: Note) : (owner: User, title: String, content: String)
    requires `note` exists
    effects returns `owner` of `note`, `title` of `note`, `content` of `note`

  _getNotesByOwner (owner: User) : (note: Note, title: String, content: String)
    requires `owner` exists
    effects returns set of all `note`s owned by `owner`, each with its `title` and `content`

  _getNoteByTitle (owner: User, title: String) : (note: Note, content: String)
    requires `owner` exists; a `note` exists for `owner` with `title`
    effects returns the `note` owned by `owner` with `title`, and its `content`
```
