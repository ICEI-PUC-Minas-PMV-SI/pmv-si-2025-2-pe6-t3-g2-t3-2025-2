package br.com.g2.medlink.service;

import br.com.g2.medlink.controller.dto.medico.MedicoResponse;
import br.com.g2.medlink.entity.Medico;
import br.com.g2.medlink.repository.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MedicoService {

    @Autowired
    private MedicoRepository medicoRepository;

    public Medico buscarPorId(String medicoId) {
        return medicoRepository.findById(medicoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Médico não encontrado"));
    }

    public List<MedicoResponse> listarMedicos() {
        return medicoRepository.findAll()
                .stream()
                .map(medico -> new MedicoResponse(
                        medico.getId(),
                        medico.getNome(),
                        medico.getEspecialidade()
                ))
                .toList();
    }

    public List<MedicoResponse> getMedicos() {
        return medicoRepository.findAll()
                .stream()
                .map(medico -> new MedicoResponse(
                        medico.getId(),
                        medico.getNome(),
                        medico.getEspecialidade()))
                .toList();
    }
}
