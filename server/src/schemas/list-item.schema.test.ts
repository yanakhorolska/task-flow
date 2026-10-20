import { describe, test, expect } from "@jest/globals";

import { completionSchema, newListItemSchema } from "./list-item.schema.js";

describe("Goals and Wishlist validation", () => {
  test("should accept a valid list item", () => {
    const listItem = {
      title: "some list-item",
    };
    const result = newListItemSchema.safeParse(listItem);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual(listItem);
    }
  });
  test("should reject an empty item title", () => {
    const listItem = {
      title: "",
    };
    const result = newListItemSchema.safeParse(listItem);

    expect(result.success).toBe(false);
  });
  test("should reject a title longer than 200 characters", () => {
    const listItem = {
      title: "a".repeat(201),
    };
    const result = newListItemSchema.safeParse(listItem);

    expect(result.success).toBe(false);
  });
  test("should reject completed as a string", () => {
    const isCompleted = {
      completed: "true",
    };
    const result = completionSchema.safeParse(isCompleted);

    expect(result.success).toBe(false);
  });
});
