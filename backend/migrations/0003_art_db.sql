-- 1. Mediums Table (Traditional works only)
CREATE TABLE mediums (
                         id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         name TEXT NOT NULL UNIQUE,
                         slug TEXT NOT NULL UNIQUE
);

-- 2. Collections Table (Digital works only)
CREATE TABLE collections (
                             id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                             name TEXT NOT NULL UNIQUE,
                             slug TEXT NOT NULL UNIQUE,
                             description TEXT,
                             cover_image TEXT -- Relative path to image
);

-- 3. Works Table
CREATE TABLE works (
                       id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                       title TEXT NOT NULL,
                       slug TEXT NOT NULL UNIQUE,
                       description TEXT,
                       year SMALLINT NOT NULL CHECK (year > 1800),
                       image TEXT,
    art_type TEXT NOT NULL CHECK (art_type IN ('digital', 'traditional')),

    -- Foreign Keys
    collection_id SMALLINT REFERENCES collections(id) ON DELETE RESTRICT,
    medium_id SMALLINT REFERENCES mediums(id) ON DELETE RESTRICT,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Rule 1: Enforce mutual exclusivity for Digital works
    CONSTRAINT digital_work_requirements CHECK (
        (art_type = 'digital' AND collection_id IS NOT NULL AND medium_id IS NULL) OR
        (art_type <> 'digital')
    ),

    -- Rule 2: Enforce mutual exclusivity for Traditional works
    CONSTRAINT traditional_work_requirements CHECK (
        (art_type = 'traditional' AND medium_id IS NOT NULL AND collection_id IS NULL) OR
        (art_type <> 'traditional')
    )
);

-- Indexing for performance
CREATE INDEX idx_works_art_type ON works(art_type);
CREATE INDEX idx_works_collection_id ON works(collection_id) WHERE collection_id IS NOT NULL;
CREATE INDEX idx_works_medium_id ON works(medium_id) WHERE medium_id IS NOT NULL;

-- Automated updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_works_updated_at
    BEFORE UPDATE ON works
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();