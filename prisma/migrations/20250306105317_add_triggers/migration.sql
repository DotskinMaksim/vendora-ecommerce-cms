/*
  Пример: prisma/migrations/20250307_add_triggers/migration.sql
*/

/* 
  Если нужно — можно добавить какие-то INSERT, 
  но обычно основные "системные" INSERT мы делаем в seed.ts.
*/

/*
  ------------------------
   ТРИГГЕРЫ И ФУНКЦИИ
  ------------------------
*/

CREATE OR REPLACE FUNCTION set_default_status()
RETURNS trigger AS $$
DECLARE
entity_id_val  int;
    default_status int;
BEGIN
    -- Если статус уже указан, ничего не делаем
    IF NEW.status_id IS NOT NULL THEN
        RETURN NEW;
END IF;
    
    -- Получаем id сущности из таблицы entities,
    -- имя сущности передаётся в виде первого аргумента триггера (TG_ARGV[0])
SELECT id INTO entity_id_val FROM entities WHERE name = TG_ARGV[0];
IF NOT FOUND THEN
        RAISE EXCEPTION 'Entity "%" not found in table entities', TG_ARGV[0];
END IF;
    
    -- Находим для этой сущности дефолтный статус из таблицы default_statuses.
    -- Если в default_statuses может быть несколько записей, берем первую.
SELECT status_id INTO default_status
FROM default_statuses
WHERE entity_id = entity_id_val
    LIMIT 1;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Default status for entity "%" (id=%) not defined in default_statuses', TG_ARGV[0], entity_id_val;
END IF;
    
    NEW.status_id := default_status;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_default_status_users
    BEFORE INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_default_status('user');

CREATE TRIGGER trg_set_default_status_products
    BEFORE INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION set_default_status('product');

CREATE TRIGGER trg_set_default_status_orders
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_default_status('order');


CREATE OR REPLACE FUNCTION log_audit_trigger()
RETURNS trigger AS $$
DECLARE
v_changes jsonb;
    v_entity_type int;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        v_changes := to_jsonb(OLD);
    ELSIF (TG_OP = 'UPDATE') THEN
        v_changes := jsonb_build_object(
            'old', to_jsonb(OLD),
            'new', to_jsonb(NEW)
        );
ELSE  -- INSERT
        v_changes := to_jsonb(NEW);
END IF;
    
    -- Определяем идентификатор сущности (entity_type_id) по имени таблицы.
SELECT id INTO v_entity_type
FROM entities
WHERE name = TG_TABLE_NAME
    LIMIT 1;

-- Записываем информацию в audit_logs.
INSERT INTO audit_logs (
    user_id,
    action,
    ip_address,
    created_at,
    changes,
    entity_type_id,
    entity_id
)
VALUES (
           COALESCE(current_setting('audit.current_user_id', true)::int, NULL),
           TG_OP,
           inet_client_addr(),
           CURRENT_TIMESTAMP,
           v_changes,
           v_entity_type,
           CASE
               WHEN TG_OP = 'DELETE' THEN OLD.id
               ELSE NEW.id
               END
       );

RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW
    EXECUTE FUNCTION log_audit_trigger();

CREATE TRIGGER audit_products_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION log_audit_trigger();

CREATE TRIGGER audit_orders_trigger
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION log_audit_trigger();



CREATE OR REPLACE FUNCTION enforce_single_default_variant()
RETURNS TRIGGER AS $$
BEGIN
    -- Если новый вариант назначается дефолтным
    IF NEW.is_default = TRUE THEN
UPDATE product_variants
SET is_default = FALSE
WHERE product_id = NEW.product_id
  AND id != NEW.id;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_single_default_variant
    BEFORE INSERT OR UPDATE ON product_variants
                         FOR EACH ROW
                         EXECUTE FUNCTION enforce_single_default_variant();