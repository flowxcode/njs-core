"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
const logDir = path_1.default.join(process.cwd(), 'logs');
const logFile = path_1.default.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`);
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
const logger = (0, winston_1.createLogger)({
    level: 'info', // Minimum log level: info and above (error, warn)
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp to logs
    winston_1.format.json(), // Output logs in JSON format
    process.env.NODE_ENV !== 'production' ? winston_1.format.prettyPrint() : winston_1.format.json() // Pretty print in dev, JSON in prod
    ),
    transports: [
        new winston_1.transports.File({ filename: logFile }), // Write logs to file specified by logFile
        ...(process.env.NODE_ENV !== 'production'
            ? [
                new winston_1.transports.Console({
                    format: winston_1.format.combine(winston_1.format.printf(({ timestamp, level, message }) => `\n${timestamp} [${level}]: ${message}`) // Custom log format
                    ),
                }),
            ]
            : [
                new winston_1.transports.Console({
                    format: winston_1.format.combine(winston_1.format.printf(({ timestamp, level, message }) => `\n${timestamp} [${level}]: ${message}`) // Custom log format
                    ),
                    level: 'error', // Only log errors in prod
                }),
            ]),
    ],
});
logger.info(`Logger initialized in ${process.env.NODE_ENV || 'unknown'} mode`);
exports.default = logger;
//# sourceMappingURL=logger.js.map