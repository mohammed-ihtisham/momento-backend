import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import TaskChecklistConcept from "./TaskChecklistConcept.ts";

const ownerA = "user:Alice" as ID;
const task1 = "task:1" as ID;
const task2 = "task:2" as ID;
const task3 = "task:3" as ID;

Deno.test(
  "Principle: User adds tasks, marks them complete, checklist reflects completion status",
  async () => {
    const [db, client] = await testDb();
    const checklistConcept = new TaskChecklistConcept(db);

    try {
      // 1. User adds tasks to checklist
      const add1 = await checklistConcept.addTask({
        owner: ownerA,
        task: task1,
      });
      assertNotEquals("error" in add1, true, "Adding task 1 should not fail.");
      const { entry: entry1 } = add1 as { entry: ID };

      const add2 = await checklistConcept.addTask({
        owner: ownerA,
        task: task2,
      });
      assertNotEquals("error" in add2, true, "Adding task 2 should not fail.");

      // 2. User marks tasks as complete
      const markComplete = await checklistConcept.markComplete({
        owner: ownerA,
        task: task1,
      });
      assertEquals(
        "error" in markComplete,
        false,
        "Marking complete should succeed."
      );

      // 3. Checklist reflects completion status
      const checklist = await checklistConcept._getChecklist({ owner: ownerA });
      assertEquals(checklist.length, 2, "Should have 2 entries.");

      const entry1Data = checklist.find((e) => e.task === task1);
      assertExists(entry1Data, "Entry 1 should exist.");
      assertEquals(entry1Data.completed, true, "Task 1 should be completed.");

      const entry2Data = checklist.find((e) => e.task === task2);
      assertExists(entry2Data, "Entry 2 should exist.");
      assertEquals(entry2Data.completed, false, "Task 2 should be incomplete.");

      // Check completed tasks
      const completed = await checklistConcept._getCompletedTasks({
        owner: ownerA,
      });
      assertEquals(completed.length, 1, "Should have 1 completed task.");
      assertEquals(completed[0], task1, "Completed task should be task1.");

      // Check incomplete tasks
      const incomplete = await checklistConcept._getIncompleteTasks({
        owner: ownerA,
      });
      assertEquals(incomplete.length, 1, "Should have 1 incomplete task.");
      assertEquals(incomplete[0], task2, "Incomplete task should be task2.");
    } finally {
      await client.close();
    }
  }
);

Deno.test(
  "Action: addTask requires no existing entry for owner+task",
  async () => {
    const [db, client] = await testDb();
    const checklistConcept = new TaskChecklistConcept(db);

    try {
      // First addition should succeed
      const firstResult = await checklistConcept.addTask({
        owner: ownerA,
        task: task1,
      });
      assertEquals(
        "error" in firstResult,
        false,
        "First addition should succeed."
      );

      // Duplicate addition should fail
      const duplicateResult = await checklistConcept.addTask({
        owner: ownerA,
        task: task1,
      });
      assertEquals(
        "error" in duplicateResult,
        true,
        "Adding duplicate entry should fail."
      );

      // New entries default to completed: false
      const entry = await checklistConcept._getChecklistEntry({
        owner: ownerA,
        task: task1,
      });
      assertEquals(entry, false, "New entry should be incomplete.");
    } finally {
      await client.close();
    }
  }
);

Deno.test(
  "Action: markComplete and markIncomplete require existing entry",
  async () => {
    const [db, client] = await testDb();
    const checklistConcept = new TaskChecklistConcept(db);

    try {
      // Mark complete without entry should fail
      const markCompleteResult = await checklistConcept.markComplete({
        owner: ownerA,
        task: task1,
      });
      assertEquals(
        "error" in markCompleteResult,
        true,
        "Marking complete without entry should fail."
      );

      // Add entry
      await checklistConcept.addTask({ owner: ownerA, task: task1 });

      // Mark complete should succeed
      const successComplete = await checklistConcept.markComplete({
        owner: ownerA,
        task: task1,
      });
      assertEquals(
        "error" in successComplete,
        false,
        "Marking complete should succeed."
      );

      // Verify completion
      const isComplete = await checklistConcept._getChecklistEntry({
        owner: ownerA,
        task: task1,
      });
      assertEquals(isComplete, true, "Task should be completed.");

      // Mark incomplete should succeed
      const successIncomplete = await checklistConcept.markIncomplete({
        owner: ownerA,
        task: task1,
      });
      assertEquals(
        "error" in successIncomplete,
        false,
        "Marking incomplete should succeed."
      );

      // Verify incompletion
      const isIncomplete = await checklistConcept._getChecklistEntry({
        owner: ownerA,
        task: task1,
      });
      assertEquals(isIncomplete, false, "Task should be incomplete.");
    } finally {
      await client.close();
    }
  }
);

Deno.test(
  "Query: _getCompletedTasks and _getIncompleteTasks filter correctly",
  async () => {
    const [db, client] = await testDb();
    const checklistConcept = new TaskChecklistConcept(db);

    try {
      // Add tasks
      await checklistConcept.addTask({ owner: ownerA, task: task1 });
      await checklistConcept.addTask({ owner: ownerA, task: task2 });
      await checklistConcept.addTask({ owner: ownerA, task: task3 });

      // Mark some as complete
      await checklistConcept.markComplete({ owner: ownerA, task: task1 });
      await checklistConcept.markComplete({ owner: ownerA, task: task2 });

      // Check completed
      const completed = await checklistConcept._getCompletedTasks({
        owner: ownerA,
      });
      assertEquals(completed.length, 2, "Should have 2 completed tasks.");
      assertEquals(completed.includes(task1), true, "Should include task1.");
      assertEquals(completed.includes(task2), true, "Should include task2.");

      // Check incomplete
      const incomplete = await checklistConcept._getIncompleteTasks({
        owner: ownerA,
      });
      assertEquals(incomplete.length, 1, "Should have 1 incomplete task.");
      assertEquals(incomplete[0], task3, "Should include task3.");
    } finally {
      await client.close();
    }
  }
);
