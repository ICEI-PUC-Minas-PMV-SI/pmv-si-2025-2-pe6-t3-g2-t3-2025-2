package br.com.g2.medlink.service;

import br.com.g2.medlink.controller.dto.paciente.PacienteResponse;
import br.com.g2.medlink.controller.dto.paciente.UpdatePacienteRequest;
import br.com.g2.medlink.entity.Paciente;
import br.com.g2.medlink.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacienteService {

    @Autowired
    private UserService userService;

    @Autowired
    private PacienteRepository pacienteRepository;

    public PacienteResponse getPaciente() {
        Paciente paciente = userService.getPacienteDoUsuarioLogado();
        return new PacienteResponse(
                paciente.getId(),
                paciente.getEmail(),
                paciente.getNome(),
                paciente.getEndereco(),
                paciente.getTelefone());
    }

    public PacienteResponse updatePaciente(UpdatePacienteRequest updatePacienteRequest) {
        Paciente paciente = userService.getPacienteDoUsuarioLogado();

        if (updatePacienteRequest.nome() != null && !updatePacienteRequest.nome().isBlank())
            paciente.setNome(updatePacienteRequest.nome());
        if (updatePacienteRequest.endereco() != null && !updatePacienteRequest.endereco().isBlank())
            paciente.setEndereco(updatePacienteRequest.endereco());
        if (updatePacienteRequest.telefone() != null && !updatePacienteRequest.telefone().isBlank())
            paciente.setTelefone(updatePacienteRequest.telefone());

        Paciente updatedPaciente = pacienteRepository.save(paciente);
        return new PacienteResponse(
                updatedPaciente.getId(),
                updatedPaciente.getEmail(),
                updatedPaciente.getNome(),
                updatedPaciente.getEndereco(),
                updatedPaciente.getTelefone());
    }

    public List<PacienteResponse> getPacientes() {
        return pacienteRepository.findAll()
                .stream()
                .map(paciente -> new PacienteResponse(
                        paciente.getId(),
                        paciente.getEmail(),
                        paciente.getNome(),
                        paciente.getEndereco(),
                        paciente.getTelefone())
                ).toList();
    }
}
