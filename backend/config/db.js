import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

let pool = null;

// Convert SQLite-style ? placeholders to PostgreSQL $1, $2, $3...
const convertPlaceholders = (sql) => {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
};

// PostgreSQL returns column names exactly as defined when quoted,
// but unquoted camelCase names become lowercase.
// Map them back to the names expected by the application.
const keyMap = {
  createdat: 'createdAt',
  userid: 'userId',
  iconname: 'iconName',
  shortdescription: 'shortDescription',
  fulldescription: 'fullDescription',
  vaccinationstatus: 'vaccinationStatus',
  sellername: 'sellerName',
  sellerid: 'sellerId',
  serviceid: 'serviceId',
  servicename: 'serviceName',
  petid: 'petId',
  petname: 'petName',
  ownername: 'ownerName',
  paymentstatus: 'paymentStatus',
  paymentmethod: 'paymentMethod',
  transactionid: 'transactionId',
  paidat: 'paidAt',
  duedate: 'dueDate',
  openhours: 'openHours'
};

const mapRow = (row) => {
  if (!row) return row;

  const mapped = {};

  for (const key of Object.keys(row)) {
    const targetKey = keyMap[key.toLowerCase()] || key;

    let value = row[key];

    if (
      targetKey === 'count' &&
      typeof value === 'string' &&
      !isNaN(value)
    ) {
      value = parseInt(value, 10);
    }

    mapped[targetKey] = value;
  }

  return mapped;
};

// Run INSERT / UPDATE / DELETE queries
export const runQuery = async (sql, params = []) => {
  if (!pool) {
    throw new Error('PostgreSQL database is not initialized.');
  }

  const pgSql = convertPlaceholders(sql);

  const result = await pool.query(pgSql, params);

  return {
    lastID: null,
    changes: result.rowCount,
    rowCount: result.rowCount
  };
};

// Get one row
export const getOne = async (sql, params = []) => {
  if (!pool) {
    throw new Error('PostgreSQL database is not initialized.');
  }

  const pgSql = convertPlaceholders(sql);

  const result = await pool.query(pgSql, params);

  return result.rows.length > 0
    ? mapRow(result.rows[0])
    : null;
};

// Get multiple rows
export const getAll = async (sql, params = []) => {
  if (!pool) {
    throw new Error('PostgreSQL database is not initialized.');
  }

  const pgSql = convertPlaceholders(sql);

  const result = await pool.query(pgSql, params);

  return result.rows.map(mapRow);
};

// Initialize PostgreSQL database
export const initDb = async () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not set. Please add your Supabase PostgreSQL connection string.'
    );
  }

  console.log('Connecting to PostgreSQL...');

  try {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 10000
    });

    await pool.query('SELECT NOW()');

    console.log('PostgreSQL database connected successfully.');

    // Enable foreign keys is automatic in PostgreSQL.
    // PRAGMA foreign_keys = ON is SQLite-only and must NOT be used here.

    // ============================================================
    // USERS
    // ============================================================

    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        address TEXT,
        avatar TEXT,
        createdAt TEXT NOT NULL
      )
    `);

    // Add optional authentication columns if they don't exist
    await runQuery(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS emailVerified INTEGER NOT NULL DEFAULT 1
    `);

    await runQuery(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS verificationTokenHash TEXT
    `);

    await runQuery(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS verificationTokenExpiresAt TEXT
    `);

    // ============================================================
    // SERVICES
    // ============================================================

    await runQuery(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(255) PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        iconName TEXT NOT NULL,
        shortDescription TEXT NOT NULL,
        fullDescription TEXT NOT NULL,
        price INTEGER NOT NULL,
        duration TEXT NOT NULL,
        popular INTEGER DEFAULT 0,
        rating REAL DEFAULT 5.0,
        image TEXT NOT NULL
      )
    `);

    // ============================================================
    // PETS
    // ============================================================

    await runQuery(`
      CREATE TABLE IF NOT EXISTS pets (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        breed TEXT NOT NULL,
        age TEXT NOT NULL,
        gender TEXT NOT NULL,
        weight TEXT NOT NULL,
        vaccinationStatus TEXT NOT NULL,
        image TEXT,
        notes TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (userId)
          REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);

    // ============================================================
    // MARKETPLACE PETS
    // ============================================================

    await runQuery(`
      CREATE TABLE IF NOT EXISTS marketplace_pets (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        breed TEXT NOT NULL,
        age TEXT NOT NULL,
        gender TEXT NOT NULL,
        price INTEGER NOT NULL,
        certified INTEGER DEFAULT 0,
        vaccinated INTEGER DEFAULT 1,
        location TEXT NOT NULL,
        sellerName TEXT NOT NULL,
        sellerId VARCHAR(255),
        phone TEXT NOT NULL,
        image TEXT NOT NULL,
        description TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);

    // ============================================================
    // BOOKINGS
    // ============================================================

    await runQuery(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        serviceId VARCHAR(255) NOT NULL,
        serviceName TEXT NOT NULL,
        petId VARCHAR(255) NOT NULL,
        petName TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        ownerName TEXT NOT NULL,
        phone TEXT NOT NULL,
        notes TEXT,
        price INTEGER NOT NULL,
        status TEXT NOT NULL,
        paymentStatus TEXT NOT NULL,
        paymentMethod TEXT,
        transactionId TEXT,
        paidAt TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (userId)
          REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);

    // ============================================================
    // REMINDERS
    // ============================================================

    await runQuery(`
      CREATE TABLE IF NOT EXISTS reminders (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        petId VARCHAR(255) NOT NULL,
        petName TEXT NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        dueDate TEXT NOT NULL,
        time TEXT NOT NULL,
        status TEXT NOT NULL,
        notes TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (userId)
          REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);

    // ============================================================
    // EMERGENCY CONTACTS
    // ============================================================

    await runQuery(`
      CREATE TABLE IF NOT EXISTS emergency_contacts (
        id VARCHAR(255) PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        openHours TEXT NOT NULL,
        distance TEXT NOT NULL
      )
    `);

    // ============================================================
    // INDEXES
    // ============================================================

    await runQuery(`
      CREATE INDEX IF NOT EXISTS idx_pets_userId
      ON pets(userId)
    `);

    await runQuery(`
      CREATE INDEX IF NOT EXISTS idx_marketplace_sellerId
      ON marketplace_pets(sellerId)
    `);

    await runQuery(`
      CREATE INDEX IF NOT EXISTS idx_bookings_userId
      ON bookings(userId)
    `);

    await runQuery(`
      CREATE INDEX IF NOT EXISTS idx_bookings_petId
      ON bookings(petId)
    `);

    await runQuery(`
      CREATE INDEX IF NOT EXISTS idx_bookings_serviceId
      ON bookings(serviceId)
    `);

    await runQuery(`
      CREATE INDEX IF NOT EXISTS idx_reminders_userId
      ON reminders(userId)
    `);

    await runQuery(`
      CREATE INDEX IF NOT EXISTS idx_reminders_petId
      ON reminders(petId)
    `);

    console.log('Database tables initialized successfully.');

  } catch (error) {
    console.error(
      'PostgreSQL database initialization failed:',
      error.message
    );

    if (pool) {
      await pool.end().catch(() => {});
      pool = null;
    }

    throw error;
  }
};

export default pool;