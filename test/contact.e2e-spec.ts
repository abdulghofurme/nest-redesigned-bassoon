import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestService } from './test.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { TestModule } from './test.module';
import * as request from 'supertest';

describe('ContactController (e2e', () => {
  let app: INestApplication;
  let testService: TestService;
  const username = 'testusername',
    token = 'rahasia';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);
  });

  describe('POST /api/contacts', () => {
    beforeEach(async () => {
      await testService.deleteContact(username);
      await testService.deleteUser(username);

      await testService.registerUser({
        username,
        name: 'Test Contact',
        password: 'rahasia',
        token,
      });
    });

    it('should be created', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', token)
        .send({
          first_name: 'Test Contact',
          last_name: 'Create',
          email: 'contact@email.com',
          phone: '1234',
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data.first_name).toBe('Test Contact');
      expect(response.body.data.last_name).toBe('Create');
      expect(response.body.data.email).toBe('contact@email.com');
      expect(response.body.data.phone).toBe('1234');
      expect(response.body.data.id).toBeDefined();
    });
  });

  describe('GET /api/contacts/:currentId', () => {
    beforeEach(async () => {
      await testService.deleteContact(username);
      await testService.deleteUser(username);

      await testService.registerUser({
        username,
        name: 'Test Contact',
        password: 'rahasia',
        token,
      });
    });

    afterEach(async () => {
      await testService.deleteContact(username);
      await testService.deleteUser(username);
    });

    it('should be able get one', async () => {
      const contact = await testService.createContact(username, {
        first_name: 'Test Contact',
        last_name: 'Create',
        email: 'contact@email.com',
        phone: '1234',
      });
      console.log(contact);

      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}`)
        .set('Authorization', token);

      console.log(response.body);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.first_name).toBe('Test Contact');
      expect(response.body.data.last_name).toBe('Create');
      expect(response.body.data.email).toBe('contact@email.com');
      expect(response.body.data.phone).toBe('1234');
      expect(response.body.data.id).toBeDefined();
    });
  });
});
