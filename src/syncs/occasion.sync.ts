/**
 * Synchronizations for Occasion concept
 */

import { Occasion, Sessioning, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";

/**
 * Sync: Handle createOccasion request with session
 * Requires authentication - user creates occasions for themselves.
 */
export const CreateOccasionRequestWithSession: Sync = ({ request, session, user, person, occasionType, date }) => ({
  when: actions([
    Requesting.request,
    { path: "/Occasion/createOccasion", session, person, occasionType, date },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who becomes the owner)
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([Occasion.createOccasion, { owner: user, person, occasionType, date }]),
});

/**
 * Sync: Handle createOccasion request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const CreateOccasionRequestWithOwner: Sync = ({ request, owner, person, occasionType, date }) => ({
  when: actions([
    Requesting.request,
    { path: "/Occasion/createOccasion", owner, person, occasionType, date },
    { request },
  ]),
  then: actions([Occasion.createOccasion, { owner, person, occasionType, date }]),
});

export const CreateOccasionResponseSuccess: Sync = ({ request, occasion }) => ({
  when: actions(
    [Requesting.request, { path: "/Occasion/createOccasion" }, { request }],
    [Occasion.createOccasion, {}, { occasion }],
  ),
  then: actions([Requesting.respond, { request, occasion }]),
});

export const CreateOccasionResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Occasion/createOccasion" }, { request }],
    [Occasion.createOccasion, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle updateOccasion request
 * Requires authentication AND ownership verification - user can only update their own occasions.
 */
export const UpdateOccasionRequest: Sync = ({ request, session, user, occasion, person, occasionType, date, owner }) => ({
  when: actions([
    Requesting.request,
    { path: "/Occasion/updateOccasion", session, occasion, person, occasionType, date },
    { request },
  ]),
  where: async (frames: Frames) => {
    // First verify session and get the authenticated user
    let authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    // Then verify ownership by getting the occasion's owner
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const occasionValue = frame[occasion] as string;
      const occasionData = await Occasion._getOccasion({ occasion: occasionValue });
      
      if (!occasionData) {
        // Occasion doesn't exist - skip this frame (will result in error)
        continue;
      }
      
      // Check if the authenticated user owns this occasion
      if (occasionData.owner === frame[user]) {
        results.push({ ...frame, owner: occasionData.owner });
      }
      // If not owner, skip this frame (unauthorized)
    }
    return results;
  },
  then: actions([Occasion.updateOccasion, { occasion, person, occasionType, date }]),
});

export const UpdateOccasionResponseSuccess: Sync = ({ request, occasion }) => ({
  when: actions(
    [Requesting.request, { path: "/Occasion/updateOccasion" }, { request }],
    [Occasion.updateOccasion, {}, { occasion }],
  ),
  then: actions([Requesting.respond, { request, occasion }]),
});

export const UpdateOccasionResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Occasion/updateOccasion" }, { request }],
    [Occasion.updateOccasion, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle deleteOccasion request
 * Requires authentication AND ownership verification - user can only delete their own occasions.
 */
export const DeleteOccasionRequest: Sync = ({ request, session, user, occasion, owner }) => ({
  when: actions([
    Requesting.request,
    { path: "/Occasion/deleteOccasion", session, occasion },
    { request },
  ]),
  where: async (frames: Frames) => {
    // First verify session and get the authenticated user
    let authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    // Then verify ownership by getting the occasion's owner
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const occasionValue = frame[occasion] as string;
      const occasionData = await Occasion._getOccasion({ occasion: occasionValue });
      
      if (!occasionData) {
        // Occasion doesn't exist - skip this frame (will result in error)
        continue;
      }
      
      // Check if the authenticated user owns this occasion
      if (occasionData.owner === frame[user]) {
        results.push({ ...frame, owner: occasionData.owner });
      }
      // If not owner, skip this frame (unauthorized)
    }
    return results;
  },
  then: actions([Occasion.deleteOccasion, { occasion }]),
});

export const DeleteOccasionResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Occasion/deleteOccasion" }, { request }],
    [Occasion.deleteOccasion, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getOccasion request
 * Can be called with or without authentication.
 * Returns occasion information by ID.
 */
export const GetOccasionRequest: Sync = ({ request, occasion, occasionData }) => ({
  when: actions([
    Requesting.request,
    { path: "/Occasion/_getOccasion", occasion },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    for (const frame of frames) {
      const occasionValue = frame[occasion] as string;
      const occasionResult = await Occasion._getOccasion({ occasion: occasionValue });
      
      const newFrame = { ...frame };
      newFrame[occasionData] = occasionResult;
      results.push(newFrame);
    }
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, occasion: occasionData }]),
});

/**
 * Sync: Handle _getOccasions request with session
 * Requires authentication - user can only see their own occasions.
 */
export const GetOccasionsRequestWithSession: Sync = ({ request, session, user, occasions }) => ({
  when: actions([
    Requesting.request,
    { path: "/Occasion/_getOccasions", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const occasionsArray = await Occasion._getOccasions({ owner: ownerValue });
      
      const newFrame = { ...frame };
      newFrame[occasions] = occasionsArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, occasions }]),
});

/**
 * Sync: Handle _getOccasions request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetOccasionsRequestWithOwner: Sync = ({ request, owner, occasions }) => ({
  when: actions([
    Requesting.request,
    { path: "/Occasion/_getOccasions", owner },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    
    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;
      
      const newFrame = { ...frame };
      
      if (!ownerValue) {
        // No owner provided - respond with empty array
        newFrame[occasions] = [];
        results.push(newFrame);
        continue;
      }
      
      const occasionsArray = await Occasion._getOccasions({ owner: ownerValue });
      newFrame[occasions] = occasionsArray;
      results.push(newFrame);
    }
    
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, occasions }]),
});

/**
 * Sync: Handle _getOccasionsByPerson request with session
 * Requires authentication - user can only see their own occasions.
 */
export const GetOccasionsByPersonRequestWithSession: Sync = ({ request, session, user, person, occasions }) => ({
  when: actions([
    Requesting.request,
    { path: "/Occasion/_getOccasionsByPerson", session, person },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const personValue = frame[person] as string;
      const occasionsArray = await Occasion._getOccasionsByPerson({ owner: ownerValue, person: personValue });
      
      const newFrame = { ...frame };
      newFrame[occasions] = occasionsArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, occasions }]),
});

