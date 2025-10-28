// src/app/admin/login/page.tsx
"use client";

import "./styles.css"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminLogin } from "@/hooks/useAdminAuth";

const schema = z.object({
  email: z.string().regex(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/, { message: "E-mail inválido" }),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
});
type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { mutate, isPending, isError, error } = useAdminLogin();

  const onSubmit = (values: FormData) => mutate(values);

  return (
    <main className="container">
      <h1>Login do Administrador</h1>
      {isError && <p className="is-error">{(error as any)?.message || "Erro ao realizar login"}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div>
          <label htmlFor="#">Email</label>
          <input type="email" placeholder="admin@exemplo.com" {...register("email")} disabled={isPending} />
          {errors.email && <small className="is-error">{errors.email.message}</small>}
        </div>
        <div>
          <label htmlFor="#">Senha</label>
          <input type="password" placeholder="••••••••" {...register("password")} disabled={isPending} />
          {errors.password && <small className="is-error">{errors.password.message}</small>}
        </div>
        <button type="submit" disabled={isPending}>{isPending ? "Entrando..." : "Entrar"}</button>
      </form>
    </main>
  );
}