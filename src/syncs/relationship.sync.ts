/**
 * Synchronizations for Relationship concept
 */

import { Relationship, Sessioning, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";

/**
 * Sync: Handle createRelationship request with session
 * Requires authentication - user creates relationships for themselves.
 */
export const CreateRelationshipRequestWithSession: Sync = ({ request, session, user, name, relationshipType }) => ({
  when: actions([
    Requesting.request,
    { path: "/Relationship/createRelationship", session, name, relationshipType },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who becomes the owner)
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([Relationship.createRelationship, { owner: user, name, relationshipType }]),
});

/**
 * Sync: Handle createRelationship request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const CreateRelationshipRequestWithOwner: Sync = ({ request, owner, name, relationshipType }) => ({
  when: actions([
    Requesting.request,
    { path: "/Relationship/createRelationship", owner, name, relationshipType },
    { request },
  ]),
  then: actions([Relationship.createRelationship, { owner, name, relationshipType }]),
});

export const CreateRelationshipResponseSuccess: Sync = ({ request, relationship }) => ({
  when: actions(
    [Requesting.request, { path: "/Relationship/createRelationship" }, { request }],
    [Relationship.createRelationship, {}, { relationship }],
  ),
  then: actions([Requesting.respond, { request, relationship }]),
});

export const CreateRelationshipResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Relationship/createRelationship" }, { request }],
    [Relationship.createRelationship, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle updateRelationship request
 * Requires authentication AND ownership verification - user can only update their own relationships.
 */
export const UpdateRelationshipRequest: Sync = ({ request, session, user, relationship, name, relationshipType, owner }) => ({
  when: actions([
    Requesting.request,
    { path: "/Relationship/updateRelationship", session, relationship, name, relationshipType },
    { request },
  ]),
  where: async (frames: Frames) => {
    // First verify session and get the authenticated user
    let authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    // Then verify ownership by getting the relationship's owner
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const relationshipValue = frame[relationship] as string;
      const relationshipData = await Relationship._getRelationship({ relationship: relationshipValue });
      
      if (!relationshipData) {
        // Relationship doesn't exist - skip this frame (will result in error)
        continue;
      }
      
      // Check if the authenticated user owns this relationship
      if (relationshipData.owner === frame[user]) {
        results.push({ ...frame, owner: relationshipData.owner });
      }
      // If not owner, skip this frame (unauthorized)
    }
    return results;
  },
  then: actions([Relationship.updateRelationship, { relationship, name, relationshipType }]),
});

export const UpdateRelationshipResponse: Sync = ({ request, relationship, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Relationship/updateRelationship" }, { request }],
    [Relationship.updateRelationship, {}, { relationship, error }],
  ),
  then: actions([Requesting.respond, { request, relationship, error }]),
});

/**
 * Sync: Handle deleteRelationship request
 * Requires authentication AND ownership verification - user can only delete their own relationships.
 */
export const DeleteRelationshipRequest: Sync = ({ request, session, user, relationship, owner }) => ({
  when: actions([
    Requesting.request,
    { path: "/Relationship/deleteRelationship", session, relationship },
    { request },
  ]),
  where: async (frames: Frames) => {
    // First verify session and get the authenticated user
    let authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    // Then verify ownership by getting the relationship's owner
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const relationshipValue = frame[relationship] as string;
      const relationshipData = await Relationship._getRelationship({ relationship: relationshipValue });
      
      if (!relationshipData) {
        // Relationship doesn't exist - skip this frame (will result in error)
        continue;
      }
      
      // Check if the authenticated user owns this relationship
      if (relationshipData.owner === frame[user]) {
        results.push({ ...frame, owner: relationshipData.owner });
      }
      // If not owner, skip this frame (unauthorized)
    }
    return results;
  },
  then: actions([Relationship.deleteRelationship, { relationship }]),
});

export const DeleteRelationshipResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Relationship/deleteRelationship" }, { request }],
    [Relationship.deleteRelationship, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getRelationship request
 * Can be called with or without authentication.
 * Returns relationship information by ID.
 */
export const GetRelationshipRequest: Sync = ({ request, relationship, relationshipData }) => ({
  when: actions([
    Requesting.request,
    { path: "/Relationship/_getRelationship", relationship },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    for (const frame of frames) {
      const relationshipValue = frame[relationship] as string;
      const relData = await Relationship._getRelationship({ relationship: relationshipValue });
      
      const newFrame = { ...frame };
      newFrame[relationshipData] = relData;
      results.push(newFrame);
    }
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, relationship: relationshipData }]),
});

/**
 * Sync: Handle _getRelationships request with session
 * Requires authentication - user can only see their own relationships.
 */
export const GetRelationshipsRequestWithSession: Sync = ({ request, session, user, relationships }) => ({
  when: actions([
    Requesting.request,
    { path: "/Relationship/_getRelationships", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const rels = await Relationship._getRelationships({ owner: ownerValue });
      
      const newFrame = { ...frame };
      newFrame[relationships] = rels;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, relationships }]),
});

/**
 * Sync: Handle _getRelationships request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetRelationshipsRequestWithOwner: Sync = ({ request, owner, relationships }) => ({
  when: actions([
    Requesting.request,
    { path: "/Relationship/_getRelationships", owner },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    
    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;
      
      const newFrame = { ...frame };
      
      if (!ownerValue) {
        // No owner provided - respond with empty array
        newFrame[relationships] = [];
        results.push(newFrame);
        continue;
      }
      
      const rels = await Relationship._getRelationships({ owner: ownerValue });
      newFrame[relationships] = rels;
      results.push(newFrame);
    }
    
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, relationships }]),
});

/**
 * Sync: Handle _getRelationshipByName request with session
 * Requires authentication - user can only see their own relationships.
 */
export const GetRelationshipByNameRequestWithSession: Sync = ({ request, session, user, name, relationshipData }) => ({
  when: actions([
    Requesting.request,
    { path: "/Relationship/_getRelationshipByName", session, name },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const nameValue = frame[name] as string;
      const relData = await Relationship._getRelationshipByName({ owner: ownerValue, name: nameValue });
      
      const newFrame = { ...frame };
      newFrame[relationshipData] = relData;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, relationship: relationshipData }]),
});

/**
 * Sync: Handle _getRelationshipByName request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetRelationshipByNameRequestWithOwner: Sync = ({ request, owner, name, relationshipData }) => ({
  when: actions([
    Requesting.request,
    { path: "/Relationship/_getRelationshipByName", owner, name },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    
    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;
      const nameValue = frame[name] as string | undefined;
      
      const newFrame = { ...frame };
      
      if (!ownerValue || !nameValue) {
        // Missing required parameters - respond with null
        newFrame[relationshipData] = null;
        results.push(newFrame);
        continue;
      }
      
      const relData = await Relationship._getRelationshipByName({ owner: ownerValue, name: nameValue });
      newFrame[relationshipData] = relData;
      results.push(newFrame);
    }
    
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, relationship: relationshipData }]),
});

