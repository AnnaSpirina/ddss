class NotificationService {
    constructor(students) {
        this.students = students;
    }

    //Отправка уведомления о регистрации на мероприятие
    sendRegistrationNotification(studentId, eventName) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            console.log(`Уведомление отправлено студенту ${student.firstName} ${student.lastName}: Вы успешно зарегистрированы на мероприятие "${eventName}".`);
        } else {
            console.log('Ошибка: Студент не найден!');
        }
    }

    //Отправка напоминания о мероприятии
    sendReminderNotification(studentId, eventName, eventDate) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            console.log(`Напоминание отправлено студенту ${student.firstName} ${student.lastName}: Мероприятие "${eventName}" состоится ${eventDate}.`);
        } else {
            console.log('Ошибка: Студент не найден!');
        }
    }
}

module.exports = NotificationService;