const pool = require('../../infrastructure/db/pool');

class NotificationService {
    async sendNotification(userId, message) {
        const query = `
            INSERT INTO notifications (user_id, message)
            VALUES ($1, $2)
            RETURNING *
        `;
        const values = [userId, message];
        await pool.query(query, values);
        console.log(`Notification sent to user ${userId}: ${message}`);
    }
}

module.exports = NotificationService;