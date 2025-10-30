"use client";

import "./styles.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminLogin } from "@/hooks/useAdminAuth";
import { toast } from "@/app/components/ui/toast";

const schema = z.object({
  email: z
    .string()
    .regex(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/, { message: "E-mail inválido" }),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
});
type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending, isError, error } = useAdminLogin();

  const onSubmit = (values: FormData) => {
    mutate(values, {
      onError: (err: any) => {
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || "Erro ao realizar login";
        if (status === 401) toast.error("Credenciais inválidas");
        else toast.error(msg);
      },
    });
  };

  return (
    <main className="container">
      <h1>Login do Administrador</h1>
      {isError && <p className="is-error">{(error as any)?.message || "Erro ao realizar login"}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="admin@exemplo.com" {...register("email")} disabled={isPending} />
          {errors.email && <small className="is-error">{errors.email.message}</small>}
        </div>
        <div>
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" placeholder="••••••••" {...register("password")} disabled={isPending} />
          {errors.password && <small className="is-error">{errors.password.message}</small>}
        </div>
        <button type="submit" disabled={isPending}>{isPending ? "Entrando..." : "Entrar"}</button>
      </form>
    </main>
  );
}