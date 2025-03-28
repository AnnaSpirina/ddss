const StudentOrganizationRepository = require('../../infrastructure/repositories/StudentOrganizationRepository');

class OrganizationService {
    constructor() {
        this.organizationRepository = new StudentOrganizationRepository();
    }

    async createOrganization({ name, description, managerId }) {
        const organization = await this.organizationRepository.save({
            name,
            description,
            managerId
        });
        return organization;
    }

    async updateOrganization(id, { name, description, managerId }) {
        const organization = await this.organizationRepository.findById(id);
        if (!organization) {
            throw new Error('Organization not found');
        }

        if (name) organization.name = name;
        if (description) organization.description = description;
        if (managerId) organization.managerId = managerId;

        return this.organizationRepository.update(organization);
    }

    async getOrganization(id) {
        return this.organizationRepository.findById(id);
    }
}

module.exports = OrganizationService;