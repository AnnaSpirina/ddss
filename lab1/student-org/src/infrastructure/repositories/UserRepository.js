const { Pool } = require('pg');
const User = require('../../domain/models/User');
const pool = require('../db/pool');

class UserRepository {
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const result = await pool.query(query, values);
        return result.rows[0] ? new User(result.rows[0]) : null;
    }

    async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0] ? new User(result.rows[0]) : null;
    }

    async save(user) {
        const query = `
            INSERT INTO users (email, password, first_name, last_name, middle_name, study_group, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const values = [
            user.email,
            user.password,
            user.firstName,
            user.lastName,
            user.middleName,
            user.studyGroup,
            user.role || 'student'
        ];
        const result = await pool.query(query, values);
        return new User(result.rows[0]);
    }
}

module.exports = UserRepository;