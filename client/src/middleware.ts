import { Request, Response, NextFunction } from "express";

export function protegerAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.get("x-admin-token"); // forma segura de ler o cabeçalho

  // 🔍 Adiciona estes logs para depurar
  console.log("Token recebido:", token);
  console.log("Token esperado:", process.env.ADMIN_TOKEN);

  if (token === process.env.ADMIN_TOKEN) {
    return next();
  }

  return res.status(403).send("Área restrita");
}