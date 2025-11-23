[@sync-background](../templates/sync-background.md)

[@app-overview](../application/app-overview.md)

[@all-concepts](../application/all-concepts.md)

[@all-synchronizations](../application/all-synchronizations.md)

[@sync-learnings](../memories/sync-learnings.md)

# generate: synchronizations

For the following description of behavior or a feature the user would like:

- If a synchronization specification is not specifically given, first generate the specifications under: `design/syncs/{name}.sync.md` where `{name}` refers to a brief semantic description of what the set of synchronizations is meant to achieve, such as "auth".
- Generate the corresponding TypeScript implementation code under `src/syncs/{name}.sync.md` that faithfully adheres to the syntax of synchronizations and achieves what is specified. 
- Summarize what was implemented by describing the mapping between the desired behaviors and how the granular synchronizations implement those behaviors. 
- If there are a large number of synchronizations generated, **encourage the user to work incrementally** and split up their task. 
- Emphasize the importance of testing, and provide sample JSON requests to test against generated Requesting endpoints. 