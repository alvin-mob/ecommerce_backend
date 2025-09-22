/*
  Warnings:

  - Added the required column `status` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `status` ENUM('PENDING', 'ACCEPTED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL;
