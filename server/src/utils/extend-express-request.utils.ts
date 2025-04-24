// ✅ Extend Express Request interface to include user
export {};
export type TokenPayload = {
  id: string;
  email: string;
  isAdmin: boolean;
};
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
