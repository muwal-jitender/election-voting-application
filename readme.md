# 🗳️ Election Voting App
A full-stack web application for organizing and participating in digital elections. Built with React (TypeScript) on the frontend and Node.js/Express with MongoDB on the backend.

## ****🚀 Features****
- User registration and login with JWT authentication (secured via HTTP-only cookies)

- Admin panel to create elections and manage candidates

- Voters can cast votes securely, only once per election

- Real-time voting result updates

- Cloudinary integration for image uploads

- Secure RESTful APIs with RBAC (Role-Based Access Control)

- Responsive UI with modern design

## 📁 Project Structure

```
election-voting-app/
├── client/     # React frontend
├── server/     # Node.js + Express backend
└── README.md   # Root-level overview (this file)
```

## 🧰 Tech Stack
### Frontend

- React (TypeScript)

- Redux Toolkit

- Axios

- Tailwind CSS

### Backend

- Node.js + Express

- MongoDB + Mongoose

- JWT Auth with HTTP-only cookies

- Cloudinary (image storage)

- Class-validator & class-transformer

- ESLint + Prettier

### Dev Tools

- ESLint, Prettier, Husky, lint-staged

- Nodemon + ts-node-dev for local dev

- VS Code recommended settings

## 🛠️ Setup
### Clone the project:
```
- git clone https://github.com/your-username/election-voting-app.git
- cd election-voting-app
```
### Install dependencies:
- npm install
- cd client && npm install
- cd server && npm install

### Set up environment variables:

- client/.env – React environment variables
- server/.env – MongoDB URI, JWT secret, Cloudinary keys, etc.

### Start frontend
- cd client
- npm run dev

### Start backend
- cd server
- npm run dev