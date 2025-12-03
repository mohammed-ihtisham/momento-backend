import { assertEquals, assertExists } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import CollaboratorsConcept from "./CollaboratorsConcept.ts";

const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;
const userC = "user:Charlie" as ID;
const occasion1 = "occasion:1" as ID;
const occasion2 = "occasion:2" as ID;

Deno.test("Principle: User adds collaborators, can remove them, list updates immediately", async () => {
  const [db, client] = await testDb();
  const collaboratorsConcept = new CollaboratorsConcept(db);

  try {
    // 1. User adds other users as collaborators
    const addA = await collaboratorsConcept.addCollaborator({ user: userA, occasionId: occasion1, sender: userB });
    assertEquals("error" in addA, false, "Adding user A should succeed.");

    const addC = await collaboratorsConcept.addCollaborator({ user: userC, occasionId: occasion1, sender: userB });
    assertEquals("error" in addC, false, "Adding user C should succeed.");

    // 2. List of collaborators is updated for the occasion
    const collaborators = await collaboratorsConcept._getCollaboratorsForOccasion({ occasionId: occasion1 });
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
      collaborators.includes(userC),
      true,
      "Should include user C.",
    );

    // 3. Collaborators can be removed
    const removeA = await collaboratorsConcept.removeCollaborator({ user: userA, occasionId: occasion1 });
    assertEquals("error" in removeA, false, "Removing user A should succeed.");

    // 4. List updates immediately
    const updatedList = await collaboratorsConcept._getCollaboratorsForOccasion({ occasionId: occasion1 });
    assertEquals(
      updatedList.length,
      1,
      "Should have 1 collaborator after removal.",
    );
    assertEquals(
      updatedList.includes(userC),
      true,
      "Should still include user C.",
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
    const firstResult = await collaboratorsConcept.addCollaborator({ user: userA, occasionId: occasion1, sender: userB });
    assertEquals(
      "error" in firstResult,
      false,
      "First addition should succeed.",
    );

    // Duplicate addition should fail
    const duplicateResult = await collaboratorsConcept.addCollaborator({
      user: userA,
      occasionId: occasion1,
      sender: userB,
    });
    assertEquals(
      "error" in duplicateResult,
      true,
      "Adding duplicate collaborator should fail.",
    );
    assertEquals(
      (duplicateResult as { error: string }).error,
      `User ${userA} is already a collaborator on this occasion.`,
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
      occasionId: occasion1,
    });
    assertEquals(
      "error" in removeResult,
      true,
      "Removing non-collaborator should fail.",
    );

    // Add then remove
    await collaboratorsConcept.addCollaborator({ user: userA, occasionId: occasion1, sender: userB });
    const successResult = await collaboratorsConcept.removeCollaborator({
      user: userA,
      occasionId: occasion1,
    });
    assertEquals(
      "error" in successResult,
      false,
      "Removing existing collaborator should succeed.",
    );

    // Verify removal
    const isCollaborator = await collaboratorsConcept._isCollaboratorOnOccasion({
      user: userA,
      occasionId: occasion1,
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

Deno.test("Query: _isCollaboratorOnOccasion returns correct status", async () => {
  const [db, client] = await testDb();
  const collaboratorsConcept = new CollaboratorsConcept(db);

  try {
    // User not a collaborator
    const notCollaborator = await collaboratorsConcept._isCollaboratorOnOccasion({
      user: userA,
      occasionId: occasion1,
    });
    assertEquals(
      notCollaborator,
      false,
      "Should return false for non-collaborator.",
    );

    // Add user
    await collaboratorsConcept.addCollaborator({ user: userA, occasionId: occasion1, sender: userB });

    // User is a collaborator
    const isCollaborator = await collaboratorsConcept._isCollaboratorOnOccasion({
      user: userA,
      occasionId: occasion1,
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
    // Add multiple collaborators to occasion1
    await collaboratorsConcept.addCollaborator({ user: userA, occasionId: occasion1, sender: userB });
    await collaboratorsConcept.addCollaborator({ user: userB, occasionId: occasion1, sender: userB });
    await collaboratorsConcept.addCollaborator({ user: userC, occasionId: occasion1, sender: userB });

    const all = await collaboratorsConcept._getCollaboratorsForOccasion({ occasionId: occasion1 });
    assertEquals(all.length, 3, "Should have 3 collaborators.");

    // Remove one
    await collaboratorsConcept.removeCollaborator({ user: userB, occasionId: occasion1 });

    const afterRemove = await collaboratorsConcept._getCollaboratorsForOccasion({ occasionId: occasion1 });
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

Deno.test("Invite workflow: create, accept, decline", async () => {
  const [db, client] = await testDb();
  const collaboratorsConcept = new CollaboratorsConcept(db);

  try {
    // Create invite
    const createResult = await collaboratorsConcept.createInvite({
      sender: userA,
      recipient: userB,
      occasionId: occasion1,
    });
    assertEquals("error" in createResult, false, "Creating invite should succeed.");
    const inviteId = (createResult as { invite: ID }).invite;

    // Check incoming invites for recipient
    const incoming = await collaboratorsConcept._getIncomingInvites({ recipient: userB });
    assertEquals(incoming.length, 1, "Should have 1 incoming invite.");
    assertEquals(incoming[0].invite, inviteId, "Invite ID should match.");

    // Check sent invites for sender
    const sent = await collaboratorsConcept._getSentInvites({ sender: userA });
    assertEquals(sent.length, 1, "Should have 1 sent invite.");
    assertEquals(sent[0].status, "pending", "Invite should be pending.");

    // Accept invite
    const acceptResult = await collaboratorsConcept.acceptInvite({
      invite: inviteId,
      recipient: userB,
    });
    assertEquals("error" in acceptResult, false, "Accepting invite should succeed.");

    // Verify user is now a collaborator
    const isCollaborator = await collaboratorsConcept._isCollaboratorOnOccasion({
      user: userB,
      occasionId: occasion1,
    });
    assertEquals(isCollaborator, true, "User should be a collaborator after accepting.");

    // Check that invite status is updated
    const sentAfterAccept = await collaboratorsConcept._getSentInvites({ sender: userA });
    assertEquals(sentAfterAccept[0].status, "accepted", "Invite should be accepted.");
  } finally {
    await client.close();
  }
});

