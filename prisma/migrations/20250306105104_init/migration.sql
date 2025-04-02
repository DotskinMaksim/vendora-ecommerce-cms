-- CreateEnum
CREATE TYPE "enum_message_templates_type" AS ENUM ('email', 'sms');

-- CreateEnum
CREATE TYPE "enum_product_images_image_type" AS ENUM ('main', 'thumbnail', 'gallery', 'icon');

-- CreateEnum
CREATE TYPE "enum_order_addresses_type" AS ENUM ('billing', 'shipping');

-- CreateEnum
CREATE TYPE "enum_products_unit_type" AS ENUM ('piece', 'weight', 'volume', 'length', 'package', 'digital', 'service');

-- CreateEnum
CREATE TYPE "enum_promotions_discount_type" AS ENUM ('percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y');

-- CreateEnum
CREATE TYPE "enum_attributes_value_type" AS ENUM ('text', 'number');

-- CreateTable
CREATE TABLE "migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statuses" (
    "id" SERIAL NOT NULL,
    "entityId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#000000',
    "description" TEXT,

    CONSTRAINT "statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "default_statuses" (
    "entityId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "default_statuses_pkey" PRIMARY KEY ("entityId","statusId")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "password_hash" TEXT NOT NULL,
    "statusId" INTEGER NOT NULL,
    "status_set_at" TIMESTAMP(3),
    "status_set_until" TIMESTAMP(3),
    "status_set_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(3),
    "login_attempts" INTEGER NOT NULL DEFAULT 0,
    "email_verification_token" TEXT,
    "email_verification_expires" TIMESTAMP(3),
    "two_factor_auth_enable" BOOLEAN NOT NULL DEFAULT false,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone_code" TEXT,
    "phone_number" TEXT,
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "user_password_history" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "old_password_hash" TEXT NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,

    CONSTRAINT "user_password_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name_tx_id" INTEGER NOT NULL,
    "description_tx_id" INTEGER,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name_tx_id" INTEGER NOT NULL,
    "description_tx_id" INTEGER,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "unit_type" "enum_products_unit_type" NOT NULL,
    "unit_name_tx_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "name_tx_id" INTEGER NOT NULL,
    "description_tx_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_type" "enum_product_images_image_type" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_reviews" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "lang_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name_tx_id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tags" (
    "product_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "product_tags_pkey" PRIMARY KEY ("product_id","tag_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "parent_id" INTEGER,
    "name_tx_id" INTEGER NOT NULL,
    "sort_order" INTEGER DEFAULT 0,
    "for_adults_only" BOOLEAN NOT NULL DEFAULT false,
    "created_by" INTEGER,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "product_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("product_id","category_id")
);

