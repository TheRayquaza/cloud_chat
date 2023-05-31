"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
// Create a console transport for simple info on stdout
const consoleTransport = new winston_1.transports.Console();
// Create a logger for DB with red colorized output
const logger = (0, winston_1.createLogger)({
    format: winston_1.format.combine(winston_1.format.colorize({ all: true, colors: { info: 'blue' } }), winston_1.format.timestamp(), winston_1.format.printf((info) => {
        return `[${info.level}] [ws]: ${info.message}`;
    })),
    transports: [consoleTransport],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map