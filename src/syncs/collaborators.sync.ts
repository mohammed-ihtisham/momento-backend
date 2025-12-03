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
export const CreateInviteRequest: Sync = ({ request, session, user, recipientUsername, occasionId, recipientUser }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/createInvite", session, recipientUsername, occasionId },
    { request },
  ]),
  where: async (frames: Frames) => {
    console.log("[CreateInviteRequest] where clause started, initial frames:", frames.length);
    
    // Log what's in the initial frames
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      const frameKeys = Object.getOwnPropertySymbols(frame).map(s => String(s));
      console.log(`[CreateInviteRequest] Initial frame ${i}:`, {
        keys: frameKeys,
        session: frame[session] ?? "MISSING",
        recipientUsername: frame[recipientUsername] ?? "MISSING",
        occasionId: frame[occasionId] ?? "MISSING",
        request: frame[request] ?? "MISSING",
      });
    }
    
    // Verify session and get the authenticated user (sender)
    // Note: We can't use frames.query() because _getUser returns a single value, not an array
    // So we handle authentication manually like GetUserFromSession does
    const authenticatedFrames: Frames = new Frames();
    for (const frame of frames) {
      const sessionValue = frame[session] as ID | undefined;
      if (!sessionValue) {
        console.error("[CreateInviteRequest] No session in frame - session must be sent in request body");
        continue;
      }
      const userResult = await Sessioning._getUser({ session: sessionValue });
      if (userResult) {
        authenticatedFrames.push({ ...frame, [user]: userResult });
      } else {
        console.warn("[CreateInviteRequest] Session not found or invalid");
        // Skip frames with invalid sessions
        continue;
      }
    }
    console.log("[CreateInviteRequest] After authentication, frames:", authenticatedFrames.length);
    
    // Resolve username to user ID
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      // Extract username from frame - it should be bound from the request
      const usernameValue = frame[recipientUsername] as string | undefined;
      const occasionIdValue = frame[occasionId] as ID | undefined;
      
      console.log("[CreateInviteRequest] Processing frame:", {
        hasUsername: !!usernameValue,
        username: usernameValue,
        hasOccasionId: !!occasionIdValue,
        occasionId: occasionIdValue,
        hasUser: !!frame[user],
        user: frame[user],
      });
      
      if (!usernameValue || typeof usernameValue !== 'string') {
        console.warn("[CreateInviteRequest] No username provided or invalid type");
        continue;
      }

      const userDoc = await UserAuth._getUserByUsername({ username: usernameValue });
      
      if (!userDoc?._id) {
        console.warn("[CreateInviteRequest] User not found for username:", usernameValue);
        continue;
      }
      
      // Only add frame if we have both authenticated user and resolved recipient
      const senderValue = frame[user] as ID | undefined;
      if (!senderValue || !userDoc._id || !occasionIdValue) {
        console.error("[CreateInviteRequest] Missing values before creating invite:", {
          hasSender: !!senderValue,
          senderValue: senderValue ?? "null/undefined",
          hasRecipient: !!userDoc._id,
          recipientValue: userDoc._id ?? "null/undefined",
          hasOccasionId: !!occasionIdValue,
          occasionId: occasionIdValue ?? "null/undefined",
          username: usernameValue,
        });
        continue;
      }
      
      // Create new frame with all required values
      // CRITICAL: Ensure user (sender) is preserved from authenticated frame
      const newFrame = { 
        ...frame,  // This preserves user, occasionId, recipientUsername, request, etc.
        [recipientUser]: userDoc._id,  // Add resolved recipient
      };
      // Explicitly ensure user (sender) is still there
      if (!newFrame[user]) {
        newFrame[user] = senderValue;
      }
      // Explicitly ensure occasionId is still there
      if (!newFrame[occasionId]) {
        newFrame[occasionId] = occasionIdValue;
      }
      
      // Log the values we're about to pass to createInvite
      const allSymbols = Object.getOwnPropertySymbols(newFrame);
      const symbolMap: Record<string, unknown> = {};
      for (const sym of allSymbols) {
        symbolMap[String(sym)] = newFrame[sym];
      }
      
      console.log("[CreateInviteRequest] Frame ready for createInvite:", {
        senderValue: senderValue,
        recipientValue: userDoc._id,
        occasionIdValue: occasionIdValue,
        senderType: typeof senderValue,
        recipientType: typeof userDoc._id,
        occasionIdType: typeof occasionIdValue,
        // Check what's actually in the frame
        userInFrame: newFrame[user],
        recipientUserInFrame: newFrame[recipientUser],
        occasionIdInFrame: newFrame[occasionId],
        allSymbols: Object.keys(symbolMap),
        symbolValues: symbolMap,
      });
      results.push(newFrame);
    }
    // If we couldn't resolve the recipient, return empty frames so createInvite isn't called with undefined
    if (results.length === 0) {
      console.warn("[CreateInviteRequest] No valid frames to create invite - returning empty frames");
    } else {
      console.log("[CreateInviteRequest] Returning", results.length, "valid frame(s)");
    }
    return results;
  },
  then: actions([Collaborators.createInvite, { sender: user, recipient: recipientUser, occasionId }]),
});

