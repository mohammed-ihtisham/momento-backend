import { Collection, Db } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Notes" + ".";

// Generic types for the concept's external dependencies
type User = ID;
type Relationship = ID;

// Internal entity types, represented as IDs
type Note = ID;

/**
 * State: A set of Notes with an owner, relationship, title, and content.
 */
interface NoteDoc {
  _id: Note;
  owner: User;
  relationship: Relationship;
  title: string;
  content: string;
}

/**
 * @concept Notes
 * @purpose allow users to store, organize, and retrieve textual information associated with relationships
 */
export default class NotesConcept {
  notes: Collection<NoteDoc>;

  constructor(private readonly db: Db) {
    this.notes = this.db.collection(PREFIX + "notes");
  }

  /**
   * Action: Creates a new note for an owner and relationship.
   * @requires The user exists, relationship exists, and no Note owned by owner for the same relationship already has the title.
   * @effects A new note is created with the given owner, relationship, title, and content, and its ID is returned.
   */
  async createNote({
    owner,
    relationship,
    title,
    content,
  }: {
    owner: User;
    relationship: Relationship;
    title: string;
    content: string;
  }): Promise<{ note: Note } | { error: string }> {
    const existingNote = await this.notes.findOne({
      owner,
      relationship,
      title,
    });
    if (existingNote) {
      return {
        error: `Note with title "${title}" already exists for owner ${owner} and relationship ${relationship}.`,
      };
    }

    const noteId = freshID() as Note;
    await this.notes.insertOne({
      _id: noteId,
      owner,
      relationship,
      title,
      content,
    });
    return { note: noteId };
  }

  /**
   * Action: Updates a note's title and/or content.
   * @requires The note exists, at least one of title or content is provided, and if title is provided, no other Note owned by the note's owner for the same relationship has the new title.
   * @effects Updates the specified properties of the note and returns the note ID.
   */
  async updateNote({
    note,
    title,
    content,
  }: {
    note: Note;
    title?: string;
    content?: string;
  }): Promise<{ note: Note } | { error: string }> {
    if (!title && content === undefined) {
      return {
        error: "At least one of title or content must be provided.",
      };
    }

    const existingNote = await this.notes.findOne({ _id: note });
    if (!existingNote) {
      return { error: `Note with ID ${note} not found.` };
    }

    const updateData: Partial<NoteDoc> = {};
    if (title !== undefined) {
      // Check for duplicate title only if the title is actually changing
      if (title !== existingNote.title) {
        const duplicateNote = await this.notes.findOne({
          owner: existingNote.owner,
          relationship: existingNote.relationship,
          title,
        });
        if (duplicateNote) {
          return {
            error: `Note with title "${title}" already exists for owner ${existingNote.owner} and relationship ${existingNote.relationship}.`,
          };
        }
      }
      updateData.title = title;
    }

    if (content !== undefined) {
      updateData.content = content;
    }

    await this.notes.updateOne({ _id: note }, { $set: updateData });
    return { note };
  }

  /**
   * Action: Deletes a note.
   * @requires The note exists.
   * @effects Removes the note from the set of Notes.
   */
  async deleteNote({
    note,
  }: {
    note: Note;
  }): Promise<Empty | { error: string }> {
    console.log("NOTE:", note);
    const existingNote = await this.notes.findOne({ _id: note });
    if (!existingNote) {
      return { error: `Note with ID ${note} not found.` };
    }

    await this.notes.deleteOne({ _id: note });
    return {};
  }

  /**
   * Query: Retrieves a note by its ID.
   * @requires The note exists.
   * @effects Returns the owner, relationship, title, and content of the note.
   */
  async _getNote({ note }: { note: Note }): Promise<{
    owner: User;
    relationship: Relationship;
    title: string;
    content: string;
  } | null> {
    const noteDoc = await this.notes.findOne({ _id: note });
    if (!noteDoc) {
      return null;
    }
    return {
      owner: noteDoc.owner,
      relationship: noteDoc.relationship,
      title: noteDoc.title,
      content: noteDoc.content,
    };
  }

  /**
   * Query: Retrieves all notes owned by a user.
   * @requires The owner exists.
   * @effects Returns a set of all notes owned by the owner, each with its relationship, title, and content.
   */
  async _getNotes({ owner }: { owner: User }): Promise<
    Array<{
      note: Note;
      relationship: Relationship;
      title: string;
      content: string;
    }>
  > {
    const notes = await this.notes.find({ owner }).toArray();
    return notes.map((n) => ({
      note: n._id,
      relationship: n.relationship,
      title: n.title,
      content: n.content,
    }));
  }

  /**
   * Query: Retrieves all notes owned by a user for a specific relationship.
   * @requires The owner exists and relationship exists.
   * @effects Returns a set of all notes owned by the owner for the given relationship, each with its title and content.
   */
  async _getNotesByRelationship({
    owner,
    relationship,
  }: {
    owner: User;
    relationship: Relationship;
  }): Promise<
    Array<{
      note: Note;
      title: string;
      content: string;
    }>
  > {
    const notes = await this.notes.find({ owner, relationship }).toArray();
    return notes.map((n) => ({
      note: n._id,
      title: n.title,
      content: n.content,
    }));
  }

  /**
   * Query: Retrieves a note by owner, relationship, and title.
   * @requires The owner exists, relationship exists, and a note exists for owner with relationship and title.
   * @effects Returns the note owned by owner with relationship and title, and its content.
   */
  async _getNoteByTitle({
    owner,
    relationship,
    title,
  }: {
    owner: User;
    relationship: Relationship;
    title: string;
  }): Promise<{ note: Note; content: string } | null> {
    const noteDoc = await this.notes.findOne({ owner, relationship, title });
    if (!noteDoc) {
      return null;
    }
    return {
      note: noteDoc._id,
      content: noteDoc.content,
    };
  }
}
