import { Request, Response, NextFunction } from "express";

/**
 * Returns the set of allowed admin Replit user IDs from env.
 * Reads ADMIN_REPLIT_IDS (comma-separated list of Replit `sub` values).
 * Falls back to REPLIT_USERID (the repl owner) when ADMIN_REPLIT_IDS is not set.
 */
function getAdminAllowlist(): Set<string> {
  const raw = process.env.ADMIN_REPLIT_IDS ?? "";
  const explicit = raw.split(",").map((id) => id.trim()).filter(Boolean);
  if (explicit.length > 0) {
    return new Set(explicit);
  }
  // Fallback: allow the repl owner automatically.
  // REPLIT_USERID is set by the Replit platform and equals the owner's OAuth `sub`.
  const ownerId = process.env.REPLIT_USERID;
  if (ownerId) {
    return new Set([ownerId]);
  }
  return new Set();
}

/**
 * Returns true if the given Replit user ID is in the admin allowlist.
 */
export function isAdminUser(replitUserId: string): boolean {
  const allowlist = getAdminAllowlist();
  if (allowlist.size === 0) {
    return false;
  }
  return allowlist.has(replitUserId);
}

/**
 * Middleware to protect admin routes.
 * In development (localhost): allows access without token.
 * In production: requires Replit authentication AND the user must be in
 * the ADMIN_REPLIT_IDS allowlist, OR a valid x-admin-token header.
 */
export function protegerAdmin(req: Request, res: Response, next: NextFunction) {
  // Development mode: Allow access on localhost
  const isLocalhost = req.hostname === "localhost" || req.hostname === "127.0.0.1" || req.hostname.startsWith("192.168.");
  if (process.env.NODE_ENV === "development" && isLocalhost) {
    return next();
  }

  // Production: Check for Replit authentication + admin allowlist
  if (req.isAuthenticated && req.isAuthenticated()) {
    const user = req.user as any;
    const replitUserId = user?.claims?.sub as string | undefined;
    if (replitUserId && isAdminUser(replitUserId)) {
      return next();
    }
    return res.status(403).json({ error: "Acesso negado" });
  }

  // Check admin token header (fallback for automated/internal use)
  const token = req.get("x-admin-token");
  const expectedToken = process.env.ADMIN_TOKEN;

  if (token && expectedToken && token === expectedToken) {
    return next();
  }

  return res.status(403).json({ error: "Área restrita" });
}
