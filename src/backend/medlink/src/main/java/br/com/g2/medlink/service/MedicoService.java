package br.com.g2.medlink.service;

import br.com.g2.medlink.controller.dto.medico.MedicoResponse;
import br.com.g2.medlink.repository.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicoService {

    @Autowired
    private MedicoRepository medicoRepository;

    public List<MedicoResponse> listarMedicos() {
        return medicoRepository.findAll()
                .stream()
                .map(medico -> new MedicoResponse(
                        medico.getId(),
                        medico.getNome(),
                        medico.getEspecilidade()
                ))
                .toList();
    }

    public List<MedicoResponse> getMedicos() {
        return medicoRepository.findAll()
                .stream()
                .map(medico -> new MedicoResponse(
                        medico.getId(),
                        medico.getNome(),
                        medico.getEspecilidade()))
                .toList();
    }

    public br.com.g2.medlink.entity.Medico buscarPorId(String medicoId) {
        return medicoRepository.findById(medicoId)
                .orElseThrow(() -> new IllegalArgumentException("Médico não encontrado: " + medicoId));
    }
}
