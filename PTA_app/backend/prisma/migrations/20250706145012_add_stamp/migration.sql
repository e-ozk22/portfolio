-- DropForeignKey
ALTER TABLE `EventApplication` DROP FOREIGN KEY `EventApplication_slotId_fkey`;

-- DropIndex
DROP INDEX `EventApplication_slotId_fkey` ON `EventApplication`;

-- AlterTable
ALTER TABLE `EventApplication` MODIFY `slotId` CHAR(36) NULL;

-- CreateTable
CREATE TABLE `Stamp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventApplication` ADD CONSTRAINT `EventApplication_slotId_fkey` FOREIGN KEY (`slotId`) REFERENCES `EventSlot`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
