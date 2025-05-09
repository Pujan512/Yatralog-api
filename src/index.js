import express from 'express';
import {config} from 'dotenv';
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'
import cors from "cors";

import blogRoutes from "./routes/blogRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"

config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/comments', commentRoutes)

app.listen(5000, ()=> {
    console.log("Listening on port 5000");
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Connected to database.")
    });
})