# Análise: O que falta implementar no Frontend baseado nos endpoints do Backend

## 📋 Resumo Executivo

O frontend tem **~40%** do que precisa. Existem alguns hooks/queries, mas faltam várias funcionalidades críticas, especialmente para:
- Admin (gerenciamento completo)
- Médico (visualização e criação de disponibilidades)
- Paciente (edição de perfil, cancelamento de consultas)
- Fluxos de atualização de dados

---

## ✅ O QUE JÁ EXISTE

### Autenticação (auth.ts)
- ✅ `useRegister()` — POST /medlink/paciente/register
- ✅ `useLogin()` — POST /medlink/login
- ✅ `useRequestPasswordReset()` — POST /api/auth/forgot-password (mock)
- ✅ `useResetPassword()` — POST /api/auth/reset-password (mock)

### Paciente - Features
- ✅ `useListMedicosParaPaciente()` — GET /medlink/paciente/medicos
- ✅ `useSlotsLivresDoMedico()` — GET /medlink/paciente/medicos/{medicoId}/slots
- ✅ `useAgendarConsultaPorSlot()` — POST /medlink/paciente/consulta/por-slot
- ✅ `useConsultasPaciente()` — GET /medlink/paciente/consultas
- ✅ `useCancelarConsulta()` — DELETE /medlink/paciente/consulta/{id}

### Admin - Features (parcial)
- ✅ `useAdminConsultas()` — GET /medlink/admin/consultas
- ✅ `useCreateSlots()` — POST /medlink/admin/slots
- ✅ `useAdminSlots()` — GET /medlink/admin/slots
- ✅ `useCancelarSlot()` — DELETE /medlink/admin/slots/{slotId}
- ✅ `useCreateMedico()` — POST /medlink/medico/register (reutilizável para admin)

### Médico - Features (parcial)
- ⚠️ `useCreateSlots()` — pode ser reutilizado, mas endpoints são diferentes
  - POST /medlink/medico/disponibilidades (logado)
  - POST /medlink/medico/disponibilidades/{medicoId} (via admin)

---

## ❌ O QUE FALTA

### 1. PACIENTE - Gerenciamento de Perfil
**Endpoint Backend:** 
- GET `/medlink/paciente` — recuperar dados do paciente
- PUT `/medlink/paciente` — atualizar nome, endereco, telefone

**Status Frontend:** ❌ Não existe

**O que implementar:**
```typescript
// src/features/paciente/usePacienteProfile.ts
export function useGetPacienteProfile() { ... }  // useQuery
export function useUpdatePacienteProfile() { ... }  // useMutation
```

**Impacto:** Pacientes precisam poder editar perfil (nome, endereço, telefone)

---

### 2. PACIENTE - Agendar Consulta Direta (sem Slot)
**Endpoint Backend:** 
- POST `/medlink/paciente/consulta` — agendar diretamente (data/hora + médico)

**Status Frontend:** ❌ Não existe

**O que implementar:**
```typescript
// src/features/paciente/useAgendarConsultaDireta.ts
export interface ConsultaRequest {
  medicoId: string;
  dataHora: string;  // ISO LocalDateTime
  observacoes?: string;
}
export function useAgendarConsultaDireta() { ... }  // useMutation
```

**Impacto:** Alternativa ao fluxo de agendamento por slot (pode não usar todas as datas disponíveis)

---

### 3. MÉDICO - Visualizar Suas Consultas
**Endpoint Backend:** 
- GET `/medlink/medico/consultas` — listar consultas do médico logado

**Status Frontend:** ❌ Não existe

**O que implementar:**
```typescript
// src/features/medico/useMedicoConsultas.ts
export type ConsultaMedico = {
  id: string;
  pacienteId: string;
  dataHora: string;
  observacoes?: string;
  status: "CONFIRMADO" | "CANCELADO" | "CONCLUIDO";
};
export function useMedicoConsultas() { ... }  // useQuery
```

**Impacto:** Médicos precisam ver suas consultas agendadas

---

### 4. MÉDICO - Criar Disponibilidades (via Self-Service)
**Endpoint Backend:** 
- POST `/medlink/medico/disponibilidades` — médico cria suas próprias slots

**Status Frontend:** ❌ Não existe (useCreateSlots é apenas para admin)

**O que implementar:**
```typescript
// src/features/medico/useCriarDisponibilidades.ts
export interface DisponibilidadeRequest {
  inicio: string;  // ISO LocalDateTime "2025-12-02T09:00:00"
  fim: string;     // ISO LocalDateTime "2025-12-02T17:00:00"
  duracaoMin?: number;  // default 30
}
export function useCriarDisponibilidades() { ... }  // useMutation
```

**Impacto:** Médicos conseguem adicionar seus horários de disponibilidade (não depender de admin)

---

### 5. ADMIN - Listar Médicos
**Endpoint Backend:** 
- GET `/medlink/admin/medicos`

**Status Frontend:** ❌ Não existe

**O que implementar:**
```typescript
// src/features/admin/useAdminMedicos.ts
export function useAdminMedicos() { ... }  // useQuery
```

**Impacto:** Admin precisa visualizar lista de todos os médicos (filtrar, editar, etc.)

