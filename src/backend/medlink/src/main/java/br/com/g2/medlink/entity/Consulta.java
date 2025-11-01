package br.com.g2.medlink.entity;

import br.com.g2.medlink.entity.enums.StatusConsulta; // ADICIONE
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

    // NOVO: vínculo com Slot para reabertura em cancelamento
    @ManyToOne
    @JoinColumn(name = "slot_id")
    private Slot slot;

    // ADICIONE: status e auditoria de cancelamento
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusConsulta status = StatusConsulta.CONFIRMADO;

    @Column(name = "data_cancelamento")
    private LocalDateTime dataCancelamento;

    @Column(name = "motivo_cancelamento")
    private String motivoCancelamento;

    public Consulta(Paciente paciente, String medicoId, LocalDateTime dataHora, String observacoes) {
        this.paciente = paciente;
        this.medicoId = medicoId;
        this.dataHora = dataHora;
        this.observacoes = observacoes;
        this.status = StatusConsulta.CONFIRMADO; // ADICIONE: default ao criar
    }
}
