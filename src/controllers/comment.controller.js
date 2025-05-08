import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";

export const getComments = async (req, res) => {
    const blogId = req.params.id;

    try {
        const comments = await Comment.find({blogId}).populate('author', 'fName lName');
        if(!comments.length){
            return res.status(404).json({message: "Comment doesn't exist"});
        }

        res.status(201).json(comments);
    } catch (error) {
        console.log("Error getting comment: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const postComment = async (req, res) => {
    const {content, blogId} = req.body;
    const authorId = req.user._id;

    try {
        const newComment = new Comment({content, blogId, author: authorId});
        if(!newComment){
            return res.status(401).json({message: "Error creating comment"});
        }

        await newComment.save();
        await Blog.findByIdAndUpdate(blogId, {
            $push: {comments: newComment._id}
        })
        res.status(201).json(newComment);
    } catch (error) {
        console.log("Error creating comment: ",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const deleteComment = async (req, res) => {
    const userId = req.user._id;
    const commentId = req.params.id;

    try {
        const comment = await Comment.findById(commentId);
        if(!comment) {
            return res.status(404).json({message: "Comment not found"});
        }
        if(!comment.author.equals(userId)){
            return res.status(401).json({message: "Unauthorized attempt to delete comment"});
        }
        await comment.deleteOne({commentId});
        res.status(201).json({message: "Comment deleted successfully"});
    } catch (error) {
        console.log("Error deleting comment: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}