export const CreateInviteResponseSuccess: Sync = ({ request, invite }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/createInvite" }, { request }],
    [Collaborators.createInvite, {}, { invite }],
  ),
  then: actions([Requesting.respond, { request, invite }]),
});

export const CreateInviteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/createInvite" }, { request }],
    [Collaborators.createInvite, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle acceptInvite request
 * Requires authentication - recipient accepts invite.
 */
export const AcceptInviteRequest: Sync = ({ request, session, user, invite }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/acceptInvite", session, invite },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (recipient)
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([Collaborators.acceptInvite, { invite, recipient: user }]),
});

export const AcceptInviteResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/acceptInvite" }, { request }],
    [Collaborators.acceptInvite, {}, {}],
  ),
  then: actions([Requesting.respond, { request, status: "accepted" }]),
});

export const AcceptInviteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/acceptInvite" }, { request }],
    [Collaborators.acceptInvite, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle declineInvite request
 * Requires authentication - recipient declines invite.
 */
export const DeclineInviteRequest: Sync = ({ request, session, user, invite }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/declineInvite", session, invite },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (recipient)
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([Collaborators.declineInvite, { invite, recipient: user }]),
});

export const DeclineInviteResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/declineInvite" }, { request }],
    [Collaborators.declineInvite, {}, {}],
  ),
  then: actions([Requesting.respond, { request, status: "declined" }]),
});

export const DeclineInviteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Collaborators/declineInvite" }, { request }],
    [Collaborators.declineInvite, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getIncomingInvites request
 * Requires authentication - returns invites where user is recipient.
 */
export const GetIncomingInvitesRequest: Sync = ({ request, session, user, invites }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/_getIncomingInvites", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const userValue = frame[user] as ID;
      const invitesArray = await Collaborators._getIncomingInvites({ recipient: userValue });
      
      const newFrame = { ...frame };
      newFrame[invites] = invitesArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, invites }]),
});

/**
 * Sync: Handle _getSentInvites request
 * Requires authentication - returns invites where user is sender.
 */
export const GetSentInvitesRequest: Sync = ({ request, session, user, invites }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/_getSentInvites", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const userValue = frame[user] as ID;
      const invitesArray = await Collaborators._getSentInvites({ sender: userValue });
      
      const newFrame = { ...frame };
      newFrame[invites] = invitesArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, invites }]),
});

/**
 * Sync: Handle _getCollaboratorsForOccasion request
 * Returns all accepted collaborators for an occasion.
 */
export const GetCollaboratorsForOccasionRequest: Sync = ({ request, occasionId, collaborators }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/_getCollaboratorsForOccasion", occasionId },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    for (const frame of frames) {
      const occasionIdValue = frame[occasionId] as ID;
      const collaboratorsArray = await Collaborators._getCollaboratorsForOccasion({ occasionId: occasionIdValue });
      
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
export const AddCollaboratorRequestWithSession: Sync = ({ request, session, user, collaborator, occasionId }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/addCollaborator", session, collaborator, occasionId },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([Collaborators.addCollaborator, { user: collaborator, occasionId, sender: user }]),
});

/**
 * Sync: Handle addCollaborator request with user (backward compatibility)
 * Accepts user directly for backward compatibility.
 * Note: This requires occasionId to be provided.
 */
export const AddCollaboratorRequestWithUser: Sync = ({ request, user, occasionId, sender }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/addCollaborator", user, occasionId, sender },
    { request },
  ]),
  then: actions([Collaborators.addCollaborator, { user, occasionId, sender }]),
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
 * Requires authentication - user removes collaborators from an occasion.
 */
export const RemoveCollaboratorRequestWithSession: Sync = ({ request, session, user, collaborator, occasionId }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/removeCollaborator", session, collaborator, occasionId },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([Collaborators.removeCollaborator, { user: collaborator, occasionId }]),
});

/**
 * Sync: Handle removeCollaborator request with user (backward compatibility)
 * Accepts user directly for backward compatibility.
 * Note: This requires occasionId to be provided.
 */
export const RemoveCollaboratorRequestWithUser: Sync = ({ request, user, occasionId }) => ({
  when: actions([
    Requesting.request,
    { path: "/Collaborators/removeCollaborator", user, occasionId },
    { request },
  ]),
  then: actions([Collaborators.removeCollaborator, { user, occasionId }]),
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
      const userValue = frame[user] as ID | undefined;
      
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

