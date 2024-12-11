import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let testService: TestService;
  const username = 'testusername';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);
  });

  describe('POST /api/users', () => {
    beforeEach(() => {
      testService.deleteUser(username);
    });

    afterEach(() => {
      testService.deleteUser(username);
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: '',
          password: '',
          name: '',
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username,
          password: 'password',
          name: 'Test User',
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data.username).toBe(username);
    });

    it('should be rejected id username already exists', async () => {
      await testService.registerUser({
        username,
        password: '123',
        name: 'User',
      });
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username,
          password: 'password',
          name: 'Test User',
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
    });
  });
});
