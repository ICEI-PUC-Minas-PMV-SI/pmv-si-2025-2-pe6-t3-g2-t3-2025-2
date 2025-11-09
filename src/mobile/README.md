# Medical Consultation App - Flutter Mobile

Um aplicativo móvel Flutter para sistema de consultas médicas que consome uma API REST Spring Boot.

## 📱 Funcionalidades

### Autenticação
- ✅ Login de usuários
- ✅ Cadastro de novos pacientes  
- ✅ Logout seguro
- ✅ Persistência de sessão

### Gestão de Consultas
- ✅ Visualizar consultas agendadas
- ✅ Agendar novas consultas
- ✅ Cancelar consultas
- ✅ Filtros por status e data

### Médicos
- ✅ Listagem de médicos disponíveis
- ✅ Busca por nome ou especialidade
- ✅ Visualizar detalhes do médico
- ✅ Agendar diretamente com o médico

### Perfil do Usuário
- ✅ Visualizar dados pessoais
- ✅ Editar informações do perfil
- ✅ Gerenciar conta

## 🏗️ Arquitetura

```
lib/
├── main.dart                  # Entry point da aplicação
├── models/                    # Modelos de dados
│   ├── user.dart             # Modelo do usuário
│   ├── consulta.dart         # Modelo de consulta
│   └── medico.dart           # Modelo do médico
├── screens/                   # Telas da aplicação
│   ├── login_screen.dart     # Tela de login
│   ├── register_screen.dart  # Tela de cadastro
│   ├── home_screen.dart      # Tela principal
│   ├── consultas_screen.dart # Lista de consultas
│   ├── medicos_screen.dart   # Lista de médicos
│   ├── agendar_consulta_screen.dart # Agendamento
│   └── profile_screen.dart   # Perfil do usuário
├── services/                  # Serviços e lógica de negócio
│   ├── api_service.dart      # Cliente HTTP para API
│   └── auth_service.dart     # Gerenciamento de autenticação
├── utils/                     # Utilitários
│   └── theme.dart            # Tema da aplicação
└── widgets/                   # Componentes reutilizáveis
```

## 🔗 Integração com Backend

O app consome uma API REST Spring Boot com os seguintes endpoints:

### Autenticação
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/register` - Cadastro de usuário

### Usuários  
- `GET /api/users/me` - Dados do usuário logado
- `PUT /api/users/{id}` - Atualizar dados do usuário

### Consultas
- `GET /api/consultas` - Listar consultas
- `POST /api/consultas` - Criar nova consulta
- `PUT /api/consultas/{id}/cancel` - Cancelar consulta

### Médicos
- `GET /api/medicos` - Listar médicos
- `GET /api/medicos/{id}/available-slots` - Horários disponíveis

## 🚀 Como Executar

### Pré-requisitos
1. **Flutter SDK** instalado (versão >=3.0.0)
2. **VS Code** com extensões Flutter e Dart
3. **Backend Spring Boot** rodando

### Passos

1. **Clone e navegue até o projeto:**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd pmv-si-2025-2-pe6-t3-g2-t3-2025-2/src/Mobile
   ```

2. **Instale as dependências:**
   ```bash
   flutter pub get
   ```

3. **Configure o endpoint da API:**
   - Abra `lib/services/api_service.dart`
   - Altere a constante `baseUrl` para o endereço do seu backend
   ```dart
   static const String baseUrl = 'http://SEU_IP:8080/api';
   ```

4. **Execute o app:**
   ```bash
   flutter run
   ```

### No VS Code
- Use `F5` para debug
- Ou execute a task **Flutter: Run Debug**
- Use `Ctrl+Shift+P` → "Flutter: Hot Reload" durante desenvolvimento

## 📦 Dependências

```yaml
dependencies:
  flutter: sdk: flutter
  cupertino_icons: ^1.0.2  # Ícones iOS
  http: ^1.1.0             # Cliente HTTP
  provider: ^6.0.5         # Gerenciamento de estado
  shared_preferences: ^2.2.2 # Armazenamento local
  intl: ^0.18.1            # Formatação de datas
```

## 🎨 Design System

### Cores Principais
- **Primary:** `#0066CC` (Azul médico)
- **Secondary:** `#4CAF50` (Verde saúde)  
- **Background:** `#F5F5F5` (Cinza claro)
- **Cards:** `#FFFFFF` (Branco)
- **Text:** `#333333` (Cinza escuro)

### Componentes
- **Cards elevados** com bordas arredondadas
- **Botões** com estilo Material Design
- **Formulários** com validação em tempo real
- **Navigation** com BottomNavigationBar
- **Estados de loading** e feedback visual

## 🔧 Desenvolvimento

### Hot Reload
O Flutter suporta hot reload para desenvolvimento rápido:
- `R` - Hot reload
- `Shift + R` - Hot restart
- `Q` - Quit

### Debug
- Breakpoints funcionam normalmente no VS Code
- Use o Flutter Inspector para debug de UI
- Console do Flutter mostra logs e erros

### Estrutura de Estado
- **Provider** para gerenciamento de estado global
- **AuthService** mantém estado de autenticação
- **Formulários** com validação local

## 📱 Funcionalidades Mobile

### Navegação
- **Tab navigation** na tela principal
- **Stack navigation** para fluxos específicos
- **Back button** nativo Android

### UX Mobile
- **Loading states** em todas operações assíncronas
- **Error handling** com SnackBars informativos
- **Formulários** otimizados para tela pequena
- **Cards touch-friendly** com áreas de toque adequadas

### Offline
- **Token JWT** persistido localmente
- **Automatic login** se token válido
- **Graceful handling** de erro de rede

## 🛠️ Próximos Passos

- [ ] Push notifications para lembretes
- [ ] Chat com médicos
- [ ] Upload de exames/documentos
- [ ] Pagamentos integrados
- [ ] Modo offline com sincronização
- [ ] Biometria para autenticação
- [ ] Dark theme
- [ ] Internacionalização (i18n)

## 🧪 Testes

Para executar testes:
```bash
flutter test
```

Para análise de código:
```bash
flutter analyze
```

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ usando Flutter**