package br.com.g2.medlink.controller.dto.slot;

public record SlotResponse(
        String id,
        String medicoId,
        String medicoNome,
        String data,      // "YYYY-MM-DD"
        String inicio,    // ISO
        String fim,       // ISO
        String status     // LIVRE | RESERVADO | CANCELADO
) {}