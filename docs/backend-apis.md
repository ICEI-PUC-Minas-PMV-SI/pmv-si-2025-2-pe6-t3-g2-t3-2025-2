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
- **Usuário/Perfil** (autenticação, perfil e RBAC)
- **Administrador** (autenticação e RBAC)
- **Paciente** (dados pessoais, histórico de consultas)  
- **Profissional de Saúde** (dados de especialidade, agenda, bloqueios)    
- **Agenda/Slot** (início, fim, status, hora)  
- **Consulta** (status, horário, vínculo paciente-profissional, especialidade)   

---

## Tecnologias Utilizadas  

- **Back-end:** Java (Spring Boot, Spring Data JPA/Hibernate, Spring Security, H2, Tomcat embutido).  
- **Front-end (Web):** React.js + Redux Toolkit, TypeScript, Tailwind CSS/Material UI.  
- **Mobile:** React Native + React Navigation + NativeBase/Paper.  
- **Infraestrutura:** AWS (EC2 para backend, S3 para armazenamento de arquivos, WebSocket para atualizações em tempo real).  

---

## API Endpoints  

### Realizar Login (Qualquer tipo de usuário)  
- **POST /medlink/login** → autenticação de usuários.   

### Registrar um Paciente  
- **POST /medlink/paciente/register** → cadastro de um paciente.  

### Listar Dados do Paciente  
- **GET /medlink/paciente**
- **Authorization Bearer Token** → dados do paciente.

### Atualizar Dados do Paciente  
- **PUT /medlink/paciente**
- **Authorization Bearer Token** → atualizar dados do paciente.

### Listar Consultas do Paciente    
- **GET /medlink/paciente/consultas**  
- **Authorization Bearer Token** → listar consultas do paciente.  

### Deletar Consulta   
- **DELETE /medlink/paciente/consulta/**  
- **Authorization Bearer Token** → deletar consulta.

### Listar Consultas do Médico Logado
- **GET /medlink/medico/consultas**  
- **Authorization Bearer Token** → lista de consultas do médico logado disponíveis. 

### Registrar um Admin
- **POST /medlink/admin/register**  
- **Authorization Bearer Token** → Cadastro do Admin.

### Listar Médicos (Admin)
- **GET /medlink/admin/medicos**  
- **Authorization Bearer Token** → Listar Médicos.

### Listar Consultas (Admin)
- **GET /medlink/admin/consultas**  
- **Authorization Bearer Token** → Listar Consultas.

### Listar Pacientes (Admin)
- **GET /medlink/admin/pacientes**  
- **Authorization Bearer Token** → Listar Pacientes.

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

Esta documentação descreve os endpoints para interagir com a API de gestão da clínica.

**URL Base:** Após iniciar o projeto, acesse: `http://localhost:8080/swagger-ui.html`


## Módulo 1: Login

### **Endpoint 1: Login de usuários**

* **Endpoint:** `POST /medlink/login`
* **Descrição:** Registro de login de qualquer tipo de usuário.

#### Corpo da Requisição (Request Body)

```json
{
  "email": "paciente1@email.com",
  "password": "123456789"
}
```

![login](https://github.com/user-attachments/assets/15aa387d-16c9-4328-a62f-c46aae9c4d3b)

### Respostas (Responses)
200 OK: Token de autorização. Retorna o token de autenticação para ser utilizado nas próximas requisições.

---

## Módulo 2: Pacientes

### **Endpoint 2: Registrar Paciente**

* **Endpoint:** `POST /medlink/paciente/register`
* **Descrição:** Registro de novos pacientes.

#### Corpo da Requisição (Request Body)

```json
{
  "email": "paciente1@email.com",
  "password": "123456789",
  "nome": "Paciente 1",
  "endereco": "Rua Paulista, 100",
  "telefone": "998877665544"
}
```

![registro-paciente](https://github.com/user-attachments/assets/dce812cb-76dd-4aa4-9450-64df9450bf4d)

### Respostas (Responses)
201 : Paciente registrado com sucesso.

---

### **Endpoint 3: Listar Dados do Paciente**

* **Endpoint:** `GET /medlink/paciente`
* **Header:** `Authorization: Bearer <token>`
* **Descrição:** Listar os pacientes registrados.

#### Corpo da Requisição (Request Body)

```json

no body

```

[Imagem]

### Respostas (Responses)
[Resultado]

---

### **Endpoint 4: Atualizar Paciente**

* **Endpoint:** `PUT /medlink/paciente`
* **Header:** `Authorization: Bearer <token>`
* **Descrição:** Atualizar os pacientes registrados.

#### Corpo da Requisição (Request Body)

```json
{
  "nome": "Paciente Novo Nome",
  "endereco": "Novo Endereço do Paciente",
  "telefone": "123456 (novo número)"
}
```

[Imagem]

### Respostas (Responses)
[Resultado]

---

### **Endpoint 5: Listar Consultas do Paciente**

* **Endpoint:** `PUT /medlink/paciente/consultas`
* **Header:** `Authorization: Bearer <token>`
* **Descrição:** Listar as consultas do paciente.

#### Corpo da Requisição (Request Body)

```json

no body

```

[Imagem]

### Respostas (Responses)
[Resultado]

---

### **Endpoint 6: Listar Médicos Disponíveis**

* **Endpoint:** `GET /medlink/paciente/medicos`
* **Header:** `Authorization: Bearer <token>`
* **Descrição:** Listar médicos disponíveis para o paciente.

#### Corpo da Requisição (Request Body)

```json

no body

```

[Imagem]

### Respostas (Responses)
[Resultado]

---

### **Endpoint 7: Deletar Consulta**

* **Endpoint:** `DELETE /medlink/paciente/consulta/<id-da-consulta>`
* **Header:** `Authorization: Bearer <token>`
* **Descrição:** Cancelar Consulta.

#### Corpo da Requisição (Request Body)

```json

no body

```

[Imagem]

### Respostas (Responses)
[Resultado]

---

## Módulo 3: Médicos

### **Endpoint 8: Consultas do Médico Logado**

* **Endpoint:** `GET /medlink/medico/consultas`
* **Header:** `Authorization: Bearer <token>`
* **Descrição:** Listar consultas registradas para o médico.

#### Corpo da Requisição (Request Body)

```json

no body

```

[Imagem]

### Respostas (Responses)
[Resultado]

---



- **Unitários:** serviços, controladores e repositórios.  
- **Integração:** comunicação entre backend, banco de dados e APIs externas.   
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

