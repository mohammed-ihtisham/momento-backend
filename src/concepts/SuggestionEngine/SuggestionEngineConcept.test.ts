import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import SuggestionEngineConcept, {
  type SuggestionContext,
} from "./SuggestionEngineConcept.ts";

const ownerA = "user:Alice" as ID;

Deno.test("Principle: System provides context, SuggestionEngine processes it to generate suggestion", async () => {
  const [db, client] = await testDb();
  const suggestionConcept = new SuggestionEngineConcept(db);

  try {
    // 1. System provides contextual information
    const context: SuggestionContext = {
      relationshipName: "John Doe",
      relationshipType: "Friend",
      notes: [
        { title: "Birthday", content: "Likes chocolate cake" },
        { title: "Hobbies", content: "Enjoys hiking" },
      ],
      imageUrls: ["https://example.com/image1.jpg"],
    };

    // 2. SuggestionEngine processes context to generate suggestion
    const generateResult = await suggestionConcept.generateSuggestion({
      owner: ownerA,
      context,
    });
    assertNotEquals(
      "error" in generateResult,
      true,
      "Generating suggestion should not fail.",
    );
    const { suggestion, content } = generateResult as {
      suggestion: ID;
      content: string;
    };
    assertExists(suggestion);
    assertExists(content, "Content should be generated.");

    // 3. Suggestion is stored in the list
    const suggestions = await suggestionConcept._getSuggestions({ owner: ownerA });
    assertEquals(suggestions.length, 1, "Should have one suggestion.");
    assertEquals(
      suggestions[0].suggestion,
      suggestion,
      "Suggestion ID should match.",
    );
    assertEquals(
      suggestions[0].content,
      content,
      "Content should match.",
    );
    assertExists(
      suggestions[0].generatedAt,
      "GeneratedAt should be set.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: generateSuggestion requires valid non-empty context", async () => {
  const [db, client] = await testDb();
  const suggestionConcept = new SuggestionEngineConcept(db);

  try {
    // Empty context should fail
    const emptyContextResult = await suggestionConcept.generateSuggestion({
      owner: ownerA,
      context: {},
    });
    assertEquals(
      "error" in emptyContextResult,
      true,
      "Generating with empty context should fail.",
    );

    // Null context should fail
    const nullContextResult = await suggestionConcept.generateSuggestion({
      owner: ownerA,
      context: null as unknown as SuggestionContext,
    });
    assertEquals(
      "error" in nullContextResult,
      true,
      "Generating with null context should fail.",
    );

    // Valid context should succeed
    const validContext: SuggestionContext = {
      relationshipName: "John",
      notes: [{ title: "Note", content: "Content" }],
    };
    const validResult = await suggestionConcept.generateSuggestion({
      owner: ownerA,
      context: validContext,
    });
    assertEquals(
      "error" in validResult,
      false,
      "Generating with valid context should succeed.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getSuggestions returns all suggestions for owner", async () => {
  const [db, client] = await testDb();
  const suggestionConcept = new SuggestionEngineConcept(db);

  try {
    const context1: SuggestionContext = { relationshipName: "John" };
    const context2: SuggestionContext = { relationshipName: "Jane" };

    await suggestionConcept.generateSuggestion({
      owner: ownerA,
      context: context1,
    });
    await suggestionConcept.generateSuggestion({
      owner: ownerA,
      context: context2,
    });

    const suggestions = await suggestionConcept._getSuggestions({ owner: ownerA });
    assertEquals(suggestions.length, 2, "Should return 2 suggestions.");

    // Verify all have required fields
    suggestions.forEach((s) => {
      assertExists(s.suggestion, "Suggestion should have ID.");
      assertExists(s.content, "Suggestion should have content.");
      assertExists(s.generatedAt, "Suggestion should have generatedAt.");
    });
  } finally {
    await client.close();
  }
});

Deno.test("Multiple suggestions can be generated with different contexts", async () => {
  const [db, client] = await testDb();
  const suggestionConcept = new SuggestionEngineConcept(db);

  try {
    const context1: SuggestionContext = {
      relationshipName: "John",
      relationshipType: "Friend",
    };
    const context2: SuggestionContext = {
      relationshipName: "Jane",
      relationshipType: "Family",
      notes: [{ title: "Birthday", content: "December 25" }],
    };

    const result1 = await suggestionConcept.generateSuggestion({
      owner: ownerA,
      context: context1,
    });
    const result2 = await suggestionConcept.generateSuggestion({
      owner: ownerA,
      context: context2,
    });

    assertEquals(
      "error" in result1,
      false,
      "First suggestion should succeed.",
    );
    assertEquals(
      "error" in result2,
      false,
      "Second suggestion should succeed.",
    );

    const { suggestion: suggestion1 } = result1 as { suggestion: ID };
    const { suggestion: suggestion2 } = result2 as { suggestion: ID };

    assertNotEquals(
      suggestion1,
      suggestion2,
      "Suggestions should have different IDs.",
    );

    const allSuggestions = await suggestionConcept._getSuggestions({
      owner: ownerA,
    });
    assertEquals(
      allSuggestions.length,
      2,
      "Should have 2 suggestions total.",
    );
  } finally {
    await client.close();
  }
});

