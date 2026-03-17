import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('Missing DATABASE_URL env var');
    }

    const urlSchema = (() => {
      try {
        const url = new URL(connectionString);
        const schema = url.searchParams.get('schema');
        return schema || undefined;
      } catch {
        return undefined;
      }
    })();
    const schemaName = process.env.DATABASE_SCHEMA || urlSchema;
    const isSafeSchemaName =
      !schemaName || /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schemaName);
    if (!isSafeSchemaName) {
      throw new Error(
        'Invalid DATABASE_SCHEMA (or schema= in DATABASE_URL). Use only letters, numbers, and underscores, starting with a letter or underscore.',
      );
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

    const poolConnectionString = (() => {
      try {
        const url = new URL(connectionString);
        // We control SSL via Pool options; sslmode in the URL can force strict verification.
        url.searchParams.delete('sslmode');
        return url.toString();
      } catch {
        return connectionString;
      }
    })();

    // Use smaller pool for serverless environments (Vercel, AWS Lambda, etc.)
    const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    const maxPoolSize = isServerless ? 1 : 10;

    this.pool = new Pool({
      connectionString: poolConnectionString,
      max: maxPoolSize,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ...(schemaName ? { options: `-c search_path=${schemaName}` } : {}),
      ...(shouldUseSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    });
    super({ adapter: new PrismaPg(this.pool) });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      console.error('Error disconnecting Prisma:', error);
    }

    try {
      await this.pool.end();
    } catch (error) {
      console.error('Error ending pool:', error);
    }
  }
}
