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

## Additional Brainstormed Features:

**Note: These are extra ideas we had while brainstorming and may be narrowed down/excluded during functional design. 

1. **Occasion Tracking & Planning:** A timeline of upcoming and past events (birthdays, milestones, personal challenges) that helps users prepare in advance and reflect afterward.

2. **Thoughtful Checkins:** Lightweight prompts that help users remember what worked well, what felt appreciated, and how relationships evolve over time.

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
    requires occasion exists and inviter ∈ occasion.collaborators
    effect adds newCollaborator to occasion.collaborators

  addPlanningItem (occasion: Occasion, user: User, description: String)
    requires occasion exists and user ∈ occasion.collaborators and description not empty
    effect creates a new PlanningItem for the occasion

  togglePlanningItemDone (item: PlanningItem, user: User)
    requires item exists and user ∈ item.occasion.collaborators
    effect flips item.done

  updateSharedNotes (occasion: Occasion, user: User, notes: String)
    requires occasion exists and user ∈ occasion.collaborators
    effect updates sharedNotes

  markCompleted (occasion: Occasion, user: User)
    requires occasion exists and user ∈ occasion.collaborators
    effect sets status to completed

  upcomingOccasions (user: User) : (events: set Occasion)
    requires user is authenticated
    effect returns future occasions where user ∈ collaborators, sorted by urgency

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
