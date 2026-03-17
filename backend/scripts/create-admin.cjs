const { Pool } = require('pg');
const bcrypt = require('bcrypt');

async function main() {
  const connectionString = process.env.DATABASE_URL ||
    'postgresql://postgres.jgkqrcdqhsowidnzkfxz:D1fSwizJbw6yYbP7@aws-1-us-east-1.pooler.supabase.com:6543/postgres?schema=finflow';

  const adminEmail = 'admin@finflow.com';
  const adminPassword = 'Admin123!';
  const adminName = 'Admin';

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const id = require('crypto').randomUUID();

    // Check if admin exists
    const check = await pool.query(
      'SELECT * FROM finflow.users WHERE email = $1',
      [adminEmail]
    );

    if (check.rows.length > 0) {
      console.log('✅ Admin sudah ada:', check.rows[0].email);
      console.log('Role:', check.rows[0].role);
    } else {
      // Create admin
      const result = await pool.query(
        `INSERT INTO finflow.users (id, name, email, password, role, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING *`,
        [id, adminName, adminEmail, hashedPassword, 'ADMIN']
      );

      console.log('✅ Admin berhasil dibuat!');
      console.log('Email:', result.rows[0].email);
      console.log('Role:', result.rows[0].role);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error('Failed:', e.message);
  process.exit(1);
});
