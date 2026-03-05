const authService = require('./auth.service');
const { successResponse, errorResponse } = require('../../utils/response');
const { registerSchema, loginSchema } = require('./auth.validation');

const register = async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const result = await authService.register(validatedData);
        return successResponse(res, result, 'User registered successfully', 201);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const result = await authService.login(email, password);
        return successResponse(res, result, 'Login successful');
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user.userId);
        return successResponse(res, user, 'User profile retrieved');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
};
