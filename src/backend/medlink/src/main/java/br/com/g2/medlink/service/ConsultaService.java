package br.com.g2.medlink.service;

import br.com.g2.medlink.entity.Consulta;
import br.com.g2.medlink.entity.Paciente;
import br.com.g2.medlink.entity.User;
import br.com.g2.medlink.repository.ConsultaRepository;
import jakarta.validation.constraints.NotNull;
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

    public Consulta salvarConsulta(Consulta consulta){
//        User user = userService.getCurrentUser();
//       consulta.setPaciente(user);
        return consultaRepository.save(consulta);
    }

    public List<Consulta> listarConsultas(){
        return consultaRepository.findAll();
    }

    public void deletarConsulta(String id) {
        if (!consultaRepository.existsById(id)) {
            throw new RuntimeException("Consulta não encontrada com id: " + id);
        }
        consultaRepository.deleteById(id);
    }

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
}
