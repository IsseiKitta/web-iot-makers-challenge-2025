import { PrismaClient } from "@prisma/client";

export const devices = async (prisma: PrismaClient) => {
  console.log("Devicesテーブルにseedデータ挿入中...");

  await prisma.device.deleteMany();

  const deviceData = [
    {
      name: "パラソルA",
      isOpen: true,
      temperature: 23.5,
      humidity: 45.2,
      latitude: 35.6895,
      longitude: 139.6917, // 東京
      registeredAt: new Date("2025-01-15T08:30:00Z"),
    },
    {
      name: "パラソルB",
      isOpen: true,
      temperature: 18.2,
      humidity: 65.7,
      latitude: 34.6937,
      longitude: 135.5022, // 大阪
      registeredAt: new Date("2025-02-20T10:15:00Z"),
    },
    {
      name: "パラソルC",
      isOpen: false,
      temperature: 15.8,
      humidity: 52.3,
      latitude: 43.0618,
      longitude: 141.3545, // 札幌
      registeredAt: new Date("2025-03-05T14:45:00Z"),
    },
    {
      name: "パラソルD",
      isOpen: true,
      temperature: 22.0,
      humidity: 40.0,
      latitude: 33.5902,
      longitude: 130.4017, // 福岡
      registeredAt: new Date("2025-04-10T09:00:00Z"),
    },
    {
      name: "パラソルE",
      isOpen: true,
      temperature: 28.5,
      humidity: 80.5,
      latitude: 26.2124,
      longitude: 127.6809, // 沖縄
      registeredAt: new Date("2025-05-25T16:20:00Z"),
    },
  ];

  const createDevices = deviceData.map((data) =>
    prisma.device.create({
      data,
    })
  );

  await Promise.all(createDevices);
};
