import { middleware_logger } from "../logger";
import { Request, Response, NextFunction } from 'express';

const log_exit = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'https://loqui-chat.xyz');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.on('finish', () =>
      middleware_logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}}`)
  );
  next();
}

export default log_exit;
