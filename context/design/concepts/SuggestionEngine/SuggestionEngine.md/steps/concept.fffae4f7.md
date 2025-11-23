---
timestamp: 'Sun Nov 23 2025 15:15:42 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_151542.7bff4690.md]]'
content_id: fffae4f71395ad4f33665f75fa1e2409498e09432e64b2a6f120e93e42979e36
---

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
