# All Synchronizations

This document contains all necessary synchronizations for Momento to function as a relationship dashboard application. Synchronizations are organized by feature area and follow the declarative when/where/then pattern.

## Overview

The synchronizations in this document cover:

1. **Authentication & Session Management**: User registration, login, logout, and automatic profile creation
2. **Relationship Management**: CRUD operations for relationships with access control
3. **Notes Management**: Creating and managing notes associated with relationships
4. **Memory Gallery**: Managing images associated with relationships
5. **Occasion Management**: Creating and managing occasions (birthdays, holidays, etc.), including creating tasks for occasions
6. **Task Management**: Creating and managing tasks for planning
7. **Task Checklist**: Tracking task completion status, including tasks associated with occasions
8. **Collaborators**: Managing collaborators for collaborative planning
9. **Suggestion Engine**: Generating personalized suggestions based on relationship context or occasion context
10. **Profile Management**: Updating user profile information
11. **Query Endpoints**: Synchronizations for retrieving collections of data, including occasion-related queries

Each feature typically includes:
- Request sync: Handles incoming HTTP requests via Requesting concept
- Response sync: Handles successful responses back to the client
- Error sync: Handles error responses (where applicable)
- Access control: Ensures users can only access/modify their own data via session validation

## Authentication & Session Management

//-- User Registration --//

sync RegisterRequest
when
    Requesting.request (path: "/UserAuthentication/register", username, password): (request)
then
    UserAuthentication.register (username, password)

sync RegisterResponseSuccess
when
    Requesting.request (path: "/UserAuthentication/register"): (request)
    UserAuthentication.register (): (user)
then
    Requesting.respond (request, user)

sync RegisterResponseError
when
    Requesting.request (path: "/UserAuthentication/register"): (request)
    UserAuthentication.register (): (error)
then
    Requesting.respond (request, error)

//-- Auto-Create Profile on Registration --//

sync CreateProfileOnRegister
when
    UserAuthentication.register (): (user)
then
    Profile.createProfile (user, name: "", email: "")

//-- User Login & Session Creation (Composite Action) --//

sync LoginRequest
when
    Requesting.request (path: "/login", username, password): (request)
then
    UserAuthentication.login (username, password)

sync LoginSuccessCreatesSession
when
    UserAuthentication.login (): (user)
then
    Sessioning.create (user)

sync LoginResponseSuccess
when
    Requesting.request (path: "/login"): (request)
    // We match on the login success and the subsequent session creation it caused
    UserAuthentication.login (): (user)
    Sessioning.create (user): (session)
then
    Requesting.respond (request, session)

sync LoginResponseError
when
    Requesting.request (path: "/login"): (request)
    UserAuthentication.login (): (error)
then
    Requesting.respond (request, error)

//-- User Logout --//

sync LogoutRequest
when
    Requesting.request (path: "/logout", session): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    Sessioning.delete (session)

sync LogoutResponse
when
    Requesting.request (path: "/logout"): (request)
    Sessioning.delete (): ()
then
    Requesting.respond (request, status: "logged_out")

## Relationship Management

//-- Create Relationship --//

sync CreateRelationshipRequest
when
    Requesting.request (path: "/Relationship/createRelationship", session, name, relationshipType): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    Relationship.createRelationship (owner: user, name, relationshipType)

sync CreateRelationshipResponse
when
    Requesting.request (path: "/Relationship/createRelationship"): (request)
    Relationship.createRelationship (): (relationship)
then
    Requesting.respond (request, relationship)

//-- Update Relationship --//

sync UpdateRelationshipRequest
when
    Requesting.request (path: "/Relationship/updateRelationship", session, relationship, name?, relationshipType?): (request)
where
    // Authorize the request: user must own the relationship
    in Sessioning: _getUser(session) gets user
    in Relationship: _getRelationship(relationship) gets owner
    owner equals user
then
    Relationship.updateRelationship (relationship, name, relationshipType)

sync UpdateRelationshipResponse
when
    Requesting.request (path: "/Relationship/updateRelationship"): (request)
    Relationship.updateRelationship (): (relationship)
then
    Requesting.respond (request, relationship)

//-- Delete Relationship --//

sync DeleteRelationshipRequest
when
    Requesting.request (path: "/Relationship/deleteRelationship", session, relationship): (request)
where
    // Authorize the request: user must own the relationship
    in Sessioning: _getUser(session) gets user
    in Relationship: _getRelationship(relationship) gets owner
    owner equals user
then
    Relationship.deleteRelationship (relationship)

