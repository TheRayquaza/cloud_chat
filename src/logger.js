const winston = require('winston');

// Create a logger for routes with colorized output
const route_logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(info => `[${info.level}] [router]: ${info.message}`)
  ),
  transports: [new winston.transports.Console()]
});

// Create a logger for controllers with yellow colorized output
const controller_logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize({all:true, colors:{info:'yellow'}}),
    winston.format.timestamp(),
    winston.format.printf(info => `[${info.level}] [controller]: ${info.message}`)
  ),
  transports: [new winston.transports.Console()]
});

// Create a logger for DB with red colorized output
const db_logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize({all:true, colors:{info:'red'}}),
    winston.format.timestamp(),
    winston.format.printf(info => `[${info.level}] [db]: ${info.message}`)
  ),
  transports: [new winston.transports.Console()]
});

// Create a logger for DB with red colorized output
const ws_logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.colorize({all:true, colors:{info:'blue'}}),
      winston.format.timestamp(),
      winston.format.printf(info => `[${info.level}] [ws]: ${info.message}`)
    ),
    transports: [new winston.transports.Console()]
  });

// Create a logger for routes with colorized output
const middleware_logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.colorize({all:true, colors:{info:"green"}}),
      winston.format.timestamp(),
      winston.format.printf(info => `[${info.level}] [middleware]: ${info.message}`)
    ),
    transports: [new winston.transports.Console()]
  });

module.exports = {
  route_logger,
  controller_logger,
  db_logger,
  ws_logger,
  middleware_logger
};