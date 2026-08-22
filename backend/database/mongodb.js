import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js'

if(!DB_URI){
    throw new Error('DB_URI not configured');
}

const connectDB = async() => {
    try{
        await mongoose.connect(DB_URI);
    }
    catch(err){
        console.error('Failed to connect to DB ' + err.message);
        process.exit(1);
    }
}

export default connectDB;