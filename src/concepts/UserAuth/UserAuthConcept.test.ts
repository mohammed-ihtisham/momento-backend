import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import UserAuthConcept from "./UserAuthConcept.ts";

const usernameA = "alice";
const passwordA = "password123";
const usernameB = "bob";
const passwordB = "securePassword456";

Deno.test("Principle: Register with username and password, then login with same credentials", async () => {
  const [db, client] = await testDb();
  const userAuthConcept = new UserAuthConcept(db);

  try {
    // 1. Register a new user with username and password
    const registerResult = await userAuthConcept.register({
      username: usernameA,
      password: passwordA,
    });
    assertNotEquals(
      "error" in registerResult,
      true,
      "Registration should not fail.",
    );
    const { user: userId } = registerResult as { user: string };
    assertExists(userId, "User ID should be returned.");

    // 2. Verify the user was created
    const userDoc = await userAuthConcept._getUserByUsername({
      username: usernameA,
    });
    assertExists(userDoc, "User should exist in the database.");
    assertEquals(userDoc.username, usernameA, "Username should match.");
    assertNotEquals(
      userDoc.passwordHash,
      passwordA,
      "Password should be hashed, not stored in plain text.",
    );

    // 3. Login with the same credentials
    const loginResult = await userAuthConcept.login({
      username: usernameA,
      password: passwordA,
    });
    assertNotEquals(
      "error" in loginResult,
      true,
      "Login should succeed with correct credentials.",
    );
    const { user: loggedInUserId } = loginResult as { user: string };
    assertEquals(
      loggedInUserId,
      userId,
      "Logged in user ID should match registered user ID.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: register requires unique username", async () => {
  const [db, client] = await testDb();
  const userAuthConcept = new UserAuthConcept(db);

  try {
    // First registration should succeed
    const firstRegisterResult = await userAuthConcept.register({
      username: usernameA,
      password: passwordA,
    });
    assertEquals(
      "error" in firstRegisterResult,
      false,
      "First registration should succeed.",
    );

    // Second registration with same username should fail
    const duplicateRegisterResult = await userAuthConcept.register({
      username: usernameA,
      password: passwordB,
    });
    assertEquals(
      "error" in duplicateRegisterResult,
      true,
      "Registering with duplicate username should fail.",
    );
    assertEquals(
      (duplicateRegisterResult as { error: string }).error,
      `User with username ${usernameA} already exists.`,
      "Error message should indicate duplicate username.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: login requirements are enforced", async () => {
  const [db, client] = await testDb();
  const userAuthConcept = new UserAuthConcept(db);

  try {
    // Setup: Register a user
    await userAuthConcept.register({
      username: usernameA,
      password: passwordA,
    });

    // Requires: User must exist
    const nonExistentUserResult = await userAuthConcept.login({
      username: "nonexistent",
      password: passwordA,
    });
    assertEquals(
      "error" in nonExistentUserResult,
      true,
      "Login with non-existent username should fail.",
    );
    assertEquals(
      (nonExistentUserResult as { error: string }).error,
      "User with username nonexistent not found.",
      "Error message should indicate user not found.",
    );

    // Requires: Password must match
    const wrongPasswordResult = await userAuthConcept.login({
      username: usernameA,
      password: "wrongpassword",
    });
    assertEquals(
      "error" in wrongPasswordResult,
      true,
      "Login with wrong password should fail.",
    );
    assertEquals(
      (wrongPasswordResult as { error: string }).error,
      "Invalid password.",
      "Error message should indicate invalid password.",
    );

    // Successful login with correct credentials
    const correctLoginResult = await userAuthConcept.login({
      username: usernameA,
      password: passwordA,
    });
    assertEquals(
      "error" in correctLoginResult,
      false,
      "Login with correct credentials should succeed.",
    );
    assertExists(
      (correctLoginResult as { user: string }).user,
      "User ID should be returned on successful login.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Multiple users can register and login independently", async () => {
  const [db, client] = await testDb();
  const userAuthConcept = new UserAuthConcept(db);

  try {
    // Register two different users
    const registerA = await userAuthConcept.register({
      username: usernameA,
      password: passwordA,
    });
    assertEquals(
      "error" in registerA,
      false,
      "Registration of user A should succeed.",
    );
    const { user: userA } = registerA as { user: string };

    const registerB = await userAuthConcept.register({
      username: usernameB,
      password: passwordB,
    });
    assertEquals(
      "error" in registerB,
      false,
      "Registration of user B should succeed.",
    );
    const { user: userB } = registerB as { user: string };

    // Verify they have different user IDs
    assertNotEquals(userA, userB, "Users should have different IDs.");

    // Both users can login with their own credentials
    const loginA = await userAuthConcept.login({
      username: usernameA,
      password: passwordA,
    });
    assertEquals(
      "error" in loginA,
      false,
      "User A should be able to login.",
    );
    assertEquals(
      (loginA as { user: string }).user,
      userA,
      "User A login should return correct user ID.",
    );

    const loginB = await userAuthConcept.login({
      username: usernameB,
      password: passwordB,
    });
    assertEquals(
      "error" in loginB,
      false,
      "User B should be able to login.",
    );
    assertEquals(
      (loginB as { user: string }).user,
      userB,
      "User B login should return correct user ID.",
    );

    // User A cannot login with User B's credentials
    const crossLoginResult = await userAuthConcept.login({
      username: usernameA,
      password: passwordB,
    });
    assertEquals(
      "error" in crossLoginResult,
      true,
      "User A should not be able to login with User B's password.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getUserByUsername returns correct user or null", async () => {
  const [db, client] = await testDb();
  const userAuthConcept = new UserAuthConcept(db);

  try {
    // Query for non-existent user should return null
    const nonExistent = await userAuthConcept._getUserByUsername({
      username: "nonexistent",
    });
    assertEquals(
      nonExistent,
      null,
      "Query for non-existent user should return null.",
    );

    // Register a user
    const registerResult = await userAuthConcept.register({
      username: usernameA,
      password: passwordA,
    });
    const { user: userId } = registerResult as { user: string };

    // Query for existing user should return user document
    const userDoc = await userAuthConcept._getUserByUsername({
      username: usernameA,
    });
    assertExists(userDoc, "Query for existing user should return user document.");
    assertEquals(userDoc._id, userId, "User ID should match.");
    assertEquals(userDoc.username, usernameA, "Username should match.");
    assertExists(
      userDoc.passwordHash,
      "Password hash should be present.",
    );
    assertNotEquals(
      userDoc.passwordHash,
      passwordA,
      "Password hash should not be the plain password.",
    );
  } finally {
    await client.close();
  }
});

