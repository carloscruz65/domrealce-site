import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  const domains = process.env.REPLIT_DOMAINS!.split(",");
  
  // Register strategy for each domain
  for (const domain of domains) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }
  
  // Also register for localhost in development (uses first domain's config)
  if (process.env.NODE_ENV === 'development') {
    const firstDomain = domains[0];
    const localhostStrategy = new Strategy(
      {
        name: `replitauth:localhost`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${firstDomain}/api/callback`,
      },
      verify,
    );
    passport.use(localhostStrategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Show login page with button
  app.get("/api/login", (req, res, next) => {
    // Check if user wants to actually authenticate (via query param or already authenticated)
    if (req.query.auth === 'start') {
      return passport.authenticate(`replitauth:${req.hostname}`, {
        prompt: "login consent",
        scope: ["openid", "email", "profile", "offline_access"],
      })(req, res, next);
    }
    
    // Show a simple login page with button
    const isLoggedIn = req.isAuthenticated();
    const user = req.user as any;
    
    res.send(`
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Admin - DOMREALCE</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }
          .container {
            background: rgba(255,255,255,0.1);
            padding: 3rem;
            border-radius: 1rem;
            text-align: center;
            max-width: 400px;
            backdrop-filter: blur(10px);
          }
          h1 { margin-bottom: 1rem; color: #FFD700; }
          p { margin-bottom: 2rem; opacity: 0.8; line-height: 1.6; }
          .btn {
            display: inline-block;
            padding: 1rem 2rem;
            background: #FFD700;
            color: #1a1a2e;
            text-decoration: none;
            border-radius: 0.5rem;
            font-weight: bold;
            font-size: 1.1rem;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(255,215,0,0.4);
          }
          .btn-secondary {
            background: #4CAF50;
            margin-left: 1rem;
          }
          .status {
            margin-top: 2rem;
            padding: 1rem;
            background: rgba(76,175,80,0.2);
            border-radius: 0.5rem;
          }
          .links { margin-top: 2rem; }
          .links a { color: #FFD700; margin: 0 0.5rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔐 Admin DOMREALCE</h1>
          ${isLoggedIn ? `
            <div class="status">
              <p>✅ Sessão ativa: <strong>${user?.claims?.email || 'Utilizador'}</strong></p>
            </div>
            <div class="links">
              <a href="/admin" class="btn">Ir para Admin</a>
              <a href="/api/admin/download-all-images" class="btn btn-secondary">Download Imagens</a>
            </div>
            <p style="margin-top: 2rem; font-size: 0.9rem;">
              <a href="/api/logout" style="color: #ff6b6b;">Terminar Sessão</a>
            </p>
          ` : `
            <p>Faça login com a sua conta Replit para aceder ao painel de administração.</p>
            <a href="/api/login?auth=start" class="btn">Entrar com Replit</a>
          `}
        </div>
      </body>
      </html>
    `);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};