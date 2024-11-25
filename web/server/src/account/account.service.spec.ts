import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { AccountPostgresService } from './postgres/account.postgres.service';
import { BadRequestException } from '@nestjs/common';

describe('AccountService', () => {
  let accountService: AccountService;
  let accountPostgresService: AccountPostgresService;

  const mockAccountPostgresService = {
    emailAlreadyInUse: jest.fn(),
    createAccount: jest.fn(),
    updateAccount: jest.fn(),
    getUserFromId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: AccountPostgresService,
          useValue: mockAccountPostgresService,
        },
      ],
    }).compile();

    accountService = module.get<AccountService>(AccountService);
    accountPostgresService = module.get<AccountPostgresService>(AccountPostgresService);
  });

  it('should be defined', () => {
    expect(accountService).toBeDefined();
  });

  describe('createAccount', () => {
    it('should throw an error if the email is already in use', async () => {
      mockAccountPostgresService.emailAlreadyInUse.mockResolvedValue(true);

      const mockData = {
        email: 'test@gmail.com',
        password: 'password1234',
        firstName: 'Test',
        lastName: 'User',
        address: '123 Main St',
        phone: '1234567890',
        dob: '2000-01-01',
      };

      await expect(accountService.createAccount(mockData)).rejects.toThrow(
        new BadRequestException('Email already has a linked account. Forgot your password?'),
      );

      expect(accountPostgresService.emailAlreadyInUse).toHaveBeenCalledWith(mockData.email);
      expect(accountPostgresService.createAccount).not.toHaveBeenCalled();
    });

    it('should call accountPostgresService.createAccount with correct parameters', async () => {
      mockAccountPostgresService.emailAlreadyInUse.mockResolvedValue(false);

      const mockData = {
        email: 'test@gmail.com',
        password: 'password1234',
        firstName: 'Test',
        lastName: 'User',
        address: '123 Main St',
        phone: '1234567890',
        dob: '2000-01-01',
      };
      const expectedResult = { id: 1, ...mockData };

      mockAccountPostgresService.createAccount.mockResolvedValue(expectedResult);

      const result = await accountService.createAccount(mockData);
      expect(accountPostgresService.emailAlreadyInUse).toHaveBeenCalledWith(mockData.email);
      expect(accountPostgresService.createAccount).toHaveBeenCalledWith({
        email: mockData.email,
        password: mockData.password,
        first_name: mockData.firstName,
        last_name: mockData.lastName,
        address: mockData.address,
        phone: mockData.phone,
        dob: mockData.dob,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateAccount', () => {
    it('should call accountPostgresService.updateAccount with correct parameters', async () => {
      const mockUid = 1;
      const mockData = { firstName: 'UpdatedName' };
      const expectedResult = { 
        id: 1,
        email: 'test@gmail.com',
        password: 'password1234',
        first_name: 'UpdatedName',
        last_name: 'User',
        address: '123 Main St',
        phone: '1234567890',
        dob: '2000-01-01',
        status: 'ACTIVE',
      };

      mockAccountPostgresService.updateAccount.mockResolvedValue(expectedResult);

      const result = await accountService.updateAccount(mockUid, mockData);
      expect(accountPostgresService.updateAccount).toHaveBeenCalledWith(mockUid, {
        email: undefined,
        password: undefined,
        first_name: mockData.firstName,
        last_name: undefined,
        address: undefined,
        phone: undefined,
        dob: undefined,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUserData', () => {
    it('should throw an error if no user is found', async () => {
      const mockUid = 1;
      mockAccountPostgresService.getUserFromId.mockResolvedValue(null);

      await expect(accountService.getUserData(mockUid)).rejects.toThrow(
        new BadRequestException('No user found'),
      );

      expect(accountPostgresService.getUserFromId).toHaveBeenCalledWith(mockUid);
    });

    it('should return user data if found', async () => {
      const mockUid = 1;
      const expectedResult = {
        id: 1,
        email: 'test@gmail.com',
        password: 'password1234',
        first_name: 'Test',
        last_name: 'User',
        address: '123 Main St',
        phone: '1234567890',
        dob: '2000-01-01',
      };

      mockAccountPostgresService.getUserFromId.mockResolvedValue(expectedResult);

      const result = await accountService.getUserData(mockUid);
      expect(accountPostgresService.getUserFromId).toHaveBeenCalledWith(mockUid);
      expect(result).toEqual(expectedResult);
    });
  });
});
