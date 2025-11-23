[@concept-background](../../templates/concept-background.md)
[@concept-state](../../background/detailed/concept-state.md)
[@concept-rubric](../../background/detailed/concept-rubric.md)
[@testing-concepts](../background/testing-concepts.md)
[@all-concepts](../application/all-concepts.md)
[@concept-design-brief](../background/concept-design-brief.md) 
[@concept-design-overview](../background/concept-design-overview.md) 
[@concept-specs](../background/concept-specifications.md)
[@app-overview](../application/app-overview.md)

# generate: concept TaskChecklist spec
# response:

# concept: TaskChecklist spec

**concept** TaskChecklist \[User, Task]

**purpose** track and manage the completion status of tasks in a checklist

**principle** If a user adds tasks to a checklist and marks them as complete, the checklist reflects the completion status of all tasks, indicating overall readiness.

**state**
  a set of ChecklistEntries
    a owner User
    a task Task
    a completed Boolean

**actions**

  addTask (owner: User, task: Task): (entry: ChecklistEntry)
    **requires** user exists; task exists; no ChecklistEntry for `owner` and `task` already exists.
    **effects** creates a new ChecklistEntry `e`; sets `owner` of `e` to `owner`; sets `task` of `e` to `task`; sets `completed` of `e` to `false`; returns `e` as `entry`.

  removeTask (owner: User, task: Task)
    **requires** user exists; task exists; a ChecklistEntry for `owner` and `task` exists.
    **effects** removes the ChecklistEntry for `owner` and `task`.

  markComplete (owner: User, task: Task)
    **requires** user exists; task exists; a ChecklistEntry for `owner` and `task` exists.
    **effects** sets `completed` of the ChecklistEntry for `owner` and `task` to `true`.

  markIncomplete (owner: User, task: Task)
    **requires** user exists; task exists; a ChecklistEntry for `owner` and `task` exists.
    **effects** sets `completed` of the ChecklistEntry for `owner` and `task` to `false`.

**queries**

  \_getChecklistEntry (owner: User, task: Task): (completed: Boolean)
    **requires** user exists; task exists; a ChecklistEntry for `owner` and `task` exists.
    **effects** returns the `completed` status for the ChecklistEntry.

  \_getChecklist (owner: User): (task: Task, completed: Boolean)
    **requires** user exists.
    **effects** returns all ChecklistEntries where `owner` is `owner`, each with its `task` and `completed` status.

  \_getCompletedTasks (owner: User): (task: Task)
    **requires** user exists.
    **effects** returns all tasks where `owner` is `owner` and `completed` is `true`.

  \_getIncompleteTasks (owner: User): (task: Task)
    **requires** user exists.
    **effects** returns all tasks where `owner` is `owner` and `completed` is `false`.
