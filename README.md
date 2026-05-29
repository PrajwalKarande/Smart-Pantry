# Smart Pantry

An AI-powered pantry management application that helps you track ingredients, suggest meals, and reduce food waste.

## Overview

Smart Pantry is a full-stack web application with two components:

- **`smart-pantry-backend`** — Node.js/Express REST API backed by PostgreSQL (via Sequelize)
- **`smart-pantry-ui`** — React frontend styled with Tailwind CSS

## Features

- Track pantry items by category
- AI-powered meal suggestions based on available ingredients
- Image upload support for pantry items
- Full CRUD management of pantry and meal data

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 19, Tailwind CSS, Framer Motion |
| Backend  | Node.js, Express 5, Sequelize     |
| Database | PostgreSQL                        |
| AI       | External AI service (via `aiService`) |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- `.env` file in `smart-pantry-backend/` with database credentials

### Backend

```bash
cd smart-pantry-backend
npm install
npm run seed      # optional: seed initial data
npm run dev       # starts on http://localhost:8080
```

### Frontend

```bash
cd smart-pantry-ui
npm install
npm start         # starts on http://localhost:3000
```

## Running Tests

```bash
# Backend (Jest + Supertest)
cd smart-pantry-backend
npm test
npm run test:coverage

# Frontend
cd smart-pantry-ui
npm test
```
