/**
 * Synchronizations for OccasionNotes concept
 */

import {
  OccasionNotes,
  Occasion,
  Sessioning,
  Requesting,
  Collaborators,
} from "@concepts";
import { actions, Frames, Sync } from "@engine";
import { ID } from "@utils/types.ts";
import { getDb } from "@utils/database.ts";

/**
 * Sync: Handle create shared occasion note with session.
 * Requires authentication and user must own the occasion or be a collaborator.
 */
export const CreateOccasionNoteRequest: Sync = ({
  request,
  session,
  user,
  occasionId,
  title,
  content,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/OccasionNotes/createNote", session, occasionId, title, content },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Get the request record to extract input fields
    const requestValue = frames[0]?.[request] as ID | undefined;
    if (!requestValue) {
      console.error("[CreateOccasionNoteRequest] No request ID in frame");
      return frames;
    }

    // Query the database directly for the request document
    const [db] = await getDb();
    const requestsCollection = db.collection("Requesting.requests");
    const requestDoc = await requestsCollection.findOne({ _id: requestValue });

    if (!requestDoc) {
      console.error(
        "[CreateOccasionNoteRequest] Request not found in database"
      );
      return frames;
    }

    // Extract fields from request input
    const input = requestDoc.input as Record<string, unknown>;
    const sessionValue = input.session as ID | undefined;
    const userFromRequest = input.user as ID | undefined;
    const occasionIdValue = input.occasionId as ID | undefined;
    const titleValue = input.title as string | undefined;
    const contentValue = input.content as string | undefined;

    console.log("[CreateOccasionNoteRequest] Extracted values:", {
      sessionValue,
      userFromRequest,
      occasionIdValue,
      titleValue,
      contentValue,
    });

    // Try to get user from session first, fallback to user from request body
    let authenticatedUser: ID | undefined = undefined;

    if (sessionValue) {
      const userFromSession = await Sessioning._getUser({
        session: sessionValue,
      });
      if (userFromSession) {
        authenticatedUser = userFromSession;
        console.log(
          "[CreateOccasionNoteRequest] Got user from session:",
          authenticatedUser
        );
      }
    }

    // Fallback to user from request body if session didn't provide one
    if (!authenticatedUser && userFromRequest) {
      authenticatedUser = userFromRequest;
      console.log(
        "[CreateOccasionNoteRequest] Using user from request body:",
        authenticatedUser
      );
    }

    if (!authenticatedUser) {
      console.error(
        "[CreateOccasionNoteRequest] Could not resolve user - need either session or user in request"
      );
      return frames;
    }

    if (!occasionIdValue || !titleValue || !contentValue) {
      console.error("[CreateOccasionNoteRequest] Missing required parameters");
      return frames;
    }

    const results: Frames = new Frames();
    const occasionData = await Occasion._getOccasion({
      occasion: occasionIdValue,
    });

    if (!occasionData) {
      console.error("[CreateOccasionNoteRequest] Occasion not found");
      return frames;
    }

    const isCollaborator = await Collaborators._isCollaboratorOnOccasion({
      user: authenticatedUser,
      occasionId: occasionIdValue,
    });

    if (occasionData.owner === authenticatedUser || isCollaborator) {
      // Create a frame with all the necessary values
      const newFrame = { ...frames[0] };
      newFrame[user] = authenticatedUser;
      newFrame[occasionId] = occasionIdValue;
      newFrame[title] = titleValue;
      newFrame[content] = contentValue;
      results.push(newFrame);
    } else {
      console.error(
        "[CreateOccasionNoteRequest] User is not owner or collaborator"
      );
    }

    return results;
  },
  then: actions([
    OccasionNotes.createNote,
    { author: user, occasionId, title, content },
  ]),
});

export const CreateOccasionNoteResponseSuccess: Sync = ({ request, note }) => ({
  when: actions(
    [Requesting.request, { path: "/OccasionNotes/createNote" }, { request }],
    [OccasionNotes.createNote, {}, { note }]
  ),
  then: actions([Requesting.respond, { request, note }]),
});

