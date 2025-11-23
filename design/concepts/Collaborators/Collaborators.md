[@concept-background](../../templates/concept-background.md)
[@concept-state](../../background/detailed/concept-state.md)
[@concept-rubric](../../background/detailed/concept-rubric.md)
[@testing-concepts](../background/testing-concepts.md)
[@all-concepts](../application/all-concepts.md)
[@concept-design-brief](../background/concept-design-brief.md) 
[@concept-design-overview](../background/concept-design-overview.md) 
[@concept-specs](../background/concept-specifications.md)
[@app-overview](../application/app-overview.md)

# generate: concept Collaborators spec 

# response:

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