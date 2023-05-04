import { Request, Response, NextFunction } from 'express';
const { middleware_logger } = require('../logger');
const { send_error } = require('../scripts/send');
import User from '../db/user';

export const user_perm = (req: Request, res: Response, next: NextFunction) => {
    middleware_logger.info('user permissions');
    const id = req.headers["X-id"] as string;
    User.findByPk(parseInt(id))
    .then(user => {
        if (user && user.dataValues.permission === 1) next();
        else send_error(res, 401, 'Unauthorized access');
    });
};