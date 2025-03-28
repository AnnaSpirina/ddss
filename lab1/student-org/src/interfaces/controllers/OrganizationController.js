const OrganizationService = require('../../application/services/OrganizationService');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

class OrganizationController {
    constructor() {
        this.organizationService = new OrganizationService();
    }

    async create(req, res) {
        try {
            const organization = await this.organizationService.createOrganization(req.body);
            res.status(201).json(organization);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const organization = await this.organizationService.updateOrganization(
                req.params.id,
                req.body
            );
            res.json(organization);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const organization = await this.organizationService.getOrganization(req.params.id);
            if (!organization) {
                return res.status(404).json({ error: 'Студорганизация не найдена' });
            }
            res.json(organization);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = OrganizationController;