# Front-end Web

Esta é a interface principal do sistema de gerenciamento da clínica, responsável por fornecer a experiência do usuário para pacientes, profissionais de saúde e administradores. A aplicação web consome a API REST desenvolvida no back-end para apresentar e gerenciar os dados de forma intuitiva, ágil e responsiva.

O objetivo deste front-end é traduzir as regras de negócio complexas do sistema em fluxos de navegação simples, permitindo que cada perfil de usuário realize suas tarefas de forma eficiente.

#### Objetivos específicos do Front-end:

Para Pacientes: Criar um portal público onde possam pesquisar especialidades e profissionais, visualizar agendas em tempo real, realizar agendamentos, remarcações, cancelamentos e acessar seu histórico de consultas.

Para Profissionais de Saúde: Desenvolver um painel de controle (dashboard) logado que permita ao profissional gerenciar sua própria agenda, definir bloqueios/férias e acessar os prontuários eletrônicos de seus pacientes.

Para Administradores: Implementar uma área administrativa robusta para o gerenciamento completo de profissionais, pacientes, especialidades e convênios, além da supervisão geral dos agendamentos.

## Projeto da Interface Web

[Descreva o projeto da interface Web da aplicação, incluindo o design visual, layout das páginas, interações do usuário e outros aspectos relevantes.]

### Wireframes

[Inclua os wireframes das páginas principais da interface, mostrando a disposição dos elementos na página.]

## Home

