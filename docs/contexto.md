# Introdução

O processo de agendamento de consultas em clínicas que atendem diversas especialidades pode ser um grande desafio. Cada profissional possui horários e disponibilidades diferentes, o que pode gerar falhas, como sobreposição de atendimentos, marcações duplicadas ou falta de informações atualizadas para pacientes e equipe administrativa.

Além disso, muitos pacientes ainda precisam ligar ou comparecer à clínica para verificar horários disponíveis, tornando o processo mais demorado e pouco prático. Quando ocorre um cancelamento ou alteração, a falta de sincronização imediata nas agendas aumenta as dificuldades para todos os envolvidos.

Diante desse cenário, este trabalho tem como objetivo desenvolver uma solução simples para facilitar o agendamento de consultas, oferecendo maior organização, praticidade e acesso rápido às informações. Busca-se criar um sistema que centralize as agendas, reduza falhas manuais e proporcione uma melhor experiência tanto para pacientes quanto para profissionais da saúde.

## Problema

Em clínicas que atendem muitas especialidades, como médicos, dentistas, psicólogos e fisioterapeutas dividem a mesma estrutura física e de atendimento, o processo de agendamento de consultas pode acabar se tornando complexo. Cada profissional possui sua agenda de horários de atendimento e disponibilidade específica. Quando não há um sistema integrado e distribuído, a possibilidade de ocorrer falhas operacionais, como sobreposição de horários, falhas de registro de consultas ou até mesmo marcações duplicadas é grande. 

Além disso, muitas vezes o processo acaba sendo desgastante para o paciente, que precisa ligar para a clínica para agendar a consulta e até comparecer pessoalmente ao local para verificar a disponibilidade da agenda do profissional para o qual deseja um atendimento.

A falta de sincronização da agenda dos profissionais em tempo real também acaba gerando uma dificuldade para todos envolvidos no processo. Quando uma consulta é remarcada ou cancelada, essa alteração não pode não ser imediatamente refletida nos registros gerais da clínica, o que causa desencontro de informações entre os profissionais da saúde, que não possuem sua agenda atualizada, pacientes, que não conseguem visualizar toda a agenda disponível e colaboradores da clínica, responsáveis pela administração das agendas.
O problema de pesquisa se concentra na necessidade de desenvolvimento de um sistema que permita gerenciar de forma eficiente e atualizada as agendas de diferentes profissionais de saúde, garantindo que alterações em consultas sejam refletidas imediatamente, evitando conflitos de horários, duplicidades e dificuldades de acesso à informação tanto para pacientes quanto para profissionais de saúde e a equipe administrativa.

## Objetivos

### **Objetivos gerais**

- **Desenvolver** uma aplicação web e mobile integrada para gerenciar os processos clínicos e administrativos de uma clínica médica multidisciplinar.

### **Objetivos específicos**

- **Implementar** um sistema de agendamento online que permita visualizar disponibilidade de médicos e evitar conflitos de horários. 
- **Criar** um módulo de cadastro de pacientes, incluindo dados pessoais, convênios médicos e histórico de consultas.
- **Desenvolver** um prontuário eletrônico para centralizar o histórico clínico e exames dos pacientes.
- **Garantir segurança** da informação por meio de autenticação, autorização e criptografia de dados sensíveis.
- **Implementar** diferentes perfis de acesso (*médico e paciente*).
- **Disponibilizar** um histórico de consultas e procedimentos para médicos e pacientes.
- **Implementar** notificações (*e-mail ou SMS*) para lembrete de consultas e acompanhamento de agendamentos.


## Justificativa

Ainda hoje, o agendamento de consultas e serviços clínicos representa um desafio na área da saúde. Alguns estabelecimentos ainda utilizam sistemas isolados e dependem de poucos funcionários para operação, o que gera problemas de comunicação, limita a disponibilidade de horários e reduz a flexibilidade para os pacientes.

Diante desse contexto, a implementação de um sistema de agendamento médico distribuído torna-se necessária, com o objetivo de centralizar e integrar os serviços clínicos de forma prática e acessível ao usuário. O sistema garantirá uma gestão eficiente da disponibilidade de agendas, reduzirá falhas manuais e facilitará a comunicação, proporcionando mais conforto aos pacientes, que poderão visualizar e agendar atendimentos de maneira rápida e confiável.

