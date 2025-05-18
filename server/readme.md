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

## 📘 Audit Logging

The Audit Log module exists to track critical actions performed within the application for security, traceability, and compliance purposes.

### We use audit logging to:

- Monitor sensitive operations (e.g., login, logout, vote casting, resource creation/deletion)
- Support forensic investigations and accountability
- Meet internal and external compliance requirements

### ✅ What We Track

- Authentication events (LOGIN_SUCCESS, LOGOUT, TOKEN_REUSE)
- Voting-related actions (VOTE_CAST, VOTE_CONFIRMED)
- Administrative operations (ELECTION_CREATED, CANDIDATE_DELETED)
- Security anomalies (IP_MISMATCH, UA_MISMATCH)

### 🔐 Privacy & Data Handling

We do not log sensitive data, including:

- Passwords
- Raw access or refresh tokens
- Voter IDs linked to specific votes (to preserve anonymity)

Audit logs only capture what’s necessary to establish intent and trace actions — not personal or confidential content.

## 🛡️ Rate Limiting

This application uses a configurable rate-limiting middleware to protect API endpoints from abuse, brute-force attacks, and excessive traffic.

### 🔧 Global Rate Limiting

A default global rate limiter is applied to all routes (except sensitive endpoints like `/login` and `/vote`) using the following configuration:

- Max Requests: `100`
- Window Duration: `15 minutes`
- Keyed by: `IP address`

### 🔐 Custom Rate Limiters

#### 1. Login Endpoint

- Route: POST `/api/auth/login`
- Max Requests: `5`
- Window: `5 minutes`
- Keyed by: `IP address`

This prevents brute-force login attempts.

#### 2. Vote Endpoint

- Route: PATCH `/candidate/:id/elections/:electionId`
- Max Requests: `3`
- Window: `10 minutes`
- Keyed by: `User ID (fallback to IP)`

This ensures fair voting behavior and prevents abuse.

### 🧱 Configuration

Rate limiter behavior is centralized in:

- `src/middleware/rateLimiter.ts`

You can create additional custom rate limiters by calling:

- `rateLimiter({ max, windowMs, keyGenerator, message });
`

## 🔐 Security Headers (via Helmet)

This application uses helmet to enhance HTTP security by setting recommended response headers. These headers help protect against common web vulnerabilities like XSS, clickjacking, and information leakage.

### ✅ Enabled Headers & Policies

| Header                      | Description                                                                      |
| --------------------------- | -------------------------------------------------------------------------------- |
| `Content-Security-Policy`   | Restricts resources (scripts, styles, images) to trusted sources only            |
| `Referrer-Policy`           | Prevents leaking full page URLs to external services                             |
| `X-Frame-Options`           | Blocks the site from being embedded in iframes (clickjacking protection)         |
| `X-Content-Type-Options`    | Prevents browsers from MIME-type sniffing (forces declared types)                |
| `Strict-Transport-Security` | Enforces HTTPS via HSTS (only active in HTTPS production environments)           |
| `X-DNS-Prefetch-Control`    | Disables DNS prefetching for better privacy                                      |
| `X-Powered-By`              | 🚫 Disabled — hides Express from response headers to prevent tech fingerprinting |

### 🧱 Content-Security-Policy (CSP)

The current CSP configuration allows loading:

- All default content from the same origin ('self')
- Images from Cloudinary (https://res.cloudinary.com)

```
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "https://res.cloudinary.com"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);
```

⚠️ `Note:` Inline styles and scripts are not allowed. Use class-based styles and external scripts.

### 🧠 Referrer Policy

- `referrerPolicy: { policy: "no-referrer" }`

This prevents sensitive route paths from being leaked to third-party services like Cloudinary or analytics platforms.

### 🛡️ Clickjacking Protection

- `frameguard: { action: "deny" } `

This blocks the site from being embedded in iframes — preventing clickjacking attacks.

### 🧼 Other Security Measures

- app.disable("x-powered-by"): Removes the X-Powered-By header to obscure the technology stack.
- Security headers are applied globally in securityHeaders.ts middleware.
- CSP is prepared for extension to support fonts, analytics, or CDNs as needed.

## 🛠️ Setup Instructions

### 1. **Install dependencies**

```bash
cd server
npm install


# 📂 Project Folder Structure

```

# Clean Architecture Pattern

### Route ➝ Middleware ➝ Service ➝ Repository ➝ Mongoose Model
