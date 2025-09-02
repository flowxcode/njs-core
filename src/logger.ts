import fs from 'fs';
import path from 'path';
import { format, transports, createLogger, Logger } from 'winston';

const logDir = path.join(process.cwd(), 'logs');
const logFile = path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`);

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logger: Logger = createLogger({
    level: 'info', // Minimum log level: info and above (error, warn)
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp to logs
        format.json(), // Output logs in JSON format
        process.env.NODE_ENV !== 'production' ? format.prettyPrint() : format.json() // Pretty print in dev, JSON in prod
    ),
    transports: [
        new transports.File({ filename: logFile }), // Write logs to file specified by logFile
        ...(process.env.NODE_ENV !== 'production'
            ? [
                  new transports.Console({ // Console logging for dev
                      format: format.combine(
                          format.printf(({ timestamp, level, message }) => `\n${timestamp} [${level}]: ${message}`) // Custom log format
                      ),
                  }),
              ]
            : [
                  new transports.Console({ // Console logging for prod, errors only
                      format: format.combine(
                          format.printf(({ timestamp, level, message }) => `\n${timestamp} [${level}]: ${message}`) // Custom log format
                      ),
                      level: 'error', // Only log errors in prod
                  }),
              ]),
    ],
});

logger.info(`Logger initialized in ${process.env.NODE_ENV || 'unknown'} mode`);

export default logger;