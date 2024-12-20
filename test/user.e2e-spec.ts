import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController (e2e)', () => {
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
    beforeEach(async () => {
      await testService.deleteUser(username);
    });

    afterEach(async () => {
      await testService.deleteUser(username);
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

  describe('POST /api/users/login', () => {
    const password = 'password',
      name = 'Your Name';

    beforeEach(async () => {
      await testService.deleteUser(username);
      await testService.registerUser({
        username,
        name,
        password,
      });
    });

    afterEach(async () => {
      await testService.deleteUser(username);
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '',
          password: '',
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username,
          password,
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.username).toBe(username);
      expect(response.body.data.name).toBe(name);
      expect(response.body.data.token).toBeDefined();
    });

    it('should be rejected if username not exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'nganu',
          password,
        });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if password wrong', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username,
          password: 'nganu',
        });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'nganu',
          password: 'nganu',
        });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/users/current', () => {
    const password = 'password',
      name = 'Your Name',
      token = 'test';

    beforeEach(async () => {
      await testService.deleteUser(username);
      await testService.registerUser({
        username,
        name,
        password,
        token,
      });
    });

    afterEach(async () => {
      await testService.deleteUser(username);
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'wrong');

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get current user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', token);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.username).toBe(username);
      expect(response.body.data.name).toBe(name);
    });
  });

  describe('PATCH /api/users/current', () => {
    const password = 'password',
      name = 'Your Name',
      token = 'test';

    beforeEach(async () => {
      await testService.deleteUser(username);
      await testService.registerUser({
        username,
        name,
        password,
        token,
      });
    });

    afterEach(async () => {
      await testService.deleteUser(username);
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', token)
        .send({
          name: '',
          password: '',
        });

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'wrong')
        .send({
          name: '',
          password: '',
        });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors).toBeDefined();
    });

    it('should be updated with new name', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', token)
        .send({
          name: 'Name updated',
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.name).toBe('Name updated');
    });

    it('should be updated with new password', async () => {
      let response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', token)
        .send({
          password: 'password updated',
        });

      response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username,
          password: 'password updated',
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('DELETE /api/users/current', () => {
    const password = 'password',
      name = 'Your Name',
      token = 'test';

    beforeEach(async () => {
      await testService.deleteUser(username);
      await testService.registerUser({
        username,
        name,
        password,
        token,
      });
    });

    afterEach(async () => {
      await testService.deleteUser(username);
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set('Authorization', 'wrong');

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors).toBeDefined();
    });

    it('should be loged out', async () => {
      let response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set('Authorization', token);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toBeTruthy();

      response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', token);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors).toBeDefined();
    });
  });
});
