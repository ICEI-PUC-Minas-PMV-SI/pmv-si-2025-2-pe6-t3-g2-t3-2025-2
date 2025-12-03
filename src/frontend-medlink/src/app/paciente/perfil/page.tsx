"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/app/components/input/input";
import { toast } from "@/app/components/ui/toast";
import {
  useGetPacienteProfile,
  useUpdatePacienteProfile,
} from "@/features/paciente/usePacienteProfile";
import styles from "./page.module.css";

const profileSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 caracteres"),
  endereco: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function PacientePerfilPage() {
  const { data: profile, isLoading, error } = useGetPacienteProfile();
  const updateMutation = useUpdatePacienteProfile();
  const { register, handleSubmit, reset, formState } = useForm<ProfileFormData>(
    {
      resolver: zodResolver(profileSchema),
    },
  );

  // Preencher form com dados do perfil quando carregar
  useEffect(() => {
    if (profile) {
      reset({
        nome: profile.nome || "",
        telefone: profile.telefone || "",
        endereco: profile.endereco || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateMutation.mutateAsync(data);
      toast.success("Perfil atualizado com sucesso!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message ?? "Erro ao atualizar perfil.");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.perfil}>
        <div className="container">
          <header className={styles.perfil__header}>
            <h1 className={styles.perfil__title}>Meu Perfil</h1>
          </header>
          <div className={styles.perfil__loading} aria-busy="true">
            Carregando dados do perfil...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.perfil}>
        <div className="container">
          <header className={styles.perfil__header}>
            <h1 className={styles.perfil__title}>Meu Perfil</h1>
            <div
              className={styles.perfil__actions}
              role="toolbar"
              aria-label="Ações da página"
            >
              <Link
                href="/paciente/consultas"
                className={styles.btn}
                aria-label="Voltar para consultas"
              >
                ← Voltar
              </Link>
            </div>
          </header>
          <div className={styles["perfil__error-message"]} role="alert">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={20} />
              <span>Erro ao carregar perfil. Tente novamente.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nomeError = formState.errors.nome?.message;
  const telefoneError = formState.errors.telefone?.message;
  const enderecoError = formState.errors.endereco?.message;

  return (
    <div className={styles.perfil}>
      <div className="container">
        <header className={styles.perfil__header}>
          <h1 className={styles.perfil__title}>Meu Perfil</h1>
          <div
            className={styles.perfil__actions}
            role="toolbar"
            aria-label="Ações da página"
          >
            <Link
              href="/paciente/consultas"
              className={styles.btn}
              aria-label="Voltar para consultas"
            >
              ← Voltar
            </Link>
          </div>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.perfil__content}
        >
          {/* Email (read-only) */}
          <div className={styles.perfil__section}>
            <label htmlFor="email" className={styles.perfil__section_title}>
              E-mail
            </label>
            <div id="email" className={styles.perfil__email_display}>
              {profile?.email}
            </div>
            <p className={styles.perfil__email_hint}>
              E-mail não pode ser alterado
            </p>
          </div>

          {/* Nome */}
          <div className={styles.perfil__form_group}>
            <label htmlFor="nome" className={styles.perfil__label}>
              Nome Completo
            </label>
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              className={styles.perfil__input}
              {...register("nome")}
              disabled={updateMutation.isPending}
              aria-invalid={!!nomeError}
              aria-describedby={nomeError ? "nome-error" : undefined}
            />
            {nomeError && (
              <div
                id="nome-error"
                className={styles.perfil__error}
                role="alert"
              >
                <AlertCircle size={14} />
                {nomeError}
              </div>
            )}
          </div>

          {/* Telefone */}
          <div className={styles.perfil__form_group}>
            <label htmlFor="telefone" className={styles.perfil__label}>
              Telefone
            </label>
            <Input
              id="telefone"
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              className={styles.perfil__input}
              {...register("telefone")}
              disabled={updateMutation.isPending}
              aria-invalid={!!telefoneError}
              aria-describedby={telefoneError ? "telefone-error" : undefined}
            />
            {telefoneError && (
              <div
                id="telefone-error"
                className={styles.perfil__error}
                role="alert"
              >
                <AlertCircle size={14} />
                {telefoneError}
              </div>
            )}
          </div>

          {/* Endereço */}
          <div className={styles.perfil__form_group}>
            <label htmlFor="endereco" className={styles.perfil__label}>
              Endereço
            </label>
            <Input
              id="endereco"
              type="text"
              placeholder="Rua, número, complemento"
              className={styles.perfil__input}
              {...register("endereco")}
              disabled={updateMutation.isPending}
              aria-invalid={!!enderecoError}
              aria-describedby={enderecoError ? "endereco-error" : undefined}
            />
            {enderecoError && (
              <div
                id="endereco-error"
                className={styles.perfil__error}
                role="alert"
              >
                <AlertCircle size={14} />
                {enderecoError}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className={styles.perfil__actions_group}>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className={`${styles.btn} ${styles["btn--primary"]}`}
              aria-busy={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </button>
            <Link
              href="/paciente/consultas"
              className={`${styles.btn} ${styles["btn--secondary"]}`}
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
