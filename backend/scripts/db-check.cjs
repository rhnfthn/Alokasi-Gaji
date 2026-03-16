const { Pool } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Missing DATABASE_URL');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 7000,
  });

  try {
    const tables = await pool.query(
      "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by table_name",
    );
    console.log('public tables:', tables.rows.map((r) => r.table_name));

    const prismaMigrations = await pool.query(
      "select to_regclass('public._prisma_migrations') as prisma_migrations",
    );
    console.log('_prisma_migrations exists:', prismaMigrations.rows[0].prisma_migrations);

    const extensions = await pool.query(
      "select extname from pg_extension order by extname",
    );
    console.log('extensions:', extensions.rows.map((r) => r.extname));
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error('db-check failed:', e.code || '', e.message);
  process.exit(1);
});
