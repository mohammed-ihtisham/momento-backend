import { Collection, Db } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Collaborators" + ".";

// Generic types for the concept's external dependencies
type User = ID;

/**
 * State: A set of Users (collaborators).
 */
interface CollaboratorDoc {
  _id: User;
}

/**
 * @concept Collaborators
 * @purpose maintain a list of people working on a project
 */
export default class CollaboratorsConcept {
  collaborators: Collection<CollaboratorDoc>;

  constructor(private readonly db: Db) {
    this.collaborators = this.db.collection(PREFIX + "collaborators");
  }

  /**
   * Action: Adds a user to the set of collaborators.
   * @requires The user exists and is not already a collaborator.
   * @effects The user is added to the set of collaborators.
   */
  async addCollaborator({
    user,
  }: {
    user: User;
  }): Promise<Empty | { error: string }> {
    const existingCollaborator = await this.collaborators.findOne({
      _id: user,
    });
    if (existingCollaborator) {
      return { error: `User ${user} is already a collaborator.` };
    }

    await this.collaborators.insertOne({ _id: user });
    return {};
  }

  /**
   * Action: Removes a user from the set of collaborators.
   * @requires The user exists and is currently a collaborator.
   * @effects The user is removed from the set of collaborators.
   */
  async removeCollaborator({
    user,
  }: {
    user: User;
  }): Promise<Empty | { error: string }> {
    const existingCollaborator = await this.collaborators.findOne({
      _id: user,
    });
    if (!existingCollaborator) {
      return { error: `User ${user} is not a collaborator.` };
    }

    await this.collaborators.deleteOne({ _id: user });
    return {};
  }

  /**
   * Query: Retrieves all users who are collaborators.
   * @requires None.
   * @effects Returns the set of all users who are collaborators.
   */
  async _getCollaborators(): Promise<User[]> {
    const collaborators = await this.collaborators.find({}).toArray();
    return collaborators.map((c) => c._id);
  }

  /**
   * Query: Checks if a user is a collaborator.
   * @requires The user exists.
   * @effects Returns true if the user is a collaborator, false otherwise.
   */
  async _hasCollaborator({ user }: { user: User }): Promise<boolean> {
    const collaborator = await this.collaborators.findOne({ _id: user });
    return collaborator !== null;
  }
}
