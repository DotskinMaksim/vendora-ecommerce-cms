-- Создание функции триггера
CREATE OR REPLACE FUNCTION set_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- Если статус изменился, обновляем timestamp
    IF NEW.status_id IS DISTINCT FROM OLD.status_id THEN
        NEW.status_set_at := CURRENT_TIMESTAMP;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Удаляем триггер, если он уже существует
DROP TRIGGER IF EXISTS trg_update_status_timestamp ON users;

-- Создаём триггер, который срабатывает перед UPDATE
CREATE TRIGGER trg_update_status_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_status_timestamp();