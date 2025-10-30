"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useListMedicosParaPaciente,
  useSlotsLivresDoMedico,
  type SlotDTO,
} from "@/features/paciente/queries";
import { useAgendarConsultaPorSlot } from "@/features/paciente/useAgendarConsulta";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/app/components/ui/toast";
import { formatTime } from "@/lib/datetime";

const schema = z.object({
  medicoId: z.string().min(1, "Selecione um médico"),
  data: z.string().min(1, "Informe a data"), // YYYY-MM-DD
  slotId: z.string().min(1, "Selecione um horário"),
  observacoes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function formatHoraLabel(s: SlotDTO) {
  return `${formatTime(s.inicio)} - ${formatTime(s.fim)}`;
}

export default function NovaConsultaPacientePage() {
  const router = useRouter();
  const { data: medicos, isLoading: medicosLoading, isError: medicosError } =
    useListMedicosParaPaciente();
  const { mutate: agendar, isPending } = useAgendarConsultaPorSlot();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      medicoId: "",
      data: "",
      slotId: "",
      observacoes: "",
    },
  });

  const medicoId = watch("medicoId");
  const dataISO = watch("data");

  // LOGS de depuração
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("[NovaConsulta] medicoId=", medicoId, "dataISO=", dataISO);
  }, [medicoId, dataISO]);

  const {
    data: slots,
    isLoading: slotsLoading,
    isError: slotsError,
  } = useSlotsLivresDoMedico(medicoId, dataISO);

  useEffect(() => {
    if (slots) {
      // eslint-disable-next-line no-console
      console.log("[NovaConsulta][Slots]", slots);
    }
  }, [slots]);

  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const slotsOrdenados = useMemo(
    () => (slots ?? []).slice().sort((a, b) => a.inicio.localeCompare(b.inicio)),
    [slots]
  );

  // Sincroniza o slotId do formulário quando usuário clica nos cards
  const handleSelectSlot = (slotId: string) => {
    setSelectedSlot(slotId);
    setValue("slotId", slotId, { shouldValidate: true });
  };

  const onSubmit = (values: FormData) => {
    agendar(
      { slotId: values.slotId, observacoes: values.observacoes || "" },
      {
        onSuccess: () => {
          toast.success("Consulta agendada com sucesso!");
          router.push("/paciente/consultas");
        },
        onError: (err: any) => {
          const status = err?.response?.status;
          if (status === 409) {
            toast.warning("Esse horário acabou de ser reservado. Escolha outro.");
          } else if (status === 404) {
            toast.error("Slot não encontrado.");
          } else if (status === 400) {
            toast.info(err?.response?.data?.message || "Dados inválidos.");
          } else if (status === 403) {
            toast.error("Você não tem permissão para agendar. Faça login como paciente.");
          } else {
            toast.error("Erro ao agendar consulta.");
          }
          console.log("[AgendarConsulta][ERR]", {
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

  // Resetar seleção quando trocar médico ou data
  const medicoOuDataIndef = !medicoId || !dataISO;
  const disabledSlots = isPending || slotsLoading || slotsError || medicoOuDataIndef;

  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Agendar Consulta</h1>
        <Link href="/paciente/consultas" style={{ marginLeft: "auto" }}>
          <button type="button">Voltar</button>
        </Link>
      </header>

      {medicosError && (
        <p style={{ color: "crimson" }}>
          Erro ao carregar médicos. Verifique sua sessão e permissões.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 16 }}>
        <div>
          <label htmlFor="medico">Médico</label>
          <select
            {...register("medicoId")}
            disabled={isPending || medicosLoading}
            defaultValue=""
            onChange={(e) => {
              const val = e.target.value;
              // setar no RHF para o watch refletir imediatamente
              setValue("medicoId", val, { shouldValidate: true, shouldDirty: true });
              // resetar seleção de slot
              setSelectedSlot("");
              setValue("slotId", "", { shouldValidate: true });
            }}
          >
            <option value="">Selecione</option>
            {medicos?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} — {m.especialidade}
              </option>
            ))}
          </select>
          {errors.medicoId && <small style={{ color: "crimson" }}>{errors.medicoId.message}</small>}
        </div>

        <div>
          <label htmlFor="data">Data</label>
          <input
            type="date"
            {...register("data")}
            disabled={isPending}
            onChange={(e) => {
              const val = e.target.value; // YYYY-MM-DD
              setValue("data", val, { shouldValidate: true, shouldDirty: true });
              setSelectedSlot("");
              setValue("slotId", "", { shouldValidate: true });
            }}
          />
          {errors.data && <small style={{ color: "crimson" }}>{errors.data.message}</small>}
        </div>

        {/* Campo escondido controlado pelo Zod para validar slotId */}
        <input type="hidden" {...register("slotId")} />

        <div>
          <label htmlFor="hora">Horários disponíveis</label>
          <div
            style={{
              display: "grid",
              gap: 8,
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            }}
            aria-busy={slotsLoading}
            aria-live="polite"
          >
            {medicoOuDataIndef && (
              <div style={{ color: "#666", fontStyle: "italic" }}>
                Selecione médico e data para ver horários.
              </div>
            )}

            {!medicoOuDataIndef && slotsLoading && (
              <div style={{ color: "#666" }}>Carregando horários...</div>
            )}

            {!medicoOuDataIndef && !slotsLoading && slotsError && (
              <div style={{ color: "crimson" }}>Erro ao carregar horários.</div>
            )}

            {!medicoOuDataIndef && !slotsLoading && !slotsError && slotsOrdenados.length === 0 && (
              <div style={{ color: "#666" }}>Sem horários disponíveis para esta data.</div>
            )}

            {!medicoOuDataIndef &&
              !slotsLoading &&
              !slotsError &&
              slotsOrdenados.map((slot) => {
                const selected = selectedSlot === slot.id;
                const indisponivel = slot.status !== "LIVRE";
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => handleSelectSlot(slot.id)}
                    disabled={disabledSlots || indisponivel}
                    title={formatHoraLabel(slot)}
                    style={{
                      textAlign: "left",
                      padding: 12,
                      borderRadius: 8,
                      border: selected ? "2px solid #2563eb" : "1px solid #ddd",
                      background: selected ? "#eff6ff" : "#fff",
                      cursor: disabledSlots ? "not-allowed" : "pointer",
                      opacity: indisponivel ? 0.6 : 1,
                    }}
                    aria-pressed={selected}
                  >
                    <div style={{ fontWeight: 600 }}>{formatTime(slot.inicio)}</div>
                    <div style={{ color: "#555", fontSize: 12 }}>até {formatTime(slot.fim)}</div>
                    {indisponivel && (
                      <div style={{ marginTop: 6, color: "#a00", fontSize: 12 }}>Indisponível</div>
                    )}
                  </button>
                );
              })}
          </div>
          {errors.slotId && <small style={{ color: "crimson" }}>{errors.slotId.message}</small>}
        </div>

        <div>
          <label htmlFor="obser">Observações</label>
          <textarea
            {...register("observacoes")}
            placeholder="Observações (opcional)"
            disabled={isPending}
            rows={4}
          />
        </div>

        <button type="submit" disabled={isPending || !selectedSlot}>
          {isPending ? "Agendando..." : "Agendar"}
        </button>
      </form>
    </div>
  );
}