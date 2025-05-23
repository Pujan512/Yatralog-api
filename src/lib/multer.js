import multer from 'multer';
import cloudinary from './cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog-images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{width: 800, height: 600, crop: 'limit'}]
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
        cb(null, true);
    }
    else {
        cb({message: "Unsupported file format"}, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {fileSize: 5* 1024 * 1024},
    fileFilter: fileFilter
})

export const uploadBlogImages = upload.array('images', 5);
export default upload;