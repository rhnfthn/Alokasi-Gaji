import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:0000@localhost:5432/fintech';

const forceSsl = (process.env.DATABASE_SSL ?? '').toLowerCase();
const sslEnabledByEnv =
  forceSsl === '1' || forceSsl === 'true' || forceSsl === 'yes';
const sslDisabledByEnv =
  forceSsl === '0' || forceSsl === 'false' || forceSsl === 'no';

let shouldUseSsl = false;
if (!sslDisabledByEnv) {
  if (sslEnabledByEnv) {
    shouldUseSsl = true;
  } else {
    try {
      const url = new URL(connectionString);
      const host = url.hostname;
      shouldUseSsl = host !== 'localhost' && host !== '127.0.0.1';
    } catch {
      shouldUseSsl = false;
    }
  }
}

const pool = new Pool({
  connectionString,
  ...(shouldUseSsl ? { ssl: { rejectUnauthorized: false } } : {}),
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log('Seeding database (opt-in)...');

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminName = process.env.SEED_ADMIN_NAME ?? 'Admin';

  if (adminEmail && adminPassword) {
    const hashedPasswordAdmin = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        name: adminName,
        password: hashedPasswordAdmin,
        role: 'ADMIN',
      },
      create: {
        email: adminEmail,
        password: hashedPasswordAdmin,
        name: adminName,
        role: 'ADMIN',
      },
    });
    console.log('Seeded admin user:', admin.email);
  } else {
    console.log('No seed data created. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create an admin.');
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
