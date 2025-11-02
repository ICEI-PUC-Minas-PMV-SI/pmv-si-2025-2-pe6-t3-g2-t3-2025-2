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

    private static final String ISSUER = "auth-api";

    public String createToken(User user) {
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
    }

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
}