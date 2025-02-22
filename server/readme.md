# 📂 Project Folder Structure

```
server/
├── .env
├── .env.sample
├── .eslintrc.json
├── .prettierrc.json
├── package-lock.json
├── package.json
├── readme.md
├── src/
│   ├── config/
│   │   └── db.config.ts
│   ├── core/
│   │   └── base.repository.ts
│   ├── index.ts
│   ├── middleware/
│   │   └── error.middleware.ts
│   ├── modules/
│   │   ├── candidate/
│   │   │   ├── candidate.controller.ts
│   │   │   ├── candidate.dto.ts
│   │   │   ├── candidate.model.ts
│   │   │   ├── candidate.repository.ts
│   │   │   └── candidate.service.ts
│   │   ├── election/
│   │   │   ├── election.controller.ts
│   │   │   ├── election.dto.ts
│   │   │   ├── election.model.ts
│   │   │   ├── election.repository.ts
│   │   │   └── election.service.ts
│   │   └── voter/
│   │       ├── voter.controller.ts
│   │       ├── voter.dto.ts
│   │       ├── voter.model.ts
│   │       ├── voter.repository.ts
│   │       └── voter.service.ts
│   ├── routes/
│   │   ├── candidate.routes.ts
│   │   ├── elections.routes.ts
│   │   ├── index.ts
│   │   └── voter.routes.ts
│   ├── uploads/
│   └── utils/
└── tsconfig.json

```
