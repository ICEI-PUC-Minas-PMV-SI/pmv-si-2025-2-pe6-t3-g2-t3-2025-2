package br.com.g2.medlink.controller.dto.consulta;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ConsultaRequest(
        @NotNull(message = "Id do médico é obrigatório")
        String medicoId,

        @NotNull(message = "Data e hora são obrigatórias")
        LocalDateTime dataHora,

        String observacoes
) {
}
