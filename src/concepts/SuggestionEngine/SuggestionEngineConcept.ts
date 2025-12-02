import { Collection, Db } from "npm:mongodb";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import "jsr:@std/dotenv/load";
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
 *
 * @param context The contextual information to generate a suggestion from
 * @returns The generated suggestion content
 * @throws Error if the API key is missing or if the API call fails
 */
async function generateSuggestionContent(
  context: SuggestionContext
): Promise<string> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is not set. Please configure your Gemini API key."
    );
  }

  // Initialize the Gemini API client
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Format the context into a structured prompt
  const contextStr = JSON.stringify(context, null, 2);
  const prompt = `Based on the following contextual information about a user, generate a helpful and actionable suggestion. The suggestion should be relevant, practical, and personalized to the context provided.

Context:
${contextStr}

Please provide a clear, concise suggestion that addresses the user's needs based on this context.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim() === "") {
      throw new Error("Gemini API returned an empty response");
    }

    return text.trim();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to generate suggestion with Gemini API: ${error.message}`
      );
    }
    throw new Error(
      "Failed to generate suggestion with Gemini API: Unknown error"
    );
  }
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
