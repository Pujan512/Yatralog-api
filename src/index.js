import express from 'express';
import {config} from 'dotenv';
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'

import blogRoutes from "./routes/blogRoutes.js"
import authRoutes from "./routes/authRoutes.js"

config();
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api/blogs', blogRoutes)
app.use('/api/auth', authRoutes)

app.listen(5000, ()=> {
    console.log("Listening on port 5000");
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Connected to database.")
    });
})