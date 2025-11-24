import { Collection, Db } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Task" + ".";

// Generic types for the concept's external dependencies
type User = ID;

// Internal entity types, represented as IDs
type Task = ID;

/**
 * State: A set of Tasks with an owner and description.
 */
interface TaskDoc {
  _id: Task;
  owner: User;
  description: string;
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
   * Action: Creates a new task for an owner.
   * @requires The user exists and description is not empty.
   * @effects Creates a new Task with the given owner and description, and returns the task ID.
   */
  async createTask({
    owner,
    description,
  }: {
    owner: User;
    description: string;
  }): Promise<{ task: Task } | { error: string }> {
    if (description.trim() === "") {
      return { error: "Description cannot be empty." };
    }

    const taskId = freshID() as Task;
    await this.tasks.insertOne({
      _id: taskId,
      owner,
      description,
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
   * @effects Returns the owner and description of the task.
   */
  async _getTask({ task }: { task: Task }): Promise<{
    owner: User;
    description: string;
  } | null> {
    const taskDoc = await this.tasks.findOne({ _id: task });
    if (!taskDoc) {
      return null;
    }
    return {
      owner: taskDoc.owner,
      description: taskDoc.description,
    };
  }

  /**
   * Query: Retrieves all tasks owned by a user.
   * @requires The owner exists.
   * @effects Returns all Tasks where owner is the given owner, each with its description.
   */
  async _getTasks({ owner }: { owner: User }): Promise<
    Array<{
      task: Task;
      description: string;
    }>
  > {
    const tasks = await this.tasks.find({ owner }).toArray();
    return tasks.map((t) => ({
      task: t._id,
      description: t.description,
    }));
  }
}
