const express = require('express');
const router = express.Router();
const locationController = require('./location.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.post('/track', authMiddleware, locationController.track);
router.get('/employee/:id', authMiddleware, locationController.getHistory);

module.exports = router;
