const Event = require('../src/domain/entities/Event');

describe('Event Class', () => {
    let event;

    beforeEach(() => {
        event = new Event(1, 1, 'Мероприятие 1', 'Описание', '2025-01-01', '2025-01-02', 'Место');
    });

    test('should create an event with correct properties', () => {
        expect(event.id).toBe(1);
        expect(event.organizationId).toBe(1);
        expect(event.name).toBe('Мероприятие 1');
        expect(event.description).toBe('Описание');
        expect(event.startDate).toBe('2025-01-01');
        expect(event.endDate).toBe('2025-01-02');
        expect(event.location).toBe('Место');
        expect(event.registrations).toEqual([]);
        expect(event.status).toBe('active');
    });

    test('should cancel an event', () => {
        event.cancel();
        expect(event.status).toBe('cancelled');
    });
});