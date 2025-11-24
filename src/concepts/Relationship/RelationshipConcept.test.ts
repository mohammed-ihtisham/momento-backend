import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import RelationshipConcept from "./RelationshipConcept.ts";

const ownerA = "user:Alice" as ID;
const ownerB = "user:Bob" as ID;

Deno.test("Principle: User creates relationship, can later retrieve and manage it", async () => {
  const [db, client] = await testDb();
  const relationshipConcept = new RelationshipConcept(db);

  try {
    // 1. User creates a relationship
    const createResult = await relationshipConcept.createRelationship({
      owner: ownerA,
      name: "John Doe",
      relationshipType: "Friend",
    });
    assertNotEquals(
      "error" in createResult,
      true,
      "Relationship creation should not fail.",
    );
    const { relationship } = createResult as { relationship: ID };
    assertExists(relationship);

    // 2. User can retrieve the relationship
    const relationshipData = await relationshipConcept._getRelationship({
      relationship,
    });
    assertExists(relationshipData, "Relationship should exist.");
    assertEquals(relationshipData.name, "John Doe", "Name should match.");
    assertEquals(
      relationshipData.relationshipType,
      "Friend",
      "RelationshipType should match.",
    );

    // 3. User can manage (update) the relationship
    const updateResult = await relationshipConcept.updateRelationship({
      relationship,
      relationshipType: "Close Friend",
    });
    assertEquals(
      "error" in updateResult,
      false,
      "Update should succeed.",
    );

    const updatedData = await relationshipConcept._getRelationship({
      relationship,
    });
    assertEquals(
      updatedData?.relationshipType,
      "Close Friend",
      "RelationshipType should be updated.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: createRelationship requirements are enforced", async () => {
  const [db, client] = await testDb();
  const relationshipConcept = new RelationshipConcept(db);

  try {
    // Requires: name is not empty
    const emptyNameResult = await relationshipConcept.createRelationship({
      owner: ownerA,
      name: "",
      relationshipType: "Friend",
    });
    assertEquals(
      "error" in emptyNameResult,
      true,
      "Creating with empty name should fail.",
    );

    // Requires: relationshipType is not empty
    const emptyTypeResult = await relationshipConcept.createRelationship({
      owner: ownerA,
      name: "John",
      relationshipType: "",
    });
    assertEquals(
      "error" in emptyTypeResult,
      true,
      "Creating with empty relationshipType should fail.",
    );

    // Requires: no duplicate name for same owner
    await relationshipConcept.createRelationship({
      owner: ownerA,
      name: "John Doe",
      relationshipType: "Friend",
    });
    const duplicateResult = await relationshipConcept.createRelationship({
      owner: ownerA,
      name: "John Doe",
      relationshipType: "Colleague",
    });
    assertEquals(
      "error" in duplicateResult,
      true,
      "Creating duplicate name for same owner should fail.",
    );

    // Different owners can have same name
    const differentOwnerResult = await relationshipConcept.createRelationship({
      owner: ownerB,
      name: "John Doe",
      relationshipType: "Friend",
    });
    assertEquals(
      "error" in differentOwnerResult,
      false,
      "Different owners can have same name.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: updateRelationship requirements are enforced", async () => {
  const [db, client] = await testDb();
  const relationshipConcept = new RelationshipConcept(db);

  try {
    // Setup
    const { relationship } =
      (await relationshipConcept.createRelationship({
        owner: ownerA,
        name: "John Doe",
        relationshipType: "Friend",
      })) as { relationship: ID };

    // Requires: at least one field provided
    const noFieldsResult = await relationshipConcept.updateRelationship({
      relationship,
    });
    assertEquals(
      "error" in noFieldsResult,
      true,
      "Update with no fields should fail.",
    );

    // Requires: relationship exists
    const nonExistentResult = await relationshipConcept.updateRelationship({
      relationship: "relationship:fake" as ID,
      name: "New Name",
    });
    assertEquals(
      "error" in nonExistentResult,
      true,
      "Updating non-existent relationship should fail.",
    );

    // Requires: if name provided, no duplicate for same owner
    await relationshipConcept.createRelationship({
      owner: ownerA,
      name: "Jane Doe",
      relationshipType: "Friend",
    });
    const duplicateNameResult = await relationshipConcept.updateRelationship({
      relationship,
      name: "Jane Doe",
    });
    assertEquals(
      "error" in duplicateNameResult,
      true,
      "Updating to duplicate name should fail.",
    );

    // Successful update
    const successResult = await relationshipConcept.updateRelationship({
      relationship,
      name: "John Updated",
      relationshipType: "Close Friend",
    });
    assertEquals(
      "error" in successResult,
      false,
      "Valid update should succeed.",
    );

    const updated = await relationshipConcept._getRelationship({ relationship });
    assertEquals(updated?.name, "John Updated", "Name should be updated.");
    assertEquals(
      updated?.relationshipType,
      "Close Friend",
      "RelationshipType should be updated.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: deleteRelationship requires existing relationship", async () => {
  const [db, client] = await testDb();
  const relationshipConcept = new RelationshipConcept(db);

  try {
    // Delete non-existent should fail
    const deleteResult = await relationshipConcept.deleteRelationship({
      relationship: "relationship:fake" as ID,
    });
    assertEquals(
      "error" in deleteResult,
      true,
      "Deleting non-existent relationship should fail.",
    );

    // Create and delete
    const { relationship } =
      (await relationshipConcept.createRelationship({
        owner: ownerA,
        name: "John Doe",
        relationshipType: "Friend",
      })) as { relationship: ID };

    const successResult = await relationshipConcept.deleteRelationship({
      relationship,
    });
    assertEquals(
      "error" in successResult,
      false,
      "Deleting existing relationship should succeed.",
    );

    // Verify deletion
    const deleted = await relationshipConcept._getRelationship({ relationship });
    assertEquals(deleted, null, "Relationship should be deleted.");
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getRelationships returns all relationships for owner", async () => {
  const [db, client] = await testDb();
  const relationshipConcept = new RelationshipConcept(db);

  try {
    // Create multiple relationships
    await relationshipConcept.createRelationship({
      owner: ownerA,
      name: "John",
      relationshipType: "Friend",
    });
    await relationshipConcept.createRelationship({
      owner: ownerA,
      name: "Jane",
      relationshipType: "Family",
    });
    await relationshipConcept.createRelationship({
      owner: ownerB,
      name: "Bob",
      relationshipType: "Colleague",
    });

    const relationships = await relationshipConcept._getRelationships({
      owner: ownerA,
    });
    assertEquals(
      relationships.length,
      2,
      "Should return 2 relationships for owner A.",
    );
    assertEquals(
      relationships.some((r) => r.name === "John"),
      true,
      "Should include John.",
    );
    assertEquals(
      relationships.some((r) => r.name === "Jane"),
      true,
      "Should include Jane.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getRelationshipByName returns relationship by name", async () => {
  const [db, client] = await testDb();
  const relationshipConcept = new RelationshipConcept(db);

  try {
    // Create relationship
    const { relationship } =
      (await relationshipConcept.createRelationship({
        owner: ownerA,
        name: "John Doe",
        relationshipType: "Friend",
      })) as { relationship: ID };

    // Query by name
    const result = await relationshipConcept._getRelationshipByName({
      owner: ownerA,
      name: "John Doe",
    });
    assertExists(result, "Should find relationship by name.");
    assertEquals(result.relationship, relationship, "Should return correct relationship ID.");
    assertEquals(
      result.relationshipType,
      "Friend",
      "Should return correct relationshipType.",
    );

    // Query non-existent
    const nonExistent = await relationshipConcept._getRelationshipByName({
      owner: ownerA,
      name: "Non Existent",
    });
    assertEquals(nonExistent, null, "Should return null for non-existent name.");
  } finally {
    await client.close();
  }
});

