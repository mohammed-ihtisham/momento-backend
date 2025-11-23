# Essential Synchronizations

This document contains essential synchronizations that demonstrate core patterns and multi-concept interactions in Momento. These syncs represent common patterns used throughout the application and capture essential design ideas involving multiple concepts.

[@all-synchronizations](./all-synchronizations.md)

## Essential Patterns Demonstrated

1. **Request/Response/Error Handling**: Standard HTTP request handling pattern
2. **Composite Actions**: Actions that trigger other actions (e.g., login creates session)
3. **Multi-Concept Interactions**: One concept triggering actions in another (e.g., registration creates profile)
4. **Access Control**: Session-based authorization in where clauses
5. **Cascading Cleanup**: Automatic cleanup of related data when parent entities are deleted
6. **Context Assembly**: Gathering data from multiple concepts to feed into another concept

## Authentication & Session Management

//-- User Registration (Request/Response/Error Pattern) --//

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

//-- Auto-Create Profile on Registration (Multi-Concept Interaction) --//

sync CreateProfileOnRegister
when
    UserAuthentication.register (): (user)
then
    Profile.createProfile (user, name: "", email: "")

//-- User Login & Session Creation (Composite Action Pattern) --//

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

//-- User Logout (Access Control Pattern) --//

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

//-- Update Relationship (Access Control Pattern) --//

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

//-- Cleanup Related Data on Relationship Delete (Cascading Cleanup Pattern) --//

sync CleanupNotesOnRelationshipDelete
when
    Relationship.deleteRelationship (relationship): ()
where
    in Relationship: _getRelationship(relationship) gets owner
    in Notes: _getNotesByRelationship(owner, relationship) gets note
then
    Notes.deleteNote (note)

sync CleanupImagesOnRelationshipDelete
when
    Relationship.deleteRelationship (relationship): ()
where
    in Relationship: _getRelationship(relationship) gets owner
    in MemoryGallery: _getImagesByRelationship(owner, relationship) gets imageUrl
then
    MemoryGallery.removeImage (owner, imageUrl)

## Task Management

//-- Cleanup TaskChecklist on Task Delete (Cascading Cleanup Pattern) --//

sync CleanupChecklistOnTaskDelete
when
    Task.deleteTask (task): ()
where
    in Task: _getTask(task) gets owner
then
    TaskChecklist.removeTask (owner, task)

## Suggestion Engine

//-- Generate Suggestion (Context Assembly Pattern - Multi-Concept Interaction) --//

sync GenerateSuggestionRequest
when
    Requesting.request (path: "/SuggestionEngine/generateSuggestion", session, relationship): (request)
where
    // Authorize the request: user must own the relationship
    // Gather context for suggestion generation from multiple concepts
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

## Query Endpoints

//-- Get Relationships (Query Endpoint Pattern) --//

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

