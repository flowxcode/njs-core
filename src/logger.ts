import fs from 'fs';
import path from 'path';
import { format, transports, createLogger } from 'winston';

// Define log directory and file
const logDir = path.join(process.cwd(), 'logs');
const logFile = path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`);

// Ensure log directory exists (in both dev and prod, but only for file transport)
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Create Winston logger
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
        // Add prettyPrint for readable console output in dev
        process.env.NODE_ENV !== 'production' ? format.prettyPrint() : format.json()
    ),
    transports: [
        // Always write to file for consistent logging
        new transports.File({ filename: logFile }),
        // Only log to console in development, with forced newline
        ...(process.env.NODE_ENV !== 'production'
            ? [
                new transports.Console({
                    format: format.combine(
                        format.printf(({ timestamp, level, message }) => `\n${timestamp} [${level}]: ${message}`)
                    ),
                }),
            ]
            : [
                // Minimal console output in production to avoid interleaving
                new transports.Console({
                    format: format.combine(
                        // Prefix with newline to force separation from Next.js progress
                        format.printf(({ timestamp, level, message }) => `\n${timestamp} [${level}]: ${message}`)
                    ),
                    // Only log errors in production to reduce console noise
                    level: 'error',
                }),
            ]),
    ],
});

// Log initialization message through Winston, not console.log
logger.info(`Logger initialized in ${process.env.NODE_ENV || 'unknown'} mode`);

export default logger;