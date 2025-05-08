import express from "express";
import {login, register, logout, check} from '../controllers/auth.controller.js'
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post('/login', login)
router.post('/signup', register)
router.get('/logout', logout);
router.get('/check', protectRoute, check);

export default router;