import { Request, Response, NextFunction } from "express";

/**
 * Middleware to protect admin routes
 * Checks x-admin-token header against ADMIN_TOKEN environment variable
 */
export function protegerAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.get("x-admin-token");
  const expectedToken = process.env.ADMIN_TOKEN;
  
  if (token && token === expectedToken) {
    return next();
  }

  return res.status(403).json({ error: "Área restrita" });
}
