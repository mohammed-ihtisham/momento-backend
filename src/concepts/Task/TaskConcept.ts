import { Collection, Db } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Task" + ".";

// Generic types for the concept's external dependencies
type User = ID;
type Occasion = ID;

// Internal entity types, represented as IDs
type Task = ID;

/**
 * State: A set of Tasks with an owner, description, and occasionId.
 */
type TaskPriority = "low" | "medium" | "high";

interface TaskDoc {
  _id: Task;
  owner: User;
  occasionId: Occasion;
  description: string;
  priority: TaskPriority;
}

/**
 * @concept Task
 * @purpose define tasks that users can create and manage
 */
export default class TaskConcept {
  tasks: Collection<TaskDoc>;

  constructor(private readonly db: Db) {
    this.tasks = this.db.collection(PREFIX + "tasks");
  }

  /**
   * Action: Creates a new task for an owner and occasion.
   * @requires The user exists, occasion exists, and description is not empty.
   * @effects Creates a new Task with the given owner, occasionId, description, and priority, and returns the task ID.
   */
  async createTask({
    owner,
    occasionId,
    description,
    priority,
  }: {
    owner: User;
    occasionId: Occasion;
    description: string;
    priority: TaskPriority;
  }): Promise<{ task: Task } | { error: string }> {
    if (description.trim() === "") {
      return { error: "Description cannot be empty." };
    }
    const validPriorities: TaskPriority[] = ["low", "medium", "high"];
    if (!priority || !validPriorities.includes(priority as TaskPriority)) {
      return { error: "Priority must be one of: low, medium, high." };
    }

    const taskId = freshID() as Task;
    await this.tasks.insertOne({
      _id: taskId,
      owner,
      occasionId,
      description,
      priority,
    });
    return { task: taskId };
  }

  /**
   * Action: Updates a task's description.
   * @requires The task exists.
   * @effects Sets the description of the task to the given description and returns the task ID.
   */
  async updateTaskDescription({
    task,
    description,
  }: {
    task: Task;
    description: string;
  }): Promise<{ task: Task } | { error: string }> {
    const existingTask = await this.tasks.findOne({ _id: task });
    if (!existingTask) {
      return { error: `Task with ID ${task} not found.` };
    }

    await this.tasks.updateOne({ _id: task }, { $set: { description } });
    return { task };
  }

  /**
   * Action: Deletes a task.
   * @requires The task exists.
   * @effects Removes the task from the set of Tasks.
   */
  async deleteTask({
    task,
  }: {
    task: Task;
  }): Promise<Empty | { error: string }> {
    const existingTask = await this.tasks.findOne({ _id: task });
    if (!existingTask) {
      return { error: `Task with ID ${task} not found.` };
    }

    await this.tasks.deleteOne({ _id: task });
    return {};
  }

  /**
   * Query: Retrieves a task by its ID.
   * @requires The task exists.
   * @effects Returns the owner, occasionId, description, and priority of the task.
   */
  async _getTask({ task }: { task: Task }): Promise<{
    owner: User;
    occasionId: Occasion;
    description: string;
    priority: TaskPriority;
  } | null> {
    const taskDoc = await this.tasks.findOne({ _id: task });
    if (!taskDoc) {
      return null;
    }
    return {
      owner: taskDoc.owner,
      occasionId: taskDoc.occasionId,
      description: taskDoc.description,
      priority: taskDoc.priority,
    };
  }

  /**
   * Query: Retrieves all tasks for a specific occasion.
   * @requires The occasion exists.
   * @effects Returns all Tasks where occasionId is the given occasionId, each with its description and priority.
   */
  async _getTasks({ occasionId }: { occasionId: Occasion }): Promise<
    Array<{
      task: Task;
      description: string;
      priority: TaskPriority;
    }>
  > {
    const tasks = await this.tasks.find({ occasionId }).toArray();
    return tasks.map((t) => ({
      task: t._id,
      description: t.description,
      priority: t.priority,
    }));
  }
}