A escolha de se aprofundar em aspectos como sistemas distribuídos, integração com bancos de dados, deploy em nuvem e serviços de processamento remoto se justifica pelo potencial de oferecer sincronização em tempo real, escalabilidade, confiabilidade e alta disponibilidade do sistema. Além disso, o estudo desses elementos possibilita aprendizado acadêmico sólido e aplicação prática de conceitos avançados de tecnologia, tornando o projeto relevante tanto para a formação dos alunos quanto para soluções reais na área da saúde.


## Público-Alvo

O site da clínica médica será utilizado por diferentes perfis de usuários. O principal público é formado por pacientes de variadas faixas etárias, que acessam a plataforma para agendar consultas e exames. Entre eles, jovens e adultos geralmente apresentam maior familiaridade com tecnologia e preferem utilizar o celular na versão mobile, enquanto pacientes idosos podem ter mais dificuldades e necessitam de uma navegação simples e objetiva. Outro grupo relevante são familiares ou cuidadores, que realizam agendamentos em nome de terceiros, muitas vezes com maior domínio digital. Também fazem parte do público usuários em busca de informações, que acessam o site para conhecer serviços e especialidades antes de efetivar um agendamento. De forma indireta, profissionais da clínica podem utilizar áreas restritas para acompanhar agendas e confirmações, embora não sejam o foco principal do site. Em todos os casos, a plataforma deve garantir clareza, rapidez e facilidade de contato, atendendo diferentes níveis de experiência com tecnologia.

# Especificações do Projeto
Visão geral
Sistema de agendamento para clínica multi-especialidades, acessível via web e mobile, com atualização em tempo real das agendas e controle de acesso por perfil.

Escopo do MVP

Cadastro/login e gerenciamento básico de perfil.

Catálogo de especialidades e profissionais.

Consulta de disponibilidade por profissional/especialidade e data.

Agendamento, remarcação e cancelamento de consultas/exames sem sobreposição de horários.

Histórico de consultas do paciente.

Perfis e permissões (RBAC)

Paciente: gerencia seus dados e consultas.

Profissional de saúde: visualiza e bloqueia a própria agenda.

Administrativo: gerencia profissionais, especialidades, horários e consultas.

Fluxos principais

Buscar disponibilidade → escolher horário → confirmar agendamento.

Remarcar/Cancelar consulta (respeitando regras de prazo).

Administrativo: cadastrar/editar profissionais, especialidades e janelas de atendimento.

Regras de negócio básicas

Um slot comporta apenas uma consulta ativa (sem duplicidade/overbooking).

Remarcação/cancelamento permitido até X horas antes do horário (valor configurável).

Bloqueios definidos pelo profissional tornam os slots do período indisponíveis.

Consultas passadas permanecem no histórico (alterações apenas de status).

Dados/Entidades essenciais
Usuário/Perfil, Paciente, Profissional, Especialidade, Agenda/Slot (início/fim/status), Consulta (status/notas).

Plataforma e tecnologia (alto nível)
Aplicação web e mobile (PWA), backend REST, banco relacional, atualização em tempo real (ex.: WebSocket), interface simples e navegável.

Critérios de aceite do MVP

O sistema impede agendar duas consultas no mesmo slot.

Agendar, remarcar e cancelar funcionam de ponta a ponta.

Mudanças de agenda são refletidas em tempo real nas telas abertas.

Telas principais utilizáveis em navegador desktop e mobile.
## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

### Requisitos Funcionais

