/*
  Warnings:

  - You are about to drop the column `amount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `priceFormatted` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `subTotal` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "amount",
DROP COLUMN "priceFormatted",
DROP COLUMN "subTotal";
