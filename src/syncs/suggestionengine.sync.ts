/**
 * Synchronizations for SuggestionEngine concept
 */

import { SuggestionEngine, Sessioning, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";

/**
 * Sync: Handle generateSuggestion request with session
 * Requires authentication - user generates suggestions for themselves.
 */
export const GenerateSuggestionRequestWithSession: Sync = ({ request, session, user, context }) => ({
  when: actions([
    Requesting.request,
    { path: "/SuggestionEngine/generateSuggestion", session, context },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who becomes the owner)
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([SuggestionEngine.generateSuggestion, { owner: user, context }]),
});

/**
 * Sync: Handle generateSuggestion request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GenerateSuggestionRequestWithOwner: Sync = ({ request, owner, context }) => ({
  when: actions([
    Requesting.request,
    { path: "/SuggestionEngine/generateSuggestion", owner, context },
    { request },
  ]),
  then: actions([SuggestionEngine.generateSuggestion, { owner, context }]),
});

export const GenerateSuggestionResponseSuccess: Sync = ({ request, suggestion, content }) => ({
  when: actions(
    [Requesting.request, { path: "/SuggestionEngine/generateSuggestion" }, { request }],
    [SuggestionEngine.generateSuggestion, {}, { suggestion, content }],
  ),
  then: actions([Requesting.respond, { request, suggestion, content }]),
});

export const GenerateSuggestionResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/SuggestionEngine/generateSuggestion" }, { request }],
    [SuggestionEngine.generateSuggestion, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getSuggestions request with session
 * Requires authentication - user can only see their own suggestions.
 */
export const GetSuggestionsRequestWithSession: Sync = ({ request, session, user, suggestions }) => ({
  when: actions([
    Requesting.request,
    { path: "/SuggestionEngine/_getSuggestions", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const suggestionsArray = await SuggestionEngine._getSuggestions({ owner: ownerValue });
      
      const newFrame = { ...frame };
      newFrame[suggestions] = suggestionsArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, suggestions }]),
});

/**
 * Sync: Handle _getSuggestions request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetSuggestionsRequestWithOwner: Sync = ({ request, owner, suggestions }) => ({
  when: actions([
    Requesting.request,
    { path: "/SuggestionEngine/_getSuggestions", owner },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    
    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;
      
      const newFrame = { ...frame };
      
      if (!ownerValue) {
        // No owner provided - respond with empty array
        newFrame[suggestions] = [];
        results.push(newFrame);
        continue;
      }
      
      const suggestionsArray = await SuggestionEngine._getSuggestions({ owner: ownerValue });
      newFrame[suggestions] = suggestionsArray;
      results.push(newFrame);
    }
    
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, suggestions }]),
});

