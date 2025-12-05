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

![agendar consulta]<img width="627" height="880" alt="a" src="https://github.com/user-attachments/assets/9060a951-23de-4e09-a484-9b778339b4d7" />


![agendar consulta]<img width="627" height="881" alt="aa" src="https://github.com/user-attachments/assets/5f41a139-57ea-4913-82f8-936ae5c99ac7" />


Minhas consultas

![minhas consultas]<img width="627" height="875" alt="aaa" src="https://github.com/user-attachments/assets/7258ece4-9538-4a37-9417-4526aeb83ce8" />


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

Para garantir a segurança no Medlink (versão Mobile), o sistema utiliza autenticação baseada em JWT, permitindo que apenas usuários autorizados acessem as funcionalidades. Após o login, o servidor gera um token que identifica o usuário e suas permissões, possibilitando comunicação segura entre front-end e back-end sem precisar reenviar credenciais a cada requisição. Cada perfil - como médico, paciente ou administrador - possui permissões específicas, validadas diretamente pelo token, impedindo acessos indevidos. Rotas protegidas exigem a verificação do JWT, garantindo que apenas usuários autenticados possam realizar operações, como visualizar perfis, acessar o painel médico ou agendar consultas, conforme seu perfil. A expiração do token em 2 horas adiciona uma camada extra de proteção, minimizando riscos em caso de comprometimento. Esses mecanismos combinados fortalecem a segurança da aplicação móvel, prevenindo acessos não autorizados e protegendo a comunicação entre front-end e back-end.

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

## Casos de Teste – Exclusão de médico cadastrado

<img width="294" height="524" alt="image" src="https://github.com/user-attachments/assets/e3d85e7b-65f4-418f-8784-e4a4acea90b4" />

------------------------------------------

## Login médico

Teste: Login com o perfil de médico

![login médico](https://github.com/user-attachments/assets/c6b1ca47-ffaa-4116-95e3-5f65b449e28d)

Tela de login inicial

### Busca e Filtro de Profissionais

Teste : Permitir filtro e busca de profissionais por especialidade e nome

![WhatsApp Image 2025-11-29 at 14 55 29](https://github.com/user-attachments/assets/7026d6c3-d216-43cb-bc8e-00f9ec45355f)


## RF-005 - Evitar conflitos de horário ao impedir marcações duplicadas ou sobreposição de agendas

Objetivo: verificar se o sistema impede corretamente a marcação de consultas em horários já ocupados ou sobrepostos na agenda de um profissional de saúde, garantindo a integridade dos agendamentos.

Resultado Esperado: 
1. Após um paciente agendar um horário (X) com um médico, esse horário (X) deve ser removido ou desativado da visualização de agendamento para todos os outros pacientes.

Resultado obtido: o sistema funcionou totalmente conforme o esperado. Após um horário ser reservado por um paciente, ele não apareceu nas opções de agendamento para outros pacientes, evitando conflitos e sobreposição de agendas com sucesso.

<img width="535" height="620" alt="image" src="https://github.com/user-attachments/assets/16f9819b-d51e-40df-a151-7c580ab77557" />


## RF-006	Permitir remarcação e cancelamento de consultas com atualização em tempo real

Este caso de teste visa verificar a funcionalidade de gestão de agendamentos, incluindo a capacidade de remarcar e cancelar uma consulta, e assegurar que as alterações sejam propagadas pelo sistema em tempo real (atualização imediata).

Resultado esperado	
1. A remarcação deve ser concluída com sucesso e a nova Data X/Horário Y deve aparecer na interface do paciente de forma instantânea.
2. O cancelamento deve ser concluído com sucesso e a consulta deve ser removida/marcada como cancelada para o paciente.

Resultado obtido:
Ao tentar realizar a remarcação da consulta (X → Y), o sistema exibiu uma mensagem de erro e não permitiu a alteração da data/horário. Quando cancelado, a consulta foi removida da lista do Paciente (ou marcada como cancelada).

<img width="535" height="620" alt="image" src="https://github.com/user-attachments/assets/97de784b-6e1f-462e-8f05-96e528092bc5" />

<img width="535" height="620" alt="image" src="https://github.com/user-attachments/assets/84e89d72-80cd-4441-a57d-6a5f0272bca8" />

<img width="535" height="620" alt="image" src="https://github.com/user-attachments/assets/c92e96ee-018a-4f54-9aed-375d79b32bab" />

<img width="535" height="620" alt="image" src="https://github.com/user-attachments/assets/71f1ea23-f3e1-4618-9f38-1b9da5351486" />


## RF-007 - Armazenar histórico de consultas dos pacientes (para os profissionais de saúde e pacientes)

Verificar se o sistema armazena corretamente o histórico de consultas (agendadas e canceladas) e se ele é acessível pelos perfis de Paciente e Profissional de Saúde.

Resultado esperado: 
1. O Paciente deve conseguir visualizar todas as suas consultas passadas.
2. O Profissional de Saúde deve conseguir acessar as consultas agendadas para ele.

Resultado obtido: o paciente conseguiu acessar e visualizar integralmente seu histórico de consultas passadas, confirmando o armazenamento correto. No entanto, o médico não conseguiu acessar o histórico de consultas do paciente, resultando em uma falha na implementação do requisito.

<img width="535" height="620" alt="image" src="https://github.com/user-attachments/assets/c4e47c0b-9098-49e1-8e8a-b5b41d5ebdfb" />

## RF-009 Gestão administrativa (CRUD) de profissionais, especialidades, horários/janelas de atendimento e convênios aceitos

Verificar a funcionalidade completa de Gestão Administrativa (CRUD - Criar, Ler, Atualizar, Deletar) para os profissionais.

Resultado Esperado: o perfil admin deve conseguir realizar todas as operações de CRUD para todas as entidades (profissionais, especialidades, horários, convênios).

Resultado obtido: As funcionalidades de Adicionar (C - Create) e Ler (R - Read) para profissionais estão operacionais. No entanto, as operações de Update (Atualizar/Editar) e Delete (Excluir) para profissionais apresentam falha

<img width="533" height="620" alt="image" src="https://github.com/user-attachments/assets/64eab543-ee2c-45b5-906e-c0089af94534" />

<img width="533" height="620" alt="image" src="https://github.com/user-attachments/assets/97b297c9-526f-4ff5-984e-aeb3456de404" />


## Casos de Teste - RF-013 - Controle de acesso baseado em perfis (RBAC), com permissões distintas para Paciente, Profissional e Administrativo

Este caso de teste visa verificar a aplicação do modelo de Controle de Acesso Baseado em Perfis (RBAC), garantindo que cada perfil de usuário (Paciente, Profissional de Saúde e Administrativo) tenha permissões e acesso exclusivos às funcionalidades pertinentes às suas funções.

Resultado esperado: 
1. O Paciente não deve conseguir acessar telas e funcionalidades exclusivas de Médico ou Administrador. 
2. O médico não deve conseguir acessar telas e funcionalidades exclusivas de administrador.
3. O Admin deve ter acesso a todas as funcionalidades de gestão, mas não deve conseguir executar ações restritas a pacientes (como criar uma nova consulta no seu próprio nome sem a devida interface).
Resultado obtido: O sistema Medlink aplica o controle de acesso baseado em Perfis (RBAC) de forma eficaz, garantindo que pacientes, profissionais de saúde e admin tenham permissões distintas e segregadas.

Demonstração visual:
Perfil Paciente

<img width="324" height="547" alt="image" src="https://github.com/user-attachments/assets/fb3d557b-4046-472f-a326-66ff9e9c1bb8" /> 

Perfil Médico

<img width="324" height="547" alt="image" src="https://github.com/user-attachments/assets/e7ec5675-d300-4704-a1a9-3dbbfb663289" />

Perfil Administrador

<img width="324" height="547" alt="image" src="https://github.com/user-attachments/assets/fc51ea19-2eba-4f92-a554-b10e87977349" />

## Casos de Teste - RNF-001 - A interface deve ser intuitiva para diferentes tipos de usuários (pacientes e profissionais de saúde) 

Esse caso de teste visa verificar se a interface de login, apesar de unificada (usando os mesmos campos de Email/Senha), oferece a funcionalidade necessária para autenticar diferentes perfis de usuário conforme a regra de negócio.

Objetivo: verificar se a tela de login/acesso rápido é clara ao indicar os diferentes perfis de usuário que podem ser selecionados para autenticação.

Resultado Esperado: a tela deve ter uma seção que indique claramente os perfis disponíveis através de botões distintos (ex: "Paciente", "Médico", "Admin"), permitindo ao usuário selecionar o perfil desejado antes de entrar.

Resultado Obtido: a tela de Login apresenta a seção "Login Rápido (Para Teste)" com três botões distintos rotulados "Admin", "Médico" e "Paciente", indicando claramente qual perfil deve ser clicado para acessar a respectiva área, cumprindo o requisito de intuitividade na diferenciação de usuários.

Demonstração visual:

<img width="922" height="825" alt="Captura de tela 2025-11-30 112526" src="https://github.com/user-attachments/assets/e053e6ef-85e8-43cb-80ef-6549f71f2923" />

## Casos de Teste - RNF-002 - A navegação deve ser simples, com menus claros e informações visíveis

Este caso de teste verifica se a estrutura de navegação do sistema, exemplificada pela barra inferior e pelo painel inicial, cumpre o requisito de ser simples, clara e com informações visíveis.

Objetivo: verificar a clareza e funcionalidade das Ações Rápidas na tela inicial.

Resultado esperado: a navegação entre as telas deve ser rápida e intuitiva.

Resultado obtido: a seção "Ações Rápidas" cumpre integralmente o requisito de navegação simples e clara, utilizando um design visualmente atraente e funcional para guiar o usuário de forma intuitiva às principais áreas do sistema.

Demonstração visual:

<img width="425" height="760" alt="Captura de tela 2025-11-30 103804" src="https://github.com/user-attachments/assets/8a841750-ac6a-4f94-970d-81f19e186c62" />

## Casos de Teste - RNF-003 - Permitir acesso ao sistema via navegador web e aplicativo mobile

Este caso de teste verifica o requisito de acesso multiplataforma (RNF-003), focando especificamente na capacidade de acesso e funcionalidade através do aplicativo mobile, já que o acesso web foi abordado em outra parte da documentação (frontend-web.md).

Objetivo: assegurar a navegação seja funcional no aplicativo mobile.

Resultado esperado: o aplicativo deve abrir sem erros e o login deve ser realizado com sucesso.

Resultado obtido: o login com o perfil de Paciente foi realizado com sucesso, direcionando o usuário para o Painel Inicial.

Demonstração visual:

<img width="146" height="260" alt="image" src="https://github.com/user-attachments/assets/97f38183-7996-47c2-ab5b-499625379a18" /><br>


![9a3dfa9e-c090-4dbd-82d7-d2c21ba5a0a4](https://github.com/user-attachments/assets/49887525-2abd-4b29-92fa-f618497f7e08)

## Casos de Teste - RNF-004 - Atualização em tempo real das agendas de profissionais	

Esse caso de teste verifica se o sistema, após qualquer alteração no agendamento, aplica corretamente a atualização em tempo real dos horários dos profissionais de saúde, conforme o requisito RNF-004.

Objetivo: verificar se as alterações (como uma nova marcação ou um cancelamento) feitas por um paciente são refletidas e atualizadas instantaneamente na interface de agenda do profissional.

Resultado esperado: qualquer alteração no status de um slot disponível deve ser visível na agenda do profissional imediatamente, sem a necessidade de recarregar a página ou o aplicativo.

Resultado obtido: o sistema validou as atualizações com sucesso. Após um agendamento ser realizado pelo paciente, a agenda do médico foi atualizada em tempo real, não exibindo mais o horário instantaneamente. O controle de atualização está funcionando corretamente.

Consulta agendada as 17h:

<img width="535" height="620" alt="image" src="https://github.com/user-attachments/assets/20b7e7ce-1c97-4f00-b460-20f463f85a14" />

Último horário disponível as 16:30:

<img width="535" height="620" alt="image" src="https://github.com/user-attachments/assets/1d50feba-337c-4492-99ad-c36aafa35789" />


## Casos de Teste - RNF-005 - Controle de acesso por perfil (paciente e profissional de saúde)

Este caso de teste verifica se o sistema, após o login, aplica corretamente o controle de acesso e direciona o usuário para a interface específica do seu perfil, conforme o requisito de controle de acesso por perfil (paciente e profissional de saúde).

Objetivo: verificar se o sistema autentica e direciona os usuários (paciente, profissional de saúde, admin) para o painel apropriado para seu perfil.

Resultado esperado: o login com credenciais de Paciente deve levar ao painel com "Ações Rápidas" (Agendar Consulta, Minhas Consultas), o login com credenciais de profissional de saúde ou admin deve levar a um painel com funcionalidades específicas para suas roles

Resultado obtido: o sistema validou e separou os perfis com sucesso. O login do Paciente resultou no acesso ao Painel Inicial com foco em agendamentos, enquanto o login do profissional de saúde resultou em um painel diferente, com ferramentas e funcionalidades exclusivas para médicos. O mesmo ocorre com o Admin. O controle de acesso está funcionando corretamente.

Demonstração visual:

Perfil Paciente<br>

<img width="324" height="547" alt="image" src="https://github.com/user-attachments/assets/fb3d557b-4046-472f-a326-66ff9e9c1bb8" />

Perfil Médico<br>

<img width="324" height="547" alt="image" src="https://github.com/user-attachments/assets/e7ec5675-d300-4704-a1a9-3dbbfb663289" />

Perfil Administrador<br>

<img width="324" height="547" alt="image" src="https://github.com/user-attachments/assets/fc51ea19-2eba-4f92-a554-b10e87977349" />


Funcionalidade admin:

Inclusão e remoção de médicos<br>

<img width="139" height="227" alt="image" src="https://github.com/user-attachments/assets/2353d378-222d-429f-bdcf-6b9773382457" /><br>

<img width="139" height="227" alt="image" src="https://github.com/user-attachments/assets/124bb244-b60d-4903-9c12-a75de34bb220" />


Funcionalidade paciente:
<br>

Visualização do painel inicial para pacientes<br>

<img width="145" height="260" alt="image" src="https://github.com/user-attachments/assets/94bce3df-74bd-46ae-b447-6bc6a25e7fb6" />

## Casos de Teste - RNF-006 - Garantir a capacidade de adicionar novos profissionais e usuários sem impacto significativo no sistema

Este caso de teste verifica se o sistema tem a capacidade e estabilidade para adicionar novos usuários (médicos).

Objetivo: verificar se a adição de novos usuários/profissionais pelo perfil admin é realizada com sucesso, sem causar lentidão ou impacto significativo no desempenho do sistema para outros usuários.

Resultado esperado: a adição de novos perfis deve ser concluída rapidamente (em poucos segundos), o novo perfil deve estar funcional imediatamente, e o desempenho do sistema para outros usuários ativos não deve ser afetado.

Resultado obtido: o sistema funciona corretamente. O Administrador consegue adicionar novos médicos através da interface de gestão. A operação é concluída de forma rápida e o processo não causa lentidão ou interrupções.

Demonstração visual:

<img width="533" height="620" alt="image" src="https://github.com/user-attachments/assets/49218171-16e1-4c1f-be97-6d55842c9cb4" />

<img width="533" height="620" alt="image" src="https://github.com/user-attachments/assets/cce6d46c-c4ab-4322-bb95-2b0994027a97" />


 
# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.

# Planejamento

##  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Semana 1

Atualizado em: 30/11/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Lucas Oliveira     | Criação de novas páginas e resolução de bugs | 03/11/2025     | 30/11/2025 | ✔️    | 30/11/2025      |
| Ricardo   | Início do projeto, criação de páginas Mobile e conexão com os endpoints | 03/11/2025     | 20/11/2025 | ✔️    | 20/11/2025      |
| Beatriz     | Documentação - Design Visual | 03/11/2025     | 30/11/2025 | ✔️    | 30/11/2025      |
| Beatriz     | Testes    | 03/11/2025     | 30/11/2025 | ✔️    | 30/11/2025      |
| Ramir   | Documentação - Considerações de Segurança | 03/11/2025     | 30/11/2025 | ✔️    | 30/11/2025      |
| Ramir   | Testes | 03/11/2025     | 30/11/2025 | ✔️    | 30/11/2025      |
| Felipe   | Testes   | 03/11/2025     | 30/11/2025 | ✔️    | 30/11/2025      |
| Felipe   | Documentação - Wireframes   | 03/11/2025     | 30/11/2025 | ✔️    | 30/11/2025      |
| Lucas Peres   | Testes  | 03/11/2025     | 30/11/2025 | ✔️    | 30/11/2025      |
| Lucas Peres  | Documentação - Front-End Móvel, Projeto de Interface e Fluxo de Dados | 03/11/2025     | 30/11/2025 | ✔️    | 30/11/2025      |
| André   | Testes  | 03/11/2025     | 30/11/2025 | ✔️    | 30/11/2025      |



Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

