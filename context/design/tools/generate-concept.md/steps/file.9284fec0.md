---
timestamp: 'Sun Nov 23 2025 14:22:01 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_142201.2aecaa51.md]]'
content_id: 9284fec0aa65b2d2b4e566a41a7522530e6c8baa79814e3f3f33ede904410685
---

# file: src/concepts/Notes/NotesConcept.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Declare collection prefix, use concept name
const PREFIX = "Notes" + ".";

// Generic types of this concept
type Item = ID;
type User = ID;
type Note = ID;

/**
 * a set of Notes with
 *   an item Item
 *   a creator User
 *   a content String
 *   a createdAt Date
 *   a updatedAt Date
 */
interface NoteDocument {
  _id: Note;
  item: Item;
  creator: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteDetails {
  note: Note;
  item: Item;
  creator: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export default class NotesConcept {
  notes: Collection<NoteDocument>;

  constructor(private readonly db: Db) {
    this.notes = this.db.collection(PREFIX + "notes");
  }

  /**
   * createNote (item: Item, creator: User, content: String): (note: Note)
   *
   * **requires** `item` and `creator` are valid IDs. `content` is not empty.
   *
   * **effects** creates a new `Note` entity; associates it with `item` and `creator`; sets `content`, `createdAt`, and `updatedAt`; returns the new `note`.
   */
  async createNote(
    { item, creator, content }: { item: Item; creator: User; content: string },
  ): Promise<{ note: Note } | { error: string }> {
    if (!item || !creator || !content) {
      return { error: "Item, creator, and content must be provided." };
    }
    if (content.trim() === "") {
      return { error: "Note content cannot be empty." };
    }

    const now = new Date();
    const newNote: NoteDocument = {
      _id: freshID() as Note,
      item,
      creator,
      content,
      createdAt: now,
      updatedAt: now,
    };

    await this.notes.insertOne(newNote);
    return { note: newNote._id };
  }

  /**
   * getNote (note: Note): (item: Item, creator: User, content: String, createdAt: Date, updatedAt: Date)
   *
   * **requires** `note` exists.
   *
   * **effects** returns the details of the specified `note`.
   */
  async getNote(
    { note }: { note: Note },
  ): Promise<NoteDetails | { error: string }> {
    if (!note) {
      return { error: "Note ID must be provided." };
    }

    const foundNote = await this.notes.findOne({ _id: note });

    if (!foundNote) {
      return { error: `Note with ID ${note} not found.` };
    }

    return {
      note: foundNote._id,
      item: foundNote.item,
      creator: foundNote.creator,
      content: foundNote.content,
      createdAt: foundNote.createdAt,
      updatedAt: foundNote.updatedAt,
    };
  }

  /**
   * updateNote (note: Note, content: String): (note: Note)
   *
   * **requires** `note` exists. `content` is not empty.
   *
   * **effects** updates the `content` and `updatedAt` of the `note`; returns the updated `note`.
   */
  async updateNote(
    { note, content }: { note: Note; content: string },
  ): Promise<{ note: Note } | { error: string }> {
    if (!note || !content) {
      return { error: "Note ID and content must be provided." };
    }
    if (content.trim() === "") {
      return { error: "Note content cannot be empty." };
    }

    const updateResult = await this.notes.updateOne(
      { _id: note },
      { $set: { content, updatedAt: new Date() } },
    );

    if (updateResult.matchedCount === 0) {
      return { error: `Note with ID ${note} not found.` };
    }

    return { note };
  }

  /**
   * deleteNote (note: Note): Empty
   *
   * **requires** `note` exists.
   *
   * **effects** deletes the `note` and all its associated data.
   */
  async deleteNote(
    { note }: { note: Note },
  ): Promise<Empty | { error: string }> {
    if (!note) {
      return { error: "Note ID must be provided." };
    }

    const deleteResult = await this.notes.deleteOne({ _id: note });

    if (deleteResult.deletedCount === 0) {
      return { error: `Note with ID ${note} not found.` };
    }

    return {};
  }

  /**
   * _getNotesByItem (item: Item): (notes: {note: Note, creator: User, content: String, createdAt: Date, updatedAt: Date}[])
   *
   * **requires** `item` is a valid ID.
   *
   * **effects** returns a list of all notes associated with `item`, including their details.
   */
  async _getNotesByItem(
    { item }: { item: Item },
  ): Promise<{ notes: NoteDetails[] }> {
    if (!item) {
      return { notes: [] }; // No error, just empty list if item is invalid
    }

    const foundNotes = await this.notes.find({ item }).toArray();

    return {
      notes: foundNotes.map((n) => ({
        note: n._id,
        item: n.item,
        creator: n.creator,
        content: n.content,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
      })),
    };
  }

  /**
   * _getNotesByCreator (creator: User): (notes: {note: Note, item: Item, content: String, createdAt: Date, updatedAt: Date}[])
   *
   * **requires** `creator` is a valid ID.
   *
   * **effects** returns a list of all notes created by `creator`, including their details.
   */
  async _getNotesByCreator(
    { creator }: { creator: User },
  ): Promise<{ notes: NoteDetails[] }> {
    if (!creator) {
      return { notes: [] }; // No error, just empty list if creator is invalid
    }

    const foundNotes = await this.notes.find({ creator }).toArray();

    return {
      notes: foundNotes.map((n) => ({
        note: n._id,
        item: n.item,
        creator: n.creator,
        content: n.content,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
      })),
    };
  }
}
```

***
