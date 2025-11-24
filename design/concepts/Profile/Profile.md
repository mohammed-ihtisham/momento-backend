[@concept-background](../../templates/concept-background.md)
[@concept-state](../../background/detailed/concept-state.md)
[@concept-rubric](../../background/detailed/concept-rubric.md)
[@testing-concepts](../background/testing-concepts.md)
[@all-concepts](../application/all-concepts.md)
[@concept-design-brief](../background/concept-design-brief.md)
[@concept-design-overview](../background/concept-design-overview.md)
[@concept-specs](../background/concept-specifications.md)
[@app-overview](../application/app-overview.md)

# generate: concept Profile spec with basic details about user

# response:

# concept: Profile spec

**concept** Profile \[User]

**purpose** store basic user information: name

**principle** If a user sets their name, then other users or the system can view these details when interacting with that user's profile.

**state**
a set of Profiles

a user User

a name String

**actions**

createProfile (user: User, name: String): (profile: Profile)

**requires** user exists; no Profile already exists for `user`.

**effects** creates a new Profile `p`; sets `user` of `p` to `user`; sets `name` of `p` to `name`; returns `p` as `profile`.

updateName (user: User, name: String)

**requires** user exists; a Profile exists for `user`.

**effects** sets the `name` of the Profile for `user` to `name`.

deleteProfile (user: User)

**requires** user exists; a Profile exists for `user`.

**effects** removes the Profile associated with `user`.

**queries**

\_getProfile (user: User): (name: String, email: String)
**requires** user exists; a Profile exists for `user`.
**effects** returns the `name` and `email` of the Profile for `user`.

\_getName (user: User): (name: String)
**requires** user exists; a Profile exists for `user`.
**effects** returns the `name` of the Profile for `user`.
