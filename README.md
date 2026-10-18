# QuizMaster

A full-stack quiz web application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- Browse and search quizzes by category (JavaScript, HTML, CSS, React, General Knowledge).
- Timed assessments with an overall countdown timer and per-question timer.
- Single-question quiz interface with progress tracking and question navigation.
- Automatic quiz submission when time expires.
- Server-side score evaluation and result breakdown (Score, Percentage, Pass/Fail).
- Question-by-question review showing correct answers and selected options.
- Quiz Studio to create, edit, preview, and delete custom quizzes.
- Light and dark theme toggle.

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Lucide React, Plain CSS
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Cors, Dotenv

## Project Structure

```
├── client/          # Frontend React application
└── server/          # Backend Express API and MongoDB models
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quizmaster
CLIENT_URL=http://localhost:5173
```

Seed initial quizzes (optional):

```bash
npm run seed
```

Start the server:

```bash
npm start
```

Backend will run on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`.
