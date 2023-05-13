import { middleware_logger } from "../logger";
import { Request, Response, NextFunction } from 'express';

const log_exit = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () =>
      middleware_logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}}`)
  );
  next();
}

export default log_exit;