import { Request, Response } from 'express';
import { ValidationService } from '../services/ValidationService';

export class ValidationController {
  private validationService: ValidationService;

  constructor() {
    this.validationService = new ValidationService();
  }

  async validateStartup(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.validationService.validateStartup(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}