sync DeleteRelationshipResponse
when
    Requesting.request (path: "/Relationship/deleteRelationship"): (request)
    Relationship.deleteRelationship (): ()
then
    Requesting.respond (request, status: "deleted")

## Notes Management

//-- Create Note --//

sync CreateNoteRequest
when
    Requesting.request (path: "/Notes/createNote", session, relationship, title, content): (request)
where
    // Authorize the request: user must own the relationship
    in Sessioning: _getUser(session) gets user
    in Relationship: _getRelationship(relationship) gets owner
    owner equals user
then
    Notes.createNote (owner: user, relationship, title, content)

sync CreateNoteResponse
when
    Requesting.request (path: "/Notes/createNote"): (request)
    Notes.createNote (): (note)
then
    Requesting.respond (request, note)

//-- Update Note --//

sync UpdateNoteRequest
when
    Requesting.request (path: "/Notes/updateNote", session, note, title?, content?): (request)
where
    // Authorize the request: user must own the note
    in Sessioning: _getUser(session) gets user
    in Notes: _getNote(note) gets owner
    owner equals user
then
    Notes.updateNote (note, title, content)

sync UpdateNoteResponse
when
    Requesting.request (path: "/Notes/updateNote"): (request)
    Notes.updateNote (): (note)
then
    Requesting.respond (request, note)

//-- Delete Note --//

sync DeleteNoteRequest
when
    Requesting.request (path: "/Notes/deleteNote", session, note): (request)
where
    // Authorize the request: user must own the note
    in Sessioning: _getUser(session) gets user
    in Notes: _getNote(note) gets owner
    owner equals user
then
    Notes.deleteNote (note)

sync DeleteNoteResponse
when
    Requesting.request (path: "/Notes/deleteNote"): (request)
    Notes.deleteNote (): ()
then
    Requesting.respond (request, status: "deleted")

## Memory Gallery Management

//-- Add Image --//

sync AddImageRequest
when
    Requesting.request (path: "/MemoryGallery/addImage", session, relationship, imageUrl): (request)
where
    // Authorize the request: user must own the relationship
    in Sessioning: _getUser(session) gets user
    in Relationship: _getRelationship(relationship) gets owner
    owner equals user
then
    MemoryGallery.addImage (owner: user, relationship, imageUrl)

sync AddImageResponse
when
    Requesting.request (path: "/MemoryGallery/addImage"): (request)
    MemoryGallery.addImage (): (uploadDate)
then
    Requesting.respond (request, uploadDate)

//-- Remove Image --//

sync RemoveImageRequest
when
    Requesting.request (path: "/MemoryGallery/removeImage", session, imageUrl): (request)
where
    // Authorize the request: user must own the image
    in Sessioning: _getUser(session) gets user
    in MemoryGallery: _getImages(owner: user) gets imageUrl
then
    MemoryGallery.removeImage (owner: user, imageUrl)

sync RemoveImageResponse
when
    Requesting.request (path: "/MemoryGallery/removeImage"): (request)
    MemoryGallery.removeImage (): ()
then
    Requesting.respond (request, status: "removed")

## Occasion Management

//-- Create Occasion --//

sync CreateOccasionRequest
when
    Requesting.request (path: "/Occasion/createOccasion", session, person, occasionType, date): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    Occasion.createOccasion (owner: user, person, occasionType, date)

sync CreateOccasionResponse
when
    Requesting.request (path: "/Occasion/createOccasion"): (request)
    Occasion.createOccasion (): (occasion)
then
    Requesting.respond (request, occasion)

//-- Update Occasion --//

sync UpdateOccasionRequest
when
    Requesting.request (path: "/Occasion/updateOccasion", session, occasion, person?, occasionType?, date?): (request)
where
    // Authorize the request: user must own the occasion
    in Sessioning: _getUser(session) gets user
    in Occasion: _getOccasion(occasion) gets owner
    owner equals user
then
    Occasion.updateOccasion (occasion, person, occasionType, date)

sync UpdateOccasionResponse
when
    Requesting.request (path: "/Occasion/updateOccasion"): (request)
    Occasion.updateOccasion (): (occasion)
then
    Requesting.respond (request, occasion)

//-- Delete Occasion --//

sync DeleteOccasionRequest
when
    Requesting.request (path: "/Occasion/deleteOccasion", session, occasion): (request)
where
    // Authorize the request: user must own the occasion
    in Sessioning: _getUser(session) gets user
    in Occasion: _getOccasion(occasion) gets owner
    owner equals user
