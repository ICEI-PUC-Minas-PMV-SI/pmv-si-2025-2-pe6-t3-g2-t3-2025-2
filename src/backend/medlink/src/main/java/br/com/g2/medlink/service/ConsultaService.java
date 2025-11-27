package br.com.g2.medlink.service;

import br.com.g2.medlink.controller.dto.consulta.ConsultaResponse;
import br.com.g2.medlink.entity.Consulta;
import br.com.g2.medlink.entity.Medico;
import br.com.g2.medlink.entity.Paciente;
import br.com.g2.medlink.repository.ConsultaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private UserService userService;

    public Consulta criarConsulta(Paciente paciente, String medicoId, LocalDateTime dataHora, String observacoes) {
        Consulta consulta = new Consulta(paciente, medicoId, dataHora, observacoes);
        return consultaRepository.save(consulta);
    }

    public List<Consulta> listarConsultasDoPaciente(Paciente paciente) {
        return consultaRepository.findByPacienteId(paciente.getId());
    }

    public void deletarConsultaDoPaciente(UUID consultaId, Paciente paciente) {
        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        if (!consulta.getPaciente().getId().equals(paciente.getId())) {
            throw new RuntimeException("Sem permissão para deletar essa consulta");
        }
        consultaRepository.delete(consulta);
    }

    public List<Consulta> listarConsultasDoMedico(Medico medico) {
        return consultaRepository.findByMedicoId(medico.getId());
    }

    public List<ConsultaResponse> getConsultas() {
        return consultaRepository.findAll()
                .stream()
                .map(consulta -> new ConsultaResponse(
                        consulta.getId(),
                        consulta.getPaciente().getId(),
                        consulta.getMedicoId(),
                        consulta.getObservacoes(),
                        consulta.getDataHora()))
                .toList();
    }
}
