/**
 * Synchronizations for Notes concept
 */

import { Notes, Sessioning, Relationship, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";

/**
 * Sync: Handle createNote request with session
 * Requires authentication - user creates notes for themselves.
 * Also verifies that the user owns the relationship.
 */
export const CreateNoteRequestWithSession: Sync = ({ request, session, user, relationship, title, content, relOwner }) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/createNote", session, relationship, title, content },
    { request },
  ]),
  where: async (frames: Frames) => {
    // First verify session and get the authenticated user
    let authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    // Then verify ownership of the relationship
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const relationshipValue = frame[relationship] as string;
      const relationshipData = await Relationship._getRelationship({ relationship: relationshipValue });
      
      if (!relationshipData) {
        // Relationship doesn't exist - skip this frame
        continue;
      }
      
      // Check if the authenticated user owns this relationship
      if (relationshipData.owner === frame[user]) {
        results.push({ ...frame, relOwner: relationshipData.owner });
      }
      // If not owner, skip this frame (unauthorized)
    }
    return results;
  },
  then: actions([Notes.createNote, { owner: user, relationship, title, content }]),
});

/**
 * Sync: Handle createNote request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 * Also verifies that the user owns the relationship.
 */
export const CreateNoteRequestWithOwner: Sync = ({ request, owner, relationship, title, content, relOwner }) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/createNote", owner, relationship, title, content },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify ownership of the relationship
    const results: Frames = new Frames();
    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;
      const relationshipValue = frame[relationship] as string | undefined;
      
      if (!ownerValue || !relationshipValue) {
        // Missing required parameters - skip this frame
        continue;
      }
      
      const relationshipData = await Relationship._getRelationship({ relationship: relationshipValue });
      
      if (!relationshipData) {
        // Relationship doesn't exist - skip this frame
        continue;
      }
      
      // Check if the provided owner owns this relationship
      if (relationshipData.owner === ownerValue) {
        results.push({ ...frame, relOwner: relationshipData.owner });
      }
      // If not owner, skip this frame (unauthorized)
    }
    return results;
  },
  then: actions([Notes.createNote, { owner, relationship, title, content }]),
});

export const CreateNoteResponseSuccess: Sync = ({ request, note }) => ({
  when: actions(
    [Requesting.request, { path: "/Notes/createNote" }, { request }],
    [Notes.createNote, {}, { note }],
  ),
  then: actions([Requesting.respond, { request, note }]),
});

export const CreateNoteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Notes/createNote" }, { request }],
    [Notes.createNote, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle updateNote request
 * Requires authentication AND ownership verification - user can only update their own notes.
 */
export const UpdateNoteRequest: Sync = ({ request, session, user, note, title, content, owner }) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/updateNote", session, note, title, content },
    { request },
  ]),
  where: async (frames: Frames) => {
    // First verify session and get the authenticated user
    let authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    // Then verify ownership by getting the note's owner
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const noteValue = frame[note] as string;
      const noteData = await Notes._getNote({ note: noteValue });
      
      if (!noteData) {
        // Note doesn't exist - skip this frame (will result in error)
        continue;
      }
      
      // Check if the authenticated user owns this note
      if (noteData.owner === frame[user]) {
        results.push({ ...frame, owner: noteData.owner });
      }
      // If not owner, skip this frame (unauthorized)
    }
    return results;
  },
  then: actions([Notes.updateNote, { note, title, content }]),
});

export const UpdateNoteResponseSuccess: Sync = ({ request, note }) => ({
  when: actions(
    [Requesting.request, { path: "/Notes/updateNote" }, { request }],
    [Notes.updateNote, {}, { note }],
  ),
  then: actions([Requesting.respond, { request, note }]),
});

export const UpdateNoteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Notes/updateNote" }, { request }],
    [Notes.updateNote, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle deleteNote request
 * Requires authentication AND ownership verification - user can only delete their own notes.
 */
export const DeleteNoteRequest: Sync = ({ request, session, user, note, owner }) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/deleteNote", session, note },
    { request },
  ]),
  where: async (frames: Frames) => {
    // First verify session and get the authenticated user
    let authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    // Then verify ownership by getting the note's owner
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const noteValue = frame[note] as string;
      const noteData = await Notes._getNote({ note: noteValue });
      
      if (!noteData) {
        // Note doesn't exist - skip this frame (will result in error)
        continue;
      }
      
      // Check if the authenticated user owns this note
      if (noteData.owner === frame[user]) {
        results.push({ ...frame, owner: noteData.owner });
      }
      // If not owner, skip this frame (unauthorized)
    }
    return results;
  },
  then: actions([Notes.deleteNote, { note }]),
});

