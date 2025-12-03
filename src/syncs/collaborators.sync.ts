/**
 * Synchronizations for Collaborators concept
 */

import { Collaborators, Sessioning, Requesting, UserAuth } from "@concepts";
import { actions, Frames, Sync } from "@engine";
import { ID } from "@utils/types.ts";

/**
 * Sync: Handle createInvite request
 * Requires authentication - user creates invite for an occasion.
 */
export const CreateInviteRequest: Sync = ({
  request,
  session,
  senderUsername,
  user,
  recipientUsername,
  occasionId,
  recipientUser,
}) => ({
  when: actions([
    Requesting.request,
    {
      path: "/Collaborators/createInvite",
    },
    { request },
  ]),
  where: async (frames: Frames) => {
    console.log(
      "[CreateInviteRequest] where clause started, initial frames:",
      frames.length
    );

    const results: Frames = new Frames();

    for (const frame of frames) {
      const sessionValue = frame[session] as ID | undefined;
      const senderUsernameValue = frame[senderUsername] as string | undefined;
      const recipientUsernameValue = frame[recipientUsername] as
        | string
        | undefined;
      const occasionIdValue = frame[occasionId] as ID | undefined;
      const newFrame = { ...frame };

      // Resolve sender: try session first, then senderUsername
      let senderId: ID | undefined = undefined;

      if (sessionValue) {
        const userFromSession = await Sessioning._getUser({
          session: sessionValue,
        });
        if (userFromSession) {
          senderId = userFromSession;
          newFrame[user] = senderId;
        }
      }

      if (!senderId && senderUsernameValue) {
        const senderDoc = await UserAuth._getUserByUsername({
          username: senderUsernameValue,
        });
        if (senderDoc?._id) {
          senderId = senderDoc._id;
          newFrame[user] = senderId;
        }
      }

      if (!senderId) {
        console.error(
          "[CreateInviteRequest] Could not resolve sender - need either session or senderUsername"
        );
        // Return frame with error - action will handle it
        results.push(newFrame);
        continue;
      }

      // Resolve recipient username to user ID
      if (
        !recipientUsernameValue ||
        typeof recipientUsernameValue !== "string"
      ) {
        console.error("[CreateInviteRequest] recipientUsername is required");
        results.push(newFrame);
        continue;
      }

      const recipientDoc = await UserAuth._getUserByUsername({
        username: recipientUsernameValue,
      });

      if (!recipientDoc?._id) {
        console.error(
          "[CreateInviteRequest] User not found for recipientUsername:",
          recipientUsernameValue
        );
        results.push(newFrame);
        continue;
      }

      // Validate occasionId
      if (!occasionIdValue) {
        console.error("[CreateInviteRequest] occasionId is required");
        results.push(newFrame);
        continue;
      }

      // All validations passed - set resolved values
      newFrame[recipientUser] = recipientDoc._id;

      console.log("[CreateInviteRequest] Frame ready for createInvite:", {
        sender: senderId,
        recipient: recipientDoc._id,
        occasionId: occasionIdValue,
      });
      results.push(newFrame);
    }

    // Always return at least the original frames to ensure response
    return results.length > 0 ? results : frames;
  },
  then: actions([
    Collaborators.createInvite,
    { sender: user, recipient: recipientUser, occasionId },
  ]),
});

export const CreateInviteResponseSuccess: Sync = ({ request, invite }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/createInvite" }, { request }],
    [Collaborators.createInvite, {}, { invite }]
  ),
  then: actions([Requesting.respond, { request, invite }]),
});

export const CreateInviteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/createInvite" }, { request }],
    [Collaborators.createInvite, {}, { error }]
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle acceptInvite request
 * Requires authentication - recipient accepts invite.
 */
export const AcceptInviteRequest: Sync = ({
  request,
  session,
  user,
  invite,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/acceptInvite", session, invite },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (recipient)
    // Handle _getUser which returns User | null, not an array
    const authenticatedFrames: Frames = new Frames();
    for (const frame of frames) {
      const sessionValue = frame[session] as ID | undefined;
      if (!sessionValue) {
        continue;
      }
      const userResult = await Sessioning._getUser({ session: sessionValue });
      if (userResult) {
        authenticatedFrames.push({ ...frame, [user]: userResult });
      }
    }
    return authenticatedFrames;
  },
  then: actions([Collaborators.acceptInvite, { invite, recipient: user }]),
});

