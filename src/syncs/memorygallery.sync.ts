/**
 * Synchronizations for MemoryGallery concept
 */

import { MemoryGallery, Sessioning, Relationship, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";

/**
 * Sync: Handle uploadImage request with session
 * Requires authentication - user uploads images for themselves.
 * Also verifies that the user owns the relationship.
 */
export const UploadImageRequestWithSession: Sync = ({
  request,
  session,
  user,
  relationship,
  fileData,
  fileName,
  contentType,
  relOwner,
}) => ({
  when: actions([
    Requesting.request,
    {
      path: "/MemoryGallery/uploadImage",
      session,
      relationship,
      fileData,
      fileName,
      contentType,
    },
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
    MemoryGallery.uploadImage,
    { owner: user, relationship, fileData, fileName, contentType },
  ]),
});

/**
 * Sync: Handle uploadImage request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 * Also verifies that the user owns the relationship.
 */
export const UploadImageRequestWithOwner: Sync = ({
  request,
  owner,
  relationship,
  fileData,
  fileName,
  contentType,
  relOwner,
}) => ({
  when: actions([
    Requesting.request,
    {
      path: "/MemoryGallery/uploadImage",
      owner,
      relationship,
      fileData,
      fileName,
      contentType,
    },
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

      const relationshipData = await Relationship._getRelationship({
        relationship: relationshipValue,
      });

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
  then: actions([
    MemoryGallery.uploadImage,
    { owner, relationship, fileData, fileName, contentType },
  ]),
});

export const UploadImageResponseSuccess: Sync = ({
  request,
  uploadDate,
  imageUrl,
}) => ({
  when: actions(
    [Requesting.request, { path: "/MemoryGallery/uploadImage" }, { request }],
    [MemoryGallery.uploadImage, {}, { uploadDate, imageUrl }]
  ),
  then: actions([Requesting.respond, { request, uploadDate, imageUrl }]),
});

export const UploadImageResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/MemoryGallery/uploadImage" }, { request }],
    [MemoryGallery.uploadImage, {}, { error }]
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle addImage request with session
 * Requires authentication - user adds images for themselves.
 * Also verifies that the user owns the relationship.
 */
export const AddImageRequestWithSession: Sync = ({
  request,
  session,
  user,
  relationship,
  imageUrl,
  relOwner,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/MemoryGallery/addImage", session, relationship, imageUrl },
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
    MemoryGallery.addImage,
    { owner: user, relationship, imageUrl },
  ]),
});

/**
 * Sync: Handle addImage request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 * Also verifies that the user owns the relationship.
 */
export const AddImageRequestWithOwner: Sync = ({
  request,
  owner,
  relationship,
  imageUrl,
  relOwner,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/MemoryGallery/addImage", owner, relationship, imageUrl },
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

      const relationshipData = await Relationship._getRelationship({
        relationship: relationshipValue,
      });

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
  then: actions([MemoryGallery.addImage, { owner, relationship, imageUrl }]),
});

export const AddImageResponseSuccess: Sync = ({ request, uploadDate }) => ({
  when: actions(
    [Requesting.request, { path: "/MemoryGallery/addImage" }, { request }],
    [MemoryGallery.addImage, {}, { uploadDate }]
  ),
  then: actions([Requesting.respond, { request, uploadDate }]),
});

export const AddImageResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/MemoryGallery/addImage" }, { request }],
    [MemoryGallery.addImage, {}, { error }]
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle removeImage request with session
 * Requires authentication AND ownership verification - user can only remove their own images.
 */
export const RemoveImageRequestWithSession: Sync = ({
  request,
  session,
  user,
  imageUrl,
  owner,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/MemoryGallery/removeImage", session, imageUrl },
    { request },
  ]),
  where: async (frames: Frames) => {
    // First verify session and get the authenticated user
    let authenticatedFrames = await frames.query(
      Sessioning._getUser,
      { session },
      { user }
    );

    // Then verify ownership by checking if the image exists and belongs to the user
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const imageUrlValue = frame[imageUrl] as string;
      const userValue = frame[user] as string;

      // Check if the image exists and belongs to the user
      const images = await MemoryGallery._getImages({ owner: userValue });
      const imageExists = images.some((img) => img.imageUrl === imageUrlValue);

      if (imageExists) {
        results.push({ ...frame, owner: userValue });
      }
      // If image doesn't exist or doesn't belong to user, skip this frame (unauthorized)
    }
    return results;
  },
  then: actions([MemoryGallery.removeImage, { owner: user, imageUrl }]),
});

/**
 * Sync: Handle removeImage request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const RemoveImageRequestWithOwner: Sync = ({
  request,
  owner,
  imageUrl,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/MemoryGallery/removeImage", owner, imageUrl },
    { request },
  ]),
  then: actions([MemoryGallery.removeImage, { owner, imageUrl }]),
});

export const RemoveImageResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/MemoryGallery/removeImage" }, { request }],
    [MemoryGallery.removeImage, {}, {}]
  ),
  then: actions([Requesting.respond, { request, status: "deleted" }]),
});

export const RemoveImageResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/MemoryGallery/removeImage" }, { request }],
    [MemoryGallery.removeImage, {}, { error }]
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getImages request with session
 * Requires authentication - user can only see their own images.
 */
export const GetImagesRequestWithSession: Sync = ({
  request,
  session,
  user,
  images,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/MemoryGallery/_getImages", session },
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
      const imagesArray = await MemoryGallery._getImages({ owner: ownerValue });

      const newFrame = { ...frame };
      newFrame[images] = imagesArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, images }]),
});

/**
 * Sync: Handle _getImages request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetImagesRequestWithOwner: Sync = ({
  request,
  owner,
  images,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/MemoryGallery/_getImages", owner },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();

    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;

      const newFrame = { ...frame };

      if (!ownerValue) {
        // No owner provided - respond with empty array
        newFrame[images] = [];
        results.push(newFrame);
        continue;
      }

      const imagesArray = await MemoryGallery._getImages({ owner: ownerValue });
      newFrame[images] = imagesArray;
      results.push(newFrame);
    }

    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, images }]),
});

/**
 * Sync: Handle _getImagesByRelationship request with session
 * Requires authentication - user can only see their own images.
 */
export const GetImagesByRelationshipRequestWithSession: Sync = ({
  request,
  session,
  user,
  relationship,
  images,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/MemoryGallery/_getImagesByRelationship", session, relationship },
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
      const imagesArray = await MemoryGallery._getImagesByRelationship({
        owner: ownerValue,
        relationship: relationshipValue,
      });

      const newFrame = { ...frame };
      newFrame[images] = imagesArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, images }]),
});

/**
 * Sync: Handle _getImagesByRelationship request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetImagesByRelationshipRequestWithOwner: Sync = ({
  request,
  owner,
  relationship,
  images,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/MemoryGallery/_getImagesByRelationship", owner, relationship },
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
        newFrame[images] = [];
        results.push(newFrame);
        continue;
      }

      const imagesArray = await MemoryGallery._getImagesByRelationship({
        owner: ownerValue,
        relationship: relationshipValue,
      });
      newFrame[images] = imagesArray;
      results.push(newFrame);
    }

    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, images }]),
});
