import { connectDB } from "./db-connection.js";
import { hashPassword } from "./utils/password.js";

import {
  createUser,
  getUserByEmail,
  getUserWithTasks,
} from "./repositories/user.repository.js";

import { createTask } from "./repositories/task.repository.js";

const seed = async () => {
  const orm = await connectDB();

  try {
    const email = "test@example.com";

    // 1. Find or create a test user
    let user = await getUserByEmail(orm, email);

    if (!user) {
      const passwordHash = await hashPassword("TestPassword123!");

      user = await createUser(orm, {
        name: "Test User",
        email,
        passwordHash,
      });
    }

    if (!user) {
      throw new Error("Failed to create test user");
    }

    // 2. Check if the test task already exists
    const userWithTasks = await getUserWithTasks(orm, user.id);

    const taskExists = userWithTasks?.tasks.some(
      (task) => task.title === "Learn MikroORM Relationships",
    );

    // 3. Create task only if it doesn't exist
    if (!taskExists) {
      await createTask(
        orm,
        {
          title: "Learn MikroORM Relationships",
          status: "todo",
          priority: "medium",
        },
        user.id,
      );
    }

    // 4. Load and display user's tasks
    const result = await getUserWithTasks(orm, user.id);

    console.log("Seed completed successfully!");
    console.log("User:", user.email);
    console.log(
      "Tasks:",
      result?.tasks.map((task) => task.title),
    );
  } finally {
    await orm.close();
  }
};

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
