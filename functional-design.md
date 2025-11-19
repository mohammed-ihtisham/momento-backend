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
```markdown
concept UserAuth [User]
purpose authenticate users so their personal relationship data and contributions remain private and secure
principle users must be signed in to view, add, or edit personal relational information

state
  a set of Users with
    a email String
    a passwordHash String
    a displayName String

actions
  register (email: String, password: String, displayName: String) : (user: User)
    requires email is valid and not already in system
    effect creates a new user account

  login (email: String, password: String) : (user: User)
    requires credentials match
    effect authenticates user and grants access to personal data

  logout (user: User)
    requires user is authenticated
    effect ends session

```

### Concept: `RelationshipProfiles`
```markdown
concept RelationshipProfiles [User]
purpose help users remember details about people they care about: likes, dislikes, shared context
principle each profile centers on personalization, not comparison or “scores”

state
  a set of Profiles with
    a owner User
    a personName String
    a relationshipType String // friend, parent, partner, etc.
    a notes String
    a preferences set Preference
    a memoriesUrls set Url // urls to image media of memories

  a set of Preferences with
    a profile Profile
    a category String // food, hobbies, communication style
    a preferenceDetail String
    a sentiment String // likes, dislikes

actions
  createProfile (user: User, personName: String, relationshipType: String)
    requires user is authenticated and personName not empty
    effect adds a new profile tied to user

  addPreference (profile: Profile, category: String, preferenceDetail: String, sentiment: String)
    requires profile exists and sentiment in {likes, dislikes}
    effect records an actionable preference

  updateNotes (profile: Profile, newNotes: String)
    requires profile belongs to user
    effect updates reference notes

 updateMemories (profile: Profile, newMemory: String)
  requires profile belongs to user
  effect updates memoriesUrl with newMemory image url
```

### Concept: `OccasionPlanner`
```markdown
concept OccasionPlanner [User, Profile]
purpose help users collaboratively prepare for birthdays, milestones, or stressful periods with timely, shared planning
principle prevents panic-buying or last-minute improvisation by letting multiple people coordinate thoughtful actions for the same person

state
  a set of Occasions with
    a profile Profile
    a createdBy User
    a collaborators set User
    a occasionType String // birthday, milestone, personal challenge
    a date Date
    a preparationWindow Number // days before event to surface suggestions
    a status String // planned, completed
    a sharedNotes String

  a set of PlanningItems with
    a occasion Occasion
    a addedBy User
    a description String
    a done Flag

actions
  addOccasion (creator: User, profile: Profile, type: String, date: Date, window: Number)
    requires creator is authenticated and date >= today and window >= 0
    effect creates a tracked upcoming occasion with createdBy = creator and collaborators = {creator}

  inviteCollaborator (occasion: Occasion, inviter: User, newCollaborator: User)
    requires occasion exists and inviter in occasion.collaborators
    effect adds newCollaborator to occasion.collaborators

  addPlanningItem (occasion: Occasion, user: User, description: String)
    requires occasion exists and user in occasion.collaborators and description not empty
    effect creates a new PlanningItem for the occasion

  togglePlanningItemDone (item: PlanningItem, user: User)
    requires item exists and user in item.occasion.collaborators
    effect flips item.done

  updateSharedNotes (occasion: Occasion, user: User, notes: String)
    requires occasion exists and user in occasion.collaborators
    effect updates sharedNotes

  markCompleted (occasion: Occasion, user: User)
    requires occasion exists and user in occasion.collaborators
    effect sets status to completed

  upcomingOccasions (user: User) : (events: set Occasion)
    requires user is authenticated
    effect returns future occasions where user in collaborators, sorted by urgency

```

### Concept: `SuggestionEngine`
```markdown
concept SuggestionEngine [User, Profile, Preference, Occasion]
purpose translate personal details into meaningful, timely gestures
principle prioritize specificity and emotional resonance over generic e-commerce links

state
  a set of Suggestions with
    a profile Profile
    a gesture String // "bring a favorite snack", "plan a coffee walk"
    a confidenceScore Number

actions
  generateSuggestions (profile: Profile) : (suggestions: set Suggestion)
    requires profile exists
    effect produces gesture ideas derived from preferences and memories

  refineForOccasion (occasion: Occasion) : (suggestions: set Suggestion)
    requires occasion exists
    effect filters suggestions based on date urgency and relevant context

  recordFeedback (profile: Profile, suggestion: Suggestion, positive: Boolean)
    requires suggestion exists
    effect updates confidence model for future recommendations
```

### Concept: `CheckInPrompts`
```markdown
concept CheckInPrompts [User, Profile]
purpose encourage mindful presence and emotional awareness over time
principle help users express care not just during occasions but on regular days

state
  a set of Prompts with
    a profile Profile
    a timestamp Date
    a question String
    a actionTaken String optional

actions
  sendPrompt (profile: Profile, question: String)
    requires profile exists
    effect notifies user with a reflection question

  logCheckInAction (prompt: Prompt, action: String)
    requires prompt exists
    effect records a small follow-up action

  getHistory (profile: Profile) : (prompts: set Prompt)
    requires profile exists
    effect returns prompts associated with profile sorted by timestamp

```

## Synchronizations
```markdown
sync upcomingCareMoments
when OccasionPlanner.upcomingOccasions(user) returns events
then SuggestionEngine.refineForOccasion(occasion) 
     where occasion = soonest(events)


sync contextAwarePrompts
when SuggestionEngine.recordFeedback(profile, suggestion, positive)
then CheckInPrompts.sendPrompt(profile, generatePromptBasedOnFeedback(suggestion, positive))
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
|----------|------------------|------------------|-------------------|
| Checkpoint 1 — Minimum Viable Experience (MVP)| User Auth (Sign Up/Login), Home Dashboard, Create & View Profiles, Add/Edit Preferences | UserAuth, RelationshipProfiles | TODO: ADD |
| Checkpoint 2 — Memories + Planning | Add Memories (photos + notes), Basic Occasion Planning (single user), Upcoming Events List | RelationshipProfiles, OccasionPlanner | TODO: ADD |
| Final Deliverable — Collaborative Planning + Suggestions | Invite Collaborators, Checklist + Shared Notes, Simple SuggestionEngine with direct add-to-checklist | OccasionPlanner, SuggestionEngine | TODO: ADD |
| Extra Goal (Not Confirmed) | CheckInPrompts with basic prompt logic | CheckInPrompts | Everyone |

The primary technical uncertainty in our design lies in the SuggestionEngine, which must interpret loosely structured user inputs such as preferences and memories and translate them into relevant, specific gesture ideas. There is also some ambiguity in determining which suggestions are appropriate for a given occasion without overfitting to limited data. To mitigate these uncertainties, we will begin by constraining the input and suggestion space through clearly defined preference categories and a set of curated suggestion templates that directly map to those categories. Only if this baseline implementation proves reliable will we explore generating more contextually adaptive suggestions. If any part of this logic proves too difficult to implement, we will fall back to a simplified system that provides slightly less "personalized" yet still thoughtful recommendations, ensuring that the core user value of turning remembered details into meaningful action remains fully supported.
