---
timestamp: 'Sun Nov 23 2025 14:38:20 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_143820.1a516bd5.md]]'
content_id: f4abccd785fcdfdcd75fbf77236438ca948754d4dd7ac848f6a02cf1b29aefe2
---

# generate: concept MemoryGallery spec

```concept
concept MemoryGallery [User, Memory]

purpose store, organize, view, and share personal memories

principle If a user uploads a memory, they can then view it in their gallery, organize it into albums, and share it with other users who can also view it.

state
  a set of Albums
    a name String
    a description String?
    a owner User

  a set of Memories
    a owner User
    a uploadDate Date
    a title String?
    a description String?

  a relationship albumContains between Albums and Memories

  a relationship memorySharedWith between Memories and Users
  a relationship albumSharedWith between Albums and Users

actions
  uploadMemory (owner: User, memory: Memory, title: String?, description: String?): (uploadDate: Date)
    requires true
    effects creates a new Memory entry `m` for `memory`; sets `owner` of `m` to `owner`; sets `title` and `description` of `m` if provided; sets `uploadDate` of `m` to current time; returns `uploadDate`

  deleteMemory (owner: User, memory: Memory)
    requires the `owner` of `memory` is `owner`
    effects deletes `memory` and all its associations (from albums and sharedWith relationships)

  updateMemoryMetadata (owner: User, memory: Memory, title: String?, description: String?)
    requires the `owner` of `memory` is `owner`
    effects updates the `title` and/or `description` of `memory`

  createAlbum (owner: User, name: String, description: String?): (album: Album)
    requires no Album with the given `name` already exists for `owner`
    effects creates a new Album `a`; sets `name` of `a` to `name`; sets `description` of `a` if provided; sets `owner` of `a` to `owner`; returns `a`

  deleteAlbum (owner: User, album: Album)
    requires the `owner` of `album` is `owner`
    effects deletes `album` and all its associations (contained memories and sharedWith relationships)

  updateAlbumMetadata (owner: User, album: Album, name: String?, description: String?)
    requires the `owner` of `album` is `owner`
    effects updates the `name` and/or `description` of `album`

  addMemoryToAlbum (owner: User, memory: Memory, album: Album)
    requires the `owner` of `memory` is `owner` AND the `owner` of `album` is `owner` AND `memory` is not already in `album`
    effects adds `memory` to `album` in the `albumContains` relationship

  removeMemoryFromAlbum (owner: User, memory: Memory, album: Album)
    requires the `owner` of `memory` is `owner` AND the `owner` of `album` is `owner` AND `memory` is in `album`
    effects removes `memory` from `album` in the `albumContains` relationship

  shareMemory (owner: User, memory: Memory, recipient: User)
    requires the `owner` of `memory` is `owner` AND `memory` is not already shared with `recipient`
    effects adds a `memorySharedWith` relationship between `memory` and `recipient`

  unshareMemory (owner: User, memory: Memory, recipient: User)
    requires the `owner` of `memory` is `owner` AND `memory` is shared with `recipient`
    effects removes the `memorySharedWith` relationship between `memory` and `recipient`

  shareAlbum (owner: User, album: Album, recipient: User)
    requires the `owner` of `album` is `owner` AND `album` is not already shared with `recipient`
    effects adds an `albumSharedWith` relationship between `album` and `recipient`

  unshareAlbum (owner: User, album: Album, recipient: User)
    requires the `owner` of `album` is `owner` AND `album` is shared with `recipient`
    effects removes the `albumSharedWith` relationship between `album` and `recipient`

queries
  _getMemoriesByOwner (requester: User): (memory: Memory, title: String?, description: String?, uploadDate: Date)
    requires true
    effects returns all memories where `owner` is `requester`

  _getAlbumsByOwner (requester: User): (album: Album, name: String, description: String?)
    requires true
    effects returns all albums where `owner` is `requester`

  _getMemoriesInAlbum (album: Album, requester: User): (memory: Memory, title: String?, description: String?, uploadDate: Date)
    requires the `owner` of `album` is `requester` OR `album` is shared with `requester`
    effects returns all memories contained in `album`

  _getSharedMemories (requester: User): (memory: Memory, owner: User, title: String?, description: String?, uploadDate: Date)
    requires true
    effects returns all memories where `memorySharedWith` includes `requester`

  _getSharedAlbums (requester: User): (album: Album, owner: User, name: String, description: String?)
    requires true
    effects returns all albums where `albumSharedWith` includes `requester`

  _getMemoryDetails (memory: Memory, requester: User): (owner: User, title: String?, description: String?, uploadDate: Date)
    requires the `owner` of `memory` is `requester` OR `memory` is shared with `requester` OR `requester` has access to an album containing `memory` which is shared with them
    effects returns the `owner`, `title`, `description`, and `uploadDate` of `memory`
```
