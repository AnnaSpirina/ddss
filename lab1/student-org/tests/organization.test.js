const request = require('supertest');
const app = require('../src/server');
const pool = require('../src/infrastructure/db/pool');
const jwt = require('jsonwebtoken');

describe('Organization API', () => {
    let adminToken;
    let adminId;

    beforeAll(async () => {
        await pool.query('TRUNCATE TABLE users CASCADE');
        await pool.query('TRUNCATE TABLE student_organizations CASCADE');

        //Создание тестового администратора
        const hashedPassword = await bcrypt.hash('adminpassword', 10);
        const adminRes = await pool.query(
            'INSERT INTO users (email, password, first_name, last_name, study_group, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            ['admin@edu.hse.ru', hashedPassword, 'Admin', 'User', 'ADMIN001', 'admin']
        );
        adminId = adminRes.rows[0].id;
        adminToken = jwt.sign(
            { id: adminId, email: 'admin@edu.hse.ru', role: 'admin' },
            process.env.JWT_SECRET
        );
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('POST /api/organizations', () => {
        it('should create a new organization with admin role', async () => {
            const response = await request(app)
                .post('/api/organizations')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Test Org',
                    description: 'Test Description',
                    managerId: adminId
                });
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe('Test Org');
        });

        it('should reject creation without admin role', async () => {
            //Создаем обычного пользователя
            const hashedPassword = await bcrypt.hash('userpassword', 10);
            const userRes = await pool.query(
                'INSERT INTO users (email, password, first_name, last_name, study_group) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                ['user@edu.hse.ru', hashedPassword, 'Regular', 'User', 'ПИ-21-2']
            );
            const userToken = jwt.sign(
                { id: userRes.rows[0].id, email: 'user@edu.hse.ru', role: 'student' },
                process.env.JWT_SECRET
            );

            const response = await request(app)
                .post('/api/organizations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Test Org 2',
                    description: 'Test Description 2',
                    managerId: adminId
                });
            
            expect(response.status).toBe(403);
            expect(response.body.error).toContain('Access denied');
        });
    });
});