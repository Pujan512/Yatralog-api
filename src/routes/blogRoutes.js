import express from 'express';
import {deleteBlog, editBlog, getBlog, getBlogs, postBlog} from '../controllers/blog.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:id', protectRoute, getBlog);
router.post('/', protectRoute, postBlog);
router.put('/:id', protectRoute, editBlog);
router.delete('/:id', protectRoute, deleteBlog);

export default router;