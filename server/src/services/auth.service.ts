import type { MikroORM } from "@mikro-orm/postgresql";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { createUser, getUserByEmail } from "../repositories/user.repository.js";

export const registerUser = async (orm: MikroORM, data: RegisterInput) => {
  const passwordHash = await hashPassword(data.password);

  return createUser(orm, {
    name: data.name,
    email: data.email,
    passwordHash,
  });
};

export const loginUser = async (orm: MikroORM, data: LoginInput) => {
  const user = await getUserByEmail(orm, data.email);
  if (!user || user.passwordHash === null) {
    return null;
  }
  const isPasswordValid = await verifyPassword(
    user.passwordHash,
    data.password,
  );

  if (!isPasswordValid) {
    return null;
  }
  return user;
};
