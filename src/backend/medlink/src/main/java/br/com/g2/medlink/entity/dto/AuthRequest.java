package br.com.g2.medlink.entity.dto;

import jakarta.validation.constraints.Email;

public record AuthRequest(
        String email,
        String password) {
}