| ID     | Descrição do Requisito Funcional                                                                 | Prioridade |
|--------|---------------------------------------------------------------------------------------------------|------------|
| RF-001 | Permitir login e autenticação de pacientes e profissionais de saúde                               | ALTA |
| RF-002 | Permitir atualização de dados pessoais e contato dos usuários                                     | MÉDIA |
| RF-003 | Permitir que pacientes visualizem a disponibilidade de profissionais por especialidade            | ALTA |
| RF-004 | Permitir agendamento de consultas e exames de acordo com horários disponíveis                     | ALTA |
| RF-005 | Evitar conflitos de horário ao impedir marcações duplicadas ou sobreposição de agendas            | ALTA |
| RF-006 | Permitir remarcação e cancelamento de consultas com atualização em tempo real                     | MÉDIA |
| RF-007 | Armazenar histórico de consultas dos pacientes (para os profissionais de saúde e pacientes)       | MÉDIA |
| RF-008 | Enviar notificações e lembretes de consulta (e-mail/SMS) com confirmação de presença (opt-in)     | ALTA |
| RF-009 | Gestão administrativa (CRUD) de profissionais, especialidades, horários/janelas de atendimento e convênios aceitos | ALTA |
| RF-010 | Permitir que o profissional gerencie a própria agenda, incluindo criação de bloqueios, pausas e férias | ALTA |
| RF-011 | Prontuário eletrônico: criar/visualizar evoluções, anexar e baixar documentos/exames              | ALTA |
| RF-012 | Aplicar regras de prazo para remarcação/cancelamento (ex.: impedir ações com menos de *X* horas)  | ALTA |
| RF-013 | Controle de acesso baseado em perfis (RBAC), com permissões distintas para Paciente, Profissional e Administrativo | ALTA |
| RF-014 | Registrar auditoria de alterações em consultas e agenda (quem alterou, quando e o quê)            | MÉDIA |
| RF-015 | Permitir filtro e busca de profissionais por especialidade, data, convênio e unidade              | MÉDIA |
| RF-016 | Gerar relatórios básicos (ex.: consultas por período/profissional/status; taxa de faltas)         | MÉDIA |
| RF-017 | Recuperação de acesso: redefinição de senha e verificação de e-mail do usuário                    | MÉDIA |
| RF-018 | Configuração de preferências de lembretes (canal e antecedência) por usuário                      | BAIXA |


### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| A interface deve ser intuitiva para diferentes tipos de usuários (pacientes e profissionais de saúde) | MÉDIA | 
|RNF-002| A navegação deve ser simples, com menus claros e informações visíveis |  MÉDIA | 
|RNF-003| Permitir acesso ao sistema via navegador web e aplicativo mobile |  ALTA | 
|RNF-004| Atualização em tempo real das agendas de profissionais |  MÉDIA | 
|RNF-005| Controle de acesso por perfil (paciente e profissional de saúde) |  MÉDIA | 
|RNF-006| Garantir a capacidade de adicionar novos profissionais e usuários sem impacto significativo no sistema |  BAIXA | 

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

# Catálogo de Serviços

O sistema de agendamento de consultas oferecerá um conjunto de serviços voltados para pacientes, profissionais da saúde e equipe administrativa da clínica. Esses serviços foram projetados para garantir praticidade, confiabilidade e facilidade de acesso, atendendo diferentes perfis de usuários.

## Serviços para Pacientes
- **Cadastro e Login**  
  Permite que o paciente crie uma conta, atualize seus dados pessoais e acesse o sistema com segurança.

- **Visualização de Especialidades e Profissionais**  
  Exibe a lista de médicos e profissionais disponíveis, com informações sobre suas especialidades, horários de atendimento e convênios aceitos.

- **Agendamento de Consultas e Exames**  
  Possibilita a marcação de consultas de acordo com os horários disponíveis, evitando sobreposição de agendas.

- **Remarcação e Cancelamento de Consultas**  
  Permite ao paciente remarcar ou cancelar uma consulta com atualização imediata no sistema.

- **Histórico de Consultas**  
  Disponibiliza ao paciente o acesso ao histórico de atendimentos realizados.

- **Notificações e Lembretes**  
  Envia alertas automáticos por e-mail ou SMS sobre consultas agendadas, cancelamentos e lembretes de atendimento.

---

## Serviços para Profissionais de Saúde
- **Login Seguro e Perfil Profissional**  
  Acesso individual para os profissionais cadastrados.

- **Gerenciamento da Agenda**  
  Permite definir horários de atendimento, pausas, férias e bloqueios de agenda.

