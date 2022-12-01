import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(() => {
    app.close();
  });

  it('(POST) /user/signup', () => {
    return request(app.getHttpServer())
      .post('/user/signup')
      .send({ email: 'm@m.com', password: 'password' })
      .expect(201)
      .then((res) => {
        expect(res.body.accessToken).toBeDefined();
      });
  });
});
