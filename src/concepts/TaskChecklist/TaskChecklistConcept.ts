import { Collection, Db } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "TaskChecklist" + ".";

// Generic types for the concept's external dependencies
type User = ID;
type Task = ID;

// Internal entity types, represented as IDs
type ChecklistEntry = ID;

/**
 * State: A set of ChecklistEntries with an owner, task, and completed status.
 */
interface ChecklistEntryDoc {
  _id: ChecklistEntry;
  owner: User;
  task: Task;
  completed: boolean;
}

/**
 * @concept TaskChecklist
 * @purpose track and manage the completion status of tasks in a checklist
 */
export default class TaskChecklistConcept {
  entries: Collection<ChecklistEntryDoc>;

  constructor(private readonly db: Db) {
    this.entries = this.db.collection(PREFIX + "entries");
  }

  /**
   * Action: Adds a task to the checklist for an owner.
   * @requires The user exists, task exists, and no ChecklistEntry for owner and task already exists.
   * @effects Creates a new ChecklistEntry with completed set to false and returns the entry ID.
   */
  async addTask({
    owner,
    task,
  }: {
    owner: User;
    task: Task;
  }): Promise<{ entry: ChecklistEntry } | { error: string }> {
    const existingEntry = await this.entries.findOne({ owner, task });
    if (existingEntry) {
      return {
        error: `ChecklistEntry for owner ${owner} and task ${task} already exists.`,
      };
    }

    const entryId = freshID() as ChecklistEntry;
    await this.entries.insertOne({
      _id: entryId,
      owner,
      task,
      completed: false,
    });
    return { entry: entryId };
  }

  /**
   * Action: Removes a task from the checklist for an owner.
   * @requires The user exists, task exists, and a ChecklistEntry for owner and task exists.
   * @effects Removes the ChecklistEntry for owner and task.
   */
  async removeTask({
    owner,
    task,
  }: {
    owner: User;
    task: Task;
  }): Promise<Empty | { error: string }> {
    const existingEntry = await this.entries.findOne({ owner, task });
    if (!existingEntry) {
      return {
        error: `ChecklistEntry for owner ${owner} and task ${task} not found.`,
      };
    }

    await this.entries.deleteOne({ owner, task });
    return {};
  }

  /**
   * Action: Marks a task as complete in the checklist for an owner.
   * @requires The user exists, task exists, and a ChecklistEntry for owner and task exists.
   * @effects Sets completed of the ChecklistEntry for owner and task to true.
   */
  async markComplete({
    owner,
    task,
  }: {
    owner: User;
    task: Task;
  }): Promise<Empty | { error: string }> {
    const existingEntry = await this.entries.findOne({ owner, task });
    if (!existingEntry) {
      return {
        error: `ChecklistEntry for owner ${owner} and task ${task} not found.`,
      };
    }

    await this.entries.updateOne(
      { owner, task },
      { $set: { completed: true } }
    );
    return {};
  }

  /**
   * Action: Marks a task as incomplete in the checklist for an owner.
   * @requires The user exists, task exists, and a ChecklistEntry for owner and task exists.
   * @effects Sets completed of the ChecklistEntry for owner and task to false.
   */
  async markIncomplete({
    owner,
    task,
  }: {
    owner: User;
    task: Task;
  }): Promise<Empty | { error: string }> {
    const existingEntry = await this.entries.findOne({ owner, task });
    if (!existingEntry) {
      return {
        error: `ChecklistEntry for owner ${owner} and task ${task} not found.`,
      };
    }

    await this.entries.updateOne(
      { owner, task },
      { $set: { completed: false } }
    );
    return {};
  }

  /**
   * Query: Retrieves the completion status for a specific checklist entry.
   * @requires A ChecklistEntry for owner and task exists.
   * @effects Returns the completed status for the ChecklistEntry.
   */
  async _getChecklistEntry({
    owner,
    task,
  }: {
    owner: User;
    task: Task;
  }): Promise<boolean | null> {
    const entry = await this.entries.findOne({ owner, task });
    if (!entry) {
      return null;
    }
    return entry.completed;
  }

  /**
   * Query: Retrieves all checklist entries for an owner.
   * @requires The owner exists.
   * @effects Returns all ChecklistEntries where owner is the given owner, each with its task and completed status.
   */
  async _getChecklist({ owner }: { owner: User }): Promise<
    Array<{
      task: Task;
      completed: boolean;
    }>
  > {
    const entries = await this.entries.find({ owner }).toArray();
    return entries.map((e) => ({
      task: e.task,
      completed: e.completed,
    }));
  }

  /**
   * Query: Retrieves all completed tasks for an owner.
   * @requires The owner exists.
   * @effects Returns all tasks where owner is the given owner and completed is true.
   */
  async _getCompletedTasks({ owner }: { owner: User }): Promise<Task[]> {
    const entries = await this.entries
      .find({ owner, completed: true })
      .toArray();
    return entries.map((e) => e.task);
  }

  /**
   * Query: Retrieves all incomplete tasks for an owner.
   * @requires The owner exists.
   * @effects Returns all tasks where owner is the given owner and completed is false.
   */
  async _getIncompleteTasks({ owner }: { owner: User }): Promise<Task[]> {
    const entries = await this.entries
      .find({ owner, completed: false })
      .toArray();
    return entries.map((e) => e.task);
  }
}
