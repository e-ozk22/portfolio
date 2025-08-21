/*
  Warnings:

  - Made the column `firebaseUid` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `firebaseUid` VARCHAR(255) NOT NULL;
