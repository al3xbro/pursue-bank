import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    const mockSignInInfo = { email: 'test@gmail.com', password: 'pass1234' };

    it('should return an access token when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        email: 'test@gmail.com',
        password: 'pass1234',
        firstName: 'Test',
        lastName: 'User',
        address: '123 Main St',
        phone: '1234567890',
        dob: '2000-01-01',
      };
      const mockToken = 'mock-jwt-token';

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await authService.signIn(mockSignInInfo);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockSignInInfo.email },
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        accessToken: mockToken,
        accountId: mockUser.id,
      });
    });

    it('should throw an UnauthorizedException if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(authService.signIn(mockSignInInfo)).rejects.toThrow(UnauthorizedException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockSignInInfo.email },
      });
    });

    it('should throw an UnauthorizedException if password is incorrect', async () => {
      const mockUser = {
        id: 1,
        email: 'test@gmail.com',
        password: 'password1234',
        firstName: 'Test',
        lastName: 'User',
        address: '123 Main St',
        phone: '1234567890',
        dob: '2000-01-01',
      };;

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(authService.signIn(mockSignInInfo)).rejects.toThrow(UnauthorizedException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockSignInInfo.email },
      });
    });
  });
});
