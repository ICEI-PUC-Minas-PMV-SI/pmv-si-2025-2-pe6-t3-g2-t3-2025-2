package br.com.g2.medlink.controller.dto.slot;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
<<<<<<< HEAD
=======
import jakarta.validation.constraints.NotNull;
>>>>>>> c7771681293bfd0fb68f194e22df68fc8f45a639

public record SlotCreateRequest(
        @NotBlank String medicoId,
        @NotBlank String data,         // "YYYY-MM-DD"
        @NotBlank String horaInicio,   // "HH:mm"
        @NotBlank String horaFim,      // "HH:mm"
        @Min(5) int intervaloMinutos,  // ex.: 30
        String observacoes
) {}