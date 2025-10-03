## Documentação dos Endpoints

### Realizar Login (Qualquer tipo de usuário)
* POST /medlink/login
```json
{
    "email": "paciente1@email.com",
    "password": "123456789"
}
```
_________________________________________________________________

### Registrar um Paciente

* POST  /medlink/paciente/register
```json
{
    "email": "paciente1@email.com",
    "password": "123456789",
    "nome": "Paciente 1",
    "endereco": "Rua Paulista, 100",
    "telefone": "998877665544"
}
```
_________________________________________________________________

### Listar dados do Paciente

* GET /medlink/paciente
* Authorization Bearer Token: <token-gerado-no-login>
```json
{
    "email": "paciente1@email.com",
    "password": "123456789"
}
```
_________________________________________________________________

### Atualizar Paciente

* PUT /medlink/paciente
* Authorization Bearer Token: <token-gerado-no-login>
```json
{
    "nome": "Paciente Novo Nome",
    "endereco": "Novo endereco do PAciente",
    "telefone": "123456 (novo numero)"
}
```
_________________________________________________________________

### Listar Consultas do Paciente

* GET /medlink/paciente/consultas
* Authorization Bearer Token: <token-gerado-no-login>
* (sem body)
_________________________________________________________________

### Listar Médicos Disponíveis

* GET /medlink/paciente/medicos
* Authorization Bearer Token: <token-gerado-no-login>
* (sem body)
_________________________________________________________________

### Deletar Consulta

* DELETE /medlink/paciente/consulta/<id-da-consulta>
* Authorization Bearer Token: <token-gerado-no-login>
* (sem body)

_________________________________________________________________

### Listar Consultas do Médico Logado

* GET /medlink/medico/consultas
* Authorization Bearer Token: <token-gerado-no-login>
* (sem body)

_________________________________________________________________

### Registrar um Admin

* POST  /medlink/admin/register
* Authorization Bearer Token: <token-gerado-no-login> (precisa ser um ADMIN)
```json
{
  "nome": "Admin 1",
  "email": "admin1@email.com",
  "password": "123456789"
}
```
_________________________________________________________________

### Listar Consultas (Admin)

* GET /medlink/admin/consultas
* Authorization Bearer Token: <token-gerado-no-login>
* (sem body)

_________________________________________________________________

### Listar Médicos (Admin)

* GET /medlink/admin/medicos
* Authorization Bearer Token: <token-gerado-no-login>
* (sem body)

_________________________________________________________________

### Listar Pacientes (Admin)

* GET /medlink/admin/pacientes
* Authorization Bearer Token: <token-gerado-no-login>
* (sem body)

_________________________________________________________________

# Instruções de utilização

## Instalação do Site

O site em HTML/CSS/JS é um projeto estático, logo pode ser utilizado tanto em servidores...

## Histórico de versões

### [0.1.0] - DD/MM/AAAA
#### Adicionado
- Adicionado ...