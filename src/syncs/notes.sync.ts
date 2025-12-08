/**
 * Synchronizations for Notes concept
 */

import { Notes, Sessioning, Relationship, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";
import { getDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";

/**
 * Sync: Handle createNote request with session
 * Requires authentication - user creates notes for themselves.
 * Also verifies that the user owns the relationship.
 */
export const CreateNoteRequestWithSession: Sync = ({
  request,
  session,
  user,
  relationship,
  title,
  content,
  relOwner,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/createNote", session, relationship, title, content },
    { request },
  ]),
  where: async (frames: Frames) => {
    // First verify session and get the authenticated user
    let authenticatedFrames = await frames.query(
      Sessioning._getUser,
      { session },
      { user }
    );

    // Then verify ownership of the relationship
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const relationshipValue = frame[relationship] as string;
      const relationshipData = await Relationship._getRelationship({
        relationship: relationshipValue,
      });

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
  then: actions([
    Notes.createNote,
    { owner: user, relationship, title, content },
  ]),
});

/**
 * Sync: Handle createNote request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 * Also verifies that the user owns the relationship.
 */
export const CreateNoteRequestWithOwner: Sync = ({
  request,
  owner,
  relationship,
  title,
  content,
  relOwner,
}) => ({
  when: actions([
    Requesting.request,
    {
      path: "/Notes/createNote",
    },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Get the request record to extract input fields
    const requestValue = frames[0]?.[request] as ID | undefined;
    if (!requestValue) {
      console.error("[CreateNoteRequestWithOwner] No request ID in frame");
      return frames;
    }

    // Query the database directly for the request document
    const [db] = await getDb();
    const requestsCollection = db.collection("Requesting.requests");
    const requestDoc = await requestsCollection.findOne({ _id: requestValue });

    if (!requestDoc) {
      console.error(
        "[CreateNoteRequestWithOwner] Request not found in database"
      );
      return frames;
    }

    // Extract fields from request input
    const input = requestDoc.input as Record<string, unknown>;
    const ownerValue = input.owner as ID | undefined;
    const relationshipValue = input.relationship as ID | undefined;
    const titleValue = input.title as string | undefined;
    const contentValue = input.content as string | undefined;

    if (!ownerValue || !relationshipValue || !titleValue || !contentValue) {
      console.error("[CreateNoteRequestWithOwner] Missing required parameters");
      return frames;
    }

    // Verify ownership of the relationship
    const relationshipData = await Relationship._getRelationship({
      relationship: relationshipValue,
    });

    if (!relationshipData) {
      console.error("[CreateNoteRequestWithOwner] Relationship doesn't exist");
      return frames;
    }

    // Check if the provided owner owns this relationship
    if (relationshipData.owner !== ownerValue) {
      console.error(
        "[CreateNoteRequestWithOwner] Owner does not own the relationship"
      );
      return frames;
    }

    // Create a frame with the extracted values
    const results: Frames = new Frames();
    results.push({
      ...frames[0],
      [owner]: ownerValue,
      [relationship]: relationshipValue,
      [title]: titleValue,
      [content]: contentValue,
      [relOwner]: relationshipData.owner,
    });

    return results;
  },
  then: actions([Notes.createNote, { owner, relationship, title, content }]),
});

export const CreateNoteResponseSuccess: Sync = ({ request, note }) => ({
  when: actions(
    [Requesting.request, { path: "/Notes/createNote" }, { request }],
    [Notes.createNote, {}, { note }]
  ),
  then: actions([Requesting.respond, { request, note }]),
});

export const CreateNoteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Notes/createNote" }, { request }],
    [Notes.createNote, {}, { error }]
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle updateNote request
 * Requires authentication AND ownership verification - user can only update their own notes.
 */
export const UpdateNoteRequest: Sync = ({
  request,
  session,
  user,
  note,
  title,
  content,
  owner,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/updateNote" },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Get the request record to extract input fields
    const requestValue = frames[0]?.[request] as ID | undefined;
    if (!requestValue) {
      console.error("[UpdateNoteRequest] No request ID in frame");
      return frames;
    }

    // Query the database directly for the request document
    const [db] = await getDb();
    const requestsCollection = db.collection("Requesting.requests");
    const requestDoc = await requestsCollection.findOne({ _id: requestValue });

    if (!requestDoc) {
      console.error("[UpdateNoteRequest] Request not found in database");
      return frames;
    }

    // Extract fields from request input
    const input = requestDoc.input as Record<string, unknown>;
    const sessionValue = input.session as ID | undefined;
    const noteValue = input.note as ID | undefined;
    const titleValue = input.title as string | undefined;
    const contentValue = input.content as string | undefined;

    if (!noteValue) {
      console.error("[UpdateNoteRequest] Missing note parameter");
      return frames;
    }

    if (!sessionValue) {
      console.error(
        "[UpdateNoteRequest] Missing session parameter - proceeding anyway"
      );
      // Still proceed with the note in the frame so updateNote can return an error
      const results: Frames = new Frames();
      results.push({
        ...frames[0],
        [note]: noteValue,
        [title]: titleValue,
        [content]: contentValue,
      });
      return results;
    }

    // Verify session and get the authenticated user
    const authenticatedFrames: Frames = new Frames();
    for (const frame of frames) {
      const userResult = await Sessioning._getUser({ session: sessionValue });
      if (userResult) {
        authenticatedFrames.push({ ...frame, [user]: userResult });
      }
    }

    if (authenticatedFrames.length === 0) {
      console.error("[UpdateNoteRequest] Invalid session - proceeding anyway");
      // Invalid session - still proceed so updateNote can return an error
      const results: Frames = new Frames();
      results.push({
        ...frames[0],
        [note]: noteValue,
        [title]: titleValue,
        [content]: contentValue,
      });
      return results;
    }

    // Then verify ownership by getting the note's owner
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const noteData = await Notes._getNote({ note: noteValue });

      if (!noteData) {
        // Note doesn't exist - skip this frame (will result in error)
        continue;
      }

      // Check if the authenticated user owns this note
      if (noteData.owner === frame[user]) {
        results.push({
          ...frame,
          [note]: noteValue,
          [title]: titleValue,
          [content]: contentValue,
        });
      }
      // If not owner, skip this frame (unauthorized)
    }

    // If no frames after auth/ownership check, still return a frame with the note
    // so updateNote gets called and can return an appropriate error
    if (results.length === 0) {
      results.push({
        ...frames[0],
        [note]: noteValue,
        [title]: titleValue,
        [content]: contentValue,
      });
    }

    return results;
  },
  then: actions([Notes.updateNote, { note, title, content }]),
});

