---
timestamp: 'Sun Nov 23 2025 14:37:35 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_143735.2c1eefd7.md]]'
content_id: 755ae8ea86183d744a494ec539bb774785d786588d2b536d7b7dfb92ff00f3fa
---

# concept: Collaborators spec

**concept** Collaborators \[User]

**purpose** maintain a list of people working on a project

**principle** If a user adds other users as collaborators, those users are added to the list of people working on the project. Collaborators can subsequently be removed from the list, immediately updating the project's collaborator set.

**state**
a set of Users

**actions**

addCollaborator (user: User)
**requires** user exists; user is not already a collaborator.
**effects** the `user` is added to the set of collaborators.

removeCollaborator (user: User)
**requires** user exists; user is currently a collaborator.
**effects** the `user` is removed from the set of collaborators.

**queries**

\_getCollaborators (): (user: User)
**requires** none
**effects** returns the set of all users who are collaborators.

\_hasCollaborator (user: User): (hasCollaborator: Boolean)
**requires** user exists.
**effects** returns `true` if the `user` is a collaborator, `false` otherwise.
