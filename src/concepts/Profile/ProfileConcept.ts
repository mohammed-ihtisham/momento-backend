import { Collection, Db } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Profile" + ".";

// Generic types for the concept's external dependencies
type User = ID;

// Internal entity types, represented as IDs
type Profile = ID;

/**
 * State: A set of Profiles with a user and name.
 */
interface ProfileDoc {
  _id: Profile;
  user: User;
  name: string;
}

/**
 * @concept Profile
 * @purpose store basic user information: name
 */
export default class ProfileConcept {
  profiles: Collection<ProfileDoc>;

  constructor(private readonly db: Db) {
    this.profiles = this.db.collection(PREFIX + "profiles");
  }

  /**
   * Action: Creates a new profile for a user.
   * @requires The user exists and no Profile already exists for the user.
   * @effects A new profile is created with the given user and name, and its ID is returned.
   */
  async createProfile({
    user,
    name,
  }: {
    user: User;
    name: string;
  }): Promise<{ profile: Profile } | { error: string }> {
    const existingProfile = await this.profiles.findOne({ user });
    if (existingProfile) {
      return { error: `Profile for user ${user} already exists.` };
    }

    const profileId = freshID() as Profile;
    await this.profiles.insertOne({
      _id: profileId,
      user,
      name,
    });
    return { profile: profileId };
  }

  /**
   * Action: Updates the name of a user's profile.
   * @requires The user exists and a Profile exists for the user.
   * @effects The name of the Profile for the user is updated.
   */
  async updateName({
    user,
    name,
  }: {
    user: User;
    name: string;
  }): Promise<{ profile: Profile } | { error: string }> {
    const existingProfile = await this.profiles.findOne({ user });
    if (!existingProfile) {
      return { error: `Profile for user ${user} not found.` };
    }

    await this.profiles.updateOne({ user }, { $set: { name } });
    return { profile: existingProfile._id };
  }

  /**
   * Action: Deletes a user's profile.
   * @requires The user exists and a Profile exists for the user.
   * @effects The Profile associated with the user is removed.
   */
  async deleteProfile({
    user,
  }: {
    user: User;
  }): Promise<Empty | { error: string }> {
    const existingProfile = await this.profiles.findOne({ user });
    if (!existingProfile) {
      return { error: `Profile for user ${user} not found.` };
    }

    await this.profiles.deleteOne({ user });
    return {};
  }

  /**
   * Query: Retrieves the profile information for a user.
   * @requires A Profile exists for the user.
   * @effects Returns the name and email of the Profile for the user.
   */
  async _getProfile({
    user,
  }: {
    user: User;
  }): Promise<{ name: string; email?: string } | null> {
    const profile = await this.profiles.findOne({ user });
    if (!profile) {
      return null;
    }
    return { name: profile.name };
  }

  /**
   * Query: Retrieves the name of a user's profile.
   * @requires A Profile exists for the user.
   * @effects Returns the name of the Profile for the user.
   */
  async _getName({ user }: { user: User }): Promise<string | null> {
    const profile = await this.profiles.findOne({ user });
    if (!profile) {
      return null;
    }
    return profile.name;
  }
}
