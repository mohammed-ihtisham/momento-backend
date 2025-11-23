---
timestamp: 'Sun Nov 23 2025 15:10:42 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_151042.01a86366.md]]'
content_id: 3eebb3fa4d5e181a3d26b54548bc27581c6efd5868a7be9ba4aafc822acde4bc
---

# concept: SuggestionEngine

**concept** SuggestionEngine \[Target]

**purpose** To provide relevant, context-aware recommendations or potential next steps for a given target.

**principle** When a system provides specific contextual information about a `Target` item, the `SuggestionEngine` processes this context to generate a new `Suggestion` containing actionable content for that `Target`, which can then be presented to a user.

**state**

```
a set of Suggestions with
  a target Target
  a content String
  a generatedAt DateTime
  a status SuggestionStatus // e.g., 'pending', 'accepted', 'rejected', 'dismissed'
```

* `SuggestionStatus` is an enumeration of strings, typically `pending`, `accepted`, `rejected`, or `dismissed`.

**actions**

```
generateSuggestion (context: Object): (suggestion: Suggestion, content: String)
```

    **requires** the `context` object contains sufficient information to identify the `Target` and generate a meaningful suggestion.
    **effects** A new `Suggestion` (with a unique ID) is created; its `target` is set based on the `context`; its `content` is determined by processing the `context` (e.g., via an LLM call); `generatedAt` is set to the current time; `status` is set to 'pending'; the new `suggestion` ID and its `content` are returned.

```
acceptSuggestion (suggestion: Suggestion): (status: SuggestionStatus)
```

    **requires** `suggestion` exists and its `status` is 'pending'.
    **effects** The `status` of `suggestion` is updated to 'accepted'; the new `status` is returned.

```
rejectSuggestion (suggestion: Suggestion): (status: SuggestionStatus)
```

    **requires** `suggestion` exists and its `status` is 'pending'.
    **effects** The `status` of `suggestion` is updated to 'rejected'; the new `status` is returned.

```
deleteSuggestion (suggestion: Suggestion)
```

    **requires** `suggestion` exists.
    **effects** `suggestion` and all its associated data are removed from the state.

**queries**

```
_getSuggestionsForTarget (target: Target): (suggestion: { id: Suggestion, content: String, status: SuggestionStatus, generatedAt: DateTime })
```

    **requires** `target` exists (optional, can return empty if target not found).
    **effects** Returns an array of dictionaries, each representing a suggestion associated with the given `target`, including its ID, content, status, and generation timestamp.

```
_getSuggestionDetails (suggestion: Suggestion): (details: { target: Target, content: String, status: SuggestionStatus, generatedAt: DateTime })
```

    **requires** `suggestion` exists.
    **effects** Returns a dictionary containing the `target`, `content`, `status`, and `generatedAt` for the specified `suggestion`. If the suggestion does not exist, an `error` result should be returned.

***
