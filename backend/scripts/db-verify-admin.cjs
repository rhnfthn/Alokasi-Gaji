const { Pool } = require('pg');

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL;

  if (!connectionString) {
    console.error('Missing DATABASE_URL');
    process.exit(1);
  }
  if (!email) {
    console.error('Missing ADMIN_EMAIL');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 7000,
  });

  try {
    const res = await pool.query(
      'select count(*)::int as c from finflow.users where email = $1',
      [email],
    );
    console.log('admin rows:', res.rows[0]);
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error('verify failed:', e.code || '', e.message);
  process.exit(1);
});
