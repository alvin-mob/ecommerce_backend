/*
  Warnings:

  - You are about to drop the column `line1` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `line2` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `lineOne` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `addresses` DROP COLUMN `line1`,
    DROP COLUMN `line2`,
    ADD COLUMN `lineOne` VARCHAR(191) NOT NULL,
    ADD COLUMN `lineTwo` VARCHAR(191) NULL;
