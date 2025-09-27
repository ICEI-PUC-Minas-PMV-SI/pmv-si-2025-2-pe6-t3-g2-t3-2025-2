package br.com.g2.medlink.service;

import br.com.g2.medlink.entity.Consulta;
import br.com.g2.medlink.entity.User;
import br.com.g2.medlink.repository.ConsultaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private UserService userService;

    public Consulta salvarConsulta(Consulta consulta){
//        User user = userService.getCurrentUser();
//       consulta.setPaciente(user);
        return consultaRepository.save(consulta);
    }
}
