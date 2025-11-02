package br.com.g2.medlink.controller;

import br.com.g2.medlink.controller.dto.consulta.ConsultaResponse;
import br.com.g2.medlink.entity.Paciente;
import br.com.g2.medlink.service.ConsultaService;
import br.com.g2.medlink.service.MedicoService;
import br.com.g2.medlink.service.SlotService;
import br.com.g2.medlink.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/medlink/paciente")
public class PacienteSlotsController {

    @Autowired
    private SlotService slotService;

    @Autowired
    private UserService userService;

    @Autowired
    private MedicoService medicoService;
    // ou MedicoRepository, caso tenha
    @Autowired
    private ConsultaService consultaService;

    @GetMapping("/medicos/{medicoId}/slots")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<List<Map<String, Object>>> listarSlots(
            @PathVariable String medicoId,
            @RequestParam String data // "YYYY-MM-DD"
    ) {
        var medico = medicoService.buscarPorId(medicoId);
        var slots = slotService.listarSlotsLivresDoDia(medico, LocalDate.parse(data));
        var resp = slots.stream().map(s -> Map.<String, Object>of(
                "id", s.getId(),
                "inicio", s.getInicio(),
                "fim", s.getFim(),
                "status", s.getStatus().name()
        )).toList();
        return ResponseEntity.ok(resp);
    }

    public record AgendarPorSlotRequest(UUID slotId, String observacoes) {}

    @PostMapping("/consulta/por-slot")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<ConsultaResponse> agendarPorSlot(@RequestBody @Valid AgendarPorSlotRequest req) {
        if (req.slotId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "slotId é obrigatório");
        }
        Paciente paciente = userService.getPacienteDoUsuarioLogado();
        var consulta = consultaService.agendarPorSlot(paciente, req.slotId(), req.observacoes());

        var dto = new ConsultaResponse(
                consulta.getId(),
                consulta.getPaciente() != null ? consulta.getPaciente().getId() : null,
                consulta.getMedicoId(),
                consulta.getObservacoes(),
                consulta.getDataHora()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
}