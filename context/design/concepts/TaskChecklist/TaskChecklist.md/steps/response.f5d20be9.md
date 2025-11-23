---
timestamp: 'Sun Nov 23 2025 15:16:20 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_151620.7509d2f3.md]]'
content_id: f5d20be9c6ee2caf11590e293af55bd85fe5b1e346359e18547949cdce60e868
---

# response:

```concept
concept TaskChecklist [Task]

purpose enable users to track and manage the completion status of a defined set of tasks

principle if a user adds several tasks to a checklist and then marks each task as complete, the checklist will reflect all tasks as completed, indicating overall readiness

state
  a set of Tasks with
    a description String
    a completed Boolean = false

actions
  addTask (task: Task, description: String): (task: Task)
    **requires** no Task with the given `task` ID already exists in the checklist
    **effects** creates a new task entry in the checklist; sets its `task` ID to the input `task`; sets its `description` to the input `description`; sets its `completed` status to `false`; returns the `task` ID

  removeTask (task: Task)
    **requires** a Task with the given `task` ID exists in the checklist
    **effects** removes the task entry corresponding to the `task` ID from the checklist

  markComplete (task: Task)
    **requires** a Task with the given `task` ID exists in the checklist
    **effects** sets the `completed` status of the task corresponding to the `task` ID to `true`

  markIncomplete (task: Task)
    **requires** a Task with the given `task` ID exists in the checklist
    **effects** sets the `completed` status of the task corresponding to the `task` ID to `false`

  updateTaskDescription (task: Task, newDescription: String)
    **requires** a Task with the given `task` ID exists in the checklist
    **effects** updates the `description` of the task corresponding to the `task` ID to `newDescription`

queries
  _getTask (task: Task) : (description: String, completed: Boolean)
    **requires** a Task with the given `task` ID exists in the checklist
    **effects** returns the `description` and `completed` status for the specified `task`

  _getAllTasks () : (task: Task, description: String, completed: Boolean)
    **requires** true
    **effects** returns a set of all tasks in the checklist, each with its `task` ID, `description`, and `completed` status

  _getCompletedTasks () : (task: Task, description: String)
    **requires** true
    **effects** returns a set of all tasks in the checklist whose `completed` status is `true`, each with its `task` ID and `description`

  _getIncompleteTasks () : (task: Task, description: String)
    **requires** true
    **effects** returns a set of all tasks in the checklist whose `completed` status is `false`, each with its `task` ID and `description`
```
