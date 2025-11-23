# Overview

Momento: Small Notes, Big Connections
A relationship dashboard for documenting meaningful details about loved ones and generating thoughtful gift and activity ideas.

Unique Features:
1. Personal Profile Spaces
Customizable space for each important person in user’s life.
Store preferences, shared memories, communication style notes, and other small but meaningful details.

2. Collaborative Planning Space
Space for users to come together and plan events/gifts.
Combines individual info of recipient into one for better planning. 

3. Suggestions Recommendation Engine
Recommendation system powered by an LLM.
Translates person’s stored preferences ideas of gifts, activities, or gestures.

# Example User Journey

Ahmad arrives home after an outing with his new friend Basil. He learned that Basil loved the sushi place they visited and talked excitedly about Orcas, which he enjoys seeing while scuba diving. Ahmad feels he learned meaningful details today and wants to store them so he can build on this new friendship.

He logs into Momento and lands on the Home Page, where he sees his existing relationship profiles. He clicks “+ New Profile” and is taken to the Customization Page. There, he enters Basil’s name, chooses “Friend” as the relationship type, and clicks “Confirm.”

On the newly created Relationship Profile Page, Ahmad clicks “Add Memory” to log a new memory from their day together. He uploads a photo of an Orca and writes a quick note about how Basil loves learning about Orcas and watching them when scuba diving. He adds another memory: a picture of them at the sushi restaurant, and records that Basil enjoys Sashimi sushi.

Over the following weeks, Ahmad and Basil hang out often. After each time, Ahmad quickly logs what he learns in Momento, such as small preferences, funny moments, and inside jokes. Three months later, Basil’s birthday appears in Momento’s upcoming occasions list. Since a mutual friend, Omar, also knows Basil well, Ahmad invites him as a collaborator to help plan. The two of them add a few ideas to a shared planning checklist, like going out for sushi again and preparing a small surprise. Ahmad presses the “Brainstorming” button, selects “Gifts,” and is taken to the Recommendation Page. Using the details stored in Basil’s profile, the system suggests a thoughtful idea: a necklace with an Orca on it. 

Ahmad loves the idea. He marks the planning item as done, and Momento updates the preparation status so he and Omar feel aligned leading up to the celebration. Through this journey, Momento helped Ahmad document the small but meaningful details that matter in his friendship with Basil and later turned those details into a personal, thoughtful gesture.

# Design Summary

All five of Momento’s main features work together to help people actually follow through on their good intentions. RelationshipProfiles give you a place to remember the little things about the people you care about, whether that be inside jokes, their favorite snacks, or important dates. OccasionPlanner then uses that info to help you plan ahead for birthdays, holidays, or any moments you want to make special, and even coordinate with others if needed. Our SuggestionEngine helps recommend thoughtful gifts or gestures when the timing is right, and CheckInPrompts will encourage small, meaningful touchpoints beyond the more significant occassions. Everything sits inside a secure UserAuth system, so private relationship details stay private.

We’ve tried to balance helpfulness with respect, which means no ranking relationships, no guilt trips, just tools that make showing you care a little easier. The only open questions we still need to sort out are how much collaborators can see and how smart early suggestions should be. We’ll figure those out as we continue to build our app to make our app useful as possible while maintaining good ethics practices. 
