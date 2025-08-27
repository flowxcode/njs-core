"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = query;
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
const pg_1 = require("pg");
const logger_1 = __importDefault(require("./logger"));
let client = null;
async function getClient() {
    if (!client) {
        const connectionString = process.env.AZURE_PG_CONNECTION;
        if (!connectionString) {
            throw new Error('AZURE_PG_CONNECTION environment variable is not set');
        }
        client = new pg_1.Client({
            connectionString,
            keepAlive: true,
            connectionTimeoutMillis: 2000, // Fail fast if connection fails
            query_timeout: 5000, // Timeout queries after 5 seconds
            statement_timeout: 0, // Disable for long-running batched inserts
        });
        client.on('error', (err) => {
            logger_1.default.error('Database client error', {
                error: err.message,
                stack: err.stack,
                timestamp: new Date().toISOString(),
            });
            client = null; // Reset client on error
        });
        await client.connect();
        logger_1.default.info('Database client connected', { timestamp: new Date().toISOString() });
    }
    return client;
}
async function query(queryText, params = [], retries = 3, delayMs = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const pgClient = await getClient();
            const result = await pgClient.query(queryText, params);
            return { rows: result.rows };
        }
        catch (error) {
            if (attempt < retries && (error.message.includes('timeout') || error.code === '53300')) {
                logger_1.default.warn(`Retry ${attempt}/${retries} for query: ${error.message}`, { queryText });
                if (error.code === '53300') {
                    client = null; // Force reconnect on slot exhaustion
                }
                await new Promise((resolve) => setTimeout(resolve, delayMs));
                continue;
            }
            logger_1.default.error('Query error', { error: error.message, stack: error.stack });
            throw error;
        }
    }
    throw new Error('Max retries reached');
}
// Cleanup on app shutdown
process.on('SIGTERM', async () => {
    if (client) {
        await client.end();
        logger_1.default.info('Database client disconnected');
        client = null;
    }
});
//# sourceMappingURL=db.js.map