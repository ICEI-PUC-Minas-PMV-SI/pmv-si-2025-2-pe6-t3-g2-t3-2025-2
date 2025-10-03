package br.com.g2.medlink.controller.dto.paciente;

public record UpdatePacienteRequest(
        String nome,
        String endereco,
        String telefone
) {
}
