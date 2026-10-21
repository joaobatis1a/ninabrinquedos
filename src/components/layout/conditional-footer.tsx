"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { CHROME_FREE_ROUTES } from "@/lib/chrome-free-routes";

/** Esconde o rodapé nas telas de autenticação, onde só o conteúdo principal deve aparecer. */
export function ConditionalFooter() {
  const pathname = usePathname();
  if (CHROME_FREE_ROUTES.includes(pathname)) return null;
  return <Footer />;
}
