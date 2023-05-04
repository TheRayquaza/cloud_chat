import winston from 'winston'

// Create a logger for routes with colorized output
export const route_logger : winston.Logger = winston.createLogger({
  level: process.env.LOG !== 'true' ? 'error' : 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(info => `[${info.level}] [router]: ${info.message}`)
  ),
  transports: [new winston.transports.Console()]
})

// Create a logger for controllers with yellow colorized output
export const controller_logger : winston.Logger = winston.createLogger({
  level: process.env.LOG !== 'true' ? 'error' : 'info',
  format: winston.format.combine(
    winston.format.colorize({all:true, colors:{info:'yellow'}}),
    winston.format.timestamp(),
    winston.format.printf(info => `[${info.level}] [controller]: ${info.message}`)
  ),
  transports: [new winston.transports.Console()]
})

// Create a logger for DB with red colorized output
const db_logger : winston.Logger = winston.createLogger({
  level: process.env.LOG !== 'true' ? 'error' : 'info',
  format: winston.format.combine(
    winston.format.colorize({all:true, colors:{info:'red'}}),
    winston.format.timestamp(),
    winston.format.printf(info => `[${info.level}] [db]: ${info.message}`)
  ),
  transports: [new winston.transports.Console()]
})

// Create a logger for DB with red colorized output
export const ws_logger : winston.Logger = winston.createLogger({
    level: process.env.LOG !== 'true' ? 'error' : 'info',
    format: winston.format.combine(
      winston.format.colorize({all:true, colors:{info:'blue'}}),
      winston.format.timestamp(),
      winston.format.printf(info => `[${info.level}] [ws]: ${info.message}`)
    ),
    transports: [new winston.transports.Console()]
})

// Create a logger for routes with colorized output
export const middleware_logger : winston.Logger = winston.createLogger({
    level: process.env.LOG !== 'true' ? 'error' : 'info',
    format: winston.format.combine(
      winston.format.colorize({all:true, colors:{info:"green"}}),
      winston.format.timestamp(),
      winston.format.printf(info => `[${info.level}] [middleware]: ${info.message}`)
    ),
    transports: [new winston.transports.Console()]
})

// Create a logger for scripts with colorized output
export const script_logger : winston.Logger = winston.createLogger({
  level: process.env.LOG !== 'true' ? 'error' : 'info',
  format: winston.format.combine(
    winston.format.colorize({all:true}),
    winston.format.timestamp(),
    winston.format.printf(info => `[${info.level}] [script]: ${info.message}`)
  ),
  transports: [new winston.transports.Console()]
})