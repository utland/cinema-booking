import { CreateSessionDto } from 'src/session/dto/create-session.dto';
import { TestBuilder } from './config/builder.test';
import { ITestPayload, sessionTest, tokenName } from './config/dtos.test';
import { EntityFactory } from './config/entity-factory.test';
import request from 'supertest';
import { FindSessionByMovieDto } from 'src/session/dto/find-by-movie.dto';

describe('SessionModule (e2e)', () => {
  let builder: TestBuilder;
  let entityFactory: EntityFactory;
  let tokens: Map<tokenName, ITestPayload>;
  let server: any;
  let hallId: string;
  let movieId: string;
  let createSessionDto: CreateSessionDto;

  beforeAll(async () => {
    builder = await TestBuilder.create();
    await builder.clearDb();
    
    server = builder.app.getHttpServer();

    entityFactory = new EntityFactory(builder.app, server);
    tokens = await entityFactory.createUsers();

    hallId = await entityFactory.createHall();
    movieId = await entityFactory.createMovie();

    createSessionDto = { ...sessionTest, hallId, movieId };
  }, 20000);

  afterEach(async () => {
    await builder.clearDb(["users", "halls", "movies"]);
  });

  afterAll(async () => {
    await builder.closeApp();
  });

  describe('POST /session', () => {
    it('should be available only for ADMIN', async () => {
      await request(server)
        .post('/session')
        .set('Authorization', `Bearer ${tokens.get("user")?.token}`)
        .expect(403);
    })

    it('should create a new session', async () => {
      const res = await request(server)
        .post('/session')
        .set('Authorization', `Bearer ${tokens.get('admin')?.token}`)
        .send(createSessionDto)
        .expect(201);

      expect(res.body.id).toBeDefined();
      expect(res.body.movieId).toBe(createSessionDto.movieId);
      expect(res.body.hallId).toBe(createSessionDto.hallId);
      expect(res.body.startTime).toBe(createSessionDto.startTime.toISOString());
      expect(res.body.finishTime).toBe(createSessionDto.finishTime.toISOString());
      expect(res.body.basePrice).toBe(createSessionDto.basePrice);
    });
  });

  describe('GET /session/:id', () => {
    it('should return sessions by movie', async () => {
      const sessionId = await entityFactory.createSession(createSessionDto);
      await entityFactory.createSeats(hallId, 1);

      const res = await request(server)
        .get(`/session/${sessionId}?hallId=${hallId}`)
        .set('Authorization', `Bearer ${tokens.get('user')?.token}`)
        .expect(200);

      expect(res.body.id).toBeDefined();
      expect(res.body.movieId).toBe(createSessionDto.movieId);
      expect(res.body.hallId).toBe(createSessionDto.hallId);
      expect(res.body.startTime).toBe(createSessionDto.startTime.toISOString());
      expect(res.body.finishTime).toBe(createSessionDto.finishTime.toISOString());
      expect(res.body.basePrice).toBe(createSessionDto.basePrice.toLocaleString());

      expect(res.body.hall).toBeDefined();
      expect(res.body.hall.seats).toBeDefined();
      expect(res.body.hall.seats[0].tickets).toBeDefined();
    });
  });

  describe('GET /session', () => {
    it('should return session hall by id', async () => {
      const findDto: FindSessionByMovieDto = {
        movieId,
        dateSession: new Date()
      }

      const sessionId = await entityFactory.createSession({ movieId, hallId });
      await entityFactory.createSession({ 
        movieId, hallId, startTime: new Date(Date.now() + 24 * 60 * 60 * 1000) 
      });

      const [seatId0, seatsId1] = await entityFactory.createSeats(hallId, 5);
      await entityFactory.createTicket(
        sessionId, seatId0, tokens.get("user")!.id
      );

      const res = await request(server)
        .get('/session')
        .set('Authorization', `Bearer ${tokens.get('user')?.token}`)
        .send(findDto)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);      
      expect(res.body.length).toBe(1);
      expect(res.body[0].availableSeats).toBe(4);
      expect(res.body[0].seatsNumber).toBe(5);
    });
  });

  describe('PATCH /session/:id', () => {
    const updateSessionDto = { startTime: new Date(Date.now() + 2 * 60 * 60 * 1000) };

    it('should be available only for ADMIN', async () => {
      await request(server)
        .patch('/session/1')
        .set('Authorization', `Bearer ${tokens.get("user")?.token}`)
        .expect(403);
    })

    it('should update a session', async () => {
      const sessionId = await entityFactory.createSession({ 
        movieId, 
        hallId, 
        startTime: new Date(Date.now() + 60 * 60 * 1000), 
        finishTime: new Date(Date.now() + 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
       });

      await request(builder.app.getHttpServer())
        .patch(`/session/${sessionId}`)
        .set('Authorization', `Bearer ${tokens.get('admin')?.token}`)
        .send(updateSessionDto)
        .expect(200);

      const res = await request(builder.app.getHttpServer())
        .get(`/session/${sessionId}?hallId=${hallId}`)
        .set('Authorization', `Bearer ${tokens.get('user')?.token}`)
        .expect(200);

      expect(res.body.startTime).toBe(updateSessionDto.startTime.toISOString());
    });
  });

  describe('DELETE /session/:id', () => {
    it('should be available only for ADMIN', async () => {
      await request(server)
        .delete('/session/1')
        .set('Authorization', `Bearer ${tokens.get("user")?.token}`)
        .expect(403);
    })

    it('should delete a session', async () => {
      const sessionId = await entityFactory.createSession({ 
        movieId, 
        hallId, 
        startTime: new Date(Date.now() + 60 * 60 * 1000), 
        finishTime: new Date(Date.now() + 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
       });

      await request(builder.app.getHttpServer())
        .delete(`/session/${sessionId}`)
        .set('Authorization', `Bearer ${tokens.get('admin')?.token}`)
        .expect(200);

      await request(builder.app.getHttpServer())
        .get(`/session/${sessionId}?hallId=${hallId}`)
        .set('Authorization', `Bearer ${tokens.get('user')?.token}`)
        .expect(404);
    });
  });
});