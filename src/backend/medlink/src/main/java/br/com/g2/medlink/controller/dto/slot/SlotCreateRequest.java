package br.com.g2.medlink.controller.dto.slot;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SlotCreateRequest(
        @NotBlank String medicoId,
        @NotBlank String data,         // "YYYY-MM-DD"
        @NotBlank String horaInicio,   // "HH:mm"
        @NotBlank String horaFim,      // "HH:mm"
        @Min(5) int intervaloMinutos,  // ex.: 30
        String observacoes
) {}