import { Collection, Db } from "npm:mongodb";
import { compare, hash } from "npm:bcrypt";
import { ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "UserAuth" + ".";

// Generic types for the concept's external dependencies
type User = ID;

// Internal entity types, represented as IDs
type UserEntity = ID;

/**
 * State: A set of Users with a username and passwordHash.
 */
interface UserDoc {
  _id: UserEntity;
  username: string;
  passwordHash: string;
}

/**
 * @concept UserAuth
 * @purpose To securely verify a user's identity based on credentials.
 */
export default class UserAuthConcept {
  users: Collection<UserDoc>;

  constructor(private readonly db: Db) {
    this.users = this.db.collection(PREFIX + "users");
  }

  /**
   * Action: Registers a new user with a username and password.
   * @requires No User exists with the given username.
   * @effects A new user is created with the given username and a hash of the password, and its ID is returned.
   */
  async register({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<{ user: User } | { error: string }> {
    const existingUser = await this.users.findOne({ username });
    if (existingUser) {
      return { error: `User with username ${username} already exists.` };
    }

    const passwordHash = await hash(password, 10);
    const userId = freshID() as UserEntity;
    await this.users.insertOne({
      _id: userId,
      username,
      passwordHash,
    });
    return { user: userId };
  }

  /**
   * Action: Logs in a user with a username and password.
   * @requires A User exists with the given username and the password matches their passwordHash.
   * @effects Returns the matching user's ID.
   */
  async login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<{ user: User } | { error: string }> {
    const userDoc = await this.users.findOne({ username });
    if (!userDoc) {
      return { error: `User with username ${username} not found.` };
    }

    const passwordMatches = await compare(password, userDoc.passwordHash);
    if (!passwordMatches) {
      return { error: "Invalid password." };
    }

    return { user: userDoc._id };
  }

  /**
   * Query: Retrieves a user by their username.
   * @requires A User with the given username exists.
   * @effects Returns the corresponding User.
   */
  async _getUserByUsername({
    username,
  }: {
    username: string;
  }): Promise<UserDoc | null> {
    return await this.users.findOne({ username });
  }
}
