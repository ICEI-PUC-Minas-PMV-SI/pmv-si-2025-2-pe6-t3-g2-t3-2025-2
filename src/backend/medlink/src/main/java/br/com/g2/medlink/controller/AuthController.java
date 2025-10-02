package br.com.g2.medlink.controller;

import br.com.g2.medlink.entity.User;
import br.com.g2.medlink.entity.dto.AuthRequest;
import br.com.g2.medlink.entity.dto.LoginResponse;
import br.com.g2.medlink.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/medlink")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthRequest authRequest) {
        var emailPassword = new UsernamePasswordAuthenticationToken(authRequest.email(), authRequest.password());
        var auth = authenticationManager.authenticate(emailPassword);
        var token = tokenService.createToken((User) auth.getPrincipal());
        return ResponseEntity.status(HttpStatus.OK).body(new LoginResponse(token));
    }
}
