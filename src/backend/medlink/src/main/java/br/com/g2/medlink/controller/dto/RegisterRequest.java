package br.com.g2.medlink.controller.dto;

import br.com.g2.medlink.entity.enums.UserRole;

public record RegisterRequest(
        String email,
        String password,
        UserRole role
) {
}
