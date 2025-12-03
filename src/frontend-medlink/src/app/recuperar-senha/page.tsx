"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../components/input/input";
import { toast } from "../components/ui/toast";
import { useRequestPasswordReset } from "../services/auth";

export default function ForgotPasswordPage() {
  const schema = z.object({
    email: z.string().email("E-mail inválido"),
  });

  type FormData = z.infer<typeof schema>;

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useRequestPasswordReset();

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync({ email: data.email });
      toast.success("Se um usuário com esse e-mail existir, enviamos instruções.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message ?? "Erro ao solicitar recuperação.");
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Recuperar senha</h1>
      <p>Informe o seu e-mail e enviaremos instruções para redefinir a senha.</p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 16, display: 'grid', gap: 12, maxWidth: 420 }}>
        <label htmlFor="email">E-mail</label>
        <Input id="email" type="email" {...register('email')} />

        <button type="submit" disabled={mutation.isLoading} style={{ padding: '8px 12px' }}>
          {mutation.isLoading ? 'Enviando...' : 'Enviar instruções'}
        </button>
      </form>
    </main>
  );
}
