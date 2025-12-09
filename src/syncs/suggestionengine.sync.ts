/**
 * Synchronizations for SuggestionEngine concept
 */

import { SuggestionEngine, Sessioning, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";

/**
 * Sync: Handle generateSuggestion request with session
 * Requires authentication - user generates suggestions for themselves.
 */
export const GenerateSuggestionRequestWithSession: Sync = ({
  request,
  session,
  user,
  context,
  occasion,
}) => ({
  when: actions([
    Requesting.request,
    {
      path: "/SuggestionEngine/generateSuggestion",
      session,
      context,
      occasion,
    },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who becomes the owner)
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([
    SuggestionEngine.generateSuggestion,
    { owner: user, context, occasionId: occasion },
  ]),
});

/**
 * Sync: Handle generateSuggestion request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GenerateSuggestionRequestWithOwner: Sync = ({
  request,
  owner,
  context,
  occasion,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/SuggestionEngine/generateSuggestion", owner, context, occasion },
    { request },
  ]),
  then: actions([
    SuggestionEngine.generateSuggestion,
    { owner, context, occasionId: occasion },
  ]),
});

export const GenerateSuggestionResponseSuccess: Sync = ({
  request,
  suggestion,
  content,
}) => ({
  when: actions(
    [
      Requesting.request,
      { path: "/SuggestionEngine/generateSuggestion" },
      { request },
    ],
    [SuggestionEngine.generateSuggestion, {}, { suggestion, content }]
  ),
  then: actions([Requesting.respond, { request, suggestion, content }]),
});

export const GenerateSuggestionResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [
      Requesting.request,
      { path: "/SuggestionEngine/generateSuggestion" },
      { request },
    ],
    [SuggestionEngine.generateSuggestion, {}, { error }]
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getSuggestions request with session
 * Requires authentication - user can see suggestions for a specific occasion.
 */
export const GetSuggestionsRequestWithSession: Sync = ({
  request,
  session,
  user,
  occasion,
  suggestions,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/SuggestionEngine/_getSuggestions", session, occasion },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user
    const authenticatedFrames = await frames.query(
      Sessioning._getUser,
      { session },
      { user }
    );

    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const occasionValue = frame[occasion] as string;
      if (!occasionValue) {
        const newFrame = { ...frame };
        newFrame[suggestions] = [];
        results.push(newFrame);
        continue;
      }
      const suggestionsArray = await SuggestionEngine._getSuggestions({
        occasionId: occasionValue,
      });

      const newFrame = { ...frame };
      newFrame[suggestions] = suggestionsArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, suggestions }]),
});

/**
 * Sync: Handle _getSuggestions request with occasionId
 * Accepts occasionId directly.
 */
export const GetSuggestionsRequestWithOccasion: Sync = ({
  request,
  occasion,
  suggestions,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/SuggestionEngine/_getSuggestions", occasion },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();

    for (const frame of frames) {
      const occasionValue = frame[occasion] as string | undefined;

      const newFrame = { ...frame };

      if (!occasionValue) {
        // No occasionId provided - respond with empty array
        newFrame[suggestions] = [];
        results.push(newFrame);
        continue;
      }

      const suggestionsArray = await SuggestionEngine._getSuggestions({
        occasionId: occasionValue,
      });
      newFrame[suggestions] = suggestionsArray;
      results.push(newFrame);
    }

    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, suggestions }]),
});