-- CreateTable
CREATE TABLE "attributes" (
    "id" SERIAL NOT NULL,
    "name_tx_id" INTEGER NOT NULL,
    "value_type" "enum_attributes_value_type" NOT NULL,
    "created_by" INTEGER,

    CONSTRAINT "attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "available_quantity" DECIMAL(10,3) DEFAULT 0,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attributes" (
    "id" SERIAL NOT NULL,
    "product_variant_id" INTEGER NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "attribute_value" TEXT NOT NULL,
    "attribute_label_tx_id" INTEGER,
    "attribute_unit_type_tx_id" INTEGER,
    "is_variant" BOOLEAN NOT NULL DEFAULT false,
    "price_modifier" DECIMAL(10,2),

    CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address_id" INTEGER NOT NULL,
    "phone_code" TEXT,
    "phone_number" TEXT,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_stock" (
    "id" SERIAL NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "product_variant_id" INTEGER NOT NULL,
    "quantity_on_hand" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "reserved_quantity" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehouse_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shipping_method_id" INTEGER,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_usages" (
    "order_id" INTEGER NOT NULL,
    "promotion_id" INTEGER NOT NULL,

    CONSTRAINT "promotion_usages_pkey" PRIMARY KEY ("order_id","promotion_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "payment_method_id" INTEGER,
    "gateway_txn_id" TEXT,
    "payment_reference" TEXT,
    "amount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "error_message" TEXT,
    "gateway_response" TEXT,
    "config" JSONB,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" SERIAL NOT NULL,
    "config" JSONB,
    "status_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description_tx_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_methods" (
    "id" SERIAL NOT NULL,
    "name_tx_id" INTEGER NOT NULL,
    "description_tx_id" INTEGER,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "delivery_time_days" INTEGER NOT NULL DEFAULT 0,
    "status_id" INTEGER NOT NULL,

    CONSTRAINT "shipping_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "address_line1" TEXT NOT NULL,
    "address_line2" TEXT,
    "postal_code" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_addresses" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "type" "enum_order_addresses_type" NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "address_id" INTEGER NOT NULL,

    CONSTRAINT "order_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_variant_id" INTEGER NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL DEFAULT 1,
    "price_each" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "product_snapshot" JSONB,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_templates" (
    "id" SERIAL NOT NULL,
    "type" "enum_message_templates_type" NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "variables" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "session_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_variant_id" INTEGER NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" TEXT NOT NULL,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changes" JSONB,
    "entity_type_id" INTEGER,
    "entity_id" INTEGER,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_logs" (
    "id" SERIAL NOT NULL,
    "error_message" TEXT NOT NULL,
    "error_code" TEXT NOT NULL,
    "file" TEXT,
    "line" INTEGER,
    "stacktrace" TEXT,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_views" (
    "id" SERIAL NOT NULL,
    "page_url" TEXT NOT NULL,
    "user_id" INTEGER,
    "visitor_ip" TEXT NOT NULL,
    "referrer" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_metrics" (
    "id" SERIAL NOT NULL,
    "metric_name" TEXT NOT NULL,
    "metric_value" DECIMAL(10,2) NOT NULL,
    "measured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversion_events" (
    "id" SERIAL NOT NULL,
    "event_name_tx_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "details_tx_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversion_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "key" TEXT NOT NULL,
    "value" TEXT,
    "description" TEXT,
    "label" TEXT NOT NULL,
    "last_set_by" INTEGER,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "langs" (
    "id" SERIAL NOT NULL,
    "lang_code" TEXT NOT NULL,
    "lang_flag_image_url" TEXT,

    CONSTRAINT "langs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" INTEGER NOT NULL,
    "lang_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id","lang_id")
);

-- CreateTable
CREATE TABLE "promotions" (
    "id" SERIAL NOT NULL,
    "name_tx_id" INTEGER NOT NULL,
    "description_tx_id" INTEGER,
    "promo_code" TEXT,
    "discount_type" "enum_promotions_discount_type" NOT NULL,
    "discount_value" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "min_order_amount" DECIMAL(10,2) DEFAULT 0.00,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "usage_limit" INTEGER,
    "times_used" INTEGER NOT NULL DEFAULT 0,
    "status_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_products" (
    "promotion_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "promotion_products_pkey" PRIMARY KEY ("promotion_id","product_id")
);

-- CreateTable
CREATE TABLE "promotion_categories" (
    "promotion_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "promotion_categories_pkey" PRIMARY KEY ("promotion_id","category_id")
);

-- CreateTable
CREATE TABLE "promotion_users" (
    "promotion_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "promotion_users_pkey" PRIMARY KEY ("promotion_id","user_id")
);

-- CreateTable
CREATE TABLE "user_wishlists" (
    "product_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_wishlists_pkey" PRIMARY KEY ("product_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "entities_name_key" ON "entities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "statuses_name_key" ON "statuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_statusId_idx" ON "users"("statusId");

-- CreateIndex
CREATE INDEX "users_phone_number_idx" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_status_id_idx" ON "products"("status_id");

-- CreateIndex
CREATE INDEX "products_created_at_idx" ON "products"("created_at");

-- CreateIndex
CREATE INDEX "products_name_tx_id_idx" ON "products"("name_tx_id");

-- CreateIndex
CREATE INDEX "products_price_idx" ON "products"("price");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_name_key" ON "warehouses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_email_key" ON "warehouses"("email");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_gateway_txn_id_key" ON "transactions"("gateway_txn_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_payment_reference_key" ON "transactions"("payment_reference");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_name_key" ON "payment_methods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "carts_session_id_key" ON "carts"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "settings_label_key" ON "settings"("label");

-- CreateIndex
CREATE UNIQUE INDEX "promotions_promo_code_key" ON "promotions"("promo_code");

-- AddForeignKey
ALTER TABLE "statuses" ADD CONSTRAINT "statuses_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "default_statuses" ADD CONSTRAINT "default_statuses_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "default_statuses" ADD CONSTRAINT "default_statuses_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "statuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_status_set_by_fkey" FOREIGN KEY ("status_set_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_password_history" ADD CONSTRAINT "user_password_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_lang_id_fkey" FOREIGN KEY ("lang_id") REFERENCES "langs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attributes" ADD CONSTRAINT "attributes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stock" ADD CONSTRAINT "warehouse_stock_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stock" ADD CONSTRAINT "warehouse_stock_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_method_id_fkey" FOREIGN KEY ("shipping_method_id") REFERENCES "shipping_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_usages" ADD CONSTRAINT "promotion_usages_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_usages" ADD CONSTRAINT "promotion_usages_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_methods" ADD CONSTRAINT "shipping_methods_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_addresses" ADD CONSTRAINT "order_addresses_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_addresses" ADD CONSTRAINT "order_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_logs" ADD CONSTRAINT "error_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversion_events" ADD CONSTRAINT "conversion_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_last_set_by_fkey" FOREIGN KEY ("last_set_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_lang_id_fkey" FOREIGN KEY ("lang_id") REFERENCES "langs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_products" ADD CONSTRAINT "promotion_products_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_products" ADD CONSTRAINT "promotion_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_categories" ADD CONSTRAINT "promotion_categories_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_categories" ADD CONSTRAINT "promotion_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_users" ADD CONSTRAINT "promotion_users_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_users" ADD CONSTRAINT "promotion_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_wishlists" ADD CONSTRAINT "user_wishlists_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_wishlists" ADD CONSTRAINT "user_wishlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
