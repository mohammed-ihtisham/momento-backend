import { assertEquals, assertExists } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import OccasionNotesConcept from "./OccasionNotesConcept.ts";

const occasionA = "occasion:A" as ID;
const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;

Deno.test(
  "Principle: collaborators can add and manage shared notes on an occasion",
  async () => {
    const [db, client] = await testDb();
    const occasionNotes = new OccasionNotesConcept(db);

    try {
      // Collaborator creates a note
      const createResult = await occasionNotes.createNote({
        author: userA,
        occasionId: occasionA,
        title: "Dream",
        content: "Ferrari",
      });
      assertEquals(
        "error" in createResult,
        false,
        "Create note should succeed."
      );
      const noteId = (createResult as { note: ID }).note;
      assertExists(noteId, "Note ID should be returned.");

      // Notes are queryable by occasion
      const notes = await occasionNotes._getNotesByOccasion({
        occasionId: occasionA,
      });
      assertEquals(notes.length, 1, "One note should be returned.");
      assertEquals(notes[0].title, "Dream");
      assertEquals(notes[0].content, "Ferrari");

      // Author updates their note
      const updateResult = await occasionNotes.updateNote({
        note: noteId,
        content: "Red Ferrari",
      });
      assertEquals("error" in updateResult, false, "Update should succeed.");

      const updated = await occasionNotes._getNote({ note: noteId });
      assertEquals(
        updated?.content,
        "Red Ferrari",
        "Content should be updated."
      );
    } finally {
      await client.close();
    }
  }
);

Deno.test(
  "Action: createNote enforces required fields and uniqueness per occasion",
  async () => {
    const [db, client] = await testDb();
    const occasionNotes = new OccasionNotesConcept(db);

    try {
      const emptyTitle = await occasionNotes.createNote({
        author: userA,
        occasionId: occasionA,
        title: " ",
        content: "content",
      });
      assertEquals("error" in emptyTitle, true, "Empty title should fail.");

      const emptyContent = await occasionNotes.createNote({
        author: userA,
        occasionId: occasionA,
        title: "Title",
        content: " ",
      });
      assertEquals("error" in emptyContent, true, "Empty content should fail.");

      await occasionNotes.createNote({
        author: userA,
        occasionId: occasionA,
        title: "Unique",
        content: "First",
      });
      const duplicate = await occasionNotes.createNote({
        author: userB,
        occasionId: occasionA,
        title: "Unique",
        content: "Second",
      });
      assertEquals("error" in duplicate, true, "Duplicate title should fail.");
    } finally {
      await client.close();
    }
  }
);

Deno.test(
  "Action: updateNote validates inputs and prevents duplicate titles",
  async () => {
    const [db, client] = await testDb();
    const occasionNotes = new OccasionNotesConcept(db);

    try {
      const noteOne = (await occasionNotes.createNote({
        author: userA,
        occasionId: occasionA,
        title: "First",
        content: "content 1",
      })) as { note: ID };
      const noteTwo = (await occasionNotes.createNote({
        author: userB,
        occasionId: occasionA,
        title: "Second",
        content: "content 2",
      })) as { note: ID };

      const missingFields = await occasionNotes.updateNote({
        note: noteOne.note,
      });
      assertEquals(
        "error" in missingFields,
        true,
        "Missing fields should fail."
      );

      const duplicateTitle = await occasionNotes.updateNote({
        note: noteTwo.note,
        title: "First",
      });
      assertEquals(
        "error" in duplicateTitle,
        true,
        "Duplicate title should fail."
      );

      const notFound = await occasionNotes.updateNote({
        note: "note:missing" as ID,
        title: "New",
      });
      assertEquals("error" in notFound, true, "Missing note should fail.");
    } finally {
      await client.close();
    }
  }
);

Deno.test(
  "Action: deleteNote removes existing notes and errors otherwise",
  async () => {
    const [db, client] = await testDb();
    const occasionNotes = new OccasionNotesConcept(db);

    try {
      const created = (await occasionNotes.createNote({
        author: userA,
        occasionId: occasionA,
        title: "To remove",
        content: "content",
      })) as { note: ID };

      const deleteResult = await occasionNotes.deleteNote({
        note: created.note,
      });
      assertEquals("error" in deleteResult, false, "Delete should succeed.");

      const deleteMissing = await occasionNotes.deleteNote({
        note: "note:missing" as ID,
      });
      assertEquals(
        "error" in deleteMissing,
        true,
        "Deleting missing note should fail."
      );
    } finally {
      await client.close();
    }
  }
);
