package br.com.g2.medlink.controller;

import br.com.g2.medlink.controller.dto.medico.MedicoRequest;
import br.com.g2.medlink.entity.Consulta;
import br.com.g2.medlink.entity.Medico;
import br.com.g2.medlink.service.ConsultaService;
import br.com.g2.medlink.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medlink/medico")
public class MedicoController {

    @Autowired
    private UserService userService;

    @Autowired
    private ConsultaService consultaService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> register(@RequestBody @Valid MedicoRequest medicoRequest) {
        if (userService.findByEmail(medicoRequest.email()).isPresent())
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        userService.salvarMedico(medicoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Médico registrado com sucesso.");
    }

    @GetMapping("/consultas")
    @PreAuthorize("hasRole('MEDICO')")
    public ResponseEntity<List<Consulta>> getConsultas() {
        Medico medico = userService.getMedicoDoUsuarioLogado();
        List<Consulta> consultas = consultaService.listarConsultasDoMedico(medico);
        return ResponseEntity.status(HttpStatus.OK).body(consultas);
    }
}
