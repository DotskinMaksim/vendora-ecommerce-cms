/*
  Warnings:

  - You are about to drop the column `reserved_quantity` on the `warehouse_stock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "reference" TEXT;

-- AlterTable
ALTER TABLE "warehouse_stock" DROP COLUMN "reserved_quantity",
ADD COLUMN     "warehouse_location" TEXT;
