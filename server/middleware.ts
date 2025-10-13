import { Request, Response, NextFunction } from "express";

/**
 * Middleware to protect admin routes
 * In development (localhost): allows access without token
 * In production: checks x-admin-token header or Replit authentication
 */
export function protegerAdmin(req: Request, res: Response, next: NextFunction) {
  // Development mode: Allow access on localhost
  const isLocalhost = req.hostname === "localhost" || req.hostname === "127.0.0.1" || req.hostname.startsWith("192.168.");
  if (process.env.NODE_ENV === "development" && isLocalhost) {
    return next();
  }

  // Production: Check for authentication
  // 1. Check Replit authentication
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // 2. Check admin token header
  const token = req.get("x-admin-token");
  const expectedToken = process.env.ADMIN_TOKEN;
  
  if (token && token === expectedToken) {
    return next();
  }

  return res.status(403).json({ error: "Área restrita" });
}
