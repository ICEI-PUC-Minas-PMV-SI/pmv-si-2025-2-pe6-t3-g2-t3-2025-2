package br.com.g2.medlink.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pacientes")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String email;
    private String nome;
    private String endereco;
    private String telefone;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    public Paciente(User user, String email, String nome, String endereco, String telefone) {
        this.user = user;
        this.email = email;
        this.nome = nome;
        this.endereco = endereco;
        this.telefone = telefone;
    }
}