export const CreateOccasionNoteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/OccasionNotes/createNote" }, { request }],
    [OccasionNotes.createNote, {}, { error }]
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle update shared occasion note.
 * Requires authentication and user must be the author or the occasion owner.
 */
export const UpdateOccasionNoteRequest: Sync = ({
  request,
  session,
  user,
  note,
  title,
  content,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/OccasionNotes/updateNote", session, note, title, content },
    { request },
  ]),
  where: async (frames: Frames) => {
    const authenticatedFrames = await frames.query(
      Sessioning._getUser,
      { session },
      { user }
    );

    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const noteValue = frame[note] as ID;
      const userValue = frame[user] as ID;
      const noteData = await OccasionNotes._getNote({ note: noteValue });
      if (!noteData) continue;

      const occasionData = await Occasion._getOccasion({
        occasion: noteData.occasionId,
      });
      if (!occasionData) continue;

      const isAuthor = noteData.author === userValue;
      const isOwner = occasionData.owner === userValue;

      if (isAuthor || isOwner) {
        results.push({ ...frame });
      }
    }

    return results;
  },
  then: actions([OccasionNotes.updateNote, { note, title, content }]),
});

export const UpdateOccasionNoteResponseSuccess: Sync = ({ request, note }) => ({
  when: actions(
    [Requesting.request, { path: "/OccasionNotes/updateNote" }, { request }],
    [OccasionNotes.updateNote, {}, { note }]
  ),
  then: actions([Requesting.respond, { request, note }]),
});

export const UpdateOccasionNoteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/OccasionNotes/updateNote" }, { request }],
    [OccasionNotes.updateNote, {}, { error }]
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle delete shared occasion note.
 * Requires authentication and user must be the author or the occasion owner.
 */
export const DeleteOccasionNoteRequest: Sync = ({
  request,
  session,
  user,
  note,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/OccasionNotes/deleteNote", session, note },
    { request },
  ]),
  where: async (frames: Frames) => {
    const authenticatedFrames = await frames.query(
      Sessioning._getUser,
      { session },
      { user }
    );

    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const noteValue = frame[note] as ID;
      const userValue = frame[user] as ID;
      const noteData = await OccasionNotes._getNote({ note: noteValue });
      if (!noteData) continue;

      const occasionData = await Occasion._getOccasion({
        occasion: noteData.occasionId,
      });
      if (!occasionData) continue;

      const isAuthor = noteData.author === userValue;
      const isOwner = occasionData.owner === userValue;

      if (isAuthor || isOwner) {
        results.push({ ...frame });
      }
    }

    return results;
  },
  then: actions([OccasionNotes.deleteNote, { note }]),
});

export const DeleteOccasionNoteResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/OccasionNotes/deleteNote" }, { request }],
    [OccasionNotes.deleteNote, {}, { error }]
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Get notes for an occasion (authenticated).
 * Requires authentication and user must own or collaborate on the occasion.
 */
export const GetOccasionNotesRequest: Sync = ({
  request,
  session,
  user,
  occasionId,
  notes,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/OccasionNotes/_getNotesByOccasion", session, occasionId },
    { request },
  ]),
  where: async (frames: Frames) => {
    const authenticatedFrames = await frames.query(
      Sessioning._getUser,
      { session },
      { user }
    );

    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const occasionValue = frame[occasionId] as ID;
      const userValue = frame[user] as ID;

      const occasionData = await Occasion._getOccasion({
        occasion: occasionValue,
      });
      if (!occasionData) continue;

      const isCollaborator = await Collaborators._isCollaboratorOnOccasion({
        user: userValue,
        occasionId: occasionValue,
      });

      if (occasionData.owner === userValue || isCollaborator) {
        const occasionNotes = await OccasionNotes._getNotesByOccasion({
          occasionId: occasionValue,
        });
        results.push({ ...frame, [notes]: occasionNotes });
      }
    }

    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, notes }]),
});
