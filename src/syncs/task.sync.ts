/**
 * Synchronizations for Task concept
 */

import { Task, Sessioning, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";

/**
 * Sync: Handle createTask request with session
 * Requires authentication - user creates tasks for themselves.
 */
export const CreateTaskRequestWithSession: Sync = ({ request, session, user, description }) => ({
  when: actions([
    Requesting.request,
    { path: "/Task/createTask", session, description },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who becomes the owner)
    return await frames.query(Sessioning._getUser, { session }, { user });
  },
  then: actions([Task.createTask, { owner: user, description }]),
});

/**
 * Sync: Handle createTask request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const CreateTaskRequestWithOwner: Sync = ({ request, owner, description }) => ({
  when: actions([
    Requesting.request,
    { path: "/Task/createTask", owner, description },
    { request },
  ]),
  then: actions([Task.createTask, { owner, description }]),
});

export const CreateTaskResponseSuccess: Sync = ({ request, task }) => ({
  when: actions(
    [Requesting.request, { path: "/Task/createTask" }, { request }],
    [Task.createTask, {}, { task }],
  ),
  then: actions([Requesting.respond, { request, task }]),
});

export const CreateTaskResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Task/createTask" }, { request }],
    [Task.createTask, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle updateTaskDescription request with session
 * Requires authentication AND ownership verification - user can only update their own tasks.
 */
export const UpdateTaskDescriptionRequestWithSession: Sync = ({ request, session, user, task, description, owner }) => ({
  when: actions([
    Requesting.request,
    { path: "/Task/updateTaskDescription", session, task, description },
    { request },
  ]),
  where: async (frames: Frames) => {
    // First verify session and get the authenticated user
    let authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    // Then verify ownership by getting the task's owner
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const taskValue = frame[task] as string;
      const taskData = await Task._getTask({ task: taskValue });
      
      if (!taskData) {
        // Task doesn't exist - skip this frame (will result in error)
        continue;
      }
      
      // Check if the authenticated user owns this task
      if (taskData.owner === frame[user]) {
        results.push({ ...frame, owner: taskData.owner });
      }
      // If not owner, skip this frame (unauthorized)
    }
    return results;
  },
  then: actions([Task.updateTaskDescription, { task, description }]),
});

/**
 * Sync: Handle updateTaskDescription request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const UpdateTaskDescriptionRequestWithOwner: Sync = ({ request, owner, task, description }) => ({
  when: actions([
    Requesting.request,
    { path: "/Task/updateTaskDescription", owner, task, description },
    { request },
  ]),
  then: actions([Task.updateTaskDescription, { task, description }]),
});

export const UpdateTaskDescriptionResponseSuccess: Sync = ({ request, task }) => ({
  when: actions(
    [Requesting.request, { path: "/Task/updateTaskDescription" }, { request }],
    [Task.updateTaskDescription, {}, { task }],
  ),
  then: actions([Requesting.respond, { request, task }]),
});

export const UpdateTaskDescriptionResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Task/updateTaskDescription" }, { request }],
    [Task.updateTaskDescription, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle deleteTask request with session
 * Requires authentication AND ownership verification - user can only delete their own tasks.
 */
export const DeleteTaskRequestWithSession: Sync = ({ request, session, user, task, owner }) => ({
  when: actions([
    Requesting.request,
    { path: "/Task/deleteTask", session, task },
    { request },
  ]),
  where: async (frames: Frames) => {
    // First verify session and get the authenticated user
    let authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    // Then verify ownership by getting the task's owner
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const taskValue = frame[task] as string;
      const taskData = await Task._getTask({ task: taskValue });
      
      if (!taskData) {
        // Task doesn't exist - skip this frame (will result in error)
        continue;
      }
      
      // Check if the authenticated user owns this task
      if (taskData.owner === frame[user]) {
        results.push({ ...frame, owner: taskData.owner });
      }
      // If not owner, skip this frame (unauthorized)
    }
    return results;
  },
  then: actions([Task.deleteTask, { task }]),
});

/**
 * Sync: Handle deleteTask request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const DeleteTaskRequestWithOwner: Sync = ({ request, owner, task }) => ({
  when: actions([
    Requesting.request,
    { path: "/Task/deleteTask", owner, task },
    { request },
  ]),
  then: actions([Task.deleteTask, { task }]),
});

export const DeleteTaskResponseSuccess: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Task/deleteTask" }, { request }],
    [Task.deleteTask, {}, {}],
  ),
  then: actions([Requesting.respond, { request, status: "deleted" }]),
});

export const DeleteTaskResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Task/deleteTask" }, { request }],
    [Task.deleteTask, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getTask request
 * Can be called with or without authentication.
 * Returns task information by ID.
 */
export const GetTaskRequest: Sync = ({ request, task, taskData }) => ({
  when: actions([
    Requesting.request,
    { path: "/Task/_getTask", task },
    { request },
  ]),
  where: async (frames: Frames) => {
    const results: Frames = new Frames();
    for (const frame of frames) {
      const taskValue = frame[task] as string;
      const taskResult = await Task._getTask({ task: taskValue });
      
      const newFrame = { ...frame };
      newFrame[taskData] = taskResult;
      results.push(newFrame);
    }
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, task: taskData }]),
});

/**
 * Sync: Handle _getTasks request with session
 * Requires authentication - user can only see their own tasks.
 */
export const GetTasksRequestWithSession: Sync = ({ request, session, user, tasks }) => ({
  when: actions([
    Requesting.request,
    { path: "/Task/_getTasks", session },
    { request },
  ]),
  where: async (frames: Frames) => {
    // Verify session and get the authenticated user (who is the owner)
    const authenticatedFrames = await frames.query(Sessioning._getUser, { session }, { user });
    
    const results: Frames = new Frames();
    for (const frame of authenticatedFrames) {
      const ownerValue = frame[user] as string;
      const tasksArray = await Task._getTasks({ owner: ownerValue });
      
      const newFrame = { ...frame };
      newFrame[tasks] = tasksArray;
      results.push(newFrame);
    }
    return results.length > 0 ? results : authenticatedFrames;
  },
  then: actions([Requesting.respond, { request, tasks }]),
});

/**
 * Sync: Handle _getTasks request with owner (backward compatibility)
 * Accepts owner directly for backward compatibility.
 */
export const GetTasksRequestWithOwner: Sync = ({ request, owner, tasks }) => ({
  when: actions([
    Requesting.request,
    { path: "/Task/_getTasks", owner },
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
      
      const tasksArray = await Task._getTasks({ owner: ownerValue });
      newFrame[tasks] = tasksArray;
      results.push(newFrame);
    }
    
    return results.length > 0 ? results : frames;
  },
  then: actions([Requesting.respond, { request, tasks }]),
});

