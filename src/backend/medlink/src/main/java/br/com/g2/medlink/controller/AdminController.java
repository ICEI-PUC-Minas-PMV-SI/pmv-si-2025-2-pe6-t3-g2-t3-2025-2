package br.com.g2.medlink.controller;

import br.com.g2.medlink.controller.dto.admin.AdminRequest;
import br.com.g2.medlink.controller.dto.consulta.ConsultaResponse;
import br.com.g2.medlink.controller.dto.medico.MedicoResponse;
import br.com.g2.medlink.controller.dto.paciente.PacienteResponse;
import br.com.g2.medlink.service.ConsultaService;
import br.com.g2.medlink.service.MedicoService;
import br.com.g2.medlink.service.PacienteService;
import br.com.g2.medlink.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<List<ConsultaResponse>> getConsultas(){
        List<ConsultaResponse> consultas = consultaService.getConsultas();
        return ResponseEntity.status(HttpStatus.OK).body(consultas);
    }

    @GetMapping("/medicos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MedicoResponse>> getMedicos(){
        List<MedicoResponse> medicos = medicoService.getMedicos();
        return ResponseEntity.status(HttpStatus.OK).body(medicos);
    }

    @GetMapping("/pacientes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PacienteResponse>> getPacientes(){
        List<PacienteResponse> pacientes = pacienteService.getPacientes();
        return ResponseEntity.status(HttpStatus.OK).body(pacientes);
    }
}
