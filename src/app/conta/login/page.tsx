"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { GillyMascot } from "@/components/mascot/gilly-mascot";
import { ChevronRightIcon } from "@/components/icons";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(data: FormValues) {
    setServerError(null);
    const result = login(data.email, data.password);
    if (!result.success) {
      setServerError(result.message);
      return;
    }
    router.push("/conta/dados");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="squish mb-6 inline-flex items-center gap-1.5 self-start text-sm font-bold text-ink-soft transition-colors hover:text-gilly"
      >
        <ChevronRightIcon size={16} className="rotate-180" />
        Voltar pra loja
      </Link>

      <GillyMascot mood="wave" size={90} />
      <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">Entrar</h1>
      <p className="mt-1 text-center text-ink-soft">Acesse sua conta Nina Brinquedos.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 w-full space-y-4">
        <Field label="E-mail" error={errors.email?.message}>
          <input {...register("email")} type="email" className={inputClass} placeholder="voce@email.com" />
        </Field>
        <Field label="Senha" error={errors.password?.message}>
          <input {...register("password")} type="password" className={inputClass} placeholder="••••••" />
        </Field>

        {serverError && <p className="text-sm font-semibold text-danger">{serverError}</p>}

        <div className="text-right">
          <Link href="/conta/recuperar-senha" className="text-sm font-semibold text-gilly hover:underline">
            Esqueceu a senha?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          Entrar
        </Button>
      </form>

      <p className="mt-5 text-sm text-ink-soft">
        Ainda não tem conta?{" "}
        <Link href="/conta/cadastro" className="font-bold text-gilly hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-border bg-cream px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-gilly focus:outline-none";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-ink">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-semibold text-danger">{error}</p>}
    </div>
  );
}
