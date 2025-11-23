[@concept-background](../../templates/concept-background.md)
[@concept-state](../../background/detailed/concept-state.md)
[@concept-rubric](../../background/detailed/concept-rubric.md)
[@testing-concepts](../background/testing-concepts.md)
[@all-concepts](../application/all-concepts.md)
[@concept-design-brief](../background/concept-design-brief.md) 
[@concept-design-overview](../background/concept-design-overview.md) 
[@concept-specs](../background/concept-specifications.md)
[@app-overview](../application/app-overview.md)

# generate: concept Occasion spec 
# response:

# concept: Occasion spec

**concept** Occasion \[User]

**purpose** define a specific event or occasion with minimal information: person, occasion type, and date

**principle** If a user creates an occasion for a person with an occasion type and date, they can later retrieve and manage that occasion.

**state**
  a set of Occasions
    a owner User
    a person String
    a occasionType String
    a date String  // ISO 8601 Date string

**actions**

  createOccasion (owner: User, person: String, occasionType: String, date: String): (occasion: Occasion)
    **requires** user exists; `person` is not empty; `occasionType` is not empty; `date` is a valid ISO 8601 Date string.
    **effects** creates a new Occasion `o`; sets `owner` of `o` to `owner`; sets `person` of `o` to `person`; sets `occasionType` of `o` to `occasionType`; sets `date` of `o` to `date`; returns `o` as `occasion`.

  updateOccasion (occasion: Occasion, person?: String, occasionType?: String, date?: String): (occasion: Occasion)
    **requires** `occasion` exists; at least one of `person`, `occasionType`, or `date` is provided; if `date` is provided, it is a valid ISO 8601 Date string.
    **effects** updates the specified properties (`person`, `occasionType`, `date`) of `occasion`; returns `occasion`.

  deleteOccasion (occasion: Occasion)
    **requires** `occasion` exists.
    **effects** removes `occasion` from the set of Occasions.

**queries**

  \_getOccasion (occasion: Occasion): (owner: User, person: String, occasionType: String, date: String)
    **requires** `occasion` exists.
    **effects** returns the `owner`, `person`, `occasionType`, and `date` of `occasion`.

  \_getOccasions (owner: User): (occasion: Occasion, person: String, occasionType: String, date: String)
    **requires** `owner` exists.
    **effects** returns a set of all Occasions owned by `owner`, each with its `person`, `occasionType`, and `date`.

  \_getOccasionsByPerson (owner: User, person: String): (occasion: Occasion, occasionType: String, date: String)
    **requires** `owner` exists; `person` is not empty.
    **effects** returns a set of all Occasions owned by `owner` for the given `person`, each with its `occasionType` and `date`.

  \_getOccasionsByDate (owner: User, date: String): (occasion: Occasion, person: String, occasionType: String)
    **requires** `owner` exists; `date` is a valid ISO 8601 Date string.
    **effects** returns a set of all Occasions owned by `owner` with the given `date`, each with its `person` and `occasionType`.