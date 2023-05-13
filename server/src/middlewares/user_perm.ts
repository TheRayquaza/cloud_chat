import { Request, Response, NextFunction } from 'express';
const { middleware_logger } = require('../logger');
const { send_error } = require('../scripts/send');
import User from '../db/user';

export const user_perm = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    middleware_logger.info("user permissions for user " + req.headers["X-id"]);
    const id : string = req.headers["X-id"] as string;
    const user : User | null = await User.findByPk(parseInt(id));
    if (!user || user.dataValues.permission !== 1)
        send_error(res, 401, 'Unauthorized access');
    else
        next();
};