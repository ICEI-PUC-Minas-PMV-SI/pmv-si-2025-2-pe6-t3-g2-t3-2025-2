package br.com.g2.medlink.controller;

import br.com.g2.medlink.controller.dto.consulta.ConsultaPacienteResponse;
import br.com.g2.medlink.controller.dto.consulta.ConsultaRequest;
import br.com.g2.medlink.controller.dto.medico.MedicoResponse;
import br.com.g2.medlink.controller.dto.paciente.PacienteRequest;
import br.com.g2.medlink.controller.dto.paciente.PacienteResponse;
import br.com.g2.medlink.controller.dto.paciente.UpdatePacienteRequest;
import br.com.g2.medlink.entity.Consulta;
import br.com.g2.medlink.entity.Paciente;
import br.com.g2.medlink.service.ConsultaService;
import br.com.g2.medlink.service.MedicoService;
import br.com.g2.medlink.service.PacienteService;
import br.com.g2.medlink.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medlink/paciente")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private ConsultaService consultaService;

    @Autowired
    private UserService userService;

    @Autowired
    private MedicoService medicoService;

    private static final Logger log = LoggerFactory.getLogger(PacienteController.class);

    @PostMapping("/consulta")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<Consulta> createConsulta(@RequestBody @Valid ConsultaRequest request) {
        Paciente paciente = userService.getPacienteDoUsuarioLogado();
        Consulta consulta = consultaService.criarConsulta(paciente, request.medicoId(), request.dataHora(), request.observacoes());
        return ResponseEntity.status(HttpStatus.CREATED).body(consulta);
    }

    @GetMapping
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<PacienteResponse> getPaciente() {
        PacienteResponse response = pacienteService.getPaciente();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<PacienteResponse> updatePaciente(@RequestBody @Valid UpdatePacienteRequest updatePacienteRequest) {
        PacienteResponse response = pacienteService.updatePaciente(updatePacienteRequest);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/consultas")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<List<ConsultaPacienteResponse>> getConsultas() {
        Paciente paciente = userService.getPacienteDoUsuarioLogado();
        List<ConsultaPacienteResponse> consultas = consultaService.listarConsultasDoPacienteComMedico(paciente);
        return ResponseEntity.ok(consultas);
    }

    @DeleteMapping("/consulta/{id}")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<String> cancelarConsulta(@PathVariable String id) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("[CANCELAR] authName={}, authorities={}", auth != null ? auth.getName() : null, auth != null ? auth.getAuthorities() : null);

        Paciente paciente = userService.getPacienteDoUsuarioLogado();
        consultaService.cancelarConsultaDoPaciente(id, paciente);
        return ResponseEntity.ok("Consulta cancelada com sucesso!");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid PacienteRequest pacienteRequest) {
        if (userService.findByEmail(pacienteRequest.email()).isPresent())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("E-mail já cadastrado.");
        userService.salvarPaciente(pacienteRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Paciente registrado com sucesso.");
    }

    @GetMapping("/medicos")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<List<MedicoResponse>> listarMedicos() {
        List<MedicoResponse> medicos = medicoService.listarMedicos();
        return ResponseEntity.status(HttpStatus.OK).body(medicos);
    }
}
