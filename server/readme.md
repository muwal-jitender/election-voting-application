# 📂 Project Folder Structure
```
server/
│── src/
│   ├── config/          # Configuration files (e.g., DB connection, environment settings)
│   │   ├── database.ts
│   │   ├── env.ts
│   ├── controllers/     # Route handler functions
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   ├── middleware/      # Custom middleware (e.g., auth, logging)
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   ├── models/          # Database models (for MongoDB, SQL, etc.)
│   │   ├── user.model.ts
│   ├── routes/          # Express route definitions
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   ├── services/        # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   ├── utils/           # Helper functions
│   │   ├── logger.ts
│   ├── index.ts         # Main entry point
│   ├── app.ts           # Express app setup
│── .env                 # Environment variables
│── .gitignore           # Ignore sensitive files
│── nodemon.json         # Nodemon config
│── package.json         # Dependencies & scripts
│── tsconfig.json        # TypeScript config
│── README.md            # Documentation
```