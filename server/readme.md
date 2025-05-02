# 🛠️ Election Voting App – Server

This is the **backend API** for the Election Voting App, built with **Node.js**, **Express**, and **TypeScript**. It provides RESTful APIs for managing elections, candidates, voters, authentication, and results.

---

## 🚀 Features

- 🔐 **JWT Authentication** with secure cookies
- 🗳️ **Election & Candidate Management** (CRUD)
- 📊 **Vote Casting & Results Tracking**
- ☁️ **Cloudinary** integration for image uploads (e.g., flags, candidate photos)
- 💾 **MongoDB Transactions** for consistent multi-document operations
- 🧩 **Dependency Injection** with `tsyringe`
- 📋 **Request Validation** with `class-validator`
- 🗄️ **MongoDB** with `mongoose` for data storage
- 📂 File uploads with `express-fileupload`
- 🌐 **CORS-enabled API** for frontend communication
- 📈 **Winston** logging with daily file rotation

---

## 📦 Tech Stack

| Technology          | Purpose                              |
| ------------------- | ------------------------------------ |
| **Express.js**      | Web framework                        |
| **TypeScript**      | Type safety and improved development |
| **Mongoose**        | MongoDB object modeling              |
| **JWT**             | Authentication tokens                |
| **Cloudinary**      | Image hosting and management         |
| **Winston**         | Logging and error tracking           |
| **tsyringe**        | Dependency Injection (IoC container) |
| **class-validator** | DTO validation for requests          |

---

## 🗄️ Database Consistency

- This app uses **MongoDB Transactions** to ensure data consistency across multiple collections.
- Example: When casting a vote, both the candidate's vote count and voter's status are updated atomically.
- Transactions are implemented using `mongoose` sessions to handle complex operations safely.

## ✅ REFRESH TOKEN FLOW REVIEW

### ✔ Strengths:

- Token Hashing with SHA-256 before storing in DB → ✅ Prevents token leakage exploitation.

- Token Reuse Detection → ✅ Hash comparison + forced global logout if mismatch.

- IP & User-Agent Validation → ✅ Guards against session hijacking.

- Token Versioning → ✅ Prepares for future revocation strategies.

- Centralized Metadata Extraction → ✅ Clean and reusable via jwtService.extractRequestMeta.

- Clear Cookie Logic → ✅ Encapsulated in clearAuthCookies() utility.

## 🛠️ Setup Instructions

### 1. **Install dependencies**

```bash
cd server
npm install


# 📂 Project Folder Structure

```

# Clean Architecture Pattern

### Route ➝ Middleware ➝ Service ➝ Repository ➝ Mongoose Model
