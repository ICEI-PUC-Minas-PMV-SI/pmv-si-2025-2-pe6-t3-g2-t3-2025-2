package br.com.g2.medlink.controller.dto.medico;


import br.com.g2.medlink.entity.enums.Especialidade;

public record MedicoResponse(
        String id,
        String nome,
        Especialidade especialidade
) {
}