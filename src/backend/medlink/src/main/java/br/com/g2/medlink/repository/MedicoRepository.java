package br.com.g2.medlink.repository;

import br.com.g2.medlink.entity.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, String> {
    Optional<Medico> findByUserId(UUID medicoId);
}
