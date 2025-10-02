package br.com.g2.medlink.service;

import br.com.g2.medlink.entity.Medico;
import br.com.g2.medlink.entity.Paciente;
import br.com.g2.medlink.entity.User;
import br.com.g2.medlink.entity.dto.MedicoRequest;
import br.com.g2.medlink.entity.dto.PacienteRequest;
import br.com.g2.medlink.entity.enums.UserRole;
import br.com.g2.medlink.repository.MedicoRepository;
import br.com.g2.medlink.repository.PacienteRepository;
import br.com.g2.medlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Optional<User> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return Optional.empty();
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof User user) return Optional.of(user);
        if (principal instanceof String email) return userRepository.findByEmail(email);
        return Optional.empty();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Paciente salvarPaciente(PacienteRequest pacienteRequest) {
        User user = new User(
                pacienteRequest.email(),
                passwordEncoder.encode(pacienteRequest.password()),
                UserRole.PACIENTE
        );
        User savedUser = userRepository.save(user);
        Paciente paciente = new Paciente(
                savedUser,
                pacienteRequest.email(),
                pacienteRequest.nome(),
                pacienteRequest.endereco(),
                pacienteRequest.telefone()
        );
        return pacienteRepository.save(paciente);
    }

    public Medico salvarMedico(MedicoRequest medicoRequest) {
        User user = new User(
                medicoRequest.email(),
                passwordEncoder.encode(medicoRequest.password()),
                UserRole.MEDICO
        );
        User savedUser = userRepository.save(user);
        Medico medico = new Medico(
                savedUser,
                medicoRequest.nome(),
                medicoRequest.email(),
                medicoRequest.endereco(),
                medicoRequest.telefone(),
                medicoRequest.crm(),
                medicoRequest.especialidade()
        );
        return medicoRepository.save(medico);
    }

    public Paciente getPacienteDoUsuarioLogado() {
        User user = getCurrentUser()
                .orElseThrow(() -> new RuntimeException("Usuário não autenticado"));

        return pacienteRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado para o usuário logado"));

    }
}
