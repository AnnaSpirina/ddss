class Event {
    constructor({ 
        id, 
        organizationId, 
        name, 
        description, 
        startDate, 
        endDate, 
        startTime, 
        endTime, 
        location, 
        status = 'active', 
        qrCode = null 
    }) {
        this.id = id;
        this.organizationId = organizationId;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.status = status;
        this.qrCode = qrCode;
    }

    cancel() {
        this.status = 'cancelled';
    }

    complete() {
        this.status = 'completed';
    }
}

module.exports = Event;