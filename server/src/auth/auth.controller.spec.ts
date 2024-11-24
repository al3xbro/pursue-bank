import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token when signIn is successful', async () => {
      const mockSignInData = { email: 'test@gmail.com', password: 'pass123' };
      const mockResponse = { accessToken: 'mock-jwt-token' };

      mockAuthService.signIn.mockResolvedValue(mockResponse);

      const result = await authController.signIn(mockSignInData);

      expect(authService.signIn).toHaveBeenCalledWith(mockSignInData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors thrown by AuthService', async () => {
      const mockSignInData = { email: 'test@gmail.com', password: 'wrongpassword' };
      mockAuthService.signIn.mockRejectedValue(new Error('Invalid credentials'));

      await expect(authController.signIn(mockSignInData)).rejects.toThrow('Invalid credentials');
      expect(authService.signIn).toHaveBeenCalledWith(mockSignInData);
    });
  });
});
