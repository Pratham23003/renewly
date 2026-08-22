# [Renewly](https://renewly-9b1w.vercel.app/)
> Never miss a subscription renewal again.

[Renewly](https://renewly-9b1w.vercel.app/) is a subscription tracking app designed to help you monitor recurring expenses, calculate monthly spend, and receive timely email alerts before your cards are charged.

![Renewly Hero Section](./demo.png)

---

## Features

- **Dashboard**: Get a sleek, unified view of all active subscriptions, total monthly spend, and next renewal dates.
- **Smart Email Reminders**: Never get caught off guard by a surprise charge. Automatically schedules email alerts (1, 2, 5, or 7 days before) using robust background workflows.
- **Secure & Shielded**: Protected by **Arcjet** with built-in token-bucket rate limiting and bot detection.

---

## Tech Stack

- **Frontend**: React, TanStack Start (SSR), TailwindCSS
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Queue & Workflows**: Upstash QStash
- **Security**: Arcjet (Shield & Token Bucket)
- **Emails**: Nodemailer (Gmail SMTP integration)
- **Deployment**: Vercel

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local db)
- Upstash QStash account
- Arcjet account

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Pratham23003/renewly.git
   cd renewly
   ```

2. **Configure Backend Environment**
   Create a `.env.production.local` or `.env.development.local` file inside the `backend` folder:
   ```env
   PORT=5500
   NODE_ENV=production
   DB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   SERVER_URL=http://localhost:5500
   
   # Arcjet
   ARCJET_KEY=your_arcjet_key
   ARCJET_ENV=production
   
   # Upstash QStash
   QSTASH_URL=https://qstash-eu-central-1.upstash.io
   QSTASH_TOKEN=your_qstash_token
   QSTASH_CURRENT_SIGNING_KEY=your_signing_key
   QSTASH_NEXT_SIGNING_KEY=your_next_signing_key
   
   # Nodemailer
   EMAIL_PASSWORD=your_gmail_app_password
   ```

3. **Configure Frontend Environment**
   Create a `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:5500/api/v1
   ```

4. **Install Dependencies & Run**

   **For Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

   **For Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## API Rate Limiting

Renewly uses **Arcjet** to protect API endpoints. If a client exceeds the threshold (10 requests bucket capacity with 5 refills per 10 seconds), the API automatically responds with:
- **Status Code**: `429 Too Many Requests`
- **Response**: `{"message": "Rate Limit Exceeded"}`

---

## License
This project is open-source. Feel free to use and contribute!
Created by [Pratham Deora](https://github.com/Pratham23003).
