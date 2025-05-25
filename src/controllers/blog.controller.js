import Blog from "../models/blog.model.js"
import Comment from "../models/comment.model.js"
import cloudinary from "../lib/cloudinary.js";
export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().select("-comments");
        if(!blogs.length) {
            return res.status(404).json({message: "No blogs available"})
        }

        res.status(201).json(blogs)
    } catch (error) {
        console.log("Error getting blogs: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getBlog = async (req, res) => {
    const blogId = req.params.id;
    try {
        const blog = await Blog.findById(blogId)
                               .populate('authorId', 'fName lName profilePic')
        if(!blog){
            return res.status(404).json({message: "Blog not found"});
        }
        
        res.status(201).json(blog);
    } catch (error) {
        console.log("Error getting blog: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const postBlog = async (req, res) => {
    const {title, description} = req.body;
    const authorId = req.user._id;

    const images = req.files?.map(file => ({
        url: file.path,
        public_id: file.filename
    }))

    try {
        const newBlog = new Blog({title, description, images, authorId})

        if(!newBlog){
            return res.status(400).json({message: "Error creating blog"});
        }

        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        console.log("Error creating blog: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const editBlog = async (req, res) => {
    const userId = req.user._id;
    const blogId = req.params.id;
    const {title, description} = req.body;
    try {
        const blog = await Blog.findById(blogId);
        if(!blog) {
            return res.status(404).json({message: "Blog not found"});
        }

        if(!blog.authorId.equals(userId)){
            return res.status(401).json({message: "Unauthorized attempt to modify blog"});
        }

        if(req.files?.length){
            await Promise.all(blog.images.map(async image => {
                await cloudinary.uploader.destroy(image.public_id);
            }))
        }

        blog.title = title;
        blog.description = description;
        blog.images = req.files.map(file => ({
            url: file.path,
            public_id: file.filename
        }));

        await blog.save();
        res.status(201).json(blog);

    } catch (error) {
        console.log("Error editing the blog: ",error.message);
        res.status(500).json({message: "Internal Server Errror"});
    }
}

export const deleteBlog = async (req, res) => {
    const userId = req.user._id;
    const blogId = req.params.id;

    try {
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(404).json({message: "Blogs doesn't exist"});
        }
        
        if(!blog.authorId.equals(userId)){
            return res.status(401).json({message: "Unauthorized attempt to delete blog"});
        }
        
        if(blog.images.length){
            await Promise.all(blog.images.map(async image => {
                await cloudinary.uploader.destroy(image.public_id);
            }))
        }

        await Comment.deleteMany({blogId});
        await Blog.findByIdAndDelete(blog._id);
        res.status(201).json({message: `${blog.title} deleted successfully`});
    } catch (error) {
        console.log("Error deleting the blog: ",error.message);
        res.status(500).json({message: "Internal Server Errror"});
    }
}