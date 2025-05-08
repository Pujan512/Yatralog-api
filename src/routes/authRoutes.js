import express from "express";
import {login, register, logout, check, updateProfile} from '../controllers/auth.controller.js'
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post('/login', login);
router.post('/signup', register);
router.post('/updateProfile', protectRoute, updateProfile);
router.get('/logout', logout);
router.get('/check', protectRoute, check);

export default router;