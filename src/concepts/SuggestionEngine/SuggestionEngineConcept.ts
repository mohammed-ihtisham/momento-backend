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
 * Generates a single generic suggestion using the Gemini API, based on the provided context.
 * (Existing behavior – left as-is so other callers don't break.)
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
  const modelName = Deno.env.get("GEMINI_MODEL_NAME") || "gemini-2.5-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

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
 * Generates multiple (default 3) gift/gesture suggestions from aggregated shared notes.
 *
 * Expects `context` to include a `sharedNotes` field containing the aggregated shared notes
 * for this person, but will still serialize the whole context for richer signal.
 *
 * Returns an array of human-readable suggestion strings.
 */
async function generateGiftSuggestionsFromNotes(
  context: SuggestionContext,
  count = 3,
): Promise<string[]> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is not set. Please configure your Gemini API key.",
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = Deno.env.get("GEMINI_MODEL_NAME") || "gemini-2.5-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

  const contextStr = JSON.stringify(context, null, 2);

  const prompt = `You are a helpful assistant that suggests **personalized gifts or small thoughtful gestures** for a specific person.

You are given an object that contains **aggregated shared notes** about this person (their preferences, habits, important dates, relationship details, etc.), plus some extra metadata. Use ONLY this information to ground your ideas.

Your task:
- Generate **exactly ${count}** distinct, concrete gift or gesture ideas.
- Each idea should be **practical**, **specific**, and clearly tied to details from the notes.
- Include a short explanation of *why* this idea is a good fit for this person.

Return the result as **ONLY valid JSON**, with no extra text or markdown, in the following format:

[
  {
    "title": "short name of the gift or gesture",
    "description": "1–2 sentence description of what the gift/gesture is and how to do it",
    "whyItFits": "1 sentence explaining why this matches the person based on the notes"
  },
  ...
]

Context (aggregated shared notes and metadata as JSON):

${contextStr}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim() === "") {
      throw new Error("Gemini API returned an empty response");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      throw new Error(
        `Gemini did not return valid JSON: ${(e as Error).message}`,
      );
    }

    if (!Array.isArray(parsed)) {
      throw new Error("Gemini JSON root is not an array");
    }

    type RawGift = {
      title?: string;
      description?: string;
      whyItFits?: string;
    };

    const gifts = (parsed as RawGift[])
      .filter(
        (g) =>
          typeof g.title === "string" &&
          typeof g.description === "string" &&
          typeof g.whyItFits === "string",
      )
      .slice(0, count);

    if (gifts.length === 0) {
      throw new Error("Gemini JSON did not contain any valid gift objects");
    }

    // Flatten into a single string per suggestion for storage/display
    return gifts.map(
      (g) =>
        `${g.title}: ${g.description} (Why it fits: ${g.whyItFits})`,
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to generate gift suggestions with Gemini API: ${error.message}`,
      );
    }
    throw new Error(
      "Failed to generate gift suggestions with Gemini API: Unknown error",
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
   * Action: Generates a new generic suggestion for an owner based on contextual information.
   * (Existing behavior – unchanged.)
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
   * Action: Generates 3 gift/gesture suggestions for an owner using aggregated shared notes as context.
   *
   * @requires
   * - The user exists.
   * - `context` is a non-empty object and SHOULD include a `sharedNotes` string
   *   with the aggregated shared notes for that person.
   *
   * @effects
   * - Calls Gemini once to generate up to 3 suggestions.
   * - Stores each suggestion as a separate Suggestion document.
   * - Returns the IDs and contents of the created suggestions.
   */
  async generateGiftSuggestions({
    owner,
    context,
  }: {
    owner: User;
    context: SuggestionContext;
  }): Promise<
    | {
        suggestions: Array<{ suggestion: Suggestion; content: string }>;
      }
    | { error: string }
  > {
    if (
      !context ||
      typeof context !== "object" ||
      Object.keys(context).length === 0
    ) {
      return {
        error:
          "Context must be a valid non-empty object containing sufficient information (including aggregated shared notes).",
      };
    }

    let contents: string[];
    try {
      contents = await generateGiftSuggestionsFromNotes(context, 3);
      if (!contents || contents.length === 0) {
        return {
          error:
            "Failed to generate gift suggestions. The LLM did not return any usable suggestions.",
        };
      }
    } catch (error) {
      return {
        error: `Failed to generate gift suggestions: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }

    const generatedAt = new Date();
    const results: Array<{ suggestion: Suggestion; content: string }> = [];

    for (const content of contents) {
      const suggestionId = freshID() as Suggestion;

      await this.suggestions.insertOne({
        _id: suggestionId,
        owner,
        content,
        generatedAt,
      });

      results.push({ suggestion: suggestionId, content });
    }

    return { suggestions: results };
  }

  /**
   * Query: Retrieves all suggestions for an owner.
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
