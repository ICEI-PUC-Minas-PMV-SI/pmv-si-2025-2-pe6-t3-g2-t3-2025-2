# Introdução

Texto descritivo com a visão geral do projeto abordado. Inclui o contexto, o problema, os objetivos, a justificativa e o público-alvo do projeto.

## Problema

Em clínicas que atendem muitas especialidades, como médicos, dentistas, psicólogos e fisioterapeutas dividem a mesma estrutura física e de atendimento, o processo de agendamento de consultas pode acabar se tornando complexo. Cada profissional possui sua agenda de horários de atendimento e disponibilidade específica. Quando não há um sistema integrado e distribuído, a possibilidade de ocorrer falhas operacionais, como sobreposição de horários, falhas de registro de consultas ou até mesmo marcações duplicadas é grande. 

Além disso, muitas vezes o processo acaba sendo desgastante para o paciente, que precisa ligar para a clínica para agendar a consulta e até comparecer pessoalmente ao local para verificar a disponibilidade da agenda do profissional para o qual deseja um atendimento.

A falta de sincronização da agenda dos profissionais em tempo real também acaba gerando uma dificuldade para todos envolvidos no processo. Quando uma consulta é remarcada ou cancelada, essa alteração não pode não ser imediatamente refletida nos registros gerais da clínica, o que causa desencontro de informações entre os profissionais da saúde, que não possuem sua agenda atualizada, pacientes, que não conseguem visualizar toda a agenda disponível e colaboradores da clínica, responsáveis pela administração das agendas.
O problema de pesquisa se concentra na necessidade de desenvolvimento de um sistema que permita gerenciar de forma eficiente e atualizada as agendas de diferentes profissionais de saúde, garantindo que alterações em consultas sejam refletidas imediatamente, evitando conflitos de horários, duplicidades e dificuldades de acesso à informação tanto para pacientes quanto para profissionais de saúde e a equipe administrativa.

## Objetivos

Aqui você deve descrever os objetivos do trabalho indicando que o objetivo geral é desenvolver um software para solucionar o problema apresentado acima. 

Apresente também alguns (pelo menos 2) objetivos específicos dependendo de onde você vai querer concentrar a sua prática investigativa, ou como você vai aprofundar no seu trabalho.

> **Links Úteis**:
> - [Objetivo geral e objetivo específico: como fazer e quais verbos utilizar](https://blog.mettzer.com/diferenca-entre-objetivo-geral-e-objetivo-especifico/)

## Justificativa

Ainda hoje, o agendamento de consultas e serviços clínicos representa um desafio na área da saúde. Alguns estabelecimentos ainda utilizam sistemas isolados e dependem de poucos funcionários para operação, o que gera problemas de comunicação, limita a disponibilidade de horários e reduz a flexibilidade para os pacientes.

Diante desse contexto, a implementação de um sistema de agendamento médico distribuído torna-se necessária, com o objetivo de centralizar e integrar os serviços clínicos de forma prática e acessível ao usuário. O sistema garantirá uma gestão eficiente da disponibilidade de agendas, reduzirá falhas manuais e facilitará a comunicação, proporcionando mais conforto aos pacientes, que poderão visualizar e agendar atendimentos de maneira rápida e confiável.

A escolha de se aprofundar em aspectos como sistemas distribuídos, integração com bancos de dados, deploy em nuvem e serviços de processamento remoto se justifica pelo potencial de oferecer sincronização em tempo real, escalabilidade, confiabilidade e alta disponibilidade do sistema. Além disso, o estudo desses elementos possibilita aprendizado acadêmico sólido e aplicação prática de conceitos avançados de tecnologia, tornando o projeto relevante tanto para a formação dos alunos quanto para soluções reais na área da saúde.


## Público-Alvo

O site da clínica médica será utilizado por diferentes perfis de usuários. O principal público é formado por pacientes de variadas faixas etárias, que acessam a plataforma para agendar consultas e exames. Entre eles, jovens e adultos geralmente apresentam maior familiaridade com tecnologia e preferem utilizar o celular na versão mobile, enquanto pacientes idosos podem ter mais dificuldades e necessitam de uma navegação simples e objetiva. Outro grupo relevante são familiares ou cuidadores, que realizam agendamentos em nome de terceiros, muitas vezes com maior domínio digital. Também fazem parte do público usuários em busca de informações, que acessam o site para conhecer serviços e especialidades antes de efetivar um agendamento. De forma indireta, profissionais da clínica podem utilizar áreas restritas para acompanhar agendas e confirmações, embora não sejam o foco principal do site. Em todos os casos, a plataforma deve garantir clareza, rapidez e facilidade de contato, atendendo diferentes níveis de experiência com tecnologia.

# Especificações do Projeto

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| Permitir que o usuário cadastre tarefas | ALTA | 
|RF-002| Emitir um relatório de tarefas no mês   | MÉDIA |

### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve ser responsivo para rodar em um dispositivos móvel | MÉDIA | 
|RNF-002| Deve processar requisições do usuário em no máximo 3s |  BAIXA | 

Com base nas Histórias de Usuário, enumere os requisitos da sua solução. Classifique esses requisitos em dois grupos:

- [Requisitos Funcionais
 (RF)](https://pt.wikipedia.org/wiki/Requisito_funcional):
   correspondem a uma funcionalidade que deve estar presente na
  plataforma (ex: cadastro de usuário).
- [Requisitos Não Funcionais
  (RNF)](https://pt.wikipedia.org/wiki/Requisito_n%C3%A3o_funcional):
  correspondem a uma característica técnica, seja de usabilidade,
  desempenho, confiabilidade, segurança ou outro (ex: suporte a
  dispositivos iOS e Android).
  Lembre-se que cada requisito deve corresponder à uma e somente uma
  característica alvo da sua solução. Além disso, certifique-se de que
  todos os aspectos capturados nas Histórias de Usuário foram cobertos.

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

Descreva aqui todos os serviços que serão disponibilizados pelo seu projeto, detalhando suas características e funcionalidades.

# Arquitetura da Solução

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![arq](https://github.com/user-attachments/assets/b9402e05-8445-47c3-9d47-f11696e38a3d)


## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.

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
