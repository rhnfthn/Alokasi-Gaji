const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
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
    options: '-c search_path=finflow',
    connectionTimeoutMillis: 7000,
  });

  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const count = await prisma.user.count();
    console.log('OK prisma.user.count =', count);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error('FAIL', e.code || '', e.message);
  process.exit(1);
});
