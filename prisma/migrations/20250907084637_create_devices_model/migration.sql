-- CreateTable
CREATE TABLE "public"."Devices" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Devices_pkey" PRIMARY KEY ("id")
);
