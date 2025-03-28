const Event = require('../../domain/models/Event');
const pool = require('../db/pool');

class EventRepository {
    async findById(id) {
        const query = 'SELECT * FROM events WHERE id = $1';
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0] ? new Event(result.rows[0]) : null;
    }

    async findByOrganization(organizationId) {
        const query = 'SELECT * FROM events WHERE organization_id = $1';
        const values = [organizationId];
        const result = await pool.query(query, values);
        return result.rows.map(row => new Event(row));
    }

    async save(event) {
        const query = `
            INSERT INTO events (
                organization_id, name, description, start_date, end_date, 
                start_time, end_time, location, status, qr_code
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        const values = [
            event.organizationId,
            event.name,
            event.description,
            event.startDate,
            event.endDate,
            event.startTime,
            event.endTime,
            event.location,
            event.status,
            event.qrCode
        ];
        const result = await pool.query(query, values);
        return new Event(result.rows[0]);
    }

    async update(event) {
        const query = `
            UPDATE events
            SET 
                name = $1, description = $2, start_date = $3, end_date = $4,
                start_time = $5, end_time = $6, location = $7, status = $8, qr_code = $9
            WHERE id = $10
            RETURNING *
        `;
        const values = [
            event.name,
            event.description,
            event.startDate,
            event.endDate,
            event.startTime,
            event.endTime,
            event.location,
            event.status,
            event.qrCode,
            event.id
        ];
        const result = await pool.query(query, values);
        return new Event(result.rows[0]);
    }
}

module.exports = EventRepository;