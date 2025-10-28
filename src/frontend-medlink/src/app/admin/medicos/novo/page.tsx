"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useCreateMedico } from "../../../../hooks/useCreateMedico";

const EspecialidadeEnum = z.enum([
  "OFTALMOLOGIA",
  "CARDIOLOGIA",
  "ORTOPEDIA",
  "PEDIATRIA",
]);

const schema = z.object({
  email: z.string().regex(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/, { message: "E-mail inválido" }),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  nome: z.string().min(3, "Informe o nome completo"),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  especialidade: EspecialidadeEnum,
  crm: z.string().min(3, "CRM inválido"),
});

type FormData = z.infer<typeof schema>;

export default function NovoMedicoPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      especialidade: "OFTALMOLOGIA", // evita "" e mantém o tipo literal correto
    },
  });

  const { mutate, isPending } = useCreateMedico();

  const onSubmit = (values: FormData) => {
    mutate({
      email: values.email,
      password: values.password,
      nome: values.nome,
      endereco: values.endereco ?? "",
      telefone: values.telefone ?? "",
      especialidade: values.especialidade,
      crm: values.crm,
    });
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Cadastrar Médico</h1>
        <Link href="/admin/medicos" style={{ marginLeft: "auto" }}>
          <button type="button">Voltar</button>
        </Link>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 12 }}>
        <div>
          <label htmlFor="#">Nome</label>
          <input {...register("nome")} placeholder="Nome completo" disabled={isPending} />
          {errors.nome && <small style={{ color: "crimson" }}>{errors.nome.message}</small>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label htmlFor="#">Email</label>
            <input type="email" {...register("email")} placeholder="medico@exemplo.com" disabled={isPending} />
            {errors.email && <small style={{ color: "crimson" }}>{errors.email.message}</small>}
          </div>
          <div>
            <label htmlFor="#">Senha</label>
            <input type="password" {...register("password")} placeholder="••••••••" disabled={isPending} />
            {errors.password && <small style={{ color: "crimson" }}>{errors.password.message}</small>}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label htmlFor="#">CRM</label>
            <input {...register("crm")} placeholder="CRM" disabled={isPending} />
            {errors.crm && <small style={{ color: "crimson" }}>{errors.crm.message}</small>}
          </div>
          <div>
            <label htmlFor="#">Telefone</label>
            <input {...register("telefone")} placeholder="(99) 99999-9999" disabled={isPending} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label htmlFor="#">Endereço</label>
            <input {...register("endereco")} placeholder="Rua, nº, bairro" disabled={isPending} />
          </div>
          <div>
            <label htmlFor="#">Especialidade</label>
            <select {...register("especialidade")} disabled={isPending}>
              {EspecialidadeEnum.options.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            {errors.especialidade && (
              <small style={{ color: "crimson" }}>{errors.especialidade.message}</small>
            )}
          </div>
        </div>

        <button type="submit" disabled={isPending}>{isPending ? "Salvando..." : "Salvar"}</button>
      </form>
    </div>
  );
}