import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import NotesConcept from "./NotesConcept.ts";

const ownerA = "user:Alice" as ID;
const relationship1 = "relationship:1" as ID;
const relationship2 = "relationship:2" as ID;

Deno.test("Principle: User creates note, can later retrieve, filter, and update", async () => {
  const [db, client] = await testDb();
  const notesConcept = new NotesConcept(db);

  try {
    // 1. User creates a note
    const createResult = await notesConcept.createNote({
      owner: ownerA,
      relationship: relationship1,
      title: "First Note",
      content: "This is my first note",
    });
    assertNotEquals(
      "error" in createResult,
      true,
      "Note creation should not fail.",
    );
    const { note } = createResult as { note: ID };
    assertExists(note);

    // 2. User can retrieve the note
    const noteData = await notesConcept._getNote({ note });
    assertExists(noteData, "Note should exist.");
    assertEquals(noteData.title, "First Note", "Title should match.");
    assertEquals(noteData.content, "This is my first note", "Content should match.");

    // 3. User can filter by relationship
    const notesByRelationship = await notesConcept._getNotesByRelationship({
      owner: ownerA,
      relationship: relationship1,
    });
    assertEquals(
      notesByRelationship.length,
      1,
      "Should find one note for relationship.",
    );

    // 4. User can update the note
    const updateResult = await notesConcept.updateNote({
      note,
      content: "Updated content",
    });
    assertEquals("error" in updateResult, false, "Update should succeed.");

    const updatedNote = await notesConcept._getNote({ note });
    assertEquals(
      updatedNote?.content,
      "Updated content",
      "Content should be updated.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: createNote requires unique title per owner+relationship", async () => {
  const [db, client] = await testDb();
  const notesConcept = new NotesConcept(db);

  try {
    // First note should succeed
    await notesConcept.createNote({
      owner: ownerA,
      relationship: relationship1,
      title: "Unique Title",
      content: "Content 1",
    });

    // Duplicate title for same owner+relationship should fail
    const duplicateResult = await notesConcept.createNote({
      owner: ownerA,
      relationship: relationship1,
      title: "Unique Title",
      content: "Content 2",
    });
    assertEquals(
      "error" in duplicateResult,
      true,
      "Creating duplicate title should fail.",
    );

    // Same title for different relationship should succeed
    const differentRelResult = await notesConcept.createNote({
      owner: ownerA,
      relationship: relationship2,
      title: "Unique Title",
      content: "Content 3",
    });
    assertEquals(
      "error" in differentRelResult,
      false,
      "Same title for different relationship should succeed.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: updateNote requirements are enforced", async () => {
  const [db, client] = await testDb();
  const notesConcept = new NotesConcept(db);

  try {
    // Setup
    const { note } =
      (await notesConcept.createNote({
        owner: ownerA,
        relationship: relationship1,
        title: "Original Title",
        content: "Original Content",
      })) as { note: ID };

    // Requires: at least one field provided
    const noFieldsResult = await notesConcept.updateNote({ note });
    assertEquals(
      "error" in noFieldsResult,
      true,
      "Update with no fields should fail.",
    );

    // Requires: note exists
    const nonExistentResult = await notesConcept.updateNote({
      note: "note:fake" as ID,
      title: "New Title",
    });
    assertEquals(
      "error" in nonExistentResult,
      true,
      "Updating non-existent note should fail.",
    );

    // Requires: if title provided, no duplicate for same owner+relationship
    await notesConcept.createNote({
      owner: ownerA,
      relationship: relationship1,
      title: "Existing Title",
      content: "Content",
    });
    const duplicateTitleResult = await notesConcept.updateNote({
      note,
      title: "Existing Title",
    });
    assertEquals(
      "error" in duplicateTitleResult,
      true,
      "Updating to duplicate title should fail.",
    );

    // Successful update
    const successResult = await notesConcept.updateNote({
      note,
      title: "Updated Title",
      content: "Updated Content",
    });
    assertEquals("error" in successResult, false, "Valid update should succeed.");

    const updated = await notesConcept._getNote({ note });
    assertEquals(updated?.title, "Updated Title", "Title should be updated.");
    assertEquals(updated?.content, "Updated Content", "Content should be updated.");
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getNotes returns all notes for owner", async () => {
  const [db, client] = await testDb();
  const notesConcept = new NotesConcept(db);

  try {
    await notesConcept.createNote({
      owner: ownerA,
      relationship: relationship1,
      title: "Note 1",
      content: "Content 1",
    });
    await notesConcept.createNote({
      owner: ownerA,
      relationship: relationship2,
      title: "Note 2",
      content: "Content 2",
    });

    const notes = await notesConcept._getNotes({ owner: ownerA });
    assertEquals(notes.length, 2, "Should return 2 notes.");
    assertEquals(
      notes.some((n) => n.title === "Note 1"),
      true,
      "Should include Note 1.",
    );
    assertEquals(
      notes.some((n) => n.title === "Note 2"),
      true,
      "Should include Note 2.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getNoteByTitle returns note by title", async () => {
  const [db, client] = await testDb();
  const notesConcept = new NotesConcept(db);

  try {
    const { note } =
      (await notesConcept.createNote({
        owner: ownerA,
        relationship: relationship1,
        title: "Specific Title",
        content: "Specific Content",
      })) as { note: ID };

    const result = await notesConcept._getNoteByTitle({
      owner: ownerA,
      relationship: relationship1,
      title: "Specific Title",
    });
    assertExists(result, "Should find note by title.");
    assertEquals(result.note, note, "Should return correct note ID.");
    assertEquals(result.content, "Specific Content", "Should return correct content.");

    const nonExistent = await notesConcept._getNoteByTitle({
      owner: ownerA,
      relationship: relationship1,
      title: "Non Existent",
    });
    assertEquals(nonExistent, null, "Should return null for non-existent title.");
  } finally {
    await client.close();
  }
});

