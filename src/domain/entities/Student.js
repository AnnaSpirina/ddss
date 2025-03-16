class Student {
    constructor(id, firstName, lastName, middleName, email, group) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.email = email;
        this.group = group;
        this.subscriptions = [];
        this.attendedEvents = [];
    }

    //Подписаться на организацию
    subscribeToOrganization(organizationId) {
        if (!this.subscriptions.includes(organizationId)) {
            this.subscriptions.push(organizationId);
        }
    }

    //Отписаться от организации
    unsubscribeFromOrganization(organizationId) {
        this.subscriptions = this.subscriptions.filter(id => id !== organizationId);
    }

    //Проверить, подписан ли студент на организацию
    isSubscribedToOrganization(organizationId) {
        return this.subscriptions.includes(organizationId);
    }

    //Зарегистрироваться на мероприятие
    registerForEvent(eventId) {
        if (!this.attendedEvents.includes(eventId)) {
            this.attendedEvents.push(eventId);
        }
    }

    //Отписаться от мероприятия
    unregisterFromEvent(eventId) {
        this.attendedEvents = this.attendedEvents.filter(id => id !== eventId);
    }
}

module.exports = Student;