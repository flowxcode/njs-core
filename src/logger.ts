import fs from 'fs';
import path from 'path';
import { format, transports, createLogger, Logger } from 'winston';

const logDir = path.join(process.cwd(), 'logs');
const logFile = path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`);

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logger: Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
        process.env.NODE_ENV !== 'production' ? format.prettyPrint() : format.json()
    ),
    transports: [
        new transports.File({ filename: logFile }),
        ...(process.env.NODE_ENV !== 'production'
            ? [
                  new transports.Console({
                      format: format.combine(
                          format.printf(({ timestamp, level, message }) => `\n${timestamp} [${level}]: ${message}`)
                      ),
                  }),
              ]
            : [
                  new transports.Console({
                      format: format.combine(
                          format.printf(({ timestamp, level, message }) => `\n${timestamp} [${level}]: ${message}`)
                      ),
                      level: 'error',
                  }),
              ]),
    ],
});

logger.info(`Logger initialized in ${process.env.NODE_ENV || 'unknown'} mode`);

export default logger;