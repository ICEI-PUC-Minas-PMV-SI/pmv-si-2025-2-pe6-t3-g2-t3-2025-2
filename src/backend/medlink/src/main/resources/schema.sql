create table users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);

INSERT INTO users (id, username, password, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'admin', '$2a$10$KFgX/rpy3051NAoVuoR.p.0hubEFc6d7STkuozegkMZitEqQvJkly', 'ADMIN'),
    ('550e8400-e29b-41d4-a716-446655440001', 'paciente1', '$2a$10$KFgX/rpy3051NAoVuoR.p.0hubEFc6d7STkuozegkMZitEqQvJkly', 'PACIENTE'),
    ('550e8400-e29b-41d4-a716-446655440002', 'paciente2', '$2a$10$KFgX/rpy3051NAoVuoR.p.0hubEFc6d7STkuozegkMZitEqQvJkly', 'PACIENTE'),
    ('550e8400-e29b-41d4-a716-446655440003', 'medico', '$2a$10$KFgX/rpy3051NAoVuoR.p.0hubEFc6d7STkuozegkMZitEqQvJkly', 'MEDICO');
