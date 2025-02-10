import winston from 'winston';
import { MongoDB } from 'winston-mongodb';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.MONGODB_URI) {
  logger.add(new MongoDB({
    db: process.env.MONGODB_URI,
    collection: 'logs',
    level: 'info',
    options: { useUnifiedTopology: true }
  }));
}

export default logger;