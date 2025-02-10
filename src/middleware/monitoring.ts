import { Request, Response, NextFunction } from 'express';
import { MetricsCollector } from '../monitoring/MetricsCollector';
import logger from '../utils/logger';

export const monitorRequest = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    MetricsCollector.getInstance().trackRequest(req, res, duration);

    logger.info('Request processed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration
    });
  });

  next();
};