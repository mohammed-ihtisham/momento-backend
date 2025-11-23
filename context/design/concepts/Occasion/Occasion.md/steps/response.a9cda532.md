---
timestamp: 'Sun Nov 23 2025 14:57:13 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_145713.e87a9101.md]]'
content_id: a9cda532dbb680abeadab857b820d3cad2ee91dc831f816bbb00494cbaa069c8
---

# response:

```concept
concept Occasion [Creator]
purpose delineate a specific event or period of time, allowing for its identification, description, and association with relevant activities or data
principle if a user creates an occasion for a birthday party with a name and date, then they can later refer to that occasion to add photos or invite guests
state
  a set of Occasions with
    a name String
    a description String
    a startTime String  // ISO 8601 DateTime string
    an endTime String   // ISO 8601 DateTime string, optional
    a creator Creator

actions
  createOccasion (name: String, description: String, startTime: String, endTime?: String, creator: Creator): (occasion: Occasion)
    requires
      no Occasion created by 'creator' already has 'name'
      'startTime' is a valid ISO 8601 DateTime string
      if 'endTime' is provided, it is a valid ISO 8601 DateTime string and 'startTime' must be before 'endTime'
    effects
      creates a new Occasion 'o';
      sets 'name' of 'o' to 'name';
      sets 'description' of 'o' to 'description';
      sets 'startTime' of 'o' to 'startTime';
      sets 'endTime' of 'o' to 'endTime' (if provided);
      sets 'creator' of 'o' to 'creator';
      returns 'o' as 'occasion'

  updateOccasion (occasion: Occasion, name?: String, description?: String, startTime?: String, endTime?: String): Empty
    requires
      'occasion' exists
      if 'name' is provided, no other Occasion created by the same creator as 'occasion' already has 'name'
      if 'startTime' and/or 'endTime' are provided, they are valid ISO 8601 DateTime strings and must form a valid time range ('startTime' before 'endTime' considering existing values)
    effects
      updates the specified properties ('name', 'description', 'startTime', 'endTime') of 'occasion'

  deleteOccasion (occasion: Occasion): Empty
    requires
      'occasion' exists
    effects
      removes 'occasion' from the set of Occasions

queries
  _getOccasion (occasion: Occasion): (name: String, description: String, startTime: String, endTime?: String, creator: Creator)
    requires
      'occasion' exists
    effects
      returns the name, description, start time, end time, and creator of 'occasion'

  _getOccasionsByCreator (creator: Creator): (occasion: Occasion)
    requires
      'creator' exists
    effects
      returns a set of all Occasions created by 'creator'

  _getOccasionsBetween (start: String, end: String): (occasion: Occasion)
    requires
      'start' is a valid ISO 8601 DateTime string
      'end' is a valid ISO 8601 DateTime string
      'start' must be before 'end'
    effects
      returns a set of Occasions whose time range ('startTime' to 'endTime' or just 'startTime' if 'endTime' is null) overlaps with the given range ('start' to 'end')
```
