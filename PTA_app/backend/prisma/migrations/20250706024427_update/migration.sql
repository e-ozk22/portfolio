-- DropForeignKey
ALTER TABLE `EventApplication` DROP FOREIGN KEY `EventApplication_slotId_fkey`;

-- DropIndex
DROP INDEX `EventApplication_slotId_fkey` ON `EventApplication`;

-- AlterTable
ALTER TABLE `EventApplication` MODIFY `slotId` CHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `EventApplication` ADD CONSTRAINT `EventApplication_slotId_fkey` FOREIGN KEY (`slotId`) REFERENCES `EventSlot`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
