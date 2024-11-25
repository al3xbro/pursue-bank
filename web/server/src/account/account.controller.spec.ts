import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

describe('AccountController', () => {
  let accountController: AccountController;
  let accountService: AccountService;
  let jwtService: JwtService;

  const mockAccountService = {
    createAccount: jest.fn(),
    updateAccount: jest.fn(),
    getUserData: jest.fn(),
  };

  const mockJwtService = {
    decode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: mockAccountService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mocking AuthGuard to always allow access
      .compile();

    accountController = module.get<AccountController>(AccountController);
    accountService = module.get<AccountService>(AccountService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(accountController).toBeDefined();
  });

  describe('createAccount', () => {
    it('should call accountService.createAccount with correct parameters', async () => {
      const mockUser = {
        email: 'test@gmail.com',
        password: 'password1234',
        firstName: 'Test',
        lastName: 'User',
        address: '123 Main St',
        phone: '1234567890',
        dob: '2000-01-01',
      };
      const expectedResult = { id: 1, ...mockUser };
      mockAccountService.createAccount.mockResolvedValue(expectedResult);

      const result = await accountController.createAccount(mockUser);
      expect(accountService.createAccount).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateAccount', () => {
    it('should call accountService.updateAccount with correct parameters', async () => {
      const mockToken = 'Bearer mockToken';
      const mockData = { firstName: 'UpdatedName' };
      const mockDecodedToken = { sub: 1 };
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

      mockJwtService.decode.mockReturnValue(mockDecodedToken);
      mockAccountService.updateAccount.mockResolvedValue(expectedResult);

      const result = await accountController.updateAccount(mockToken, mockData);
      expect(jwtService.decode).toHaveBeenCalledWith('mockToken');
      expect(accountService.updateAccount).toHaveBeenCalledWith(1, mockData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUserData', () => {
    it('should call accountService.getUserData with correct parameters', async () => {
      const mockToken = 'Bearer mockToken';
      const mockDecodedToken = { sub: 1 };
      const expectedResult = {
        id: 1,
        email: 'test@gmail.com',
        password: 'password1234',
        first_name: 'Test',
        last_name: 'User',
        address: '123 Main St',
        phone: '1234567890',
        dob: '2000-01-01',
        status: 'ACTIVE',
      }

      mockJwtService.decode.mockReturnValue(mockDecodedToken);
      mockAccountService.getUserData.mockResolvedValue(expectedResult);

      const result = await accountController.getUserData(mockToken);
      expect(jwtService.decode).toHaveBeenCalledWith('mockToken');
      expect(accountService.getUserData).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
});
