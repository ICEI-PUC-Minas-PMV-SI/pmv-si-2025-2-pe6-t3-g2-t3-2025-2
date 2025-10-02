package br.com.g2.medlink.repository;

import br.com.g2.medlink.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, String> {
    Optional<Paciente> findByUserId(String id);
}
