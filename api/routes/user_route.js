const express = require('express');
const router = express.Router();
const UserController = require('../controller/user_controller');
const tokenValidator = require('../middleware/route_protect');

router.post('/login', UserController.login);
router.post('/signup', UserController.signup);
router.get('/getUserDetails/:id', tokenValidator, UserController.getUserDetails);
router.get('/checkUserPresenceWithMobileNumber/:mobileNumber', UserController.checkUserPresenceWithMobileNumber);
router.get('/checkUserPresenceWithEmail/:email', UserController.checkUserPresenceWithEmail);

module.exports = router;