import { Collection, Db } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Sessioning" + ".";

// Generic types for the concept's external dependencies
type User = ID;

// Internal entity types, represented as IDs
type Session = ID;

/**
 * State: A set of Sessions with a user.
 */
interface SessionDoc {
  _id: Session;
  user: User;
}

/**
 * @concept Sessioning
 * @purpose To maintain a user's logged-in state across multiple requests without re-sending credentials.
 */
export default class SessioningConcept {
  sessions: Collection<SessionDoc>;

  constructor(private readonly db: Db) {
    this.sessions = this.db.collection(PREFIX + "sessions");
  }

  /**
   * Action: Creates a new session for a user.
   * @requires true.
   * @effects Creates a new Session and associates it with the given user, and returns the session ID.
   */
  async create({ user }: { user: User }): Promise<{ session: Session }> {
    const sessionId = freshID() as Session;
    await this.sessions.insertOne({
      _id: sessionId,
      user,
    });
    return { session: sessionId };
  }

  /**
   * Action: Deletes a session.
   * @requires The session exists.
   * @effects Removes the session.
   */
  async delete({
    session,
  }: {
    session: Session;
  }): Promise<Empty | { error: string }> {
    const existingSession = await this.sessions.findOne({ _id: session });
    if (!existingSession) {
      return { error: `Session with ID ${session} not found.` };
    }

    await this.sessions.deleteOne({ _id: session });
    return {};
  }

  /**
   * Query: Retrieves the user associated with a session.
   * @requires The session exists.
   * @effects Returns the user associated with the session.
   */
  async _getUser({ session }: { session: Session }): Promise<User | null> {
    const sessionDoc = await this.sessions.findOne({ _id: session });
    if (!sessionDoc) {
      return null;
    }
    return sessionDoc.user;
  }
}
