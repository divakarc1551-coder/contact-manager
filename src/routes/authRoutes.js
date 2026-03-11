import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import  authentication  from '../middleware/authMiddleware.js';
import { registerValidation, loginValidation } from '../utility/validators.js';
import validate from '../middleware/validation.js';

router.post('/register', registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, loginUser);
router.get('/me', authentication, getMe);

export default router;