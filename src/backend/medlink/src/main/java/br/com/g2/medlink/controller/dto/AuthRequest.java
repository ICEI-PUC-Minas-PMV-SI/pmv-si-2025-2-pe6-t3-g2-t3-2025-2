package br.com.g2.medlink.controller.dto;

public record AuthRequest(
        String email,
        String password) {
}
