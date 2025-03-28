const request = require('supertest');
const app = require('../src/server');
const { Event, User, StudentOrganization } = require('../src/domain/models');
const pool = require('../src/infrastructure/db/pool');

describe('Event API', () => {
  let adminToken;
  let organizationId;
  let testEventId;

  beforeAll(async () => {
    await pool.query('TRUNCATE TABLE events, student_organizations, users CASCADE');

    const adminRes = await request(app)
      .post('/api/users/register')
      .send({
        email: 'admin@test.ru',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        studyGroup: 'ADMIN',
        role: 'admin'
      });
    adminToken = adminRes.body.token;

    // Создаем тестовую организацию
    const orgRes = await request(app)
      .post('/api/organizations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Org',
        description: 'For testing'
      });
    organizationId = orgRes.body.id;
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Мероприятие',
          description: 'Описание',
          startDate: '2025-03-01',
          endDate: '2025-03-01',
          startTime: '10:00:00',
          endTime: '18:00:00',
          location: 'Онлайн',
          organizationId
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      testEventId = res.body.id;
    });

    it('should reject event with invalid dates', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Invalid Event',
          startDate: '2025-01-02',
          endDate: '2025-01-01',
          startTime: '10:00:00',
          endTime: '18:00:00',
          location: 'Онлайн',
          organizationId
        });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should retrieve event details', async () => {
      const res = await request(app)
        .get(`/api/events/${testEventId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe('Мероприятие');
    });

    it('should return 404 for non-existent event', async () => {
      const res = await request(app)
        .get('/api/events/999999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST /api/events/:eventId/register', () => {
    let studentToken;

    beforeAll(async () => {
      const studentRes = await request(app)
        .post('/api/users/register')
        .send({
          email: 'student@test.ru',
          password: 'password123',
          firstName: 'Иван',
          lastName: 'Иванов',
          studyGroup: 'ПИ-21-2'
        });
      studentToken = studentRes.body.token;
    });

    it('should register student for event', async () => {
      const res = await request(app)
        .post(`/api/events/${testEventId}/register`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toEqual(201);
    });

    it('should prevent duplicate registrations', async () => {
      const res = await request(app)
        .post(`/api/events/${testEventId}/register`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should cancel an event', async () => {
      const res = await request(app)
        .delete(`/api/events/${testEventId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe('cancelled');
    });
  });
});