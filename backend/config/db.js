import pg from 'pg';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '..', process.env.DB_FILE || 'petcare.db');

const getSanitizedUrl = (urlStr) => {
  if (!urlStr) return '';
  let cleaned = urlStr.replace(/^["']|["']$/g, '').trim();
  if (cleaned.includes('[') || cleaned.includes(']')) {
    cleaned = cleaned.replace(/\[/g, '%5B').replace(/\]/g, '%5D');
  }
  return cleaned;
};

const isPlaceholderUrl = (urlStr) => {
  if (!urlStr) return true;
  return (
    urlStr.includes('[YOUR') ||
    urlStr.includes('YOUR-PROJECT') ||
    urlStr.includes('YOUR-PASSWORD') ||
    urlStr.includes('YOUR-REGION')
  );
};

let usePostgres = false;
let pool = null;
let sqliteDb = null;

// Convert SQLite '?' positional parameter placeholders to Postgres '$1', '$2', etc.
const convertPlaceholders = (sql) => {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
};

// Map lowercase column keys returned by PostgreSQL to camelCase keys expected by application
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
    let val = row[key];
    if (targetKey === 'count' && typeof val === 'string' && !isNaN(val)) {
      val = parseInt(val, 10);
    }
    mapped[targetKey] = val;
  }
  return mapped;
};

// Helper functions for async database operations
export const runQuery = async (sql, params = []) => {
  if (usePostgres && pool) {
    const pgSql = convertPlaceholders(sql);
    const res = await pool.query(pgSql, params);
    return { lastID: null, changes: res.rowCount, rowCount: res.rowCount };
  } else if (sqliteDb) {
    return new Promise((resolve, reject) => {
      sqliteDb.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  } else {
    throw new Error('Database connection is not initialized.');
  }
};

export const getOne = async (sql, params = []) => {
  if (usePostgres && pool) {
    const pgSql = convertPlaceholders(sql);
    const res = await pool.query(pgSql, params);
    return res.rows.length > 0 ? mapRow(res.rows[0]) : null;
  } else if (sqliteDb) {
    return new Promise((resolve, reject) => {
      sqliteDb.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(mapRow(row));
      });
    });
  } else {
    throw new Error('Database connection is not initialized.');
  }
};

export const getAll = async (sql, params = []) => {
  if (usePostgres && pool) {
    const pgSql = convertPlaceholders(sql);
    const res = await pool.query(pgSql, params);
    return res.rows.map(mapRow);
  } else if (sqliteDb) {
    return new Promise((resolve, reject) => {
      sqliteDb.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows ? rows.map(mapRow) : []);
      });
    });
  } else {
    throw new Error('Database connection is not initialized.');
  }
};

export const initDb = async () => {
  const rawUrl = process.env.DATABASE_URL;
  if (rawUrl && !isPlaceholderUrl(rawUrl)) {
    try {
      const connectionString = getSanitizedUrl(rawUrl);
      const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
      const testPool = new Pool({
        connectionString,
        ssl: isLocal ? false : { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
      });
      await testPool.query('SELECT 1');
      pool = testPool;
      usePostgres = true;
      console.log('PostgreSQL database connected successfully.');
    } catch (err) {
      console.warn('PostgreSQL connection failed. Falling back to SQLite database...');
      usePostgres = false;
    }
  } else {
    console.log('PostgreSQL DATABASE_URL contains placeholders or is not set. Using SQLite database...');
    usePostgres = false;
  }

  if (!usePostgres) {
    const sqlite = sqlite3.verbose();
    await new Promise((resolve, reject) => {
      sqliteDb = new sqlite.Database(dbPath, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    console.log('Connected to SQLite database at:', dbPath);
    await runQuery('PRAGMA foreign_keys = ON;');
  }

  // Schema creation queries
  const idType = usePostgres ? 'VARCHAR(255)' : 'TEXT';

  await runQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id ${idType} PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      address TEXT,
      avatar TEXT,
      createdAt TEXT NOT NULL
    )
  `);

  const userColumns = await getAll('PRAGMA table_info(users)');
  const hasColumn = (name) => userColumns.some(column => column.name === name);
  if (!hasColumn('emailVerified')) await runQuery('ALTER TABLE users ADD COLUMN emailVerified INTEGER NOT NULL DEFAULT 1');
  if (!hasColumn('verificationTokenHash')) await runQuery('ALTER TABLE users ADD COLUMN verificationTokenHash TEXT');
  if (!hasColumn('verificationTokenExpiresAt')) await runQuery('ALTER TABLE users ADD COLUMN verificationTokenExpiresAt TEXT');

  await runQuery(`
    CREATE TABLE IF NOT EXISTS services (
      id ${idType} PRIMARY KEY,
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

  await runQuery(`
    CREATE TABLE IF NOT EXISTS pets (
      id ${idType} PRIMARY KEY,
      userId ${idType} NOT NULL,
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
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS marketplace_pets (
      id ${idType} PRIMARY KEY,
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
      sellerId ${idType},
      phone TEXT NOT NULL,
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS bookings (
      id ${idType} PRIMARY KEY,
      userId ${idType} NOT NULL,
      serviceId ${idType} NOT NULL,
      serviceName TEXT NOT NULL,
      petId ${idType} NOT NULL,
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
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS reminders (
      id ${idType} PRIMARY KEY,
      userId ${idType} NOT NULL,
      petId ${idType} NOT NULL,
      petName TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      time TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS emergency_contacts (
      id ${idType} PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      openHours TEXT NOT NULL,
      distance TEXT NOT NULL
    )
  `);

  console.log('Database tables initialized successfully.');
};

export default pool;

