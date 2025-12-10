Agenda: timing for meeting

Review App Functionalities and Frontend: 35 mins.
Questions about backend: 15 mins.
Question about frontend: 10 mins.

Progress report: how last week went, alignment to development plan

It was good. We finalized our concept design choices and started working on implementation. We were able to finish our MVP, which displays the core functionalities of creating a relationship profile, with the regular skeleton (frontend, authentication system, data management in the backend, etc). We started working on the second section of our app: the occasion planning. We also implemented the MemoryGallery section as well as translated everything into syncs via inclusions and exclusions from the basic implementation.

Design changes: what changes were made to the design since the last meeting

We solidified our concept design thanks to Erin’s feedback. We cut some concepts for the time being (like the checkInPrompts), as they weren’t essential for our app’s core goals and just made it complex. We also broke down some of our complex concepts into smaller, more modular ones, ending up with 8 well-defined concepts, which made it easier to work on the implementation. We have also populated our syncs collection. Before, we had most of the multi-concept functionalities done within complex concepts, but now we have a cleaner design where such functionalities are done in our new syncs.

Issues: list of problems and issues to address with a sentence or two explaining each

Several production-level bugs: Currently, we see some minor bugs with image uploading in production since the GCS is only configured for localhost. We suspect this may be a CORS issue, and we need to whitelist our frontend url in GCS.

Username section showing sensitive information. Currently, the username section of our app shows the user’s password or doesn’t state their username, and just displays “user.” Also, the backend logs literally displays the user’s password when they sign in, which is a major security vulnerability.

Plans & decisions: During this meeting, we got to show our core app functionalities and discuss our plans for the additional functionalities. We got positive feedback about our app, indicating that it’s in a good shape and just requires adding the additional functionalities to be complete. Our current plan is to finalize the implementation for the occasion planning and the suggestion engine, in addition to some minor tweaks and testing
