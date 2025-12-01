/**
 * Synchronizations for Sessioning concept
 */

import { Sessioning, UserAuth, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";

/**
 * Sync: Auto-create session on successful login
 * When UserAuth.login succeeds, automatically create a session for the user.
 */
export const CreateSessionOnLogin: Sync = ({ user }) => ({
  when: actions([UserAuth.login, {}, { user }]),
  then: actions([Sessioning.create, { user }]),
});

/**
 * Sync: Handle session creation request
 * Allows frontend to directly request session creation (if needed).
 * Note: This is typically handled automatically by CreateSessionOnLogin.
 */
export const CreateSessionRequest: Sync = ({ request, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/Sessioning/create", user },
    { request },
  ]),
  then: actions([Sessioning.create, { user }]),
});

export const CreateSessionResponse: Sync = ({ request, session }) => ({
  when: actions(
    [Requesting.request, { path: "/Sessioning/create" }, { request }],
    [Sessioning.create, {}, { session }],
  ),
  then: actions([Requesting.respond, { request, session }]),
});

/**
 * Sync: Handle logout request
 * Deletes a session. The session must exist (implicitly verified by the delete action).
 */
export const DeleteSessionRequest: Sync = ({ request, session }) => ({
  when: actions([
    Requesting.request,
    { path: "/Sessioning/delete", session },
    { request },
  ]),
  then: actions([Sessioning.delete, { session }]),
});

export const DeleteSessionResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Sessioning/delete" }, { request }],
    [Sessioning.delete, {}, {}],
  ),
  then: actions([Requesting.respond, { request, status: "logged_out" }]),
});

/**
 * Sync: Handle _getUser request
 * Returns the user associated with a session.
 * This query is typically used internally in where clauses, but can be called directly if needed.
 */
export const GetUserFromSession: Sync = ({ request, session, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/Sessioning/_getUser", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    for (const frame of frames) {
      const sessionValue = frame[session] as string;
      const userResult = await Sessioning._getUser({ session: sessionValue });
      if (userResult) {
        results.push({ ...frame, user: userResult });
      } else {
        // Session not found - respond with null
        results.push({ ...frame, user: null });
      }
    }
    return results;
  },
  then: actions([Requesting.respond, { request, user }]),
});

