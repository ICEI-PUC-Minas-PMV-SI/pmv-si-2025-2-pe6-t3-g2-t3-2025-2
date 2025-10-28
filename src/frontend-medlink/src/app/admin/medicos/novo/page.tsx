"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useCreateMedico } from "../../../../hooks/useCreateMedico";

// Enum de especialidades suportadas pelo backend
const EspecialidadeEnum = z.enum([
  "OFTALMOLOGIA",
  "CARDIOLOGIA",
  "ORTOPEDIA",
  "PEDIATRIA",
]);

// Se o select vier com "", convertemos para undefined para disparar erro
const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  nome: z.string().min(3, "Informe o nome completo"),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  especialidade: z.preprocess(
    (v) => (v === "" ? undefined : v),
    EspecialidadeEnum
  ),
  crm: z.string().min(3, "CRM inválido"),
});

type FormData = z.infer<typeof schema>;

export default function NovoMedicoPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useCreateMedico();

  const onSubmit = (values: FormData) => {
    // Payload casa com MedicoRequest do backend
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
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Cadastrar Médico</h1>
        <Link href="/admin/medicos" style={{ marginLeft: "auto" }}>
          <button>Voltar</button>
        </Link>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "grid", gap: 12 }}
      >
        <div>
          <label>Nome</label>
          <input
            {...register("nome")}
            placeholder="Nome completo"
            disabled={isPending}
          />
          {errors.nome && (
            <small style={{ color: "crimson" }}>{errors.nome.message}</small>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div>
            <label>Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="medico@exemplo.com"
              disabled={isPending}
            />
            {errors.email && (
              <small style={{ color: "crimson" }}>{errors.email.message}</small>
            )}
          </div>
          <div>
            <label>Senha</label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              disabled={isPending}
            />
            {errors.password && (
              <small style={{ color: "crimson" }}>
                {errors.password.message}
              </small>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div>
            <label>CRM</label>
            <input
              {...register("crm")}
              placeholder="CRM"
              disabled={isPending}
            />
            {errors.crm && (
              <small style={{ color: "crimson" }}>{errors.crm.message}</small>
            )}
          </div>
          <div>
            <label>Telefone</label>
            <input
              {...register("telefone")}
              placeholder="(99) 99999-9999"
              disabled={isPending}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div>
            <label>Endereço</label>
            <input
              {...register("endereco")}
              placeholder="Rua, nº, bairro"
              disabled={isPending}
            />
          </div>
          <div>
            <label>Especialidade</label>
            <select {...register("especialidade")} disabled={isPending} defaultValue="">
              <option value="">Selecione</option>
              {EspecialidadeEnum.options.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            {errors.especialidade && (
              <small style={{ color: "crimson" }}>
                {errors.especialidade.message || "Especialidade é obrigatória"}
              </small>
            )}
          </div>
        </div>

        <button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}