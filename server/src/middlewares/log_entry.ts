import { Request, Response, NextFunction } from 'express';
const { middleware_logger } = require('../logger');

const log_entry = (req: Request, res: Response, next: NextFunction) => {
    middleware_logger.info(
        `Incoming request to ${req.originalUrl}\n` +
        `-> Headers:${JSON.stringify(req.headers)}\n` +
        `-> Body:${JSON.stringify(req.body)}`
    );

    next();
};

export default log_entry;