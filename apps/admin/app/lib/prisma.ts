// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // añadimos la propiedad al tipo global para TypeScript
  var prisma: PrismaClient | undefined;
}

// Si ya existe (dev hot reload), reutilízalo; si no, crea uno nuevo.
export const prisma: PrismaClient =
  globalThis.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

// Guardar referencia en globalThis para evitar múltiples instancias en dev
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
