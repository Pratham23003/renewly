import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';

export const signUp = async (req, res, next) => {
    let session = null;
    let useTransaction = true;
    try {
        session = await mongoose.startSession();
        session.startTransaction();
    } catch {
        useTransaction = false;
    }

    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email ? email.toLowerCase().trim() : "";

        const query = User.findOne({ email: normalizedEmail });
        if (useTransaction && session) query.session(session);
        const user = await query;

        if (user) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        let userData;

        if (useTransaction && session) {
            const newUsers = await User.create([{ name, email: normalizedEmail, password: passwordHash }], { session });
            userData = newUsers[0].toObject();
            await session.commitTransaction();
            session.endSession();
        } else {
            const newUser = await User.create({ name, email: normalizedEmail, password: passwordHash });
            userData = newUser.toObject();
        }

        delete userData.password;
        const token = jwt.sign({ userId: userData._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(201).json({
            success: true,
            message: 'User signed up successfully',
            data: {
                token,
                user: userData
            }
        });
    } catch (err) {
        if (useTransaction && session) {
            try {
                await session.abortTransaction();
                session.endSession();
            } catch {
                // ignore session cleanup error
            }
        }
        next(err);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email ? email.toLowerCase().trim() : "";

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            const error = new Error('Invalid Credentials');
            error.statusCode = 401;
            throw error;
        }

        const hashedPassword = user.password;
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
            const error = new Error('Invalid Credentials');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user: userData
            }
        });
    } catch (err) {
        next(err);
    }
}

export const signOut = async (req, res) => {
    res.status(200).json({ success: true, message: "User signed out successfully"});
}
