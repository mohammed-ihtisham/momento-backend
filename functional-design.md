# Functional Design

# 1. Problem Framing

## Domain: Meaningful Relationship Maintenance

Close relationships take ongoing attention, remembering what matters to people, celebrating milestones, and showing appreciation in everyday ways. Whether it’s family, long-term friends, or partners, people value staying emotionally connected over time. This domain focuses on supporting intentional care, helping people preserve shared memories, understand one another’s evolving preferences, and engage in meaningful interactions that strengthen their relationships.

## Problem: The Intention-Action Gap in Caring for Loved Ones

People genuinely want to show up for the people they care about, but daily life gets in the way. Important dates sneak up, personal details are forgotten, and the pressure to be thoughtful can feel overwhelming, leading to generic gestures that don’t reflect real care. Despite strong intentions, appreciation often goes unexpressed, leaving relationships under-nurtured. Existing tools mostly offer reminders or shopping lists, but miss the deeper, more nuanced aspects of showing love: remembering shared moments, honoring personal preferences, and coordinating meaningful gestures with others.

## Evidence:

1. [**Preserving memories and relational details aligns with core human priorities**](https://www.pewresearch.org/short-reads/2023/05/26/family-time-is-far-more-important-than-other-aspects-of-life-for-most-americans/): Research shows that spending time with family is rated as more important than career, hobbies, or other life domains, indicating that tools supporting emotional closeness and memory-keeping target a widely held value.

2. [**Positive memories contribute to emotional well-being and stronger relational meaning**](https://pmc.ncbi.nlm.nih.gov/articles/PMC9205651/): Studies demonstrate that positive memories of home and family experiences are measurably linked with psychological health.

3. [**Shared and organized memories strengthen friendships and deepen bonds**](https://www.bps.org.uk/research-digest/secret-strong-friendships-interconnected-memories): Research on “transactive memory systems” shows that friendships grow stronger when people share interconnected memories, supporting the idea that a centralized relationship dashboard may reinforce social connections.

4. [**Gift giving is a major source of stress and uncertainty**](https://www.etsy.com/news/survey-says-gifting-is-stressful-but-etsys-new-gift-mode-is-here-to-help): Large-scale consumer surveys reveal that Americans find holiday and birthday gifting stressful and feel pressure to choose meaningful gifts, highlighting a persistent unmet need for tools that reduce gifting anxiety.

## Comparables:

- [Amazon Wish List • Product bookmarking](https://www.amazon.com): Amazon Wish List enables users to save and share desired items directly linked to retailers, making it convenient for others to purchase gifts. However, it focuses exclusively on shopping and does not support emotional context, personal memories, or thoughtful actions beyond buying products.

- [Giftster • Shared wish lists](https://www.giftster.com): Giftster lets families create and coordinate wish lists to avoid duplicate gifts and organize holiday shopping. However, it centers on material items and one-time events, offering little support for year-round relationship care or non-purchase gestures.

- [Elfster • Gift exchanges](https://www.elfster.com): Elfster simplifies seasonal gift exchanges like Secret Santa through automated assignments and shopping-based wish lists. However, it is limited to occasional events and does not help users nurture ongoing relationships or understand what loved ones value beyond physical gifts.

- [Google Calendar • Event reminders](https://calendar.google.com): Google Calendar helps users remember important dates such as birthdays through automated notifications. However, it only alerts users when something is happening and does not provide guidance on what meaningful action to take or tools to capture personal preferences.

- [Love Nudge • Relationship habits](https://lovenudgeapp.com): Love Nudge encourages couples to act on each other’s preferred “love languages” through small prompts and check-ins. However, it is limited to romantic relationships, relies on a single personality framework, and lacks collaborative features or support for diverse types of care.

## Main Features:

1. **Personal Profile Spaces:** A customizable space for each important person in a user’s life, storing preferences, shared memories, communication style notes, and other small but meaningful details.

2. **Collaborative Documentation Spaces:** A shared space for multiple users to document and organize details about an activity or event that has already occurred. Participants can add memories, photos, notes, and reflections, creating a comprehensive record of the event. The space allows customization with categories or tags, making it easy to preserve, revisit, and share the experience with others.

3. **Suggestions Recommendation Engine:** A recommendation system (powered by simple logic or LLMs) that translates a person’s stored preferences and current context into brainstormed ideas of possible gifts, activities, or gestures that might be appropriate.

**NOTE: The following is an additional feature we are considering but not 100% sure yet.**

4. **Thoughtful Checkins:** Lightweight prompts that help users remember what worked well, what felt appreciated, and how relationships evolve over time.

## Ethical Analysis:

### Stakeholders
- **Users**: People trying to nurture their relationships, preserve memories, and give meaningful gifts.  
- **Loved Ones**: People indirectly affected by the user’s actions and data logging.  
- **Local Retailers & Gift-Related Businesses**: Small shops, artisans, or specialty stores that might benefit from more intentional, personalized gift purchases.

### Impacts 
Users are impacted by whether the tool genuinely helps them feel more prepared, thoughtful, and organized—making relationship maintenance smoother and reducing stress associated with holidays or birthdays. Loved Ones are affected through the increased emotional attention they may receive; a more intentional record of memories, hobbies, and shared experiences can lead to gifts and gestures that feel more personal and meaningful. Local Retailers & Gift-Related Businesses may benefit from customers seeking more tailored, specific items rather than defaulting to generic mass-market gifts; a clearer sense of what a loved one enjoys could drive more niche or artisanal purchases and strengthen small business sales, especially around holidays.

## Time

### **Short-Term (0–2 Years)**
Users quickly gain a simple way to remember small details—likes, dislikes, moments, and gift ideas—which helps them act more intentionally in the near term. Loved ones experience slightly more personalized gestures. Local retailers may benefit from occasional, more purposeful small gift purchases triggered by the dashboard.

### **Medium-Term (2–5 Years)**
As use becomes routine, the dashboard shapes steady habits: users record memories more regularly, plan gifts earlier, and rely on the tool to reduce mental load around celebrations. Loved ones see more consistent thoughtfulness, and small businesses may receive more targeted purchases as users seek items that match recorded preferences.

### **Long-Term (5–10+ Years)**
Over longer periods, the tool becomes part of users’ ongoing relationship maintenance, helping track changes in preferences, long-term traditions, and shared experiences. Loved ones benefit from durable patterns of attentiveness, and local retailers may see recurring, intentional gift-buying tied to annual events reflected in the dashboard.

## Pervasiveness

### Global Reach and Cultural Adaptation
If broadly adopted across diverse geographies, the dashboard could be tailored to fit local cultural norms and practices. In North America, it might emphasize birthdays and holidays, while in East Asia, it could highlight festivals and family-oriented events. In rural areas with limited connectivity, offline-first features or lightweight mobile versions could ensure accessibility, making the app valuable across varied settings.

### Influence on Social Interactions
As use spreads from small groups to thousands or millions, the app could normalize intentional relationship management and thoughtful gift-giving. Users may begin sharing experiences and recommendations, strengthening social networks. Large-scale adoption could encourage community-building, but also create pressure to maintain perfect records or conform to others’ expectations, which would need careful design balance.

### Economic and Local Business Effects
Widespread adoption could increase demand for personalized gifts, benefiting local retailers, artisans, and small businesses. Users seeking meaningful, tailored items could drive niche markets and encourage sustainable shopping practices. Conversely, if the app promotes mass-market recommendations or defaults to popular trends, it may inadvertently favor large-scale retailers over small ones, requiring design attention to support local economies.

## Values

### Autonomy and Self-Efficacy
The app supports autonomy by allowing users to decide what details to record about their relationships and how to engage with loved ones. Users gain self-efficacy through proactive memory-keeping and intentional gift planning, giving them confidence in managing social connections. Features like customizable dashboards and optional reminders enhance this sense of control without enforcing rigid behavior.

### Community and Inclusion
By helping users maintain thoughtful interactions, the app fosters stronger social bonds and a sense of belonging. Inclusive design ensures people from different cultural and social backgrounds can capture and respect diverse traditions, hobbies, and preferences. Sharing memories and experiences can reinforce empathy and connection, making relationships richer and more inclusive.

### Fairness and Support for Local Economies
The platform can encourage fairness by highlighting a wide range of gift options beyond mass-market defaults, benefiting local retailers and artisans. This supports ethical consumption and gives users access to meaningful, personalized items. At the same time, design choices need to balance guidance with avoiding unintentional biases toward certain products or communities.

# 2. Concept Design

### Concept: `UserAuth`
* **purpose**: To securely verify a user's identity based on credentials.
* **principle**: If you register with a unique username and a password, and later provide the same credentials to log in, you will be successfully identified as that user.
* **state**:
    * a set of `User`s with
        * a `username` String (unique)
        * a `passwordHash` String
* **actions**:
    * `register (username: String, password: String): (user: User)`
        * **requires**: no User exists with the given `username`.
        * **effects**: creates a new User `u`; sets their `username` and a hash of their `password`; returns `u` as `user`.
    * `register (username: String, password: String): (error: String)`
        * **requires**: a User already exists with the given `username`.
        * **effects**: returns an error message.
    * `login (username: String, password: String): (user: User)`
        * **requires**: a User exists with the given `username` and the `password` matches their `passwordHash`.
        * **effects**: returns the matching User `u` as `user`.
    * `login (username: String, password: String): (error: String)`
        * **requires**: no User exists with the given `username` or the `password` does not match.
        * **effects**: returns an error message.
* **queries**:
    * `_getUserByUsername (username: String): (user: User)`
        * **requires**: a User with the given `username` exists.
        * **effects**: returns the corresponding User.

---

### Concept: `Sessioning`
* **purpose**: To maintain a user's logged-in state across multiple requests without re-sending credentials.
* **principle**: After a user is authenticated, a session is created for them. Subsequent requests using that session's ID are treated as being performed by that user, until the session is deleted (logout).
* **state**:
    * a set of `Session`s with
        * a `user` User
* **actions**:
    * `create (user: User): (session: Session)`
        * **requires**: true.
        * **effects**: creates a new Session `s`; associates it with the given `user`; returns `s` as `session`.
    * `delete (session: Session): ()`
        * **requires**: the given `session` exists.
        * **effects**: removes the session `s`.
* **queries**:
    * `_getUser (session: Session): (user: User)`
        * **requires**: the given `session` exists.
        * **effects**: returns the user associated with the session.

---

### Concept: `Profile`
* **purpose**: store basic user information: name and email
* **principle**: If a user sets their name and email, then other users or the system can view these details when interacting with that user's profile.
* **state**:
    * a set of Profiles with
        * a `user` User
        * a `name` String
        * a `email` String
* **actions**:
    * `createProfile (user: User, name: String, email: String): (profile: Profile)`
        * **requires**: user exists; no Profile already exists for `user`.
        * **effects**: creates a new Profile `p`; sets `user`, `name`, and `email`; returns `p`.
    * `updateName (user: User, name: String)`
        * **requires**: user exists; a Profile exists for `user`.
        * **effects**: updates the `name` of the Profile.
    * `updateEmail (user: User, email: String)`
        * **requires**: user exists; a Profile exists for `user`.
        * **effects**: updates the `email` of the Profile.
    * `deleteProfile (user: User)`
        * **requires**: user exists; a Profile exists for `user`.
        * **effects**: removes the Profile.
* **queries**:
    * `_getProfile (user: User): (name: String, email: String)`
        * **requires**: user exists; Profile exists.
        * **effects**: returns `name` and `email`.
    * `_getName (user: User): (name: String)`
        * **requires**: user exists; Profile exists.
        * **effects**: returns the user's `name`.
    * `_getEmail (user: User): (email: String)`
        * **requires**: user exists; Profile exists.
        * **effects**: returns the user's `email`.

---

### Concept: `Relationship`
* **purpose**: track the people that a user cares about by attributing a relationship type to each person
* **principle**: If a user creates a relationship with a person by providing a name and relationship type, they can later retrieve and manage that relationship.
* **state**:
    * a set of Relationships with
        * an `owner` User
        * a `name` String
        * a `relationshipType` String
* **actions**:
    * `createRelationship (owner: User, name: String, relationshipType: String): (relationship: Relationship)`
        * **requires**: owner exists; name & relationshipType not empty; no duplicate name for that owner.
        * **effects**: creates a Relationship `r`; returns `r`.
    * `updateRelationship (relationship: Relationship, name?: String, relationshipType?: String): (relationship: Relationship)`
        * **requires**: relationship exists; valid update; no conflict if name changes.
        * **effects**: updates fields provided; returns updated relationship.
    * `deleteRelationship (relationship: Relationship)`
        * **requires**: relationship exists.
        * **effects**: removes `relationship`.
* **queries**:
    * `_getRelationship (relationship: Relationship): (owner: User, name: String, relationshipType: String)`
        * **requires**: relationship exists.
        * **effects**: returns owner, name, type.
    * `_getRelationships (owner: User): (relationship: Relationship, name: String, relationshipType: String)`
        * **requires**: owner exists.
        * **effects**: returns all relationships for owner.
    * `_getRelationshipByName (owner: User, name: String): (relationship: Relationship, relationshipType: String)`
        * **requires**: owner exists; name valid; exact match exists.
        * **effects**: returns relationship & type.

---

### Concept: `Notes`
* **purpose**: allow users to store, organize, and retrieve textual information associated with relationships
* **principle**: If a user creates a note with a title and content for a relationship, they can later retrieve and update it.
* **state**:
    * a set of Notes with
        * an `owner` User
        * a `relationship` Relationship
        * a `title` String
        * a `content` String
* **actions**:
    * `createNote (owner: User, relationship: Relationship, title: String, content: String): (note: Note)`
        * **requires**: owner & relationship exist; unique title for that relationship.
        * **effects**: creates Note `n`; returns it.
    * `updateNote (note: Note, title?: String, content?: String): (note: Note)`
        * **requires**: note exists; valid update; no title conflict.
        * **effects**: updates title/content; returns note.
    * `deleteNote (note: Note)`
        * **requires**: note exists.
        * **effects**: removes note.
* **queries**:
    * `_getNote (note: Note): (owner: User, relationship: Relationship, title: String, content: String)`
        * **requires**: note exists.
        * **effects**: returns metadata & content.
    * `_getNotes (owner: User): (note: Note, relationship: Relationship, title: String, content: String)`
        * **requires**: owner exists.
        * **effects**: returns all notes for owner.
    * `_getNotesByRelationship (owner: User, relationship: Relationship): (note: Note, title: String, content: String)`
        * **requires**: owner & relationship exist.
        * **effects**: returns notes for that relationship.
    * `_getNoteByTitle (owner: User, relationship: Relationship, title: String): (note: Note, content: String)`
        * **requires**: valid owner & relationship; exact title match.
        * **effects**: returns matching note & content.

---

### Concept: `MemoryGallery`
* **purpose**: store a list of images associated with relationships the user has
* **principle**: If a user adds an image tied to a relationship, they can view and remove it later.
* **state**:
    * a set of Images with
        * an `owner` User
        * a `relationship` Relationship
        * an `imageUrl` String
        * an `uploadDate` Date
* **actions**:
    * `addImage (owner: User, relationship: Relationship, imageUrl: String): (uploadDate: Date)`
        * **requires**: valid owner; relationship exists; unique imageUrl.
        * **effects**: adds image; returns timestamp.
    * `removeImage (owner: User, imageUrl: String)`
        * **requires**: image exists and owner matches.
        * **effects**: deletes image entry.
* **queries**:
    * `_getImages (owner: User): (imageUrl: String, relationship: Relationship, uploadDate: Date)`
        * **requires**: owner exists.
        * **effects**: returns all images for owner.
    * `_getImagesByRelationship (owner: User, relationship: Relationship): (imageUrl: String, uploadDate: Date)`
        * **requires**: owner & relationship exist.
        * **effects**: returns images tied to a relationship.

---

### Concept: `SuggestionEngine`
* **purpose**: generate and store suggestions for users based on contextual information
* **principle**: If the system processes user context, it can generate actionable suggestions and store them.
* **state**:
    * a set of Suggestions with
        * an `owner` User
        * a `content` String
        * a `generatedAt` Date
* **actions**:
    * `generateSuggestion (owner: User, context: SuggestionContext): (suggestion: Suggestion, content: String)`
        * **requires**: owner exists; context valid.
        * **effects**: generates and stores suggestion; returns suggestion & content.
* **queries**:
    * `_getSuggestions (owner: User): (suggestion: Suggestion, content: String, generatedAt: Date)`
        * **requires**: owner exists.
        * **effects**: returns suggestions for owner.

---

### Concept: `Occasion`
* **purpose**: define a specific event or occasion with minimal information: person, occasion type, and date
* **principle**: If a user creates an occasion, they can manage and later retrieve it.
* **state**:
    * a set of Occasions with
        * an `owner` User
        * a `person` String
        * an `occasionType` String
        * a `date` String
* **actions**:
    * `createOccasion (owner: User, person: String, occasionType: String, date: String): (occasion: Occasion)`
        * **requires**: valid inputs; date in ISO format.
        * **effects**: creates Occasion `o`; returns it.
    * `updateOccasion (occasion: Occasion, person?: String, occasionType?: String, date?: String): (occasion: Occasion)`
        * **requires**: occasion exists; valid update.
        * **effects**: updates fields; returns occasion.
    * `deleteOccasion (occasion: Occasion)`
        * **requires**: occasion exists.
        * **effects**: removes it.
* **queries**:
    * `_getOccasion (occasion: Occasion): (owner: User, person: String, occasionType: String, date: String)`
        * **requires**: exists.
        * **effects**: returns data.
    * `_getOccasions (owner: User): (occasion: Occasion, person: String, occasionType: String, date: String)`
        * **requires**: owner exists.
        * **effects**: returns all occasions.
    * `_getOccasionsByPerson (owner: User, person: String): (occasion: Occasion, occasionType: String, date: String)`
        * **requires**: valid inputs.
        * **effects**: returns filtered set.
    * `_getOccasionsByDate (owner: User, date: String): (occasion: Occasion, person: String, occasionType: String)`
        * **requires**: valid date.
        * **effects**: returns by date.

---

### Concept: `Collaborators`
* **purpose**: maintain a list of people working on a project
* **principle**: Users can add/remove collaborators at any time.
* **state**:
    * a set of Users
* **actions**:
    * `addCollaborator (user: User)`
        * **requires**: user exists; not already in set.
        * **effects**: adds user.
    * `removeCollaborator (user: User)`
        * **requires**: user exists; currently a collaborator.
        * **effects**: removes user.
* **queries**:
    * `_getCollaborators (): (user: User)`
        * **requires**: none.
        * **effects**: returns all collaborators.
    * `_hasCollaborator (user: User): (hasCollaborator: Boolean)`
        * **requires**: user exists.
        * **effects**: returns membership status.

---

### Concept: `Task`
* **purpose**: define tasks that users can create and manage
* **principle**: A user can create a task and later update or delete it.
* **state**:
    * a set of Tasks with
        * an `owner` User
        * a `description` String
* **actions**:
    * `createTask (owner: User, description: String): (task: Task)`
        * **requires**: owner exists; description not empty.
        * **effects**: creates Task `t`; returns it.
    * `updateTaskDescription (task: Task, description: String): (task: Task)`
        * **requires**: task exists.
        * **effects**: updates description; returns task.
    * `deleteTask (task: Task)`
        * **requires**: task exists.
        * **effects**: removes task.
* **queries**:
    * `_getTask (task: Task): (owner: User, description: String)`
        * **requires**: task exists.
        * **effects**: returns owner & description.
    * `_getTasks (owner: User): (task: Task, description: String)`
        * **requires**: owner exists.
        * **effects**: returns tasks for owner.

---

### Concept: `TaskChecklist`
* **purpose**: track and manage the completion status of tasks in a checklist
* **principle**: If tasks are added or marked complete, the checklist reflects this state.
* **state**:
    * a set of ChecklistEntries with
        * an `owner` User
        * a `task` Task
        * a `completed` Boolean
* **actions**:
    * `addTask (owner: User, task: Task): (entry: ChecklistEntry)`
        * **requires**: valid owner/task; unique entry.
        * **effects**: creates entry; completed=false; returns entry.
    * `removeTask (owner: User, task: Task)`
        * **requires**: entry exists.
        * **effects**: removes entry.
    * `markComplete (owner: User, task: Task)`
        * **requires**: entry exists.
        * **effects**: sets completed=true.
    * `markIncomplete (owner: User, task: Task)`
        * **requires**: entry exists.
        * **effects**: sets completed=false.
* **queries**:
    * `_getChecklistEntry (owner: User, task: Task): (completed: Boolean)`
        * **requires**: entry exists.
        * **effects**: returns completion status.
    * `_getChecklist (owner: User): (task: Task, completed: Boolean)`
        * **requires**: owner exists.
        * **effects**: returns all entries.
    * `_getCompletedTasks (owner: User): (task: Task)`
        * **requires**: owner exists.
        * **effects**: returns tasks where completed=true.
    * `_getIncompleteTasks (owner: User): (task: Task)`
        * **requires**: owner exists.
        * **effects**: returns tasks where completed=false.


## Synchronizations
```markdown
sync RegisterRequest
when Requesting.request(path: "/UserAuthentication/register", username, password) returns request
then UserAuthentication.register(username, password)

sync RegisterResponseSuccess
when Requesting.request(path: "/UserAuthentication/register") returns request
     and UserAuthentication.register() returns user
then Requesting.respond(request, user)

sync RegisterResponseError
when Requesting.request(path: "/UserAuthentication/register") returns request
     and UserAuthentication.register() returns error
then Requesting.respond(request, error)


sync CreateProfileOnRegister
when UserAuthentication.register() returns user
then Profile.createProfile(user, name: "", email: "")


sync LoginRequest
when Requesting.request(path: "/login", username, password) returns request
then UserAuthentication.login(username, password)

sync LoginSuccessCreatesSession
when UserAuthentication.login() returns user
then Sessioning.create(user)

sync LoginResponseSuccess
when Requesting.request(path: "/login") returns request
     and UserAuthentication.login() returns user
     and Sessioning.create(user) returns session
then Requesting.respond(request, session)

sync LoginResponseError
when Requesting.request(path: "/login") returns request
     and UserAuthentication.login() returns error
then Requesting.respond(request, error)


sync LogoutRequest
when Requesting.request(path: "/logout", session) returns request
     where in Sessioning: _getUser(session) gets user
then Sessioning.delete(session)

sync LogoutResponse
when Requesting.request(path: "/logout") returns request
     and Sessioning.delete() returns ()
then Requesting.respond(request, status: "logged_out")


sync CreateRelationshipRequest
when Requesting.request(path: "/Relationship/createRelationship", session, name, relationshipType) returns request
     and in Sessioning: _getUser(session) gets user
then Relationship.createRelationship(owner: user, name, relationshipType)

sync CreateRelationshipResponse
when Requesting.request(path: "/Relationship/createRelationship") returns request
     and Relationship.createRelationship() returns relationship
then Requesting.respond(request, relationship)


sync UpdateRelationshipRequest
when Requesting.request(path: "/Relationship/updateRelationship", session, relationship, name?, relationshipType?) returns request
     and in Sessioning: _getUser(session) gets user
     and in Relationship: _getRelationship(relationship) gets owner
     and owner equals user
then Relationship.updateRelationship(relationship, name, relationshipType)

sync UpdateRelationshipResponse
when Requesting.request(path: "/Relationship/updateRelationship") returns request
     and Relationship.updateRelationship() returns relationship
then Requesting.respond(request, relationship)


sync DeleteRelationshipRequest
when Requesting.request(path: "/Relationship/deleteRelationship", session, relationship) returns request
     and in Sessioning: _getUser(session) gets user
     and in Relationship: _getRelationship(relationship) gets owner
     and owner equals user
then Relationship.deleteRelationship(relationship)

sync DeleteRelationshipResponse
when Requesting.request(path: "/Relationship/deleteRelationship") returns request
     and Relationship.deleteRelationship() returns ()
then Requesting.respond(request, status: "deleted")


sync CreateNoteRequest
when Requesting.request(path: "/Notes/createNote", session, relationship, title, content) returns request
     and in Sessioning: _getUser(session) gets user
     and in Relationship: _getRelationship(relationship) gets owner
     and owner equals user
then Notes.createNote(owner: user, relationship, title, content)

sync CreateNoteResponse
when Requesting.request(path: "/Notes/createNote") returns request
     and Notes.createNote() returns note
then Requesting.respond(request, note)


sync UpdateNoteRequest
when Requesting.request(path: "/Notes/updateNote", session, note, title?, content?) returns request
     and in Sessioning: _getUser(session) gets user
     and in Notes: _getNote(note) gets owner
     and owner equals user
then Notes.updateNote(note, title, content)

sync UpdateNoteResponse
when Requesting.request(path: "/Notes/updateNote") returns request
     and Notes.updateNote() returns note
then Requesting.respond(request, note)


sync DeleteNoteRequest
when Requesting.request(path: "/Notes/deleteNote", session, note) returns request
     and in Sessioning: _getUser(session) gets user
     and in Notes: _getNote(note) gets owner
     and owner equals user
then Notes.deleteNote(note)

sync DeleteNoteResponse
when Requesting.request(path: "/Notes/deleteNote") returns request
     and Notes.deleteNote() returns ()
then Requesting.respond(request, status: "deleted")


sync AddImageRequest
when Requesting.request(path: "/MemoryGallery/addImage", session, relationship, imageUrl) returns request
     and in Sessioning: _getUser(session) gets user
     and in Relationship: _getRelationship(relationship) gets owner
     and owner equals user
then MemoryGallery.addImage(owner: user, relationship, imageUrl)

sync AddImageResponse
when Requesting.request(path: "/MemoryGallery/addImage") returns request
     and MemoryGallery.addImage() returns uploadDate
then Requesting.respond(request, uploadDate)


sync RemoveImageRequest
when Requesting.request(path: "/MemoryGallery/removeImage", session, imageUrl) returns request
     and in Sessioning: _getUser(session) gets user
     and in MemoryGallery: _getImages(owner: user) gets imageUrl
then MemoryGallery.removeImage(owner: user, imageUrl)

sync RemoveImageResponse
when Requesting.request(path: "/MemoryGallery/removeImage") returns request
     and MemoryGallery.removeImage() returns ()
then Requesting.respond(request, status: "removed")


sync CreateOccasionRequest
when Requesting.request(path: "/Occasion/createOccasion", session, person, occasionType, date) returns request
     and in Sessioning: _getUser(session) gets user
then Occasion.createOccasion(owner: user, person, occasionType, date)

sync CreateOccasionResponse
when Requesting.request(path: "/Occasion/createOccasion") returns request
     and Occasion.createOccasion() returns occasion
then Requesting.respond(request, occasion)


sync UpdateOccasionRequest
when Requesting.request(path: "/Occasion/updateOccasion", session, occasion, person?, occasionType?, date?) returns request
     and in Sessioning: _getUser(session) gets user
     and in Occasion: _getOccasion(occasion) gets owner
     and owner equals user
then Occasion.updateOccasion(occasion, person, occasionType, date)

sync UpdateOccasionResponse
when Requesting.request(path: "/Occasion/updateOccasion") returns request
     and Occasion.updateOccasion() returns occasion
then Requesting.respond(request, occasion)


sync DeleteOccasionRequest
when Requesting.request(path: "/Occasion/deleteOccasion", session, occasion) returns request
     and in Sessioning: _getUser(session) gets user
     and in Occasion: _getOccasion(occasion) gets owner
     and owner equals user
then Occasion.deleteOccasion(occasion)

sync DeleteOccasionResponse
when Requesting.request(path: "/Occasion/deleteOccasion") returns request
     and Occasion.deleteOccasion() returns ()
then Requesting.respond(request, status: "deleted")


sync CreateTaskForOccasionRequest
when Requesting.request(path: "/Occasion/createTaskForOccasion", session, occasion, description) returns request
     and in Sessioning: _getUser(session) gets user
     and in Occasion: _getOccasion(occasion) gets owner
     and owner equals user
then Task.createTask(owner: user, description)

sync CreateTaskForOccasionAutoAdd
when Requesting.request(path: "/Occasion/createTaskForOccasion") returns request
     and Task.createTask() returns task
     and in Sessioning: _getUser(session) gets user
then TaskChecklist.addTask(owner: user, task)

sync CreateTaskForOccasionResponse
when Requesting.request(path: "/Occasion/createTaskForOccasion") returns request
     and Task.createTask() returns task
     and TaskChecklist.addTask() returns entry
then Requesting.respond(request, task, entry)


sync CreateTaskRequest
when Requesting.request(path: "/Task/createTask", session, description) returns request
     and in Sessioning: _getUser(session) gets user
then Task.createTask(owner: user, description)

sync CreateTaskResponse
when Requesting.request(path: "/Task/createTask") returns request
     and Task.createTask() returns task
then Requesting.respond(request, task)


sync UpdateTaskRequest
when Requesting.request(path: "/Task/updateTaskDescription", session, task, description) returns request
     and in Sessioning: _getUser(session) gets user
     and in Task: _getTask(task) gets owner
     and owner equals user
then Task.updateTaskDescription(task, description)

sync UpdateTaskResponse
when Requesting.request(path: "/Task/updateTaskDescription") returns request
     and Task.updateTaskDescription() returns task
then Requesting.respond(request, task)


sync DeleteTaskRequest
when Requesting.request(path: "/Task/deleteTask", session, task) returns request
     and in Sessioning: _getUser(session) gets user
     and in Task: _getTask(task) gets owner
     and owner equals user
then Task.deleteTask(task)

sync DeleteTaskResponse
when Requesting.request(path: "/Task/deleteTask") returns request
     and Task.deleteTask() returns ()
then Requesting.respond(request, status: "deleted")


sync AddTaskToChecklistRequest
when Requesting.request(path: "/TaskChecklist/addTask", session, task) returns request
     and in Sessioning: _getUser(session) gets user
then TaskChecklist.addTask(owner: user, task)

sync AddTaskToChecklistResponse
when Requesting.request(path: "/TaskChecklist/addTask") returns request
     and TaskChecklist.addTask() returns entry
then Requesting.respond(request, entry)


sync RemoveTaskFromChecklistRequest
when Requesting.request(path: "/TaskChecklist/removeTask", session, task) returns request
     and in Sessioning: _getUser(session) gets user
then TaskChecklist.removeTask(owner: user, task)

sync RemoveTaskFromChecklistResponse
when Requesting.request(path: "/TaskChecklist/removeTask") returns request
     and TaskChecklist.removeTask() returns ()
then Requesting.respond(request, status: "removed")


sync MarkTaskCompleteRequest
when Requesting.request(path: "/TaskChecklist/markComplete", session, task) returns request
     and in Sessioning: _getUser(session) gets user
then TaskChecklist.markComplete(owner: user, task)

sync MarkTaskCompleteResponse
when Requesting.request(path: "/TaskChecklist/markComplete") returns request
     and TaskChecklist.markComplete() returns ()
then Requesting.respond(request, status: "completed")


sync MarkTaskIncompleteRequest
when Requesting.request(path: "/TaskChecklist/markIncomplete", session, task) returns request
     and in Sessioning: _getUser(session) gets user
then TaskChecklist.markIncomplete(owner: user, task)

sync MarkTaskIncompleteResponse
when Requesting.request(path: "/TaskChecklist/markIncomplete") returns request
     and TaskChecklist.markIncomplete() returns ()
then Requesting.respond(request, status: "incomplete")


sync AddCollaboratorRequest
when Requesting.request(path: "/Collaborators/addCollaborator", session, collaboratorUser) returns request
     and in Sessioning: _getUser(session) gets user
then Collaborators.addCollaborator(user: collaboratorUser)

sync AddCollaboratorResponse
when Requesting.request(path: "/Collaborators/addCollaborator") returns request
     and Collaborators.addCollaborator() returns ()
then Requesting.respond(request, status: "added")


sync RemoveCollaboratorRequest
when Requesting.request(path: "/Collaborators/removeCollaborator", session, collaboratorUser) returns request
     and in Sessioning: _getUser(session) gets user
then Collaborators.removeCollaborator(user: collaboratorUser)

sync RemoveCollaboratorResponse
when Requesting.request(path: "/Collaborators/removeCollaborator") returns request
     and Collaborators.removeCollaborator() returns ()
then Requesting.respond(request, status: "removed")


sync GetCollaboratorsRequest
when Requesting.request(path: "/Collaborators/_getCollaborators", session) returns request
     and in Sessioning: _getUser(session) gets user
then Collaborators._getCollaborators()

sync GetCollaboratorsResponse
when Requesting.request(path: "/Collaborators/_getCollaborators") returns request
     and Collaborators._getCollaborators() returns user
then Requesting.respond(request, collaborators: collected from user)


sync GenerateSuggestionRequest
when Requesting.request(path: "/SuggestionEngine/generateSuggestion", session, relationship) returns request
     and in Sessioning: _getUser(session) gets user
     and in Relationship: _getRelationship(relationship) gets owner, name, relationshipType
     and owner equals user
     and in Notes: _getNotesByRelationship(owner, relationship) gets note, title, content
     and in MemoryGallery: _getImagesByRelationship(owner, relationship) gets imageUrl, uploadDate
then SuggestionEngine.generateSuggestion(owner: user, context: suggestionContext)

sync GenerateSuggestionResponse
when Requesting.request(path: "/SuggestionEngine/generateSuggestion") returns request
     and SuggestionEngine.generateSuggestion() returns suggestion, content
then Requesting.respond(request, suggestion, content)


sync GenerateSuggestionForOccasionRequest
when Requesting.request(path: "/SuggestionEngine/generateSuggestionForOccasion", session, occasion) returns request
     and in Sessioning: _getUser(session) gets user
     and in Occasion: _getOccasion(occasion) gets owner, person, occasionType, date
     and owner equals user
     and in Relationship: _getRelationshipByName(owner, person) gets relationship, relationshipType
     and in Notes: _getNotesByRelationship(owner, relationship) gets note, title, content
     and in MemoryGallery: _getImagesByRelationship(owner, relationship) gets imageUrl, uploadDate
then SuggestionEngine.generateSuggestion(owner: user, context: suggestionContext)

sync GenerateSuggestionForOccasionResponse
when Requesting.request(path: "/SuggestionEngine/generateSuggestionForOccasion") returns request
     and SuggestionEngine.generateSuggestion() returns suggestion, content
then Requesting.respond(request, suggestion, content)


sync UpdateProfileNameRequest
when Requesting.request(path: "/Profile/updateName", session, name) returns request
     and in Sessioning: _getUser(session) gets user
then Profile.updateName(user, name)

sync UpdateProfileNameResponse
when Requesting.request(path: "/Profile/updateName") returns request
     and Profile.updateName() returns ()
then Requesting.respond(request, status: "updated")


sync UpdateProfileEmailRequest
when Requesting.request(path: "/Profile/updateEmail", session, email) returns request
     and in Sessioning: _getUser(session) gets user
then Profile.updateEmail(user, email)

sync UpdateProfileEmailResponse
when Requesting.request(path: "/Profile/updateEmail") returns request
     and Profile.updateEmail() returns ()
then Requesting.respond(request, status: "updated")


sync GetRelationshipsRequest
when Requesting.request(path: "/Relationship/_getRelationships", session) returns request
     and in Sessioning: _getUser(session) gets user
then Relationship._getRelationships(owner: user)

sync GetRelationshipsResponse
when Requesting.request(path: "/Relationship/_getRelationships") returns request
     and Relationship._getRelationships() returns relationship, name, relationshipType
then Requesting.respond(request, relationships: collected from relationship, name, relationshipType)


sync GetNotesByRelationshipRequest
when Requesting.request(path: "/Notes/_getNotesByRelationship", session, relationship) returns request
     and in Sessioning: _getUser(session) gets user
     and in Relationship: _getRelationship(relationship) gets owner
     and owner equals user
then Notes._getNotesByRelationship(owner: user, relationship)

sync GetNotesByRelationshipResponse
when Requesting.request(path: "/Notes/_getNotesByRelationship") returns request
     and Notes._getNotesByRelationship() returns note, title, content
then Requesting.respond(request, notes: collected from note, title, content)


sync GetImagesByRelationshipRequest
when Requesting.request(path: "/MemoryGallery/_getImagesByRelationship", session, relationship) returns request
     and in Sessioning: _getUser(session) gets user
     and in Relationship: _getRelationship(relationship) gets owner
     and owner equals user
then MemoryGallery._getImagesByRelationship(owner: user, relationship)

sync GetImagesByRelationshipResponse
when Requesting.request(path: "/MemoryGallery/_getImagesByRelationship") returns request
     and MemoryGallery._getImagesByRelationship() returns imageUrl, uploadDate
then Requesting.respond(request, images: collected from imageUrl, uploadDate)


sync GetOccasionsRequest
when Requesting.request(path: "/Occasion/_getOccasions", session) returns request
     and in Sessioning: _getUser(session) gets user
then Occasion._getOccasions(owner: user)

sync GetOccasionsResponse
when Requesting.request(path: "/Occasion/_getOccasions") returns request
     and Occasion._getOccasions() returns occasion, person, occasionType, date
then Requesting.respond(request, occasions: collected from occasion, person, occasionType, date)


sync GetChecklistRequest
when Requesting.request(path: "/TaskChecklist/_getChecklist", session) returns request
     and in Sessioning: _getUser(session) gets user
then TaskChecklist._getChecklist(owner: user)

sync GetChecklistResponse
when Requesting.request(path: "/TaskChecklist/_getChecklist") returns request
     and TaskChecklist._getChecklist() returns task, completed
then Requesting.respond(request, checklist: collected from task, completed)


sync GetChecklistByOccasionRequest
when Requesting.request(path: "/Occasion/_getChecklistByOccasion", session, occasion) returns request
     and in Sessioning: _getUser(session) gets user
     and in Occasion: _getOccasion(occasion) gets owner, person, occasionType, date
     and owner equals user
then TaskChecklist._getChecklist(owner: user)

sync GetChecklistByOccasionResponse
when Requesting.request(path: "/Occasion/_getChecklistByOccasion") returns request
     and TaskChecklist._getChecklist() returns task, completed
     and in Task: _getTask(task) gets description
then Requesting.respond(request, checklist: collected from task, completed, description)


sync GetSuggestionsRequest
when Requesting.request(path: "/SuggestionEngine/_getSuggestions", session) returns request
     and in Sessioning: _getUser(session) gets user
then SuggestionEngine._getSuggestions(owner: user)

sync GetSuggestionsResponse
when Requesting.request(path: "/SuggestionEngine/_getSuggestions") returns request
     and SuggestionEngine._getSuggestions() returns suggestion, content, generatedAt
then Requesting.respond(request, suggestions: collected from suggestion, content, generatedAt)
```

# 3. User Journey

Ahmad arrives home after an outing with his new friend Basil. He learned that Basil loved the sushi place they visited and talked excitedly about Orcas, which he enjoys seeing while scuba diving. Ahmad feels he learned meaningful details today and wants to store them so he can build on this new friendship.

He logs into Momento and lands on the Home Page, where he sees his existing relationship profiles. He clicks “+ New Profile” and is taken to the Customization Page. There, he enters Basil’s name, chooses “Friend” as the relationship type, and clicks “Confirm.”

On the newly created Relationship Profile Page, Ahmad clicks “Add Memory” to log a new memory from their day together. He uploads a photo of an Orca and writes a quick note about how Basil loves learning about Orcas and watching them when scuba diving. He adds another memory: a picture of them at the sushi restaurant, and records that Basil enjoys Sashimi sushi.

Over the following weeks, Ahmad and Basil hang out often. After each time, Ahmad quickly logs what he learns in Momento, such as small preferences, funny moments, and inside jokes. Three months later, Basil’s birthday appears in Momento’s upcoming occasions list. Since a mutual friend, Omar, also knows Basil well, Ahmad invites him as a collaborator to help plan. The two of them add a few ideas to a shared planning checklist, like going out for sushi again and preparing a small surprise. Ahmad presses the “Brainstorming” button, selects “Gifts,” and is taken to the Recommendation Page. Using the details stored in Basil’s profile, the system suggests a thoughtful idea: a necklace with an Orca on it. 

Ahmad loves the idea. He marks the planning item as done, and Momento updates the preparation status so he and Omar feel aligned leading up to the celebration. Through this journey, Momento helped Ahmad document the small but meaningful details that matter in his friendship with Basil and later turned those details into a personal, thoughtful gesture.

# 4. UI Sketches

## Sign Up View
<img width="693" height="467" alt="image" src="https://github.com/user-attachments/assets/fa22c25b-915a-48eb-8273-7b520dbe2466" />

## Home Dashboard — Your People & Upcoming Moments
<img width="693" height="400" alt="image" src="https://github.com/user-attachments/assets/2e7f7608-6d03-4107-875c-9ab6d85942d6" />

## Add Profile View — Create New Relationship
<img width="715" height="480" alt="image" src="https://github.com/user-attachments/assets/62d5288a-d5f2-4ce4-910e-eaff4f088a79" />

## Relationship Profile — Preferences & Moments Overview
<img width="802" height="582" alt="image" src="https://github.com/user-attachments/assets/9806a5d8-a897-49cd-bb6f-f1cb2edb30df" />

## New Memory — Add Title, Date & Description
<img width="695" height="465" alt="image" src="https://github.com/user-attachments/assets/96cf87e3-64c9-4bac-a28c-dc3090fcd07a" />

## Occasion Planning — Event Details & Countdown
<img width="565" height="376" alt="image" src="https://github.com/user-attachments/assets/35eac41f-0d08-46c3-9abf-48ac73ef81ac" />

## Suggestions View — Gift & Activity Ideas
<img width="715" height="527" alt="image" src="https://github.com/user-attachments/assets/25a98f6f-813c-4381-96e4-c8cd78b275bc" />

# 5. Visual Design Study
<img width="748" height="427" alt="image" src="https://github.com/user-attachments/assets/69110abd-f5d7-4e18-a7df-5fad06ba7052" />

<img width="748" height="411" alt="image" src="https://github.com/user-attachments/assets/eb93c82d-4fca-4baf-b629-3361945e6f72" />

# 6. Design Summary

All five of Momento’s main features work together to help people actually follow through on their good intentions. RelationshipProfiles give you a place to remember the little things about the people you care about, whether that be inside jokes, their favorite snacks, or important dates. OccasionPlanner then uses that info to help you plan ahead for birthdays, holidays, or any moments you want to make special, and even coordinate with others if needed. Our SuggestionEngine helps recommend thoughtful gifts or gestures when the timing is right, and CheckInPrompts will encourage small, meaningful touchpoints beyond the more significant occassions. Everything sits inside a secure UserAuth system, so private relationship details stay private.

We’ve tried to balance helpfulness with respect, which means no ranking relationships, no guilt trips, just tools that make showing you care a little easier. The only open questions we still need to sort out are how much collaborators can see and how smart early suggestions should be. We’ll figure those out as we continue to build our app to make our app useful as possible while maintaining good ethics practices. 

# 7. Development Plan

| Milestone | Features Delivered | Concepts Involved | Team Responsibility |
|----------|------------------|--------------------------|-------------------|
| **Alpha — Core Relationship Experience** | User Authentication (Sign Up / Login), Session Management, Create & View Profiles, Edit Relationship Info, Add Text-Based Notes, Memory Gallery for Photo Uploads | **UserAuth**, **Session**, **Profile**, **Relationship**, **Notes**, **MemoryGallery** | **Mohammed** — Full Frontend Development<br>**Nayeemur** — Backend: UserAuth + Session + Profile<br>**Alqasem** — Backend: Relationship + Notes<br>**Milena** — Backend: MemoryGallery + Database Setup + Testing |
| **Beta — Collaborative Planning + Personalization** | Occasion Creation + Timeline, Invite Collaborators, Shared Task Checklists, Recommendation Suggestions via SuggestionEngine | **Occasion**, **Collaborators**, **Task**, **TaskChecklist**, **SuggestionEngine** | **Mohammed** — Full Frontend Development<br>**Nayeemur** — SuggestionEngine Baseline + Testing<br>**Alqasem** — Backend: Occasion + Collaborator Management + Integration<br>**Milena** — Backend: Task + TaskChecklist |

The primary technical uncertainty in our design lies in the SuggestionEngine, which must interpret loosely structured user inputs such as preferences and memories and translate them into relevant, specific gesture ideas. There is also some ambiguity in determining which suggestions are appropriate for a given occasion without overfitting to limited data. To mitigate these uncertainties, we will begin by constraining the input and suggestion space through clearly defined preference categories and a set of curated suggestion templates that directly map to those categories. Only if this baseline implementation proves reliable will we explore generating more contextually adaptive suggestions. If any part of this logic proves too difficult to implement, we will fall back to a simplified system that provides slightly less "personalized" yet still thoughtful recommendations, ensuring that the core user value of turning remembered details into meaningful action remains fully supported.
