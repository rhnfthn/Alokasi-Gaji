/* eslint-disable no-console */

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const confirmed = (process.env.CONFIRM_DELETE_DEFAULT_CATEGORIES || '').toUpperCase() === 'YES';
  if (!confirmed) {
    console.log('Refusing to delete default categories.');
    console.log('Set CONFIRM_DELETE_DEFAULT_CATEGORIES=YES to proceed.');
    process.exitCode = 1;
    return;
  }

  const connectionString =
    process.env.DATABASE_URL ||
    'postgresql://postgres:0000@localhost:5432/fintech';

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const before = await prisma.defaultCategory.count();
    const result = await prisma.defaultCategory.deleteMany({});
    const after = await prisma.defaultCategory.count();

    console.log('default_categories before:', before);
    console.log('deleted:', result.count);
    console.log('default_categories after:', after);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
