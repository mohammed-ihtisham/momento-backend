import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import OccasionConcept from "./OccasionConcept.ts";

const ownerA = "user:Alice" as ID;

Deno.test("Principle: User creates occasion, can later retrieve and manage it", async () => {
  const [db, client] = await testDb();
  const occasionConcept = new OccasionConcept(db);

  try {
    // 1. User creates an occasion
    const createResult = await occasionConcept.createOccasion({
      owner: ownerA,
      person: "John Doe",
      occasionType: "Birthday",
      date: "2024-12-25",
    });
    assertNotEquals(
      "error" in createResult,
      true,
      "Occasion creation should not fail.",
    );
    const { occasion } = createResult as { occasion: ID };
    assertExists(occasion);

    // 2. User can retrieve the occasion
    const occasionData = await occasionConcept._getOccasion({ occasion });
    assertExists(occasionData, "Occasion should exist.");
    assertEquals(occasionData.person, "John Doe", "Person should match.");
    assertEquals(occasionData.occasionType, "Birthday", "OccasionType should match.");
    assertEquals(occasionData.date, "2024-12-25", "Date should match.");

    // 3. User can manage (update) the occasion
    const updateResult = await occasionConcept.updateOccasion({
      occasion,
      occasionType: "Anniversary",
    });
    assertEquals("error" in updateResult, false, "Update should succeed.");

    const updatedData = await occasionConcept._getOccasion({ occasion });
    assertEquals(
      updatedData?.occasionType,
      "Anniversary",
      "OccasionType should be updated.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: createOccasion requirements are enforced", async () => {
  const [db, client] = await testDb();
  const occasionConcept = new OccasionConcept(db);

  try {
    // Requires: person is not empty
    const emptyPersonResult = await occasionConcept.createOccasion({
      owner: ownerA,
      person: "",
      occasionType: "Birthday",
      date: "2024-12-25",
    });
    assertEquals(
      "error" in emptyPersonResult,
      true,
      "Creating with empty person should fail.",
    );

    // Requires: occasionType is not empty
    const emptyTypeResult = await occasionConcept.createOccasion({
      owner: ownerA,
      person: "John",
      occasionType: "",
      date: "2024-12-25",
    });
    assertEquals(
      "error" in emptyTypeResult,
      true,
      "Creating with empty occasionType should fail.",
    );

    // Requires: date is valid ISO 8601
    const invalidDateResult = await occasionConcept.createOccasion({
      owner: ownerA,
      person: "John",
      occasionType: "Birthday",
      date: "invalid-date",
    });
    assertEquals(
      "error" in invalidDateResult,
      true,
      "Creating with invalid date should fail.",
    );

    // Valid date should succeed
    const validResult = await occasionConcept.createOccasion({
      owner: ownerA,
      person: "John",
      occasionType: "Birthday",
      date: "2024-12-25T00:00:00Z",
    });
    assertEquals(
      "error" in validResult,
      false,
      "Creating with valid ISO 8601 date should succeed.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: updateOccasion requirements are enforced", async () => {
  const [db, client] = await testDb();
  const occasionConcept = new OccasionConcept(db);

  try {
    // Setup
    const { occasion } =
      (await occasionConcept.createOccasion({
        owner: ownerA,
        person: "John Doe",
        occasionType: "Birthday",
        date: "2024-12-25",
      })) as { occasion: ID };

    // Requires: at least one field provided
    const noFieldsResult = await occasionConcept.updateOccasion({ occasion });
    assertEquals(
      "error" in noFieldsResult,
      true,
      "Update with no fields should fail.",
    );

    // Requires: occasion exists
    const nonExistentResult = await occasionConcept.updateOccasion({
      occasion: "occasion:fake" as ID,
      person: "New Person",
    });
    assertEquals(
      "error" in nonExistentResult,
      true,
      "Updating non-existent occasion should fail.",
    );

    // Requires: if date provided, it's valid ISO 8601
    const invalidDateResult = await occasionConcept.updateOccasion({
      occasion,
      date: "invalid",
    });
    assertEquals(
      "error" in invalidDateResult,
      true,
      "Updating with invalid date should fail.",
    );

    // Successful update
    const successResult = await occasionConcept.updateOccasion({
      occasion,
      person: "Jane Doe",
      occasionType: "Anniversary",
      date: "2025-01-01",
    });
    assertEquals(
      "error" in successResult,
      false,
      "Valid update should succeed.",
    );

    const updated = await occasionConcept._getOccasion({ occasion });
    assertEquals(updated?.person, "Jane Doe", "Person should be updated.");
    assertEquals(
      updated?.occasionType,
      "Anniversary",
      "OccasionType should be updated.",
    );
    assertEquals(updated?.date, "2025-01-01", "Date should be updated.");
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getOccasionsByPerson returns occasions for person", async () => {
  const [db, client] = await testDb();
  const occasionConcept = new OccasionConcept(db);

  try {
    await occasionConcept.createOccasion({
      owner: ownerA,
      person: "John",
      occasionType: "Birthday",
      date: "2024-12-25",
    });
    await occasionConcept.createOccasion({
      owner: ownerA,
      person: "John",
      occasionType: "Anniversary",
      date: "2025-06-15",
    });
    await occasionConcept.createOccasion({
      owner: ownerA,
      person: "Jane",
      occasionType: "Birthday",
      date: "2024-11-10",
    });

    const johnOccasions = await occasionConcept._getOccasionsByPerson({
      owner: ownerA,
      person: "John",
    });
    assertEquals(
      johnOccasions.length,
      2,
      "Should return 2 occasions for John.",
    );
    assertEquals(
      johnOccasions.every((o) => o.person === "John"),
      true,
      "All occasions should be for John.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getOccasionsByDate returns occasions for date", async () => {
  const [db, client] = await testDb();
  const occasionConcept = new OccasionConcept(db);

  try {
    await occasionConcept.createOccasion({
      owner: ownerA,
      person: "John",
      occasionType: "Birthday",
      date: "2024-12-25",
    });
    await occasionConcept.createOccasion({
      owner: ownerA,
      person: "Jane",
      occasionType: "Anniversary",
      date: "2024-12-25",
    });
    await occasionConcept.createOccasion({
      owner: ownerA,
      person: "Bob",
      occasionType: "Birthday",
      date: "2024-11-10",
    });

    const dateOccasions = await occasionConcept._getOccasionsByDate({
      owner: ownerA,
      date: "2024-12-25",
    });
    assertEquals(
      dateOccasions.length,
      2,
      "Should return 2 occasions for the date.",
    );
    assertEquals(
      dateOccasions.every((o) => o.date === "2024-12-25"),
      true,
      "All occasions should be for the same date.",
    );
  } finally {
    await client.close();
  }
});

