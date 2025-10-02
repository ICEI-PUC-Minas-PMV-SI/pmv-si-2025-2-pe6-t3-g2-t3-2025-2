package br.com.g2.medlink.controller;

import br.com.g2.medlink.controller.dto.MedicoRequest;
import br.com.g2.medlink.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/medlink/medico")
public class MedicoController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid MedicoRequest medicoRequest) {
        if (userService.findByEmail(medicoRequest.email()).isPresent())
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        userService.salvarMedico(medicoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
