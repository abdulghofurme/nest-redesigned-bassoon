import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { MockValidationService } from 'src/mock/validation';
import { MockWinston } from 'src/mock/winston';

describe('ContactService', () => {
  let service: ContactService;
  const mockPrismaService = {
    contact: {
      create: jest.fn((contact) => {
        console.log(contact);
        return {};
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: PrismaService, useValue: mockPrismaService },
        MockValidationService,
        MockWinston,
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