then
    Occasion.deleteOccasion (occasion)

sync DeleteOccasionResponse
when
    Requesting.request (path: "/Occasion/deleteOccasion"): (request)
    Occasion.deleteOccasion (): ()
then
    Requesting.respond (request, status: "deleted")

//-- Create Task for Occasion --//

sync CreateTaskForOccasionRequest
when
    Requesting.request (path: "/Occasion/createTaskForOccasion", session, occasion, description): (request)
where
    // Authorize the request: user must own the occasion
    in Sessioning: _getUser(session) gets user
    in Occasion: _getOccasion(occasion) gets owner
    owner equals user
then
    Task.createTask (owner: user, description)

sync CreateTaskForOccasionAutoAdd
when
    Requesting.request (path: "/Occasion/createTaskForOccasion"): (request)
    Task.createTask (): (task)
where
    // This sync automatically adds the task to the checklist when created for an occasion
    in Sessioning: _getUser(session) gets user
then
    TaskChecklist.addTask (owner: user, task)

sync CreateTaskForOccasionResponse
when
    Requesting.request (path: "/Occasion/createTaskForOccasion"): (request)
    Task.createTask (): (task)
    TaskChecklist.addTask (): (entry)
then
    Requesting.respond (request, task, entry)

## Task Management

//-- Create Task --//

sync CreateTaskRequest
when
    Requesting.request (path: "/Task/createTask", session, description): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    Task.createTask (owner: user, description)

sync CreateTaskResponse
when
    Requesting.request (path: "/Task/createTask"): (request)
    Task.createTask (): (task)
then
    Requesting.respond (request, task)

//-- Update Task --//

sync UpdateTaskRequest
when
    Requesting.request (path: "/Task/updateTaskDescription", session, task, description): (request)
where
    // Authorize the request: user must own the task
    in Sessioning: _getUser(session) gets user
    in Task: _getTask(task) gets owner
    owner equals user
then
    Task.updateTaskDescription (task, description)

sync UpdateTaskResponse
when
    Requesting.request (path: "/Task/updateTaskDescription"): (request)
    Task.updateTaskDescription (): (task)
then
    Requesting.respond (request, task)

//-- Delete Task --//

sync DeleteTaskRequest
when
    Requesting.request (path: "/Task/deleteTask", session, task): (request)
where
    // Authorize the request: user must own the task
    in Sessioning: _getUser(session) gets user
    in Task: _getTask(task) gets owner
    owner equals user
then
    Task.deleteTask (task)

sync DeleteTaskResponse
when
    Requesting.request (path: "/Task/deleteTask"): (request)
    Task.deleteTask (): ()
then
    Requesting.respond (request, status: "deleted")

## Task Checklist Management

//-- Add Task to Checklist --//

sync AddTaskToChecklistRequest
when
    Requesting.request (path: "/TaskChecklist/addTask", session, task): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    TaskChecklist.addTask (owner: user, task)

sync AddTaskToChecklistResponse
when
    Requesting.request (path: "/TaskChecklist/addTask"): (request)
    TaskChecklist.addTask (): (entry)
then
    Requesting.respond (request, entry)

//-- Remove Task from Checklist --//

sync RemoveTaskFromChecklistRequest
when
    Requesting.request (path: "/TaskChecklist/removeTask", session, task): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    TaskChecklist.removeTask (owner: user, task)

sync RemoveTaskFromChecklistResponse
when
    Requesting.request (path: "/TaskChecklist/removeTask"): (request)
    TaskChecklist.removeTask (): ()
then
    Requesting.respond (request, status: "removed")

//-- Mark Task Complete --//

sync MarkTaskCompleteRequest
when
    Requesting.request (path: "/TaskChecklist/markComplete", session, task): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    TaskChecklist.markComplete (owner: user, task)

sync MarkTaskCompleteResponse
when
    Requesting.request (path: "/TaskChecklist/markComplete"): (request)
    TaskChecklist.markComplete (): ()
then
    Requesting.respond (request, status: "completed")

//-- Mark Task Incomplete --//

sync MarkTaskIncompleteRequest
when
    Requesting.request (path: "/TaskChecklist/markIncomplete", session, task): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    TaskChecklist.markIncomplete (owner: user, task)

sync MarkTaskIncompleteResponse
when
    Requesting.request (path: "/TaskChecklist/markIncomplete"): (request)
    TaskChecklist.markIncomplete (): ()
then
    Requesting.respond (request, status: "incomplete")

## Collaborators Management

