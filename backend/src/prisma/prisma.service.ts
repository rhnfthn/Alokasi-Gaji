import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('Missing DATABASE_URL env var');
    }

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
          // If parsing fails, keep SSL disabled unless explicitly enabled.
          shouldUseSsl = false;
        }
      }
    }

    const pool = new Pool({
      connectionString,
      ...(shouldUseSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    });
    super({ adapter: new PrismaPg(pool) });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
