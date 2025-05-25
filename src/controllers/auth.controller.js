import bcrypt from "bcryptjs";
import User from '../models/user.model.js'
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        generateToken(user._id, res);

        res.status(201).json({
            _id: user._id,
            fName: user.fName,
            mName: user.mName,
            lName: user.lName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const register = async (req, res) => {
    const { fName, mName, lName, email, password } = req.body;
    try {
        if(!fName) return res.status(401).json({message: "First Name is required"});
        if(!lName) return res.status(401).json({message: "Last Name is required"});
        if(!email) return res.status(401).json({message: "Email is required"});
        if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) return res.status(401).json({message: "Invalid email"});
        if(password.length < 8) return res.status(401).json({message: "Password must be at least 8 character long"});
        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) return res.status(401).json({message: "Password must have at least one uppercase, lowercase, number and special character"});

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fName, mName, lName, email, password: hashedPassword })

        if (newUser) {
            generateToken(newUser._id, res)

            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                fName: newUser.fName,
                mName: newUser.mName,
                lName: newUser.lName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            return res.status(401).json({ message: "Invalid User data" })
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie('jwt', '', {maxAge:0});
        res.status(201).json({message: "Logged Out Successfully."})
    } catch (error) {
        console.log("Error logging out: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const check = (req, res) => {
    try {
        res.status(201).json(req.user)
    } catch (error) {
        console.log("Error checking for user: ", error.message);
        res.status(500).json({message: "Internal Server Errror"});
    }
}

export const updateProfile = async (req, res) => {
    const userId = req.user._id;
    const imageId = req.user.imageId;
    const {image} =  req.body;
    
    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(401).json({message: "Unauthorized attempt to upload image"});
        }
        
        if(imageId)
            await cloudinary.uploader.destroy(imageId);
        const uploadImage = await cloudinary.uploader.upload(image)
        const imgUrl = uploadImage.secure_url;
        const publicId = uploadImage.public_id;
        
        user.profilePic = imgUrl;
        user.imageId = publicId;
        await user.save();
        
        res.status(201).json({
            _id: user._id,
            fName: user.fName,
            mName: user.mName,
            lName: user.lName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Error uploading picture: ", error.message);
        res.status(500).json({message: "Internal Server Errror"});
    }
}