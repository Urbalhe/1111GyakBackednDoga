import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { AppService } from './../src/app.service.js';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useValue({
        szabalyLista: async () => [
          { id: 1, priority: 1, mac: '00:11:22:33:44:55', enabled: true },
        ],
        ujSzabaly: async () => undefined,
      })
      .compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    app.setBaseViewsDir(join(import.meta.dirname, '..', 'views'));
    app.setViewEngine('ejs');
    await app.init();
  });

  it('lists firewall rules', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(/00:11:22:33:44:55/);
  });

  it('adds a rule and returns to the list', () => {
    return request(app.getHttpServer())
      .post('/uj-szabaly')
      .type('form')
      .send({ priority: '2', mac: '00:11:22:33:44:66', enabled: 'on' })
      .expect(302)
      .expect('Location', '/');
  });

  afterEach(async () => {
    await app.close();
  });
});