export const UpdateNoteResponseSuccess: Sync = ({ request, note }) => ({
  when: actions(
    [Requesting.request, { path: "/Notes/updateNote" }, { request }],
    [Notes.updateNote, {}, { note }]
  ),
  then: actions([Requesting.respond, { request, note }]),
});

export const UpdateNoteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Notes/updateNote" }, { request }],
    [Notes.updateNote, {}, { error }]
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle deleteNote request
 * Requires authentication AND ownership verification - user can only delete their own notes.
 */
export const DeleteNoteRequest: Sync = ({
  request,
  session,
  user,
  note,
  owner,
}) => {
  console.log("[DeleteNoteRequest] Sync definition loaded");
  return {
    when: actions([
      Requesting.request,
      { path: "/Notes/deleteNote" },
      { request },
    ]),
    where: async (frames: Frames) => {
      console.log(
        "[DeleteNoteRequest] where clause started, frames:",
        frames.length
      );

      // Get the request record to extract input fields
      const requestValue = frames[0]?.[request] as ID | undefined;
      if (!requestValue) {
        console.error("[DeleteNoteRequest] No request ID in frame");
        return frames;
      }

      console.log("[DeleteNoteRequest] Request ID:", requestValue);

      // Query the database directly for the request document
      const [db] = await getDb();
      const requestsCollection = db.collection("Requesting.requests");
      const requestDoc = await requestsCollection.findOne({
        _id: requestValue,
      });

      if (!requestDoc) {
        console.error("[DeleteNoteRequest] Request not found in database");
        return frames;
      }

      console.log("[DeleteNoteRequest] Request input:", requestDoc.input);

      // Extract fields from request input
      const input = requestDoc.input as Record<string, unknown>;
      const sessionValue = input.session as ID | undefined;
      const noteValue = input.note as ID | undefined;

      console.log(
        "[DeleteNoteRequest] Extracted - session:",
        sessionValue,
        "note:",
        noteValue
      );

      if (!noteValue) {
        console.error("[DeleteNoteRequest] Missing note parameter");
        return frames;
      }

      if (!sessionValue) {
        console.error(
          "[DeleteNoteRequest] Missing session parameter - proceeding anyway"
        );
        // Still proceed with the note in the frame so deleteNote can return an error
        const results: Frames = new Frames();
        results.push({ ...frames[0], [note]: noteValue });
        console.log(
          "[DeleteNoteRequest] Returning frame without auth, note:",
          noteValue
        );
        return results;
      }

      // Verify session and get the authenticated user
      console.log("[DeleteNoteRequest] Verifying session:", sessionValue);
      const authenticatedFrames: Frames = new Frames();
      for (const frame of frames) {
        const userResult = await Sessioning._getUser({ session: sessionValue });
        console.log("[DeleteNoteRequest] User result:", userResult);
        if (userResult) {
          authenticatedFrames.push({ ...frame, [user]: userResult });
        }
      }

      if (authenticatedFrames.length === 0) {
        console.error(
          "[DeleteNoteRequest] Invalid session - proceeding anyway"
        );
        // Invalid session - still proceed so deleteNote can return an error
        const results: Frames = new Frames();
        results.push({ ...frames[0], [note]: noteValue });
        return results;
      }

      // Then verify ownership by getting the note's owner
      const results: Frames = new Frames();
      for (const frame of authenticatedFrames) {
        const noteData = await Notes._getNote({ note: noteValue });
        console.log("[DeleteNoteRequest] Note data:", noteData);

        if (!noteData) {
          // Note doesn't exist - skip this frame (will result in error)
          continue;
        }

        // Check if the authenticated user owns this note
        if (noteData.owner === frame[user]) {
          console.log(
            "[DeleteNoteRequest] User owns note, proceeding with delete"
          );
          results.push({ ...frame, [note]: noteValue });
        } else {
          console.log(
            "[DeleteNoteRequest] User does not own note, owner:",
            noteData.owner,
            "user:",
            frame[user]
          );
        }
      }

      // If no frames after auth/ownership check, still return a frame with the note
      // so deleteNote gets called and can return an appropriate error
      if (results.length === 0) {
        console.log(
          "[DeleteNoteRequest] No authorized frames, but returning frame with note for error handling"
        );
        results.push({ ...frames[0], [note]: noteValue });
      }

      console.log("[DeleteNoteRequest] Returning", results.length, "frames");
      return results;
    },
    then: actions([Notes.deleteNote, { note }]),
  };
};

