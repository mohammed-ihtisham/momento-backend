---
timestamp: 'Sun Nov 23 2025 15:05:47 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_150547.36f2f97f.md]]'
content_id: 1c33781e0928f5e590a385c161319a637d54fea9fe4978fe0f76e96c5a162a51
---

# concept: Profile spec

**concept** Profile \[User]

**purpose** store basic user information: name and email

**principle** If a user sets their name and email, then other users or the system can view these details when interacting with that user's profile.

**state**
a set of Profiles
a user User
a name String
a email String

**actions**

createProfile (user: User, name: String, email: String): (profile: Profile)
**requires** user exists; no Profile already exists for `user`.
**effects** creates a new Profile `p`; sets `user` of `p` to `user`; sets `name` of `p` to `name`; sets `email` of `p` to `email`; returns `p` as `profile`.

updateName (user: User, name: String)
**requires** user exists; a Profile exists for `user`.
**effects** sets the `name` of the Profile for `user` to `name`.

updateEmail (user: User, email: String)
**requires** user exists; a Profile exists for `user`.
**effects** sets the `email` of the Profile for `user` to `email`.

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

\_getEmail (user: User): (email: String)
**requires** user exists; a Profile exists for `user`.
**effects** returns the `email` of the Profile for `user`.
