package br.com.g2.medlink.controller;

import br.com.g2.medlink.entity.Medico;
import br.com.g2.medlink.service.MedicoService;
import br.com.g2.medlink.service.SlotService;
import br.com.g2.medlink.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/medlink/medico/disponibilidades")
public class MedicoDisponibilidadeController {

    @Autowired
    private SlotService slotService;

    @Autowired
    private UserService userService;

    @Autowired
    private MedicoService medicoService; // ou MedicoRepository

    public record CriarDisponibilidadeRequest(LocalDateTime inicio, LocalDateTime fim) {}

    @PostMapping({ "", "/{medicoId}" })
    @PreAuthorize("hasRole('MEDICO') or hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> criarSlots(
            @PathVariable(required = false) String medicoId,
            @RequestBody @Valid CriarDisponibilidadeRequest req,
            @RequestParam(defaultValue = "30") int duracaoMin,
            Authentication authentication
    ) {
        if (req.inicio() == null || req.fim() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Campos 'inicio' e 'fim' são obrigatórios");
        }
        if (!req.inicio().isBefore(req.fim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "'inicio' deve ser anterior a 'fim'");
        }
        if (duracaoMin <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "duracaoMin deve ser maior que 0");
        }

        boolean isMedico = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_MEDICO"));

        Medico medico;
        if (isMedico) {
            medico = userService.getMedicoDoUsuarioLogado();
            if (medico == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário logado não está associado a um médico");
            }
        } else {
            if (medicoId == null || medicoId.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o ID do médico no path: /{medicoId}");
            }
            medico = medicoService.buscarPorId(medicoId);
        }

        var slots = slotService.gerarSlotsParaJanela(medico, req.inicio(), req.fim(), duracaoMin);
        var resp = slots.stream().map(s -> Map.<String, Object>of(
                "id", s.getId(),
                "inicio", s.getInicio(),
                "fim", s.getFim(),
                "status", s.getStatus().name()
        )).toList();

        return ResponseEntity.ok(resp);
    }

}