import { Request, Response, NextFunction } from "express";

export function protegerAdmin(req: Request, res: Response, next: NextFunction) {
  if (process.env.ADMIN_MODE !== "true") {
    return res.status(403).send("Área restrita");
  }
  next();
}