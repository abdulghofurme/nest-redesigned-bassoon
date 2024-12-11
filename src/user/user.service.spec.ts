import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { MockWinston } from 'src/mock/winston';
import { MockValidationService } from 'src/mock/validation';

describe('UserService', () => {
  let service: UserService;
  const mockPrismaService = {
    user: {
      count: jest.fn(() => 0),
      create: jest.fn((user) => {
        console.log(user);
        return {};
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
        MockValidationService,
        MockWinston,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
