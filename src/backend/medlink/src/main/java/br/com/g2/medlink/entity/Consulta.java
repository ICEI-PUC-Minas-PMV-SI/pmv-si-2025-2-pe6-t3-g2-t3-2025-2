package br.com.g2.medlink.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "consultas")
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @Column(name = "medico_id", nullable = false, columnDefinition = "CHAR(36)")
    private String medicoId;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Column(name = "observacoes")
    private String observacoes;

    public Consulta(Paciente paciente, String medicoId, LocalDateTime dataHora, String observacoes) {
        this.paciente = paciente;
        this.medicoId = medicoId;
        this.dataHora = dataHora;
        this.observacoes = observacoes;
    }
}


