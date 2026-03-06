const express = require('express');
const router = express.Router();
const authRoutes = require('../modules/auth/auth.routes');
const organizationRoutes = require('../modules/organization/organization.routes');
const teamsRoutes = require('../modules/teams/teams.routes');
const employeesRoutes = require('../modules/employees/employees.routes');
const activityRoutes = require('../modules/activity/activity.routes');
const { successResponse } = require('../utils/response');

// Routes
router.use('/auth', authRoutes);
router.use('/organization', organizationRoutes);
router.use('/teams', teamsRoutes);
router.use('/employees', employeesRoutes);
router.use('/activity', activityRoutes);
router.get('/health', (req, res) => {
    return successResponse(res, null, 'Backend Running', 200);
});

module.exports = router;
