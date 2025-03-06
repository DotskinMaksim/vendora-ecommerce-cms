-- Создание функции триггера
CREATE OR REPLACE FUNCTION set_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- При создании пользователя (INSERT) заполняем status_set_at
    IF TG_OP = 'INSERT' AND NEW.status_id IS NOT NULL THEN
        NEW.status_set_at := CURRENT_TIMESTAMP;
END IF;

    -- При изменении status_id обновляем status_set_at
    IF TG_OP = 'UPDATE' AND NEW.status_id IS DISTINCT FROM OLD.status_id THEN
        NEW.status_set_at := CURRENT_TIMESTAMP;
END IF;

RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Удаляем триггер, если он уже существует
DROP TRIGGER IF EXISTS trg_update_status_timestamp ON users;

-- Создаём триггер, который срабатывает перед INSERT и UPDATE
CREATE TRIGGER trg_update_status_timestamp
    BEFORE INSERT OR UPDATE ON users
                         FOR EACH ROW
                         EXECUTE FUNCTION set_status_timestamp();