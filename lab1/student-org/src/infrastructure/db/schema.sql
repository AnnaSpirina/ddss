-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    study_group VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица студенческих организаций
CREATE TABLE IF NOT EXISTS student_organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manager_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица подписок студентов на организации
CREATE TABLE IF NOT EXISTS organization_subscriptions (
    student_id INTEGER REFERENCES users(id),
    organization_id INTEGER REFERENCES student_organizations(id),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, organization_id)
);

-- Таблица мероприятий
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES student_organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    qr_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица регистраций на мероприятия
CREATE TABLE IF NOT EXISTS event_registrations (
    student_id INTEGER REFERENCES users(id),
    event_id INTEGER REFERENCES events(id),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (student_id, event_id)
);

-- Таблица уведомлений
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);