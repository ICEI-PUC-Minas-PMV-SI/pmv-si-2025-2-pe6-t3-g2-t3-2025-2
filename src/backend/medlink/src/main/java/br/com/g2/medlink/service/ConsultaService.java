package br.com.g2.medlink.service;

import br.com.g2.medlink.controller.dto.consulta.ConsultaPacienteResponse;
import br.com.g2.medlink.controller.dto.consulta.ConsultaResponse;
import br.com.g2.medlink.entity.Consulta;
import br.com.g2.medlink.entity.Medico;
import br.com.g2.medlink.entity.Paciente;
import br.com.g2.medlink.entity.Slot;
import br.com.g2.medlink.entity.enums.StatusConsulta;
import br.com.g2.medlink.repository.ConsultaRepository;
import br.com.g2.medlink.repository.MedicoRepository;
import br.com.g2.medlink.repository.SlotRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private SlotRepository slotRepository;

    public Consulta criarConsulta(Paciente paciente, String medicoId, LocalDateTime dataHora, String observacoes) {
        Consulta consulta = new Consulta(paciente, medicoId, dataHora, observacoes);
        return consultaRepository.save(consulta);
    }

    public List<Consulta> listarConsultasDoPaciente(Paciente paciente) {
        return consultaRepository.findByPacienteId(paciente.getId());
    }

    // ATUALIZADO: inclui status e (opcional) filtra canceladas
    public List<ConsultaPacienteResponse> listarConsultasDoPacienteComMedico(Paciente paciente) {
        var consultas = consultaRepository.findByPacienteId(paciente.getId());

        return consultas.stream()
                .filter(c -> c.getStatus() == null || c.getStatus() != StatusConsulta.CANCELADO)
                .map(c -> {
                    var medicoOpt = medicoRepository.findById(c.getMedicoId());
                    var medicoNome = medicoOpt.map(Medico::getNome).orElse("Médico");
                    var especialidade = medicoOpt.map(m -> m.getEspecialidade().name()).orElse("");

                    return new ConsultaPacienteResponse(
                            c.getId(),
                            c.getMedicoId(),
                            medicoNome,
                            especialidade,
                            c.getDataHora(),
                            c.getObservacoes(),
                            c.getStatus() != null ? c.getStatus().name() : StatusConsulta.CONFIRMADO.name()
                    );
                })
                .toList();
    }

    @Transactional
    public void cancelarConsultaDoPaciente(String consultaId, Paciente paciente) {
        UUID id = UUID.fromString(consultaId);

        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consulta não encontrada"));

        if (!consulta.getPaciente().getId().equals(paciente.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem permissão para cancelar essa consulta");
        }

        if (consulta.getStatus() == StatusConsulta.CANCELADO) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Consulta já está cancelada");
        }
        if (consulta.getStatus() == StatusConsulta.CONCLUIDO) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Consulta já foi concluída e não pode ser cancelada");
        }

        long minutos = Duration.between(LocalDateTime.now(), consulta.getDataHora()).toMinutes();
        if (minutos < 60) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cancelamento indisponível a menos de 1 hora do início");
        }

        consulta.setStatus(StatusConsulta.CANCELADO);
        consulta.setDataCancelamento(LocalDateTime.now());
        consulta.setMotivoCancelamento("Cancelado pelo paciente");
        consultaRepository.save(consulta);

        var slot = consulta.getSlot();
        if (slot != null && slot.getStatus() == Slot.Status.RESERVADO) {
            slot.setStatus(Slot.Status.LIVRE);
            slotRepository.save(slot);
        }
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

    @Transactional
    public Consulta agendarPorSlot(Paciente paciente, UUID slotId, String observacoes) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot não encontrado"));

        if (slot.getStatus() != Slot.Status.LIVRE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slot já reservado ou indisponível");
        }

        if (slot.getInicio().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível agendar no passado");
        }

        slot.setStatus(Slot.Status.RESERVADO);
        slotRepository.save(slot);

        var consulta = new Consulta(
                paciente,
                slot.getMedico().getId().toString(),
                slot.getInicio(),
                observacoes
        );
        consulta.setSlot(slot);
        // status default já é CONFIRMADO

        return consultaRepository.save(consulta);
    }
}