export const AcceptInviteResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/acceptInvite" }, { request }],
    [Collaborators.acceptInvite, {}, {}]
  ),
  then: actions([Requesting.respond, { request, status: "accepted" }]),
});

export const AcceptInviteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/acceptInvite" }, { request }],
    [Collaborators.acceptInvite, {}, { error }]
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle declineInvite request
 * Requires authentication - recipient declines invite.
 */
export const DeclineInviteRequest: Sync = ({
  request,
  session,
  user,
  invite,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/declineInvite", session, invite },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (recipient)
    // Handle _getUser which returns User | null, not an array
    const authenticatedFrames: Frames = new Frames();
    for (const frame of frames) {
      const sessionValue = frame[session] as ID | undefined;
      if (!sessionValue) {
        continue;
      }
      const userResult = await Sessioning._getUser({ session: sessionValue });
      if (userResult) {
        authenticatedFrames.push({ ...frame, [user]: userResult });
      }
    }
    return authenticatedFrames;
  },
  then: actions([Collaborators.declineInvite, { invite, recipient: user }]),
});

export const DeclineInviteResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/declineInvite" }, { request }],
    [Collaborators.declineInvite, {}, {}]
  ),
  then: actions([Requesting.respond, { request, status: "declined" }]),
});

export const DeclineInviteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/declineInvite" }, { request }],
    [Collaborators.declineInvite, {}, { error }]
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getIncomingInvites request
 * Requires authentication - returns invites where user is recipient.
 */
export const GetIncomingInvitesRequest: Sync = ({
  request,
  session,
  user,
  invites,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/_getIncomingInvites", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user
    // Handle _getUser which returns User | null, not an array
    const results: Frames = new Frames();

    for (const frame of frames) {
      const sessionValue = frame[session] as ID | undefined;
      const newFrame = { ...frame };

      if (!sessionValue) {
        // No session provided - respond with empty array
        newFrame[invites] = [];
        results.push(newFrame);
        continue;
      }

      const userResult = await Sessioning._getUser({ session: sessionValue });
      if (!userResult) {
        // Invalid session - respond with empty array
        newFrame[invites] = [];
        results.push(newFrame);
        continue;
      }

      // Get invites for authenticated user
      const invitesArray = await Collaborators._getIncomingInvites({
        recipient: userResult,
      });

      newFrame[user] = userResult;
      newFrame[invites] = invitesArray;
      results.push(newFrame);
    }

    // Always return at least the original frames to ensure response
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, invites }]),
});

/**
 * Sync: Handle _getSentInvites request
 * Requires authentication - returns invites where user is sender.
 */
export const GetSentInvitesRequest: Sync = ({
  request,
  session,
  user,
  invites,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/_getSentInvites", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user
    // Handle _getUser which returns User | null, not an array
    const results: Frames = new Frames();

    for (const frame of frames) {
      const sessionValue = frame[session] as ID | undefined;
      const newFrame = { ...frame };

      if (!sessionValue) {
        // No session provided - respond with empty array
        newFrame[invites] = [];
        results.push(newFrame);
        continue;
      }

      const userResult = await Sessioning._getUser({ session: sessionValue });
      if (!userResult) {
        // Invalid session - respond with empty array
        newFrame[invites] = [];
        results.push(newFrame);
        continue;
      }

      // Get invites for authenticated user
      const invitesArray = await Collaborators._getSentInvites({
        sender: userResult,
      });

      newFrame[user] = userResult;
      newFrame[invites] = invitesArray;
      results.push(newFrame);
    }

    // Always return at least the original frames to ensure response
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, invites }]),
});

/**
 * Sync: Handle _getCollaboratorsForOccasion request
 * Returns all accepted collaborators for an occasion.
 */
export const GetCollaboratorsForOccasionRequest: Sync = ({
  request,
  occasionId,
  collaborators,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/_getCollaboratorsForOccasion", occasionId },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    for (const frame of frames) {
      const occasionIdValue = frame[occasionId] as ID;
      const collaboratorsArray =
        await Collaborators._getCollaboratorsForOccasion({
          occasionId: occasionIdValue,
        });

      const newFrame = { ...frame };
      newFrame[collaborators] = collaboratorsArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, collaborators }]),
});

/**
 * Sync: Handle addCollaborator request with session
 * Requires authentication - user adds collaborators directly (backward compatibility).
 */
