/*
  Warnings:

  - The primary key for the `default_statuses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `entityId` on the `default_statuses` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `default_statuses` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `users` table. All the data in the column will be lost.
  - Added the required column `entity_id` to the `default_statuses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_id` to the `default_statuses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "default_statuses" DROP CONSTRAINT "default_statuses_entityId_fkey";

-- DropForeignKey
ALTER TABLE "default_statuses" DROP CONSTRAINT "default_statuses_statusId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_statusId_fkey";

-- DropIndex
DROP INDEX "users_statusId_idx";

-- AlterTable
ALTER TABLE "default_statuses" DROP CONSTRAINT "default_statuses_pkey",
DROP COLUMN "entityId",
DROP COLUMN "statusId",
ADD COLUMN     "entity_id" INTEGER NOT NULL,
ADD COLUMN     "status_id" INTEGER NOT NULL,
ADD CONSTRAINT "default_statuses_pkey" PRIMARY KEY ("entity_id", "status_id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "statusId",
ADD COLUMN     "status_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "users_status_id_idx" ON "users"("status_id");

-- AddForeignKey
ALTER TABLE "default_statuses" ADD CONSTRAINT "default_statuses_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "default_statuses" ADD CONSTRAINT "default_statuses_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "statuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
