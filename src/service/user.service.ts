// ユーザー関連のロジック

import { prisma } from "@/lib/prisma";
import { comparePasswords } from "@/utils/auth";

export const userService = {
  authenticate: async (username: string, password: string) => {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return null;

    const passwordMatch = await comparePasswords(password, user.password_hash);
    if (!passwordMatch) return null;

    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};
