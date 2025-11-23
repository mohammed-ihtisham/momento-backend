---
timestamp: 'Sun Nov 23 2025 15:10:42 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_151042.01a86366.md]]'
content_id: 0887627f3151b45a90144e5debb3ddc31e3d65d7b8aca8763b2e6cab3b2e35c2
---

# file: src/concepts/SuggestionEngine/SuggestionEngineConcept.ts

```typescript
import { Collection, Db } from "npm:mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Declare collection prefix, use concept name
const PREFIX = "SuggestionEngine" + ".";

// Generic types of this concept
type Target = ID; // The item for which a suggestion is made
type Suggestion = ID; // The ID of the suggestion itself

type SuggestionStatus = "pending" | "accepted" | "rejected" | "dismissed";

/**
 * a set of Suggestions with
 *   a target Target
 *   a content String
 *   a generatedAt DateTime
 *   a status SuggestionStatus
 */
interface SuggestionDoc {
  _id: Suggestion;
  target: Target;
  content: string;
  generatedAt: Date;
  status: SuggestionStatus;
}

/**
 * An arbitrary object assembled during a sync, containing context
 * for generating a suggestion. The structure is external to this concept.
 * It is expected to contain at least a 'target' property.
 */
interface SuggestionContext extends Record<string, unknown> {
  target: Target;
  // Other properties like 'user', 'currentText', 'relatedItems' etc.
  // are expected to be present but not defined by this concept spec.
}

export default class SuggestionEngineConcept {
  suggestions: Collection<SuggestionDoc>;

  constructor(private readonly db: Db) {
    this.suggestions = this.db.collection(PREFIX + "suggestions");
  }

  /**
   * generateSuggestion (context: Object): (suggestion: Suggestion, content: String)
   *
   * **requires** the `context` object contains sufficient information to identify the `Target` and generate a meaningful suggestion.
   *
   * **effects** A new `Suggestion` (with a unique ID) is created; its `target` is set based on the `context`;
   *             its `content` is determined by processing the `context` (e.g., via an LLM call);
   *             `generatedAt` is set to the current time; `status` is set to 'pending';
   *             the new `suggestion` ID and its `content` are returned.
   */
  async generateSuggestion(
    { context }: { context: SuggestionContext },
  ): Promise<{ suggestion: Suggestion; content: string } | { error: string }> {
    if (!context || !context.target) {
      return { error: "SuggestionContext must contain a target." };
    }

    // In a real implementation, this is where an LLM call or complex logic
    // would happen based on the `context` to produce the `suggestionContent`.
    // For this example, we'll simulate it.
    const simulatedContent =
      `Suggested action for ${context.target}: based on context, consider X.`;
    
    // Simulate LLM processing time or external API call failure
    // if (Math.random() < 0.1) { // 10% chance of failure
    //   return { error: "Failed to generate suggestion: LLM service unavailable." };
    // }

    const newSuggestionId = freshID();
    const newSuggestion: SuggestionDoc = {
      _id: newSuggestionId,
      target: context.target,
      content: simulatedContent,
      generatedAt: new Date(),
      status: "pending",
    };

    try {
      await this.suggestions.insertOne(newSuggestion);
      return { suggestion: newSuggestionId, content: simulatedContent };
    } catch (e) {
      console.error("Error inserting new suggestion:", e);
      return { error: `Failed to create suggestion: ${e.message}` };
    }
  }

  /**
   * acceptSuggestion (suggestion: Suggestion): (status: SuggestionStatus)
   *
   * **requires** `suggestion` exists and its `status` is 'pending'.
   *
   * **effects** The `status` of `suggestion` is updated to 'accepted'; the new `status` is returned.
   */
  async acceptSuggestion(
    { suggestion }: { suggestion: Suggestion },
  ): Promise<{ status: SuggestionStatus } | { error: string }> {
    const existingSuggestion = await this.suggestions.findOne({
      _id: suggestion,
    });
    if (!existingSuggestion) {
      return { error: `Suggestion with ID ${suggestion} not found.` };
    }
    if (existingSuggestion.status !== "pending") {
      return {
        error:
          `Suggestion ${suggestion} is not pending (current status: ${existingSuggestion.status}).`,
      };
    }

    try {
      await this.suggestions.updateOne(
        { _id: suggestion },
        { $set: { status: "accepted" } },
      );
      return { status: "accepted" };
    } catch (e) {
      console.error("Error accepting suggestion:", e);
      return { error: `Failed to accept suggestion: ${e.message}` };
    }
  }

  /**
   * rejectSuggestion (suggestion: Suggestion): (status: SuggestionStatus)
   *
   * **requires** `suggestion` exists and its `status` is 'pending'.
   *
   * **effects** The `status` of `suggestion` is updated to 'rejected'; the new `status` is returned.
   */
  async rejectSuggestion(
    { suggestion }: { suggestion: Suggestion },
  ): Promise<{ status: SuggestionStatus } | { error: string }> {
    const existingSuggestion = await this.suggestions.findOne({
      _id: suggestion,
    });
    if (!existingSuggestion) {
      return { error: `Suggestion with ID ${suggestion} not found.` };
    }
    if (existingSuggestion.status !== "pending") {
      return {
        error:
          `Suggestion ${suggestion} is not pending (current status: ${existingSuggestion.status}).`,
      };
    }

    try {
      await this.suggestions.updateOne(
        { _id: suggestion },
        { $set: { status: "rejected" } },
      );
      return { status: "rejected" };
    } catch (e) {
      console.error("Error rejecting suggestion:", e);
      return { error: `Failed to reject suggestion: ${e.message}` };
    }
  }

  /**
   * deleteSuggestion (suggestion: Suggestion): Empty
   *
   * **requires** `suggestion` exists.
   *
   * **effects** `suggestion` and all its associated data are removed from the state.
   */
  async deleteSuggestion(
    { suggestion }: { suggestion: Suggestion },
  ): Promise<Empty | { error: string }> {
    try {
      const result = await this.suggestions.deleteOne({ _id: suggestion });
      if (result.deletedCount === 0) {
        return { error: `Suggestion with ID ${suggestion} not found for deletion.` };
      }
      return {};
    } catch (e) {
      console.error("Error deleting suggestion:", e);
      return { error: `Failed to delete suggestion: ${e.message}` };
    }
  }

  /**
   * _getSuggestionsForTarget (target: Target): (suggestion: { id: Suggestion, content: String, status: SuggestionStatus, generatedAt: DateTime })
   *
   * **requires** `target` exists (optional, can return empty if target not found).
   *
   * **effects** Returns an array of dictionaries, each representing a suggestion associated with the given `target`,
   *             including its ID, content, status, and generation timestamp.
   */
  async _getSuggestionsForTarget(
    { target }: { target: Target },
  ): Promise<
    Array<{ id: Suggestion; content: string; status: SuggestionStatus; generatedAt: Date }>
  > {
    const suggestions = await this.suggestions.find({ target: target }).toArray();
    return suggestions.map((s) => ({
      id: s._id,
      content: s.content,
      status: s.status,
      generatedAt: s.generatedAt,
    }));
  }

  /**
   * _getSuggestionDetails (suggestion: Suggestion): (details: { target: Target, content: String, status: SuggestionStatus, generatedAt: DateTime })
   *
   * **requires** `suggestion` exists.
   *
   * **effects** Returns a dictionary containing the `target`, `content`, `status`, and `generatedAt` for the specified `suggestion`.
   *             If the suggestion does not exist, an `error` result should be returned.
   */
  async _getSuggestionDetails(
    { suggestion }: { suggestion: Suggestion },
  ): Promise<
    | Array<{
        details: {
          target: Target;
          content: string;
          status: SuggestionStatus;
          generatedAt: Date;
        };
      }>
    | { error: string }
  > {
    const foundSuggestion = await this.suggestions.findOne({ _id: suggestion });
    if (!foundSuggestion) {
      // Queries should return an array, but if a specific item is requested and not found,
      // an error might be more appropriate, or an empty array if the return type suggests multiple.
      // Given the 'details' field, an error or an empty array with a warning is reasonable.
      // Following the principle of returning an array for queries:
      return { error: `Suggestion with ID ${suggestion} not found.` };
    }
    return [{
      details: {
        target: foundSuggestion.target,
        content: foundSuggestion.content,
        status: foundSuggestion.status,
        generatedAt: foundSuggestion.generatedAt,
      },
    }];
  }
}
```
