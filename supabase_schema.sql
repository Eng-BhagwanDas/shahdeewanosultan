-- Supabase (PostgreSQL) Schema for ShahDeeewanoSultan
-- Run this in the Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Slider Table
CREATE TABLE IF NOT EXISTS slider (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255),
    "imageUrl" TEXT,
    "order" INT DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Saints Table
CREATE TABLE IF NOT EXISTS saints (
    "autoId" SERIAL PRIMARY KEY,
    id VARCHAR(100),
    language VARCHAR(10) NOT NULL,
    name VARCHAR(255),
    title VARCHAR(255),
    content TEXT,
    biography TEXT,
    "imageUrl" TEXT,
    "order" INT DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (id, language)
);

-- Books Table
CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(50) PRIMARY KEY,
    language VARCHAR(10) NOT NULL,
    title VARCHAR(255),
    author VARCHAR(255),
    description TEXT,
    "pdfUrl" TEXT,
    "imageUrl" TEXT,
    category VARCHAR(100),
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Audio Table
CREATE TABLE IF NOT EXISTS audio (
    id VARCHAR(50) PRIMARY KEY,
    language VARCHAR(10) NOT NULL,
    title VARCHAR(255),
    artist VARCHAR(255),
    category VARCHAR(50), -- hamd, naat, dua
    "audioUrl" TEXT,
    "thumbnailUrl" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Videos Table
CREATE TABLE IF NOT EXISTS videos (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255),
    "videoUrl" TEXT,
    "thumbnailUrl" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(50) PRIMARY KEY,
    language VARCHAR(10) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    date DATE,
    location VARCHAR(255),
    "imageUrl" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- News Table
CREATE TABLE IF NOT EXISTS news (
    id VARCHAR(50) PRIMARY KEY,
    language VARCHAR(10) NOT NULL,
    title VARCHAR(255),
    content TEXT,
    date TIMESTAMPTZ DEFAULT NOW(),
    "imageUrl" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255),
    "imageUrl" TEXT,
    category VARCHAR(100),
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Poetry Table
CREATE TABLE IF NOT EXISTS poetry (
    id VARCHAR(50) PRIMARY KEY,
    language VARCHAR(10) NOT NULL,
    title VARCHAR(255),
    content TEXT,
    author VARCHAR(255),
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Content Table (Flexible content for pages)
CREATE TABLE IF NOT EXISTS content (
    "autoId" SERIAL PRIMARY KEY,
    id VARCHAR(50),
    "pageName" VARCHAR(100) NOT NULL,
    language VARCHAR(10) NOT NULL,
    data JSONB, -- PostgreSQL's efficient JSON storage
    "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE ("pageName", language)
);

-- Create function to automatically update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic updatedAt updates
CREATE TRIGGER update_slider_updated_at BEFORE UPDATE ON slider
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saints_updated_at BEFORE UPDATE ON saints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audio_updated_at BEFORE UPDATE ON audio
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON gallery
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_poetry_updated_at BEFORE UPDATE ON poetry
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saints_language ON saints(language);
CREATE INDEX IF NOT EXISTS idx_saints_order ON saints("order");
CREATE INDEX IF NOT EXISTS idx_books_language ON books(language);
CREATE INDEX IF NOT EXISTS idx_audio_language ON audio(language);
CREATE INDEX IF NOT EXISTS idx_audio_category ON audio(category);
CREATE INDEX IF NOT EXISTS idx_events_language ON events(language);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_news_language ON news(language);
CREATE INDEX IF NOT EXISTS idx_poetry_language ON poetry(language);
CREATE INDEX IF NOT EXISTS idx_content_page_lang ON content("pageName", language);

-- Enable Row Level Security (RLS) - Optional but recommended
-- For now, we'll disable RLS to allow full access via service role key
-- You can enable and configure RLS later for better security

ALTER TABLE slider ENABLE ROW LEVEL SECURITY;
ALTER TABLE saints ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE poetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (you can restrict these later)
CREATE POLICY "Allow all operations on slider" ON slider FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on saints" ON saints FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on books" ON books FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on audio" ON audio FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on videos" ON videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on news" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on poetry" ON poetry FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on content" ON content FOR ALL USING (true) WITH CHECK (true);
