---
timestamp: 'Sun Nov 23 2025 14:30:24 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_143024.f1cb3047.md]]'
content_id: c8346f5cdf3854b4a1f743b24647b52d587d19172524e0186824800d801083b4
---

# concept: Collaborators spec

**concept** Collaborators \[User, Target]

**purpose** enable multiple users to work together on a shared resource with defined roles

**principle** If a user creates a resource and then adds other users as collaborators with specific roles, those collaborators gain the ability to perform actions on the resource consistent with their assigned roles. The creator can subsequently modify these roles or remove collaborators, immediately updating their access.

**state**
a set of Collaborations with
a user User
a target Target
a role String // e.g., "owner", "editor", "viewer"

**actions**

addCollaborator (target: Target, user: User, role: String): (collaboration: Collaboration)
**requires** target exists; user exists; no existing collaboration for (target, user); role is valid (e.g., "owner", "editor", "viewer").
**effects** a new Collaboration record is created for (target, user) with the specified `role`; the identifier of this new collaboration is returned as `collaboration`.

removeCollaborator (target: Target, user: User)
**requires** target exists; user exists; an existing collaboration for (target, user) exists.
**effects** the Collaboration record for (target, user) is deleted.

updateCollaboratorRole (target: Target, user: User, newRole: String)
**requires** target exists; user exists; an existing collaboration for (target, user) exists; `newRole` is valid and different from the current role.
**effects** the role of the Collaboration record for (target, user) is updated to `newRole`.

**queries**

\_getCollaborators (target: Target): (user: User, role: String)
**requires** target exists
**effects** returns the set of (user, role) pairs for all collaborators associated with the given `target`.

\_getCollaboratorRole (target: Target, user: User): (role: String)
**requires** target exists; user exists; an existing collaboration for (target, user) exists.
**effects** returns the `role` of the specified `user` on the given `target`.

\_hasRole (target: Target, user: User, role: String): (hasRole: Boolean)
**requires** target exists; user exists; role is valid.
**effects** returns `true` if the `user` has the specified `role` on the `target`, `false` otherwise.
