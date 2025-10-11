import { Request, Response, NextFunction } from "express";

/**
 * Hybrid admin middleware - allows access via:
 * 1. Replit authentication (user logged in via /api/login)
 * 2. ADMIN_MODE environment variable
 * 3. x-admin-token header matching ADMIN_TOKEN
 */
export async function adminAccess(req: Request, res: Response, next: NextFunction) {
  // Method 1: Check if user is authenticated via Replit
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Method 2: Check ADMIN_MODE environment variable
  if (process.env.ADMIN_MODE === "true") {
    return next();
  }

  // Method 3: Check x-admin-token header
  const token = req.get("x-admin-token");
  if (token && token === process.env.ADMIN_TOKEN) {
    return next();
  }

  // No valid authentication method found
  return res.status(401).json({ 
    error: "Unauthorized",
    message: "Faça login via /api/login ou configure ADMIN_MODE=true" 
  });
}
