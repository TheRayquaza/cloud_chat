import { createLogger, format, transports, Logger } from 'winston';
import winston from 'winston'

// Create a console transport for simple info on stdout
const consoleTransport: transports.ConsoleTransportInstance = new transports.Console();

// Create a logger for DB with red colorized output
const logger: Logger = createLogger({
    format: format.combine(
        format.colorize({ all: true, colors: { info: 'blue' } }),
        format.timestamp(),
        format.printf((info : winston.Logform.TransformableInfo) => {
            return `[${info.level}] [ws]: ${info.message}`;
        })
    ),
    transports: [consoleTransport],
});

export default logger;
