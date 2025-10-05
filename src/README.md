# 🩺 Medlink — Backend da Agenda Médica

API REST desenvolvida com **Spring Boot 3.5.6** para gerenciamento de pacientes, médicos e administradores em um sistema de agenda médica.
O projeto inclui autenticação JWT, controle de acesso com Spring Security e integração com banco de dados **MySQL** (executado via Docker).

---

## 🚀 Tecnologias Utilizadas

| Categoria               | Tecnologias                                                  |
| ----------------------- | ------------------------------------------------------------ |
| **Linguagem**           | Java 17                                                      |
| **Framework Principal** | Spring Boot 3.5.6                                            |
| **Módulos Spring**      | Spring Web, Spring Data JPA, Spring Security, Spring Validation |
| **Banco de Dados**      | MySQL (com Docker)                                           |
| **Autenticação**        | JWT (biblioteca `java-jwt` da Auth0)                         |
| **Outros**              | Lombok para acesso de atributos encapsulados                 |

---

## 🐳 Banco de Dados (Docker)

O projeto utiliza um container **MySQL**.
Exemplo de execução do banco com Docker:

```bash
docker run --name mysql-medlink -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=medlink_db -p 3306:3306 -d mysql:8
```

A interface do Adminer ficará disponível em `localhost:8081`. As credenciais de acesso são: 

```properties
server: mysql
User: user
Password: user123
Database: medlink_db
```

---

## 📦 Execução do Projeto

1. **Clonar o repositório**

   ```bash
   git clone https://github.com/seu-usuario/medlink.git
   cd medlink
   ```

2. **Executar o banco via Docker** (caso ainda não esteja rodando)

   ```bash
   docker-compose up -d  # aguardar as aplicações subirem
   ```

3. **Rodar a aplicação**

   ```bash
   ./mvnw spring-boot:run
   ```

   > A aplicação ficará disponível em: [http://localhost:8080](http://localhost:8080)

---

## 📘 Documentação dos Endpoints

### 🔐 Login (qualquer tipo de usuário)

**POST** `/medlink/login`

```json
{
  "email": "paciente1@email.com",
  "password": "123456789"
}
```

---

### 👤 Registrar Paciente

**POST** `/medlink/paciente/register`

```json
{
  "email": "paciente1@email.com",
  "password": "123456789",
  "nome": "Paciente 1",
  "endereco": "Rua Paulista, 100",
  "telefone": "998877665544"
}
```

---

### 📄 Listar Dados do Paciente

**GET** `/medlink/paciente`
**Header:** `Authorization: Bearer <token>`

---

### ✏️ Atualizar Paciente

**PUT** `/medlink/paciente`
**Header:** `Authorization: Bearer <token>`

```json
{
  "nome": "Paciente Novo Nome",
  "endereco": "Novo Endereço do Paciente",
  "telefone": "123456 (novo número)"
}
```

---

### 📅 Listar Consultas do Paciente

**GET** `/medlink/paciente/consultas`
**Header:** `Authorization: Bearer <token>`

---

### 👨‍⚕️ Listar Médicos Disponíveis

**GET** `/medlink/paciente/medicos`
**Header:** `Authorization: Bearer <token>`

---

### ❌ Deletar Consulta

**DELETE** `/medlink/paciente/consulta/<id-da-consulta>`
**Header:** `Authorization: Bearer <token>`

---

### 🩺 Consultas do Médico Logado

**GET** `/medlink/medico/consultas`
**Header:** `Authorization: Bearer <token>`

---

### 🧑‍💼 Registrar Admin

**POST** `/medlink/admin/register`
**Header:** `Authorization: Bearer <token (ADMIN)>`

```json
{
  "nome": "Admin 1",
  "email": "admin1@email.com",
  "password": "123456789"
}
```

---

### 📋 Listar Consultas (Admin)

**GET** `/medlink/admin/consultas`
**Header:** `Authorization: Bearer <token>`

---

### 🧑‍⚕️ Listar Médicos (Admin)

**GET** `/medlink/admin/medicos`
**Header:** `Authorization: Bearer <token>`

---

### 🧍‍♂️ Listar Pacientes (Admin)

**GET** `/medlink/admin/pacientes`
**Header:** `Authorization: Bearer <token>`

---

## 🌐 Documentação Interativa (Swagger)

Após iniciar o projeto, acesse:
👉 [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

*O projeto segue em desenvolvimento e evolução ao longo das próximas etapas.*
