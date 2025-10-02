package br.com.g2.medlink.controller.dto;

import jakarta.validation.constraints.Email;

public record UpdatePacienteRequest(
        String nome,
        String endereco,
        String telefone
) {
}
