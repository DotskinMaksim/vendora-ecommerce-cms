/*
  Warnings:

  - You are about to drop the column `entityId` on the `statuses` table. All the data in the column will be lost.
  - Added the required column `entity_id` to the `statuses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "statuses" DROP CONSTRAINT "statuses_entityId_fkey";

-- AlterTable
ALTER TABLE "statuses" DROP COLUMN "entityId",
ADD COLUMN     "entity_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "statuses" ADD CONSTRAINT "statuses_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
