"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateMedico } from "@/hooks/useCreateMedico";
import { toast } from "@/app/components/ui/toast";

const EspecialidadeEnum = z.enum([
  "OFTALMOLOGIA",
  "CARDIOLOGIA",
  "ORTOPEDIA",
  "PEDIATRIA",
]);

const schema = z.object({
  email: z
    .string()
    .regex(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/, {
      message: "E-mail inválido",
    }),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  nome: z.string().min(3, "Informe o nome completo"),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  especialidade: EspecialidadeEnum,
  crm: z.string().min(3, "CRM inválido"),
});

type FormData = z.infer<typeof schema>;

export default function NovoMedicoPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      especialidade: "OFTALMOLOGIA",
    },
  });

  const { mutate, isPending } = useCreateMedico();

  const onSubmit = (values: FormData) => {
    mutate(
      {
        email: values.email,
        password: values.password,
        nome: values.nome,
        endereco: values.endereco ?? "",
        telefone: values.telefone ?? "",
        especialidade: values.especialidade,
        crm: values.crm,
      },
      {
        onSuccess: () => {
          toast.success("Médico cadastrado com sucesso!");
          router.push("/admin/medicos");
        },
        onError: (err: any) => {
          const status = err?.response?.status;
          const msg = err?.response?.data?.message || err?.response?.data;

          if (status === 409) {
            toast.warning("Este e-mail já está cadastrado.");
          } else if (status === 400) {
            toast.info(msg || "Dados inválidos. Verifique os campos.");
          } else if (status === 403) {
            toast.error("Você não tem permissão para cadastrar médicos.");
          } else {
            toast.error("Erro ao cadastrar médico. Tente novamente.");
          }

          console.log("[CadastrarMedico][ERR]", {
            status,
            url: err?.config?.url,
            method: err?.config?.method,
            payload: err?.config?.data,
            data: err?.response?.data,
          });
        },
      }
    );
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Cadastrar Médico</h1>
        <Link href="/admin/medicos" style={{ marginLeft: "auto" }}>
          <button type="button">Voltar</button>
        </Link>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 16 }}>
        <div>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            {...register("nome")}
            placeholder="Nome completo"
            disabled={isPending}
          />
          {errors.nome && <small style={{ color: "crimson" }}>{errors.nome.message}</small>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="medico@exemplo.com"
              disabled={isPending}
            />
            {errors.email && <small style={{ color: "crimson" }}>{errors.email.message}</small>}
          </div>
          <div>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="••••••••"
              disabled={isPending}
            />
            {errors.password && (
              <small style={{ color: "crimson" }}>{errors.password.message}</small>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label htmlFor="crm">CRM</label>
            <input id="crm" {...register("crm")} placeholder="CRM" disabled={isPending} />
            {errors.crm && <small style={{ color: "crimson" }}>{errors.crm.message}</small>}
          </div>
          <div>
            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              {...register("telefone")}
              placeholder="(99) 99999-9999"
              disabled={isPending}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label htmlFor="endereco">Endereço</label>
            <input
              id="endereco"
              {...register("endereco")}
              placeholder="Rua, nº, bairro"
              disabled={isPending}
            />
          </div>
          <div>
            <label htmlFor="especialidade">Especialidade</label>
            <select id="especialidade" {...register("especialidade")} disabled={isPending}>
              {EspecialidadeEnum.options.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            {errors.especialidade && (
              <small style={{ color: "crimson" }}>{errors.especialidade.message}</small>
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