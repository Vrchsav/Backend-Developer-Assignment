const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getProfile, 
    updateProfile, 
    updatePassword 
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (no authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (authentication required)
router.use(authMiddleware); 
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);

module.exports = router; 