import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

export const users = async (prisma: PrismaClient) => {
  console.log("Usersテーブルにseedデータ挿入中...");

  await prisma.user.deleteMany();

  const hashOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  };

  const createUsers = [];
  for (let i = 1; i <= 10; i++) {
    const username = `admin${i}`;
    const password = `password${i}`;

    const hashedPassword = await argon2.hash(password, hashOptions);

    createUsers.push(
      prisma.user.create({
        data: {
          username: username,
          password_hash: hashedPassword,
        },
      })
    );
  }

  await Promise.all(createUsers);
};
