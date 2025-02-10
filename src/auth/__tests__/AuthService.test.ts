import { AuthService } from '../AuthService';
import { User } from '../../models/User';
import bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      const user = await authService.registerUser(email, password);

      expect(user.email).toBe(email);
      expect(await bcrypt.compare(password, user.password)).toBe(true);
    });

    it('should throw error if user already exists', async () => {
      const email = 'existing@example.com';
      await User.create({ email, password: 'password' });

      await expect(authService.registerUser(email, 'password'))
        .rejects.toThrow('User already exists');
    });
  });

  describe('loginUser', () => {
    it('should login user and return token', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      await authService.registerUser(email, password);

      const token = await authService.loginUser(email, password);
      expect(token).toBeDefined();
    });

    it('should throw error for invalid credentials', async () => {
      await expect(authService.loginUser('wrong@email.com', 'wrongpass'))
        .rejects.toThrow('Invalid credentials');
    });
  });
});