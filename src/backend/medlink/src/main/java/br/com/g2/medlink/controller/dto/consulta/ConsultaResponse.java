package br.com.g2.medlink.controller.dto.consulta;

import java.time.LocalDateTime;
import java.util.UUID;

public record ConsultaResponse(
        UUID id,
        String pacienteId,
        String medicoId,
        String observacao,
        LocalDateTime dataHora
) {
}
