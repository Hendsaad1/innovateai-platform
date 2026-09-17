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

      CREATE TABLE IF NOT EXISTS point_rules (
        rule_id VARCHAR(64) PRIMARY KEY,
        rule_name VARCHAR(150) NOT NULL,
        rule_type VARCHAR(50) NOT NULL,
        scope VARCHAR(100) DEFAULT 'GLOBAL',
        calculation_method VARCHAR(32) NOT NULL,
        configured_value NUMERIC(10, 2) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        assigned_to_id VARCHAR(64),
        assigned_to_name VARCHAR(150),
        points_value INT DEFAULT 50,
        due_date TIMESTAMP WITH TIME ZONE,
        status VARCHAR(32) DEFAULT 'TODO',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(64) PRIMARY KEY,
        task_id VARCHAR(64) REFERENCES tasks(id),
        member_id VARCHAR(64) NOT NULL,
        member_name VARCHAR(150),
        content_url TEXT,
        notes TEXT,
        status VARCHAR(32) DEFAULT 'PENDING',
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        approved_at TIMESTAMP WITH TIME ZONE
      );

      CREATE TABLE IF NOT EXISTS point_transactions (
        id VARCHAR(64) PRIMARY KEY,
        member_id VARCHAR(64) NOT NULL,
        task_id VARCHAR(64),
        submission_id VARCHAR(64),
        transaction_type VARCHAR(32) NOT NULL,
        points INT NOT NULL,
        description TEXT,
        reference_id VARCHAR(64) UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS interviews (
        id VARCHAR(64) PRIMARY KEY,
        application_id VARCHAR(64) NOT NULL,
        start_at TIMESTAMP WITH TIME ZONE NOT NULL,
        end_at TIMESTAMP WITH TIME ZONE NOT NULL,
        timezone VARCHAR(64) DEFAULT 'UTC',
        google_calendar_event_id VARCHAR(255),
        status VARCHAR(32) DEFAULT 'SCHEDULED',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS registrations (
        id VARCHAR(64) PRIMARY KEY,
        activity_id VARCHAR(64) NOT NULL,
        registration_type VARCHAR(16) NOT NULL,
        member_id VARCHAR(64),
        email VARCHAR(255) NOT NULL,
        full_name VARCHAR(150),
        status VARCHAR(32) DEFAULT 'CONFIRMED',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT member_xor_visitor CHECK (
          (registration_type = 'MEMBER' AND member_id IS NOT NULL) OR
          (registration_type = 'VISITOR' AND member_id IS NULL)
        )
      );

      CREATE TABLE IF NOT EXISTS tickets (
        id VARCHAR(64) PRIMARY KEY,
        registration_id VARCHAR(64) UNIQUE REFERENCES registrations(id),
        activity_id VARCHAR(64) NOT NULL,
        ticket_code VARCHAR(64) UNIQUE NOT NULL,
        qr_payload TEXT NOT NULL,
        status VARCHAR(32) DEFAULT 'ISSUED',
        issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS attendance (
        id VARCHAR(64) PRIMARY KEY,
        ticket_id VARCHAR(64) UNIQUE REFERENCES tickets(id),
        activity_id VARCHAR(64) NOT NULL,
        checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        staff_name VARCHAR(150)
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        key VARCHAR(64) PRIMARY KEY,
        value TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed system settings if empty
    await client.query(`
      INSERT INTO system_settings (key, value, description)
      VALUES ('leaderboard_top_n', '10', 'Default configured leaderboard top-N display limit')
      ON CONFLICT (key) DO NOTHING;
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

    const rulesCheck = await client.query('SELECT COUNT(*) FROM point_rules');
    if (parseInt(rulesCheck.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO point_rules (rule_id, rule_name, rule_type, scope, calculation_method, configured_value, is_active) VALUES
        ('rule_normal', 'Standard Task Completion', 'NORMAL_COMPLETION', 'GLOBAL', 'FIXED', 50, TRUE),
        ('rule_late', 'Late Task Completion Reduction', 'LATE_COMPLETION', 'GLOBAL', 'PERCENTAGE', 20, TRUE),
        ('rule_penalty', 'Missed Task Penalty', 'MISSED_TASK_PENALTY', 'GLOBAL', 'FIXED', 15, TRUE);
      `);
    }

    client.release();
    console.log('[PostgreSQL] Database schema initialized and seeded successfully.');
  } catch (err: any) {
    console.warn('[PostgreSQL] Database connection notice:', err.message || err);
    console.warn('[PostgreSQL] Operating in mock-fallback / offline storage mode until database is provisioned.');
  }
}
