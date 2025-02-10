import express from 'express';
import validationRoutes from './routes/validation';
import { errorHandler } from './middleware/error';
import { authenticate } from './middleware/auth';

const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/v1/validate', authenticate, validationRoutes);

// Error handling
app.use(errorHandler);

export default app;