export const DeleteNoteResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Notes/deleteNote" }, { request }],
    [Notes.deleteNote, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getNote request
 * Can be called with or without authentication.
 * Returns note information by ID.
 */
export const GetNoteRequest: Sync = ({ request, note, noteData }) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/_getNote", note },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    for (const frame of frames) {
      const noteValue = frame[note] as string;
      const noteResult = await Notes._getNote({ note: noteValue });
      
      const newFrame = { ...frame };
      newFrame[noteData] = noteResult;
      results.push(newFrame);
    }
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, note: noteData }]),
});

/**
 * Sync: Handle _getNotes request with session
 * Requires authentication - user can only see their own notes.
 */
export const GetNotesRequestWithSession: Sync = ({ request, session, user, notes }) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/_getNotes", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const notesArray = await Notes._getNotes({ owner: ownerValue });
      
      const newFrame = { ...frame };
      newFrame[notes] = notesArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, notes }]),
});

/**
 * Sync: Handle _getNotes request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetNotesRequestWithOwner: Sync = ({ request, owner, notes }) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/_getNotes", owner },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    
    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;
      
      const newFrame = { ...frame };
      
      if (!ownerValue) {
        // No owner provided - respond with empty array
        newFrame[notes] = [];
        results.push(newFrame);
        continue;
      }
      
      const notesArray = await Notes._getNotes({ owner: ownerValue });
      newFrame[notes] = notesArray;
      results.push(newFrame);
    }
    
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, notes }]),
});

/**
 * Sync: Handle _getNotesByRelationship request with session
 * Requires authentication - user can only see their own notes.
 */
export const GetNotesByRelationshipRequestWithSession: Sync = ({ request, session, user, relationship, notes }) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/_getNotesByRelationship", session, relationship },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const relationshipValue = frame[relationship] as string;
      const notesArray = await Notes._getNotesByRelationship({ owner: ownerValue, relationship: relationshipValue });
      
      const newFrame = { ...frame };
      newFrame[notes] = notesArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, notes }]),
});

/**
 * Sync: Handle _getNotesByRelationship request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetNotesByRelationshipRequestWithOwner: Sync = ({ request, owner, relationship, notes }) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/_getNotesByRelationship", owner, relationship },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    
    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;
      const relationshipValue = frame[relationship] as string | undefined;
      
      const newFrame = { ...frame };
      
      if (!ownerValue || !relationshipValue) {
        // Missing required parameters - respond with empty array
        newFrame[notes] = [];
        results.push(newFrame);
        continue;
      }
      
      const notesArray = await Notes._getNotesByRelationship({ owner: ownerValue, relationship: relationshipValue });
      newFrame[notes] = notesArray;
      results.push(newFrame);
    }
    
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, notes }]),
});

/**
 * Sync: Handle _getNoteByTitle request with session
 * Requires authentication - user can only see their own notes.
 */
export const GetNoteByTitleRequestWithSession: Sync = ({ request, session, user, relationship, title, noteData }) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/_getNoteByTitle", session, relationship, title },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const relationshipValue = frame[relationship] as string;
      const titleValue = frame[title] as string;
      const noteResult = await Notes._getNoteByTitle({ owner: ownerValue, relationship: relationshipValue, title: titleValue });
      
      const newFrame = { ...frame };
      newFrame[noteData] = noteResult;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, note: noteData }]),
});

/**
 * Sync: Handle _getNoteByTitle request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetNoteByTitleRequestWithOwner: Sync = ({ request, owner, relationship, title, noteData }) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/_getNoteByTitle", owner, relationship, title },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    
    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;
      const relationshipValue = frame[relationship] as string | undefined;
      const titleValue = frame[title] as string | undefined;
      
      const newFrame = { ...frame };
      
      if (!ownerValue || !relationshipValue || !titleValue) {
        // Missing required parameters - respond with null
        newFrame[noteData] = null;
        results.push(newFrame);
        continue;
      }
      
      const noteResult = await Notes._getNoteByTitle({ owner: ownerValue, relationship: relationshipValue, title: titleValue });
      newFrame[noteData] = noteResult;
      results.push(newFrame);
    }
    
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, note: noteData }]),
});

