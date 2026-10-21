"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { CHROME_FREE_ROUTES } from "@/lib/chrome-free-routes";

/** Esconde a navbar nas telas de autenticação, onde só o conteúdo principal deve aparecer. */
export function ConditionalHeader() {
  const pathname = usePathname();
  if (CHROME_FREE_ROUTES.includes(pathname)) return null;
  return <Header />;
}
