-- CreateTable
CREATE TABLE `apicollections` (
    `ApiID` INTEGER NOT NULL,
    `CollectionID` INTEGER NOT NULL,

    INDEX `CollectionID`(`CollectionID`),
    PRIMARY KEY (`ApiID`, `CollectionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `apikeys` (
    `ApiKeyID` INTEGER NOT NULL AUTO_INCREMENT,
    `SubscriptionID` INTEGER NOT NULL,
    `ApiKey` VARCHAR(255) NOT NULL,
    `CreationDate` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `IsActive` BOOLEAN NULL DEFAULT true,

    UNIQUE INDEX `ApiKey`(`ApiKey`),
    INDEX `SubscriptionID`(`SubscriptionID`),
    PRIMARY KEY (`ApiKeyID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `apiratings` (
    `RatingID` INTEGER NOT NULL AUTO_INCREMENT,
    `ApiID` INTEGER NOT NULL,
    `UserID` INTEGER NOT NULL,
    `Rating` INTEGER NOT NULL,
    `Comment` TEXT NULL,
    `DateRated` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `ApiID`(`ApiID`),
    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`RatingID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `apis` (
    `ApiID` INTEGER NOT NULL AUTO_INCREMENT,
    `ProviderID` INTEGER NOT NULL,
    `Name` VARCHAR(255) NOT NULL,
    `ImagePath` VARCHAR(255) NULL,
    `Description` TEXT NULL,
    `CategoryID` INTEGER NULL,
    `DateCreated` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `LastUpdated` DATETIME(0) NULL,
    `IsActive` BOOLEAN NULL DEFAULT true,

    INDEX `CategoryID`(`CategoryID`),
    INDEX `ProviderID`(`ProviderID`),
    PRIMARY KEY (`ApiID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `apiversions` (
    `VersionID` INTEGER NOT NULL AUTO_INCREMENT,
    `ApiID` INTEGER NOT NULL,
    `VersionNumber` VARCHAR(255) NOT NULL,
    `ReleaseDate` DATETIME(0) NULL,
    `WhatsNew` VARCHAR(255) NULL,

    INDEX `ApiID`(`ApiID`),
    PRIMARY KEY (`VersionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `billinghistory` (
    `HistoryID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `InvoiceID` INTEGER NOT NULL,
    `PaymentDate` DATETIME(0) NULL,
    `Amount` DECIMAL(10, 2) NULL,

    INDEX `InvoiceID`(`InvoiceID`),
    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`HistoryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `CategoryID` INTEGER NOT NULL AUTO_INCREMENT,
    `CategoryName` VARCHAR(255) NOT NULL,
    `Description` TEXT NULL,

    PRIMARY KEY (`CategoryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `collections` (
    `CollectionID` INTEGER NOT NULL AUTO_INCREMENT,
    `CollectionName` VARCHAR(255) NOT NULL,
    `Description` TEXT NULL,
    `DateCreated` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `LastUpdated` DATETIME(0) NULL,

    PRIMARY KEY (`CollectionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `CommentID` INTEGER NOT NULL AUTO_INCREMENT,
    `PostID` INTEGER NOT NULL,
    `UserID` INTEGER NOT NULL,
    `CommentText` TEXT NOT NULL,
    `CommentDate` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `PostID`(`PostID`),
    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`CommentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `follows` (
    `FollowerID` INTEGER NOT NULL,
    `FollowingID` INTEGER NOT NULL,
    `FollowDate` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `FollowingID`(`FollowingID`),
    PRIMARY KEY (`FollowerID`, `FollowingID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invoices` (
    `InvoiceID` INTEGER NOT NULL AUTO_INCREMENT,
    `SubscriptionID` INTEGER NOT NULL,
    `TotalAmount` DECIMAL(10, 2) NULL,
    `DateIssued` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `DueDate` DATETIME(0) NULL,
    `Status` VARCHAR(50) NULL,

    INDEX `SubscriptionID`(`SubscriptionID`),
    PRIMARY KEY (`InvoiceID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paymentmethods` (
    `PaymentMethodID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `Provider` VARCHAR(255) NULL,
    `AccountDetails` TEXT NULL,
    `IsDefault` BOOLEAN NULL DEFAULT false,

    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`PaymentMethodID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plans` (
    `PlanID` INTEGER NOT NULL AUTO_INCREMENT,
    `PlanName` VARCHAR(255) NOT NULL,
    `Description` TEXT NULL,
    `Price` DECIMAL(10, 2) NULL,
    `Features` LONGTEXT NULL,

    PRIMARY KEY (`PlanID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `postlikes` (
    `PostID` INTEGER NOT NULL,
    `UserID` INTEGER NOT NULL,
    `LikeDate` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`PostID`, `UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `PostID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `PostData` LONGTEXT NULL,
    `PostedDate` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`PostID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `ProfileID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `FullName` VARCHAR(255) NULL,
    `Bio` TEXT NULL,
    `ProfilePicture` VARCHAR(255) NULL,
    `DateOfBirth` DATE NULL,
    `Location` VARCHAR(255) NULL,

    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`ProfileID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `SubscriptionID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `ApiID` INTEGER NOT NULL,
    `PlanID` INTEGER NOT NULL,
    `StartDate` DATETIME(0) NULL,
    `EndDate` DATETIME(0) NULL,
    `Status` VARCHAR(50) NULL,

    INDEX `ApiID`(`ApiID`),
    INDEX `PlanID`(`PlanID`),
    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`SubscriptionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `TransactionID` INTEGER NOT NULL AUTO_INCREMENT,
    `InvoiceID` INTEGER NOT NULL,
    `Amount` DECIMAL(10, 2) NULL,
    `TransactionDate` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `PaymentMethodID` INTEGER NULL,
    `Status` VARCHAR(50) NULL,

    INDEX `InvoiceID`(`InvoiceID`),
    INDEX `PaymentMethodID`(`PaymentMethodID`),
    PRIMARY KEY (`TransactionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usagelogs` (
    `LogID` INTEGER NOT NULL AUTO_INCREMENT,
    `SubscriptionID` INTEGER NOT NULL,
    `Timestamp` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Endpoint` VARCHAR(255) NULL,
    `DataVolume` INTEGER NULL,
    `ResponseTime` INTEGER NULL,

    INDEX `SubscriptionID`(`SubscriptionID`),
    PRIMARY KEY (`LogID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `Username` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `PasswordHash` CHAR(60) NULL,
    `DateCreated` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `LastLogin` DATETIME(0) NULL,
    `IsActive` BOOLEAN NULL DEFAULT true,
    `IsTwoFactor` BOOLEAN NULL DEFAULT false,
    `role` VARCHAR(50) NULL,
    `PhoneNumber` VARCHAR(20) NULL,
    `Verified` BOOLEAN NULL,

    UNIQUE INDEX `Email`(`Email`),
    UNIQUE INDEX `PhoneNumber`(`PhoneNumber`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `PermissionID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,
    `Description` TEXT NULL,

    PRIMARY KEY (`PermissionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `moderatorpermissions` (
    `ModeratorPermissionID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NULL,
    `PermissionID` INTEGER NULL,

    INDEX `PermissionID`(`PermissionID`),
    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`ModeratorPermissionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp_entries` (
    `otp_key` INTEGER NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `expiry` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`otp_key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `apicollections` ADD CONSTRAINT `apicollections_ibfk_1` FOREIGN KEY (`ApiID`) REFERENCES `apis`(`ApiID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `apicollections` ADD CONSTRAINT `apicollections_ibfk_2` FOREIGN KEY (`CollectionID`) REFERENCES `collections`(`CollectionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `apikeys` ADD CONSTRAINT `apikeys_ibfk_1` FOREIGN KEY (`SubscriptionID`) REFERENCES `subscriptions`(`SubscriptionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `apiratings` ADD CONSTRAINT `apiratings_ibfk_1` FOREIGN KEY (`ApiID`) REFERENCES `apis`(`ApiID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `apiratings` ADD CONSTRAINT `apiratings_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `apis` ADD CONSTRAINT `apis_ibfk_1` FOREIGN KEY (`ProviderID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `apis` ADD CONSTRAINT `apis_ibfk_2` FOREIGN KEY (`CategoryID`) REFERENCES `categories`(`CategoryID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `apiversions` ADD CONSTRAINT `apiversions_ibfk_1` FOREIGN KEY (`ApiID`) REFERENCES `apis`(`ApiID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `billinghistory` ADD CONSTRAINT `billinghistory_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `billinghistory` ADD CONSTRAINT `billinghistory_ibfk_2` FOREIGN KEY (`InvoiceID`) REFERENCES `invoices`(`InvoiceID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`PostID`) REFERENCES `posts`(`PostID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`FollowerID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`FollowingID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`SubscriptionID`) REFERENCES `subscriptions`(`SubscriptionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `paymentmethods` ADD CONSTRAINT `paymentmethods_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `postlikes` ADD CONSTRAINT `postlikes_ibfk_1` FOREIGN KEY (`PostID`) REFERENCES `posts`(`PostID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `postlikes` ADD CONSTRAINT `postlikes_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_ibfk_2` FOREIGN KEY (`ApiID`) REFERENCES `apis`(`ApiID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_ibfk_3` FOREIGN KEY (`PlanID`) REFERENCES `plans`(`PlanID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`InvoiceID`) REFERENCES `invoices`(`InvoiceID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`PaymentMethodID`) REFERENCES `paymentmethods`(`PaymentMethodID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usagelogs` ADD CONSTRAINT `usagelogs_ibfk_1` FOREIGN KEY (`SubscriptionID`) REFERENCES `subscriptions`(`SubscriptionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `moderatorpermissions` ADD CONSTRAINT `moderatorpermissions_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `moderatorpermissions` ADD CONSTRAINT `moderatorpermissions_ibfk_2` FOREIGN KEY (`PermissionID`) REFERENCES `permissions`(`PermissionID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
