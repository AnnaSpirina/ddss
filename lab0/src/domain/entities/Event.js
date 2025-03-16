class Event {
    constructor(id, organizationId, name, description, startDate, endDate, location) {
        this.id = id;
        this.organizationId = organizationId;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.location = location;
        this.registrations = [];
        this.status = 'active';
    }

    cancel() {
        this.status = 'cancelled';
    }
}

module.exports = Event;