import { Collection, Db } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "OccasionNotes" + ".";

// Generic types for the concept's external dependencies
type User = ID;
type Occasion = ID;

// Internal entity types, represented as IDs
type OccasionNote = ID;

// Normalize occasionId to avoid accidentally stored quoted values
const normalizeOccasionId = (occasionId: Occasion): Occasion => {
  if (typeof occasionId !== "string") return occasionId;
  return occasionId.replace(/^"+|"+$/g, "") as Occasion;
};

/**
 * State: A set of shared notes attached to an occasion, authored by a user.
 */
interface OccasionNoteDoc {
  _id: OccasionNote;
  occasionId: Occasion;
  author: User;
  title: string;
  content: string;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

/**
 * @concept OccasionNotes
 * @purpose allow owners and collaborators of an occasion to share notes tied to that occasion
 */
export default class OccasionNotesConcept {
  notes: Collection<OccasionNoteDoc>;

  constructor(private readonly db: Db) {
    this.notes = this.db.collection(PREFIX + "notes");
  }

  /**
   * Action: Creates a new shared note for an occasion.
   * @requires The occasion exists, title is not empty, content is not empty, and no note for this occasion already has the title.
   * @effects A new note is created with the given author, occasionId, title, and content, and its ID is returned.
   */
  async createNote({
    author,
    occasionId,
    title,
    content,
  }: {
    author: User;
    occasionId: Occasion;
    title: string;
    content: string;
  }): Promise<{ note: OccasionNote } | { error: string }> {
    const normalizedOccasionId = normalizeOccasionId(occasionId);

    console.log("AUTHOR:", author);

    if (title.trim() === "") {
      return { error: "Title cannot be empty." };
    }

    if (content.trim() === "") {
      return { error: "Content cannot be empty." };
    }

    const existingNote = await this.notes.findOne({
      occasionId: normalizedOccasionId,
      title,
    });
    if (existingNote) {
      return {
        error: `A note with title "${title}" already exists for this occasion.`,
      };
    }

    const noteId = freshID() as OccasionNote;
    const now = new Date().toISOString();

    await this.notes.insertOne({
      _id: noteId,
      occasionId: normalizedOccasionId,
      author,
      title,
      content,
      createdAt: now,
      updatedAt: now,
    });

    return { note: noteId };
  }

  /**
   * Action: Updates a shared note's title and/or content.
   * @requires The note exists, at least one of title or content is provided, title/content are not empty if provided, and no other note on the same occasion has the new title.
   * @effects Updates the note and returns the note ID.
   */
  async updateNote({
    note,
    title,
    content,
  }: {
    note: OccasionNote;
    title?: string;
    content?: string;
  }): Promise<{ note: OccasionNote } | { error: string }> {
    if (title === undefined && content === undefined) {
      return { error: "At least one of title or content must be provided." };
    }

    const existingNote = await this.notes.findOne({ _id: note });
    if (!existingNote) {
      return { error: `Note with ID ${note} not found.` };
    }

    const updateData: Partial<OccasionNoteDoc> = {};

    if (title !== undefined) {
      if (title.trim() === "") {
        return { error: "Title cannot be empty." };
      }

      if (title !== existingNote.title) {
        const duplicate = await this.notes.findOne({
          occasionId: existingNote.occasionId,
          title,
          _id: { $ne: note },
        });
        if (duplicate) {
          return {
            error: `A note with title "${title}" already exists for this occasion.`,
          };
        }
      }

      updateData.title = title;
    }

    if (content !== undefined) {
      if (content.trim() === "") {
        return { error: "Content cannot be empty." };
      }
      updateData.content = content;
    }

    updateData.updatedAt = new Date().toISOString();

    await this.notes.updateOne({ _id: note }, { $set: updateData });
    return { note };
  }

  /**
   * Action: Deletes a shared note.
   * @requires The note exists.
   * @effects Removes the note from the set of OccasionNotes.
   */
  async deleteNote({
    note,
  }: {
    note: OccasionNote;
  }): Promise<Empty | { error: string }> {
    const existingNote = await this.notes.findOne({ _id: note });
    if (!existingNote) {
      return { error: `Note with ID ${note} not found.` };
    }

    await this.notes.deleteOne({ _id: note });
    return {};
  }

  /**
   * Query: Retrieves a shared note by its ID.
   * @requires The note exists.
   * @effects Returns the note fields.
   */
  async _getNote({ note }: { note: OccasionNote }): Promise<{
    occasionId: Occasion;
    author: User;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  } | null> {
    const noteDoc = await this.notes.findOne({ _id: note });
    if (!noteDoc) {
      return null;
    }

    return {
      occasionId: noteDoc.occasionId,
      author: noteDoc.author,
      title: noteDoc.title,
      content: noteDoc.content,
      createdAt: noteDoc.createdAt,
      updatedAt: noteDoc.updatedAt,
    };
  }

  /**
   * Query: Retrieves all shared notes for an occasion, newest first.
   * @requires The occasion exists.
   * @effects Returns a set of all notes on the occasion with metadata.
   */
  async _getNotesByOccasion({ occasionId }: { occasionId: Occasion }): Promise<
    Array<{
      note: OccasionNote;
      author: User;
      title: string;
      content: string;
      createdAt: string;
      updatedAt: string;
    }>
  > {
    const normalizedOccasionId = normalizeOccasionId(occasionId);

    // Debug: log the query
    console.log(
      `[OccasionNotes._getNotesByOccasion] Querying for occasionId:`,
      normalizedOccasionId
    );
    console.log(
      `[OccasionNotes._getNotesByOccasion] Type:`,
      typeof normalizedOccasionId
    );

    const occasionIdsToMatch = [
      normalizedOccasionId,
      `"${normalizedOccasionId}"`,
    ] as Occasion[];

    const notes = await this.notes
      .find({
        occasionId: {
          // Handle legacy stored values that include extra quotes
          $in: occasionIdsToMatch,
        },
      })
      .sort({ updatedAt: -1, createdAt: -1 })
      .toArray();

    console.log(
      `[OccasionNotes._getNotesByOccasion] Found ${notes.length} notes`
    );

    // Debug: log what we found
    if (notes.length > 0) {
      console.log(
        `[OccasionNotes._getNotesByOccasion] First note occasionId:`,
        notes[0].occasionId,
        `Type:`,
        typeof notes[0].occasionId
      );
    } else {
      // Try to find any notes to see what occasionIds exist
      const allNotes = await this.notes.find({}).limit(5).toArray();
      console.log(
        `[OccasionNotes._getNotesByOccasion] Sample occasionIds in DB:`,
        allNotes.map((n) => ({
          id: n._id,
          occasionId: n.occasionId,
          type: typeof n.occasionId,
        }))
      );
    }

    return notes.map((n) => ({
      note: n._id,
      author: n.author,
      title: n.title,
      content: n.content,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
    }));
  }
}
