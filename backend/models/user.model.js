import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User Name is required"],
        trim: true,
        minLength: 2,
        maxLength: 50,
        validate: {
            validator: value => value.trim().length >= 2,
            message: "Name must contain at least 2 characters"
        }
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true, 
        lowercase: true,
        minLength: 5, 
        maxLength: 255,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minLength: 6,
    }
}, {timestamps: true})

const User = mongoose.model("User", userSchema);

export default User;