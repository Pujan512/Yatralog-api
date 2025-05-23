import express from 'express';
import {deleteBlog, editBlog, getBlog, getBlogs, postBlog} from '../controllers/blog.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js';
import { uploadBlogImages } from '../lib/multer.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:id', protectRoute, getBlog);
router.post('/', protectRoute, uploadBlogImages, postBlog);
router.put('/:id', protectRoute, uploadBlogImages, editBlog);
router.delete('/:id', protectRoute, deleteBlog);

export default router;