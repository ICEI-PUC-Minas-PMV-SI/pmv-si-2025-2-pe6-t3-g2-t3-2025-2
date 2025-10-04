package br.com.g2.medlink.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "administradores")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private String email;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    public Admin(String name, String email, User user) {
        this.name = name;
        this.email = email;
        this.user = user;
    }
}
