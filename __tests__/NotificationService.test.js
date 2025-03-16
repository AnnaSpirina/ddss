const NotificationService = require('../src/domain/services/NotificationService');
const Student = require('../src/domain/entities/Student');

describe('NotificationService Class', () => {
    let students, notificationService;

    beforeEach(() => {
        students = [
            new Student(1, 'Анна', 'Спирина', 'Михайловна', 'amspirina@edu.hse.ru', 'ПИ-21-2'),
            new Student(2, 'Иван', 'Иванов', '', 'iiivanov@edu.hse.ru', 'РИС-22-1'),
        ];
        notificationService = new NotificationService(students);
    });

    test('should send registration notification', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        notificationService.sendRegistrationNotification(1, 'Мероприятие 1');
        expect(consoleSpy).toHaveBeenCalledWith(
            'Уведомление отправлено студенту Анна Спирина: Вы успешно зарегистрированы на мероприятие "Мероприятие 1".'
        );
    });

    test('should send reminder notification', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        notificationService.sendReminderNotification(2, 'Мероприятие 2', '2025-01-01');
        expect(consoleSpy).toHaveBeenCalledWith(
            'Напоминание отправлено студенту Иван Иванов: Мероприятие "Мероприятие 2" состоится 2025-01-01.'
        );
    });

    test('should handle non-existent student', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        notificationService.sendRegistrationNotification(3, 'Мероприятие 1');
        expect(consoleSpy).toHaveBeenCalledWith('Ошибка: Студент не найден!');
    });
});