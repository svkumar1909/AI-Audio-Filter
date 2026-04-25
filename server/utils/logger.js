import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'pronunciation-app' },
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message} ${info.stack || ''}`
        )
      )
    }),
    
    // File transport for error logs
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error'
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log')
    })
  ]
});

// Add request logging middleware
const requestLogger = (req, res, next) => {
  // Skip logging for static assets
  if (req.path.startsWith('/public')) {
    return next();
  }
  
  const startTime = new Date();
  const requestId = generateRequestId();
  
  // Log request details
  logger.info({
    message: `Incoming request: ${req.method} ${req.originalUrl}`,
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user ? req.user.id : 'anonymous'
  });
  
  // Track response
  res.on('finish', () => {
    const duration = new Date() - startTime;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel]({
      message: `Request completed: ${req.method} ${req.originalUrl} ${res.statusCode}`,
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user ? req.user.id : 'anonymous'
    });
  });
  
  next();
};

// Generate unique request ID function
function generateRequestId() {
  return Math.random().toString(36).substring(2, 12);
}

// Export logger and middleware
export { logger, requestLogger };