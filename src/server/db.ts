import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool(
  connectionString
    ? { connectionString }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'innovate_ai_db',
      }
);

// Database initialization check & schema structure setup
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    console.log('[PostgreSQL] Successfully connected to database pool.');
    
    // Create core tables if they do not exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS members (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(32) NOT NULL DEFAULT 'MEMBER',
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        avatar_url TEXT,
        title VARCHAR(150),
        points INT DEFAULT 0,
        rank INT DEFAULT 99,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS teams (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        slug VARCHAR(150) UNIQUE NOT NULL,
        description TEXT,
        lead_id VARCHAR(64),
        member_count INT DEFAULT 0,
        category VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        event_date VARCHAR(50),
        event_time VARCHAR(50),
        location VARCHAR(200),
        speaker VARCHAR(150),
        capacity INT DEFAULT 100,
        registered_count INT DEFAULT 0,
        category VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS event_registrations (
        id VARCHAR(64) PRIMARY KEY,
        event_id VARCHAR(64) REFERENCES events(id),
        email VARCHAR(255) NOT NULL,
        registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_event_registration UNIQUE (event_id, email)
      );

      CREATE TABLE IF NOT EXISTS applicants (
        applicant_id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        arabic_first_name VARCHAR(100) NOT NULL,
        arabic_last_name VARCHAR(100) NOT NULL,
        english_first_name VARCHAR(100) NOT NULL,
        english_last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        whatsapp_phone VARCHAR(50) NOT NULL,
        national_id VARCHAR(50) NOT NULL,
        university VARCHAR(150) NOT NULL,
        academic_year VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        arabic_address TEXT NOT NULL,
        linkedin TEXT,
        motivation TEXT NOT NULL,
        status VARCHAR(32) DEFAULT 'PENDING',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed initial demo data if empty
    const teamCheck = await client.query('SELECT COUNT(*) FROM teams');
    if (parseInt(teamCheck.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO teams (id, name, slug, description, member_count, category) VALUES
        ('team_ai', 'Generative AI Research', 'generative-ai-research', 'Pushing state-of-the-art LLMs, multimodal architectures, and local model fine-tuning.', 42, 'AI_RESEARCH'),
        ('team_eng', 'Core Engineering & Platform', 'core-engineering', 'Building robust full-stack community infrastructure, high-throughput APIs, and automation pipelines.', 38, 'ENGINEERING'),
        ('team_prod', 'Product & Design Systems', 'product-design', 'Crafting Swiss Editorial user experiences, accessible design tokens, and human-AI interaction patterns.', 25, 'DESIGN');
      `);
    }

    const eventCheck = await client.query('SELECT COUNT(*) FROM events');
    if (parseInt(eventCheck.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO events (id, title, description, event_date, event_time, location, speaker, capacity, registered_count, category) VALUES
        ('evt_1', 'Next-Gen LLM Agents & Multi-Step Reasoning', 'Deep dive into agentic loops, tool calling architectures, and self-correcting generation models.', '2026-03-25', '18:00 UTC', 'Auditorium A & Live Stream', 'Dr. Elena Rostova', 250, 184, 'WORKSHOP'),
        ('evt_2', 'Ethical AI & Constitutional Alignment', 'Exploring safety boundaries, prompt hardening, and data privacy in academic research labs.', '2026-04-02', '17:30 UTC', 'Main Tech Hall', 'Prof. Marcus Vance', 180, 112, 'SEMINAR');
      `);
    }

    client.release();
    console.log('[PostgreSQL] Database schema initialized and seeded successfully.');
  } catch (err: any) {
    console.warn('[PostgreSQL] Database connection notice:', err.message || err);
    console.warn('[PostgreSQL] Operating in mock-fallback / offline storage mode until database is provisioned.');
  }
}
