package br.com.g2.medlink.controller;

import br.com.g2.medlink.entity.Consulta;
import br.com.g2.medlink.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/paciente")
public class PacienteController {

    @Autowired
    private ConsultaService consultaService;

    @PostMapping("/consulta")
    public ResponseEntity<Consulta> createConsulta(@RequestBody Consulta consulta){

        Consulta consultaSalva = consultaService.salvarConsulta(consulta);
        return ResponseEntity.status(HttpStatus.CREATED).body(consultaSalva);


    }
    @GetMapping("/consultas")
    public ResponseEntity<List<Consulta>> getConsultas() {

        List<Consulta> consultas = consultaService.listarConsultas();
        return ResponseEntity.ok(consultas);
    }
}
