import { Test, TestingModule } from '@nestjs/testing';
import { AccountPostgresService } from './account.postgres.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RecurringTransactionStatus, User } from 'generated/client';

describe('AccountPostgresService', () => {
  let accountPostgresService: AccountPostgresService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountPostgresService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    accountPostgresService = module.get<AccountPostgresService>(AccountPostgresService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(accountPostgresService).toBeDefined();
  });

  describe('createAccount', () => {
    it('should call prismaService.user.create with correct parameters', async () => {
      const mockData = {
        email: 'test@gmail.com',
        password: 'password1234',
        first_name: 'Test',
        last_name: 'User',
        address: '123 Main St',
        phone: '1234567890',
        dob: '2000-01-01',
      };
      const expectedResult = { id: 1, ...mockData };

      mockPrismaService.user.create.mockResolvedValue(expectedResult);

      const result = await accountPostgresService.createAccount(mockData);
      expect(prismaService.user.create).toHaveBeenCalledWith({ data: mockData });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('emailAlreadyInUse', () => {
    it('should return true if email is already in use', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue({ id: 1 });

      const result = await accountPostgresService.emailAlreadyInUse('test@gmail.com');
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({ where: { email: 'test@gmail.com' } });
      expect(result).toBe(true);
    });

    it('should return false if email is not in use', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await accountPostgresService.emailAlreadyInUse('newuser@gmail.com');
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({ where: { email: 'newuser@gmail.com' } });
      expect(result).toBe(false);
    });
  });

  describe('getUserFromEmail', () => {
    it('should return user data if email exists', async () => {
      const mockUser = {
        id: 1,
        email: 'test@gmail.com',
        password: 'password1234',
        first_name: 'Test',
        last_name: 'User',
        address: '123 Main St',
        phone: '1234567890',
        dob: '2000-01-01',
        status: RecurringTransactionStatus.ACTIVE,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await accountPostgresService.getUserFromEmail('test@gmail.com');
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@gmail.com' } });
      expect(result).toEqual(mockUser);
    });

    it('should return null if email does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await accountPostgresService.getUserFromEmail('unknown@gmail.com');
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: 'unknown@gmail.com' } });
      expect(result).toBeNull();
    });
  });

  describe('getUserFromId', () => {
    it('should return user data if user exists', async () => {
      const mockUser = {
        id: 1,
        email: 'test@gmail.com',
        password: 'password1234',
        first_name: 'Test',
        last_name: 'User',
        address: '123 Main St',
        phone: '1234567890',
        dob: '2000-01-01',
        status: RecurringTransactionStatus.ACTIVE,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await accountPostgresService.getUserFromId(1);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await accountPostgresService.getUserFromId(2);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(result).toBeNull();
    });
  });

  describe('getEmailFromUserId', () => {
    it('should return email if user exists', async () => {
      const mockUser = {
        id: 1,
        email: 'test@gmail.com',
        password: 'password1234',
        first_name: 'Test',
        last_name: 'User',
        address: '123 Main St',
        phone: '1234567890',
        dob: '2000-01-01',
        status: RecurringTransactionStatus.ACTIVE,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await accountPostgresService.getEmailFromUserId(1);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe('test@gmail.com');
    });

    it('should return undefined if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await accountPostgresService.getEmailFromUserId(2);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(result).toBeUndefined();
    });
  });

  describe('updateAccount', () => {
    it('should update and return user if user exists', async () => {
      const mockUid = 1;
      const mockData = { first_name: 'UpdatedName' };
      const mockUser = {
        id: 1,
        email: 'test@gmail.com',
        password: 'password1234',
        first_name: 'Test',
        last_name: 'User',
        address: '123 Main St',
        phone: '1234567890',
        dob: '2000-01-01',
        status: RecurringTransactionStatus.ACTIVE,
      };

      jest.spyOn(accountPostgresService, 'getUserFromId').mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({ ...mockUser, first_name: 'UpdatedName' });

      const result = await accountPostgresService.updateAccount(mockUid, mockData);
      expect(accountPostgresService.getUserFromId).toHaveBeenCalledWith(mockUid);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUid },
        data: mockData,
      });
      expect(result).toEqual({ ...mockUser, first_name: 'UpdatedName' });
    });

    it('should return null if user does not exist', async () => {
      const mockUid = 2;
      const mockData = { first_name: 'UpdatedName' };
      jest.spyOn(accountPostgresService, 'getUserFromId').mockResolvedValue(null);
      mockPrismaService.user.update.mockResolvedValue(null);

      const result = await accountPostgresService.updateAccount(mockUid, mockData);
      expect(accountPostgresService.getUserFromId).toHaveBeenCalledWith(mockUid);
      //expect(prismaService.user.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});