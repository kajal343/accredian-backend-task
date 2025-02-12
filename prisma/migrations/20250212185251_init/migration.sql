-- DropIndex
DROP INDEX `User_referredBy_fkey` ON `user`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_referredBy_fkey` FOREIGN KEY (`referredBy`) REFERENCES `User`(`referralCode`) ON DELETE SET NULL ON UPDATE CASCADE;
