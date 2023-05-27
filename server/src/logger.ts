import winston from 'winston'
import path from 'path'

// Make the console format
const make_console_format = (type : string) : winston.Logform.Format =>
    winston.format.printf((info : winston.Logform.TransformableInfo) => `[${info.level}] [${type}]: ${info.message}`)

// Make the file format
const make_file_format = () : winston.Logform.Format =>
    winston.format.printf((info : winston.Logform.TransformableInfo) => `[${info.level}] : ${info.message}`)

// Create a file transport for saving error into logs
const file_transport = new winston.transports.File({
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        make_file_format()
    )
});

// Create a console transport for simple info on stdout
const console_transport : winston.transports.ConsoleTransportInstance = new winston.transports.Console();

// Create a logger for controllers with yellow colorized output
export const controller_logger : winston.Logger = winston.createLogger({
  level: process.env.LOG !== 'true' ? 'error' : 'info',
  format: winston.format.combine(
      winston.format.colorize({all:true, colors:{info:'yellow'}}),
      winston.format.timestamp(),
      make_console_format('controller')
  ),
  transports: [console_transport, file_transport]
})

// Create a logger for routes with colorized output
export const middleware_logger : winston.Logger = winston.createLogger({
    level: process.env.LOG !== 'true' ? 'error' : 'info',
    format: winston.format.combine(
      winston.format.colorize({all:true, colors:{info:"green"}}),
      winston.format.timestamp(),
      make_console_format('middleware')
    ),
    transports: [console_transport, file_transport]
})

// Create a logger for scripts with colorized output
export const script_logger : winston.Logger = winston.createLogger({
  level: process.env.LOG !== 'true' ? 'error' : 'info',
  format: winston.format.combine(
    winston.format.colorize({all:true}),
    winston.format.timestamp(),
    make_console_format('script')
  ),
  transports: [console_transport, file_transport]
})