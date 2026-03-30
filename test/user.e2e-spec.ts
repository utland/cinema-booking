import { UpdateUserApiDto } from 'src/presentation/user/dtos/update-user-api.dto';
import { TestBuilder } from './config/builder.test';
import { ITestPayload, tokenName } from './config/dtos.test';
import { EntityFactory } from './config/entity-factory.test';
import request from 'supertest';

describe('UserModule (e2e)', () => {
  let builder: TestBuilder;
  let entityFactory: EntityFactory;
  let tokens: Map<tokenName, ITestPayload>;
  let server: any;

  beforeAll(async () => {
    builder = await TestBuilder.create();
    server = builder.app.getHttpServer();

    entityFactory = new EntityFactory(builder.app, builder.app.getHttpServer());
    tokens = await entityFactory.createUsers();
  }, 15000);

  afterAll(async () => {
    await builder.closeApp();
  });

  describe('GET /user', () => {
    it('should return current user data', async () => {
      const response = await request(server)
        .get('/user')
        .set('Authorization', `Bearer ${tokens.get('user')?.token}`)
        .expect(200);

      expect(response.body.id).toBe(tokens.get('user')?.id);
      expect(response.body.login).toBe(tokens.get('user')?.login);
      expect(response.body.email).toBeDefined();
      expect(response.body.firstName).toBeDefined();
      expect(response.body.lastName).toBeDefined();
      expect(response.body.password).toBeUndefined();
    });
  });

  describe('PATCH /user', () => {
    it('should update current user data', async () => {
      const updateUserDto: UpdateUserApiDto = {
        firstName: 'UpdatedName',
        lastName: 'UpdatedLastName',
      };

      await request(server)
        .patch('/user')
        .set('Authorization', `Bearer ${tokens.get('user')?.token}`)
        .send(updateUserDto)
        .expect(200);

      const res = await request(server)
        .get('/user')
        .set('Authorization', `Bearer ${tokens.get('user')?.token}`)
        .expect(200);

      expect(res.body.firstName).toBe(updateUserDto.firstName);
      expect(res.body.lastName).toBe(updateUserDto.lastName);
    });
  });

  describe('DELETE /user/:id', () => {
    it ("should be available only for ADMIN", async () => {
      await request(server)
        .delete(`/user/${1}`)
        .set('Authorization', `Bearer ${tokens.get('user')?.token}`)
        .expect(403);
    })

    it('should delete an user', async () => {
      await request(server)
        .delete(`/user/${tokens.get('user')?.id}`)
        .set('Authorization', `Bearer ${tokens.get('admin')!.token}`)
        .expect(200);

      await request(server)
        .get('/user')
        .set('Authorization', `Bearer ${tokens.get('user')?.token}`)
        .expect(404);

    });
  });
});