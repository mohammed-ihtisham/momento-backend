/**
 * Synchronizations for Profile concept
 */

import { Profile, Sessioning, Requesting, UserAuth } from "@concepts";
import { actions, Frames, Sync } from "@engine";

/**
 * Sync: Handle createProfile request
 * Requires authentication - user can only create their own profile.
 */
export const CreateProfileRequest: Sync = ({ request, session, user, name }) => ({
  when: actions([
    Requesting.request,
    { path: "/Profile/createProfile", session, name },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([Profile.createProfile, { user, name }]),
});

export const CreateProfileResponse: Sync = ({ request, profile, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Profile/createProfile" }, { request }],
    [Profile.createProfile, {}, { profile, error }],
  ),
  then: actions([Requesting.respond, { request, profile, error }]),
});

/**
 * Sync: Auto-create profile on registration
 * Automatically creates an empty profile when a user registers.
 * This triggers when UserAuth.register succeeds.
 */
export const CreateProfileOnRegister: Sync = ({ user }) => ({
  when: actions([UserAuth.register, {}, { user }]),
  then: actions([Profile.createProfile, { user, name: "" }]),
});

/**
 * Sync: Handle updateName request
 * Requires authentication - user can only update their own profile name.
 */
export const UpdateNameRequest: Sync = ({ request, session, user, name }) => ({
  when: actions([
    Requesting.request,
    { path: "/Profile/updateName", session, name },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([Profile.updateName, { user, name }]),
});

export const UpdateNameResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Profile/updateName" }, { request }],
    [Profile.updateName, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle deleteProfile request
 * Requires authentication - user can only delete their own profile.
 */
export const DeleteProfileRequest: Sync = ({ request, session, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/Profile/deleteProfile", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([Profile.deleteProfile, { user }]),
});

export const DeleteProfileResponse: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Profile/deleteProfile" }, { request }],
    [Profile.deleteProfile, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getProfile request
 * Can be called with or without authentication.
 * Returns profile information for the specified user.
 */
export const GetProfileRequest: Sync = ({ request, user, profile }) => ({
  when: actions([
    Requesting.request,
    { path: "/Profile/_getProfile", user },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    for (const frame of frames) {
      // Get the user value from the frame (bound from the request input)
      const userValue = frame[user] as string | undefined;
      
      // Create a new frame with the profile result
      const newFrame = { ...frame };
      
      if (!userValue) {
        // No user provided - respond with null profile
        newFrame[profile] = null;
        results.push(newFrame);
        continue;
      }
      
      try {
        // Call the query and handle the result
        const profileResult = await Profile._getProfile({ user: userValue });
        // Always respond, even if null - use symbol key to set the value
        newFrame[profile] = profileResult;
        results.push(newFrame);
      } catch (error) {
        // Error calling query - respond with null and log error
        console.error("Error in GetProfileRequest:", error);
        newFrame[profile] = null;
        results.push(newFrame);
      }
    }
    return results.length > 0 ? results : frames; // Ensure we always return at least the original frames
  },
  then: actions([Requesting.respond, { request, profile }]),
});

/**
 * Sync: Handle _getName request
 * Can be called with or without authentication.
 * Returns the name for the specified user.
 */
export const GetNameRequest: Sync = ({ request, user, name }) => ({
  when: actions([
    Requesting.request,
    { path: "/Profile/_getName", user },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    for (const frame of frames) {
      // Get the user value from the frame (bound from the request input)
      const userValue = frame[user] as string | undefined;
      
      // Create a new frame with the name result
      const newFrame = { ...frame };
      
      if (!userValue) {
        // No user provided - respond with null name
        newFrame[name] = null;
        results.push(newFrame);
        continue;
      }
      
      try {
        // Call the query and handle the result
        const nameResult = await Profile._getName({ user: userValue });
        // Always respond, even if null - use symbol key to set the value
        newFrame[name] = nameResult;
        results.push(newFrame);
      } catch (error) {
        // Error calling query - respond with null and log error
        console.error("Error in GetNameRequest:", error);
        newFrame[name] = null;
        results.push(newFrame);
      }
    }
    return results.length > 0 ? results : frames; // Ensure we always return at least the original frames
  },
  then: actions([Requesting.respond, { request, name }]),
});

