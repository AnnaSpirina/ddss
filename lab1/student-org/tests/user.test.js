const request = require('supertest');
const app = require('../src/server');
const pool = require('../src/infrastructure/db/pool');

describe('User API', () => {
    beforeAll(async () => {
        await pool.query('TRUNCATE TABLE users CASCADE');
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('POST /api/users/register', () => {
        it('should register a new student with valid HSE email', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'test@edu.hse.ru',
                    password: 'password123',
                    firstName: 'Иван',
                    lastName: 'Иванов',
                    middleName: 'Иванович',
                    studyGroup: 'ПИ-21-2'
                });
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe('test@edu.hse.ru');
        });

        it('should reject registration with non-HSE email', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({
                    email: 'test@gmail.com',
                    password: 'password123',
                    firstName: 'Иван',
                    lastName: 'Иванов',
                    studyGroup: 'ПИ-21-2'
                });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Разрешены только корпоративные электронные письма HSE');
        });
    });

    describe('POST /api/users/login', () => {
        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'test@edu.hse.ru',
                    password: 'password123'
                });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe('test@edu.hse.ru');
        });

        it('should reject login with invalid password', async () => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: 'test@edu.hse.ru',
                    password: 'wrongpassword'
                });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Неверный пароль');
        });
    });
});