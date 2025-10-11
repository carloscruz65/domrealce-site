import { Request, Response, NextFunction } from "express";

export function protegerAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.get("x-admin-token");
  if (token === process.env.ADMIN_TOKEN) {
    return next();
  }
  return res.status(403).send("Área restrita");
}