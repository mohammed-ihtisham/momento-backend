[@concept-background](../../templates/concept-background.md)
[@concept-state](../../background/detailed/concept-state.md)
[@concept-rubric](../../background/detailed/concept-rubric.md)
[@testing-concepts](../background/testing-concepts.md)
[@all-concepts](../application/all-concepts.md)
[@concept-design-brief](../background/concept-design-brief.md) 
[@concept-design-overview](../background/concept-design-overview.md) 
[@concept-specs](../background/concept-specifications.md)
[@app-overview](../application/app-overview.md)

# generate: concept Task spec
# response:

# concept: Task spec

**concept** Task \[User]

**purpose** define tasks that users can create and manage

**principle** If a user creates a task with a description, they can later retrieve, update, or delete that task.

**state**
  a set of Tasks
    a owner User
    a description String

**actions**

  createTask (owner: User, description: String): (task: Task)
    **requires** user exists; `description` is not empty.
    **effects** creates a new Task `t`; sets `owner` of `t` to `owner`; sets `description` of `t` to `description`; returns `t` as `task`.

  updateTaskDescription (task: Task, description: String): (task: Task)
    **requires** `task` exists.
    **effects** sets the `description` of `task` to `description`; returns `task`.

  deleteTask (task: Task)
    **requires** `task` exists.
    **effects** removes `task` from the set of Tasks.

**queries**

  \_getTask (task: Task): (owner: User, description: String)
    **requires** `task` exists.
    **effects** returns the `owner` and `description` of `task`.

  \_getTasks (owner: User): (task: Task, description: String)
    **requires** `owner` exists.
    **effects** returns all Tasks where `owner` is `owner`, each with its `description`.

