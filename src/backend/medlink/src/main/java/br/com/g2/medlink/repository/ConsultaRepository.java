package br.com.g2.medlink.repository;

import br.com.g2.medlink.entity.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, UUID> {
    List<Consulta> findByPacienteId(String pacienteId);

    List<Consulta> findByMedicoId(String medicoId);
}
