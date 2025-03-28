const UserService = require('../../application/services/UserService');
const { authenticate } = require('../middlewares/authMiddleware');

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    async register(req, res) {
        try {
            const user = await this.userService.registerStudent(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await this.userService.login(email, password);
            res.json({ user, token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getProfile(req, res) {
        try {
            const user = await this.userService.getUserProfile(req.user.id);
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = UserController;