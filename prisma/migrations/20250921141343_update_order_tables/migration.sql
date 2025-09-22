/*
  Warnings:

  - You are about to drop the column `netAmount` on the `order_products` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `order_products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order_products` DROP COLUMN `netAmount`,
    DROP COLUMN `quantity`;
