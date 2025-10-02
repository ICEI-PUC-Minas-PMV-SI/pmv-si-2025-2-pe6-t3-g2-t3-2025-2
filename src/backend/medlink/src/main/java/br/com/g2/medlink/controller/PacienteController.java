package br.com.g2.medlink.controller;

import br.com.g2.medlink.entity.Consulta;
import br.com.g2.medlink.entity.Paciente;
import br.com.g2.medlink.entity.dto.ConsultaRequest;
import br.com.g2.medlink.entity.dto.PacienteRequest;
import br.com.g2.medlink.service.ConsultaService;
import br.com.g2.medlink.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/medlink/paciente")
public class PacienteController {

    @Autowired
    private ConsultaService consultaService;

    @Autowired
    private UserService userService;

    @PostMapping("/consulta")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<Consulta> createConsulta(@RequestBody @Valid ConsultaRequest request) {
        Paciente paciente = userService.getPacienteDoUsuarioLogado();
        Consulta consulta = consultaService.criarConsulta(paciente, request.medicoId(), request.dataHora(), request.observacoes());
        return ResponseEntity.status(HttpStatus.CREATED).body(consulta);
    }

    @GetMapping("/consultas")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<List<Consulta>> getConsultas() {
        Paciente paciente = userService.getPacienteDoUsuarioLogado();
        List<Consulta> consultas = consultaService.listarConsultasDoPaciente(paciente);
        return ResponseEntity.ok(consultas);
    }

    @DeleteMapping("/consulta/{id}")
    @PreAuthorize("hasRole('PACIENTE')")
    public ResponseEntity<String> deletarConsulta(@PathVariable UUID id) {
        try {
            Paciente paciente = userService.getPacienteDoUsuarioLogado();
            consultaService.deletarConsultaDoPaciente(id, paciente);
            return ResponseEntity.ok("Consulta excluída com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid PacienteRequest pacienteRequest) {
        if (userService.findByEmail(pacienteRequest.email()).isPresent())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("E-mail já cadastrado.");
        userService.salvarPaciente(pacienteRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Paciente registrado com sucesso.");
    }
}
