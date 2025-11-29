# Front-end Móvel

[Inclua uma breve descrição do projeto e seus objetivos.]

## Projeto da Interface
[Descreva o projeto da interface móvel da aplicação, incluindo o design visual, layout das páginas, interações do usuário e outros aspectos relevantes.]

### Wireframes

[Inclua os wireframes das páginas principais da interface, mostrando a disposição dos elementos na página.]

### Design Visual

[Descreva o estilo visual da interface, incluindo paleta de cores, tipografia, ícones e outros elementos gráficos.]

## Fluxo de Dados

[Diagrama ou descrição do fluxo de dados na aplicação.]

## Tecnologias Utilizadas

[Lista das tecnologias principais que serão utilizadas no projeto.]

## Considerações de Segurança

[Discuta as considerações de segurança relevantes para a aplicação distribuída, como autenticação, autorização, proteção contra ataques, etc.]

## Implantação

[Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

## Casos de Teste – Cadastro de Usuário

### 1. Cadastro bem-sucedido

Fluxo de cadastro de um novo usuário no Medlink:

Obs: Fluxo de cadastramento ocorreu normalmente

![GIF demonstrando o fluxo de cadastro de usuário no Medlink](https://github.com/user-attachments/assets/2a7943b3-125d-4af3-8e1b-1c68620b8f6e)

### 2. Tentativa de cadastro com e-mail já existente

Caso de teste que valida a regra de não permitir cadastro com um e-mail já utilizado:

- Pré-condição: já existe um usuário cadastrado com o e-mail informado.
- Ação: usuário preenche o formulário de cadastro utilizando o mesmo e-mail.
- Resultado esperado: o sistema exibe mensagem de erro informando que o e-mail já está em uso e não finaliza o cadastro.

Obs.: Sistema não permitiu o cadastramento, mas mensagem de erro poderia ser mais assertiva. 

Demonstração visual do comportamento:

![GIF demonstrando tentativa de cadastro com e-mail já existente](https://github.com/user-attachments/assets/02a471da-e215-49d7-89c1-808a1a415606)

## Casos de Teste – Login

### 1. Login bem-sucedido

Caso de teste que valida o fluxo de autenticação com credenciais válidas.

- **Pré-condição:** usuário previamente cadastrado no sistema.
- **Ação:** informar e-mail e senha corretos e clicar em **“Entrar”**.
- **Resultado esperado:** usuário é autenticado e redirecionado para a tela inicial, exibindo mensagem de boas-vindas e as ações rápidas (por exemplo, *“Agendar Consulta”* e *“Minhas Consultas”*).

Demonstração visual:

![GIF demonstrando login bem-sucedido no Medlink](https://github.com/user-attachments/assets/4a57372d-5205-448b-93d8-593bd5cf130f)

---

### 2. Login com e-mail ou senha incorretos

Caso de teste que valida o tratamento de credenciais inválidas.

- **Pré-condição:** o e-mail e/ou a senha informados não correspondem a um usuário válido.
- **Ação:** informar e-mail e/ou senha incorretos e clicar em **“Entrar”**.
- **Resultado esperado:**
  - o sistema **não** autentica o usuário;
  - é exibida uma mensagem de erro em destaque, por exemplo:  
    **“Email ou senha incorretos”**;
  - o usuário permanece na tela de login para tentar novamente.

Demonstração visual:

![GIF demonstrando tentativa de login com e-mail ou senha incorretos](https://github.com/user-attachments/assets/9f72a0d5-4fbf-46a1-a036-7f8e92c90544)



## Casos de Teste – Agendar Consulta

Fluxo de agendamento de uma nova consulta no Medlink:

Obs:. Ao selecionar o médico, aparece um texto em vermelho com parte do código prejudicando a experiência do usuário.

![GIF demonstrando o fluxo de agendar consulta no Medlink](https://github.com/user-attachments/assets/ee99e52c-2609-4189-a865-65dae44290df)

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.

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

