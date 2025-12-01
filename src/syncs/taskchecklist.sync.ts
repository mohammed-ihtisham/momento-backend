/**
 * Synchronizations for TaskChecklist concept
 */

import { TaskChecklist, Sessioning, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";

/**
 * Sync: Handle addTask request with session
 * Requires authentication - user adds tasks to their own checklist.
 */
export const AddTaskRequestWithSession: Sync = ({ request, session, user, task }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/addTask", session, task },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who becomes the owner)
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([TaskChecklist.addTask, { owner: user, task }]),
});

/**
 * Sync: Handle addTask request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const AddTaskRequestWithOwner: Sync = ({ request, owner, task }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/addTask", owner, task },
    { request },
  ]),
  then: actions([TaskChecklist.addTask, { owner, task }]),
});

export const AddTaskResponseSuccess: Sync = ({ request, entry }) => ({
  when: actions(
    [Requesting.request, { path: "/TaskChecklist/addTask" }, { request }],
    [TaskChecklist.addTask, {}, { entry }],
  ),
  then: actions([Requesting.respond, { request, entry }]),
});

export const AddTaskResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/TaskChecklist/addTask" }, { request }],
    [TaskChecklist.addTask, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle removeTask request with session
 * Requires authentication - user removes tasks from their own checklist.
 */
export const RemoveTaskRequestWithSession: Sync = ({ request, session, user, task }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/removeTask", session, task },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([TaskChecklist.removeTask, { owner: user, task }]),
});

/**
 * Sync: Handle removeTask request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const RemoveTaskRequestWithOwner: Sync = ({ request, owner, task }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/removeTask", owner, task },
    { request },
  ]),
  then: actions([TaskChecklist.removeTask, { owner, task }]),
});

export const RemoveTaskResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/TaskChecklist/removeTask" }, { request }],
    [TaskChecklist.removeTask, {}, {}],
  ),
  then: actions([Requesting.respond, { request, status: "removed" }]),
});

export const RemoveTaskResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/TaskChecklist/removeTask" }, { request }],
    [TaskChecklist.removeTask, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle markComplete request with session
 * Requires authentication - user marks tasks complete in their own checklist.
 */
export const MarkCompleteRequestWithSession: Sync = ({ request, session, user, task }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/markComplete", session, task },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([TaskChecklist.markComplete, { owner: user, task }]),
});

/**
 * Sync: Handle markComplete request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const MarkCompleteRequestWithOwner: Sync = ({ request, owner, task }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/markComplete", owner, task },
    { request },
  ]),
  then: actions([TaskChecklist.markComplete, { owner, task }]),
});

export const MarkCompleteResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/TaskChecklist/markComplete" }, { request }],
    [TaskChecklist.markComplete, {}, {}],
  ),
  then: actions([Requesting.respond, { request, status: "completed" }]),
});

export const MarkCompleteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/TaskChecklist/markComplete" }, { request }],
    [TaskChecklist.markComplete, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle markIncomplete request with session
 * Requires authentication - user marks tasks incomplete in their own checklist.
 */
export const MarkIncompleteRequestWithSession: Sync = ({ request, session, user, task }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/markIncomplete", session, task },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([TaskChecklist.markIncomplete, { owner: user, task }]),
});

/**
 * Sync: Handle markIncomplete request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const MarkIncompleteRequestWithOwner: Sync = ({ request, owner, task }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/markIncomplete", owner, task },
    { request },
  ]),
  then: actions([TaskChecklist.markIncomplete, { owner, task }]),
});

export const MarkIncompleteResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/TaskChecklist/markIncomplete" }, { request }],
    [TaskChecklist.markIncomplete, {}, {}],
  ),
  then: actions([Requesting.respond, { request, status: "incomplete" }]),
});

export const MarkIncompleteResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/TaskChecklist/markIncomplete" }, { request }],
    [TaskChecklist.markIncomplete, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getChecklistEntry request with session
 * Requires authentication - user can only see their own checklist entries.
 */
