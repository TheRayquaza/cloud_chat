"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { middleware_logger } = require('../logger');
const log_entry = (req, res, next) => {
    middleware_logger.info(`Incoming request to ${req.originalUrl}\n` +
        `-> Headers:${JSON.stringify(req.headers)}\n` +
        `-> Body:${JSON.stringify(req.body)}`);
    next();
};
exports.default = log_entry;
//# sourceMappingURL=log_entry.js.map