---
timestamp: 'Sun Nov 23 2025 15:06:38 GMT-0500 (Eastern Standard Time)'
parent: '[[../20251123_150638.bfb4c852.md]]'
content_id: 8710c70eb9a6d38f1a3dad59e07ac243d0a2d5d3e30264362105543c5cf385d0
---

# concept: Following \[User]

**purpose** track which users are interested in receiving updates or content from other users.

**principle** If User A follows User B, then User A will be considered interested in User B's content. If User A later unfollows User B, User A will no longer be considered interested in User B's content. This allows users to curate the content sources they wish to monitor.

**state**
  a set of Follows with
    a follower User
    a followee User

**actions**

follow (follower: User, followee: User): (followed: Boolean)
    **requires** `follower` is not the same as `followee` AND `follower` does not already follow `followee`
    **effects** a new `Follow` record is created, associating `follower` with `followee`; returns `true` as `followed`

unfollow (follower: User, followee: User): (unfollowed: Boolean)
    **requires** `follower` currently follows `followee`
    **effects** the `Follow` record associating `follower` with `followee` is removed; returns `true` as `unfollowed`

**queries**

\_getFollowees (follower: User): (followee: User)
    **requires** true
    **effects** returns the set of all users that `follower` is following

\_getFollowers (followee: User): (follower: User)
    **requires** true
    **effects** returns the set of all users who are following `followee`

\_isFollowing (follower: User, followee: User): (isFollowing: Boolean)
    **requires** true
    **effects** returns `true` as `isFollowing` if `follower` follows `followee`, otherwise returns `false`

***
