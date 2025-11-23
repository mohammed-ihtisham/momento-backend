---
timestamp: 'Sun Nov 23 2025 14:22:01 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_142201.2aecaa51.md]]'
content_id: 76af909ec420a17bcea90c3d542c02006a5808cf827c0106201dc6b2742d037b
---

# file: src/concepts/Notes/NotesConcept.test.ts

```typescript
import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import NotesConcept from "@concepts/Notes/NotesConcept.ts";

Deno.test("NotesConcept functionality", async (t) => {
  const [db, client] = await testDb();
  const notesConcept = new NotesConcept(db);

  const testUser1: ID = "user:Alice" as ID;
  const testUser2: ID = "user:Bob" as ID;
  const testItem1: ID = "item:Post123" as ID;
  const testItem2: ID = "item:Product456" as ID;

  await t.step("createNote: successful creation", async () => {
    console.log("--- Test: createNote: successful creation ---");
    const initialContent = "This is my first note on Post123.";
    const result = await notesConcept.createNote({
      item: testItem1,
      creator: testUser1,
      content: initialContent,
    });

    assertExists((result as { note: Note }).note, "Should return a note ID on success");
    const noteId = (result as { note: ID }).note;
    console.log(`Created note with ID: ${noteId}`);

    const retrievedNote = await notesConcept.getNote({ note: noteId });
    assertExists(
      (retrievedNote as { item: ID }).item,
      "Should be able to retrieve the created note",
    );
    assertEquals(
      (retrievedNote as { content: string }).content,
      initialContent,
      "Retrieved note content should match initial content",
    );
    assertEquals(
      (retrievedNote as { creator: ID }).creator,
      testUser1,
      "Retrieved note creator should match",
    );
    assertEquals(
      (retrievedNote as { item: ID }).item,
      testItem1,
      "Retrieved note item should match",
    );
    console.log("Note content and metadata verified.");
  });

  await t.step("createNote: requires content not to be empty", async () => {
    console.log("--- Test: createNote: requires content not to be empty ---");
    const resultEmpty = await notesConcept.createNote({
      item: testItem1,
      creator: testUser1,
      content: "",
    });
    assertExists(
      (resultEmpty as { error: string }).error,
      "Should return an error for empty content",
    );
    assertEquals(
      (resultEmpty as { error: string }).error,
      "Note content cannot be empty.",
      "Error message for empty content should be specific",
    );
    console.log(
      `Received expected error for empty content: "${
        (resultEmpty as { error: string }).error
      }"`,
    );

    const resultWhitespace = await notesConcept.createNote({
      item: testItem1,
      creator: testUser1,
      content: "   ",
    });
    assertExists(
      (resultWhitespace as { error: string }).error,
      "Should return an error for whitespace content",
    );
    assertEquals(
      (resultWhitespace as { error: string }).error,
      "Note content cannot be empty.",
      "Error message for whitespace content should be specific",
    );
    console.log(
      `Received expected error for whitespace content: "${
        (resultWhitespace as { error: string }).error
      }"`,
    );
  });

  let createdNoteId: ID; // To be used in subsequent tests

  await t.step("updateNote: successful update", async () => {
    console.log("--- Test: updateNote: successful update ---");
    const initialContent = "Another note to be updated.";
    const createResult = await notesConcept.createNote({
      item: testItem1,
      creator: testUser1,
      content: initialContent,
    });
    createdNoteId = (createResult as { note: ID }).note;
    assertExists(createdNoteId, "Pre-condition: Note must be created");
    console.log(`Created note for update with ID: ${createdNoteId}`);

    const updatedContent = "This is the updated content for the note.";
    const updateResult = await notesConcept.updateNote({
      note: createdNoteId,
      content: updatedContent,
    });

    assertExists(
      (updateResult as { note: ID }).note,
      "Should return note ID on successful update",
    );
    assertEquals(
      (updateResult as { note: ID }).note,
      createdNoteId,
      "Updated note ID should match",
    );
    console.log(`Note ${createdNoteId} updated.`);

    const retrievedNote = await notesConcept.getNote({ note: createdNoteId });
    assertEquals(
      (retrievedNote as { content: string }).content,
      updatedContent,
      "Retrieved note content should match updated content",
    );
    assertNotEquals(
      (retrievedNote as { createdAt: Date }).createdAt,
      (retrievedNote as { updatedAt: Date }).updatedAt,
      "updatedAt should be different from createdAt after update",
    );
    console.log("Note content and updatedAt verified after update.");
  });

  await t.step("updateNote: requires content not to be empty", async () => {
    console.log("--- Test: updateNote: requires content not to be empty ---");
    const resultEmpty = await notesConcept.updateNote({
      note: createdNoteId,
      content: "",
    });
    assertExists(
      (resultEmpty as { error: string }).error,
      "Should return an error for empty content",
    );
    assertEquals(
      (resultEmpty as { error: string }).error,
      "Note content cannot be empty.",
      "Error message for empty content should be specific",
    );
    console.log(
      `Received expected error for empty content: "${
        (resultEmpty as { error: string }).error
      }"`,
    );
  });

  await t.step("updateNote: requires note to exist", async () => {
    console.log("--- Test: updateNote: requires note to exist ---");
    const nonExistentNote: ID = "note:nonexistent" as ID;
    const result = await notesConcept.updateNote({
      note: nonExistentNote,
      content: "new content",
    });
    assertExists(
      (result as { error: string }).error,
      "Should return an error for non-existent note",
    );
    assertEquals(
      (result as { error: string }).error,
      `Note with ID ${nonExistentNote} not found.`,
      "Error message for non-existent note should be specific",
    );
    console.log(
      `Received expected error for non-existent note: "${
        (result as { error: string }).error
      }"`,
    );
  });

  await t.step("getNote: requires note to exist", async () => {
    console.log("--- Test: getNote: requires note to exist ---");
    const nonExistentNote: ID = "note:nonexistent" as ID;
    const result = await notesConcept.getNote({ note: nonExistentNote });
    assertExists(
      (result as { error: string }).error,
      "Should return an error for non-existent note",
    );
    assertEquals(
      (result as { error: string }).error,
      `Note with ID ${nonExistentNote} not found.`,
      "Error message for non-existent note should be specific",
    );
    console.log(
      `Received expected error for non-existent note: "${
        (result as { error: string }).error
      }"`,
    );
  });

  await t.step("_getNotesByItem: retrieve multiple notes for an item", async () => {
    console.log(
      "--- Test: _getNotesByItem: retrieve multiple notes for an item ---",
    );
    await notesConcept.createNote({
      item: testItem2,
      creator: testUser1,
      content: "Note 1 for Item2",
    });
    await notesConcept.createNote({
      item: testItem2,
      creator: testUser2,
      content: "Note 2 for Item2",
    });
    await notesConcept.createNote({
      item: testItem1,
      creator: testUser1,
      content: "Another note for Item1",
    }); // This one shouldn't appear in Item2's list

    const item2Notes = await notesConcept._getNotesByItem({ item: testItem2 });
    assertEquals(
      item2Notes.notes.length,
      2,
      "Should retrieve 2 notes for Item2",
    );
    const contents = item2Notes.notes.map((n) => n.content);
    assertExists(
      contents.includes("Note 1 for Item2"),
      "Should include 'Note 1 for Item2'",
    );
    assertExists(
      contents.includes("Note 2 for Item2"),
      "Should include 'Note 2 for Item2'",
    );
    console.log(`Found ${item2Notes.notes.length} notes for ${testItem2}.`);
  });

  await t.step(
    "_getNotesByCreator: retrieve multiple notes by a creator",
    async () => {
      console.log(
        "--- Test: _getNotesByCreator: retrieve multiple notes by a creator ---",
      );
      // testUser1 has already created several notes in previous tests
      const user1Notes = await notesConcept._getNotesByCreator({
        creator: testUser1,
      });
      assertNotEquals(
        user1Notes.notes.length,
        0,
        "Should retrieve notes for testUser1",
      );
      const user1Items = new Set(user1Notes.notes.map((n) => n.item));
      assertExists(
        user1Items.has(testItem1),
        "User1 should have notes on Item1",
      );
      assertExists(
        user1Items.has(testItem2),
        "User1 should have notes on Item2",
      );
      console.log(`Found ${user1Notes.notes.length} notes by ${testUser1}.`);
    },
  );

  await t.step("deleteNote: successful deletion", async () => {
    console.log("--- Test: deleteNote: successful deletion ---");
    const noteToDeleteContent = "This note is for deletion.";
    const createResult = await notesConcept.createNote({
      item: testItem1,
      creator: testUser1,
      content: noteToDeleteContent,
    });
    const noteToDeleteId = (createResult as { note: ID }).note;
    assertExists(noteToDeleteId, "Pre-condition: Note must be created for deletion");
    console.log(`Created note for deletion with ID: ${noteToDeleteId}`);

    const deleteResult = await notesConcept.deleteNote({ note: noteToDeleteId });
    assertEquals(
      Object.keys(deleteResult).length,
      0,
      "Should return an empty object on successful deletion",
    );
    console.log(`Note ${noteToDeleteId} deleted.`);

    const retrievedNote = await notesConcept.getNote({ note: noteToDeleteId });
    assertExists(
      (retrievedNote as { error: string }).error,
      "Should not be able to retrieve the deleted note",
    );
    assertEquals(
      (retrievedNote as { error: string }).error,
      `Note with ID ${noteToDeleteId} not found.`,
      "Error message should indicate note not found",
    );
    console.log("Verified: deleted note is no longer retrievable.");
  });

  await t.step("deleteNote: requires note to exist", async () => {
    console.log("--- Test: deleteNote: requires note to exist ---");
    const nonExistentNote: ID = "note:nonexistent-delete" as ID;
    const result = await notesConcept.deleteNote({ note: nonExistentNote });
    assertExists(
      (result as { error: string }).error,
      "Should return an error for non-existent note deletion",
    );
    assertEquals(
      (result as { error: string }).error,
      `Note with ID ${nonExistentNote} not found.`,
      "Error message for non-existent note deletion should be specific",
    );
    console.log(
      `Received expected error for non-existent note deletion: "${
        (result as { error: string }).error
      }"`,
    );
  });

  await t.step("Principle: create, retrieve, update, and delete a note", async () => {
    console.log("--- Principle Trace: Notes Concept ---");
    const principleItem: ID = "item:PrincipleItem" as ID;
    const principleUser: ID = "user:PrincipleUser" as ID;
    const initialPrincipleContent = "This is the initial note for the principle.";

    // Action 1: Create a note
    console.log(
      `1. Creating note for item "${principleItem}" by user "${principleUser}" with content: "${initialPrincipleContent}"`,
    );
    const createRes = await notesConcept.createNote({
      item: principleItem,
      creator: principleUser,
      content: initialPrincipleContent,
    });
    const principleNoteId = (createRes as { note: ID }).note;
    assertExists(principleNoteId, "Principle: Note must be created.");
    console.log(`   Note created with ID: ${principleNoteId}`);

    // Action 2: Retrieve it
    console.log(`2. Retrieving note with ID: ${principleNoteId}`);
    const retrievedRes1 = await notesConcept.getNote({ note: principleNoteId });
    assertExists(
      (retrievedRes1 as { content: string }).content,
      "Principle: Note must be retrievable.",
    );
    assertEquals(
      (retrievedRes1 as { content: string }).content,
      initialPrincipleContent,
      "Principle: Retrieved content matches initial.",
    );
    console.log(`   Retrieved content: "${(retrievedRes1 as { content: string }).content}"`);

    // Action 3: Update its content
    const updatedPrincipleContent = "This is the updated content for the principle note.";
    console.log(
      `3. Updating note "${principleNoteId}" with new content: "${updatedPrincipleContent}"`,
    );
    const updateRes = await notesConcept.updateNote({
      note: principleNoteId,
      content: updatedPrincipleContent,
    });
    assertExists(
      (updateRes as { note: ID }).note,
      "Principle: Note must be updatable.",
    );
    console.log(`   Note ${principleNoteId} updated.`);

    // Verify update
    const retrievedRes2 = await notesConcept.getNote({ note: principleNoteId });
    assertEquals(
      (retrievedRes2 as { content: string }).content,
      updatedPrincipleContent,
      "Principle: Retrieved content matches updated content.",
    );
    console.log(`   Verified updated content: "${(retrievedRes2 as { content: string }).content}"`);

    // Action 4: Delete it
    console.log(`4. Deleting note with ID: ${principleNoteId}`);
    const deleteRes = await notesConcept.deleteNote({ note: principleNoteId });
    assertEquals(
      Object.keys(deleteRes).length,
      0,
      "Principle: Note must be deletable.",
    );
    console.log(`   Note ${principleNoteId} deleted.`);

    // Verify deletion
    const retrievedRes3 = await notesConcept.getNote({ note: principleNoteId });
    assertExists(
      (retrievedRes3 as { error: string }).error,
      "Principle: Deleted note should not be retrievable.",
    );
    console.log(
      `   Verified: deleted note is no longer accessible. Principle fulfilled.`,
    );
  });

  await client.close();
});
```
