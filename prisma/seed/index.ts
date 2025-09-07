import { PrismaClient } from "@prisma/client";
import { users } from ".//Users";
import { devices } from "./Devices";

const prisma = new PrismaClient();

async function main() {
  try {
    await users(prisma);
    await devices(prisma);

    console.log("シードデータの作成が完了しました");
  } catch (error) {
    console.error("シードエラー:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
