package br.com.g2.medlink.controller;

import br.com.g2.medlink.entity.User;
import br.com.g2.medlink.entity.dto.AuthRequest;
import br.com.g2.medlink.entity.dto.RegisterRequest;
import br.com.g2.medlink.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthRequest authRequest){
        var usernamePassword = new UsernamePasswordAuthenticationToken(authRequest.username(), authRequest.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterRequest registerRequest){
        if (this.userRepository.findByUsername(registerRequest.username()) != null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

        String encryptedPassword = new BCryptPasswordEncoder().encode(registerRequest.password());
        User user = new User(registerRequest.username(), encryptedPassword, registerRequest.role());
        this.userRepository.save(user);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
