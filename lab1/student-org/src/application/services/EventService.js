const EventRepository = require('../../infrastructure/repositories/EventRepository');
const QRCodeService = require('../../interfaces/services/QRCodeService');
const NotificationService = require('../../interfaces/services/NotificationService');
const UserRepository = require('../../infrastructure/repositories/UserRepository');

class EventService {
    constructor() {
        this.eventRepository = new EventRepository();
        this.qrCodeService = new QRCodeService();
        this.notificationService = new NotificationService();
        this.userRepository = new UserRepository();
    }

    async createEvent(eventData) {
        //Генерация QR-кода
        const qrData = `event:${eventData.name}|org:${eventData.organizationId}|date:${eventData.startDate}`;
        const qrCode = await this.qrCodeService.generateQRCode(qrData);

        const event = await this.eventRepository.save({
            ...eventData,
            qrCode
        });

        return event;
    }

    async cancelEvent(eventId) {
        const event = await this.eventRepository.findById(eventId);
        if (!event) {
            throw new Error('Мероприятие не найдено');
        }

        event.cancel();
        await this.eventRepository.update(event);

        //Отправка уведомлений зарегистрированным пользователям
        const registrations = await this.getEventRegistrations(eventId);
        for (const registration of registrations) {
            await this.notificationService.sendNotification(
                registration.student_id,
                `Event "${event.name}" has been cancelled`
            );
        }

        return event;
    }

    async registerForEvent(eventId, studentId) {
        const query = `
            INSERT INTO event_registrations (event_id, student_id)
            VALUES ($1, $2)
            ON CONFLICT (event_id, student_id) DO NOTHING
            RETURNING *
        `;
        const values = [eventId, studentId];
        const result = await pool.query(query, values);

        //Отправка уведомления
        const event = await this.eventRepository.findById(eventId);
        await this.notificationService.sendNotification(
            studentId,
            `You have successfully registered for event "${event.name}"`
        );

        return result.rows[0];
    }

    async cancelRegistration(eventId, studentId) {
        const query = `
            DELETE FROM event_registrations
            WHERE event_id = $1 AND student_id = $2
            RETURNING *
        `;
        const values = [eventId, studentId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async getEventRegistrations(eventId) {
        const query = 'SELECT * FROM event_registrations WHERE event_id = $1';
        const values = [eventId];
        const result = await pool.query(query, values);
        return result.rows;
    }

    async markAttendance(eventId, studentId) {
        const query = `
            UPDATE event_registrations
            SET attended = TRUE
            WHERE event_id = $1 AND student_id = $2
            RETURNING *
        `;
        const values = [eventId, studentId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}

module.exports = EventService;