export const GetChecklistEntryRequestWithSession: Sync = ({ request, session, user, task, completed }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/_getChecklistEntry", session, task },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const taskValue = frame[task] as string;
      const completedResult = await TaskChecklist._getChecklistEntry({ owner: ownerValue, task: taskValue });
      
      const newFrame = { ...frame };
      newFrame[completed] = completedResult;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, completed }]),
});

/**
 * Sync: Handle _getChecklistEntry request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetChecklistEntryRequestWithOwner: Sync = ({ request, owner, task, completed }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/_getChecklistEntry", owner, task },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    
    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;
      const taskValue = frame[task] as string | undefined;
      
      const newFrame = { ...frame };
      
      if (!ownerValue || !taskValue) {
        // Missing required parameters - respond with null
        newFrame[completed] = null;
        results.push(newFrame);
        continue;
      }
      
      const completedResult = await TaskChecklist._getChecklistEntry({ owner: ownerValue, task: taskValue });
      newFrame[completed] = completedResult;
      results.push(newFrame);
    }
    
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, completed }]),
});

/**
 * Sync: Handle _getChecklist request with session
 * Requires authentication - user can only see their own checklist.
 */
export const GetChecklistRequestWithSession: Sync = ({ request, session, user, checklist }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/_getChecklist", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const checklistArray = await TaskChecklist._getChecklist({ owner: ownerValue });
      
      const newFrame = { ...frame };
      newFrame[checklist] = checklistArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, checklist }]),
});

/**
 * Sync: Handle _getChecklist request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetChecklistRequestWithOwner: Sync = ({ request, owner, checklist }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/_getChecklist", owner },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    
    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;
      
      const newFrame = { ...frame };
      
      if (!ownerValue) {
        // No owner provided - respond with empty array
        newFrame[checklist] = [];
        results.push(newFrame);
        continue;
      }
      
      const checklistArray = await TaskChecklist._getChecklist({ owner: ownerValue });
      newFrame[checklist] = checklistArray;
      results.push(newFrame);
    }
    
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, checklist }]),
});

/**
 * Sync: Handle _getCompletedTasks request with session
 * Requires authentication - user can only see their own completed tasks.
 */
export const GetCompletedTasksRequestWithSession: Sync = ({ request, session, user, tasks }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/_getCompletedTasks", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const tasksArray = await TaskChecklist._getCompletedTasks({ owner: ownerValue });
      
      const newFrame = { ...frame };
      newFrame[tasks] = tasksArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, tasks }]),
});

/**
 * Sync: Handle _getCompletedTasks request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetCompletedTasksRequestWithOwner: Sync = ({ request, owner, tasks }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/_getCompletedTasks", owner },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    
    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;
      
      const newFrame = { ...frame };
      
      if (!ownerValue) {
        // No owner provided - respond with empty array
        newFrame[tasks] = [];
        results.push(newFrame);
        continue;
      }
      
      const tasksArray = await TaskChecklist._getCompletedTasks({ owner: ownerValue });
      newFrame[tasks] = tasksArray;
      results.push(newFrame);
    }
    
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, tasks }]),
});

/**
 * Sync: Handle _getIncompleteTasks request with session
 * Requires authentication - user can only see their own incomplete tasks.
 */
export const GetIncompleteTasksRequestWithSession: Sync = ({ request, session, user, tasks }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/_getIncompleteTasks", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const tasksArray = await TaskChecklist._getIncompleteTasks({ owner: ownerValue });
      
      const newFrame = { ...frame };
      newFrame[tasks] = tasksArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, tasks }]),
});

/**
 * Sync: Handle _getIncompleteTasks request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetIncompleteTasksRequestWithOwner: Sync = ({ request, owner, tasks }) => ({
  when: actions([
    Requesting.request,
    { path: "/TaskChecklist/_getIncompleteTasks", owner },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    
    for (const frame of frames) {
      const ownerValue = frame[owner] as string | undefined;
      
      const newFrame = { ...frame };
      
      if (!ownerValue) {
        // No owner provided - respond with empty array
        newFrame[tasks] = [];
        results.push(newFrame);
        continue;
      }
      
      const tasksArray = await TaskChecklist._getIncompleteTasks({ owner: ownerValue });
      newFrame[tasks] = tasksArray;
      results.push(newFrame);
    }
    
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, tasks }]),
});