//-- Add Collaborator --//

sync AddCollaboratorRequest
when
    Requesting.request (path: "/Collaborators/addCollaborator", session, collaboratorUser): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    Collaborators.addCollaborator (user: collaboratorUser)

sync AddCollaboratorResponse
when
    Requesting.request (path: "/Collaborators/addCollaborator"): (request)
    Collaborators.addCollaborator (): ()
then
    Requesting.respond (request, status: "added")

//-- Remove Collaborator --//

sync RemoveCollaboratorRequest
when
    Requesting.request (path: "/Collaborators/removeCollaborator", session, collaboratorUser): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    Collaborators.removeCollaborator (user: collaboratorUser)

sync RemoveCollaboratorResponse
when
    Requesting.request (path: "/Collaborators/removeCollaborator"): (request)
    Collaborators.removeCollaborator (): ()
then
    Requesting.respond (request, status: "removed")

//-- Get Collaborators --//

sync GetCollaboratorsRequest
when
    Requesting.request (path: "/Collaborators/_getCollaborators", session): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    Collaborators._getCollaborators ()

sync GetCollaboratorsResponse
when
    Requesting.request (path: "/Collaborators/_getCollaborators"): (request)
    Collaborators._getCollaborators (): (user)
then
    Requesting.respond (request, collaborators: collected from user)

## Suggestion Engine

//-- Generate Suggestion for Relationship --//

sync GenerateSuggestionRequest
when
    Requesting.request (path: "/SuggestionEngine/generateSuggestion", session, relationship): (request)
where
    // Authorize the request: user must own the relationship
    // Gather context for suggestion generation
    in Sessioning: _getUser(session) gets user
    in Relationship: _getRelationship(relationship) gets owner, name, relationshipType
    owner equals user
    in Notes: _getNotesByRelationship(owner, relationship) gets note, title, content
    in MemoryGallery: _getImagesByRelationship(owner, relationship) gets imageUrl, uploadDate
    // suggestionContext is assembled as JSON object containing relationship name, relationshipType, all notes (title and content), and all imageUrls
then
    SuggestionEngine.generateSuggestion (owner: user, context: suggestionContext)

sync GenerateSuggestionResponse
when
    Requesting.request (path: "/SuggestionEngine/generateSuggestion"): (request)
    SuggestionEngine.generateSuggestion (): (suggestion, content)
then
    Requesting.respond (request, suggestion, content)

//-- Generate Suggestion for Occasion --//

sync GenerateSuggestionForOccasionRequest
when
    Requesting.request (path: "/SuggestionEngine/generateSuggestionForOccasion", session, occasion): (request)
where
    // Authorize the request: user must own the occasion
    // Gather context for suggestion generation from occasion and related relationship (if exists)
    in Sessioning: _getUser(session) gets user
    in Occasion: _getOccasion(occasion) gets owner, person, occasionType, date
    owner equals user
    // Try to find relationship by person name (may not exist)
    // If relationship exists, gather notes and memories
    // Note: This sync will only fire if a relationship with matching name exists
    // For occasions without relationships, use the base GenerateSuggestionRequest with relationship parameter
    in Relationship: _getRelationshipByName(owner, person) gets relationship, relationshipType
    in Notes: _getNotesByRelationship(owner, relationship) gets note, title, content
    in MemoryGallery: _getImagesByRelationship(owner, relationship) gets imageUrl, uploadDate
    // suggestionContext is assembled as JSON object containing occasion person, occasionType, date, relationship name, relationshipType, all notes (title and content), and all imageUrls
then
    SuggestionEngine.generateSuggestion (owner: user, context: suggestionContext)

sync GenerateSuggestionForOccasionResponse
when
    Requesting.request (path: "/SuggestionEngine/generateSuggestionForOccasion"): (request)
    SuggestionEngine.generateSuggestion (): (suggestion, content)
then
    Requesting.respond (request, suggestion, content)

## Profile Management

//-- Update Profile Name --//

sync UpdateProfileNameRequest
when
    Requesting.request (path: "/Profile/updateName", session, name): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    Profile.updateName (user, name)

sync UpdateProfileNameResponse
when
    Requesting.request (path: "/Profile/updateName"): (request)
    Profile.updateName (): ()
then
    Requesting.respond (request, status: "updated")

//-- Update Profile Email --//

sync UpdateProfileEmailRequest
when
    Requesting.request (path: "/Profile/updateEmail", session, email): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    Profile.updateEmail (user, email)

