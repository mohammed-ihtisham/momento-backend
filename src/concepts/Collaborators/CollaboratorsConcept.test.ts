import { assertEquals, assertExists } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import CollaboratorsConcept from "./CollaboratorsConcept.ts";

const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;
const userC = "user:Charlie" as ID;

Deno.test("Principle: User adds collaborators, can remove them, list updates immediately", async () => {
  const [db, client] = await testDb();
  const collaboratorsConcept = new CollaboratorsConcept(db);

  try {
    // 1. User adds other users as collaborators
    const addA = await collaboratorsConcept.addCollaborator({ user: userA });
    assertEquals("error" in addA, false, "Adding user A should succeed.");

    const addB = await collaboratorsConcept.addCollaborator({ user: userB });
    assertEquals("error" in addB, false, "Adding user B should succeed.");

    // 2. List of collaborators is updated
    const collaborators = await collaboratorsConcept._getCollaborators();
    assertEquals(
      collaborators.length,
      2,
      "Should have 2 collaborators.",
    );
    assertEquals(
      collaborators.includes(userA),
      true,
      "Should include user A.",
    );
    assertEquals(
      collaborators.includes(userB),
      true,
      "Should include user B.",
    );

    // 3. Collaborators can be removed
    const removeA = await collaboratorsConcept.removeCollaborator({ user: userA });
    assertEquals("error" in removeA, false, "Removing user A should succeed.");

    // 4. List updates immediately
    const updatedList = await collaboratorsConcept._getCollaborators();
    assertEquals(
      updatedList.length,
      1,
      "Should have 1 collaborator after removal.",
    );
    assertEquals(
      updatedList.includes(userB),
      true,
      "Should still include user B.",
    );
    assertEquals(
      updatedList.includes(userA),
      false,
      "Should not include user A after removal.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: addCollaborator requires user not already a collaborator", async () => {
  const [db, client] = await testDb();
  const collaboratorsConcept = new CollaboratorsConcept(db);

  try {
    // First addition should succeed
    const firstResult = await collaboratorsConcept.addCollaborator({ user: userA });
    assertEquals(
      "error" in firstResult,
      false,
      "First addition should succeed.",
    );

    // Duplicate addition should fail
    const duplicateResult = await collaboratorsConcept.addCollaborator({
      user: userA,
    });
    assertEquals(
      "error" in duplicateResult,
      true,
      "Adding duplicate collaborator should fail.",
    );
    assertEquals(
      (duplicateResult as { error: string }).error,
      `User ${userA} is already a collaborator.`,
      "Error message should indicate duplicate.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: removeCollaborator requires user is currently a collaborator", async () => {
  const [db, client] = await testDb();
  const collaboratorsConcept = new CollaboratorsConcept(db);

  try {
    // Remove non-collaborator should fail
    const removeResult = await collaboratorsConcept.removeCollaborator({
      user: userA,
    });
    assertEquals(
      "error" in removeResult,
      true,
      "Removing non-collaborator should fail.",
    );

    // Add then remove
    await collaboratorsConcept.addCollaborator({ user: userA });
    const successResult = await collaboratorsConcept.removeCollaborator({
      user: userA,
    });
    assertEquals(
      "error" in successResult,
      false,
      "Removing existing collaborator should succeed.",
    );

    // Verify removal
    const isCollaborator = await collaboratorsConcept._hasCollaborator({
      user: userA,
    });
    assertEquals(
      isCollaborator,
      false,
      "User should not be a collaborator after removal.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Query: _hasCollaborator returns correct status", async () => {
  const [db, client] = await testDb();
  const collaboratorsConcept = new CollaboratorsConcept(db);

  try {
    // User not a collaborator
    const notCollaborator = await collaboratorsConcept._hasCollaborator({
      user: userA,
    });
    assertEquals(
      notCollaborator,
      false,
      "Should return false for non-collaborator.",
    );

    // Add user
    await collaboratorsConcept.addCollaborator({ user: userA });

    // User is a collaborator
    const isCollaborator = await collaboratorsConcept._hasCollaborator({
      user: userA,
    });
    assertEquals(
      isCollaborator,
      true,
      "Should return true for collaborator.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Multiple collaborators can be managed independently", async () => {
  const [db, client] = await testDb();
  const collaboratorsConcept = new CollaboratorsConcept(db);

  try {
    // Add multiple collaborators
    await collaboratorsConcept.addCollaborator({ user: userA });
    await collaboratorsConcept.addCollaborator({ user: userB });
    await collaboratorsConcept.addCollaborator({ user: userC });

    const all = await collaboratorsConcept._getCollaborators();
    assertEquals(all.length, 3, "Should have 3 collaborators.");

    // Remove one
    await collaboratorsConcept.removeCollaborator({ user: userB });

    const afterRemove = await collaboratorsConcept._getCollaborators();
    assertEquals(
      afterRemove.length,
      2,
      "Should have 2 collaborators after removal.",
    );
    assertEquals(
      afterRemove.includes(userA),
      true,
      "Should still include user A.",
    );
    assertEquals(
      afterRemove.includes(userC),
      true,
      "Should still include user C.",
    );
    assertEquals(
      afterRemove.includes(userB),
      false,
      "Should not include user B.",
    );
  } finally {
    await client.close();
  }
});

