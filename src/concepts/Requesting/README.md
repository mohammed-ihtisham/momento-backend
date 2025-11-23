# Requesting

The Requesting concept offers a traditional entrypoint to an application built with concepts and synchronizations in the form of an API request server. By entirely encapsulating HTTP, routing, and the concerns related to setting up a server, you can simply include the Requesting concept as part of your application and immediately begin programming against any HTTP requests made to your application:

**Setup**
1. Include the `Requesting` source folder as `src/concepts/Requesting` (already done if you've forked/cloned this repository).
2. Configure any environment variables you'd like change by adding/editing in your `.env` file (port, timeout, etc.)
3. Run `deno run start`, and your server will be live!

# Configuration
The following environment variables are available:
- `PORT`: the port to the server binds, default 10000
- `REQUESTING_BASE_URL`: the base URL prefix for api requests, default "/api"
- `REQUESTING_TIMEOUT`: the timeout for requests, default 10000ms
- `REQUESTING_SAVE_RESPONSES`: whether to persist responses or not, default true

# Passthrough Routes

By default, the Requesting concept exposes concept actions directly in the form of **passthrough routes**. This means that HTTP requests against paths of the form:

```js
// Format: route = {base URL}/{concept}/{action or query}
route = "/api/LikertSurvey/createSurvey"
```

will automatically passthrough to the underlying concept action or query: in this case, `LikertSurvey.createSurvey`. 

- The request verb must be `POST`
- The request body is a single JSON record of the specified shape in the concept specification
- The return body will also be a single JSON record of the specified shape

For example, if the concept specification has:

```concept
actions
  createSurvey (author: Author, title: String, scaleMin: Number, scaleMax: Number): (survey: Survey)
    ...
```

then the body of a request would look like:

```json
{
  "author": "me",
  "title": "Mangos",
  "scaleMin": 1,
  "scaleMax": 5
}
```

with a return of:

```json
{
  "survey": "019a22d2-e485-71b4-a668-e7d9e8859b15"
}
```

# Including and Excluding Passthrough Routes

Allowing passthrough routes is a natural default that says, "anyone can freely access my concepts". This may be appropriate for entirely public-facing applications and internal tools that operate within secure boundaries. However, if at any point you would like (or need) to add one more layer of indirection for any of these example purposes:

- Auth: authenticating/authorizing *requests* before allowing parties to do what they want
- Reacting: more than one concept action needs to react to a *request*
- Logging: all behavior from one endpoint should be tracked

then what you need is to **reify requests**. This is the purpose of the Requesting concept: to allow parties to formulate requests that require a response. In other words, we are preventing parties from directly interacting with concepts and giving them the opportunity to form a tangible request instead.

By default, all concepts and their actions/queries will automatically be discovered, and registered as **unverified routes**. You will see a log of these when you first start the server through `deno run start`. 

**Configuring Passthrough**
1. Open [passthrough.ts](passthrough.ts) to configure passthrough. 
2. For every passthrough route you think makes sense and should be **included**, add it to `const inclusions = {...}` as a key/value pair `"route": "justification"`. For example, you might have `"/api/LikertSurvey/_getSurveyQuestions": "this is a public query"`
3. For every passthrough route you think should be **excluded**, simply add the route to `const exclusions = [...]`, such as `"/api/LikertSurvey/createSurvey"`

# Requesting Routes

Any routes that you **exclude** or do not match a passthrough route will automatically fire a `Request.request` action, and if you've left the default logging setting to `TRACE`, you'll see a recorded trace of this action such as:

```
Requesting.request {
  scaleMin: 1,
  scaleMax: 5,
  author: 'me',
  title: 'Mangos',
  path: '/LikertSurvey/createSurvey'
} => { request: '019a22d2-e44d-7f79-be62-92ead8db2d77' }
```

This allows you to synchronize against `Requesting.request` to fire off any other concept actions, and eventually respond with something along the lines of:

```
Requesting.respond {
  request: '019a22d2-e44d-7f79-be62-92ead8db2d77',
  survey: '019a22d2-e485-71b4-a668-e7d9e8859b15'
} => { request: '019a22d2-e44d-7f79-be62-92ead8db2d77' }
```

**Important:** Both `Requesting.request` and `Requesting.respond` take *any* parameters as a flat list alongside `path:` and `request:`, meaning in order to call this `Requesting.respond`, you simply have the following `then` clause:

```sync
then
  Requesting.respond (request, survey)
```

or in TypeScript,

```typescript
{
  //...
  then: actions([Requesting.respond, { request, survey }])
}
```

See [sample.sync](src/syncs/sample.sync.ts) for example synchronizations that implement a basic request/response cycle that mimics a passthrough route for the `/LikertSurvey/createSurvey` path.

> **Important**: the `path` parameter does NOT take into account the base URL, and hence the examples above use "/LikertSurvey/createSurvey" instead of "/api/LikertSurvey/createSurvey". You should take this into account when pattern matching in synchronizations against literal values for the path.