sync UpdateProfileEmailResponse
when
    Requesting.request (path: "/Profile/updateEmail"): (request)
    Profile.updateEmail (): ()
then
    Requesting.respond (request, status: "updated")

## Query Endpoints

//-- Get Relationships --//

sync GetRelationshipsRequest
when
    Requesting.request (path: "/Relationship/_getRelationships", session): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    Relationship._getRelationships (owner: user)

sync GetRelationshipsResponse
when
    Requesting.request (path: "/Relationship/_getRelationships"): (request)
    Relationship._getRelationships (): (relationship, name, relationshipType)
then
    Requesting.respond (request, relationships: collected from relationship, name, relationshipType)

//-- Get Notes by Relationship --//

sync GetNotesByRelationshipRequest
when
    Requesting.request (path: "/Notes/_getNotesByRelationship", session, relationship): (request)
where
    // Authorize the request: user must own the relationship
    in Sessioning: _getUser(session) gets user
    in Relationship: _getRelationship(relationship) gets owner
    owner equals user
then
    Notes._getNotesByRelationship (owner: user, relationship)

sync GetNotesByRelationshipResponse
when
    Requesting.request (path: "/Notes/_getNotesByRelationship"): (request)
    Notes._getNotesByRelationship (): (note, title, content)
then
    Requesting.respond (request, notes: collected from note, title, content)

//-- Get Images by Relationship --//

sync GetImagesByRelationshipRequest
when
    Requesting.request (path: "/MemoryGallery/_getImagesByRelationship", session, relationship): (request)
where
    // Authorize the request: user must own the relationship
    in Sessioning: _getUser(session) gets user
    in Relationship: _getRelationship(relationship) gets owner
    owner equals user
then
    MemoryGallery._getImagesByRelationship (owner: user, relationship)

sync GetImagesByRelationshipResponse
when
    Requesting.request (path: "/MemoryGallery/_getImagesByRelationship"): (request)
    MemoryGallery._getImagesByRelationship (): (imageUrl, uploadDate)
then
    Requesting.respond (request, images: collected from imageUrl, uploadDate)

//-- Get Upcoming Occasions --//

sync GetOccasionsRequest
when
    Requesting.request (path: "/Occasion/_getOccasions", session): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    Occasion._getOccasions (owner: user)

sync GetOccasionsResponse
when
    Requesting.request (path: "/Occasion/_getOccasions"): (request)
    Occasion._getOccasions (): (occasion, person, occasionType, date)
then
    Requesting.respond (request, occasions: collected from occasion, person, occasionType, date)

//-- Get Checklist --//

sync GetChecklistRequest
when
    Requesting.request (path: "/TaskChecklist/_getChecklist", session): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    TaskChecklist._getChecklist (owner: user)

sync GetChecklistResponse
when
    Requesting.request (path: "/TaskChecklist/_getChecklist"): (request)
    TaskChecklist._getChecklist (): (task, completed)
then
    Requesting.respond (request, checklist: collected from task, completed)

//-- Get Checklist by Occasion --//
// Note: Since Task concept doesn't store occasion references, this returns all checklist items.
// Client-side filtering by occasion can be done based on task descriptions that include occasion context.

sync GetChecklistByOccasionRequest
when
    Requesting.request (path: "/Occasion/_getChecklistByOccasion", session, occasion): (request)
where
    // Authorize the request: user must own the occasion
    in Sessioning: _getUser(session) gets user
    in Occasion: _getOccasion(occasion) gets owner, person, occasionType, date
    owner equals user
then
    TaskChecklist._getChecklist (owner: user)

sync GetChecklistByOccasionResponse
when
    Requesting.request (path: "/Occasion/_getChecklistByOccasion"): (request)
    TaskChecklist._getChecklist (): (task, completed)
    // Also include task descriptions for client-side filtering
    in Task: _getTask(task) gets description
then
    Requesting.respond (request, checklist: collected from task, completed, description)

//-- Get Suggestions --//

sync GetSuggestionsRequest
when
    Requesting.request (path: "/SuggestionEngine/_getSuggestions", session): (request)
where
    // Authorize the request: a valid session must exist
    in Sessioning: _getUser(session) gets user
then
    SuggestionEngine._getSuggestions (owner: user)

sync GetSuggestionsResponse
when
    Requesting.request (path: "/SuggestionEngine/_getSuggestions"): (request)
    SuggestionEngine._getSuggestions (): (suggestion, content, generatedAt)
then
    Requesting.respond (request, suggestions: collected from suggestion, content, generatedAt)
