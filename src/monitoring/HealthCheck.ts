import { Response } from 'express';
import mongoose from 'mongoose';

export class HealthCheck {
  static async check(res: Response): Promise<void> {
    try {
      const healthCheck = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        mongoDB: mongoose.connection.readyState === 1,
        message: 'OK',
        status: 200
      };
      res.status(200).json(healthCheck);
    } catch (error) {
      res.status(503).json({
        uptime: process.uptime(),
        timestamp: Date.now(),
        message: 'Service Unavailable',
        status: 503
      });
    }
  }
}