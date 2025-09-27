package br.com.g2.medlink.controller;

import br.com.g2.medlink.entity.Consulta;
import br.com.g2.medlink.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/paciente")
public class PacienteController {

    @Autowired
    private ConsultaService consultaService;

    @PostMapping("/consulta")
    public ResponseEntity<Consulta> createConsulta(Consulta consulta){

        Consulta consultaSalva = consultaService.salvarConsulta(consulta);
        return ResponseEntity.status(HttpStatus.CREATED).body(consultaSalva);


    }
}