- **Visualização e Acompanhamento de Consultas**  
  Apresenta os agendamentos confirmados, cancelados e em espera em tempo real.

- **Histórico de Pacientes**  
  Fornece acesso ao histórico de atendimentos e informações clínicas do paciente.

- **Prontuário Eletrônico**  
  Registro eletrônico das informações médicas, exames e evoluções clínicas, centralizando o acompanhamento do paciente.

---

## Serviços Administrativos (Equipe da Clínica)
- **Gestão de Usuários**  
  Cadastro e manutenção de dados de pacientes e profissionais.

- **Controle de Agendas**  
  Supervisão geral dos agendamentos, evitando duplicidades e garantindo a organização da clínica.

---

## Serviços Técnicos e de Infraestrutura
- **Autenticação e Autorização**  
  Garantia de acesso seguro com perfis diferenciados (paciente e profissional).

- **Disponibilidade Multiplataforma**  
  Acesso via navegador web e aplicativo mobile, com interface adaptada.

- **Sincronização em Tempo Real**  
  Atualização imediata das agendas em caso de agendamento, cancelamento ou alteração.

- **Armazenamento Seguro de Dados**  
  Utilização de criptografia para proteger informações sensíveis de pacientes e profissionais.

---

# Catálogo de Serviços (Resumo)

| Serviço                          | Descrição                                                                 | Perfil Atendido              |
|----------------------------------|---------------------------------------------------------------------------|------------------------------|
| Cadastro e Login                 | Criação de conta, atualização de dados pessoais e acesso seguro ao sistema | Pacientes / Profissionais    |
| Visualização de Profissionais    | Exibição de especialidades, horários e convênios disponíveis               | Pacientes                    |
| Agendamento de Consultas/Exames  | Marcação de consultas sem sobreposição de agendas                          | Pacientes                    |
| Remarcação e Cancelamento        | Alteração ou exclusão de agendamentos com atualização em tempo real        | Pacientes                    |
| Histórico de Consultas           | Consulta ao histórico de atendimentos realizados                           | Pacientes / Profissionais    |
| Notificações e Lembretes         | Alertas automáticos sobre consultas agendadas e cancelamentos              | Pacientes                    |
| Gerenciamento da Agenda          | Definição de horários, pausas e bloqueios                                  | Profissionais                |
| Acompanhamento de Consultas      | Visualização em tempo real de agendamentos confirmados ou cancelados       | Profissionais                |
| Prontuário Eletrônico            | Registro clínico com informações, exames e evoluções                       | Profissionais                |
| Gestão de Usuários               | Cadastro e manutenção de pacientes e profissionais                         | Administradores              |
| Controle de Agendas              | Supervisão de todos os agendamentos da clínica                             | Administradores              |
| Autenticação e Autorização       | Acesso seguro com perfis diferenciados                                     | Todos                        |
| Multiplataforma                  | Acesso via navegador web e aplicativo mobile                               | Todos                        |
| Sincronização em Tempo Real      | Atualização imediata das agendas                                           | Todos                        |
| Armazenamento Seguro de Dados    | Criptografia para proteger informações sensíveis                           | Todos                        |


# Arquitetura da Solução

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![Arquitetura](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t3-g2-t3-2025-2/blob/main/docs/img/Arquitetura.jpg)


## Tecnologias Utilizadas

Tecnologias para Implementação da Solução
Para o desenvolvimento da aplicação integrada de gestão para a clínica médica, foi definida uma arquitetura de software moderna, robusta e escalável. A seleção de tecnologias a seguir visa atender aos requisitos de funcionalidades prioritárias e complexas, como agendamento online, prontuário eletrônico, segurança de dados e relatórios administrativos, garantindo uma experiência de usuário fluida tanto na plataforma web quanto na mobile.

1. Back-end
Linguagem: Java (LTS)

Framework Principal: Spring Boot

Banco de Dados: PostgreSQL

Mapeamento Objeto-Relacional (ORM): Spring Data JPA (com Hibernate)

Segurança: Spring Security

Servidor Web: Apache Tomcat (embutido no Spring Boot)

