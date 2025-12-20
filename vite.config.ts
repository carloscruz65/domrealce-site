import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],

  server: {
    // permite hosts dinâmicos do Replit
    allowedHosts: [
      ".replit.dev",
      ".worf.replit.dev",
      "3bf90cb8-837d-49dd-b68d-11cd7e048610-00-o0m5ewcnxm8z.worf.replit.dev",
    ],

    // regras de acesso ao filesystem
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },

  root: path.resolve(import.meta.dirname, "client"),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});