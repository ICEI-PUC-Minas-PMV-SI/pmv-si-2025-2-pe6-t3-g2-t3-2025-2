package br.com.g2.medlink.controller.dto.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminRequest(
        @NotBlank(message = "E-mail não pode ficar em branco")
        String nome,

        @Email(message = "E-mail em formato inválido")
        String email,

        @NotBlank(message = "Senha não pode ficar em branco")
        @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")
        String password
) {
}
