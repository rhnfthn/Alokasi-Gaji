"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
let PrismaService = class PrismaService extends client_1.PrismaClient {
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
        const poolConnectionString = (() => {
            try {
                const url = new URL(connectionString);
                url.searchParams.delete('sslmode');
                return url.toString();
            }
            catch {
                return connectionString;
            }
        })();
        const pool = new pg_1.Pool({
            connectionString: poolConnectionString,
            ...(schemaName ? { options: `-c search_path=${schemaName}` } : {}),
            ...(shouldUseSsl ? { ssl: { rejectUnauthorized: false } } : {}),
        });
        super({ adapter: new adapter_pg_1.PrismaPg(pool) });
    }
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map