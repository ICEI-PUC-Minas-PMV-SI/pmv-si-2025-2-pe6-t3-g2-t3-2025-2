package br.com.g2.medlink.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "slots", indexes = {
        @Index(name = "idx_slot_medico_inicio", columnList = "medico_id,inicio")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "medico_id")
    private Medico medico;

    @Column(nullable = false)
    private LocalDateTime inicio;

    @Column(nullable = false)
    private LocalDateTime fim;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status; // LIVRE | RESERVADO | BLOQUEADO

    public enum Status { LIVRE, RESERVADO, BLOQUEADO }
}
