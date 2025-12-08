# User Testing

## Task List

| **Title**                       | **Instruction**                                                              | **Rationale**                                                                                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Register/Sign Up                | Create an account on our platform                                            | The objective of the task is to see if creating an account is self-explanatory for a user. We hope to test full sessioning functionality even without an email address.     |
| Create Dashboard Profiles (3–4) | Create individual profiles for 3–4 different people                          | With this task we want to see who users would plan to include in their dashboard. We also want to see if the concept of adding relatives/friends is understood by the user. |
| Upload Notes                    | Upload contextual notes about an individual to their bulletin board          | We want to see how users title and describe their own notes. This helps us see what users tend to want to remember about their loved ones.                                  |
| Upload Images                   | Upload shared images with an individual to their bulletin board              | We want to see how purposeful the user makes this feature and how much it influences personalization of the app.                                                            |
| Create Occasion                 | Create an upcoming occasion to prepare for                                   | This shows whether occasion creation is straightforward and what events users would think to track. It also helps uncover potential bugs.                                   |
| Populate Checklist              | Create to-do items for a specific occasion                                   | We included this task to see which checklist items users commonly include.                                                                                                  |
| Add Notes to Occasion           | Populate the occasion with existing/new notes about the related individual   | We wanted to see if users can distinguish shared occasion notes from private dashboard notes and differentiate between adding existing vs. new notes.                       |
| Generate Gift Suggestions       | Use the shared occasion notes to generate gift suggestions for an individual | We wanted to see user feedback on the generated suggestions and how context quantity affects outputs.                                                                       |
| Rearrange Profiles              | Prioritize certain individuals on the pinned dashboard                       | We wanted to gauge whether users find pinning intuitive and useful for prioritizing relationships.                                                                          |

## Summary of Lessons:

### Study 1:

During our user testing, we received a lot of helpful feedback related to the functionality and design of our app. Our app’s color scheme and design was overall perceived as easily navigable which reflected a positive outcome from our visual design study. The user was able to complete a lot of the tasks without any major roadblocks and often spoke her thought process and feedback out loud without prompting.

The user’s main concern with our app was related to the gift suggestions concept. She mentioned how she would find the suggestions more useful if the user could provide feedback based on the results to refine and improve future suggestions. She also mentioned how it could be helpful if we had a feature that could keep track of past gifts that were purchased for an individual based on the different occasions. Finally, related to the suggestions, she mentioned it would be useful if the suggestions remained even after the page was refreshed.

The user mentioned navigating between the pages was very self-explanatory, but also provided feedback related to the way in which certain components are labeled/described. For example, she suggested rephrasing the current title “New Occasion Note” to “New Shared Note” to make it more explicit that whichever notes are shared for an occasion are no longer kept private (like in the dashboard) but are visible to anyone with access to the occasion. Additionally she mentioned that it would be helpful if an event, let’s say Christmas, could be designated for a lot of individual profiles and not just having to select one (one Christmas event including multiple family members).

Finally, she mentioned the current design for pinning/unpinning of individuals is not as intuitive as it could be. Currently the user would drag an existing profile on top of another to replace that individual's spot, but the user mentioned that it felt more like the objective was combining profiles which is not what was intended. Overall, the feedback we received allowed us to see how a user interacts with our current app design and what could be improved for our final demo.

## Study 2:

The participant responded positively to the core concept of the app—particularly the idea of maintaining relationship profiles and using these to enrich occasion planning. The user showed enthusiasm for adding notes about people, and he appreciated that relationship notes carry over into occasion notes. The user immediately recognized and valued the AI-powered suggestion engine.

However, several usability breakdowns emerged. Early in the session, the participant was uncertain about what the relationship profiles were for, suggesting that their value is not sufficiently communicated. The user also did not engage much with the photo board, noting that he didn’t see a strong benefit, and struggled with viewing added images at larger sizes.

