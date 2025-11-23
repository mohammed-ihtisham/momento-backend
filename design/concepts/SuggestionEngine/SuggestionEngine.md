[@concept-background](../../templates/concept-background.md)
[@concept-state](../../background/detailed/concept-state.md)
[@concept-rubric](../../background/detailed/concept-rubric.md)
[@testing-concepts](../background/testing-concepts.md)
[@all-concepts](../application/all-concepts.md)
[@concept-design-brief](../background/concept-design-brief.md) 
[@concept-design-overview](../background/concept-design-overview.md) 
[@concept-specs](../background/concept-specifications.md)
[@app-overview](../application/app-overview.md)

# generate: concept SuggestionEngine spec that just keeps a list of suggestions where an action generateSuggestion action take in an object like SuggestionContext. SuggestionContext is NOT a concept state; this is an action argument object assembled during the sync about the context that will be fed into the LLM action.
# response:

# concept: SuggestionEngine spec

**concept** SuggestionEngine \[User]

**purpose** generate and store suggestions for users based on contextual information

**principle** If a system provides contextual information about a user (assembled via queries to other concepts during a sync), the SuggestionEngine processes this context to generate a new suggestion containing actionable content, which is then stored in the list of suggestions.

**state**
  a set of Suggestions
    a owner User
    a content String
    a generatedAt Date

**actions**

  generateSuggestion (owner: User, context: SuggestionContext): (suggestion: Suggestion, content: String)
    **requires** user exists; `context` is a valid SuggestionContext object containing sufficient information to generate a meaningful suggestion.
    **effects** creates a new Suggestion `s`; sets `owner` of `s` to `owner`; processes `context` (e.g., via an LLM call) to generate `content`; sets `content` of `s` to the generated content; sets `generatedAt` of `s` to current time; returns `s` as `suggestion` and the `content`.

**queries**

  \_getSuggestions (owner: User): (suggestion: Suggestion, content: String, generatedAt: Date)
    **requires** user exists.
    **effects** returns all Suggestions where `owner` is `owner`, each with its `content` and `generatedAt`.
