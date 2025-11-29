# Front-end Móvel

O front-end móvel do sistema Medlink é o aplicativo voltado principalmente ao paciente, permitindo que ele gerencie sua jornada de atendimento diretamente pelo smartphone. A partir dessa interface, o usuário pode realizar cadastro e login, visualizar suas consultas agendadas, buscar disponibilidade por especialidade e profissional, agendar, remarcar ou cancelar consultas, além de receber feedbacks claros sobre o status de cada ação. O app consome os mesmos serviços REST do backend distribuído, garantindo que as informações de agenda sejam atualizadas em tempo real e fiquem consistentes com o sistema web e a base de dados central.

## Projeto da Interface
A interface móvel foi planejada para ser simples, objetiva e focada em tarefas, facilitando o uso por pacientes de diferentes perfis. A navegação é organizada em abas inferiores (bottom tab) e pilhas de navegação (stack), permitindo que o usuário avance e retorne nos fluxos sem perder o contexto.

As principais telas previstas são:

Tela de boas-vindas / splash, com a identidade visual do sistema e acesso rápido ao login ou cadastro.

Tela de login e cadastro, com formulários enxutos, validação dos campos e mensagens de erro claras.

Tela inicial do paciente, exibindo a próxima consulta em destaque, um resumo da agenda e atalhos para “Agendar nova consulta” e “Ver todas as consultas”.

Fluxo de agendamento em etapas, guiando o usuário pela escolha de especialidade, profissional, data/horário disponível e confirmação final do agendamento.

Tela “Minhas consultas”, listando consultas futuras e passadas com status (agendada, remarcada, cancelada) e ações rápidas para remarcar ou cancelar quando permitido.

Tela de perfil, onde o paciente pode atualizar dados cadastrais básicos (nome, telefone, e-mail, documento, contato de emergência etc.).

As interações foram pensadas para reduzir o número de toques e digitações: botões de ação bem destacados, listas filtráveis e mensagens de confirmação/sucesso/erro em formato de toasts ou alertas. O objetivo é que o paciente consiga concluir um agendamento completo em poucos passos, com o mínimo de frustração e sem necessidade de treinamento prévio.

### Wireframes

[Inclua os wireframes das páginas principais da interface, mostrando a disposição dos elementos na página.]

### Design Visual

[Descreva o estilo visual da interface, incluindo paleta de cores, tipografia, ícones e outros elementos gráficos.]

## Fluxo de Dados

 No front-end móvel, o aplicativo atua como um cliente leve que consome os serviços REST expostos pelo backend Medlink. Todo o tráfego de dados é feito sobre HTTPS e, após a autenticação, as chamadas utilizam um token JWT no cabeçalho de autorização.
>
> O fluxo básico de dados funciona da seguinte forma:
>
> 1. Autenticação: ao fazer login, o app envia as credenciais do usuário para o endpoint `/medlink/login`. Em caso de sucesso, o backend devolve um token JWT, que é armazenado com segurança no dispositivo.
> 2. Carregamento de dados do paciente: com o token, o aplicativo chama o endpoint `/medlink/paciente` para buscar os dados cadastrais e montar a tela inicial personalizada.
> 3. Consulta da agenda: para montar a lista de consultas, o app consome `/medlink/paciente/consultas`, recebendo do backend os horários já agendados, seus status e demais informações necessárias para exibição.
> 4. Agendamento de consulta: ao longo do fluxo de agendamento, o aplicativo envia ao backend os dados selecionados pelo usuário (especialidade, profissional, data/horário e observações) por meio do endpoint de criação de consulta (`/medlink/paciente/consultas`). O backend valida conflitos de agenda e devolve a confirmação com o registro persistido no banco.
> 5. Atualização e cancelamento: quando o paciente remarca ou cancela uma consulta, o app envia a solicitação ao backend (por exemplo, via `PUT` ou `DELETE` em endpoints específicos). O backend atualiza o registro e retorna o novo estado, que é refletido instantaneamente na lista exibida no aplicativo.
>
> Esse modelo garante que o front-end móvel não mantenha regras de negócio complexas localmente: toda a lógica crítica (validação de horários, perfis, regras de agendamento) permanece no backend distribuído. O aplicativo apenas orquestra as chamadas, apresenta as informações de forma amigável e mantém o estado de interface sincronizado com as respostas da API.

## Tecnologias Utilizadas

As principais tecnologias previstas para o desenvolvimento do front-end móvel são:

React Native: framework principal para construção da interface móvel, permitindo desenvolvimento multiplataforma (Android/iOS) com código compartilhado.

JavaScript/TypeScript: linguagem utilizada para implementação dos componentes, lógica de interface e integração com a API.

React Navigation: biblioteca responsável pelo sistema de navegação em pilhas e abas (stack e bottom tab), permitindo fluxos de agendamento em múltiplas etapas.

Biblioteca de componentes UI (ex.: NativeBase ou React Native Paper): conjunto de componentes prontos (inputs, botões, cards, modais) para garantir padronização visual e responsividade.

Axios ou Fetch API: camada de comunicação HTTP com o backend Medlink, responsável por enviar requisições autenticadas e tratar respostas e erros.

AsyncStorage (ou equivalente seguro): armazenamento local para o token JWT e pequenas preferências do usuário, garantindo que ele permaneça autenticado entre sessões.

Ferramentas de apoio, como ESLint/Prettier para padronização de código e, futuramente, Jest/React Native Testing Library para testes de componentes e fluxos críticos.

Esse conjunto de tecnologias está alinhado com a arquitetura distribuída proposta para o projeto, facilitando a integração com o backend em Spring Boot e permitindo evolução futura do aplicativo móvel sem necessidade de reescrita completa.

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

