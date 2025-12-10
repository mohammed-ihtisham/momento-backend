Agenda: timing for meeting

Review Progress Report: 5 mins.
Review Design Changes: 15 mins.
Review Issues: 20 mins.
Feedback on App: 10 mins.
Plans & Decisions: 10 mins.

Progress report: how last week went, alignment to development plan

We defined our final project idea after the immense feedback we received for our initial project idea. Our initial project idea for a gamified learning tool was all over the place. There were too many features that had to be implemented, making the project infeasible. We regrouped and met as a team again to come up with a new project idea and a backup, which Erin accepted.

Design changes: what changes were made to the design since the last meeting

We are going with a completely new idea that addresses the meaningful relationship maintenance domain.

Our app will allow users to create a customizable space for each important person in their life, storing preferences, shared memories, communication style notes, and other small but meaningful details.

Our app will also feature the ability to create a shared space for multiple users to document and organize details about an activity or event that has already occurred. Participants can add memories, photos, notes, and reflections, creating a comprehensive record of the event. The space allows customization with categories or tags, making it easy to preserve, revisit, and share the experience with others.

-> Possibly refactor to instead have a shared space for friends coming together to compile their info on a person to think of better gifts of party ideas etc (i.e. Alice and Bob both have different profiles for David that they want to take together to create the best party for David)

Finally, we’re thinking of implementing a recommendation system that translates a person’s stored preferences and current context into ideas of possible gifts, activities, or gestures that might be appropriate.

Issues: list of problems and issues to address with a sentence or two explaining each

For our recommendation system, what is a better way to implement it? Simple logic or an LLM? We’re stuck on this because we’re not sure to what extent an LLM would be able to digest all the information about a person and output a genuine idea that would be nice for the receiver. But if we were to use logic, how would it even account for all the unique cases users can have?
Use LLM.
Maybe thumbs up/down feature if user likes the recommendations.

How should we store the images users upload? I’m thinking we use GCS, but I want to double-check and make sure it will work well in production if there are many images uploaded for an event.
Igen concept box -> feature for file upload w/ GCS.

How should we organize the personalized profile spaces and the collaborative document spaces without overwhelming the app with so many things at once? Looking for a creative way to separate the two main features and make the app look clean and follow best UX practices.

Plans & decisions: After discussing our revised idea with Erin, we gained valuable feedback that allowed us to continue with our Momento idea. Following the meeting, we must design our project pitch. For this, we will meet as a team virtually and work on a slide presentation in order to record our presentation video. This will be a group effort and will be structured using ideas from our revised Problem Framing assignment. Additionally, we will be working on our Functional Design assignment. We will divide the sections of the assignment among all group members and revise the final version before submission.
