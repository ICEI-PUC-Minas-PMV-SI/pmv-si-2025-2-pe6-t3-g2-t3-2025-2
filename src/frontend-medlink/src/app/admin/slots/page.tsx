"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/services/api";
import { useCreateSlots } from "@/hooks/useCreateSlots";
import { useAdminSlots } from "@/hooks/useAdminSlots";
import { useCancelarSlot } from "@/hooks/useCancelarSlot";
import { toast } from "@/app/components/ui/toast";
import { formatTime } from "@/lib/datetime";
import { Trash2, RefreshCw, Calendar } from "lucide-react";
import { useState } from "react";

const schema = z.object({
  medicoId: z.string().min(1, "Selecione um médico"),
  data: z.string().min(1, "Informe a data"),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm"),
  horaFim: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm"),
  intervaloMinutos: z.number().min(15, "Mínimo 15 minutos").max(120, "Máximo 120 minutos"),
});

type FormData = z.infer<typeof schema>;

type MedicoResponse = {
  id: string;
  nome: string;
  especialidade: string;
};

export default function AdminSlotsPage() {
  const [filtroMedicoId, setFiltroMedicoId] = useState<string>("");
  const [filtroData, setFiltroData] = useState<string>("");

  const { data: medicos, isLoading: medicosLoading } = useQuery({
    queryKey: ["admin-medicos"],
    queryFn: async () => {
      const { data } = await api.get<MedicoResponse[]>("/medlink/admin/medicos");
      return data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      intervaloMinutos: 30,
    },
  });

  const { mutate: criarSlots, isPending: criando } = useCreateSlots();
  const { mutate: cancelarSlot, isPending: cancelando } = useCancelarSlot();

  const medicoIdForm = watch("medicoId");
  const dataForm = watch("data");

  const {
    data: slots,
    isLoading: slotsLoading,
    refetch: refetchSlots,
    isFetching: slotsFetching,
  } = useAdminSlots(filtroMedicoId, filtroData);

  const onSubmit = (values: FormData) => {
    criarSlots(
      {
        medicoId: values.medicoId,
        data: values.data,
        horaInicio: values.horaInicio,
        horaFim: values.horaFim,
        intervaloMinutos: values.intervaloMinutos,
      },
      {
        onSuccess: (data: any) => {
          const count = Array.isArray(data) ? data.length : data?.count || "vários";
          toast.success(`${count} slot(s) criado(s) com sucesso!`);
          reset({ intervaloMinutos: 30, medicoId: "", data: "", horaInicio: "", horaFim: "" });
          setFiltroMedicoId(values.medicoId);
          setFiltroData(values.data);
        },
        onError: (err: any) => {
          const status = err?.response?.status;
          const msg = err?.response?.data?.message || err?.response?.data;

          if (status === 404) {
            toast.error("Médico não encontrado.");
          } else if (status === 400) {
            toast.info(msg || "Dados inválidos. Verifique os horários.");
          } else if (status === 403) {
            toast.error("Você não tem permissão para criar slots.");
          } else {
            toast.error("Erro ao criar slots. Tente novamente.");
          }

          console.log("[CriarSlots][ERR]", {
            status,
            url: err?.config?.url,
            payload: err?.config?.data,
            data: err?.response?.data,
          });
        },
      }
    );
  };

  const handleCancelar = (slotId: string) => {
    if (!confirm("Tem certeza que deseja cancelar este slot?")) return;

    cancelarSlot(slotId, {
      onSuccess: () => {
        toast.success("Slot cancelado com sucesso!");
      },
      onError: (err: any) => {
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || err?.response?.data;

        if (status === 404) {
          toast.error("Slot não encontrado.");
        } else if (status === 400) {
          toast.info(msg || "Não é possível cancelar este slot.");
        } else if (status === 403) {
          toast.error("Você não tem permissão para cancelar slots.");
        } else {
          toast.error("Erro ao cancelar slot.");
        }

        console.log("[CancelarSlot][ERR]", {
          status,
          url: err?.config?.url,
          data: err?.response?.data,
        });
      },
    });
  };

  const handleBuscarSlots = () => {
    if (!medicoIdForm || !dataForm) {
      toast.warning("Selecione médico e data para buscar slots.");
      return;
    }
    setFiltroMedicoId(medicoIdForm);
    setFiltroData(dataForm);
  };

  const slotsOrdenados = (slots ?? [])
    .slice()
    .sort((a, b) => a.inicio.localeCompare(b.inicio));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Gerenciar Slots de Consulta</h1>
        <p style={{ color: "#666", marginTop: 4 }}>
          Crie horários disponíveis para os médicos e gerencie a agenda.
        </p>
      </header>

      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "1fr 1fr" }}>
        <section
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 20,
            background: "#fafafa",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: 18 }}>Criar Slots</h2>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 14 }}>
            <div>
              <label htmlFor="medicoId">Médico</label>
              <select
                id="medicoId"
                {...register("medicoId")}
                disabled={criando || medicosLoading}
              >
                <option value="">Selecione</option>
                {medicos?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome} — {m.especialidade}
                  </option>
                ))}
              </select>
              {errors.medicoId && (
                <small style={{ color: "crimson" }}>{errors.medicoId.message}</small>
              )}
            </div>

            <div>
              <label htmlFor="data">Data</label>
              <input id="data" type="date" {...register("data")} disabled={criando} />
              {errors.data && <small style={{ color: "crimson" }}>{errors.data.message}</small>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label htmlFor="horaInicio">Início</label>
                <input
                  id="horaInicio"
                  type="time"
                  {...register("horaInicio")}
                  disabled={criando}
                />
                {errors.horaInicio && (
                  <small style={{ color: "crimson" }}>{errors.horaInicio.message}</small>
                )}
              </div>
              <div>
                <label htmlFor="horaFim">Fim</label>
                <input id="horaFim" type="time" {...register("horaFim")} disabled={criando} />
                {errors.horaFim && (
                  <small style={{ color: "crimson" }}>{errors.horaFim.message}</small>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="intervaloMinutos">Intervalo (minutos)</label>
              <input
                id="intervaloMinutos"
                type="number"
                {...register("intervaloMinutos", { valueAsNumber: true })}
                placeholder="30"
                disabled={criando}
              />
              {errors.intervaloMinutos && (
                <small style={{ color: "crimson" }}>{errors.intervaloMinutos.message}</small>
              )}
            </div>

            <button type="submit" disabled={criando}>
              {criando ? "Criando..." : "Criar Slots"}
            </button>
          </form>
        </section>

        <section
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 20,
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Slots Criados</h2>
            <button
              type="button"
              onClick={handleBuscarSlots}
              disabled={!medicoIdForm || !dataForm}
              style={{
                marginLeft: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
              }}
            >
              <Calendar size={16} />
              Buscar
            </button>
            <button
              type="button"
              onClick={() => refetchSlots()}
              disabled={slotsFetching || !filtroMedicoId || !filtroData}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14 }}
            >
              <RefreshCw size={16} className={slotsFetching ? "spin" : ""} />
              Atualizar
            </button>
          </div>

          {!filtroMedicoId || !filtroData ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              Selecione médico e data no formulário e clique em "Buscar" para ver os slots.
            </p>
          ) : slotsLoading ? (
            <p>Carregando slots...</p>
          ) : slotsOrdenados.length === 0 ? (
            <p style={{ color: "#666" }}>Nenhum slot encontrado para esta data.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
              {slotsOrdenados.map((slot) => (
                <li
                  key={slot.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    padding: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background:
                      slot.status === "LIVRE"
                        ? "#f0fff4"
                        : slot.status === "RESERVADO"
                          ? "#fffbeb"
                          : "#fef2f2",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {formatTime(slot.inicio)} - {formatTime(slot.fim)}
                    </div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      Status:{" "}
                      <span
                        style={{
                          fontWeight: 600,
                          color:
                            slot.status === "LIVRE"
                              ? "#16a34a"
                              : slot.status === "RESERVADO"
                                ? "#ca8a04"
                                : "#dc2626",
                        }}
                      >
                        {slot.status}
                      </span>
                    </div>
                  </div>

                  {slot.status === "LIVRE" && (
                    <button
                      type="button"
                      onClick={() => handleCancelar(slot.id)}
                      disabled={cancelando}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        padding: "4px 8px",
                        color: "#dc2626",
                        border: "1px solid #fecaca",
                        background: "#fff",
                        borderRadius: 4,
                      }}
                    >
                      <Trash2 size={14} />
                      Cancelar
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <style jsx global>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}