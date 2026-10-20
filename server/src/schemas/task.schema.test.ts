import { describe, test, expect } from "@jest/globals";
import { createTaskSchema } from "./task.schema.js";

describe("Task validation", () => {
  test("should accept a valid task", () => {
    const task = {
      title: "Learn Jest",
      status: "todo",
      priority: "high",
    };

    const result = createTaskSchema.safeParse(task);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual(task);
    }
  });
  test("should reject an empty title", () => {
    const task = {
      title: "",
      status: "todo",
      priority: "medium",
    };

    const result = createTaskSchema.safeParse(task);

    expect(result.success).toBe(false);
  });
  test("should reject an invalid priority", () => {
    const task = {
      title: "Learn Jest",
      status: "todo",
      priority: "urgent",
    };
    const result = createTaskSchema.safeParse(task);

    expect(result.success).toBe(false);
  });
  test("should reject an invalid status", () => {
    const task = {
      title: "Learn Jest",
      status: "check",
      priority: "low",
    };
    const result = createTaskSchema.safeParse(task);

    expect(result.success).toBe(false);
  });
});
