const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, updateUserPassword, uploadProfilePicture, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const multerUpload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, getAllUsers); 
router.put('/profile/password', protect, updateUserPassword); 
router.put('/profile/photo', protect, multerUpload.single('profilePicture'), uploadProfilePicture); 
router.put('/profile', protect, updateUserProfile); 

module.exports = router;