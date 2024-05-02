/*
  Warnings:

  - Added the required column `imagekitId` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Images" ADD COLUMN     "imagekitId" TEXT NOT NULL;
