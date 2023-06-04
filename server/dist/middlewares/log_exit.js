"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const log_exit = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://loqui-chat.xyz');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.on('finish', () => logger_1.middleware_logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}}`));
    next();
};
exports.default = log_exit;
//# sourceMappingURL=log_exit.js.map