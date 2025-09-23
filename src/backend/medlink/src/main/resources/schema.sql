create table tb_user (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);