/**
 * Sync: Handle _getOccasionsByPerson request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetOccasionsByPersonRequestWithOwner: Sync = ({ request, owner, person, occasions }) => ({
  when: actions([
    Requesting.request,
    { path: "/Occasion/_getOccasionsByPerson", owner, person },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    
    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;
      const personValue = frame[person] as string | undefined;
      
      const newFrame = { ...frame };
      
      if (!ownerValue || !personValue) {
        // Missing required parameters - respond with empty array
        newFrame[occasions] = [];
        results.push(newFrame);
        continue;
      }
      
      const occasionsArray = await Occasion._getOccasionsByPerson({ owner: ownerValue, person: personValue });
      newFrame[occasions] = occasionsArray;
      results.push(newFrame);
    }
    
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, occasions }]),
});

/**
 * Sync: Handle _getOccasionsByDate request with session
 * Requires authentication - user can only see their own occasions.
 */
export const GetOccasionsByDateRequestWithSession: Sync = ({ request, session, user, date, occasions }) => ({
  when: actions([
    Requesting.request,
    { path: "/Occasion/_getOccasionsByDate", session, date },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const dateValue = frame[date] as string;
      const occasionsArray = await Occasion._getOccasionsByDate({ owner: ownerValue, date: dateValue });
      
      const newFrame = { ...frame };
      newFrame[occasions] = occasionsArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, occasions }]),
});

/**
 * Sync: Handle _getOccasionsByDate request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetOccasionsByDateRequestWithOwner: Sync = ({ request, owner, date, occasions }) => ({
  when: actions([
    Requesting.request,
    { path: "/Occasion/_getOccasionsByDate", owner, date },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    
    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;
      const dateValue = frame[date] as string | undefined;
      
      const newFrame = { ...frame };
      
      if (!ownerValue || !dateValue) {
        // Missing required parameters - respond with empty array
        newFrame[occasions] = [];
        results.push(newFrame);
        continue;
      }
      
      const occasionsArray = await Occasion._getOccasionsByDate({ owner: ownerValue, date: dateValue });
      newFrame[occasions] = occasionsArray;
      results.push(newFrame);
    }
    
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, occasions }]),
});

