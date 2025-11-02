package br.com.g2.medlink.controller;

import br.com.g2.medlink.controller.dto.admin.AdminRequest;
import br.com.g2.medlink.controller.dto.consulta.ConsultaResponse;
import br.com.g2.medlink.controller.dto.medico.MedicoResponse;
import br.com.g2.medlink.controller.dto.paciente.PacienteResponse;
import br.com.g2.medlink.controller.dto.slot.SlotCreateRequest;
import br.com.g2.medlink.controller.dto.slot.SlotResponse;
import br.com.g2.medlink.entity.Medico;
<<<<<<< HEAD
=======
import br.com.g2.medlink.entity.Slot;
>>>>>>> c7771681293bfd0fb68f194e22df68fc8f45a639
import br.com.g2.medlink.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
<<<<<<< HEAD
=======
import java.time.LocalDateTime;
import java.time.LocalTime;
>>>>>>> c7771681293bfd0fb68f194e22df68fc8f45a639
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/medlink/admin")
public class AdminController {

    @Autowired
    private MedicoService medicoService;

    @Autowired
    private ConsultaService consultaService;

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private UserService userService;

    @Autowired
    private SlotService slotService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> registerAdmin(@RequestBody @Valid AdminRequest adminRequest) {
        if (userService.findByEmail(adminRequest.email()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("E-mail já cadastrado.");
        }
        userService.salvarAdmin(adminRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Admin registrado com sucesso.");
    }

    @GetMapping("/consultas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ConsultaResponse>> getConsultas() {
        List<ConsultaResponse> consultas = consultaService.getConsultas();
        return ResponseEntity.status(HttpStatus.OK).body(consultas);
    }

    @GetMapping("/medicos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MedicoResponse>> getMedicos() {
        List<MedicoResponse> medicos = medicoService.getMedicos();
        return ResponseEntity.status(HttpStatus.OK).body(medicos);
    }

    @GetMapping("/pacientes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PacienteResponse>> getPacientes() {
        List<PacienteResponse> pacientes = pacienteService.getPacientes();
        return ResponseEntity.status(HttpStatus.OK).body(pacientes);
    }

    @PostMapping("/slots")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SlotResponse>> criarSlots(@RequestBody @Valid SlotCreateRequest req) {
        System.out.println("[ADMIN SLOTS] Entrou POST /medlink/admin/slots: " + req);
        try {
            Medico medico = medicoService.buscarPorId(req.medicoId());

            var dia = LocalDate.parse(req.data());
            var hInicio = java.time.LocalTime.parse(req.horaInicio());
            var hFim = java.time.LocalTime.parse(req.horaFim());
            if (!hInicio.isBefore(hFim)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            var inicio = java.time.LocalDateTime.of(dia, hInicio);
            var fim = java.time.LocalDateTime.of(dia, hFim);

            var created = slotService.gerarSlotsParaJanela(
                    medico, inicio, fim, req.intervaloMinutos() // ou req.intervaloMinutos()
            );

            var resp = created.stream().map(s -> new SlotResponse(
                    s.getId().toString(),
                    s.getMedico().getId().toString(),
                    s.getMedico().getNome(),
                    s.getInicio().toLocalDate().toString(),
                    s.getInicio().toString(),
                    s.getFim().toString(),
                    s.getStatus().name()
            )).toList();

            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (Exception e) {
            e.printStackTrace();
            // Retorne 400/409 conforme a regra de negócio em vez de deixar cair no /error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(List.of());
        }
    }

    @GetMapping("/slots")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SlotResponse>> listarSlots(
            @RequestParam String medicoId,
            @RequestParam String data // "YYYY-MM-DD"
    ) {
        Medico medico = medicoService.buscarPorId(medicoId);
        LocalDate dia = LocalDate.parse(data);

        var slots = slotService.listarSlotsLivresDoDia(medico, dia);

        var resp = slots.stream().map(s -> new SlotResponse(
                s.getId().toString(),
                s.getMedico().getId().toString(),
                s.getMedico().getNome(),
                s.getInicio().toLocalDate().toString(),
                s.getInicio().toString(),
                s.getFim().toString(),
                s.getStatus().name()
        )).toList();

        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("/slots/{slotId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletarSlot(@PathVariable UUID slotId) {
        System.out.println("[ADMIN SLOTS] Entrou DELETE/medlink/admin/slots" + slotId);
        slotService.cancelarOuExcluirSlotLivre(slotId); // veja o método abaixo
        return ResponseEntity.noContent().build();
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> c7771681293bfd0fb68f194e22df68fc8f45a639
