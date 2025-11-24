import { Collection, Db } from "npm:mongodb";
import { ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "SuggestionEngine" + ".";

// Generic types for the concept's external dependencies
type User = ID;

// Internal entity types, represented as IDs
type Suggestion = ID;

/**
 * SuggestionContext: An action argument object assembled during syncs
 * containing contextual information to be fed into the LLM.
 * This is NOT part of the concept state.
 */
export type SuggestionContext = Record<string, unknown>;

/**
 * State: A set of Suggestions with an owner, content, and generatedAt date.
 */
interface SuggestionDoc {
  _id: Suggestion;
  owner: User;
  content: string;
  generatedAt: Date;
}

/**
 * Generates a suggestion using the Gemini API based on the provided context.
 * This is a placeholder that should be implemented with actual Gemini API calls.
 *
 * @param context The contextual information to generate a suggestion from
 * @returns The generated suggestion content
 */
async function generateSuggestionContent(
  context: SuggestionContext
): Promise<string> {
  // TODO: Implement Gemini API integration
  // Example structure:
  // 1. Import @google/generative-ai
  // 2. Initialize the model with API key from environment
  // 3. Format the context into a prompt
  // 4. Call the model.generateContent() method
  // 5. Extract and return the generated text

  // Placeholder implementation - returns a simple message
  // Replace this with actual Gemini API call
  const contextStr = JSON.stringify(context, null, 2);
  // Using Promise.resolve to maintain async signature for future implementation
  return await Promise.resolve(
    `Suggestion based on context: ${contextStr.substring(0, 200)}...`
  );
}

/**
 * @concept SuggestionEngine
 * @purpose generate and store suggestions for users based on contextual information
 */
export default class SuggestionEngineConcept {
  suggestions: Collection<SuggestionDoc>;

  constructor(private readonly db: Db) {
    this.suggestions = this.db.collection(PREFIX + "suggestions");
  }

  /**
   * Action: Generates a new suggestion for an owner based on contextual information.
   * @requires The user exists and context is a valid SuggestionContext object containing sufficient information to generate a meaningful suggestion.
   * @effects Creates a new Suggestion, processes context via LLM to generate content, sets generatedAt to current time, and returns the suggestion ID and content.
   */
  async generateSuggestion({
    owner,
    context,
  }: {
    owner: User;
    context: SuggestionContext;
  }): Promise<{ suggestion: Suggestion; content: string } | { error: string }> {
    // Validate that context is a non-empty object
    if (
      !context ||
      typeof context !== "object" ||
      Object.keys(context).length === 0
    ) {
      return {
        error:
          "Context must be a valid non-empty object containing sufficient information.",
      };
    }

    // Generate suggestion content using Gemini API
    let content: string;
    try {
      content = await generateSuggestionContent(context);
      if (!content || content.trim() === "") {
        return {
          error:
            "Failed to generate suggestion content. The LLM returned an empty response.",
        };
      }
    } catch (error) {
      return {
        error: `Failed to generate suggestion: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }

    const suggestionId = freshID() as Suggestion;
    const generatedAt = new Date();
    await this.suggestions.insertOne({
      _id: suggestionId,
      owner,
      content,
      generatedAt,
    });

    return { suggestion: suggestionId, content };
  }

  /**
   * Query: Retrieves all suggestions for an owner.
   * @requires The owner exists.
   * @effects Returns all Suggestions where owner is the given owner, each with its content and generatedAt.
   */
  async _getSuggestions({ owner }: { owner: User }): Promise<
    Array<{
      suggestion: Suggestion;
      content: string;
      generatedAt: Date;
    }>
  > {
    const suggestions = await this.suggestions.find({ owner }).toArray();
    return suggestions.map((s) => ({
      suggestion: s._id,
      content: s.content,
      generatedAt: s.generatedAt,
    }));
  }
}
