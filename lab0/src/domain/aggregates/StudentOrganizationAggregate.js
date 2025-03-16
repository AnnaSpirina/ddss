class StudentOrganizationAggregate {
    constructor(organization, leader, events = []) {
        this.organization = organization; //Сущность StudentOrganization
        this.leader = leader; //Руководитель (сущность Student)
        this.events = events; //Список мероприятий (сущности Event)
    }

    //Назначить нового руководителя
    assignLeader(newLeader) {
        if (!newLeader) {
            throw new Error('Руководитель не может быть пустым.');
        }
        this.leader = newLeader;
        this.organization.leaderId = newLeader.id;
    }

    //Добавить мероприятие
    addEvent(event) {
        if (!event) {
            throw new Error('Мероприятие не может быть пустым.');
        }
        this.events.push(event);
        this.organization.events.push(event.id);
    }

    //Отменить мероприятие
    cancelEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) {
            throw new Error('Мероприятие не найдено.');
        }
        event.cancel();
    }

    //Получить информацию об организации
    getInfo() {
        return {
            organization: this.organization,
            leader: this.leader,
            events: this.events,
        };
    }
}

module.exports = StudentOrganizationAggregate;