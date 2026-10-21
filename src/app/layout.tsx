import type { Metadata } from "next";
import { Baloo_2, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ConditionalHeader } from "@/components/layout/conditional-header";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { SkyBackground } from "@/components/effects/sky-background";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { CheckoutProvider } from "@/lib/checkout-context";
import { FavoritesProvider } from "@/lib/favorites-context";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Nina Brinquedos · Loja de brinquedos em Paulista, PE",
    template: "%s · Nina Brinquedos",
  },
  description:
    "Brinquedos escolhidos a dedo: LEGO, Hot Wheels, Barbie, pelúcias, jogos e muito mais. Retire na loja em Paulista, PE ou receba em casa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${baloo.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col text-ink">
        <SkyBackground />
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <CheckoutProvider>
                <ConditionalHeader />
                <main className="flex-1">{children}</main>
                <ConditionalFooter />
              </CheckoutProvider>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