---

### 6. ADMIN - Listar Pacientes
**Endpoint Backend:** 
- GET `/medlink/admin/pacientes`

**Status Frontend:** ❌ Não existe

**O que implementar:**
```typescript
// src/features/admin/useAdminPacientes.ts
export function useAdminPacientes() { ... }  // useQuery
```

**Impacto:** Admin precisa visualizar lista de todos os pacientes

---

### 7. ADMIN - Registrar Admin
**Endpoint Backend:** 
- POST `/medlink/admin/register` — apenas ADMIN pode registrar outro ADMIN

**Status Frontend:** ❌ Não existe

**O que implementar:**
```typescript
// src/hooks/useCreateAdmin.ts
export interface AdminRequest {
  email: string;
  password: string;
  nome: string;
}
export function useCreateAdmin() { ... }  // useMutation
```

**Impacto:** Fluxo de criação de novos administradores (apenas via painel admin)

---

### 8. PACIENTE - Atualizar Perfil
**Endpoint Backend:** 
- PUT `/medlink/paciente` — update nome, endereco, telefone

**Status Frontend:** ❌ Não existe (com form/UI)

**O que implementar:**
- Hook: `useUpdatePacienteProfile()` em `src/features/paciente/usePacienteProfile.ts`
- UI: Página `/app/paciente/perfil/page.tsx` ou modal de edição

**Impacto:** Pacientes conseguem manter dados pessoais atualizados

---

## 📊 Tabela Resumida

| Feature | Endpoint | Hook Exist | Página UI | Status |
|---------|----------|-----------|-----------|--------|
| **PACIENTE** | | | | |
| Registrar | POST /register | ✅ | ✅ /register | ✅ Pronto |
| Login | POST /login | ✅ | ✅ /login | ✅ Pronto |
| Ver Perfil | GET /paciente | ❌ | ❌ | ❌ Falta |
| Atualizar Perfil | PUT /paciente | ❌ | ❌ | ❌ Falta |
| Listar Médicos | GET /medicos | ✅ | ✅ | ✅ Pronto |
| Ver Slots Médico | GET /medicos/{id}/slots | ✅ | ✅ (parte de agendamento) | ✅ Pronto |
| Agendar (Slot) | POST /consulta/por-slot | ✅ | ✅ | ✅ Pronto |
| Agendar (Direto) | POST /consulta | ❌ | ❌ | ❌ Falta |
| Listar Consultas | GET /consultas | ✅ | ✅ /paciente/consultas | ✅ Pronto |
| Cancelar Consulta | DELETE /consulta/{id} | ✅ | ✅ (botão) | ✅ Pronto |
| Recuperar Senha | POST /api/auth/forgot-password | ✅ | ✅ /recuperar-senha | ✅ Mock |
| **MÉDICO** | | | | |
| Registrar | POST /medico/register | ✅ (useCreateMedico) | ❌ (admin-only) | ⚠️ Parcial |
| Login | (compartilhado) | ✅ | ✅ | ✅ Pronto |
| Ver Consultas | GET /medico/consultas | ❌ | ❌ | ❌ Falta |
| Criar Disponibilidades | POST /medico/disponibilidades | ❌ | ❌ | ❌ Falta |
| **ADMIN** | | | | |
| Registrar | POST /admin/register | ❌ | ❌ | ❌ Falta |
| Login | (compartilhado) | ✅ | ✅ | ✅ Pronto |
| Listar Consultas | GET /admin/consultas | ✅ | ✅ | ✅ Pronto |
| Listar Médicos | GET /admin/medicos | ❌ | ❌ | ❌ Falta |
| Listar Pacientes | GET /admin/pacientes | ❌ | ❌ | ❌ Falta |
| Criar Slots | POST /admin/slots | ✅ | ✅ | ✅ Pronto |
| Listar Slots | GET /admin/slots | ✅ | ✅ | ✅ Pronto |
| Cancelar Slot | DELETE /admin/slots/{id} | ✅ | ✅ (botão) | ✅ Pronto |

---

## 🎯 Prioridade de Implementação

### 🔴 CRÍTICO (Bloqueia MVP)
1. **Paciente - Ver/Editar Perfil** — usuários precisam atualizar dados
2. **Médico - Ver Consultas** — médicos precisam saber quem tem consulta com eles
3. **Médico - Criar Disponibilidades** — médicos precisam gerenciar horários
4. **Admin - Listar Médicos/Pacientes** — admin precisa de visibilidade

### 🟡 IMPORTANTE (Melhora UX)
5. Paciente - Agendar Consulta Direta (alternativa ao fluxo de slot)
6. Admin - Registrar Admin (para multi-admin)

### 🟢 BÔNUS (Polish)
7. Mais filtros/buscas nas listas (admin)
8. Relatórios/estatísticas

---

## 💡 Recomendação de Implementação

1. **Hoje**: Paciente profile (2h)
2. **Hoje**: Médico consultas + criar disponibilidades (3h)
3. **Amanhã**: Admin listar médicos/pacientes (2h)
4. **Depois**: Polir e testar integração

**Tempo total estimado:** ~7 horas para MVP robusto
