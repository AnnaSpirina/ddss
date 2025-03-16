const Student = require('../src/domain/entities/Student.js');

describe('Student Class', () => {
    let student;

    beforeEach(() => {
        student = new Student(1, 'Анна', 'Спирина', 'Михайловна', 'amspirina@edu.hse.ru', 'ПИ-21-2');
    });

    test('should create a student with correct properties', () => {
        expect(student.id).toBe(1);
        expect(student.firstName).toBe('Анна');
        expect(student.lastName).toBe('Спирина');
        expect(student.middleName).toBe('Михайловна');
        expect(student.email).toBe('amspirina@edu.hse.ru');
        expect(student.group).toBe('ПИ-21-2');
        expect(student.subscriptions).toEqual([]);
        expect(student.attendedEvents).toEqual([]);
    });

    test('should subscribe to an organization', () => {
        student.subscribeToOrganization(1);
        expect(student.subscriptions).toContain(1);
    });

    test('should not subscribe to the same organization twice', () => {
        student.subscribeToOrganization(1);
        student.subscribeToOrganization(1);
        expect(student.subscriptions).toHaveLength(1);
    });

    test('should unsubscribe from an organization', () => {
        student.subscribeToOrganization(1);
        student.unsubscribeFromOrganization(1);
        expect(student.subscriptions).not.toContain(1);
    });

    test('should check if subscribed to an organization', () => {
        student.subscribeToOrganization(1);
        expect(student.isSubscribedToOrganization(1)).toBe(true);
        expect(student.isSubscribedToOrganization(2)).toBe(false);
    });

    test('should register for an event', () => {
        student.registerForEvent(1);
        expect(student.attendedEvents).toContain(1);
    });

    test('should not register for the same event twice', () => {
        student.registerForEvent(1);
        student.registerForEvent(1);
        expect(student.attendedEvents).toHaveLength(1);
    });

    test('should unregister from an event', () => {
        student.registerForEvent(1);
        student.unregisterFromEvent(1);
        expect(student.attendedEvents).not.toContain(1);
    });
});