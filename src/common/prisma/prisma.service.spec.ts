import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { MockWinston } from 'src/mock/winston';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, MockWinston],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
