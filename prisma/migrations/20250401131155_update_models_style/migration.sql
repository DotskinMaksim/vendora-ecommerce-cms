-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "setting_category_id" INTEGER;

-- CreateTable
CREATE TABLE "setting_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" INTEGER,

    CONSTRAINT "setting_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "setting_categories_name_key" ON "setting_categories"("name");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_setting_category_id_fkey" FOREIGN KEY ("setting_category_id") REFERENCES "setting_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setting_categories" ADD CONSTRAINT "setting_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "setting_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
