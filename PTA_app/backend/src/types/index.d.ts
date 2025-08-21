import "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      name: string;
      role: string;
      isAdmin: boolean;
      uid: string; // Firebase UID
    };
  }
}
