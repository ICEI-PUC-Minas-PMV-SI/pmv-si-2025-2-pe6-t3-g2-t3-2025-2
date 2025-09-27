package br.com.g2.medlink.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "consultas")
public class Consulta {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    private User paciente;
    private LocalDateTime dataHora;

    @ManyToOne
    private User medico;

    @Enumerated(EnumType.STRING)
    private StatusConsulta status = StatusConsulta.CONFIRMADO;

}


