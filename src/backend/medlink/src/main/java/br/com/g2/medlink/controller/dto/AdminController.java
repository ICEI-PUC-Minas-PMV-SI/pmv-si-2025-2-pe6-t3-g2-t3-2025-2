package br.com.g2.medlink.controller.dto;

import br.com.g2.medlink.service.UserService;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/medlink/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> registerAdmin(@RequestBody @Valid AdminRequest adminRequest){
        if (userService.findByEmail(adminRequest.email()).isPresent()){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("E-mail já cadastrado.");
        }

        userService.salvarAdmin(adminRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body("Admin registrado com sucesso.");

    }
}
