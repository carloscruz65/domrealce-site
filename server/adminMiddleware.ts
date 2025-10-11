import { Request, Response, NextFunction } from "express";

/**
 * Secure admin middleware - requires Replit authentication
 * User must be logged in via /api/login
 */
export async function adminAccess(req: Request, res: Response, next: NextFunction) {
  // Check if user is authenticated via Replit
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Not authenticated - redirect to login
  return res.redirect("/api/login");
}
