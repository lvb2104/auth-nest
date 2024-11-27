-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Regular', 'Admin');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('CreateCoffin', 'UpdateCoffin', 'DeleteCoffin');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Regular',
    "permissions" "Permission"[] DEFAULT ARRAY[]::"Permission"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
