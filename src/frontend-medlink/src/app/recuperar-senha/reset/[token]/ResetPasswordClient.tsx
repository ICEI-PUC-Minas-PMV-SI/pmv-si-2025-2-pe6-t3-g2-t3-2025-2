"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../../../../components/input/input";
import { toast } from "../../../../components/ui/toast";
import { useResetPassword } from "../../../../services/auth";

interface Props {
  token: string;
}

export default function ResetPasswordClient({ token }: Props) {
  const schema = z
    .object({
      password: z.string().min(6, "Senha precisa ter ao menos 6 caracteres"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas não conferem",
      path: ["confirmPassword"],
    });

  type FormData = z.infer<typeof schema>;

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useResetPassword();

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync({ token, password: data.password });
      toast.success("Senha redefinida com sucesso.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message ?? "Erro ao redefinir senha.");
    }
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Redefinir senha</h1>

      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 16, display: 'grid', gap: 12, maxWidth: 420 }}>
        <label htmlFor="password">Nova senha</label>
        <Input id="password" type="password" {...register('password')} />

        <label htmlFor="confirmPassword">Confirme a nova senha</label>
        <Input id="confirmPassword" type="password" {...register('confirmPassword')} />

        <button type="submit" disabled={mutation.isLoading} style={{ padding: '8px 12px' }}>
          {mutation.isLoading ? 'Enviando...' : 'Redefinir senha'}
        </button>
      </form>
    </main>
  );
}
