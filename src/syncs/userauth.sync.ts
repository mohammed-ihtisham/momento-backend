/**
 * Synchronizations for UserAuth concept
 */

import { UserAuth, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";

/**
 * Sync: Handle _getUserByUsername request
 * This query retrieves a user by username. Currently passes through without authentication.
 * TODO: Consider adding authentication if this should be protected.
 *
 * Note: The concept returns UserDoc | null, but the API spec expects an array response.
 * We convert the single result to the expected format in the where clause.
 */
export const GetUserByUsername: Sync = ({ request, username, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAuth/_getUserByUsername", username },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    for (const frame of frames) {
      const usernameValue = frame[username] as string;
      const userDoc = await UserAuth._getUserByUsername({
        username: usernameValue,
      });
      // Convert UserDoc | null to the expected response format
      // If userDoc exists, extract the user ID; otherwise respond with null/error
      if (userDoc) {
        results.push({ ...frame, user: userDoc._id });
      } else {
        // User not found - still respond but with null user
        results.push({ ...frame, user: null });
      }
    }
    return results;
  },
  then: actions([Requesting.respond, { request, user }]),
});
