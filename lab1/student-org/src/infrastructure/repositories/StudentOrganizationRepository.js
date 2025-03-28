const StudentOrganization = require('../../domain/models/StudentOrganization');
const pool = require('../db/pool');

class StudentOrganizationRepository {
    async findById(id) {
        const query = 'SELECT * FROM student_organizations WHERE id = $1';
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0] ? new StudentOrganization(result.rows[0]) : null;
    }

    async save(organization) {
        const query = `
            INSERT INTO student_organizations (name, description, manager_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [
            organization.name,
            organization.description,
            organization.managerId
        ];
        const result = await pool.query(query, values);
        return new StudentOrganization(result.rows[0]);
    }

    async update(organization) {
        const query = `
            UPDATE student_organizations
            SET name = $1, description = $2, manager_id = $3
            WHERE id = $4
            RETURNING *
        `;
        const values = [
            organization.name,
            organization.description,
            organization.managerId,
            organization.id
        ];
        const result = await pool.query(query, values);
        return new StudentOrganization(result.rows[0]);
    }
}

module.exports = StudentOrganizationRepository;