class StudentOrganization {
    constructor(id, name, description, leaderId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.leaderId = leaderId;
        this.members = [];
        this.events = [];
    }

    assignLeader(studentId) {
        this.leaderId = studentId;
    }

    addMember(studentId) {
        this.members.push(studentId);
    }

    addEvent(eventId) {
        this.events.push(eventId);
    }
}

module.exports = StudentOrganization;