package br.com.g2.medlink.controller.dto.medico;

import br.com.g2.medlink.entity.enums.Especialidade;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MedicoRequest(
        @Email(message = "E-mail em formato inválido")
        @NotBlank(message = "E-mail não pode ficar em branco")
        String email,

        @NotBlank(message = "Senha não pode ficar em branco")
        @Size(min = 8, message = "Senha deve ter pelo menos 8 caracteres")
        String password,

        @NotBlank(message = "Nome não pode ficar em branco")
        String nome,
        String endereco,
        String telefone,

        @NotNull(message = "Especialidade não pode ficar em branco")
        Especialidade especialidade,

        @NotBlank(message = "CRM não pode ficar em branco")
        String crm
) {
}
