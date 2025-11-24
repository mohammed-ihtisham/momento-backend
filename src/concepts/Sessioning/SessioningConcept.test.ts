import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import SessioningConcept from "./SessioningConcept.ts";

const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;

Deno.test("Principle: After authentication, session is created, subsequent requests using session ID are treated as that user", async () => {
  const [db, client] = await testDb();
  const sessioningConcept = new SessioningConcept(db);

  try {
    // 1. After authentication, a session is created
    const createResult = await sessioningConcept.create({ user: userA });
    assertNotEquals(
      "error" in createResult,
      true,
      "Session creation should not fail.",
    );
    const { session } = createResult as { session: ID };
    assertExists(session);

    // 2. Subsequent requests using that session's ID are treated as being performed by that user
    const userFromSession = await sessioningConcept._getUser({ session });
    assertEquals(
      userFromSession,
      userA,
      "Session should be associated with user A.",
    );

    // 3. Until the session is deleted (logout)
    const deleteResult = await sessioningConcept.delete({ session });
    assertEquals("error" in deleteResult, false, "Delete should succeed.");

    // Session should no longer exist
    const userAfterDelete = await sessioningConcept._getUser({ session });
    assertEquals(
      userAfterDelete,
      null,
      "Session should not exist after deletion.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: create always succeeds (requires: true)", async () => {
  const [db, client] = await testDb();
  const sessioningConcept = new SessioningConcept(db);

  try {
    // Create should always succeed
    const result1 = await sessioningConcept.create({ user: userA });
    assertEquals("error" in result1, false, "Create should succeed.");

    const result2 = await sessioningConcept.create({ user: userB });
    assertEquals("error" in result2, false, "Create should succeed.");

    // Multiple sessions for same user should be allowed
    const result3 = await sessioningConcept.create({ user: userA });
    assertEquals("error" in result3, false, "Multiple sessions should be allowed.");

    // Verify all sessions exist
    const user1 = await sessioningConcept._getUser({
      session: (result1 as { session: ID }).session,
    });
    const user2 = await sessioningConcept._getUser({
      session: (result2 as { session: ID }).session,
    });
    const user3 = await sessioningConcept._getUser({
      session: (result3 as { session: ID }).session,
    });

    assertEquals(user1, userA, "Session 1 should be for user A.");
    assertEquals(user2, userB, "Session 2 should be for user B.");
    assertEquals(user3, userA, "Session 3 should be for user A.");
  } finally {
    await client.close();
  }
});

Deno.test("Action: delete requires existing session", async () => {
  const [db, client] = await testDb();
  const sessioningConcept = new SessioningConcept(db);

  try {
    // Delete non-existent session should fail
    const deleteResult = await sessioningConcept.delete({
      session: "session:fake" as ID,
    });
    assertEquals(
      "error" in deleteResult,
      true,
      "Deleting non-existent session should fail.",
    );

    // Create and delete
    const { session } = (await sessioningConcept.create({
      user: userA,
    })) as { session: ID };

    const successResult = await sessioningConcept.delete({ session });
    assertEquals(
      "error" in successResult,
      false,
      "Deleting existing session should succeed.",
    );

    // Verify deletion
    const user = await sessioningConcept._getUser({ session });
    assertEquals(user, null, "Session should not exist after deletion.");
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getUser returns correct user or null", async () => {
  const [db, client] = await testDb();
  const sessioningConcept = new SessioningConcept(db);

  try {
    // Non-existent session should return null
    const nonExistent = await sessioningConcept._getUser({
      session: "session:fake" as ID,
    });
    assertEquals(nonExistent, null, "Should return null for non-existent session.");

    // Create session
    const { session } = (await sessioningConcept.create({
      user: userA,
    })) as { session: ID };

    // Get user should return correct user
    const user = await sessioningConcept._getUser({ session });
    assertEquals(user, userA, "Should return correct user for session.");
  } finally {
    await client.close();
  }
});

