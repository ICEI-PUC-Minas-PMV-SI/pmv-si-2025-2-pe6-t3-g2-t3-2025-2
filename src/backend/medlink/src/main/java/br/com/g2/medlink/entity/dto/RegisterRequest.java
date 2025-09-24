package br.com.g2.medlink.entity.dto;

import br.com.g2.medlink.entity.UserRole;

public record RegisterRequest(
        String username,
        String password,
        UserRole role
) {
}