### Home - Desktop
![Home - Desktop](https://github.com/user-attachments/assets/19eaf80c-16a4-4fa1-81f8-8ae2fdc56c44)

### Home - Tablet
![Home Tablet](https://github.com/user-attachments/assets/45bd863a-f7a6-477b-9215-5caba4f5dc9d)

### Home - Mobile
![Home - Mobile](https://github.com/user-attachments/assets/14d84747-e83d-4339-988f-476288409cba)

## Cadastro

### Cadastro - Desktop
![cadastro - desktop](https://github.com/user-attachments/assets/0e4df0c4-ce48-4325-a355-c54690e8008c)

### Cadastro - Tablet
![cadastro - tablet](https://github.com/user-attachments/assets/044d7396-e2d6-45a2-804e-c7898d5a1d78)

### Cadastro - Mobile
![cadastro - mobile](https://github.com/user-attachments/assets/6f924285-7e6e-444e-8b52-807889e15f79)

## Login

### Login - Desktop
![login - desktop](https://github.com/user-attachments/assets/c52d2364-df46-483a-a532-e0b070084563)

### Login - Tablet
![login - tablet](https://github.com/user-attachments/assets/037bf97e-2be9-4d03-871d-702a3aedc393)

### Login - Mobile
![login - mobile](https://github.com/user-attachments/assets/c1d04d3c-183f-4b36-a13d-b0bec228a291)

### Design Visual

[Descreva o estilo visual da interface, incluindo paleta de cores, tipografia, ícones e outros elementos gráficos.]
### Paleta de cores:

A paleta de cores do Medlink foi escolhida para transmitir profissionalismo, clareza e confiança, com foco em saúde e bem-estar do paciente. 

#### Cores principais:

A cor verde (#16A34A), cor principal, é tradicionalmente associado a saúde. Foi utilizada em botões principais, elementos de destaque e avisos de sucesso. <br><br>
A cor branca (#FFFFFF) foi escolhida pois transmite limpeza, simplicidade e neutralidade, garantindo que os elementos coloridos se destaquem. Foi utilizada no projeto como fundo das seções, cards e inputs para facilitar uma leitura clara e agradável.<br><br>
A cor cinza escuro(#6B7280) tem a função de ser uma cor neutra para textos, descrições e subtítulos, garantindo legibilidade. Além disso, mantém harmonia com o branco e o verde.<br><br>
A cor cinza claro (#E5E7EB) foi utilizada para borda de cards, inputs, seções e divisores, proporcionando delimitação sutil de elementos da página. A escolha da cor também contribui para um layout limpo e organizado.<br><br>
A cor azul (#E0F2FE) transmite tranquilidade, limpeza e suavidade, mantendo a interface leve e agradável. Foi escolhida, portanto, para o fundo da página web.<br><br>
<img width="406" height="125" alt="image" src="https://github.com/user-attachments/assets/210587c3-51fc-4add-9568-ec21ea0def0e" />
<br>
#### Cores de alerta:

A cor verde (#16A34A), além de ser a cor principal da interface e normalmente associada à saúde, também é usada no contexto para indicar sucesso ou confirmação em mensagens de confirmação e seleção ativa. <br><br>
A cor vermelha (#EF4444) é usada para alertas, erros ou campos inválidos.
<br><br>
<img width="242" height="117" alt="image" src="https://github.com/user-attachments/assets/6bfb34af-5610-4485-aa70-486c2250c002" />

### Tipografia:

A tipografia do sistema Medlink foi definido para garantir uma leitura clara e compatibilidade entre diferentes dispositivos e sistemas operacionais. Todas as páginas principai utilizam fontes padronizadas, que são:

Inter: <br>
<img width="199" height="107" alt="image" src="https://github.com/user-attachments/assets/6d0e815f-7e29-4c05-a342-4fc2b34f2d5c" />


Roboto: <br>
<img width="199" height="107" alt="image" src="https://github.com/user-attachments/assets/c3af8289-a164-464f-a0d7-016522a5b667" />


Helvetica Neue: <br>
<img width="199" height="107" alt="image" src="https://github.com/user-attachments/assets/04dcff61-7724-4e13-9e57-b507d2360b83" />

Arial: <br>
<img width="199" height="107" alt="image" src="https://github.com/user-attachments/assets/153c93e1-2b39-44cf-aea9-a8404519ae61" />



## Fluxo de Dados

[Diagrama ou descrição do fluxo de dados na aplicação.]

## Tecnologias Utilizadas

| Categoria | Tecnologia(s) |
| :--- | :--- |
| Linguagens Base | HTML5, CSS3, JavaScript (ES6+) |
| Linguagem de Tipagem | TypeScript |
| Framework/Biblioteca UI | React.js |
| Gerenciador de Estado | Redux Toolkit |
| Framework de Estilização | Material-UI ou Tailwind CSS |
| Cliente HTTP | Axios |

## Considerações de Segurança

[Discuta as considerações de segurança relevantes para a aplicação distribuída, como autenticação, autorização, proteção contra ataques, etc.]

## Implantação

[Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## 🚀 Implantação (Deploy)

A aplicação **front-end web** será implantada na **Amazon Web Services (AWS)**, garantindo escalabilidade, segurança e alta disponibilidade.

### Arquitetura de Deploy (Front-End Web)

A estratégia de implantação mais provável para um projeto React/web estático na AWS envolve:

1.  **Amazon S3 (Simple Storage Service):**
    * O *build* de produção do projeto (os arquivos estáticos `HTML`, `CSS` e `JavaScript` gerados) será armazenado em um bucket S3.
    * Este bucket será configurado para atuar como um servidor de *static website hosting*.

2.  **Amazon CloudFront:**
    * Uma distribuição do CloudFront (um serviço de CDN - Content Delivery Network) será configurada na frente do bucket S3.
    * **Benefícios:** Isso garante que a aplicação seja carregada rapidamente para usuários em qualquer lugar do mundo, além de fornecer uma camada de segurança (DDoS) e permitir a fácil configuração de um certificado **SSL/TLS (HTTPS)**.

*Alternativa: Também está em consideração o uso do **AWS Amplify**, que automatiza todo esse processo (build, deploy e hospedagem) diretamente a partir do repositório Git.*

### Status do Projeto

Esta etapa de implantação refere-se exclusivamente à **aplicação Web**.

O desenvolvimento da aplicação **Mobile** (com React Native) é uma fase futura do projeto. Quando concluído, o mobile terá seu próprio ciclo de vida e processo de implantação (publicação na Google Play Store e Apple App Store).


## Testes

[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

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