2. Front-end (Aplicação Web)
Linguagens Base: HTML5, CSS3, JavaScript (ES6+)

Linguagem de Tipagem: TypeScript

Framework/Biblioteca UI: React.js

Gerenciador de Estado: Redux Toolkit

Framework de Estilização: Material-UI ou Tailwind CSS

Cliente HTTP: Axios

3. Mobile (Aplicação para Pacientes e Médicos)
Framework: React Native

Navegação: React Navigation

Biblioteca de Componentes: React Native Paper ou NativeBase

Ferramentas de Build: Android Studio (para Android) e Xcode (para iOS)

4. Ferramentas e Infraestrutura (DevOps)
IDEs (Ambiente de Desenvolvimento): IntelliJ IDEA (Back-end) e Visual Studio Code (Front-end/Mobile)

Controle de Versão: Git e GitHub

Gerenciadores de Pacotes: Maven (Back-end) e NPM (Front-end/Mobile)

Ferramenta de Testes de API: Open AI

Conteinerização (Opcional): Docker

![Fluxo](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t3-g2-t3-2025-2/blob/main/docs/img/Fluxo.png)


## Hospedagem

A aplicação será hospedada em uma instância da AWS (Amazon Web Services), infraestrutura providenciada pela PUC para suportar o ambiente de produção. Essa etapa de hospedagem será realizada após a conclusão dos testes finais da plataforma.

Além da instância de processamento, pode ser integrado o Amazon S3 (Simple Storage Service) como repositório de arquivos, garantindo armazenamento escalável, durável e de fácil acesso. Essa solução permite gerenciar documentos e dados de forma eficiente, com alta disponibilidade e integração nativa com outros serviços da AWS.

A arquitetura escolhida oferece os seguintes benefícios:

- Escalabilidade: ajuste dinâmico de recursos e armazenamento conforme a demanda;
- Alta disponibilidade: sistema projetado para minimizar falhas e manter acessibilidade contínua;
- Segurança: mecanismos de criptografia, controle de acessos e conformidade com padrões internacionais;
- Flexibilidade: compatibilidade com diferentes frameworks e serviços em nuvem;
- Monitoramento e gestão: acompanhamento de desempenho e otimização de recursos em tempo real.

Essa combinação entre a instância AWS e o Amazon S3 assegura que a aplicação seja disponibilizada em um ambiente robusto, confiável e preparado para atender às necessidades atuais e futuras do sistema.

# Planejamento

##  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Semana 2

Atualizado em: 08/08/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Lucas        | Organização do Grupo | 04/08/2025     | 11/08/2025 | ✔️    | 11/08/2025      |

### Semana 3

Atualizado em: 17/08/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Lucas        | Introdução | 11/08/2025     | 17/08/2025 | ✔️    | 17/08/2025      |
| Andre        | Objetivos    | 11/08/2025     | 17/08/2025 | 📝    |  17/08/2025               |
| AlunoY        | Histórias de usuário  | 01/01/2024     | 07/01/2005 | ⌛     |                 |
| AlunoK        | Personas 1  |    01/01/2024        | 12/02/2005 | ❌    |       |

#### Semana 4

Atualizado em: 24/08/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Lucas        | Reunião e Divisão    | 17/08/2025     | 24/08/2025 | ✔️    | 24/08/2025      |
| André        | Objetivos    | 17/08/2025     | 24/08/2025 | ✔️    |    24/08/2025             |
| AlunoY        | Página de login  | 01/02/2024     | 07/03/2024 | ⌛     |                 |
| AlunoK        | Script de login  |  01/01/2024    | 12/03/2024 | ❌    |       |

#### Semana 5

Atualizado em: 31/08/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Lucas        | Tecnologias Utilizadas    | 24/08/2025     | 31/08/2025 | ✔️    | 31/08/2025      |
| Andre        | Catálogo de Serviços      | 24/08/2025     | 31/08/2025 | ✔️    |   31/08/2025    |
| AlunoY        | Página de login  | 01/02/2024     | 07/03/2024 | ⌛     |                 |
| AlunoK        | Script de login  |  01/01/2024    | 12/03/2024 | ❌    |       |

Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado
