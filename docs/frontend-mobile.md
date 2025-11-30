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

Tela de login

![tela de login](https://github.com/user-attachments/assets/358cb369-9ac5-4666-a457-1480e775b753)

Cadastro paciente

![cadastro paciente](https://github.com/user-attachments/assets/76b5f3d6-12e3-4971-9e0b-ce83db58cdd5)

Perfil paciente

![perfil paciente](https://github.com/user-attachments/assets/f8510d86-3161-45a7-a0b9-a5a8edcf6034)

Agendar consulta

![agendar consulta](https://github.com/user-attachments/assets/911b6a45-4d23-4106-8f25-5136c60e951c)

Cadastro médico

![cadastro médico](https://github.com/user-attachments/assets/5775b38f-91c2-48d4-8614-0532fabfcc08)

Gerenciamento de médicos

![gerenciar medico](https://github.com/user-attachments/assets/009b0d8d-bb4d-48b7-84bb-21c91e658120)

Tela inicial

![tela inicial](https://github.com/user-attachments/assets/5dbcbb2c-9063-4171-ba28-4815330e513c)

### Design Visual

### Paleta de cores:

A paleta de cores do Medlink foi escolhida para transmitir profissionalismo, clareza e confiança, com foco em saúde e bem-estar do paciente. 

#### Cores principais:
A cor azul (#0066CC) utilizada em várias telas da aplicação foi escolhida para demonstrar confiança, segurança e profissionalismo, qualidades essenciais em uma aplicação de saúde. Essa cor é estrategicamente aplicada para destacar os pontos de maior importância, como ícones e botões principais de cada tela, reforçando não apenas uma forte identidade de marca, mas também fornecendo uma boa legibilidade e hierarquia visual ao criar um alto contraste com o texto branco em diversas telas.
<br>

Para manter a tela visualmente calma e focada, o Medlink usa duas cores neutras: o cinza muito claro (#F5F5F5) como fundo de tela principal, e o cinza claro (#F7F2FA) nos em campos (por exemplo, o de imput da tela incial). Essa diferença sutil garante que os campos de preenchimento se destaquem levemente do fundo, permitindo que a cor azul da marca e o texto sejam os elementos mais importantes e fáceis de ver.

<img width="227" height="101" alt="image" src="https://github.com/user-attachments/assets/d3488383-5d6b-4dc7-b83a-3a968a27500f" />


Por fim, as cores verde (#4EB053), laranja (#FF9600) e roxo (#A025B6) são utilizadas na seção "Ações Rápidas" da tela inicial logada para complementar o azul (cor principal). Elas são usadas para diferenciar visualmente as funcionalidades e criar um sistema de sinalização rápida e eficaz. <br>

<img width="249" height="85" alt="image" src="https://github.com/user-attachments/assets/4d841fae-1452-4b3f-8f0b-5ba81b3567dd" />

#### Cor de alerta:

Na versão mobile do sistema, a cor #F44336 foi aplicada para indicar mensagens de erro e alertas ao usuário. Ela aparece em elementos como textos de validação de formulários, banners de notificação e ícones de alerta, destacando falhas ou informações que precisam de atenção imediata. Essa escolha garante que erros sejam rapidamente identificáveis, mesmo em telas pequenas, mantendo consistência visual e contraste adequado para legibilidade em dispositivos móveis. <br>

<img width="97" height="80" alt="image" src="https://github.com/user-attachments/assets/78ac31e7-7d04-4a1c-aa78-bdea8e882fe8" />



### Tipografia:

A tipografia do sistema Medlink foi cuidadosamente otimizada para dispositivos móveis, garantindo leitura clara e consistente em diferentes telas e sistemas operacionais. As fontes possuem variados pesos e tamanhos, permitindo que os usuários identifiquem rapidamente seções e informações importantes, mesmo em telas menores

### Utilização de ícones:

O painel inicial após login do Medlink utiliza uma combinação de ícones gráficos para tornar a navegação intuitiva para o usuário e reforçar visualmente as funcionalidades principais. Eles seguem a paleta de cores da interface e ajudam o usuário a identificar rapidamente cada seção. Abaixo, exemplos de utilização de ícones no projeto:

1. Ícone +: Permite ao usuário iniciar o processo de agendamento de uma nova consulta médica.
2. Ícone calendário: leva o usuário à visualização de todos os seus agendamentos de consultas já realizados.
3. Ícone médicos: direciona o usuário para uma lista ou busca de médicos e suas especialidades.
4. Ícone perfil: permite ao usuário acessar e gerenciar seus dados pessoais e informações de perfil. <br>
<br>
<img width="212" height="380" alt="image" src="https://github.com/user-attachments/assets/6c3909b8-77f4-4dbd-852c-3d7a88a58898" />


A utilização de ícones na tela de cadastro também tem o objetivo de dizer imediatamente ao usuário qual tipo de dado é esperado, tornando o formulário rápido de entender. <br><br>
<img width="286" height="520" alt="Captura de tela 2025-11-30 100715" src="https://github.com/user-attachments/assets/40261f72-1943-415a-bd81-bb918b46d3da" />

De forma geral, foram utilizados ícones SVGs que facilitam a navegação, para que fique mais fluido para o usuário, como pode ser visto no exemplo abaixo (opção do admin de excluir um médico). É importante ressaltar que todos os ícones seguem a paleta de cores, mantendo coerência visual. <br><br>
<img width="157" height="98" alt="image" src="https://github.com/user-attachments/assets/ec3c4c73-28ec-45f2-bc33-9fdcc815e1de" />



## Fluxo de Dados

No front-end móvel, o aplicativo atua como um cliente leve que consome os serviços REST expostos pelo backend Medlink. Todo o tráfego de dados é feito sobre HTTPS e, após a autenticação, as chamadas utilizam um token JWT no cabeçalho de autorização.

O fluxo básico de dados funciona da seguinte forma:

1- Autenticação: ao fazer login, o app envia as credenciais do usuário para o endpoint /medlink/login. Em caso de sucesso, o backend devolve um token JWT, que é armazenado com segurança no dispositivo.

2- Carregamento de dados do paciente: com o token, o aplicativo chama o endpoint /medlink/paciente para buscar os dados cadastrais e montar a tela inicial personalizada.

3- Consulta da agenda: para montar a lista de consultas, o app consome /medlink/paciente/consultas, recebendo do backend os horários já agendados, seus status e demais informações necessárias para exibição.

4- Agendamento de consulta: ao longo do fluxo de agendamento, o aplicativo envia ao backend os dados selecionados pelo usuário (especialidade, profissional, data/horário e observações) por meio do endpoint de criação de consulta (/medlink/paciente/consultas). O backend valida conflitos de agenda e devolve a confirmação com o registro persistido no banco.

5- Atualização e cancelamento: quando o paciente remarca ou cancela uma consulta, o app envia a solicitação ao backend (por exemplo, via PUT ou DELETE em endpoints específicos). O backend atualiza o registro e retorna o novo estado, que é refletido instantaneamente na lista exibida no aplicativo.

Esse modelo garante que o front-end móvel não mantenha regras de negócio complexas localmente: toda a lógica crítica (validação de horários, perfis, regras de agendamento) permanece no backend distribuído. O aplicativo apenas orquestra as chamadas, apresenta as informações de forma amigável e mantém o estado de interface sincronizado com as respostas da API.

## Tecnologias Utilizadas

As principais tecnologias previstas para o desenvolvimento do front-end móvel são:

Flutter: framework principal para construção da interface móvel.

JavaScript/TypeScript: linguagem utilizada para implementação dos componentes, lógica de interface e integração com a API.

Axios ou Fetch API: camada de comunicação HTTP com o backend Medlink, responsável por enviar requisições autenticadas e tratar respostas e erros.

AsyncStorage (ou equivalente seguro): armazenamento local para o token JWT e pequenas preferências do usuário, garantindo que ele permaneça autenticado entre sessões.

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

--------------------------------------------

## Cadastro de médico

Teste: Nessa tela é possível realizar o cadastro de um médico, informando seus dados pessoais e sua especialidade

![cadastro médico](https://github.com/user-attachments/assets/1c21d2a9-9bd6-4f2b-9fb0-58f8723c222c)

------------------------------------------

## Gerenciamento de médicos

Teste: Nessa tela conseguimos visualizar todos os médicos cadastrados na plataforma e editar suas informações

![medico cadastrado](https://github.com/user-attachments/assets/cc8b3bf8-c68d-4470-ae18-1e4baf096438)

------------------------------------------

## Login médico

Teste: Login com o perfil de médico

![login médico](https://github.com/user-attachments/assets/c6b1ca47-ffaa-4116-95e3-5f65b449e28d)

Tela de login inicial

### Busca e Filtro de Profissionais

Teste : Permitir filtro e busca de profissionais por especialidade e nome

![WhatsApp Image 2025-11-29 at 14 55 29](https://github.com/user-attachments/assets/7026d6c3-d216-43cb-bc8e-00f9ec45355f)


 
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

