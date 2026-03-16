"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcrypt"));
const connectionString = process.env.DATABASE_URL ||
    'postgresql://postgres:0000@localhost:5432/fintech';
const urlSchema = (() => {
    try {
        const url = new URL(connectionString);
        const schema = url.searchParams.get('schema');
        return schema || undefined;
    }
    catch {
        return undefined;
    }
})();
const schemaName = process.env.DATABASE_SCHEMA || urlSchema;
const isSafeSchemaName = !schemaName || /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schemaName);
if (!isSafeSchemaName) {
    throw new Error('Invalid DATABASE_SCHEMA (or schema= in DATABASE_URL). Use only letters, numbers, and underscores, starting with a letter or underscore.');
}
const forceSsl = (process.env.DATABASE_SSL ?? '').toLowerCase();
const sslEnabledByEnv = forceSsl === '1' || forceSsl === 'true' || forceSsl === 'yes';
const sslDisabledByEnv = forceSsl === '0' || forceSsl === 'false' || forceSsl === 'no';
let shouldUseSsl = false;
if (!sslDisabledByEnv) {
    if (sslEnabledByEnv) {
        shouldUseSsl = true;
    }
    else {
        try {
            const url = new URL(connectionString);
            const host = url.hostname;
            shouldUseSsl = host !== 'localhost' && host !== '127.0.0.1';
        }
        catch {
            shouldUseSsl = false;
        }
    }
}
const pool = new pg_1.Pool({
    connectionString: (() => {
        try {
            const url = new URL(connectionString);
            url.searchParams.delete('sslmode');
            return url.toString();
        }
        catch {
            return connectionString;
        }
    })(),
    ...(schemaName ? { options: `-c search_path=${schemaName}` } : {}),
    ...(shouldUseSsl ? { ssl: { rejectUnauthorized: false } } : {}),
});
const prisma = new client_1.PrismaClient({ adapter: new adapter_pg_1.PrismaPg(pool) });
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
    }
    else {
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
//# sourceMappingURL=seed.js.map