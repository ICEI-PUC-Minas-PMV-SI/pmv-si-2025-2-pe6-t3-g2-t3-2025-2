// br/com/g2/medlink/config/WebConfig.java
package br.com.g2.medlink.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
public class WebConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

<<<<<<< HEAD
        config.setAllowedOrigins(List.of("http://localhost:3000"));
=======
        // Altere para o domínio do seu front
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        // Se você precisar enviar cookies entre domínios, use setAllowCredentials(true) e configure allowedOriginPatterns.
>>>>>>> c7771681293bfd0fb68f194e22df68fc8f45a639
        // config.setAllowCredentials(true);

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setExposedHeaders(List.of("Authorization")); // se precisar ler alguma header no client
        config.setMaxAge(3600L); // cache do preflight

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}