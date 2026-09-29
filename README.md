# Resume Ranker

[![Live Demo](https://img.shields.io/badge/demo-live-00fff7?style=for-the-badge)](https://resume-ranker-lac.vercel.app)
[![Backend](https://img.shields.io/badge/API-live-ff00e5?style=for-the-badge)](https://resume-ranker-pap5.onrender.com)
[![Made with](https://img.shields.io/badge/MERN-stack-22ff88?style=for-the-badge)](https://www.mongodb.com/mern-stack)

A full-stack MERN application that ranks applicant resumes against...

## Features

- **JWT authentication** with three roles: Admin, Recruiter, Applicant
- **Admin-gated recruiter approval** — recruiters stay `PENDING` until approved
- **Weighted topic rubric** per job (weights must sum to 100)
- **Multiple resumes per applicant** (PDF / DOCX, up to 5 MB each)
- **Resume text extraction** via `pdf-parse` (PDF) and `mammoth` (DOCX)
- **Deterministic keyword matching** with topic aliases
- **Weighted scoring engine** — `overallScore = Σ matchScore × (weight / 100)`
- **Competition ranking** — tied scores share a rank (`#1, #1, #3`)
- **Applicant privacy** — applicants only see their own score and rank
- **Neon dark UI** with light-mode toggle

## Tech Stack

| Layer | Tools |
|-------|-------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios, Recharts |
| Backend | Node.js, Express, JWT, bcryptjs, Multer, pdf-parse, mammoth |
| Database | MongoDB + Mongoose |
| Security | Helmet, CORS, express-rate-limit |

## Architecture

    React (Vite)  →  Axios  →  Express REST API  →  MongoDB (Mongoose)
                                    │
                                    ├── JWT auth + role guards
                                    ├── Resume upload → text extraction
                                    ├── Topic matching → weighted scoring
                                    └── Relative ranking

## Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- MongoDB (local install or MongoDB Atlas)
- npm

### 1. Backend

    cd backend
    npm install
    cp .env.example .env
    npm run dev

`backend/.env`:

    MONGODB_URI=mongodb://localhost:27017/resumerank
    JWT_SECRET=change_me_to_a_long_random_string
    PORT=5000

### 2. Frontend

    cd frontend
    npm install
    npm run dev

Runs on **http://localhost:5173**

### 3. First Steps

1. Register an admin at `/register` (role: Admin)
2. Register a recruiter (role: Recruiter) → status becomes `PENDING`
3. Log in as admin → **Recruiters** → **Approve** the recruiter
4. Log in as recruiter → create a job → set weighted topics (sum = 100)
5. Register an applicant → upload resume(s) → apply
6. Recruiter opens **Rankings** → sees ranked applicants per resume

## Scoring Example

Given a job with these weights:

| Topic | Weight |
|-------|--------|
| Data Structures | 30% |
| C++ | 20% |
| Java | 15% |
| SQL | 15% |
| Git | 10% |
| English | 10% |

A resume matching DSA 100%, C++ 60%, Java 80%, SQL 100%, Git 100%, English 20% scores:

    (100×0.30) + (60×0.20) + (80×0.15) + (100×0.15) + (100×0.10) + (20×0.10)
    = 30 + 12 + 12 + 15 + 10 + 2
    = 81

## License

MIT
