import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import TaskConcept from "./TaskConcept.ts";

const ownerA = "user:Alice" as ID;
const ownerB = "user:Bob" as ID;

Deno.test("Principle: User creates task, can later retrieve, update, or delete", async () => {
  const [db, client] = await testDb();
  const taskConcept = new TaskConcept(db);

  try {
    // 1. User creates a task
    const createResult = await taskConcept.createTask({
      owner: ownerA,
      description: "Complete project documentation",
    });
    assertNotEquals(
      "error" in createResult,
      true,
      "Task creation should not fail.",
    );
    const { task } = createResult as { task: ID };
    assertExists(task);

    // 2. User can retrieve the task
    const taskData = await taskConcept._getTask({ task });
    assertExists(taskData, "Task should exist.");
    assertEquals(
      taskData.description,
      "Complete project documentation",
      "Description should match.",
    );

    // 3. User can update the task
    const updateResult = await taskConcept.updateTaskDescription({
      task,
      description: "Complete project documentation and testing",
    });
    assertEquals("error" in updateResult, false, "Update should succeed.");

    const updatedTask = await taskConcept._getTask({ task });
    assertEquals(
      updatedTask?.description,
      "Complete project documentation and testing",
      "Description should be updated.",
    );

    // 4. User can delete the task
    const deleteResult = await taskConcept.deleteTask({ task });
    assertEquals("error" in deleteResult, false, "Delete should succeed.");

    const deletedTask = await taskConcept._getTask({ task });
    assertEquals(deletedTask, null, "Task should be deleted.");
  } finally {
    await client.close();
  }
});

Deno.test("Action: createTask requires non-empty description", async () => {
  const [db, client] = await testDb();
  const taskConcept = new TaskConcept(db);

  try {
    // Empty description should fail
    const emptyResult = await taskConcept.createTask({
      owner: ownerA,
      description: "",
    });
    assertEquals(
      "error" in emptyResult,
      true,
      "Creating task with empty description should fail.",
    );

    // Whitespace-only should fail
    const whitespaceResult = await taskConcept.createTask({
      owner: ownerA,
      description: "   ",
    });
    assertEquals(
      "error" in whitespaceResult,
      true,
      "Creating task with whitespace-only description should fail.",
    );

    // Valid description should succeed
    const validResult = await taskConcept.createTask({
      owner: ownerA,
      description: "Valid task description",
    });
    assertEquals(
      "error" in validResult,
      false,
      "Creating task with valid description should succeed.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: updateTaskDescription requires existing task", async () => {
  const [db, client] = await testDb();
  const taskConcept = new TaskConcept(db);

  try {
    // Update non-existent task should fail
    const updateResult = await taskConcept.updateTaskDescription({
      task: "task:fake" as ID,
      description: "New description",
    });
    assertEquals(
      "error" in updateResult,
      true,
      "Updating non-existent task should fail.",
    );

    // Create task
    const { task } = (await taskConcept.createTask({
      owner: ownerA,
      description: "Original description",
    })) as { task: ID };

    // Update should succeed
    const successResult = await taskConcept.updateTaskDescription({
      task,
      description: "Updated description",
    });
    assertEquals(
      "error" in successResult,
      false,
      "Updating existing task should succeed.",
    );

    // Verify update
    const updatedTask = await taskConcept._getTask({ task });
    assertEquals(
      updatedTask?.description,
      "Updated description",
      "Description should be updated.",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getTasks returns all tasks for owner", async () => {
  const [db, client] = await testDb();
  const taskConcept = new TaskConcept(db);

  try {
    await taskConcept.createTask({
      owner: ownerA,
      description: "Task 1",
    });
    await taskConcept.createTask({
      owner: ownerA,
      description: "Task 2",
    });
    await taskConcept.createTask({
      owner: ownerB,
      description: "Task 3",
    });

    const tasksA = await taskConcept._getTasks({ owner: ownerA });
    assertEquals(tasksA.length, 2, "Should return 2 tasks for owner A.");
    assertEquals(
      tasksA.some((t) => t.description === "Task 1"),
      true,
      "Should include Task 1.",
    );
    assertEquals(
      tasksA.some((t) => t.description === "Task 2"),
      true,
      "Should include Task 2.",
    );

    const tasksB = await taskConcept._getTasks({ owner: ownerB });
    assertEquals(tasksB.length, 1, "Should return 1 task for owner B.");
  } finally {
    await client.close();
  }
});