During navigation, the user occasionally missed or misinterpreted affordances: he found the pinned section but did not realize he could rearrange items, and he did not initially understand that creating an occasion allows adding tasks or notes. This indicates gaps both in onboarding and signifiers. The user also expected more feedback mechanisms, such as a confirmation when suggestions are ready or celebratory feedback when tasks are all completed.

Functionally, the participant encountered several broken or confusing interactions—notes could not be updated or deleted, occasion descriptions were not visible or editable, and tasks mistakenly propagated across occasions. Performance issues also affected the experience, with the app feeling slow at times.
Despite these issues, the participant praised filtering in the occasion's view and wished similar organizational capabilities—especially user-customizable tags—were available for relationship profiles. The user also expressed that occasions might deserve more prominence in the interface hierarchy, potentially placed above profiles.

## Flaws & Opportunities for Improvement:

## Study 1:

## **1. No Way to Provide Feedback on Gift Suggestions**

**Why it’s happening:**  
The team is currently focused on core functionality (including collaboration), so feedback mechanisms for suggestions have not yet been prioritized.

**How to fix:**

- Implement a **thumbs up / thumbs down** system.
- Regenerate suggestions when users mark results as unhelpful.
- Use feedback data to refine future recommendations.

---

## **2. Edit Occasion Note Bug**

**Why it’s happening:**  
Occasion notes currently cannot be edited or deleted due to a logic error in how occasion-specific notes are handled.

**How to fix:**

- Fix the underlying update/delete logic.
- Ensure occasion notes are treated as their own editable entities.
- Add the appropriate edit/delete affordances once functionality works.

---

## **3. Clearer Note Purpose & More Explicit Labeling**

**Why it’s happening:**  
Users are unclear about the difference between personal notes and shared occasion notes, and some wording (e.g., “Your People”) is ambiguous.

**How to fix:**

- Clarify note descriptions to communicate intended purpose.
- Add explicit labeling for **shared** occasion notes.
- Change dashboard section title from **“Your People” → “Your Pinned People.”**
- On individual bulletin boards, expand “New Note” with a small description (e.g., _“Add notes to remember key details about this person…”_).
- Rename occasion notes to **“New Shared Note”** so users know they are public.
- Make it clear that the dashboard shows **pinned profiles**, not all profiles.

## Study 2:

## **1. Weak Onboarding / Navigation Guidance**

**Why it’s happening:**  
Users stumble into features instead of discovering them intentionally; key flows (e.g., adding tasks, notes, rearranging pins) lack signifiers.

**How to fix:**

- Add a lightweight onboarding sequence (3–5 screens or a **guided first-time tour**).
- Use microcopy, empty-state illustrations, and subtle cues (e.g., **“Tap + to add tasks”**).

---

## **2. Notes Cannot Be Updated or Deleted**

**Why it’s happening:**  
Current backend/frontend controls for note editing are broken.

**How to fix:**

- Fix update/delete handlers.
- Visually distinguish editable notes from read-only ones.
- Add clear edit affordances (e.g., **pencil icon**, swipe gestures).

---

## **3. Occasion Description Not Visible or Editable**

**Why it’s happening:**  
The description field is not surfaced in the occasion view and does not sync when edited.

**How to fix:**

- Display the description prominently.
- Allow **inline editing**.
- Integrate the description into the suggestion engine so it meaningfully enhances recommendations.

---

## **4. Task Behavior Is Buggy Across Occasions**

**Why it’s happening:**  
Task data appears to be shared or overwritten globally rather than scoped per occasion.

**How to fix:**

- Ensure each task item properly references its **parent occasion**.
- Introduce dependency separation in the task system.
- Notify users when all tasks are completed (e.g., tasteful **confetti** or a completion message).

---

## **5. Limited Value Communication for Relationship Profiles (Photos, Tags, Etc.)**

**Why it’s happening:**  
Users don’t see why photos matter, and tags aren’t customizable — causing confusion and lower engagement.

**How to fix:**

- Allow **user-defined tags** for better personalization and filtering.
- Improve the photo board (larger viewing, optional usage).
- Add a **short description area** on profiles so users immediately understand what they’ve stored.
