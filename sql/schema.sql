CREATE extension IF NOT EXISTS "uuid-ossp";

CREATE Table users (
    -- id SERIAL UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "username" VARCHAR(255) UNIQUE NOT NULL,
    "hash" VARCHAR(255) NOT NULL,
    "image_path" VARCHAR
);
