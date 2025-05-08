import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true,
    },
    mName: {
        type: String,
    },
    lName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    profilePic: {
        type: String,
        default: ''
    },
    imageId: {
        type: String,
        default: ''
    }
},{timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;