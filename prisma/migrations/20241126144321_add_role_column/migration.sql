-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Regular', 'Admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Regular';