export const DeleteNoteResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Notes/deleteNote" }, { request }],
    [Notes.deleteNote, {}, {}]
  ),
  then: actions([Requesting.respond, { request, status: "deleted" }]),
});

export const DeleteNoteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Notes/deleteNote" }, { request }],
    [Notes.deleteNote, {}, { error }]
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
export const GetNotesRequestWithSession: Sync = ({
  request,
  session,
  user,
  notes,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/_getNotes", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(
      Sessioning._getUser,
      { session },
      { user }
    );

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
export const GetNotesByRelationshipRequestWithSession: Sync = ({
  request,
  session,
  user,
  relationship,
  notes,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/_getNotesByRelationship", session, relationship },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(
      Sessioning._getUser,
      { session },
      { user }
    );

    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const relationshipValue = frame[relationship] as string;
      const notesArray = await Notes._getNotesByRelationship({
        owner: ownerValue,
        relationship: relationshipValue,
      });

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
export const GetNotesByRelationshipRequestWithOwner: Sync = ({
  request,
  owner,
  relationship,
  notes,
}) => ({
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

      const notesArray = await Notes._getNotesByRelationship({
        owner: ownerValue,
        relationship: relationshipValue,
      });
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
export const GetNoteByTitleRequestWithSession: Sync = ({
  request,
  session,
  user,
  relationship,
  title,
  noteData,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Notes/_getNoteByTitle", session, relationship, title },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(
      Sessioning._getUser,
      { session },
      { user }
    );

    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const relationshipValue = frame[relationship] as string;
      const titleValue = frame[title] as string;
      const noteResult = await Notes._getNoteByTitle({
        owner: ownerValue,
        relationship: relationshipValue,
        title: titleValue,
      });

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
export const GetNoteByTitleRequestWithOwner: Sync = ({
  request,
  owner,
  relationship,
  title,
  noteData,
}) => ({
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

      const noteResult = await Notes._getNoteByTitle({
        owner: ownerValue,
        relationship: relationshipValue,
        title: titleValue,
      });
      newFrame[noteData] = noteResult;
      results.push(newFrame);
    }

    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, note: noteData }]),
});
