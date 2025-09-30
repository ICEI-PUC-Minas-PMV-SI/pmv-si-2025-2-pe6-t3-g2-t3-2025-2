# APIs e Web Services  

O sistema de agendamento para clínica multidisciplinar será construído com uma API RESTful, servindo de base para a aplicação web e mobile. Essa API permitirá o gerenciamento centralizado de pacientes, profissionais, agendas e consultas, garantindo sincronização em tempo real e segurança das informações.

---

## Objetivos da API  

- **Centralizar** a comunicação entre clientes (web/mobile) e o backend.  
- **Disponibilizar** serviços de autenticação, agendamento, gestão de usuários, prontuário eletrônico.  
- **Permitir** acesso seguro e controlado a dados clínicos e administrativos, de acordo com os perfis (Paciente, Profissional e Administrativo).  
- **Oferecer** dados atualizados em tempo real, evitando conflitos de agenda e falhas manuais.  
- **Escalar** facilmente para atender maior volume de usuários.  

---

## Modelagem da Aplicação  

**Entidades principais:**  
- **Usuário/Perfil** (autenticação e RBAC)  
- **Paciente** (dados pessoais, histórico de consultas)  
- **Profissional de Saúde** (dados de especialidade, agenda, bloqueios)  
- **Especialidade** (cardiologia, odontologia, psicologia etc.)  
- **Agenda/Slot** (início, fim, status)  
- **Consulta** (status, vínculo paciente-profissional)  
- **Prontuário Eletrônico** (anotações, exames anexados, evolução clínica)  

---

## Tecnologias Utilizadas  

- **Back-end:** Java (Spring Boot, Spring Data JPA/Hibernate, Spring Security, H2, Tomcat embutido).  
- **Front-end (Web):** React.js + Redux Toolkit, TypeScript, Tailwind CSS/Material UI.  
- **Mobile:** React Native + React Navigation + NativeBase/Paper.  
- **Infraestrutura:** AWS (EC2 para backend, S3 para armazenamento de arquivos, WebSocket para atualizações em tempo real).  

---

## API Endpoints  

### Autenticação  
- **POST /auth/login** → autenticação de usuários.  
- **POST /auth/register** → cadastro de pacientes e profissionais.  
- **POST /auth/forgot-password** → recuperação de senha.  

### Usuários e Perfis  
- **GET /users/{id}** → consulta dados do usuário.  
- **PUT /users/{id}** → atualização de dados pessoais.  

### Pacientes  
- **GET /patients/{id}/history** → histórico de consultas.  
- **POST /patients** → cadastro de paciente.  

### Profissionais de Saúde  
- **GET /professionals** → listar por especialidade/unidade.  
- **PUT /professionals/{id}/agenda** → gerenciar agenda (bloqueios, pausas, férias).  

### Consultas e Agendas  
- **GET /appointments/availability** → consultar horários disponíveis por especialidade/profissional.  
- **POST /appointments** → agendar consulta.  
- **PUT /appointments/{id}/reschedule** → remarcar consulta.  
- **DELETE /appointments/{id}** → cancelar consulta.  

### Prontuário Eletrônico  
- **GET /records/{patientId}** → obter prontuário do paciente.  
- **POST /records/{patientId}** → criar nova anotação/evolução.  

### Relatórios (Administrativo)  
- **GET /reports/appointments** → consultas por período/profissional/status.  

---

## Considerações de Segurança  

- **Autenticação** via JWT (JSON Web Token).  
- **Autorização (RBAC):** perfis distintos para Paciente, Profissional e Administrativo.  
- **Criptografia:** dados sensíveis (senhas, informações médicas) protegidos em trânsito (HTTPS/TLS) e em repouso.  
- **Auditoria:** registro de todas as alterações em consultas/agendas.  
- **Proteção contra ataques:** rate limiting, sanitização de entradas (SQL Injection/XSS), monitoramento de logs.  

---

## Implantação  

1. **Requisitos:** servidor AWS EC2 com Docker, PostgreSQL gerenciado (RDS), S3 para arquivos.  
2. **Configuração:** variáveis de ambiente (.env) para credenciais e chaves secretas.  
3. **CI/CD:** deploy automatizado via GitHub Actions para AWS.  
4. **Escalabilidade:** balanceador de carga (AWS ELB) e auto scaling groups.  
5. **Monitoramento:** CloudWatch para logs e métricas de performance.  

---

## Testes  

- **Unitários:** serviços, controladores e repositórios.  
- **Integração:** comunicação entre backend, banco de dados e APIs externas.  
- **Carga:** simulação de múltiplos usuários simultâneos (ex.: JMeter).  
- **Segurança:** testes de autenticação/autorização, injeção de falhas.  
- **Automatização:** Jest (frontend), JUnit (backend), Cypress (end-to-end).  

---

## Referências  

- Documentação oficial Spring Boot e React.  
- Artigos sobre APIs RESTful, RBAC e prontuário eletrônico.  
- Padrões OWASP para segurança de aplicações web.  
- Repositório oficial do projeto no GitHub (com diagramas e imagens).  

# Planejamento

##  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Semana 1

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| AlunaX        | Introdução | 01/02/2024     | 07/02/2024 | ✔️    | 05/02/2024      |
| AlunaZ        | Objetivos    | 03/02/2024     | 10/02/2024 | 📝    |                 |
| AlunoY        | Histórias de usuário  | 01/01/2024     | 07/01/2005 | ⌛     |                 |
| AlunoK        | Personas 1  |    01/01/2024        | 12/02/2005 | ❌    |       |

#### Semana 2

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| AlunaX        | Página inicial   | 01/02/2024     | 07/03/2024 | ✔️    | 05/02/2024      |
| AlunaZ        | CSS unificado    | 03/02/2024     | 10/03/2024 | 📝    |                 |
| AlunoY        | Página de login  | 01/02/2024     | 07/03/2024 | ⌛     |                 |
| AlunoK        | Script de login  |  01/01/2024    | 12/03/2024 | ❌    |       |

Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

