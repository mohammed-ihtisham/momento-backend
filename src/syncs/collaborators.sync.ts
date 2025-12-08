/**
 * Synchronizations for Collaborators concept
 */

import { Collaborators, Sessioning, Requesting, UserAuth } from "@concepts";
import { actions, Frames, Sync } from "@engine";
import { ID } from "@utils/types.ts";
import { getDb } from "@utils/database.ts";

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
}) => {
  console.log("[CreateInviteRequest] Sync definition loaded");
  return {
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

      // Get the request record to extract input fields
      const requestValue = frames[0]?.[request] as ID | undefined;
      if (!requestValue) {
        console.error("[CreateInviteRequest] No request ID in frame");
        return frames;
      }

      // Query the database directly for the request document
      const [db] = await getDb();
      const requestsCollection = db.collection("Requesting.requests");
      const requestDoc = await requestsCollection.findOne({
        _id: requestValue,
      });

      if (!requestDoc) {
        console.error("[CreateInviteRequest] Request not found in database");
        return frames;
      }

      console.log("[CreateInviteRequest] Request input:", requestDoc.input);

      // Extract fields from request input
      const input = requestDoc.input as Record<string, unknown>;
      const sessionValue = input.session as ID | undefined;
      const senderUsernameValue = input.senderUsername as string | undefined;
      const recipientUsernameValue = input.recipientUsername as
        | string
        | undefined;
      const occasionIdValue = input.occasionId as ID | undefined;

      console.log("[CreateInviteRequest] Extracted values:", {
        sessionValue,
        senderUsernameValue,
        recipientUsernameValue,
        occasionIdValue,
      });

      const results: Frames = new Frames();

      for (const frame of frames) {
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
          console.log(
            "[CreateInviteRequest] Looking up sender by username:",
            senderUsernameValue
          );
          const senderDoc = await UserAuth._getUserByUsername({
            username: senderUsernameValue,
          });
          console.log("[CreateInviteRequest] Sender lookup result:", senderDoc);
          if (senderDoc?._id) {
            senderId = senderDoc._id;
            newFrame[user] = senderId;
            console.log("[CreateInviteRequest] Resolved sender ID:", senderId);
          } else {
            console.error(
              "[CreateInviteRequest] Sender not found for username:",
              senderUsernameValue
            );
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

        console.log(
          "[CreateInviteRequest] Looking up recipient by username:",
          recipientUsernameValue
        );
        const recipientDoc = await UserAuth._getUserByUsername({
          username: recipientUsernameValue,
        });
        console.log(
          "[CreateInviteRequest] Recipient lookup result:",
          recipientDoc
        );

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
        newFrame[occasionId] = occasionIdValue;

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
  };
};

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
    { path: "/Collaborators/acceptInvite" },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Get the request record to extract input fields
    const requestValue = frames[0]?.[request] as ID | undefined;
    if (!requestValue) {
      console.error("[AcceptInviteRequest] No request ID in frame");
      return frames;
    }

    // Query the database directly for the request document
    const [db] = await getDb();
    const requestsCollection = db.collection("Requesting.requests");
    const requestDoc = await requestsCollection.findOne({ _id: requestValue });

    if (!requestDoc) {
      console.error("[AcceptInviteRequest] Request not found in database");
      return frames;
    }

    // Extract session, user, and invite from request input
    const input = requestDoc.input as Record<string, unknown>;
    const sessionValue = input.session as ID | undefined;
    const userValue = input.user as ID | undefined;
    const inviteValue = input.invite as ID | undefined;

    console.log("[AcceptInviteRequest] Extracted values:", {
      sessionValue,
      userValue,
      inviteValue,
    });

    // Verify session and get the authenticated user (recipient)
    const authenticatedFrames: Frames = new Frames();
    for (const frame of frames) {
      const newFrame = { ...frame };

      let userResult: ID | null = null;

      // Try to get user from session first
      if (sessionValue) {
        userResult = await Sessioning._getUser({ session: sessionValue });
      }

      // Fallback: use user ID directly if no session
      if (!userResult && userValue) {
        userResult = userValue;
        console.log(
          "[AcceptInviteRequest] Using user ID directly (no session):",
          userResult
        );
      }

      if (!userResult || !inviteValue) {
        console.error("[AcceptInviteRequest] Missing user or invite");
        continue;
      }

      newFrame[user] = userResult;
      newFrame[invite] = inviteValue;
      authenticatedFrames.push(newFrame);
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
    { path: "/Collaborators/declineInvite" },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Get the request record to extract input fields
    const requestValue = frames[0]?.[request] as ID | undefined;
    if (!requestValue) {
      console.error("[DeclineInviteRequest] No request ID in frame");
      return frames;
    }

    // Query the database directly for the request document
    const [db] = await getDb();
    const requestsCollection = db.collection("Requesting.requests");
    const requestDoc = await requestsCollection.findOne({ _id: requestValue });

    if (!requestDoc) {
      console.error("[DeclineInviteRequest] Request not found in database");
      return frames;
    }

    // Extract session, user, and invite from request input
    const input = requestDoc.input as Record<string, unknown>;
    const sessionValue = input.session as ID | undefined;
    const userValue = input.user as ID | undefined;
    const inviteValue = input.invite as ID | undefined;

    console.log("[DeclineInviteRequest] Extracted values:", {
      sessionValue,
      userValue,
      inviteValue,
    });

    // Verify session and get the authenticated user (recipient)
    const authenticatedFrames: Frames = new Frames();
    for (const frame of frames) {
      const newFrame = { ...frame };

      let userResult: ID | null = null;

      // Try to get user from session first
      if (sessionValue) {
        userResult = await Sessioning._getUser({ session: sessionValue });
      }

      // Fallback: use user ID directly if no session
      if (!userResult && userValue) {
        userResult = userValue;
        console.log(
          "[DeclineInviteRequest] Using user ID directly (no session):",
          userResult
        );
      }

      if (!userResult || !inviteValue) {
        console.error("[DeclineInviteRequest] Missing user or invite");
        continue;
      }

      newFrame[user] = userResult;
      newFrame[invite] = inviteValue;
      authenticatedFrames.push(newFrame);
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
    { path: "/Collaborators/_getIncomingInvites" },
    { request },
  ]),
  where: async (frames: Frames) => {
    console.log(
      "[GetIncomingInvitesRequest] where clause started, initial frames:",
      frames.length
    );

    // Get the request record to extract input fields
    const requestValue = frames[0]?.[request] as ID | undefined;
    if (!requestValue) {
      console.error("[GetIncomingInvitesRequest] No request ID in frame");
      return frames;
    }

    console.log("[GetIncomingInvitesRequest] Request ID:", requestValue);

    // Query the database directly for the request document
    const [db] = await getDb();
    const requestsCollection = db.collection("Requesting.requests");
    const requestDoc = await requestsCollection.findOne({ _id: requestValue });

    if (!requestDoc) {
      console.error(
        "[GetIncomingInvitesRequest] Request not found in database"
      );
      return frames;
    }

    console.log("[GetIncomingInvitesRequest] Request input:", requestDoc.input);

    // Extract session or user from request input
    const input = requestDoc.input as Record<string, unknown>;
    const sessionValue = input.session as ID | undefined;
    const userValue = input.user as ID | undefined;

    console.log("[GetIncomingInvitesRequest] Session value:", sessionValue);
    console.log("[GetIncomingInvitesRequest] User value:", userValue);

    // Verify session and get the authenticated user
    // Handle _getUser which returns User | null, not an array
    const results: Frames = new Frames();

    for (const frame of frames) {
      const newFrame = { ...frame };

      let userResult: ID | null = null;

      // Try to get user from session first
      if (sessionValue) {
        userResult = await Sessioning._getUser({ session: sessionValue });
      }

      // Fallback: use user ID directly if no session
      if (!userResult && userValue) {
        userResult = userValue;
        console.log(
          "[GetIncomingInvitesRequest] Using user ID directly (no session):",
          userResult
        );
      }

      if (!userResult) {
        // No valid user - respond with empty array
        console.log(
          "[GetIncomingInvitesRequest] No valid user found, returning empty array"
        );
        newFrame[invites] = [];
        results.push(newFrame);
        continue;
      }

      // Get invites for authenticated user
      console.log(
        "[GetIncomingInvitesRequest] Looking up invites for user:",
        userResult
      );
      const invitesArray = await Collaborators._getIncomingInvites({
        recipient: userResult,
      });
      console.log(
        "[GetIncomingInvitesRequest] Found invites:",
        invitesArray.length,
        invitesArray
      );

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
    { path: "/Collaborators/_getSentInvites" },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Get the request record to extract input fields
    const requestValue = frames[0]?.[request] as ID | undefined;
    if (!requestValue) {
      console.error("[GetSentInvitesRequest] No request ID in frame");
      return frames;
    }

    // Query the database directly for the request document
    const [db] = await getDb();
    const requestsCollection = db.collection("Requesting.requests");
    const requestDoc = await requestsCollection.findOne({ _id: requestValue });

    if (!requestDoc) {
      console.error("[GetSentInvitesRequest] Request not found in database");
      return frames;
    }

    // Extract session or user from request input
    const input = requestDoc.input as Record<string, unknown>;
    const sessionValue = input.session as ID | undefined;
    const userValue = input.user as ID | undefined;

    // Verify session and get the authenticated user
    // Handle _getUser which returns User | null, not an array
    const results: Frames = new Frames();

    for (const frame of frames) {
      const newFrame = { ...frame };

      let userResult: ID | null = null;

      // Try to get user from session first
      if (sessionValue) {
        userResult = await Sessioning._getUser({ session: sessionValue });
      }

      // Fallback: use user ID directly if no session
      if (!userResult && userValue) {
        userResult = userValue;
        console.log(
          "[GetSentInvitesRequest] Using user ID directly (no session):",
          userResult
        );
      }

      if (!userResult) {
        // No valid user - respond with empty array
        console.log(
          "[GetSentInvitesRequest] No valid user found, returning empty array"
        );
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
    { path: "/Collaborators/_getCollaboratorsForOccasion" },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Get the request record to extract input fields
    const requestValue = frames[0]?.[request] as ID | undefined;
    if (!requestValue) {
      console.error(
        "[GetCollaboratorsForOccasionRequest] No request ID in frame"
      );
      return frames;
    }

    // Query the database directly for the request document
    const [db] = await getDb();
    const requestsCollection = db.collection("Requesting.requests");
    const requestDoc = await requestsCollection.findOne({ _id: requestValue });

    if (!requestDoc) {
      console.error(
        "[GetCollaboratorsForOccasionRequest] Request not found in database"
      );
      return frames;
    }

    // Extract occasionId from request input
    const input = requestDoc.input as Record<string, unknown>;
    const occasionIdValue = input.occasionId as ID | undefined;

    console.log("[GetCollaboratorsForOccasionRequest] Request input:", input);
    console.log(
      "[GetCollaboratorsForOccasionRequest] Extracted occasionId:",
      occasionIdValue
    );

    const results: Frames = new Frames();
    for (const frame of frames) {
      const newFrame = { ...frame };

      if (!occasionIdValue) {
        console.error(
          "[GetCollaboratorsForOccasionRequest] No occasionId in request"
        );
        newFrame[collaborators] = [];
        results.push(newFrame);
        continue;
      }

      const collaboratorsArray =
        await Collaborators._getCollaboratorsForOccasion({
          occasionId: occasionIdValue,
        });

      console.log(
        "[GetCollaboratorsForOccasionRequest] Found collaborators:",
        collaboratorsArray.length,
        collaboratorsArray
      );

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
    { path: "/Collaborators/removeCollaborator" },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Get the request record to extract input fields
    const requestValue = frames[0]?.[request] as ID | undefined;
    if (!requestValue) {
      console.error(
        "[RemoveCollaboratorRequestWithUser] No request ID in frame"
      );
      return frames;
    }

    // Query the database directly for the request document
    const [db] = await getDb();
    const requestsCollection = db.collection("Requesting.requests");
    const requestDoc = await requestsCollection.findOne({ _id: requestValue });

    if (!requestDoc) {
      console.error(
        "[RemoveCollaboratorRequestWithUser] Request not found in database"
      );
      return frames;
    }

    // Extract user and occasionId from request input
    const input = requestDoc.input as Record<string, unknown>;
    const userValue = input.user as ID | undefined;
    const occasionIdValue = input.occasionId as ID | undefined;

    console.log("[RemoveCollaboratorRequestWithUser] Extracted values:", {
      userValue,
      occasionIdValue,
    });

    if (!userValue || !occasionIdValue) {
      console.error(
        "[RemoveCollaboratorRequestWithUser] Missing user or occasionId"
      );
      return frames;
    }

    const results: Frames = new Frames();
    for (const frame of frames) {
      const newFrame = { ...frame };
      newFrame[user] = userValue;
      newFrame[occasionId] = occasionIdValue;
      results.push(newFrame);
    }
    return results;
  },
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
