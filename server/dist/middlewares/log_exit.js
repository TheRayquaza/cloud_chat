"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
const log_exit = (req, res, next) => {
    res.on('finish', () => logger_1.middleware_logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}}`));
    next();
};
exports.default = log_exit;
//# sourceMappingURL=log_exit.js.map