package br.com.g2.medlink.controller.dto;

import jakarta.validation.constraints.Email;

public record AuthRequest(
        String email,
        String password) {
}
