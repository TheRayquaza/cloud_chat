"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.script_logger = exports.middleware_logger = exports.controller_logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
// Make the console format
const make_console_format = (type) => winston_1.default.format.printf((info) => `[${info.level}] [${type}]: ${info.message}`);
// Make the file format
const make_file_format = () => winston_1.default.format.printf((info) => `[${info.level}] : ${info.message}`);
// Create a file transport for saving error into logs
const file_transport = new winston_1.default.transports.File({
    filename: path_1.default.join(__dirname, '../logs/error.log'),
    level: 'error',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), make_file_format())
});
// Create a console transport for simple info on stdout
const console_transport = new winston_1.default.transports.Console();
// Create a logger for controllers with yellow colorized output
exports.controller_logger = winston_1.default.createLogger({
    level: process.env.LOG !== 'true' ? 'error' : 'info',
    format: winston_1.default.format.combine(winston_1.default.format.colorize({ all: true, colors: { info: 'yellow' } }), winston_1.default.format.timestamp(), make_console_format('controller')),
    transports: [console_transport, file_transport]
});
// Create a logger for routes with colorized output
exports.middleware_logger = winston_1.default.createLogger({
    level: process.env.LOG !== 'true' ? 'error' : 'info',
    format: winston_1.default.format.combine(winston_1.default.format.colorize({ all: true, colors: { info: "green" } }), winston_1.default.format.timestamp(), make_console_format('middleware')),
    transports: [console_transport, file_transport]
});
// Create a logger for scripts with colorized output
exports.script_logger = winston_1.default.createLogger({
    level: process.env.LOG !== 'true' ? 'error' : 'info',
    format: winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.timestamp(), make_console_format('script')),
    transports: [console_transport, file_transport]
});
//# sourceMappingURL=logger.js.map