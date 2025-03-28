const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const OrganizationController = require('../controllers/OrganizationController');
const EventController = require('../controllers/EventController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const userController = new UserController();
const organizationController = new OrganizationController();
const eventController = new EventController();

//User routes
router.post('/users/register', userController.register.bind(userController));
router.post('/users/login', userController.login.bind(userController));
router.get('/users/me', authenticate, userController.getProfile.bind(userController));

//Organization routes
router.post('/organizations', 
    authenticate, 
    authorize(['admin']), 
    organizationController.create.bind(organizationController)
);
router.put('/organizations/:id', 
    authenticate, 
    authorize(['admin']), 
    organizationController.update.bind(organizationController)
);
router.get('/organizations/:id', organizationController.getById.bind(organizationController));

//Event routes
router.post('/events', 
    authenticate, 
    authorize(['content_manager']), 
    eventController.create.bind(eventController)
);
router.put('/events/:id/cancel', 
    authenticate, 
    authorize(['content_manager']), 
    eventController.cancel.bind(eventController)
);
router.post('/events/:eventId/register', 
    authenticate, 
    eventController.register.bind(eventController)
);
router.delete('/events/:eventId/register', 
    authenticate, 
    eventController.cancelRegistration.bind(eventController)
);
router.post('/events/:eventId/attend/:studentId', 
    authenticate, 
    authorize(['content_manager']), 
    eventController.markAttendance.bind(eventController)
);

module.exports = router;