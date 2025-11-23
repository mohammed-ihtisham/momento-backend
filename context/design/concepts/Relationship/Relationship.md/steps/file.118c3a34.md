---
timestamp: 'Sun Nov 23 2025 15:06:38 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_150638.bfb4c852.md]]'
content_id: 118c3a34ac14a3f3a88d61238bffafcbeb3f5600712b9398a46a01d252362c60
---

# file: src/concepts/Following/FollowingConcept.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Declare collection prefix, use concept name
const PREFIX = "Following" + ".";

// Generic type parameters for this concept
type User = ID;

/**
 * a set of Follows with
 *   a follower User
 *   a followee User
 */
interface Follows {
  _id: ID; // Unique ID for this specific follow relationship
  follower: User;
  followee: User;
}

/**
 * The Following concept tracks which users are interested in
 * receiving updates or content from other users.
 */
export default class FollowingConcept {
  private follows: Collection<Follows>;

  constructor(private readonly db: Db) {
    this.follows = this.db.collection(PREFIX + "follows");
    // Ensure unique constraint for follower-followee pairs
    this.follows.createIndex(
      { follower: 1, followee: 1 },
      { unique: true },
    );
  }

  /**
   * follow (follower: User, followee: User): (followed: Boolean)
   *
   * **requires** `follower` is not the same as `followee` AND `follower` does not already follow `followee`
   *
   * **effects** a new `Follow` record is created, associating `follower` with `followee`; returns `true` as `followed`
   */
  async follow(
    { follower, followee }: { follower: User; followee: User },
  ): Promise<{ followed?: boolean; error?: string }> {
    // Precondition 1: `follower` is not the same as `followee`
    if (follower === followee) {
      return { error: "A user cannot follow themselves." };
    }

    // Precondition 2: `follower` does not already follow `followee`
    const existingFollow = await this.follows.findOne({ follower, followee });
    if (existingFollow) {
      return { error: `User ${follower} already follows user ${followee}.` };
    }

    // Effects: Create a new Follow record
    const newFollow: Follows = {
      _id: freshID(), // Generate a unique ID for the follow relationship itself
      follower,
      followee,
    };

    try {
      await this.follows.insertOne(newFollow);
      return { followed: true };
    } catch (e) {
      // Catch potential database errors, e.g., race conditions on unique index
      console.error("Error inserting new follow:", e);
      return { error: "Failed to establish follow relationship due to a system error." };
    }
  }

  /**
   * unfollow (follower: User, followee: User): (unfollowed: Boolean)
   *
   * **requires** `follower` currently follows `followee`
   *
   * **effects** the `Follow` record associating `follower` with `followee` is removed; returns `true` as `unfollowed`
   */
  async unfollow(
    { follower, followee }: { follower: User; followee: User },
  ): Promise<{ unfollowed?: boolean; error?: string }> {
    // Precondition: `follower` currently follows `followee`
    const result = await this.follows.deleteOne({ follower, followee });

    if (result.deletedCount === 0) {
      return { error: `User ${follower} does not follow user ${followee}.` };
    }

    // Effects: The Follow record is removed
    return { unfollowed: true };
  }

  /**
   * _getFollowees (follower: User): (followee: User)
   *
   * **requires** true
   *
   * **effects** returns the set of all users that `follower` is following
   */
  async _getFollowees(
    { follower }: { follower: User },
  ): Promise<Array<{ followee: User }>> {
    const followees = await this.follows.find({ follower }).project({
      _id: 0,
      followee: 1,
    }).toArray();
    return followees as Array<{ followee: User }>;
  }

  /**
   * _getFollowers (followee: User): (follower: User)
   *
   * **requires** true
   *
   * **effects** returns the set of all users who are following `followee`
   */
  async _getFollowers(
    { followee }: { followee: User },
  ): Promise<Array<{ follower: User }>> {
    const followers = await this.follows.find({ followee }).project({
      _id: 0,
      follower: 1,
    }).toArray();
    return followers as Array<{ follower: User }>;
  }

  /**
   * _isFollowing (follower: User, followee: User): (isFollowing: Boolean)
   *
   * **requires** true
   *
   * **effects** returns `true` as `isFollowing` if `follower` follows `followee`, otherwise returns `false`
   */
  async _isFollowing(
    { follower, followee }: { follower: User; followee: User },
  ): Promise<Array<{ isFollowing: boolean }>> {
    const exists = await this.follows.findOne({ follower, followee });
    return [{ isFollowing: !!exists }];
  }
}
```
