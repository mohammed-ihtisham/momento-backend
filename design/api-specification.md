# API Specification

This document contains the API specifications for all concepts in the Momento backend system. All endpoints use the `POST` method with `application/json` content type.

**Base URL:** `/api`

---

# API Specification: UserAuth Concept

**Purpose:** To securely verify a user's identity based on credentials.

---

## API Endpoints

### POST /api/UserAuth/register

**Description:** Register a new user with a unique username and password.

**Requirements:**
- No User exists with the given `username`.

**Effects:**
- Creates a new User `u`; sets their `username` and a hash of their `password`; returns `u` as `user`.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response Body (Action):**
```json
{
  "user": "User"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/UserAuth/login

**Description:** Authenticate a user with their username and password.

**Requirements:**
- A User exists with the given `username` and the `password` matches their `passwordHash`.

**Effects:**
- Returns the matching User `u` as `user`.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response Body (Action):**
```json
{
  "user": "User"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/UserAuth/_getUserByUsername

**Description:** Retrieve a user by their username.

**Requirements:**
- A User with the given `username` exists.

**Effects:**
- Returns the corresponding User.

**Request Body:**
```json
{
  "username": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "user": "User"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

# API Specification: Profile Concept

**Purpose:** store basic user information: name

---

## API Endpoints

### POST /api/Profile/createProfile

**Description:** Create a new profile for a user with their name.

**Requirements:**
- user exists; no Profile already exists for `user`.

**Effects:**
- creates a new Profile `p`; sets `user` of `p` to `user`; sets `name` of `p` to `name`; returns `p` as `profile`.

**Request Body:**
```json
{
  "user": "User",
  "name": "string"
}
```

**Success Response Body (Action):**
```json
{
  "profile": "Profile"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Profile/updateName

**Description:** Update the name of a user's profile.

**Requirements:**
- user exists; a Profile exists for `user`.

**Effects:**
- sets the `name` of the Profile for `user` to `name`.

**Request Body:**
```json
{
  "user": "User",
  "name": "string"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Profile/deleteProfile

**Description:** Delete a user's profile.

**Requirements:**
- user exists; a Profile exists for `user`.

**Effects:**
- removes the Profile associated with `user`.

**Request Body:**
```json
{
  "user": "User"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Profile/_getProfile

**Description:** Retrieve a user's profile information including name and email.

**Requirements:**
- user exists; a Profile exists for `user`.

**Effects:**
- returns the `name` and `email` of the Profile for `user`.

**Request Body:**
```json
{
  "user": "User"
}
```

**Success Response Body (Query):**
```json
[
  {
    "name": "string",
    "email": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Profile/_getName

**Description:** Retrieve only the name from a user's profile.

**Requirements:**
- user exists; a Profile exists for `user`.

**Effects:**
- returns the `name` of the Profile for `user`.

**Request Body:**
```json
{
  "user": "User"
}
```

**Success Response Body (Query):**
```json
[
  {
    "name": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

# API Specification: Task Concept

**Purpose:** define tasks that users can create and manage

---

## API Endpoints

### POST /api/Task/createTask

**Description:** Create a new task with a description for a user.

**Requirements:**
- user exists; `description` is not empty.

**Effects:**
- creates a new Task `t`; sets `owner` of `t` to `owner`; sets `description` of `t` to `description`; returns `t` as `task`.

**Request Body:**
```json
{
  "owner": "User",
  "description": "string"
}
```

**Success Response Body (Action):**
```json
{
  "task": "Task"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Task/updateTaskDescription

**Description:** Update the description of an existing task.

**Requirements:**
- `task` exists.

**Effects:**
- sets the `description` of `task` to `description`; returns `task`.

**Request Body:**
```json
{
  "task": "Task",
  "description": "string"
}
```

**Success Response Body (Action):**
```json
{
  "task": "Task"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Task/deleteTask

**Description:** Delete a task.

**Requirements:**
- `task` exists.

**Effects:**
- removes `task` from the set of Tasks.

**Request Body:**
```json
{
  "task": "Task"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Task/_getTask

**Description:** Retrieve a task's owner and description.

**Requirements:**
- `task` exists.

**Effects:**
- returns the `owner` and `description` of `task`.

**Request Body:**
```json
{
  "task": "Task"
}
```

**Success Response Body (Query):**
```json
[
  {
    "owner": "User",
    "description": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Task/_getTasks

**Description:** Retrieve all tasks owned by a user.

**Requirements:**
- `owner` exists.

**Effects:**
- returns all Tasks where `owner` is `owner`, each with its `description`.

**Request Body:**
```json
{
  "owner": "User"
}
```

**Success Response Body (Query):**
```json
[
  {
    "task": "Task",
    "description": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

# API Specification: Relationship Concept

**Purpose:** track the people that a user cares about by attributing a relationship type to each person

---

## API Endpoints

### POST /api/Relationship/createRelationship

**Description:** Create a new relationship for a user with a person's name and relationship type.

**Requirements:**
- user exists; `name` is not empty; `relationshipType` is not empty; no Relationship owned by `owner` already has `name`.

**Effects:**
- creates a new Relationship `r`; sets `owner` of `r` to `owner`; sets `name` of `r` to `name`; sets `relationshipType` of `r` to `relationshipType`; returns `r` as `relationship`.

**Request Body:**
```json
{
  "owner": "User",
  "name": "string",
  "relationshipType": "string"
}
```

**Success Response Body (Action):**
```json
{
  "relationship": "Relationship"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Relationship/updateRelationship

**Description:** Update a relationship's name or relationship type.

**Requirements:**
- `relationship` exists; at least one of `name` or `relationshipType` is provided; if `name` is provided, no other Relationship owned by the same `owner` already has `name`.

**Effects:**
- updates the specified properties (`name`, `relationshipType`) of `relationship`; returns `relationship`.

**Request Body:**
```json
{
  "relationship": "Relationship",
  "name": "string",
  "relationshipType": "string"
}
```

**Success Response Body (Action):**
```json
{
  "relationship": "Relationship"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Relationship/deleteRelationship

**Description:** Delete a relationship.

**Requirements:**
- `relationship` exists.

**Effects:**
- removes `relationship` from the set of Relationships.

**Request Body:**
```json
{
  "relationship": "Relationship"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Relationship/_getRelationship

**Description:** Retrieve a relationship's owner, name, and relationship type.

**Requirements:**
- `relationship` exists.

**Effects:**
- returns the `owner`, `name`, and `relationshipType` of `relationship`.

**Request Body:**
```json
{
  "relationship": "Relationship"
}
```

**Success Response Body (Query):**
```json
[
  {
    "owner": "User",
    "name": "string",
    "relationshipType": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Relationship/_getRelationships

**Description:** Retrieve all relationships owned by a user.

**Requirements:**
- `owner` exists.

**Effects:**
- returns a set of all Relationships owned by `owner`, each with its `name` and `relationshipType`.

**Request Body:**
```json
{
  "owner": "User"
}
```

**Success Response Body (Query):**
```json
[
  {
    "relationship": "Relationship",
    "name": "string",
    "relationshipType": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Relationship/_getRelationshipByName

**Description:** Retrieve a relationship by owner and name.

**Requirements:**
- `owner` exists; `name` is not empty; a Relationship owned by `owner` with `name` exists.

**Effects:**
- returns the Relationship owned by `owner` with `name`, and its `relationshipType`.

**Request Body:**
```json
{
  "owner": "User",
  "name": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "relationship": "Relationship",
    "relationshipType": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

# API Specification: Notes Concept

**Purpose:** allow users to store, organize, and retrieve textual information associated with relationships

---

## API Endpoints

### POST /api/Notes/createNote

**Description:** Create a new note with a title and content associated with a relationship.

**Requirements:**
- user exists; relationship exists; no Note owned by `owner` for the same `relationship` already has `title`.

**Effects:**
- creates a new Note `n`; sets `owner` of `n` to `owner`; sets `relationship` of `n` to `relationship`; sets `title` of `n` to `title`; sets `content` of `n` to `content`; returns `n` as `note`.

**Request Body:**
```json
{
  "owner": "User",
  "relationship": "Relationship",
  "title": "string",
  "content": "string"
}
```

**Success Response Body (Action):**
```json
{
  "note": "Note"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Notes/updateNote

**Description:** Update a note's title or content.

**Requirements:**
- `note` exists; if `title` is provided, no other Note owned by `note`'s `owner` for the same `relationship` has the new `title`; at least one of `title` or `content` is provided.

**Effects:**
- if `title` is provided, sets `title` of `note` to `title`; if `content` is provided, sets `content` of `note` to `content`; returns `note`.

**Request Body:**
```json
{
  "note": "Note",
  "title": "string",
  "content": "string"
}
```

**Success Response Body (Action):**
```json
{
  "note": "Note"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Notes/deleteNote

**Description:** Delete a note.

**Requirements:**
- `note` exists.

**Effects:**
- removes `note` from the set of Notes.

**Request Body:**
```json
{
  "note": "Note"
}
```

**Success Response Body (Action):**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Notes/_getNote

**Description:** Retrieve a note's owner, relationship, title, and content.

**Requirements:**
- `note` exists.

**Effects:**
- returns `owner` of `note`, `relationship` of `note`, `title` of `note`, and `content` of `note`.

**Request Body:**
```json
{
  "note": "Note"
}
```

**Success Response Body (Query):**
```json
[
  {
    "owner": "User",
    "relationship": "Relationship",
    "title": "string",
    "content": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Notes/_getNotes

**Description:** Retrieve all notes owned by a user.

**Requirements:**
- `owner` exists.

**Effects:**
- returns set of all `note`s owned by `owner`, each with its `relationship`, `title`, and `content`.

**Request Body:**
```json
{
  "owner": "User"
}
```

**Success Response Body (Query):**
```json
[
  {
    "note": "Note",
    "relationship": "Relationship",
    "title": "string",
    "content": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Notes/_getNotesByRelationship

**Description:** Retrieve all notes for a specific relationship.

**Requirements:**
- `owner` exists; relationship exists.

**Effects:**
- returns set of all `note`s owned by `owner` for the given `relationship`, each with its `title` and `content`.

**Request Body:**
```json
{
  "owner": "User",
  "relationship": "Relationship"
}
```

**Success Response Body (Query):**
```json
[
  {
    "note": "Note",
    "title": "string",
    "content": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/Notes/_getNoteByTitle

**Description:** Retrieve a note by owner, relationship, and title.

**Requirements:**
- `owner` exists; relationship exists; a `note` exists for `owner` with `relationship` and `title`.

**Effects:**
- returns the `note` owned by `owner` with `relationship` and `title`, and its `content`.

**Request Body:**
```json
{
  "owner": "User",
  "relationship": "Relationship",
  "title": "string"
}
```

**Success Response Body (Query):**
```json
[
  {
    "note": "Note",
    "content": "string"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

