"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiHandler = apiHandler;
const server_1 = require("next/server");
const db_1 = require("./db");
const logger_1 = __importDefault(require("./logger"));
const constants_1 = require("./constants");
async function apiHandler(fn, options = {}) {
    try {
        if (options.useTransaction) {
            await (0, db_1.query)('BEGIN');
            await (0, db_1.query)('SET SESSION idle_in_transaction_session_timeout = 0');
            const data = await fn();
            await (0, db_1.query)('COMMIT');
            return server_1.NextResponse.json({ data }, { status: constants_1.STATUS.OK });
        }
        const data = await fn();
        return server_1.NextResponse.json({ data }, { status: constants_1.STATUS.OK });
    }
    catch (error) {
        if (options.useTransaction) {
            await (0, db_1.query)('ROLLBACK');
        }
        logger_1.default.error('API error', error);
        return server_1.NextResponse.json({ message: 'Internal server error' }, { status: constants_1.STATUS.ERROR });
    }
}
//# sourceMappingURL=api-handler.js.map