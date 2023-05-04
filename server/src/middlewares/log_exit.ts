import { middleware_logger } from "../logger";
import { Request, Response, NextFunction } from 'express';
import { CustomResponse } from "../types/CustomResponse";

const log_exit = (req: Request, res: CustomResponse, next: NextFunction) => {
  res.on('finish', () =>
      middleware_logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${res.body ? JSON.stringify(res.body) : ''}`)
  );
  next();
}

export default log_exit;