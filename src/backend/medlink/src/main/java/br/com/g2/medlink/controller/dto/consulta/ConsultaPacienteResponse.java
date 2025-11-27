package br.com.g2.medlink.controller.dto.consulta;

import java.time.LocalDateTime;
import java.util.UUID;

public record ConsultaPacienteResponse(
        UUID id,
        String medicoId,
        String medicoNome,
        String especialidade,
        LocalDateTime dataHora,
        String observacoes,
        String status
) {}
