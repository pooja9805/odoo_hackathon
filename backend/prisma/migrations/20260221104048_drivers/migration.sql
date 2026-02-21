-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `model` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `licensePlate` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `odometer` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Available',

    UNIQUE INDEX `Vehicle_licensePlate_key`(`licensePlate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Driver` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `licenseNumber` VARCHAR(191) NOT NULL,
    `licenseExpiry` DATETIME(3) NOT NULL,
    `completionRate` DOUBLE NOT NULL DEFAULT 0,
    `safetyScore` DOUBLE NOT NULL DEFAULT 0,
    `complaints` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'OnDuty',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cargo` INTEGER NOT NULL,
    `origin` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `distance` INTEGER NOT NULL,
    `estimatedFuel` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Draft',
    `revenue` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `vehicleId` INTEGER NOT NULL,
    `driverId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaintenanceLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `details` VARCHAR(191) NOT NULL,
    `cost` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `vehicleId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FuelLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `liters` INTEGER NOT NULL,
    `cost` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `vehicleId` INTEGER NOT NULL,
    `tripId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaintenanceLog` ADD CONSTRAINT `MaintenanceLog_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FuelLog` ADD CONSTRAINT `FuelLog_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