export const AddCollaboratorRequestWithSession: Sync = ({
  request,
  session,
  user,
  collaborator,
  occasionId,
}) => ({
  when: actions([
    Requesting.request,
    {
      path: "/Collaborators/addCollaborator",
      session,
      collaborator,
      occasionId,
    },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user
    // Handle _getUser which returns User | null, not an array
    const authenticatedFrames: Frames = new Frames();
    for (const frame of frames) {
      const sessionValue = frame[session] as ID | undefined;
      if (!sessionValue) {
        continue;
      }
      const userResult = await Sessioning._getUser({ session: sessionValue });
      if (userResult) {
        authenticatedFrames.push({ ...frame, [user]: userResult });
      }
    }
    return authenticatedFrames;
  },
  then: actions([
    Collaborators.addCollaborator,
    { user: collaborator, occasionId, sender: user },
  ]),
});

/**
 * Sync: Handle addCollaborator request with user (backward compatibility)
 * Accepts user directly for backward compatibility.
 * Note: This requires occasionId to be provided.
 */
export const AddCollaboratorRequestWithUser: Sync = ({
  request,
  user,
  occasionId,
  sender,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/addCollaborator", user, occasionId, sender },
    { request },
  ]),
  then: actions([Collaborators.addCollaborator, { user, occasionId, sender }]),
});

export const AddCollaboratorResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [
      Requesting.request,
      { path: "/Collaborators/addCollaborator" },
      { request },
    ],
    [Collaborators.addCollaborator, {}, {}]
  ),
  then: actions([Requesting.respond, { request, status: "added" }]),
});

export const AddCollaboratorResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [
      Requesting.request,
      { path: "/Collaborators/addCollaborator" },
      { request },
    ],
    [Collaborators.addCollaborator, {}, { error }]
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle removeCollaborator request with session
 * Requires authentication - user removes collaborators from an occasion.
 */
export const RemoveCollaboratorRequestWithSession: Sync = ({
  request,
  session,
  user,
  collaborator,
  occasionId,
}) => ({
  when: actions([
    Requesting.request,
    {
      path: "/Collaborators/removeCollaborator",
      session,
      collaborator,
      occasionId,
    },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user
    // Handle _getUser which returns User | null, not an array
    const authenticatedFrames: Frames = new Frames();
    for (const frame of frames) {
      const sessionValue = frame[session] as ID | undefined;
      if (!sessionValue) {
        continue;
      }
      const userResult = await Sessioning._getUser({ session: sessionValue });
      if (userResult) {
        authenticatedFrames.push({ ...frame, [user]: userResult });
      }
    }
    return authenticatedFrames;
  },
  then: actions([
    Collaborators.removeCollaborator,
    { user: collaborator, occasionId },
  ]),
});

/**
 * Sync: Handle removeCollaborator request with user (backward compatibility)
 * Accepts user directly for backward compatibility.
 * Note: This requires occasionId to be provided.
 */
export const RemoveCollaboratorRequestWithUser: Sync = ({
  request,
  user,
  occasionId,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/removeCollaborator", user, occasionId },
    { request },
  ]),
  then: actions([Collaborators.removeCollaborator, { user, occasionId }]),
});

export const RemoveCollaboratorResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [
      Requesting.request,
      { path: "/Collaborators/removeCollaborator" },
      { request },
    ],
    [Collaborators.removeCollaborator, {}, {}]
  ),
  then: actions([Requesting.respond, { request, status: "removed" }]),
});

export const RemoveCollaboratorResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [
      Requesting.request,
      { path: "/Collaborators/removeCollaborator" },
      { request },
    ],
    [Collaborators.removeCollaborator, {}, { error }]
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
export const HasCollaboratorRequest: Sync = ({
  request,
  user,
  hasCollaborator,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/_hasCollaborator", user },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    for (const frame of frames) {
      const userValue = frame[user] as ID | undefined;

      const newFrame = { ...frame };

      if (!userValue) {
        // No user provided - respond with false
        newFrame[hasCollaborator] = false;
        results.push(newFrame);
        continue;
      }

      const hasResult = await Collaborators._hasCollaborator({
        user: userValue,
      });
      newFrame[hasCollaborator] = hasResult;
      results.push(newFrame);
    }
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, hasCollaborator }]),
});
