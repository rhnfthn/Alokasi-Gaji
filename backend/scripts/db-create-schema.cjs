const { Pool } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const schemaName = process.env.SCHEMA_NAME;

  if (!connectionString) {
    console.error('Missing DATABASE_URL');
    process.exit(1);
  }
  if (!schemaName) {
    console.error('Missing SCHEMA_NAME');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 7000,
  });

  try {
    await pool.query(`create schema if not exists "${schemaName.replace(/"/g, '""')}"`);
    console.log('schema ensured:', schemaName);
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error('db-create-schema failed:', e.code || '', e.message);
  process.exit(1);
});
