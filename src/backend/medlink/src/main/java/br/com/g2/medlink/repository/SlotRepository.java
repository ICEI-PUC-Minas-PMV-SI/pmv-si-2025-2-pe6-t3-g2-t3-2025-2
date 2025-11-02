package br.com.g2.medlink.repository;

import br.com.g2.medlink.entity.Medico;
import br.com.g2.medlink.entity.Slot;
import br.com.g2.medlink.entity.Slot.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SlotRepository extends JpaRepository<Slot, UUID> {
    List<Slot> findByMedicoAndInicioBetweenAndStatus(
            Medico medico, LocalDateTime start, LocalDateTime end, Status status);

    Optional<Slot> findByIdAndStatus(UUID id, Status status);

    boolean existsByMedicoAndInicioLessThanEqualAndFimGreaterThanEqual(
            Medico medico, LocalDateTime end, LocalDateTime start);
}