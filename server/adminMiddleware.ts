import { Request, Response, NextFunction } from "express";

/**
 * Secure admin middleware - requires Replit authentication
 * User must be logged in via /api/login on the production domain
 */
export async function adminAccess(req: Request, res: Response, next: NextFunction) {
  // Development mode: Allow access on localhost for easier testing
  const isLocalhost = req.hostname === "localhost" || req.hostname === "127.0.0.1" || req.hostname.startsWith("192.168.");
  if (process.env.NODE_ENV === "development" && isLocalhost) {
    console.log("⚠️ Admin access granted via localhost in development mode");
    return next();
  }

  // Production: Check if user is authenticated via Replit
  if (req.isAuthenticated && req.isAuthenticated()) {
    console.log("✅ Admin access granted via Replit authentication");
    return next();
  }

  // Not authenticated - redirect to login
  console.log("❌ Admin access denied - redirecting to login");
  return res.redirect("/api/login");
}
