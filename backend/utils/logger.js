const winston = require('winston');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/system.log');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
      (info) => `[${info.timestamp}] [${info.level.toUpperCase()}] ${info.message}`
    )
  ),
  transports: [
    new winston.transports.File({ filename: logFilePath }),
    new winston.transports.Console()
  ],
});

module.exports = { logger, logFilePath };
