/**
 * The Requesting concept exposes passthrough routes by default,
 * which allow POSTs to the route:
 *
 * /{REQUESTING_BASE_URL}/{Concept name}/{action or query}
 *
 * to passthrough directly to the concept action or query.
 * This is a convenient and natural way to expose concepts to
 * the world, but should only be done intentionally for public
 * actions and queries.
 *
 * This file allows you to explicitly set inclusions and exclusions
 * for passthrough routes:
 * - inclusions: those that you can justify their inclusion
 * - exclusions: those to exclude, using Requesting routes instead
 */

/**
 * INCLUSIONS
 *
 * Each inclusion must include a justification for why you think
 * the passthrough is appropriate (e.g. public query).
 *
 * inclusions = {"route": "justification"}
 */

export const inclusions: Record<string, string> = {
  // UserAuth - public authentication actions
  "/api/UserAuth/register": "public action - anyone can register",
  "/api/UserAuth/login": "public action - anyone can login",
};

/**
 * EXCLUSIONS
 *
 * Excluded routes fall back to the Requesting concept, and will
 * instead trigger the normal Requesting.request action. As this
 * is the intended behavior, no justification is necessary.
 *
 * exclusions = ["route"]
 */

export const exclusions: Array<string> = [
  // UserAuth - protected query
  "/api/UserAuth/_getUserByUsername",
  // Sessioning - all routes should be handled via syncs
  "/api/Sessioning/create",
  "/api/Sessioning/delete",
  "/api/Sessioning/_getUser",
  // Profile - all routes require authentication
  "/api/Profile/createProfile",
  "/api/Profile/updateName",
  "/api/Profile/deleteProfile",
  "/api/Profile/_getProfile",
  "/api/Profile/_getName",
  // Relationship - all routes require authentication
  "/api/Relationship/createRelationship",
  "/api/Relationship/updateRelationship",
  "/api/Relationship/deleteRelationship",
  "/api/Relationship/_getRelationship",
  "/api/Relationship/_getRelationships",
  "/api/Relationship/_getRelationshipByName",
  // Notes - all routes require authentication
  "/api/Notes/createNote",
  "/api/Notes/updateNote",
  "/api/Notes/deleteNote",
  "/api/Notes/_getNote",
  "/api/Notes/_getNotes",
  "/api/Notes/_getNotesByRelationship",
  "/api/Notes/_getNoteByTitle",
  // Occasion - all routes require authentication
  "/api/Occasion/createOccasion",
  "/api/Occasion/updateOccasion",
  "/api/Occasion/deleteOccasion",
  "/api/Occasion/_getOccasion",
  "/api/Occasion/_getOccasions",
  "/api/Occasion/_getOccasionsByPerson",
  "/api/Occasion/_getOccasionsByDate",
  // MemoryGallery - all routes require authentication
  "/api/MemoryGallery/uploadImage",
  "/api/MemoryGallery/addImage",
  "/api/MemoryGallery/removeImage",
  "/api/MemoryGallery/_getImages",
  "/api/MemoryGallery/_getImagesByRelationship",
  // Task - all routes require authentication
  "/api/Task/createTask",
  "/api/Task/updateTaskDescription",
  "/api/Task/deleteTask",
  "/api/Task/_getTask",
  "/api/Task/_getTasks",
  // TaskChecklist - all routes require authentication
  "/api/TaskChecklist/addTask",
  "/api/TaskChecklist/removeTask",
  "/api/TaskChecklist/markComplete",
  "/api/TaskChecklist/markIncomplete",
  "/api/TaskChecklist/_getChecklistEntry",
  "/api/TaskChecklist/_getChecklist",
  "/api/TaskChecklist/_getCompletedTasks",
  "/api/TaskChecklist/_getIncompleteTasks",
  // SuggestionEngine - all routes require authentication
  "/api/SuggestionEngine/generateSuggestion",
  "/api/SuggestionEngine/_getSuggestions",
  // Collaborators - all routes require authentication
  "/api/Collaborators/addCollaborator",
  "/api/Collaborators/removeCollaborator",
  "/api/Collaborators/_getCollaborators",
  "/api/Collaborators/_hasCollaborator",
];
