// client/src/lib/adminUtils.ts

export const adminUtils = {
  // Verifica se o modo admin está ativo
  isAdminMode: () => process.env.ADMIN_MODE === "true",

  // Verifica se o utilizador tem permissão para editar
  canEdit: (role: string) => ["admin", "editor"].includes(role),

  // Formata datas para exibição no painel
  formatDate: (date: Date) =>
    date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }),

  // Gera um ID único (ex: para novos elementos)
  generateId: () => Math.random().toString(36).substring(2, 10),

  // Limpa texto para evitar HTML malicioso
  sanitizeText: (text: string) => text.replace(/<[^>]*>?/gm, "").trim()
};