import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import ProfileConcept from "./ProfileConcept.ts";

const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;

Deno.test("Principle: User sets their name, then system can view these details", async () => {
  const [db, client] = await testDb();
  const profileConcept = new ProfileConcept(db);

  try {
    // 1. User sets their name
    const createResult = await profileConcept.createProfile({
      user: userA,
      name: "Alice Smith",
    });
    assertNotEquals(
      "error" in createResult,
      true,
      "Profile creation should not fail.",
    );
    const { profile } = createResult as { profile: ID };
    assertExists(profile);

    // 2. System can view these details
    const profileData = await profileConcept._getProfile({ user: userA });
    assertExists(profileData, "Profile should exist.");
    assertEquals(profileData.name, "Alice Smith", "Name should match.");

    const name = await profileConcept._getName({ user: userA });
    assertEquals(name, "Alice Smith", "Name query should return correct name.");
  } finally {
    await client.close();
  }
});

Deno.test("Action: createProfile requires no existing profile for user", async () => {
  const [db, client] = await testDb();
  const profileConcept = new ProfileConcept(db);

  try {
    // First creation should succeed
    const firstResult = await profileConcept.createProfile({
      user: userA,
      name: "Alice",
    });
    assertEquals(
      "error" in firstResult,
      false,
      "First profile creation should succeed.",
    );

    // Second creation should fail
    const duplicateResult = await profileConcept.createProfile({
      user: userA,
      name: "Alice Updated",
    });
    assertEquals(
      "error" in duplicateResult,
      true,
      "Creating duplicate profile should fail.",
    );
    assertEquals(
      (duplicateResult as { error: string }).error,
      `Profile for user ${userA} already exists.`,
      "Error message should indicate duplicate profile.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: updateName requires existing profile", async () => {
  const [db, client] = await testDb();
  const profileConcept = new ProfileConcept(db);

  try {
    // Update without existing profile should fail
    const updateResult = await profileConcept.updateName({
      user: userA,
      name: "New Name",
    });
    assertEquals(
      "error" in updateResult,
      true,
      "Updating non-existent profile should fail.",
    );

    // Create profile first
    await profileConcept.createProfile({ user: userA, name: "Original Name" });

    // Update should succeed
    const successResult = await profileConcept.updateName({
      user: userA,
      name: "Updated Name",
    });
    assertEquals(
      "error" in successResult,
      false,
      "Updating existing profile should succeed.",
    );

    // Verify the update
    const name = await profileConcept._getName({ user: userA });
    assertEquals(name, "Updated Name", "Name should be updated.");
  } finally {
    await client.close();
  }
});

Deno.test("Action: deleteProfile requires existing profile", async () => {
  const [db, client] = await testDb();
  const profileConcept = new ProfileConcept(db);

  try {
    // Delete without existing profile should fail
    const deleteResult = await profileConcept.deleteProfile({ user: userA });
    assertEquals(
      "error" in deleteResult,
      true,
      "Deleting non-existent profile should fail.",
    );

    // Create profile first
    await profileConcept.createProfile({ user: userA, name: "Alice" });

    // Delete should succeed
    const successResult = await profileConcept.deleteProfile({ user: userA });
    assertEquals(
      "error" in successResult,
      false,
      "Deleting existing profile should succeed.",
    );

    // Verify deletion
    const profile = await profileConcept._getProfile({ user: userA });
    assertEquals(profile, null, "Profile should be deleted.");
  } finally {
    await client.close();
  }
});

Deno.test("Multiple users can have independent profiles", async () => {
  const [db, client] = await testDb();
  const profileConcept = new ProfileConcept(db);

  try {
    // Create profiles for two users
    const profileA = await profileConcept.createProfile({
      user: userA,
      name: "Alice",
    });
    const profileB = await profileConcept.createProfile({
      user: userB,
      name: "Bob",
    });

    assertEquals(
      "error" in profileA,
      false,
      "Profile A creation should succeed.",
    );
    assertEquals(
      "error" in profileB,
      false,
      "Profile B creation should succeed.",
    );

    // Verify they are independent
    const nameA = await profileConcept._getName({ user: userA });
    const nameB = await profileConcept._getName({ user: userB });
    assertEquals(nameA, "Alice", "User A name should be correct.");
    assertEquals(nameB, "Bob", "User B name should be correct.");

    // Update one doesn't affect the other
    await profileConcept.updateName({ user: userA, name: "Alice Updated" });
    const updatedNameA = await profileConcept._getName({ user: userA });
    const unchangedNameB = await profileConcept._getName({ user: userB });
    assertEquals(updatedNameA, "Alice Updated", "User A name should be updated.");
    assertEquals(unchangedNameB, "Bob", "User B name should remain unchanged.");
  } finally {
    await client.close();
  }
});

