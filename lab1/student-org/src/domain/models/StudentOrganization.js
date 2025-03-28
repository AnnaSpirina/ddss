class StudentOrganization {
    constructor({ id, name, description, managerId }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.managerId = managerId;
    }

    assignManager(managerId) {
        if (!managerId) {
            throw new Error('Требуется ID менеджера');
        }
        this.managerId = managerId;
    }

    updateInfo({ name, description }) {
        if (name) this.name = name;
        if (description) this.description = description;
    }
}

module.exports = StudentOrganization;