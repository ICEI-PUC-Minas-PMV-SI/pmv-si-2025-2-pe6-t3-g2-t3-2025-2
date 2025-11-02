package br.com.g2.medlink.service;

import br.com.g2.medlink.entity.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;
<<<<<<< HEAD

    private static final String ISSUER = "auth-api";
=======
>>>>>>> c7771681293bfd0fb68f194e22df68fc8f45a639

    private static final String ISSUER = "auth-api";

    // Wrapper solicitado para manter compatibilidade
    public String createToken(User user) {
<<<<<<< HEAD
        return generateToken(user);
    }

    // Método principal que gera token
    public String generateToken(UserDetails user) {
        Algorithm algorithm = Algorithm.HMAC256(secret);

        List<String> authorities = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority) // ex.: "ROLE_PACIENTE"
                .toList();

        return JWT.create()
                .withIssuer(ISSUER)
                .withSubject(user.getUsername()) // email
                .withArrayClaim("authorities", authorities.toArray(new String[0])) // opcional
                .withExpiresAt(Instant.now().plus(2, ChronoUnit.HOURS))
                .sign(algorithm);
=======
        // sua entidade User implementa UserDetails (recomendado).
        // Caso não implemente, adapte para construir um UserDetails equivalente.
        return generateToken(user);
>>>>>>> c7771681293bfd0fb68f194e22df68fc8f45a639
    }

    // Método principal que gera token
    public String generateToken(UserDetails user) {
        Algorithm algorithm = Algorithm.HMAC256(secret);

        // Opcional: incluir authorities no token para debug/observabilidade
        List<String> authorities = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority) // ex.: "ROLE_PACIENTE"
                .toList();

        return JWT.create()
                .withIssuer(ISSUER)
                .withSubject(user.getUsername()) // email
                .withArrayClaim("authorities", authorities.toArray(new String[0])) // opcional
                .withExpiresAt(Instant.now().plus(2, ChronoUnit.HOURS))
                .sign(algorithm);
    }

    // Valida e retorna o subject (email) ou "" se inválido/expirado
    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            DecodedJWT decoded = JWT.require(algorithm)
                    .withIssuer(ISSUER)
                    .build()
                    .verify(token);

            return decoded.getSubject();
        } catch (TokenExpiredException e) {
            System.out.println("[TOKEN] expirado: " + e.getMessage());
            return "";
        } catch (JWTVerificationException e) {
            System.out.println("[TOKEN] inválido: " + e.getMessage());
            return "";
        } catch (Exception e) {
            System.out.println("[TOKEN] erro ao validar: " + e.getMessage());
            return "";
        }
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> c7771681293bfd0fb68f194e22df68fc8f45a639
