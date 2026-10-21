"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { GillyMascot } from "@/components/mascot/gilly-mascot";
import { formatPhone } from "@/lib/format";
import { ChevronRightIcon } from "@/components/icons";

const schema = z
  .object({
    name: z.string().min(3, "Informe seu nome completo"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().min(14, "Telefone incompleto"),
    password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

const STEPS = [
  { fields: ["name", "email", "phone"], title: "Vamos começar com seus dados" },
  { fields: ["password", "confirmPassword"], title: "Agora, crie uma senha" },
] as const;

export default function CadastroPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const lastStep = step === STEPS.length - 1;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const phoneValue = useWatch({ control, name: "phone" }) ?? "";

  async function goNext() {
    const valid = await trigger(STEPS[step].fields);
    if (valid) setStep((s) => s + 1);
  }

  function onSubmit(data: FormValues) {
    setServerError(null);
    const { name, email, phone, password } = data;
    const result = registerUser({ name, email, phone, password });
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

      <GillyMascot mood="happy" size={90} />
      <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">Criar conta</h1>
      <p className="mt-1 text-center text-ink-soft">{STEPS[step].title}</p>

      <div className="mt-6 flex w-full items-center gap-2" aria-hidden>
        {STEPS.map((_, index) => (
          <span
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              index <= step ? "bg-gilly" : "bg-border"
            }`}
          />
        ))}
      </div>
      <p className="mt-1.5 self-start text-xs font-bold uppercase tracking-wide text-ink-faint">
        Etapa {step + 1} de {STEPS.length}
      </p>

      <form
        onSubmit={(event) => {
          if (lastStep) {
            handleSubmit(onSubmit)(event);
          } else {
            event.preventDefault();
            goNext();
          }
        }}
        className="mt-4 w-full space-y-4"
      >
        {step === 0 && (
          <>
            <Field label="Nome completo" error={errors.name?.message}>
              <input {...register("name")} className={inputClass} placeholder="Seu nome" autoFocus />
            </Field>
            <Field label="E-mail" error={errors.email?.message}>
              <input {...register("email")} type="email" className={inputClass} placeholder="voce@email.com" />
            </Field>
            <Field label="Telefone" error={errors.phone?.message}>
              <input
                {...register("phone")}
                value={phoneValue}
                onChange={(event) =>
                  setValue("phone", formatPhone(event.target.value), { shouldValidate: true })
                }
                className={inputClass}
                placeholder="(11) 99999-9999"
                inputMode="numeric"
              />
            </Field>

            <Button type="button" size="lg" className="w-full" onClick={goNext}>
              Continuar
              <ChevronRightIcon size={18} />
            </Button>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Senha" error={errors.password?.message}>
              <input {...register("password")} type="password" className={inputClass} placeholder="••••••" autoFocus />
            </Field>
            <Field label="Confirmar senha" error={errors.confirmPassword?.message}>
              <input
                {...register("confirmPassword")}
                type="password"
                className={inputClass}
                placeholder="••••••"
              />
            </Field>

            {serverError && <p className="text-sm font-semibold text-danger">{serverError}</p>}

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="squish flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border-2 border-border text-ink-soft transition-colors hover:border-gilly hover:text-gilly"
                aria-label="Voltar"
              >
                <ChevronRightIcon size={18} className="rotate-180" />
              </button>
              <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                Criar conta
              </Button>
            </div>
          </>
        )}
      </form>

      <p className="mt-5 text-sm text-ink-soft">
        Já tem conta?{" "}
        <Link href="/conta/login" className="font-bold text-gilly hover:underline">
          Entrar
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
