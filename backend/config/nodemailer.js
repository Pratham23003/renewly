import nodemailer from 'nodemailer';
import { EMAIL_PASSWORD } from './env.js';

export const accountEmail = '160860031@ggi.ac.in';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: accountEmail,
        pass: EMAIL_PASSWORD
    }
});

export default transporter;