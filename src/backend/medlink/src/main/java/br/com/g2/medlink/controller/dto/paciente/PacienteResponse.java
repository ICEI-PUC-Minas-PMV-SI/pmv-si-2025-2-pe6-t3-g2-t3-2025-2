package br.com.g2.medlink.controller.dto.paciente;

public record PacienteResponse(
        String id,
        String email,
        String nome,
        String endereco,
        String telefone
) {
}
