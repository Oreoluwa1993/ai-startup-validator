import request from 'supertest';
import { app } from '../../app';
import { AuthService } from '../../auth/AuthService';

describe('Startup Validation E2E', () => {
  let authToken: string;
  const authService = new AuthService();

  beforeAll(async () => {
    // Create test user and get token
    const email = 'test@example.com';
    const password = 'password123';
    await authService.registerUser(email, password);
    authToken = await authService.loginUser(email, password);
  });

  describe('Full Validation Flow', () => {
    it('should validate a startup idea and return comprehensive results', async () => {
      const startupData = {
        idea: 'AI-powered personal finance advisor',
        market: 'FinTech',
        businessModel: 'SaaS subscription',
        targetAudience: 'Young professionals',
        competition: [
          'Traditional banks',
          'Existing fintech apps'
        ],
        revenue: {
          streams: ['Monthly subscription', 'Premium features'],
          projections: {
            year1: 100000,
            year2: 500000
          }
        }
      };

      const response = await request(app)
        .post('/api/v1/validate/startup')
        .set('Authorization', `Bearer ${authToken}`)
        .send(startupData)
        .expect(200);

      expect(response.body).toHaveProperty('validationId');
      expect(response.body).toHaveProperty('marketAnalysis');
      expect(response.body).toHaveProperty('competitiveAnalysis');
      expect(response.body).toHaveProperty('businessModelAnalysis');
      expect(response.body).toHaveProperty('riskAssessment');
      expect(response.body).toHaveProperty('recommendations');
    });
  });
});