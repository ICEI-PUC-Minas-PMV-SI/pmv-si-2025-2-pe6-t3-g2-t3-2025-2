# Recuperação de Senha - Guia de Teste (Demo)

## Visão Geral
A recuperação de senha no frontend está implementada em modo **demo** (mock) usando API routes do Next.js. Isso permite testar o fluxo completo sem depender do backend, ideal para desenvolvimento e demonstração.

## Como Funciona

### 1. Página de Recuperação de Senha
- **URL**: `http://localhost:3000/recuperar-senha`
- **Acesso**: Clique em "Esqueceu a senha?" na página de login
- **Função**: Solicita o e-mail para iniciar o processo de recuperação

### 2. API Routes Mock (Backend Simulado)

#### POST `/api/auth/forgot-password`
- **Entrada**: `{ email: "usuario@example.com" }`
- **Comportamento**:
  - Gera um token único (válido por 15 minutos)
  - Armazena token em memória (perdido ao reiniciar servidor)
  - Em **desenvolvimento**: retorna a URL de reset no campo `demoUrl`
  - Simula o envio de e-mail (log no console do servidor)
  
- **Resposta de Sucesso** (200):
  ```json
  {
    "message": "Se um usuário com esse e-mail existir, enviaremos instruções.",
    "demoUrl": "http://localhost:3000/recuperar-senha/reset/[TOKEN]"
  }
  ```

#### POST `/api/auth/reset-password`
- **Entrada**: `{ token: "[TOKEN]", password: "nova_senha" }`
- **Validações**:
  - Token deve ser válido e não expirado
  - Senha deve ter mínimo 6 caracteres
- **Comportamento**:
  - Remove token após uso (one-time token)
  - Armazena redefinição em memória (para demo)
  - Redireciona para login com sucesso
  
- **Resposta de Sucesso** (200):
  ```json
  {
    "message": "Senha redefinida com sucesso!",
    "demoResetId": "[ID]"
  }
  ```

## Fluxo de Teste Passo a Passo

### 1. Iniciar o Frontend
```bash
cd src/frontend-medlink
npm install
npm run dev
```
Acesse `http://localhost:3000`

### 2. Ir para a Página de Login
Clique em "Esqueceu a senha?" ou acesse `http://localhost:3000/recuperar-senha`

### 3. Solicitar Recuperação
1. Insira um e-mail qualquer (não precisa existir no backend)
2. Clique em "Enviar instruções"
3. Você verá uma mensagem de sucesso: "Se um usuário com esse e-mail existir, enviaremos instruções."

### 4. Verificar o Token (Desenvolvimento)
- **Console do servidor** (terminal onde rodou `npm run dev`):
  ```
  [DEMO] E-mail de recuperação "enviado" para usuario@example.com. 
  Token: [TOKEN_HEX]. 
  URL: http://localhost:3000/recuperar-senha/reset/[TOKEN]
  ```
- **Em production**: Não há `demoUrl` retornado (por segurança). O token deveria ser enviado por e-mail.

### 5. Redefinir Senha
1. Copie a URL do log (ou construa manualmente: `http://localhost:3000/recuperar-senha/reset/[TOKEN]`)
2. Acesse a página de reset
3. Insira a nova senha (mínimo 6 caracteres)
4. Confirme a senha
5. Clique em "Redefinir senha"
6. Sucesso! Você será redirecionado para login com a mensagem "Senha redefinida com sucesso!"

### 6. Tentar Login
- A senha atual ainda é a antiga (não foi atualizada no backend)
- Isso é esperado em modo demo — a redefinição é armazenada apenas em memória

## Limitações (Demo)

⚠️ **Importante**: Esta implementação é apenas para demonstração. As seguintes limitações existem:

1. **Senha não é realmente alterada no banco de dados**
   - O token é validado e armazenado em memória
   - A senha não é atualizada no backend
   - Para funcionalidade real, implementar endpoints no backend

2. **Tokens são perdidos ao reiniciar o servidor**
   - Armazenamento em memória (não persistent)
   - Em produção, usar banco de dados

3. **Sem envio real de e-mail**
   - Token é exibido apenas no console (desenvolvimento)
   - Em produção, integrar com serviço de e-mail (SendGrid, AWS SES, etc.)

4. **Sem validação se e-mail existe**
   - Qualquer e-mail é aceito (sempre retorna 200)
   - Por segurança, sempre informar "Se um usuário com esse e-mail existir..."

## Próximos Passos - Integração Real

Para usar em produção, implemente no **backend**:

### 1. DTOs (Data Transfer Objects)
```java
public record ForgotPasswordRequest(String email) {}
public record ResetPasswordRequest(String token, String password) {}
public record ForgotPasswordResponse(String message) {}
```

### 2. Endpoints (Controllers)
```java
@PostMapping("/medlink/paciente/forgot-password")
public ResponseEntity<ForgotPasswordResponse> forgotPassword(@RequestBody ForgotPasswordRequest req) {
    // 1. Verificar se usuário com esse e-mail existe
    // 2. Gerar token de recuperação
    // 3. Salvar token + expiração no banco (ex: tabela `password_reset_tokens`)
    // 4. Enviar e-mail com link de reset (usar Spring Mail + template)
    // 5. Retornar sucesso (sem vazar se e-mail existe)
}

@PostMapping("/medlink/paciente/reset-password")
public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest req) {
    // 1. Validar token (existência + expiração)
    // 2. Validar senha (min 6 caracteres)
    // 3. Buscar usuário associado ao token
    // 4. Atualizar senha (com BCryptPasswordEncoder)
    // 5. Deletar token (one-time)
    // 6. Retornar sucesso
}
```

### 3. Configuração de Variáveis de Ambiente
- `JWT_SECRET_KEY` - secret para JWT tokens
- `MAIL_SMTP_HOST`, `MAIL_SMTP_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` - SMTP
- `FRONTEND_URL` - para gerar link de reset correto

### 4. Atualizar `.env` do Frontend
```env
NEXT_PUBLIC_FORGOT_PASSWORD_PATH=/medlink/paciente/forgot-password
NEXT_PUBLIC_RESET_PASSWORD_PATH=/medlink/paciente/reset-password
```

## Arquivos Modificados / Criados

- ✅ `/src/app/api/auth/forgot-password/route.ts` - API route mock para solicitar reset
- ✅ `/src/app/api/auth/reset-password/route.ts` - API route mock para redefinir senha
- ✅ `/src/app/services/auth.ts` - Atualizado para usar rotas mock por padrão
- ✅ `/src/app/login/page.tsx` - Adicionado link "Recuperar senha"
- ✅ `/src/app/recuperar-senha/page.tsx` - Já existia, sem mudanças
- ✅ `/src/app/recuperar-senha/reset/[token]/ResetPasswordClient.tsx` - Já existia, sem mudanças
- ✅ `.env.example` - Documentação de variáveis de ambiente

## Troubleshooting

### "Token inválido ou expirado"
- Certifique-se de que copiou o token corretamente
- Tokens expiram em 15 minutos
- Token só pode ser usado uma vez

### "Senha deve ter pelo menos 6 caracteres"
- Insira uma senha com mínimo 6 caracteres
- Letras, números e caracteres especiais são aceitos

### Link de reset não funciona
- Certifique-se de estar acessando `http://localhost:3000` (não `127.0.0.1`)
- Verifique se o token no URL está correto
- Tente copiar novamente do log do servidor

### Token não aparece no console
- Rode `npm run dev` no diretório `src/frontend-medlink`
- Verifique se o console está visível (não filtrado)
- Token é exibido apenas em `NODE_ENV=development`
