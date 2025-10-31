package br.com.g2.medlink.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.POST, "/medlink/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/medlink/paciente/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/medlink/paciente/consulta").authenticated()
                        .requestMatchers(HttpMethod.POST, "/medlink/paciente/**").hasRole("PACIENTE")
                        .requestMatchers(HttpMethod.GET, "/medlink/paciente/**").hasRole("PACIENTE")
                        .requestMatchers(HttpMethod.PUT, "/medlink/paciente/**").hasRole("PACIENTE")
                        .requestMatchers(HttpMethod.DELETE, "/medlink/paciente/**").hasRole("PACIENTE")
                        .requestMatchers(HttpMethod.POST, "/medlink/admin/register").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/medlink/admin/pacientes").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/medlink/admin/medicos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/medlink/admin/consultas").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/medlink/medico/register").hasRole("MEDICO")
                        .requestMatchers(HttpMethod.GET, "/medlink/medico/consultas").hasRole("MEDICO")
                        .requestMatchers(HttpMethod.POST, "/medlink/medico/disponibilidades").hasAnyRole("MEDICO","ADMIN")
                        .requestMatchers(HttpMethod.GET, "/medlink/paciente/medicos/*/slots").hasRole("PACIENTE")
                        .requestMatchers(HttpMethod.POST, "/medlink/paciente/consulta/por-slot").hasRole("PACIENTE")
                        .requestMatchers(HttpMethod.POST, "/medlink/admin/slots").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,  "/medlink/admin/slots").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/medlink/admin/slots/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
