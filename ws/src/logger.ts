import winston from 'winston'

// Create a console transport for simple info on stdout
const console_transport : winston.transports.ConsoleTransportInstance = new winston.transports.Console();

// Create a logger for DB with red colorized output
export const logger : winston.Logger = winston.createLogger({
    level: process.env.LOG !== 'true' ? 'error' : 'info',
    format: winston.format.combine(
        winston.format.colorize({all:true, colors:{info:'blue'}}),
        winston.format.timestamp()
    ),
    transports: [console_transport]
});