/**
 * Synchronizations for Collaborators concept
 */

import { Collaborators, Sessioning, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";

/**
 * Sync: Handle addCollaborator request with session
 * Requires authentication - user adds collaborators.
 */
export const AddCollaboratorRequestWithSession: Sync = ({ request, session, user, collaborator }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/addCollaborator", session, collaborator },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([Collaborators.addCollaborator, { user: collaborator }]),
});

/**
 * Sync: Handle addCollaborator request with user (backward compatibility)
 * Accepts user directly for backward compatibility.
 */
export const AddCollaboratorRequestWithUser: Sync = ({ request, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/addCollaborator", user },
    { request },
  ]),
  then: actions([Collaborators.addCollaborator, { user }]),
});

export const AddCollaboratorResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/addCollaborator" }, { request }],
    [Collaborators.addCollaborator, {}, {}],
  ),
  then: actions([Requesting.respond, { request, status: "added" }]),
});

export const AddCollaboratorResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/addCollaborator" }, { request }],
    [Collaborators.addCollaborator, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle removeCollaborator request with session
 * Requires authentication - user removes collaborators.
 */
export const RemoveCollaboratorRequestWithSession: Sync = ({ request, session, user, collaborator }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/removeCollaborator", session, collaborator },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([Collaborators.removeCollaborator, { user: collaborator }]),
});

/**
 * Sync: Handle removeCollaborator request with user (backward compatibility)
 * Accepts user directly for backward compatibility.
 */
export const RemoveCollaboratorRequestWithUser: Sync = ({ request, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/removeCollaborator", user },
    { request },
  ]),
  then: actions([Collaborators.removeCollaborator, { user }]),
});

export const RemoveCollaboratorResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/removeCollaborator" }, { request }],
    [Collaborators.removeCollaborator, {}, {}],
  ),
  then: actions([Requesting.respond, { request, status: "removed" }]),
});

export const RemoveCollaboratorResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/removeCollaborator" }, { request }],
    [Collaborators.removeCollaborator, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getCollaborators request
 * Can be called with or without authentication.
 * Returns all collaborators.
 */
export const GetCollaboratorsRequest: Sync = ({ request, collaborators }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/_getCollaborators" },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    for (const frame of frames) {
      const collaboratorsArray = await Collaborators._getCollaborators();
      
      const newFrame = { ...frame };
      newFrame[collaborators] = collaboratorsArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, collaborators }]),
});

/**
 * Sync: Handle _hasCollaborator request
 * Can be called with or without authentication.
 * Returns whether a user is a collaborator.
 */
export const HasCollaboratorRequest: Sync = ({ request, user, hasCollaborator }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/_hasCollaborator", user },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    for (const frame of frames) {
      const userValue = frame[user] as string | undefined;
      
      const newFrame = { ...frame };
      
      if (!userValue) {
        // No user provided - respond with false
        newFrame[hasCollaborator] = false;
        results.push(newFrame);
        continue;
      }
      
      const hasResult = await Collaborators._hasCollaborator({ user: userValue });
      newFrame[hasCollaborator] = hasResult;
      results.push(newFrame);
    }
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, hasCollaborator }]),
});

