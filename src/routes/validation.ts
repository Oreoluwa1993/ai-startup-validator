import { Router } from 'express';
import { ValidationController } from '../controllers/ValidationController';

const router = Router();
const controller = new ValidationController();

router.post('/startup', controller.validateStartup.bind(controller));

export default router;