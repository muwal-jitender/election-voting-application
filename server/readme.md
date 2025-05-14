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
- 📈 **Winston & Morgan** logging with daily file rotation

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

## 🔐 Security & Token Management

This server implements a secure and production-ready authentication system using JWTs (JSON Web Tokens) with the following design features:

### ✅ Dual Token System

- Access Token (Short-lived):

  - Stored in a secure HTTP-only cookie (access_token)
  - Verified via authenticateJWT middleware

- Refresh Token (Long-lived):

  - Stored in HTTP-only cookie (refresh_token)
  - Verified via attachRefreshToken middleware and validated against DB

This allows the frontend to clearly distinguish and act accordingly.

## 🔁 Refresh Token Validation (Strict Checks)

Every refresh token is validated using:

- Token presence and signature (jwt.verify)
- Revocation status (isRevoked)
- Expiration date (expiresAt)
- IP address and User-Agent consistency
- Token versioning (version field in payload)
- DB hash comparison to detect token reuse attacks

If any validation fails, the token is revoked and all associated tokens are invalidated (logout from all devices).

## ✅ Token Reuse Protection

### ✔ Strengths:

- Token Hashing with SHA-256 before storing in DB → ✅ Prevents token leakage exploitation.
- Token Reuse Detection → ✅ Hash comparison + forced global logout if mismatch.
- IP & User-Agent Validation → ✅ Guards against session hijacking.
- Token Versioning → ✅ Prepares for future revocation strategies.
- Centralized Metadata Extraction → ✅ Clean and reusable via jwtService.extractRequestMeta.
- Clear Cookie Logic → ✅ Encapsulated in clearAuthCookies() utility.
- Replay Protection Delay Window → ✅ Introduced delay before issuing new tokens to reduce risk of timing-based replay attacks.

## 🍪 Cookie Security

- HTTP-only and Secure cookies are used to store tokens.
- SameSite=Strict to prevent CSRF attacks.
- maxAge is set based on token expiry duration.

## 🧹 Logout Endpoints

- POST /auth/logout: Logs out user from current device only.
- POST /auth/logout-all-devices: Logs out user from all sessions and devices.

## 🛡️ Additional Notes

- Token versioning via currentTokenVersion supports future upgrades or mass revocations.
- IP/User-Agent mismatch revokes tokens to prevent session hijacking.
- Logging is done using Winston to trace all auth events.

## 🔥 This is Top-Tier Token Security

What I’ve implemented mirrors the most secure practices used by:

- 🔐 Banks
- 🧑‍⚕️ Healthcare apps
- 🧾 High-compliance enterprise systems

## 🛠️ Setup Instructions

### 1. **Install dependencies**

```bash
cd server
npm install


# 📂 Project Folder Structure

```

# Clean Architecture Pattern

### Route ➝ Middleware ➝ Service ➝ Repository ➝ Mongoose Model
