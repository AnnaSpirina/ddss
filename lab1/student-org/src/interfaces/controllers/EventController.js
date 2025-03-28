const EventService = require('../../application/services/EventService');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

class EventController {
    constructor() {
        this.eventService = new EventService();
    }

    async create(req, res) {
        try {
            const event = await this.eventService.createEvent({
                ...req.body,
                organizationId: req.user.organizationId
            });
            res.status(201).json(event);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async cancel(req, res) {
        try {
            const event = await this.eventService.cancelEvent(req.params.id);
            res.json(event);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async register(req, res) {
        try {
            const registration = await this.eventService.registerForEvent(
                req.params.eventId,
                req.user.id
            );
            res.status(201).json(registration);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async cancelRegistration(req, res) {
        try {
            const result = await this.eventService.cancelRegistration(
                req.params.eventId,
                req.user.id
            );
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async markAttendance(req, res) {
        try {
            const result = await this.eventService.markAttendance(
                req.params.eventId,
                req.params.studentId
            );
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = EventController;