import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        required: true
    },
    description: {
        type: String,
        minlength: 10,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    images: [{
        url: String,
        public_id: String
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
},{timestamps: true})

const Blog = mongoose.model('Blog', blogSchema)

export default Blog;