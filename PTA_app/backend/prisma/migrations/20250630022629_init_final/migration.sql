/*
  Warnings:

  - You are about to drop the column `profileImageUrl` on the `Child` table. All the data in the column will be lost.
  - You are about to drop the column `grantedAt` on the `Privilege` table. All the data in the column will be lost.
  - You are about to drop the `RewardApplication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stamp` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `privilegeAllowed` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotId` to the `EventApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nurseryId` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rewardId` to the `Privilege` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nurseryId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `RewardApplication` DROP FOREIGN KEY `RewardApplication_rewardId_fkey`;

-- DropForeignKey
ALTER TABLE `RewardApplication` DROP FOREIGN KEY `RewardApplication_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Stamp` DROP FOREIGN KEY `Stamp_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `Stamp` DROP FOREIGN KEY `Stamp_fromUserId_fkey`;

-- DropForeignKey
ALTER TABLE `Stamp` DROP FOREIGN KEY `Stamp_toUserId_fkey`;

-- AlterTable
ALTER TABLE `Child` DROP COLUMN `profileImageUrl`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Event` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `endTime` DATETIME(3) NOT NULL,
    ADD COLUMN `location` VARCHAR(255) NOT NULL,
    ADD COLUMN `privilegeAllowed` BOOLEAN NOT NULL,
    ADD COLUMN `requiredItems` TEXT NULL,
    ADD COLUMN `specialNotes` TEXT NULL,
    ADD COLUMN `startTime` DATETIME(3) NOT NULL,
    MODIFY `capacity` INTEGER NULL;

-- AlterTable
ALTER TABLE `EventApplication` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `slotId` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `PaymentMethod` ADD COLUMN `nurseryId` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `Point` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Privilege` DROP COLUMN `grantedAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `exchangedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `rewardId` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `Reward` ADD COLUMN `capacity` INTEGER NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `User` ADD COLUMN `nurseryId` CHAR(36) NOT NULL,
    ADD COLUMN `profileImageUrl` VARCHAR(255) NULL;

-- DropTable
DROP TABLE `RewardApplication`;

-- DropTable
DROP TABLE `Stamp`;

-- CreateTable
CREATE TABLE `Nursery` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventSlot` (
    `id` CHAR(36) NOT NULL,
    `eventId` CHAR(36) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventReaction` (
    `id` CHAR(36) NOT NULL,
    `eventId` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `emoji` VARCHAR(10) NOT NULL,
    `reactedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_nurseryId_fkey` FOREIGN KEY (`nurseryId`) REFERENCES `Nursery`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventSlot` ADD CONSTRAINT `EventSlot_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventApplication` ADD CONSTRAINT `EventApplication_slotId_fkey` FOREIGN KEY (`slotId`) REFERENCES `EventSlot`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventReaction` ADD CONSTRAINT `EventReaction_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventReaction` ADD CONSTRAINT `EventReaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Privilege` ADD CONSTRAINT `Privilege_rewardId_fkey` FOREIGN KEY (`rewardId`) REFERENCES `Reward`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentMethod` ADD CONSTRAINT `PaymentMethod_nurseryId_fkey` FOREIGN KEY (`nurseryId`) REFERENCES `Nursery`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
