import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RegisterUserRequest } from 'src/model/user.model';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    register: jest.fn((request: RegisterUserRequest) => {
      return {
        username: request.username,
        name: request.name,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const result = await controller.register({
      name: 'Test',
      password: 'rahasia',
      username: 'username',
    });
    console.log(result)
    expect(result).toEqual({ data: { username: 'username', name: 'Test' } });
  });
});
